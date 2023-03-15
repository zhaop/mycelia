import ipaddr from 'ipaddr.js'
import isEqual from 'lodash/isEqual'
import memoize from 'lodash/memoize'
import {diff} from './utils/diffing'
import {Range} from './utils/range'

export class NodeMembership {
  static _makeNode(id, label) {
    return {
      id: id,
      label: label,
      value: null,
    }
  }

  // Make each IP its own node
  static byIp() {
    const {_makeNode} = NodeMembership
    return [
      flow => [flow.srcIp, flow.dstIp],
      (flow, dir) => (
        (dir == 0)
        ? _makeNode(flow.srcIp, flow.srcName)
        : _makeNode(flow.dstIp, flow.dstName)
      ),
    ]
  }

  // Group IPv4 addresses into subnets; don't group IPv6
  static bySubnet(subnet = "/24") {
    const {_makeNode} = NodeMembership

    const ipv4NetworkFromAddr = memoize(addr => ipaddr.IPv4.networkAddressFromCIDR(ipaddr.parse(addr) + subnet).toString())
    const isIpv4 = addr => (addr.indexOf('.') != -1)
    const nodeIdFromIp = ip => isIpv4(ip) ? ipv4NetworkFromAddr(ip) : ip

    return [
      flow => [nodeIdFromIp(flow.srcIp), nodeIdFromIp(flow.dstIp)],
      (flow, dir) => (
        (dir == 0)
        ? _makeNode(nodeIdFromIp(flow.srcIp), nodeIdFromIp(flow.srcIp) + subnet)
        : _makeNode(nodeIdFromIp(flow.dstIp), nodeIdFromIp(flow.dstIp) + subnet)
      ),
    ]
  }
}

export class EdgeMembership {
  static _id(srcNodeId, dstNodeId, type=null) {
    return `(${srcNodeId},${dstNodeId},${type || ''})`
  }

  static _makeEdge(srcNodeId, dstNodeId, type=null) {
    return {
      id: EdgeMembership._id(srcNodeId, dstNodeId, type),
      source: srcNodeId,
      target: dstNodeId,
      type: type || '',
      value: null,
    }
  }

  static byLink(nodeIdsFromFlow) {
    const {_id, _makeEdge} = EdgeMembership
    return [
      flow => {
        const [srcNodeId, dstNodeId] = nodeIdsFromFlow(flow)
        return [_id(
          (srcNodeId < dstNodeId) ? srcNodeId : dstNodeId,
          (srcNodeId < dstNodeId) ? dstNodeId : srcNodeId
        )]
      },
      (flow, dir) => {
        const [srcNodeId, dstNodeId] = nodeIdsFromFlow(flow)
        return _makeEdge(
          (srcNodeId < dstNodeId) ? srcNodeId : dstNodeId,
          (srcNodeId < dstNodeId) ? dstNodeId : srcNodeId
        )
      }
    ]
  }

  static byDirection(nodeIdsFromFlow) {
    const {_id, _makeEdge} = EdgeMembership
    return [
      flow => {
        const [srcNodeId, dstNodeId] = nodeIdsFromFlow(flow)
        return (flow.dstPkts > 0)
          ? [_id(srcNodeId, dstNodeId), _id(dstNodeId, srcNodeId)]
          : [_id(srcNodeId, dstNodeId)]
      },
      (flow, dir) => {
        const [srcNodeId, dstNodeId] = nodeIdsFromFlow(flow)
        return (dir == 0)
          ? _makeEdge(srcNodeId, dstNodeId)
          : _makeEdge(dstNodeId, srcNodeId)
      },
    ]
  }

  static byProto(nodeIdsFromFlow) {
    const {_id, _makeEdge} = EdgeMembership
    return [
      flow => {
        const [srcNodeId, dstNodeId] = nodeIdsFromFlow(flow)
        const {proto} = flow
        return (flow.dstPkts > 0)
          ? [_id(srcNodeId, dstNodeId, proto), _id(dstNodeId, srcNodeId, proto)]
          : [_id(srcNodeId, dstNodeId, proto)]
      },
      (flow, dir) => {
        const [srcNodeId, dstNodeId] = nodeIdsFromFlow(flow)
        const {proto} = flow
        return (dir == 0)
          ? _makeEdge(srcNodeId, dstNodeId, proto)
          : _makeEdge(dstNodeId, srcNodeId, proto)
      }
    ]
  }

