/*
Keep track of unique String entries that can expire.

Methods:
- constructor(options):
   options:
  - initialTime: initial value of container time
  - lifetime: default duration of time an entry expires (same unit as argument of time())
- add(ids, lifetime=undefined): sets the expiry time of an Array of ids (or an id) to the "current time" of container plus the
   given lifetime (the container's lifetime if undefined)
- clear(): immediately expires everything inside
- expire(ids): immediately expires an Array of ids (or an id)
- has(id): return whether `id` is currently being tracked
- keys(): return iterator over ids
- size(): return how many ids are being tracked
- time(): get the "current time" of the container
- time(time): set the "current time" of the container, which could trigger a bunch of events

Events:
- add(ids, expiry): fired after new entries are added, with the expected expiry time
- refresh(ids, expiry): fired after existing entries are added again, with the expected expiry time
- expire(ids): fired after entries have expired
*/

import EventEmitter from 'eventemitter3'

class TimeoutTracker extends EventEmitter {
  constructor(options = {}) {
    super()

    this.options = {
      initialTime: 0,
      lifetime: 1000,
      ...options,
    }

    if (this.options.lifetime <= 0)
      console.warn(`TimeoutTracker: lifetime is non-positive (${this.options.lifetime})`);

    this.state = {
      time: this.options.initialTime,
      stats: {
        earliest: Infinity,
        latest: -Infinity,
      },
      expiryById: new Map(),  // id -> time (int)
      idsByExpiry: new Map(), // time (int) -> Set(id)
    }
  }

  // Recalculate this.state.stats
  _calculateStats() {
    let min = Infinity, max = -Infinity
    for (const t of this.state.idsByExpiry.keys()) {
      if (t < min) min = t;
      if (t > max) max = t;
    }
    return {earliest: min, latest: max}
  }

  // Debug function to check that this.state.stats is correct
  _validateStats() {
    const { earliest, latest } = this.state.stats

    let min = Infinity, max = -Infinity
    for (const t of this.state.idsByExpiry.keys()) {
      if (t < min) min = t;
      if (t > max) max = t;
    }

    if (earliest != min)
      console.warn(`TimeoutTracker._validateStats: stats.earliest (${earliest}) should be ${min}`);
    if (latest != max)
      console.warn(`TimeoutTracker._validateStats: stats.latest (${latest}) should be ${max}`);
  }

  add(ids, lifetime = undefined) {
    if (ids.constructor !== Array)
      ids = [ids];

    if (lifetime === undefined)
      lifetime = this.options.lifetime;

    const expiry = this.state.time + lifetime

    const { stats } = this.state
    stats.earliest = Math.min(stats.earliest, expiry)
    stats.latest = Math.max(stats.latest, expiry)

    const refreshedIds = [], addedIds = []

    const expiryById = this.state.expiryById
    const idsByExpiry = this.state.idsByExpiry
    ids.forEach(id => {
      if (expiryById.has(id)) {
        // refresh existing: delete old entries
        const oldExpiry = expiryById.get(id)
        idsByExpiry.get(oldExpiry).delete(id)
        refreshedIds.push(id)
      } else {
        addedIds.push(id)
      }
    })

    // prepare a slot for this expiry time
    if (!idsByExpiry.has(expiry))
      idsByExpiry.set(expiry, new Set());

    // add new entries
    ids.forEach(id => {
      idsByExpiry.get(expiry).add(id)
      expiryById.set(id, expiry)
    })

    if (refreshedIds.length)
      this.emit('refresh', refreshedIds, expiry);
    if (addedIds.length)
      this.emit('add', addedIds, expiry);

    this._validateStats()

    return this
  }

  clear() {
    const removedIds = Array.from(this.state.expiryById.keys())

    this.state.stats = {earliest: Infinity, latest: -Infinity}

    this.state.expiryById.clear()
    this.state.idsByExpiry.clear()

    if (removedIds.length)
      this.emit('expire', removedIds);

    return this
  }

  expire(ids) {
    if (ids.constructor !== Array)
      ids = [ids];

    const expiryById = this.state.expiryById
    const idsByExpiry = this.state.idsByExpiry

    const removedIdByExpiry = new Map()
    ids.forEach(id => {
      const expiry = expiryById.get(id)
      if (!removedIdByExpiry.has(expiry))
        removedIdByExpiry.set(expiry, new Set());
      removedIdByExpiry.get(expiry).add(id)
    })

    const {earliest, latest} = this.state.stats
    let statsChanged = false

    for (const [expiry, ids] of removedIdByExpiry.entries()) {
      ids.forEach(id => idsByExpiry.get(expiry).delete(id))
      if (!idsByExpiry.get(expiry).size) {
        // Delete this bin if empty
        idsByExpiry.delete(expiry)
        if (expiry == earliest || expiry == latest)
          statsChanged = true;
      }
    }

    if (statsChanged)
      this.state.stats = this._calculateStats();

    ids.forEach(id => expiryById.delete(id))

    if (ids.length)
      this.emit('expire', ids);

    return this
  }

