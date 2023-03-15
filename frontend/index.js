import Fuse from 'fuse.js'
import debounce from 'lodash/debounce'
import m from 'mithril'
import 'regenerator-runtime/runtime'
import { config } from './config'
import Visualization from './visualization'
import './index.scss'
import { FloatingSearchBox } from './ui/floating-search-box'
import { OptionsTable } from './ui/options-table'
import { Panel } from './ui/panel'
import { TimeSlider } from './ui/time-slider'
import { Diff, applyDiff } from './utils/diffing'
import prettyBytes from './utils/pretty-bytes'
import setPatientInterval from './utils/set-patient-interval'
import 'purecss'

const graphWorker = new Worker('graph-worker.js')
graphWorker.send = (type, ...data) => {
  return graphWorker.postMessage([type, ...data])
}

let t = 0
let lastT = null

const rangeInterval = 100 // ms
let lastRangeT = 0

let playing = false

const sendFilter = filter => {
  graphWorker.send('filter', filter)
}

const sendRange = () => {
  graphWorker.send('range', t - 1, t)
}

window.sum = arr => arr.reduce((a, b) => a + b, 0)

const timeSlider = new TimeSlider({id: 'visualization-time'}, t)
{
  // Append time slider after network map
  const networkMap = document.querySelector('.network-map')
  networkMap.parentNode.insertBefore(timeSlider.dom(), networkMap.nextSibling)

  timeSlider.on('input', () => {
    t = timeSlider.time()

    // Try to update graph
    if (Date.now() - lastRangeT > rangeInterval) {
      lastRangeT = Date.now()
      sendRange()
    }
  })
}

const togglePlayback = () => {
  if (playing) {
    playing = false
  } else {
    lastT = Date.now()
    playing = true
    requestAnimationFrame(animate)
  }
}

const animate = () => {
  if (playing)
    requestAnimationFrame(animate);

  if (lastT === null) {
    // First run
    lastT = Date.now()
    lastRangeT = Date.now()
    sendRange()
    return
  }

  const dt = Date.now() - lastT
  lastT = Date.now()
  t += dt

  // Try to update graph
  if (Date.now() - lastRangeT > rangeInterval) {
    lastRangeT = Date.now()
    sendRange()
  }

  timeSlider.time(t)
}

const graph = {nodes: {}, edges: {}}
const updateGraph = diff => {
  applyDiff(graph.nodes, diff.nodes)
  applyDiff(graph.edges, diff.edges)
}

const graphDiffBuffer = {
  nodes: new Diff(),
  edges: new Diff(),
}

const processGraphDiffBuffer = () => {
  if (graphDiffBuffer.nodes.isEmpty() && graphDiffBuffer.edges.isEmpty())
    return;

  updateGraph(graphDiffBuffer)
  visualization.updateGraph(graphDiffBuffer)
  updateInfoPanel()

  graphDiffBuffer.nodes.clear()
  graphDiffBuffer.edges.clear()
}

setPatientInterval(processGraphDiffBuffer, 100)

setTimeout(animate, 0)

graphWorker.onmessage = ev => {
  const [type, ...data] = ev.data

  switch (type) {
    case 'graphDiff':
      const changes = data[0]
      graphDiffBuffer.nodes.apply(changes.nodes)
      graphDiffBuffer.edges.apply(changes.edges)
      break
    case 'timeReference':
      const [timeReference] = data
      t = timeReference
      timeSlider.time(t)
      sendRange()
      break
  }
}

const searchBox = new FloatingSearchBox({id: 'main-search', placeholder: 'Search host names, IPs'})

