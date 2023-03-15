/*
Shows a slider for time

Methods:
- constructor(options, time): construct slider with this ID, initialized at time `time`
  options:
  - id: ID attribute of div around the slider
  - zoom: how many ms in 1 px
  - width: how many px wide
  - autoMinimize: whether to automatically minimize
  - minimizeDelay: how long after mouseout to minimize the slider
- dom(): return DOM element of this
- minimize(): minimize slider; return this
- restore(): unminimize slider; return this
- time(): return current time displayed on slider (ms since epoch)
- time(time): set current time to `time`; return this

Events:
- input: fired when the user changes the current time in the slider
*/
export class TimeSlider extends EventTarget {
  constructor(options = {}, time) {
    super()

    this.options = {
      id: null, // ID attribute of div around the slider
      zoom: 300,  // ms / px
      width: 800, // px
      autoMinimize: true,
      minimizeDelay: 2000, // ms
      ...options,
    }

    this.state = {
      t: time,

      minimized: this.options.autoMinimize,
      minimizeTimeout: null,

      dragging: false,
      dragX: null,
    }

    this.el = document.createElement('div')
    this.el.classList.add('time-slider')
    if (this.options.id)
      this.el.id = this.options.id;

    this.textEl = document.createElement('div')
    this.textEl.classList.add('text-label')
    this.textEl.innerHTML = "&nbsp;"
    this.el.append(this.textEl)

    const ns = 'http://www.w3.org/2000/svg'

    this.svgEl = document.createElementNS(ns, 'svg')
    this.svgEl.classList.add('ruler')
    this.el.append(this.svgEl)

    // Create fadeout effect on ruler
    {
      const defs = document.createElementNS(ns, 'defs')
      this.svgEl.append(defs)

      const createStop = (offset, stopColor) => {
        const stop = document.createElementNS(ns, 'stop')
        stop.setAttribute('offset', offset)
        stop.setAttribute('stop-color', stopColor)
        return stop
      }

      const grad = document.createElementNS(ns, 'linearGradient')
      grad.setAttribute('id', 'fadeout-gradient')
      grad.append(createStop(0, '#000000'))
      grad.append(createStop(0.2, '#ffffff'))
      grad.append(createStop(0.8, '#ffffff'))
      grad.append(createStop(1, '#000000'))
      defs.append(grad)

      const mask = document.createElementNS(ns, 'mask')
      mask.setAttribute('id', 'fadeout-mask')
      defs.append(mask)

      this.maskRect = document.createElementNS(ns, 'rect')
      this.maskRect.setAttribute('x', 0)
      this.maskRect.setAttribute('y', 0)
      this.maskRect.setAttribute('height', 30)
      this.maskRect.setAttribute('fill', 'url(#fadeout-gradient')
      mask.append(this.maskRect)
    }

    this.centerLine = document.createElementNS(ns, 'line')
    this.centerLine.classList.add('center')
    this.centerLine.setAttribute('stroke', '#ffffff')
    this.centerLine.setAttribute('stroke-width', 1)
    this.svgEl.append(this.centerLine)

    this.ticksEl = document.createElementNS(ns, 'path')
    this.ticksEl.classList.add('ticks')
    this.ticksEl.setAttribute('stroke', '#cccccc')
    this.ticksEl.setAttribute('stroke-width', 1)
    this.ticksEl.setAttribute('mask', 'url(#fadeout-mask)')
    this.svgEl.append(this.ticksEl)

    // Minimize some time after mouseout; restore on mouseover
    this.el.addEventListener('mouseover', ev => {
      if (!this.options.autoMinimize)
        return;

      this.restore()
    })

    this.el.addEventListener('mouseout', ev => {
      if (!this.options.autoMinimize)
        return;

      this.state.minimizeTimeout = setTimeout(() => this.minimize(), this.options.minimizeDelay)
    })

    // Handle dragging
    const rulerMove = ev => {
      if (this.state.dragging) {
        const dx = this.state.dragX - ev.clientX
        this.state.dragX = ev.clientX

        const dt = dx * this.options.zoom
        this.state.t += dt

        if (dt != 0) {
          this._render()
          this.dispatchEvent(new Event('input'))
        }
      }
    }

    const rulerUp = ev => {
      this.state.dragging = false
      document.removeEventListener('mousemove', rulerMove)
      document.removeEventListener('mouseup', rulerUp)
    }

    this.el.addEventListener('mousedown', ev => {
      // Main mouse button press only
      if (ev.button != 0)
        return;

      this.state.dragging = true
      this.state.dragX = ev.clientX
      document.addEventListener('mousemove', rulerMove)
      document.addEventListener('mouseup', rulerUp)
    })

    this._render()
  }

  // Set all DOM attributes so they reflect the TimeSlider's internal data
  // (Safe to call multiple times)
  _render() {
    const set = (el, attr, val) => {
      // Avoid mutating DOM attributes too often
      if (el.getAttribute(attr) != val)
        el.setAttribute(attr, val);
    }

    const {zoom, width} = this.options
    const {t, minimized} = this.state

    const isElMinimized = this.el.classList.contains('minimized')
    if (minimized && !isElMinimized) {
      this.el.classList.add('minimized')
    } else if (!minimized && isElMinimized) {
      this.el.classList.remove('minimized')
    }

    const now = (new Date(this.state.t)).toLocaleString('de-CH')
    if (this.textEl.innerHTML != now)
      this.textEl.innerHTML = now;

    if (!minimized) {
      const centerX = Math.floor(width / 2)

      set(this.centerLine, 'x1', centerX)
      set(this.centerLine, 'x2', centerX)
      set(this.centerLine, 'y1', 0)
      set(this.centerLine, 'y2', 30)

      set(this.maskRect, 'width', width)

      const tickLen = 5000        // ms
      const mediumTickLen = 30000 // ms
      const majorTickLen = 60000  // ms
      const firstT = t - zoom * centerX
      const lastT  = t + zoom * (width - centerX)
      const firstTickT = (Math.floor(firstT / tickLen) + 1) * tickLen
      const firstTickX = (firstTickT - t) / zoom + centerX
      const tickW = tickLen / zoom
      let d = `M${Math.round(firstTickX)},30`
      for (let tt = firstTickT; tt < lastT; tt += tickLen) {
        if (tt % majorTickLen == 0)
          d += `l0,-25m${tickW},25`;
        else if (tt % mediumTickLen == 0)
          d += `l0,-18m${tickW},18`;
        else
          d += `l0,-10m${tickW},10`;
      }
      set(this.ticksEl, 'd', d)
    }
  }

  dom() {
    return this.el
  }

  minimize() {
    clearTimeout(this.state.minimizeTimeout)
    this.state.minimizeTimeout = null
    this.state.minimized = true

    this._render()
    return this
  }

  on(type, listener) {
    this.addEventListener(type, listener)
    return this
  }

  off(type, listener) {
    this.removeEventListener(type, listener)
    return this
  }

  restore() {
    this.state.minimized = false

    clearTimeout(this.state.minimizeTimeout)
    this.state.minimizeTimeout = null

    this._render()
    return this
  }

  time(time) {
    if (time === undefined)
      return this.state.t;

    if (this.state.t != time) {
      this.state.t = time
      this._render()
    }
  }
}