const streamConfig = {
  protocol: 'http',
  host: 'localhost',
  port: 8000,
  path: '',
  auth: null, // string 'user:password' in cleartext; HTTP Authorization header computed from this
  parser: {
    delimiter: '\t',
    quote: '"',
    columns: true,
  },
}

module.exports = {
  StreamConfig: streamConfig
}