{
  let searchBoxFuse, searchBoxPrevZoom, searchBoxPrevPan

  searchBox.on('show', ev => {
    const fuseOptions = {
      shouldSort: true,
      tokenize: true,
      includeMatches: true,
      threshold: 0.3,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ["label"],  // Changing this will break label highlighting
    }

    const list = Object.values(graph.nodes).map(node => ({label: `${node.label} (${node.id})`, value: `node:${node.id}`}))

    searchBoxFuse = new Fuse(list, fuseOptions)

    searchBoxPrevZoom = visualization.cy.zoom()
    searchBoxPrevPan = visualization.cy.pan()
  })

  searchBox.on('hide', ev => {
    visualization.cy.$('.active-search').removeClass(['active', 'active-search'])
    visualization.cy.zoom(searchBoxPrevZoom).pan(searchBoxPrevPan)
  })

  searchBox.on('search', ev => {
    let query = ev.target.query()

    if (query == ' ')
      query = '';

    const maxResults = 12
    const results = searchBoxFuse.search(query).slice(0, maxResults)

    const rows = results.map(result => {
      const {label, value} = result.item
      // Fuse results have indices with closed interval [a, b];
      // transform to [a, b+1) to match String.substring, and sort to go from beginning to end of string
      const indices = result.matches[0].indices.map(pair => [pair[0], pair[1] + 1]).sort((pair1, pair2) => pair1[0] - pair2[0])

      let highlightedLabel = ""
      let indexStart, indexEnd
      for (let i = 0; i < indices.length; ++i) {
        // Append non-highlighted part
        indexStart = (i == 0) ? 0 : indices[i-1][1]
        indexEnd = indices[i][0]
        highlightedLabel += label.substring(indexStart, indexEnd)

        // Append highlighted part
        indexStart = indices[i][0]
        indexEnd = indices[i][1]
        highlightedLabel += `<span class="highlight">${label.substring(indexStart, indexEnd)}</span>`
      }

      // Append last part
      indexStart = (indices.length == 0) ? 0 : indices[indices.length-1][1]
      indexEnd = label.length
      highlightedLabel += label.substring(indexStart, indexEnd)

      return {label: highlightedLabel, value: value}
    })

    ev.target.setResults(rows)
  })

  searchBox.on('change', ev => {
    const cy = visualization.cy
    cy.$('.active-search').removeClass(['active', 'active-search'])

    const id = ev.target.value()
    if (id) {
      const el = cy.$id(id)
      el.addClass(['active', 'active-search'])
      cy.zoom(Math.max(1, cy.zoom())).center(el)
    }
  })

  searchBox.on('select', ev => {
    const cy = visualization.cy
    const id = ev.target.value()
    const el = cy.$id(id)
    cy.zoom(Math.max(1, cy.zoom())).center(el)
    searchBoxPrevZoom = cy.zoom()
    searchBoxPrevPan = cy.pan()

    cy.$('.host:selected').unselect()
    el.select()
  })

}

const filterFlows = filter => {
  if (filter != 'custom') {
    sendFilter(filter)
  } else {
    filter = prompt("Which flows do you want to see?")
    sendFilter(filter)
  }
}

const colorEdges = mode => {
  switch (mode) {
    case "":
    case "traffic": {
      visualization.setColorMode(mode)
      break
    }
    default: {
      console.warn('colorEdges does not support mode', mode)
      break
    }
  }
}

const mapOptions = document.getElementById('map-options')

const infoPanel = new Panel({
  classes: 'info-panel',
  content: '',
  hidden: true,
  closable: true,
})
mapOptions.append(infoPanel.dom())

const optionsPanel = new Panel({
  classes: 'options-panel',
  hidden: true,
  closable: false,
})
mapOptions.append(optionsPanel.dom())

const optionsTable = new OptionsTable({
  id: 'map-options',
  info: 'test',
  minimized: true,
  rows: [
    {
      label: "Show",
      action: value => filterFlows(value),
      options: [
        {
          label: "All",
          value: "true",
        },
        {
          label: ">100M",
          value: "sum bytes > 100M",
        },
        {
          label: "DHCP",
          value: "any [67, 68, 546, 547, 647, 847] in ports",
        },
        {
          label: "DNS",
          value: "53 in ports",
        },
        {
          label: "LDAP",
          value: "any [389, 636] in ports",
        },
        {
          label: "Mail",
          // SMTP: 25, 587; 465;
          // IMAP: 143, 220; 585, 993
          // POP: 109, 110; 995
          value: "any [25, 587, 465, 143, 220, 585, 993, 109, 110, 995] in ports",
        },
        {
          label: "RPC",
          value: "135 in ports",
        },
        {
          label: "SSH",
          value: "22 in ports",
        },
        {
          label: "Unencrypted",
          value: "any [20, 21, 23, 25, 80, 109, 110, 143, 220, 587] in ports",
        },
        {
          label: "Web",
          value: "any [80, 443, 8080] in ports",
        },
        {
          label: "Custom",
          value: "custom",
        },
      ],
      selected: "All",
    },
    {
      label: "Color",
      action: value => colorEdges(value),
      options: [
        {
          label: "None",
          value: "",
        },
        {
          label: "Traffic",
          value: "traffic",
        },
      ],
      selected: "None",
    }
  ],
  title: config.title,
  subtitle: 'Loading flows',
})

