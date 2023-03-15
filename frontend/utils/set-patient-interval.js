// Run a fn at its own pace
// Not faster than every `minDelay` ms
// and not faster than every 0 ms
// and certainly not faster than its own runtime
// Return function that clears the interval when called
export default function setPatientInterval(fn, minDelay = 0) {
  let lastRun = null
  let lastTimeout = null

  const wrapper = (...args) => {
    lastRun = Date.now()
    fn(...args)
    lastTimeout = setTimeout(wrapper, Math.max(0, minDelay - (Date.now() - lastRun)))
  }

  lastTimeout = setTimeout(wrapper, Math.max(minDelay))

  return () => clearTimeout(lastTimeout)
}