  static byService(nodeIdsFromFlow, services = {53: 'dns', 80: 'web', 443: 'web'}) {
    const {_id, _makeEdge} = EdgeMembership
    const serviceFromFlow = flow => {
      let service = '?'

      if (services.hasOwnProperty(flow.srcPort))
        service = services[flow.srcPort];

      if (service.hasOwnProperty(flow.dstPort))
        service = services[flow.dstPort];

      return service
    }

    return [
      flow => {
        const [srcNodeId, dstNodeId] = nodeIdsFromFlow(flow)
        const service = serviceFromFlow(flow)
        return (flow.dstPkts > 0)
          ? [_id(srcNodeId, dstNodeId, service), _id(dstNodeId, srcNodeId, service)]
          : [_id(srcNodeId, dstNodeId, service)]
      },
      (flow, dir)  => {
        const [srcNodeId, dstNodeId] = nodeIdsFromFlow(flow)
        const service = serviceFromFlow(flow)
        return (dir == 0)
          ? _makeEdge(srcNodeId, dstNodeId, service)
          : _makeEdge(dstNodeId, srcNodeId, service)
      }
    ]
  }
}

export class NodeAggregator {
  static bytesInOut(nodeIdsFromFlow) {
    return {
      init: (node) => ({i: 0, n: 0, o: 0}),
      combine: (node, flow) => {
        const [srcNodeId, dstNodeId] = nodeIdsFromFlow(flow)
        const {i, n, o} = node.value
        if (node.id == srcNodeId && srcNodeId == dstNodeId) {
          return {i: i, n: n + flow.srcBytes + flow.dstBytes, o: o}
        } else if (node.id == srcNodeId) {
          return {i: i + flow.dstBytes, n: n, o: o + flow.srcBytes}
        } else {
          return {i: i + flow.srcBytes, n: n, o: o + flow.dstBytes}
        }
      },
    }
  }
}

export class EdgeAggregator {
  static undirectedBytes(nodeIdsFromFlow) {
    return {
      init: (edge) => 0,
      combine: (edge, flow) => {
        return edge.value + flow.srcBytes + flow.dstBytes
      }
    }
  }
  static directedBytes(nodeIdsFromFlow) {
    return {
      init: (edge) => 0,
      combine: (edge, flow) => {
        const [srcNodeId, dstNodeId] = nodeIdsFromFlow(flow)
        if (edge.source == srcNodeId && srcNodeId == dstNodeId) {
          return edge.value + flow.srcBytes + flow.dstBytes
        } else if (edge.source == srcNodeId) {
          return edge.value + flow.srcBytes
        } else {
          return edge.value + flow.dstBytes
        }
      },
    }
  }

  static bandwidth(nodeIdsFromFlow) {
    return {
      init: (edge) => 0,
      combine: (edge, flow) => {
        const [srcNodeId, dstNodeId] = nodeIdsFromFlow(flow)
        const duration = Math.max(1e-3, (flow.end - flow.start) / 1000) // s
        if (edge.source == srcNodeId) {
          return edge.value + flow.srcBytes / duration
        } else {
          return edge.value + flow.dstBytes / duration
        }
      },
    }
  }
}

export class FlowSelector {
  static timeRange() {
    return (flows, range) => {
      const result = []
      for (const flow of flows) {
        if (range.overlaps(flow.start, flow.end)) {
          result.push(flow)
        }
      }
      return result
    }
  }
}

/*
Flow log, transforms a time-dependent selection into a graph, and outputs changes to the graph.

Transformation into graph:
- A node `nodeId` contains flows such that the node membership function output of its srcIp or dstIp
    is the node itself:
    nodeIdsFromFlow = (flow) => [nodeId0, nodeId1]
    nodeFromFlow = (flow, dir) => node
- A node exists iff it contains flows.
- Node values are the result of a node aggregation function:
    nodeAggregator = (node, flows) => value
- An edge `edgeId` contains flows that start and end at the edge's start and end nodes, and whose
    edge membership function output contains the edge:
    edgeIdsFromFlow = (flow) => (edgeId0 [, edgeId1])
    edgeFromFlow = (edge, dir) => edge
    (edgeId1 is optional)
- An edge exists iff it contains flows.
- Edge values are the result of an edge aggregation function:
    edgeAggregator = (edge, flows) => value
  over a time-dependent selection on the flows in the edge, where the selection depends on a selector function:
    selectFlows = (flows, range) => flows
  filtered by an optional custom filter function:
    flowFilter = (flow) => Boolean
- Aggregator functions are formed by folding a combination function and its inverse:
    init = (element) => initValue
    combine = (element, flow) => newValue
    // decombine = (element, flow) => newValue  // TODO Not useful right now

Changes to the graph follow the format:
{
  nodes: Diff,
  edges: Diff,
}

The graph is a function of:
- flows
- time range
- node membership function
- edge membership function
- node aggregation function
- edge aggregation function
- selector function
- filter function

This class is basically a stateful wrapper around the inputs to the graph.

Supported operations:
- Add flows
- Delete flows older than a certain age (collect garbage)
- Change time range
- Change ... functions

Static methods:
- _diff(graph1, graph2): return changes from graph1 to graph2

Methods:
- _toGraph(): return full graph {nodes: {nodeId: node, ...}, edges: {edgeId: edge, ...}}
- addFlows(flows): Iterable `flows`; return changes
- collectGarbage(t): delete flows that ended before `t`; return changes
- setFilter(fn): return changes
- setRange(range): return changes
- setEdgeAggregator(combineFn, decombineFn): return changes
- setEdgeMembership(fn): return changes
- setNodeAggregator(combineFn, decombineFn): return changes
- setNodeMembership(fn): return changes
- setSelector(fn): return changes
*/

