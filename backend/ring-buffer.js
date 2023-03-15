/*
Append-only Array with limited capacity that "forgets" the oldest elements, iterable from beginning

Methods:
- constructor(capacity): construct a RingBuffer with given `capacity`
- capacity(): return array capacity
- concat(iter): append all elements of iterator `iter` in iteration order; return this
- clear(): delete all contents; return this
- push(val): append value; return this
- size(): return number of elements in array

Iterators:
- [Symbol.iterator](): return iterator on entire RingBuffer, from oldest element it "remembers" to newest
- tail(n = 1): return iterator on `min(n, size)`-last elements of RingBuffer; any non-positive `n` iterates over nothing
*/

class RingBuffer {
  constructor(capacity) {
    if (!Number.isInteger(capacity) || !(capacity > 0))
      throw `RingBuffer capacity must be a positive non-zero integer (not ${typeof capacity} ${capacity})`

    this._capacity = capacity
    this._full = false  // true if size == capacity
    this._idx = 0 // index of element after newest element

    this.clear()
  }

  capacity() {
    return this._capacity
  }

  concat(iter) {
    for (const val of iter)
      this.push(val);

    return this
  }

  clear() {
    this._buffer = new Array(this._capacity)
    this._full = false
    this._idx = 0
    return this
  }

  push(val) {
    this._buffer[this._idx] = val

    ++this._idx
    if (this._idx == this._capacity) {
      this._full = true
      this._idx = 0
    }

    return this
  }

  size() {
    return this._full ? this._capacity : this._idx
  }

  *[Symbol.iterator]() {
    yield* this.tail(this.size())
  }

  *tail(N = 1) {
    if (!Number.isInteger(N))
      throw `RingBuffer.tail must be called on an integer (not ${typeof N} ${N})`

    if (N <= 0)
      return;

    const {_buffer, _capacity, _full} = this

    N = Math.min(N, this.size())

    let n = 0

    let i = this._idx - N
    if (i < 0)
      i += this._capacity

    if (_full) {
      for (; n < N && i < _capacity; ++n, ++i)
        yield _buffer[i];
      i = 0
    }

    for (; n < N && i < this._idx; ++n, ++i)
      yield _buffer[i];
  }

  static test() {
    let passed = true

    const test = (name, result, expected) => {
      result = JSON.stringify(result)
      expected = JSON.stringify(expected)
      if (result != expected) {
        console.warn(`${name} failed: ${result} !== ${expected}`)
        passed = false
      }
    }

    let r = new RingBuffer(4)
    test(0.1, Array.from(r), [])
    test(0.2, Array.from(r.tail(0)), [])
    test(0.3, Array.from(r.tail(1)), [])
    test(0.4, Array.from(r.tail(5)), [])
    test(0.5, r.size(), 0)
    test(0.6, r.capacity(), 4)

    // Push
    test(1.1, r.push(1), r)
    test(1.2, r.size(), 1)
    test(1.3, r.capacity(), 4)
    test(2.1, r.push(2), r)
    test(2.2, r.size(), 2)
    test(2.3, r.capacity(), 4)
    test(3.1, Array.from(r), [1, 2])
    test(3.2, Array.from(r.tail(0)), [])
    test(3.3, Array.from(r.tail(1)), [2])
    test(3.4, Array.from(r.tail(2)), [1, 2])
    test(3.5, Array.from(r.tail(3)), [1, 2])
    test(3.6, Array.from(r.tail(5)), [1, 2])

    // Concat
    test(4, r.concat([3, 4, 5]), r)
    test(5.1, r.size(), 4)
    test(5.2, r.capacity(), 4)
    test(6.1, Array.from(r), [2, 3, 4, 5])
    test(6.2, Array.from(r.tail(0)), [])
    test(6.3, Array.from(r.tail(1)), [5])
    test(6.4, Array.from(r.tail(2)), [4, 5])
    test(6.5, Array.from(r.tail(3)), [3, 4, 5])
    test(6.6, Array.from(r.tail(4)), [2, 3, 4, 5])
    test(6.7, Array.from(r.tail(5)), [2, 3, 4, 5])

    // Concat with argument longer than capacity
    test(7, r.concat([6, 7, 8, 9, 10]), r)
    test(8.1, r.size(), 4)
    test(8.2, r.capacity(), 4)
    test(9.1, Array.from(r), [7, 8, 9, 10])
    test(9.2, Array.from(r.tail(0)), [])
    test(9.3, Array.from(r.tail(1)), [10])
    test(9.4, Array.from(r.tail(2)), [9, 10])
    test(9.5, Array.from(r.tail(3)), [8, 9, 10])
    test(9.6, Array.from(r.tail(4)), [7, 8, 9, 10])
    test(9.7, Array.from(r.tail(5)), [7, 8, 9, 10])

    // Clear
    test(10.1, r.clear(), r)
    test(10.2, r.size(), 0)
    test(10.3, r.capacity(), 4)
    test(10.4, Array.from(r), [])

    // Concat after clear
    test(11, r.concat([1, 2, 3, 4, 5, 6]), r)
    test(12.1, Array.from(r), [3, 4, 5, 6])
    test(12.2, Array.from(r.tail(3)), [4, 5, 6])

    return passed
  }
}

module.exports = {
  RingBuffer: RingBuffer,
}