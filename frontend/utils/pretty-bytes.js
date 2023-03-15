// Output a number in [0, 1000) with fixed number of `digits` after decimal point,
// followed by the appropriate SI unit
// (except for numbers greater than 1e27)
export default function prettyBytes (bytes, digits = 1, space = true) {
  let sgn
  [sgn, bytes] = (bytes >= 0) ? [1, bytes] : [-1, -bytes]

  const prefixes = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
  let i = 0
  while (bytes >= 1e3 && i < prefixes.length - 1) {
    bytes /= 1e3
    ++i
  }

  space = space ? ' ' : ''

  bytes *= sgn
  return `${+bytes.toFixed(digits)}${space}${prefixes[i]}B`
}

prettyBytes.short = (bytes, digits = 1) => prettyBytes(bytes, digits, false)
