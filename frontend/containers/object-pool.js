export default class ObjectPool {
  // Keeps object IDs
  constructor(settings) {
    const { initSize = 1000, clean = obj => obj } = settings
    this.clean = clean

    this.maxId = 0
    this.pool = []

    for (let i = 0; i < initSize; ++i) {
      this.put(this._create())
    }
  }

  _create() {
    const obj = {}
    this.clean(obj)
    obj._poolId = ++this.maxId
    return obj
    // return {id: ++this.maxId, path: [], f: 0.0, timeFirst: 0, duration: 0}
  }

  take() {
    if (this.pool.length) {
      return this.pool.pop()
    } else {
      return this._create()
    }
  }

  put(obj) {
    this.pool.push(obj)
  }
}
