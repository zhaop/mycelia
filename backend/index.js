const events = require('events')
const querystring = require('querystring')
const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const { RingBuffer } = require('./ring-buffer')
const { StreamConfig } = require('./config')
const { HttpCsvStreamer } = require('./http-csv-streamer')
const io = require('socket.io')


// Serve static files
const serveFile = (response, url) => {
  const mimeTypes = {
    'default': 'application/octet-stream',
    '.css': 'text/css',
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.map': 'application/json',
    '.png': 'image/png',
  }

  const webRoot = path.join(__dirname, "../dist")
  const realPath = path.join(webRoot, url)

  if (realPath.startsWith(webRoot)) {
    fs.readFile(realPath, (err, data) => {
      if (err) {
        response.writeHead(404)
        response.end(err.message)
      } else {
        let ext = path.extname(realPath)
        if (!(ext in mimeTypes)) ext = 'default';

        response.writeHead(200, {'Content-Type': mimeTypes[ext]})
        response.end(data)
      }
    })
  } else {
    response.writeHead(403)
    response.end()
  }
};

const app = http.createServer((request, response) => {
  if (request.url === "/") {
    serveFile(response, "index.html");
  } else {
    serveFile(response, request.url);
  }
});


// Stream results from HTTP endpoint
const connStream = new HttpCsvStreamer({
  ...StreamConfig,
  transform: (val, col) => {
    if (!val || val == '-')
      return null;

    switch (col) {
    case 'duration':
      return parseFloat(val)
      break
    case 'id.orig_p':
    case 'id.resp_p':
    case 'inner_vlan':
    case 'orig_bytes':
    case 'orig_ip_bytes':
    case 'orig_pkts':
    case 'resp_bytes':
    case 'resp_ip_bytes':
    case 'resp_pkts':
    case 'vlan':
      return parseInt(val, 10)
      break
    case 'ts':
      // Parses floats as seconds, or datetime strings into seconds
      return /^[+-]?[0-9]+(\.[0-9]+)?$/.test(val)
        ? parseFloat(val)
        : (new Date(val)).getTime() / 1e3
      break
    default:
      return val
    }
  }
})

const flowStream = new events.EventEmitter()

connStream.start()
connStream.on('data', flows => {
  // Turn into client-side Flow objects
  flowStream.emit('data', flows.map(flow => ({
    id: flow['uid'],
    start: 1000 * flow['ts'],
    end: 1000 * (flow['ts'] + flow['duration']),
    srcIp: flow['id.orig_h'],
    srcName: flow['orig'] || flow['id.orig_h'] || '',
    dstIp: flow['id.resp_h'],
    dstName: flow['resp'] || flow['id.resp_h'] || '',
    proto: flow['proto'],
    srcPort: flow['id.orig_p'],
    dstPort: flow['id.resp_p'],
    srcBytes: flow['orig_bytes'] || flow['orig_ip_bytes'] || 0,
    dstBytes: flow['resp_bytes'] || flow['resp_ip_bytes'] || 0,
    srcPkts: flow['orig_pkts'],
    dstPkts: flow['resp_pkts'],
  })))
})
connStream.on('error', er => console.error(er))
connStream.on('end', () => console.log('conn stream ended'))


class ClientSession {
  constructor(socket, flowBuffer) {
    this.socket = socket
    this.streaming = false

    this.flowBuffer = flowBuffer
    this.numFlowsUnsent = flowBuffer.size()
  }

  // Idempotent
  flushFlows(filter = null) {
    if (this.streaming) {
      let toSend = Array.from(flowBuffer.tail(this.numFlowsUnsent))
      if (filter)
        toSend = toSend.filter(filter);

      this.socket.emit('flows', toSend, () => {
        this.numFlowsUnsent = 0
      })
    }
  }
}

const clientSessions = new Map()

const flowBuffer = new RingBuffer(1e7)

flowStream.on('data', flows => {
  flowBuffer.concat(flows)

  for (clientState of clientSessions.values()) {
    clientState.numFlowsUnsent += flows.length
    clientState.flushFlows()
  }
})

// Communicate with socket clients
const appSocket = io(app);

appSocket.on("connection", socket => {
  const clientTag = `${socket.client.conn.remoteAddress} [${socket.client.conn.id}]`
  console.log(`${clientTag} connected`)

  // Client-specific state stored here
  const clientId = socket.client.conn.id
  const clientState = new ClientSession(socket, flowBuffer)
  clientSessions.set(clientId, clientState)

  const untilDisconnect = (eventEmitter, eventName, listener) => {
    eventEmitter.on(eventName, listener)
    socket.once('disconnect', () => eventEmitter.removeListener(eventName, listener))
  }

  socket.on('startStreaming', (since = 0) => {
    console.log(`${clientTag} > startStreaming`)
    clientState.streaming = true
    if (since === 0)
      clientState.flushFlows();
    else
      clientState.flushFlows(flow => flow.end >= since);
  })

  socket.on('stopStreaming', () => {
    console.log(`${clientTag} > stopStreaming`)
    clientState.streaming = false
  })

  socket.once('disconnect', reason => {
    clientSessions.delete(clientId)
    console.log(`${clientTag} disconnected (reason: ${reason}); ${clientSessions.size} client(s) still connected`)
  })
});

const port = process.env.PORT || 8080;
app.listen(port);
console.log("Server running on port", port);