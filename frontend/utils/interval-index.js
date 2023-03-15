import isEqual from 'lodash/isEqual'
import { OrderedSet } from '../containers/ordered-set'
import { ManyByOneIndex } from './utils/indexing'

/*
Keeps track of values indexed by an interval [start, end]. Has nice functions for windowed selections based on start & end.
Intervals include start & end (i.e. are closed).

Methods:
- constructor()
- diff(prev, now): return {removed: Set(<interval.id>, ...), added: Set(<interval.id>, ...)}
  removed: ids of intervals that contain `prev` but not `now`
  added: ids of intervals that contain `now` but not `prev`
- expire(end): remove & return [...ids] of all `ids` with end time strictly before `end`
- index(start, end, id): add an entry to this; return this
- indexMany([...entries]): add `entries` to container, return this
  Each entry must have at least {id: string, start: int, end: int}.
- // has(id): return true if this contains the interval with the given `id`
- unindex(id): remove `id` from this index, return this
*/

export class IntervalIndex {
  constructor() {
    this.starts = new OrderedSet()
    this.ends = new OrderedSet()
    this.idsByStart = new ManyByOneIndex()
    this.idsByEnd = new ManyByOneIndex()
  }

  // Return true if the internal data structures are still consistent with each other
  _verify() {
    // For each start in idsByStart, there is a corresponding entry in starts
    for (const start of this.idsByStart.keys()) {
      if (!this.starts.has(start)) {
        console.warn('IntervalIndex', this, `start = ${start} is in idsByStart but not in starts`)
        return false;
      }
    }

    // For each start in starts, there is a corresponding non-empty entry in idsByStart
    for (const start of this.starts.keys()) {
      if (!this.idsByStart.has(start)) {
        console.warn('IntervalIndex', this, `start = ${start} is in starts but not in idsByStart`)
        return false;
      }
    }

    // For each end in idsByEnd, there is a corresponding entry in ends
    for (const end of this.idsByEnd.keys()) {
      if (!this.ends.has(end)) {
        console.warn('IntervalIndex', this, `end = ${end} is in idsByEnd but not in ends`)
        return false;
      }
    }

    // For each end in ends, there is a corresponding non-empty entry in idsByEnd
    for (const end of this.ends.keys()) {
      if (!this.idsByEnd.has(end)) {
        console.warn('IntervalIndex', this, `end = ${end} is in ends but not in idsByEnd`)
        return false;
      }
    }

    return true;
  }

  diff(prev, now) {
    const removed = new Set()
    const added = new Set()

    let flip = false
    if (prev == now)
      return {removed: removed, added: added};
    else if (prev > now) {
      ;[prev, now] = [now, prev]
      flip = true
    }

    for (const end of this.ends.range(prev, now)) {
      if (end == now)
        continue;

      const ids = this.idsByEnd.get(end)
      if (ids)
        for (const id of ids)
          removed.add(id);
    }

    for (const start of this.starts.range(prev, now)) {
      if (start == prev)
        continue;

      const ids = this.idsByStart.get(start)
      if (ids)
        for (const id of ids)
          removed.has(id) ? removed.delete(id) : added.add(id);
    }

    if (flip)
      return {removed: added, added: removed};
    else
      return {removed: removed, added: added};
  }

  expire(expiry) {
    let deletedSet

    const expiryExists = this.ends.has(expiry)

    // Split "ends" tree into a before & an after
    ;[deletedSet, this.ends] = this.ends.split(expiry)

    // Don't delete `expiry` itself, since we want to keep intervals that end on `expiry`
    if (expiryExists)
      this.ends.add(expiry);

    const deletedIds = []
    for (const end of deletedSet.keys()) {
      deletedIds.push(...this.idsByEnd.get(end));
      this.idsByEnd.delete(end)
    }

    const deletedStarts = new OrderedSet()
    for (const id of deletedIds) {
      const deletedStart = this.idsByStart.unindex(id)
      if (deletedStart !== null)
        deletedStarts.add(deletedStart);
    }

    this.starts.subtract(deletedStarts)

    return deletedIds
  }

  index(start, end, id) {
    return this.indexMany([{start: start, end: end, id: id}])
  }

  indexMany(entries) {
    this.starts.addMany(entries.map(entry => entry.start))
    this.ends.addMany(entries.map(entry => entry.end))
    for (const entry of entries) {
      this.idsByStart.index(entry.start, entry.id)
      this.idsByEnd.index(entry.end, entry.id)
    }

    return this
  }

  unindex(id) {
    const deletedStart = this.idsByStart.unindex(id)
    if (deletedStart !== null)
      this.starts.delete(deletedStart);

    const deletedEnd = this.idsByEnd.unindex(id)
    if (deletedEnd !== null)
      this.ends.delete(deletedEnd);

    return this
  }

