import chroma from 'chroma-js'
import cytoscape from 'cytoscape'
import cyFcose from 'cytoscape-fcose'
import * as localforage from 'localforage'
import Stats from 'stats.js'
import * as models from './models'
import { applyDiff } from './utils/diffing'
import prettyBytes from './utils/pretty-bytes'


/*
Handles everything that has to do with rendering the graph.

TODO May even be a little too big.

Events:
- select: fired after new elements have been selected
- unselect: fired after previously selected elements have been unselected
*/
export default class Visualisation extends EventTarget {
  attachGraph(element) {
    this.cy.mount(element)
  }

  constructCy() {
    cytoscape.use(cyFcose)

    return cytoscape({
      minZoom: 0.1,
      maxZoom: 10,
      zoom: 1,
      pan: {x: 800, y: 600},
      textureOnViewport: true,
      wheelSensitivity: 0.2,
      style: [
        {
          selector: '.node',
          style: {
            'background-color': '#dddddd',
            'display': 'data(display)',
            'height': 'data(size)',
            'font-family': 'monospace',
            'font-size': 12,
            'font-weight': 'bold',
            'min-zoomed-font-size': 8,
            'shape': 'ellipse',
            'text-outline-color': '#000000',
            'text-outline-opacity': 1,
            'text-outline-width': 1,
            'text-valign': 'bottom',
            'text-wrap': 'wrap',
            'width': 'data(size)',
          }
        },
        {
          selector: '.node.big',
          style: {
            'color': '#dddddd',
            'label': 'data(label)',
          },
        },
        {
          selector: '.node[label].active, .node[label]:selected',
          style: {
            'background-color': '#ffe188',
            'color': '#ffe188',
            'label': 'data(label)',
            'z-index': 10000,
          }
        },
        {
          selector: '.node[label].highlight',
          style: {
            'border-color': '#ccb46d',
            'border-style': 'solid',
            'border-width': 3,
            'z-index': 9000,
          }
        },
        {
          selector: '.edge',
          style: {
            'color': '#555555',
            'display': 'data(display)',
            'line-color': 'data(color)',
            'width': 'data(thickness)',
          },
        },
        {
          selector: '.edge:loop',
          style: {
            'control-point-step-size': 40,
            'curve-style': 'bezier',
          },
        },
        {
          selector: '.edge:simple',
          style: {
            'curve-style': 'straight',
          }
        },
        {
          selector: '.edge.highlight',
          style: {
            'color': '#ffffff',
            'edge-text-rotation': 'autorotate',
            'font-size': 'data(fontSize)',
            'label': 'data(label)',
            'line-color': '#ffe188',
            'min-zoomed-font-size' : 8,
            'text-outline-color': '#000000',
            'text-outline-opacity': 1,
            'text-outline-width': 1,
            'z-index': 10000,
          },
        },
      ]
    })
  }