optionsPanel.append(optionsTable.dom())

const titlePanel = new Panel({
  classes: 'title-panel',
  content: `<div class="title">${config.title}</div><div class="subtitle">Loading flows</div>`,
  hidden: false,
  closable: false,
})
mapOptions.append(titlePanel.dom())

titlePanel.dom().addEventListener('click', ev => {
  optionsPanel.toggle()
})


let visualization = new Visualization()
visualization.attachGraph(document.querySelector('.network-map'))

const handleSelectionChange = debounce(() => {
  const selection = visualization.selection()

  if (!selection.length) {
    infoPanel.hide()
    return
  }

  infoPanel.show()
  updateInfoPanel()
}, 1)

const updateInfoPanel = () => {
  const selection = visualization.selection()

  if (!selection.length || infoPanel.hidden()) {
    return
  }

  const content = infoPanel.content()

  if (selection.length > 1) {
    m.render(content, [
      m('strong', `${selection.length} nodes selected`),
      m('br'),
      selection.map(nodeId => graph.nodes[nodeId].label).sort().map(label => [label, m('br')]),
    ])
    return
  }

  // We now know selection.length == 1
  const nodeId = selection[0]
  const node = graph.nodes[nodeId]

  const nodeDescription = ''

  // Inefficiently find all edges connected to node
  const edges = Object.values(graph.edges).filter(edge => edge.source == nodeId || edge.target == nodeId)

  // Group neighbor traffic by host
  const trafficByHost = {}
  edges.forEach(edge => {
    const otherNodeId = (edge.source != nodeId) ? edge.source : edge.target
    const otherNode = graph.nodes[otherNodeId]
    if (!(otherNodeId in trafficByHost))
      trafficByHost[otherNodeId] = {
        node: otherNode,
        from: 0,
        to: 0,
      };

    // TODO Handle this better, considering edges can be bidirectional or also unidirectional
    if (edge.source == otherNodeId) {
      trafficByHost[otherNodeId].from += edge.value
      // trafficByHost[otherNodeId].to += edge.dstBytes
    } else {
      // trafficByHost[otherNodeId].from += edge.dstBytes
      trafficByHost[otherNodeId].to += edge.value
    }
  })

  m.render(content, [
    m('strong', node.label),
    (node.label != node.id) ? ` (${node.id})` : '',
    m('br'),
    m('em', nodeDescription ? [nodeDescription, m('br')] : ''),
    m('table', m('tbody',
      Object.values(trafficByHost)
        .filter(({from, to}) => from + to > 0)
        .sort((a, b) => (b.from + b.to) - (a.from + a.to))
        .slice(0, 10)
        .map(({node, from, to}) => m('tr', [
          m('td', {class: 'right', title: `${from + to} bytes`}, prettyBytes(from + to)),
          m('td', node.id),
          m('td', node.label != node.id ? node.label : ''),
        ]))
    ))
  ])
}

visualization.addEventListener('select', handleSelectionChange)
visualization.addEventListener('unselect', handleSelectionChange)

const showHelp = () => {
  const txt = [
    '?: Show this help',
    'Space: Play/pause',
    'c: Center view',
    'f: Zoom to fit',
    'h: Search',
    'l: Relayout',
    '',
    'Drag: Move node',
    'Ctrl+Drag: Select multiple nodes',
  ]
  alert(txt.join('\n'))
}

document.querySelector('.footnotes .help a').addEventListener('click', (ev) => {
  showHelp()
  ev.preventDefault()
})

document.addEventListener('keyup', (ev) => {
  if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey)
    return;

  if (searchBox.visible() || document.activeElement.nodeName == 'INPUT')
    return;

  switch (ev.keyCode) {
    case 32:  // ' '
      togglePlayback()
      break
    case 67:  // 'c'
      visualization.center()
      break
    case 70:  // 'f'
      visualization.fit()
      break
    case 72:  // 'h'
      searchBox.show()
      break
    case 76:  // 'l'
      visualization.relayout()
      break
    case 191: // '?'
      showHelp()
      break
  }
})

// Global exports
window.visualization = visualization