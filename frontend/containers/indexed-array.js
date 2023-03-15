export default class IndexedArray {
  constructor(iterable = [], indexer = value => undefined) {
    this._byIndex = {}
    this.indexer = indexer

    for (let value of iterable)
      this.push(value);
  }
  // Clear everything
  clear() {
    this._byIndex = {}
  }
  // Delete 1st occurrence of value
  delete(value) {
    const index = this.indexer(value)
    if (!(index in this._byIndex))
      return false;

    const arr = this._byIndex[index]
    const subIndex = arr.indexOf(value)
    if (subIndex == -1)
      return false;

    return arr.splice(subIndex, 1)
  }
  // Delete everything belonging to "index"
  deleteAll(index) {
    if (!(index in this._byIndex))
      return false;

    delete this._byIndex[index]
  }
  // Return Array of values under "index"
  getAll(index) {
    return this._byIndex[index]
  }
  // Return whether this has "value"
  has(value) {
    return this._byIndex[this.indexer(value)].indexOf(value) !== -1
  }
  // Return Array of indices
  indices() {
    return Object.keys(this._byIndex)
  }
  // Add "value" under its "index" (appended)
  push(value) {
    const index = this.indexer(value)
    if (!(index in this._byIndex))
      this._byIndex[index] = [];
    return this._byIndex[index].push(value)
  }
}
