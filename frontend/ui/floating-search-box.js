/*

Methods:
- show(): display this search box
- query(): return current query
- visible(): return whether this search box is visible
- setResults(arr): set search results being displayed
  - each result must have fields {label, value}
- setSelected(index): set currently highlighted search result
- value(): return value of currently selected search result
- hide(): hide this search box

Events:
- search: fired after search query changes
- show: fired after search box is shown
- hide: fired after search box is hidden
- change: fired when the currently selected result changes
- select: fired when "Enter" is pressed on a result, or a result is clicked

*/

export class FloatingSearchBox extends EventTarget {
  constructor(options = {}) {
    super()

    this.options = {
      id: null,               // ID attribute of search box
      placeholder: 'Search',  // placeholder for search query textbox
      ...options
    }

    this.state = {
      visible: false, // whether this is currently shown
      hover: false,   // whether mouse is over any part of the search box
      results: [],    // Array of search results
      selected: -1,   // index of currently selected result
      selectedValue: null,  // value of currently selected result
    }

    this.el = document.createElement('div')
    this.el.classList.add('search-box')
    if (this.options.id)
      this.el.id = this.options.id;

    // Search icon
    this.el.append(document.createElement('div'))
    this.el.children[0].append(document.createElement('i'))
    this.el.children[0].children[0].classList.add('fas', 'fa-search')

    // Search query input
    this.queryEl = document.createElement('input')
    this.queryEl.classList.add('search-query')
    this.queryEl.type = 'text'
    this.queryEl.placeholder = this.options.placeholder

    this.el.addEventListener('mouseover', (ev) => this.state.hover = true)
    this.el.addEventListener('mouseout', (ev) => this.state.hover = false)

    this.queryEl.addEventListener('blur', (ev) => {
      if (this.state.hover) {
        // Hack to go around the fact that focus cannot be set onblur
        setTimeout(() => this.queryEl.focus(), 1)
      } else {
        this.hide()
      }
    })
    this.queryEl.addEventListener('input', (ev) => this.dispatchEvent(new Event('search')))
    this.el.children[0].append(this.queryEl)

    // Search results container
    this.resultsEl = document.createElement('div')
    this.resultsEl.classList.add('search-results')
    this.el.append(this.resultsEl)
  }

  on(type, listener) {
    this.addEventListener(type, listener)
    return this
  }

  off(type, listener) {
    this.removeEventListener(type, listener)
    return this
  }

  show() {
    if (this.state.visible) return this;

    this.state.visible = true
    document.body.append(this.el)

    this.queryEl.focus()
    this.queryEl.select()

    const handleKeyDown = (ev) => {
      switch (ev.keyCode) {
        case 13:  // Enter
          // Select 1st result if nothing selected (and results available)
          if (this.state.selected == -1 && this.state.results.length)
            this.setSelected(0);

          if (this.state.selectedValue)
            this.dispatchEvent(new Event('select'));

          this.hide()
          break
        case 27:  // Escape
          if (this.queryEl.value) {
            this.queryEl.value = ''
            this.queryEl.dispatchEvent(new Event('input', {bubbles: true}))
          } else {
            this.hide()
          }
          break
        case 38:  // Up
          this.setSelected(this.state.selected - 1)
          break
        case 40:  // Down
          this.setSelected(this.state.selected + 1)
          break
      }
    }

    this.keyDownHandler = ev => handleKeyDown(ev);

    document.addEventListener('keydown', this.keyDownHandler)

    this.dispatchEvent(new Event('show'))

    return this
  }

  hide() {
    if (!this.state.visible) return this;

    this.state.visible = false
    this.queryEl.blur()
    document.body.removeChild(this.el)

    document.removeEventListener('keydown', this.keyDownHandler)

    this.dispatchEvent(new Event('hide'))

    return this
  }

  query() {
    return this.queryEl.value
  }

  value() {
    return (this.state.selected != -1 && this.state.selected < this.state.results.length)
      ? this.state.results[this.state.selected].value
      : null
  }

  visible() {
    return this.state.visible
  }

  setResults(results) {
    this.state.results = results

    while (this.resultsEl.firstChild)
      this.resultsEl.removeChild(this.resultsEl.firstChild);

    this.state.results.forEach((result, index) => {
      const {label, value} = result

      const resultEl = document.createElement('div')
      resultEl.dataset.value = value
      resultEl.innerHTML = label
      resultEl.classList.add('search-result')
      resultEl.addEventListener('mousedown', ev => {
        this.setSelected(index)
      })
      resultEl.addEventListener('mouseup', ev => {
        if (this.state.selectedValue)
          this.dispatchEvent(new Event('select'));
        this.hide()
      })
      this.resultsEl.append(resultEl)
    })

    this.setSelected(0)

    return this
  }

  setSelected(index) {
    const oldValue = this.selectedValue

    if (!this.state.results.length) {
      index = -1
    } else {
      // Limit selection index to range of results
      index = Math.max(-1, Math.min(index, this.state.results.length - 1))
    }

    Array.from(this.resultsEl.children).forEach((resultEl, resultIndex) => {
      if (resultEl.classList.contains('selected') && resultIndex != index)
        resultEl.classList.remove('selected');
      if (!resultEl.classList.contains('selected') && resultIndex == index)
        resultEl.classList.add('selected');
    })

    this.state.selected = index
    this.state.selectedValue = this.value()

    // TODO Do we actually want to dispatch 'change' when value() changes (instead of watching 'index')?
    if (oldValue != this.state.selectedValue)
      this.dispatchEvent(new Event('change'));

    return this
  }
}