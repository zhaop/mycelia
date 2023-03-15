import clone from 'lodash/clone'
import { filter, isEmpty } from './indexing'

export class Diff {
  constructor() {
    this.clear()
  }

  // add(dict): add multiple items, with dict = Object(key => value)
  add(dict) {
    Object.entries(dict).forEach(([key, value]) => this.addOne(key, value))
    return this
  }

  // Add a single item
  // addOne(key, value)
  addOne(key, value) {
    if (key in this.removed) {
      if (value != this.removed[key])
        this.changed[key] = value;

      delete this.removed[key]

    } else if (key in this.changed) {
      throw new Error(`Diff cannot add object with key ${key} because it was already changed`)

    } else if (key in this.added) {
      throw new Error(`Diff cannot add object with key ${key} because it was already added`)

    } else {
      this.added[key] = value
    }

    return this
  }

  apply(diff) {
    // Assumes diff is consistent
    return this.remove(diff.removed).add(diff.added).change(diff.changed)
  }

  // change(dict): change multiple items, with dict = Object(key => value)
  change(dict) {
    Object.entries(dict).forEach(([key, value]) => this.changeOne(key, value))
    return this
  }

  // Change a single item
  // changeOne(key, value)
  changeOne(key, value) {
    if (key in this.removed) {
      throw new Error(`Diff cannot change object with key ${key} because it was already removed`)

    } else if (key in this.added) {
      this.added[key] = value

    } else {
      this.changed[key] = value
    }

    return this
  }

  // Reset to an empty Diff
  clear() {
    this.removed = {}
    this.changed = {}
    this.added = {}
  }

  // Return true if this Diff is entirely empty, false otherwise
  isEmpty() {
    for (const i in this.removed)
      return false;
    for (const i in this.changed)
      return false;
    for (const i in this.added)
      return false;
    return true;
  }

  // remove(dict): remove multiple items, with dict = Object(key => value)
  remove(dict) {
    Object.entries(dict).forEach(([key, value]) => this.removeOne(key, value))
    return this
  }

  // Remove a single item
  // removeOne(key, value)
  removeOne(key, value) {
    if (key in this.removed) {
      throw new Error(`Diff cannot remove object with key ${key} because it was already removed`)

    } else if (key in this.changed) {
      delete this.changed[key]
      this.removed[key] = value

    } else if (key in this.added) {
      delete this.added[key]

    } else {
      this.removed[key] = value
    }

    return this
  }

  toObj() {
    return {removed: this.removed, changed: this.changed, added: this.added}
  }
}

function _exclude(haystack, needles) {
  // haystack: Array
  // needles: Set
  // return: Array of items in haystack & not needles (could be === haystack)
  if (!needles.size) return haystack;
  return haystack.filter(x => !needles.has(x))
}

function _keep(haystack, needles) {
  // haystack: Array
  // needles: Set
  // return: Array of items in haystack & needles
  if (!needles.size) return [];
  return haystack.filter(x => needles.has(x))
}

export function diff(a, b, equality = undefined) {
  // a, b: Objects indexed by their key
  // equality: (a, b) => Boolean, return whether (a, b) are equal; if undefined, uses strict equality (===)
  // return: {
  //   removed: Object of items from a, that are not in b
  //   changed: Object of items from b, that are also in a but are not equal (according to equality function)
  //   added: Object of items from b, that are not in a
  // }
  const result = {removed: {}, changed: {}, added: {}}

  const areEqual =
    (equality === undefined)
    ? id => a[id] !== b[id]
    : id => !equality(a[id], b[id])

  if (a === b)
    return result;

  const aKeys = Object.keys(a), bKeys = Object.keys(b)
  const aKeySet = new Set(aKeys), bKeySet = new Set(bKeys)

  _exclude(aKeys, bKeySet).forEach(id => result.removed[id] = a[id])

  ;(aKeys.length < bKeys.length
    ? _keep(aKeys, bKeySet).filter(areEqual)
    : _keep(bKeys, aKeySet).filter(areEqual)
  ).forEach(id => result.changed[id] = b[id])

  _exclude(bKeys, aKeySet).forEach(id => result.added[id] = b[id])

  return result
}

// Let domain & codomain be two Objects-containing-values-of-same-type.
// Given:
//   diff       a diff on the domain (= the first collection),
//   codomain   the codomain (= the second collection),
//   map.key    a way to map keys from domain to codomain (default: identity),
//   map.value  a way to map values from domain to codomain (default: identity),
// mapDiff outputs a new diff on the codomain, which when applied,
// transforms the codomain as if "diff" were first applied to the domain,
// then the changes applied to the codomain via (map.key, map.value).
// TODO Simplify this comment
export function mapDiff(diff, codomain, maps) {
  const identity = a => a
  const {key: keyMap = identity, value: valueMap = identity} = maps

  return {
    removed: Object.assign({}, ...Object.keys(diff.removed).map(keyMap).map(
      key => ({[key]: codomain[key]})
    )),
    changed: Object.assign({}, ...Object.keys(diff.changed).map(keyMap).map(
      key => ({[key]: codomain[key]})
    )),
    added: Object.assign({}, ...Object.entries(diff.added).map(([key, value]) => ({
      [keyMap(key)]: valueMap(value)
    }))),
  }
}

// Return new diff with items filtered according to predicate
export function filterDiff(diff, predicate) {
  return {
    removed: filter(diff.removed, predicate),
    changed: filter(diff.changed, predicate),
    added: filter(diff.added, predicate),
  }
}

// Return new items with diff applied (without mutating original), and runs callbacks when applicable
export function applyDiffPure(items, diff, callbacks) {
  const noop = () => {}
  const {exit = noop, enter = noop, change = noop} = callbacks || {}

  if (!isEmpty(diff.removed)) {
    exit(diff.removed, items)

    const removed = new Set(Object.keys(diff.removed))
    items = filter(items, key => !removed.has(key))
  }

  if (!isEmpty(diff.added)) {
    items = Object.assign({}, items, diff.added)

    enter(diff.added, items)
    change(diff.added, items)
  }

  if (!isEmpty(diff.changed)) {
    items = Object.assign({}, items, diff.changed)

    change(diff.changed, items)
  }

  return items
}

// Return `items` with diff applied (in-place), and runs callbacks when applicable
// callbacks = {exit: (removed, allItems) => {}, change: (changed, allItems) => {}, enter: (added, allItems) => {}}
export function applyDiff(items, diff, callbacks) {
  const noop = () => {}
  const {exit = noop, enter = noop, change = noop} = callbacks || {}

  if (!isEmpty(diff.removed)) {
    exit(diff.removed, items)

    Object.keys(diff.removed).forEach(key => delete items[key])
  }

  if (!isEmpty(diff.added)) {
    Object.assign(items, diff.added)

    enter(diff.added, items)
    change(diff.added, items)
  }

  if (!isEmpty(diff.changed)) {
    Object.assign(items, diff.changed)

    change(diff.changed, items)
  }

  return items
}