  constructor(settings={}) {
    super()

    this.settings = settings

    this.state = {colorMode: '', nodes: {}, edges: {}}

    this.cy = this.constructCy()
    window.cy = this.cy

    // Emit events on selection change
    this.cy.on('select', 'node.node', (evt) => {
      this.dispatchEvent(new Event('select'))
    })

    this.cy.on('unselect', 'node.node', (evt) => {
      this.dispatchEvent(new Event('unselect'))
    })

    this.savedNodePositions = {}
    localforage.getItem('nodePositions').then(nodePositions => {
      // this.savedNodePositions = nodePositions || {}
    })

    this.layoutSettings = {
      name: 'fcose',
      fit: false,
      // spacingFactor: 0.7,
      animate: false,
      // quality: 'proof',
      // nodeSeparation: 200,
      randomizeInitial: false,
    }

    const nodePositionSaverInterval = 5000
    this.nodePositionSaver = setInterval(() => this.saveNodePositions(), nodePositionSaverInterval)
    this.prelayoutNodePositions = null
    this.cy.on('layoutstop', () => { this.nodePositionSaver = setInterval(() => this.saveNodePositions(), nodePositionSaverInterval) })
    this.cy.on('layoutstart', () => clearInterval(this.nodePositionSaver))
    this.cy.on('layoutready', () => {
      if (this.prelayoutNodePositions === null)
        return;

      const nodes = this.cy.$('.node')
      const newPositions = this._positions(nodes)
      const transform = this._fitTransform(this.prelayoutNodePositions, newPositions)
      this._applyTransform(newPositions, transform)
      this._applyPositions(nodes, newPositions)

      this.prelayoutNodePositions = null
    })

    {
      let stats = new Stats();
      stats.showPanel(0)
      stats.begin()

      let updateStats = () => {
        stats.end()
        stats.begin()
        requestAnimationFrame(updateStats)
      }

      document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(stats.dom)
        requestAnimationFrame(updateStats)
      })
    }
  }

  // Return changes in node selection
  selection() {
    return this.cy.$('node:selected.node').map(node => node.data('node').id)
  }

  saveNodePositions() {
    localforage.getItem('nodePositions').then(oldPositions => {
      const nodePositions = {...oldPositions}

      this.cy.$('.node').forEach(ele => {
        const id = ele.id()
        nodePositions[id] = ele.position()
      })

      localforage.setItem('nodePositions', nodePositions)
    })
  }

  relayout() {
    // Lock network node positions
    console.log('visualization.relayout')

    const settings = this.layoutSettings
    if (settings.randomizeInitial && this.cy.$('.node').empty())
      settings.randomize = true;

    this.prelayoutNodePositions = this._positions(this.cy.$('.node'))

    this.cy.$('.node, .edge')
      .layout(settings)
      .run()
  }

  center() {
    this.cy.center()
    return this
  }

  fit() {
    this.cy.fit()
    return this
  }

  _positions(els) {
    const positions = {}
    els.forEach(el => positions[el.id()] = [el.position('x'), el.position('y')])
    return positions
  }

  _centerOfMass(positions) {
    let cx = 0, cy = 0
    Object.values(positions).forEach(([x, y]) => {
      cx += x
      cy += y
    })

    const n = Object.values(positions).length
    cx /= n
    cy /= n

    return [cx, cy]
  }

  _posDeviation(positions, c) {
    const [cx, cy] = c, n = Object.values(positions).length
    let tvx = 0, tvy = 0
    Object.values(positions).forEach(([x, y]) => {
      const vx = x - cx
      const vy = y - cy
      tvx += vx * vx
      tvy += vy * vy
    })
    return [Math.sqrt(tvx / (n)), Math.sqrt(tvy / (n))]
  }

  // Return [r1, r2] with r_ same as o_, but with only keys common to o1 & o2
  _intersectKeys(o1, o2) {
    const keys2 = new Set(Object.keys(o2))
    const keys = Object.keys(o1).filter(k => keys2.has(k))
    const r1 = {}
    const r2 = {}
    keys.forEach(k => {
      r1[k] = o1[k]
      r2[k] = o2[k]
    })
    return [r1, r2]
  }

  // Mirrors positions left-right about vertical center axis
  // pos: Object(id => [x, y])
  // c: [cx, cy]
  _doMirrorH(pos, c) {
    const cx = c[0]
    Object.values(pos).forEach(p => {
      p[0] = -(p[0] - cx) + cx
    })
    return pos
  }

  // Mirrors positions top-bottom about horizontal center axis
  // pos: Object(id => [x, y])
  // c: [cx, cy]
  _doMirrorV(pos, c) {
    const cy = c[1]
    Object.values(pos).forEach(p => {
      p[1] = -(p[1] - cy) + cy
    })
    return pos
  }

  // Translate all positions by a constant offset
  // pos: Object(id => [x, y])
  // t: [tx, ty]
  _doTranslate(pos, t) {
    Object.values(pos).forEach(p => {
      p[0] += t[0]
      p[1] += t[1]
    })
    return pos
  }

  // Applies positions `pos` to `els`
  // els: cy collection
  // pos: Object(id => [x, y])
  _applyPositions(els, pos) {
    els.positions((el, i) => {
      const p = pos[el.id()]
      return {x: p[0], y: p[1]}
    })
  }

  // pos1, pos2: Object(id => [x, y])
  // Assumes pos1, pos2 have exact same set of keys
  _sumOfDistances(pos1, pos2) {
    let sum = 0
    Object.keys(pos1).forEach(id => {
      const p1 = pos1[id]
      const p2 = pos2[id]
      sum += Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1])
    })
    return sum
  }

  _clonePos(pos) {
    const newPos = {}
    Object.entries(pos).forEach(([id, p]) => {
      newPos[id] = [...p]
    })
    return newPos
  }

  // Find mirroring combination on pos2 that makes it closest to pos1
  // Returns {
  //   translate: [tx, ty]          // translate(pos2) to get closer to pos1
  //   mirror: {v: bool, h: bool},  // whether to mirror(pos2) vert and/or horz about its CoM
  // }
  _fitTransform(inpos1, inpos2) {
    const [pos1, origpos2] = this._intersectKeys(inpos1, inpos2)
    const pos2 = this._clonePos(origpos2)
    const c1 = this._centerOfMass(pos1)
    const c2 = this._centerOfMass(pos2)

    const t = [c1[0] - c2[0], c1[1] - c2[1]]
    this._doTranslate(pos2, t)

    const scores = new Map()

    let mirror = {v: false, h: false}
    scores.set(mirror, this._sumOfDistances(pos1, pos2))

    this._doMirrorV(pos2, c1)
    mirror = {...mirror, v: !mirror.v}
    scores.set(mirror, this._sumOfDistances(pos1, pos2))

    this._doMirrorH(pos2, c1)
    mirror = {...mirror, h: !mirror.h}
    scores.set(mirror, this._sumOfDistances(pos1, pos2))

    this._doMirrorV(pos2, c1)
    mirror = {...mirror, v: !mirror.v}
    scores.set(mirror, this._sumOfDistances(pos1, pos2))

    const bestScore = Math.min(...Array.from(scores.values()))
    let bestMirror
    for (const [mirror, score] of scores.entries()) {
      if (score == bestScore)
        bestMirror = mirror;
    }

    return {translate: t, mirror: bestMirror}
  }

  _applyTransform(pos, transform) {
    const {mirror, translate} = transform
    this._doTranslate(pos, translate)
    const c = this._centerOfMass(pos)
    if (mirror.h) this._doMirrorH(pos, c);
    if (mirror.v) this._doMirrorV(pos, c);
    return pos
  }

  updateGraph(diff) {
    applyDiff(this.state.nodes, diff.nodes, {
      exit: (selection, nodes) => {
        const removedEls = this.cy.collection()
        Object.values(selection).forEach(node => {
          const el = this.cy.$id('node:' + node.id)
          removedEls.merge(el)
        })

        this.cy.remove(removedEls)
      },
      enter: (selection, nodes) => {
        const added = Object.values(selection).map(node => {
          const el = {
            classes: ['node'],
            group: 'nodes',
            data: {
              id: 'node:' + node.id,
              node: node,
              display: 'element',
              label: '',
              size: 1,
            },
            position: {x: 0, y: 0},
          }

          // Initialize position: rejection sampling in a circle
          const radius = 1400
          const pos = el.position
          do {
            pos.x = radius * (2 * Math.random() - 1)
            pos.y = radius * (2 * Math.random() - 1)
          } while (pos.x * pos.x + pos.y * pos.y > radius * radius)

          return el
        })

        const newEls = this.cy.add(added)

        newEls.on('mouseover', el => {
          if (this.cy.zoom() > 0.5) {
            el.target.addClass('active')
          }
        })

        newEls.on('mouseout', el => {
          el.target.removeClass('active')
        })

        newEls.on('select', el => {
          // Set selected nodes to .active
          const selected = cy.$('node:selected')
          selected.difference('node.active').addClass('active')
          selected.and('.highlight').removeClass('highlight')

          // Set connected edges & nodes to .highlight
          const highlightedEdges = selected.connectedEdges(':visible')
          highlightedEdges.union(highlightedEdges.connectedNodes(':visible').difference('node:selected')).addClass('highlight')
        })

        newEls.on('unselect', el => {
          el.target.removeClass('active')
          this.cy.$('.highlight').removeClass('highlight')

          const highlightedEdges = cy.$('node:selected').connectedEdges(':visible')
          highlightedEdges.union(highlightedEdges.connectedNodes(':visible').difference('node:selected')).addClass('highlight')
        })
      },
      change: (selection, nodes) => {
        this.cy.batch(() => {
          Object.values(selection).forEach(node => {
            const el = this.cy.$id('node:' + node.id)
            el.data('node', node)

            const totalValue = node.value.i + node.value.n + node.value.o

            if (totalValue <= 0) {
              el.data('display', 'none')
              return
            }

            el.data('display', 'element')

            // Add 'big' class if and only if sum(data) > 200 MB
            const isBig = (totalValue > 2e8)
            if (isBig && !el.hasClass('big')) {
              el.addClass('big')
            } else if (!isBig && el.hasClass('big')) {
              el.removeClass('big')
            }

            // Make label from value = {i, n, o}
            let label = node.label
            const vals = []
            if (node.value.i) vals.push(`+${prettyBytes(node.value.i)}`);
            if (node.value.n) vals.push(`=${prettyBytes(node.value.n)}`);
            if (node.value.o) vals.push(`-${prettyBytes(node.value.o)}`);
            if (vals.length) label += ` (${vals.join(', ')})`;
            el.data('label', label)

            el.data('size', Math.max(1, Math.round(0.3 * Math.pow(Math.log10(totalValue + 2), 2))))
          })
        })
      },
    })

    applyDiff(this.state.edges, diff.edges, {
      exit: (selection, edges) => {
        const removedEls = this.cy.collection()
        Object.values(selection).forEach(edge => {
          const el = this.cy.$id('edge:' + edge.id)
          removedEls.merge(el)
        })

        this.cy.remove(removedEls)
      },
      enter: (selection, edges) => {
        const added = Object.values(selection).map(edge => ({
          classes: ['edge'],
          group: 'edges',
          selectable: false,
          grabbable: false,
          data: {
            id: 'edge:' + edge.id,
            source: 'node:' + edge.source,
            target: 'node:' + edge.target,
            edge: edge,
            display: 'element',
            color: '#555555',
            fontSize: 1,
            thickness: 1,
          },
        }))

        this.cy.add(added)
      },
      change: (selection, edges) => {
        this.cy.batch(() => {
          Object.values(selection).forEach(edge => {
            const el = this.cy.$id('edge:' + edge.id)
            el.data('edge', edge)

            if (edge.value <= 0) {
              el.data('display', 'none')
              return
            }

            el.data('display', 'element')
            el.data('fontSize', 8 + Math.floor(4 * Math.log(edge.value + 2) / Math.log(1000)))
            el.data('thickness', Math.max(1, Math.round(0.05 * Math.pow(Math.log(edge.value + 2) / Math.log(1000), 4))))
            el.data('label', edge.value ? prettyBytes(edge.value) : '')
          })
        })
      },
    })

    this.recolor()

    {
      const numVisibleNodes = Object.values(this.state.nodes).reduce((count, node) => count + (node.value.i + node.value.n + node.value.o > 0 ? 1 : 0), 0)
      const numVisibleEdges = Object.values(this.state.edges).reduce((count, edge) => count + (edge.value > 0 ? 1 : 0), 0)

      const totalData = Object.values(this.state.edges).reduce((val, edge) => val + edge.value, 0)

      // TODO Find better way to export these stats
      const smallStatsEl = document.querySelector('#map-options .subtitle')
      if (smallStatsEl) {
        smallStatsEl.innerText = `${prettyBytes.short(totalData)} (${numVisibleNodes}● ${numVisibleEdges}─)`
        smallStatsEl.title = `${totalData} bytes (${numVisibleNodes} nodes, ${numVisibleEdges} edges)`
      }
    }

    const randBetween = (bounds) => {
      const [a, b] = bounds
      return a + Math.random() * (b - a);
    }

    // Rejection sampling for noise in a circle
    const randInCircle = (radius) => {
      const pos = {x: 0, y: 0}
      do {
        pos.x = radius * (2 * Math.random() - 1)
        pos.y = radius * (2 * Math.random() - 1)
      } while (pos.x * pos.x + pos.y * pos.y > radius * radius);
      return pos
    }

    // Reposition new nodes to be close to nodes they're linked to
    for (const nodeId of Object.keys(diff.nodes.added)) {
      const node = this.cy.$id('node:' + nodeId)
      const neighbors = node.openNeighborhood('.node')
      if (!neighbors.length)
        return;

      const neighborPositions = this._positions(neighbors)
      const mean = this._centerOfMass(neighborPositions)
      const deviation = this._posDeviation(neighborPositions, mean)
      const expansion = 1.2
      const bounds = [
        [mean[0] - expansion * deviation[0], mean[0] + expansion * deviation[0]],
        [mean[1] - expansion * deviation[1], mean[1] + expansion * deviation[1]],
      ]

      const noiseScale = 100 * 2 // Math.log10(neighbors.maxDegree())
      const noise = randInCircle(noiseScale)
      const newPos = {x: randBetween(bounds[0]) + noise.x, y: randBetween(bounds[1]) + noise.y}
      node.position(newPos)
    }

  }

  _maxNodeValue(nodes) {
    return nodes.reduce((val, node) => {
      const v = node.data('node').value
      return val + v.i + v.n + v.o
    }, 0)
  }

  // Recolor every edge according to the current color mode
  recolor() {
    const mode = this.state.colorMode

    if (mode == '') {
      this.cy.batch(() => {
        Object.keys(this.state.edges).forEach(edgeId => {
          const edge = this.cy.$id('edge:' + edgeId)
          const color = '#555555'

          if (edge.data('edge').value == 0)
            return;

          if (edge.data('color') != color)
            edge.data('color', color);
        })
      })

    } else if (mode == 'traffic') {
      const maxValue = Object.values(this.state.edges).reduce((val, edge) => Math.max(val, edge.value), 0)

      const f = chroma.scale(['#002072', '#96ffea', '#fcff83']).correctLightness().domain([0, Math.log(maxValue + 1)])

      this.cy.batch(() => {
        Object.values(this.state.edges).forEach(edge => {
          if (edge.value == 0)
            return;

          const edgeEl = this.cy.$id('edge:' + edge.id)
          const color = f(Math.log(edge.value + 1)).hex()

          if (edgeEl.data('color') != color)
            edgeEl.data('color', color);
        })
      })
    }
  }

  setColorMode(mode) {
    this.state.colorMode = mode

    this.recolor()
  }
}