  has(id) {
    return this.state.expiryById.has(id)
  }

  *keys() {
    yield* this.state.expiryById.keys()
  }

  size() {
    return this.state.expiryById.size
  }

  time(time) {
    if (time === undefined) {
      return this.state.time
    }

    this._validateStats()

    this.state.time = time

    // Save time on special cases
    if (time > this.state.stats.latest)
      this.clear();

    if (time < this.state.stats.earliest)
      return this;

    const expiredIds = []

    const idsByExpiry = this.state.idsByExpiry
    const expiryById = this.state.expiryById

    for (const [expiry, ids] of idsByExpiry.entries()) {
      if (expiry < time) {
        ids.forEach(id => {
          expiredIds.push(id)
          expiryById.delete(id)
        })
        idsByExpiry.delete(expiry)
      }
    }

    this.state.stats = this._calculateStats()

    if (expiredIds.length)
      this.emit('expire', expiredIds);

    return this
  }
}


/*
Like TimeoutTracker, but tracks objects instead of just strings.

Data types:
- dict: an Object with ids as keys and objects corresponding to that id as values; used for input/output
- map: a JS Map; used internally

Methods:
- constructor(options):
   options: are passed through to TimeoutTracker
- add(dict, lifetime=undefined): sets the expiry time of entries in a `dict` to the "current time" of container plus `lifetime`
   (the container's lifetime if undefined)
- clear(): immediately expires everything inside
- dict(): return the contents of the container as a plain old Object
- entries(): return iterator on [id, obj] pairs
- expire(ids): immediately expires an Array of ids (or an id)
- get(id): return obj corresponding to `id`
- has(id): return whether whether `id` is in this container
- keys(): return iterator on [id]
- set(id, obj): equivalent to add({[id]: obj})
- size(): return how many objects are being tracked
- values(): return iterator on [obj]
- time(): get the "current time" of the container
- time(time): set the "current time" of the container, which could trigger a bunch of events

Events:
- add(dict, expiry): fired after new entries are added
- refresh(dict, expiry): fired after existing entries are added again
- change(dict): fired after existing entries have their value changed
- expire(dict): fired after entries have expired and been deleted
*/

class TimedContainer extends EventEmitter {
  constructor(options = {}) {
    super()

    this.options = {
      ...options,
    }

    this.state = {
      tracker: new TimeoutTracker(this.options),
      map: new Map(),  // objects by id
    }

    this.state.tracker.on('add', (ids, expiry) => {
      this.emit('add', this._idsToDict(ids), expiry)
    })

    this.state.tracker.on('refresh', (ids, expiry) => {
      this.emit('refresh', this._idsToDict(ids), expiry)
    })

    this.state.tracker.on('expire', (ids) => {
      const thisMap = this.state.map

      const expiredDict = this._idsToDict(ids)
      ids.forEach(id => thisMap.delete(id))

      this.emit('expire', expiredDict)
    })
  }

  // Return a dict containing `ids` as keys and their corresponding Objects as values
  _idsToDict(ids) {
    const thisMap = this.state.map
    const dict = {}

    ids.forEach(id => dict[id] = thisMap.get(id))

    return dict
  }

  add(dict, lifetime = undefined) {
    const changedIds = []

    const thisMap = this.state.map
    Object.entries(dict).forEach(([id, obj]) => {
      if (thisMap.has(id) && thisMap.get(id) !== obj)
        changedIds.push(id);

      thisMap.set(id, obj)
    })

    if (changedIds.length)
      this.emit('change', changedIds);

    this.state.tracker.add(Object.keys(dict), lifetime)

    return this
  }

  clear() {
    this.state.tracker.clear()
    return this
  }

  dict() {
    // return Object.fromEntries(this.state.map.entries())  // ES2019
    const dict = {}

    for (const [key, value] of this.state.map.entries())
      dict[key] = value;

    return dict
  }

  *entries() {
    yield* this.state.map.entries()
  }

  expire(ids) {
    this.state.tracker.expire(ids)
    return this
  }

  get(id) {
    return this.state.map.get(id)
  }

  has(id) {
    return this.state.map.has(id)
  }

  *keys() {
    yield* this.state.map.keys()
  }

  set(id, obj) {
    return this.add({[id]: obj})
  }

  size() {
    return this.state.map.size
  }

  *values() {
    yield* this.state.map.values()
  }

  time(time = undefined) {
    if (time === undefined) {
      return this.state.tracker.time()
    } else {
      this.state.tracker.time(time)
      return this
    }
  }
}

export { TimeoutTracker, TimedContainer }