  static test() {
    window.IntervalIndex = IntervalIndex
    window.isEqual = isEqual

    const t0 = performance.now()

    function test(name, actual, expected) {
      console.assert(isEqual(actual, expected), `${name}:\n${JSON.stringify(actual)}\nshould be\n${JSON.stringify(expected)}`)
    }

    // Test that diff(a, b) == {removed: e[0], added: e[1]} & diff(b, a) == {removed: e[1], added: e[0]}
    // e: [[...removedIds], [...addedIds]]
    const testDiff = (idx, a, b, e) => {
      e[0].sort()
      e[1].sort()

      let expected = {
        removed: e[0],
        added: e[1],
      }

      const actual1 = idx.diff(a, b)
      actual1.removed = Array.from(actual1.removed).sort()
      actual1.added = Array.from(actual1.added).sort()

      for (const field of ['removed', 'added'])
        test(`diff(${a}, ${b}).${field}`, actual1[field], expected[field]);

      expected = {
        removed: e[1],
        added: e[0],
      }

      const actual2 = idx.diff(b, a)
      actual2.removed = Array.from(actual2.removed).sort()
      actual2.added = Array.from(actual2.added).sort()

      for (const field of ['removed', 'added'])
        test(`diff(${b}, ${a}).${field}`, actual2[field], expected[field]);
    }

    {
      // diff
      const ii = new IntervalIndex()
      test('index1', ii.indexMany([
        {id: '00-05', start: 0.0, end: 0.5},
        {id: '05-10', start: 0.5, end: 1.0},
        {id: '10-15', start: 1.0, end: 1.5},
        {id: '00-10', start: 0.0, end: 1.0},
        {id: '05-15', start: 0.5, end: 1.5},
        {id: '00-15', start: 0.0, end: 1.5},
      ]), ii)

      test('index1-verify', ii._verify(), true)

      testDiff(ii, 0, 0, [[], []])
      testDiff(ii, -2, -1, [[], []])
      testDiff(ii, -1, 2, [[], []])
      testDiff(ii, 2, 3, [[], []])
      testDiff(ii, -1, 0, [[], ['00-05', '00-10', '00-15']])
      testDiff(ii, -0.1, 0.1, [[], ['00-05', '00-10', '00-15']])
      testDiff(ii, 0.1, 0.4, [[], []])
      testDiff(ii, 0, 0.5, [[], ['05-10', '05-15']])
      testDiff(ii, 0.4, 0.6, [['00-05'], ['05-10', '05-15']])
      testDiff(ii, 0.5, 1, [['00-05'], ['10-15']])
      testDiff(ii, 0.6, 1, [[], ['10-15']])
      testDiff(ii, 0.5, 1.1, [['00-05', '05-10', '00-10'], ['10-15']])
      testDiff(ii, 0.6, 1.1, [['05-10', '00-10'], ['10-15']])
    }

    {
      // index, unindex

      const ii = new IntervalIndex()
      test('index2a', ii.indexMany([
        {id: 'a', start: 0, end: 5},
        {id: 'c', start: 3, end: 5},
        {id: 'd', start: 4, end: 6},
      ]), ii)
      test('index2a-verify', ii._verify(), true)
      test('index2b', ii.indexMany([]), ii)
      test('index2b-verify', ii._verify(), true)
      test('index2c', ii.index(0, 3, 'b'), ii)
      test('index2c-verify', ii._verify(), true)
      testDiff(ii, -2, -1, [[], []])
      testDiff(ii, -1, 0, [[], ['a', 'b']])
      testDiff(ii, 0, 3, [[], ['c']])
      testDiff(ii, 3, 4, [['b'], ['d']])
      testDiff(ii, 4, 5, [[], []])
      testDiff(ii, 5, 6, [['a', 'c'], []])
      testDiff(ii, 6, 7, [['d'], []])
      testDiff(ii, 7, 8, [[], []])

      test('unindex2a', ii.unindex('c'), ii)
      test('unindex2a-verify', ii._verify(), true)
      test('unindex2b', ii.unindex('a'), ii)
      test('unindex2b-verify', ii._verify(), true)
      testDiff(ii, -2, -1, [[], []])
      testDiff(ii, -1, 0, [[], ['b']])
      testDiff(ii, 0, 3, [[], []])
      testDiff(ii, 3, 4, [['b'], ['d']])
      testDiff(ii, 4, 5, [[], []])
      testDiff(ii, 5, 6, [[], []])
      testDiff(ii, 6, 7, [['d'], []])
      testDiff(ii, 7, 8, [[], []])
    }

    {
      // expire

      const ii = new IntervalIndex()
      test('index3a', ii.indexMany([
        {id: 'a', start: 0, end: 10},
        {id: 'b', start: 1, end: 11},
        {id: 'c', start: 2, end: 12},
        {id: 'd', start: 3, end: 13},
        {id: 'e', start: 4, end: 14},
        {id: 'f', start: 5, end: 10},
        {id: 'g', start: 6, end: 11},
        {id: 'h', start: 7, end: 12},
        {id: 'i', start: 8, end: 13},
        {id: 'j', start: 9, end: 14},
      ]), ii)
      test('index3a-verify', ii._verify(), true)
      test('expire3b', ii.expire(13).sort(), ['a', 'b', 'c', 'f', 'g', 'h'])
    }

    console.log(`IntervalIndex: tests completed in ${performance.now() - t0} ms`)
  }
}
