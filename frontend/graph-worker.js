import ipaddr from 'ipaddr.js'
import throttle from 'lodash/throttle'
import 'regenerator-runtime/runtime'
import io from 'socket.io-client'
import { FlowGraph } from './flow-graph'
import { compileYas } from './compile-yas'
import { Diff } from './utils/diffing'
import { Range } from './utils/range'
import setPatientInterval from './utils/set-patient-interval'

const socket = io(location.host)

const send = (type, ...data) => {
  return postMessage([type, ...data])
}

const sum = arr => arr.reduce((a, b) => a + b, 0)

const flowGraph = new FlowGraph()

const globals = {}
console.log(globals)
globals.flowGraph = flowGraph

// Outbox for graph changes to frontend
const graphBuffer = {
  nodes: new Diff(),
  edges: new Diff(),
}

// Inbox for flows from backend
let flowBuffer = []

// Ratchet to request only future flows from backend
// (Assumes time only ever moves forward, i.e. no historical browsing)
let newestFlowStart = -Infinity

// Send some arbitrary time reference to visualization at the beginning
let timeReferenceSent = false

// Process flow buffer at own pace
const processFlowBuffer = () => {
  if (!flowBuffer.length) {
    return
  }

  // Update newestFlowStart
  flowBuffer.forEach(flow => {
    if (flow.start > newestFlowStart)
      newestFlowStart = flow.start;
  })

  if (!timeReferenceSent) {
    let t = Infinity
    for (const flow of flowBuffer)
      if (flow.end < t)
        t = flow.end;

    if (isFinite(t)) {
      console.log('setting time reference to', new Date(t))
      send('timeReference', t)
      timeReferenceSent = true
    }
  }

  const changes = flowGraph.addFlows(flowBuffer)
  graphBuffer.nodes.apply(changes.nodes)
  graphBuffer.edges.apply(changes.edges)
  sendGraphBuffer()

  flowBuffer = []
}

setPatientInterval(processFlowBuffer, 10)

// Wire up communications with backend
socket.on('connect', () => socket.emit('startStreaming', 0))
socket.on('reconnect', () => socket.emit('startStreaming', newestFlowStart))

socket.on('flows', (flows, ack) => {
  ack()
  flowBuffer = flowBuffer.concat(flows)
})

const noChanges = 'nodes -0 +0 m0, edges -0 +0 m0'
const changesStr = changes => (
    `nodes -${Object.keys(changes.nodes.removed).length} +${Object.keys(changes.nodes.added).length} m${Object.keys(changes.nodes.changed).length}, `
  + `edges -${Object.keys(changes.edges.removed).length} +${Object.keys(changes.edges.added).length} m${Object.keys(changes.edges.changed).length}`
)

const parseFilter = filter => {
  if (filter == "")
    return null;

  const compiled = compileYas(filter)
  console.log('compileYas', compiled)

  const envVal = (flow, v) => {
    switch (v) {
      case 'bytes':
        return new Set([flow.srcBytes, flow.dstBytes])
      case 'duration':
        return flow.end - flow.start
      case 'packets':
        return new Set([flow.srcPkts, flow.dstPkts])
      case 'ports':
        return new Set([flow.srcPort, flow.dstPort])
      case 'tcp':
        return flow.proto == 'tcp'
      case 'udp':
        return flow.proto == 'udp'
    }
  }

  const runtime = (fn, vars) => flow => {
    const env = {}
    for (const v of vars)
      env[v] = envVal(flow, v);
    return fn(env)
  }

  if (compiled) {
    return runtime(compiled.fn, compiled.vars)
  } else {
    console.warn('Compiling YAS failed')
    return null
  }
}

// "Buffers" for communication with frontend
let requestedRange = flowGraph.range
let requestedRangeChanged = false

let requestedFilter = flowGraph.filter
let requestedFilterChanged = false

const processGraphRequests = () => {
  if (!(requestedRangeChanged || requestedFilterChanged)) {
    return
  }

  if (requestedFilterChanged) {
    const filterFn = parseFilter(requestedFilter)
    const changes = flowGraph.setFilter(filterFn)
    graphBuffer.nodes.apply(changes.nodes)
    graphBuffer.edges.apply(changes.edges)
    requestedFilterChanged = false
  }

  if (requestedRangeChanged) {
    const changes = flowGraph.setRange(requestedRange)
    graphBuffer.nodes.apply(changes.nodes)
    graphBuffer.edges.apply(changes.edges)
    requestedRangeChanged = false
  }

  sendGraphBuffer()
}

setPatientInterval(processGraphRequests, 10)

const onFilter = filter => {
  if (requestedFilter != filter) {
    requestedFilter = filter
    requestedFilterChanged = true
  }
}

const onRange = (t0, t1) => {
  const newRange = new Range(t0, t1)
  if (!requestedRange.equals(newRange)) {
    requestedRange = newRange
    requestedRangeChanged = true
  }
}

const sendGraphBuffer = throttle(() => {
  if (!graphBuffer.nodes.isEmpty() || !graphBuffer.edges.isEmpty())
    send('graphDiff', {nodes: graphBuffer.nodes, edges: graphBuffer.edges});

  // if (changesStr(graphBuffer) != noChanges)
  //   console.log(`sent ${changesStr(graphBuffer)}`)

  graphBuffer.nodes.clear()
  graphBuffer.edges.clear()
}, 1)

// Messages from main thread
onmessage = ev => {
  const [type, ...data] = ev.data

  const handlers = {
    'filter': onFilter,
    'range': onRange,
  }

  if (type in handlers) {
    handlers[type](...data)
  } else {
    console.warn(`Received unsupported message type "${type}" with data`, data)
  }
}
