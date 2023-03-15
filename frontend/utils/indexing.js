/*
Keeps track of keys of values, indexed by a key, and when the key disappears. A value can only belong to one group.

Methods:
- constructor()
- delete(key): delete `key`
  O(V) time, V = number of values in `key`
- find(value): return `key` associated with `value`
  O(1) time
- get(key): return Set of values in `key`, or undefined if inexistent `key`
  O(1) time
- has(key): return true if this has `key`, otherwise false
  O(1) time
- index(key, value): keep track of new `value` in `key`, return whether a new key was created
  O(1) time
- keys(): return iterator over all keys
- toString(): return human-readable dump
  O(N) time, N = total number of values stored in here
- unindex(value): remove `value` from its key; if its key was also deleted, return its name, else return null
  O(1) time
*/

export class ManyByOneIndex {
  constructor() {
    this.forward = new Map()  // Map(key => Set(value))
    this.reverse = new Map()  // Map(value => key)
  }

  delete(key) {
    const {forward, reverse} = this
    forward.get(key).forEach(value => reverse.delete(value))
    return forward.delete(key)
  }

  find(value) {
    return this.reverse.get(value)
  }

  get(key) {
    return this.forward.get(key)
  }

  has(key) {
    return this.forward.has(key)
  }

  index(key, value) {
    const {forward, reverse} = this
    let keyCreated = false

    if (!forward.has(key)) {
      forward.set(key, new Set())
      keyCreated = true
    }

    forward.get(key).add(value)

    if (reverse.has(value))
      throw new Error(`ManyByOneIndex cannot index value "${value}" under "${key}": already indexed under "${reverse.get(value)}".`);

    reverse.set(value, key)

    return keyCreated
  }

  *keys() {
    yield* this.forward.keys()
  }

  toString() {
    const obj = {}

    for (const [key, values] of this.forward)
      obj[key] = Array.from(values);

    return JSON.stringify(obj)
  }

  unindex(value) {
    const {forward, reverse} = this

    const key = reverse.get(value)
    reverse.delete(value)
    forward.get(key).delete(value)

    if (!forward.get(key).size) {
      forward.delete(key)
      return key
    }

    return null
  }
}

/*
Keeps track of a set of directed relations from a 'key' domain to a 'value' domain, where
each 'value' can have multiple 'keys', and each 'key' multiple 'values'.
(Like a bipartite graph.)

Methods:
- constructor()
- delete(key): delete `key` and all values associated with `key`
- find(value): return set of `key`s that point to `value`
- get(key): return set of `value`s that point to `key`
- has(key): return true if this has `key`, otherwise false
- index(key, value): introduce a new relation from `key` to `value`, return whether a new `key` was created
- keys(): return iterator over all keys
- toString(): return human-readable dump
- unindex(key, value): remove the `key` to `value` relation; return true if `key` no longer has any values, false otherwise
- values(): return iterator over all values
*/
export class ManyByManyIndex {
  constructor() {
    this.forward = new Map() // Map(key => Set(value))
    this.reverse = new Map() // Map(value => Set(key))
  }

  delete(key) {
    const {forward, reverse} = this

    forward.get(key).forEach(value => {
      reverse.get(value).delete(key)

      if (!reverse.get(value).size)
        reverse.delete(value);
    })

    return forward.delete(key)
  }

  find(value) {
    return this.reverse.get(value)
  }

  get(key) {
    return this.forward.get(key)
  }

  has(key) {
    return this.forward.has(key)
  }

  index(key, value) {
    const {forward, reverse} = this
    let keyCreated = false

    if (!forward.has(key)) {
      forward.set(key, new Set())
      keyCreated = true
    }

    forward.get(key).add(value)

    if (!reverse.has(value))
      reverse.set(value, new Set());

    reverse.get(value).add(key)

    return keyCreated
  }

  *keys() {
    yield* this.forward.keys()
  }

  toString() {
    const obj = {}

    for (const [key, values] of this.forward)
      obj[key] = Array.from(values);

    return obj
  }

  unindex(key, value) {
    const {forward, reverse} = this

    forward.get(key).delete(value)
    reverse.get(value).delete(key)

    if (!reverse.get(value).size)
      reverse.delete(value);

    if (!forward.get(key).size) {
      forward.delete(key)
      return true
    }

    return false
  }

  *values() {
    yield* this.reverse.keys()
  }
}

export function filter(obj, predicate) {
  // obj: Object indexed by their key
  // predicate: Boolean function on items in obj
  // return: Object obj with only items where predicate(item) is true
  let result = {}

  for (let key in obj) {
    if (obj.hasOwnProperty(key) && predicate(obj[key])) {
      result[key] = obj[key]
    }
  }

  return result
}

export function isEmpty(obj) {
  for (let i in obj) {
    return false;
  }
  return true;
}

export function keep(obj, keysToKeep) {
  // obj: Object indexed by their key
  // keysToKeep: Set
  // return: Object with only keys in keysToKeep
  let kept = {}
  Object.keys(obj)
    .filter (key => keysToKeep.has(key))
    .forEach(key => kept[key] = obj[key])
  return kept
}

export function partition(haystack, needles) {
  // haystack: Array
  // needles: Set
  // return: [keep(haystack, needles), exclude(haystack, needles)]
  let kept = [], excluded = []
  haystack.forEach(item => {
    if (needles.has(item))
      kept.push(item);
    else
      excluded.push(item);
  })
  return [kept, excluded]
}

export function upsert(obj, newItems) {
  // obj: Object indexed by their key
  // newItems: Array of Objects with a ".id" field
  // return: Object obj with items updated or added from newItems
  let result = clone(obj)
  newItems.forEach(item => {
    if (!isEqual(item, result[item.id])) {
      result[item.id] = item
    }
  })
  return result
}
