export class Range {
  constructor(start, end) {
    this.start = parseFloat(start)
    this.end = parseFloat(end)

    console.assert(!isNaN(start))
    console.assert(!isNaN(end))
  }

  shifted(delta) {
    const {start, end} = this
    return new Range(start + delta, end + delta)
  }

  // Return whether point ∈ [this.start, this.end]
  contains(point) {
    return (this.start <= point) && (point <= this.end)
  }

  // Return whether this has same start & end as another range
  equals(other) {
    return (this.start == other.start) && (this.end == other.end)
  }

  // Return whether [start, end] ∩ [this.start, this.end] ≠ ∅
  overlaps(start, end) {
    return (start <= this.end) && (this.start <= end)
  }
}