export class FlowGraph {
  constructor() {
    this.flows = new Map()
    this.range = new Range(0, 0)

    // Group IPv4 addresses into /24 subnets; don't group IPv6
    ;[this.nodeIdsFromFlow, this.nodeFromFlow] = NodeMembership.byIp()
    this.nodeIdsFromFlow = memoize(this.nodeIdsFromFlow)

    // (srcNode.id, tgtNode.id[, edgeType])
    // eg: (10.1.1.0, 10.2.2.0, http)
    ;[this.edgeIdsFromFlow, this.edgeFromFlow] = EdgeMembership.byLink(this.nodeIdsFromFlow)
    this.edgeIdsFromFlow = memoize(this.edgeIdsFromFlow)

    // Counts bytes in & out of a node
    this.nodeAggregator = NodeAggregator.bytesInOut(this.nodeIdsFromFlow)

    // Counts bytes through an edge
    this.edgeAggregator = EdgeAggregator.undirectedBytes(this.nodeIdsFromFlow)

    // Select flows overlapping a time range
    this.selectFlows = FlowSelector.timeRange()

    // Optinal flow filter (null when not set)
    this.flowFilter = null

    // Cache
    this._graph = {nodes: {}, edges: {}}
  }

  static _diff(graph1, graph2) {
    return {
      nodes: diff(graph1.nodes, graph2.nodes, (node1, node2) => isEqual(node1.value, node2.value)),
      edges: diff(graph1.edges, graph2.edges, (edge1, edge2) => isEqual(edge1.value, edge2.value)),
    }
  }

  _getChangesOnce() {
    const graph2 = this._toGraph()
    const changes = FlowGraph._diff(this._graph, graph2)
    this._graph = graph2
    return changes
  }

  _toGraph() {
    const {flows, range, nodeIdsFromFlow, nodeFromFlow, edgeIdsFromFlow, edgeFromFlow, nodeAggregator, edgeAggregator, selectFlows, flowFilter} = this

    // Create all of the nodes
    const nodes = {}
    for (const flow of flows.values()) {
      for (const [i, nodeId] of nodeIdsFromFlow(flow).entries()) {
        if (!(nodeId in nodes)) {
          const node = nodeFromFlow(flow, i)
          node.value = nodeAggregator.init()
          nodes[node.id] = node
        }
      }
    }

    // Create all of the edges
    const edges = {}
    for (const flow of flows.values()) {
      for (const [i, edgeId] of edgeIdsFromFlow(flow).entries()) {
        if (!(edgeId in edges)) {
          const edge = edgeFromFlow(flow, i)
          edge.value = edgeAggregator.init()
          edges[edge.id] = edge
        }
      }
    }

    // Select only the flows we're interested in
    let selectedFlows = selectFlows(flows.values(), range)

    // Optionally filter the selected flows
    if (flowFilter)
      selectedFlows = selectedFlows.filter(flowFilter);

    // Calculate node values
    for (const flow of selectedFlows) {
      for (const nodeId of nodeIdsFromFlow(flow)) {
        const node = nodes[nodeId]
        node.value = nodeAggregator.combine(node, flow)
      }
    }

    // Calculate edge values
    for (const flow of selectedFlows) {
      for (const edgeId of edgeIdsFromFlow(flow)) {
        const edge = edges[edgeId]
        edge.value = edgeAggregator.combine(edge, flow)
      }
    }

    return {nodes: nodes, edges: edges}
  }

  addFlows(flows) {
    for (const flow of flows)
      this.flows.set(flow.id, flow);

    return this._getChangesOnce()
  }

  collectGarbage(t) {
    const {flows} = this

    for (const flow of flows.values())
      if (flow.end < t)
        flows.delete(flow.id);

    return this._getChangesOnce()
  }

  setFilter(filterFn) {
    this.flowFilter = filterFn
    return this._getChangesOnce()
  }

  setRange(range) {
    this.range.start = range.start
    this.range.end = range.end
    return this._getChangesOnce()
  }
}