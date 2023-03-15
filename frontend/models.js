// This file is mostly to document the models and is not really used in the code

const attr = () => 'attr'
const fk = (model, field) => `fk(${model}, ${field})`
const many = (props) => `many(${JSON.stringify(props)})`


class Node {
  toString() {
    return `Node[${this.id}]{label: ${this.label}, value: ${this.value}}`
  }
}

Node.fields = {
  id: attr(),
  label: attr(),
  value: attr(),
}


class Edge {
  toString() {
    return `Edge[${this.id}]{source: ${this.source}, target: ${this.target}, type: ${this.type}, value: ${this.value}}`
  }
}

Edge.fields = {
  id: attr(),
  source: fk('Node'),
  target: fk('Node'),
  type: attr(),
  value: attr(),
}


// Directional flow
class Flow {
  toString() {
    return `Flow[${this.id}]{start: ${this.start}, end: ${this.end}, srcIp: ${this.srcIp}, dstIp: ${this.dstIp}, proto: ${this.proto}, srcPort: ${this.srcPort}, dstPort: ${this.dstPort}, srcBytes: ${this.srcBytes}, dstBytes: ${this.dstBytes}, srcPkts: ${this.srcPkts}, dstPkts: ${this.dstPkts}}`
  }
}

Flow.fields = {
  id: attr(),
  start: attr(),
  end: attr(),
  srcIp: fk('Ip'),
  dstIp: fk('Ip'),
  proto: attr(),
  srcPort: attr(),
  dstPort: attr(),
  srcBytes: attr(),
  dstBytes: attr(),
  srcPkts: attr(),
  dstPkts: attr(),
}
