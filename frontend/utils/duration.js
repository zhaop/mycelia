export const str(duration) {
  const units = [
    ['y', 365 * 86400 * 1000],
    ['d', 86400 * 1000],
    ['h', 3600 * 1000],
    ['m', 60 * 1000],
    ['s', 1000],
  ]

  let str = ''

  units.forEach(([u, len]) => {
    if (u === units[units.length - 1][0]) {
      str += `${duration / len}${u} `
    } else if (duration > len) {
      str += `${Math.floor(duration / len)}${u} `
      duration %= len
    }
  })

  return str
}
