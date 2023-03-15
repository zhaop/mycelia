/*

"Stream" the results of a HTTP CSV endpoint as an Array of Objects.

Methods:
- constructor(options):
   options:
  - protocol: 'http', 'https'
  - host: string
  - port: int
  - path: string
  - auth: parameter to http[s].request({auth: ...})
  - request: Object with other params to pass through to http.request/https.request
  - data: Object with key-value pairs to send to the host
  - transform: (value, column) -> newValue, how each value should be transformed
    (column is string, from header row of CSV)
  - parser: Object with other params to pass through to csv parser
  - debounce: only emit data that are more than this many seconds apart
- start(): send query & start streaming results
- stop(): cut the connection & stop streaming results

Events:
- data(data): fired when data is available
- end(): fired when the stream will no longer emit any new data
- error(error): fired when an error occurred
*/

const events = require('events')
const http = require('http')
const https = require('https')
const querystring = require('querystring')
const csvParse = require('csv-parse')

class HttpCsvStreamer extends events.EventEmitter {
  constructor(options = {}) {
    super()

    this.options = {
      protocol: 'http',
      host: 'localhost',
      port: 8000,
      path: '/',
      auth: null,
      request: {},
      data: {},
      transform: (value, column) => value,
      parser: {},
      debounce: 0.05,
      ...options
    }

    this.state = {
      req: null,
      res: null,
      debouncer: {
        buffer: [],
        timeout: null,
      }
    }
  }

  // Debounce & emit 'data' events (inspired by underscore's _.debounce)
  // Because csv-parse seems to emit a 'data' event for every row, wait a bit and collect them into a buffer before outputting
  _debounceOutput(data) {
    const debouncer = this.state.debouncer

    const later = () => {
      if (debouncer.buffer.length)
        this.emit('data', debouncer.buffer);

      debouncer.buffer = []
      debouncer.timeout = null
    }

    clearTimeout(debouncer.timeout)
    debouncer.buffer.push.apply(debouncer.buffer, data)
    debouncer.timeout = setTimeout(later, this.options.debounce)
  }

  start() {
    const httpModules = {'http': http, 'https': https}
    if (!(this.options.protocol in httpModules))
      throw `${this.options.protocol} is not http or https.`;

    const httpModule = httpModules[this.options.protocol]

    this.state.req = httpModule.request({
      method: 'POST',
      protocol: this.options.protocol + ':',
      host: this.options.host,
      port: this.options.port,
      path: this.options.path,
      auth: this.options.auth,
      ...this.options.request,
    }, res => {
      this.state.res = res

      const { statusCode } = res
      if (statusCode !== 200) {
        this.emit('error', new Error(`Request status code not 200 (${statusCode})`))
        this.emit('end')
        return
      }

      res.setEncoding('utf8')

      const parser = csvParse({
        delimiter: ',',
        quote: '"',
        trim: true,
        skip_empty_lines: true,
        columns: true,
        cast: (value, context) => this.options.transform(value, context.column),
        ...this.options.parser,
      })

      res.on('data', d => {
        parser.write(d)
      })

      parser.on('readable', () => {
        let record, output = []
        while (record = parser.read())
          output.push(record);
        this._debounceOutput(output)
      })

      parser.on('error', err => {
        this.emit('error', new Error('CSV parser: ' + err.message))
      })

      res.on('end', () => {
        parser.end()
        this.emit('end')
      })
    })

    this.state.req.write(querystring.stringify(this.options.data))

    this.state.req.on('error', err => {
      this.emit('error', new Error('Request failed: ' + err.message))
      this.emit('end')
    })

    this.state.req.end()

    return this
  }

  stop() {
    this.state.res.destroy()

    return this
  }
}

module.exports = {
  HttpCsvStreamer: HttpCsvStreamer,
}