/*
Controls a div with the following structure:
<div class="panel" id="{id}">
  <div class="panel-content">{content}</div>
</div>

Methods:
- append(...nodes): append `nodes` as new children of `content()`; return this
- content(): return div.panel-content
- dom(): return div.panel
- hidden(): return whether this is hidden
- hide(): hide panel; return this
- show(): unhide panel; return this
- toggle(): toggle panel visibility; return this

Events:
- hide: fired after panel is hidden
- show: fired after panel is shown
*/

export class Panel extends EventTarget {
  constructor(config = {}) {
    super()

    this.config = {
      id: null,       // ID of div around panel
      classes: [],    // list of classes to add
      content: '',    // initial HTML content of div.panel-content
      hidden: false,  // whether this is hidden initially
      closable: true, // whether there is a "close" button
      ...config
    }

    this.state = {
      hidden: this.config.hidden,
    }

    // Panel div
    this.el = document.createElement('div')
    this.el.classList.add('panel')
    if (this.config.classes instanceof Array)
      this.el.classList.add(...this.config.classes);
    else if (this.config.classes)
      this.el.classList.add(this.config.classes);
    if (this.config.id)
      this.el.id = this.config.id;

    // Content div
    this.contentEl = document.createElement('div')
    this.contentEl.classList.add('panel-content')
    if (this.config.content)
      this.contentEl.innerHTML = this.config.content;
    this.el.append(this.contentEl)

    // Close button
    this.closeEl = null
    if (this.config.closable) {
      this.closeEl = document.createElement('button')
      this.closeEl.classList.add('close')
      this.closeEl.innerText = 'x'
      this.el.append(this.closeEl)

      this.closeEl.addEventListener('click', ev => {
        this.state.hidden = true
        this._render()
      })
    }

    this._render()
  }

  _render() {
    const isHidden = this.el.classList.contains('hidden')
    if (this.state.hidden && !isHidden)
      this.el.classList.add('hidden');
    else if (!this.state.hidden && isHidden)
      this.el.classList.remove('hidden');
  }

  append(...nodes) {
    this.contentEl.append(...nodes)
    return this
  }

  content() {
    return this.contentEl
  }

  dom() {
    return this.el
  }

  hidden() {
    return this.state.hidden
  }

  hide() {
    if (!this.state.hidden) {
      this.state.hidden = true
      this._render()

      this.dispatchEvent(new Event('hide'))
    }
  }

  show() {
    if (this.state.hidden) {
      this.state.hidden = false
      this._render()

      this.dispatchEvent(new Event('show'))
    }
  }

  toggle() {
    return this.state.hidden ? this.show() : this.hide()
  }
}