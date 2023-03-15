/*
For listeners with an Array argument, the BufferedEmitter combines data of the
same type together in a buffer, and calls listeners of a given type only once,
when flushed.

Methods:
- emit(type, data): merges `data` to the buffer corresponding to `type`
- empty(): return whether the buffers are completely empty
- flush(recurse = true): call all listeners with buffered data, with listeners working on a cleared buffer;
   if `recurse` and listeners buffered new data themselves, flush() asynchronously calls itself until the buffer is empy.
- off(type, listener): remove `listener` from `type`; `listener` accepts only 1 arg of type Object(key -> value)
- on(type, listener): add `listener` to `type`; `listener` accepts only 1 arg of type Object(key -> value)

All methods (except .empty()) are chainable.
*/

export class BufferedEmitter {
  constructor() {
    this.listeners = new Map()  // Map(type -> Set(listener))
    this.buffers = new Map()    // Map(type -> Array(value))
  }

  emit(type, data) {
    if (!this.buffers.has(type))
      this.buffers.set(type, []);

    // buffers[type] = buffers[type].concat(data)
    this.buffers.set(type, this.buffers.get(type).concat(data))
    return this
  }

  empty() {
    return this.buffers.size == 0
  }

  flush(recurse = true) {
    // Work on a separate copy of buffers,
    // so that listeners can already begin buffering new data into a clean buffer
    const buffers = this.buffers
    this.buffers = new Map()

    this.listeners.forEach((listeners, type) => {
      if (buffers.has(type)) {
        const buffer = buffers.get(type)
        listeners.forEach(listener => {
          listener(buffer)
        })
      }
    })

    if (recurse && !this.empty())
      setTimeout(() => this.flush(true), 0);

    return this
  }

  off(type, listener) {
    this.listeners.get(type).delete(listener)
    return this
  }

  on(type, listener) {
    if (!this.listeners.has(type))
      this.listeners.set(type, new Set());

    this.listeners.get(type).add(listener)
    return this
  }
}
