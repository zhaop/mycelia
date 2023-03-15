# Network visualization

Displays network flows in real-time.

## Requirements

Node.js >= 8 and NPM >= 5

## Configure

Have a Bro/Zeek/Corelight connection log in CSV format. It should at least have these headers:

- uid, ts, duration, id.orig_h, id.resp_h, proto, id.orig_p, id.resp_p, orig_bytes, resp_bytes, orig_pkts, resp_pkts

A sample file is available in `data/maccdc2012.tar.gz` (taken from https://www.secrepo.com/).

## Build & run locally

* Run the CSV streamer to stream a CSV file over time. It pretends to be a server streaming flow data in real-time. For example:

```
tools/csvstreamer.py data/maccdc2012.tar.gz 8000 --dump
```

* Edit `backend/config.js` so it matches your data source.

* Run `npm install` and `npm start` which will start a server on port 8080 by default. To override the port number run `PORT=1234 npm start`.

* Open `http://localhost:8080`, sit back and enjoy.

## Development

* Start the streaming server (csvstreamer), and make sure `backend/config.js` matches your streaming server.

* Run `npm run backend` to start the server part. It will connect to the streaming server and start processing the data.

* Run `npm run frontend` in another terminal. It will build the frontend application and watch for changes in the source code and automatically re-executes the code in the browser that has the application open.

## Yas (internal query language)

Yas is a language used internally to query flows; it is currently used to filter flows. To develop the language further, install ANTLR with `apt-get install antlr4` and edit `frontend/yas/Yas.g4`.

To compile the grammar file, run `frontend/yas/mk`.

Currently, the runtime for Yas executes a Yas expression over a Flow object, substituting the variables by values derived from the Flow, and returns a Boolean. It is defined in `frontend/graph-worker.js`.

### Types

Yas currently supports expressions of these 3 types:

- bool: boolean, e.g. `true`, `false`
- int: non-negative integer, e.g. `42`, `2M`
- intSet: non-empty set of ints, e.g. `[2, 5, 3]`

int literals can optionally have a suffix that multiply the preceding number by a power of 1000: k, M, G, T, P, E, Z, Y.

Sets are like arrays, except elements must be unique, and order doesn't matter (`[2, 3] = [3, 2]`).

### Variables

Predefined variables are substituted by their respective values at run-time.

- bool `tcp`: whether flow is TCP
- bool `udp`: whether flow is UDP
- int `duration`: how long the flow lasted (in ms)
- intSet `packets`: the set of (source packets, destination packets) (TODO: should be a "list", not a set)
- intSet `ports`: the set of (source port, destination port) in the flow

### Operators

Operators transform one or more expressions into another equivalent expression. Listed below in approximate order of precedence, "tightest" operators first. Use parentheses to change precedence.

- Comparison/membership: `a (<|<=|=|!=|>=|>|(not)? in) b`
	- `<` `<=` `=` `!=` `>=` `>`: infix; compares two ints; e.g. `3 <= 42` is `true`
	- `3 not in [2, 4]` is `true`
	- `3 in [2, 3]` is `true`
	- `=` `!=`: infix; compares two intSets; e.g. `[2, 3] = [3, 2]` is `true`
- Bool operations: `a (and|or) b`
	- `2 < 3 and 3 < 6` is `true`
	- `false or true` is `true`
- Reductions: `(max|min|sum) a`
	- `max [2, 3]` is `3`
	- `min [2, 3]` is `2`
	- `sum [2, 3]` is `5`
	- `sum [2, 2, 2, 2, 2]` is `2`!
- Set operations:
	- `[2, 3] - [3]` is `[2]`
	- `[2, 3] & [3]` is `[3]`
	- `[2, 3] | [3, 4]` is `[2, 3, 4]`
- Quantifiers: `(all|any) a (<|<=|>|>=|(not)? in) b`
	- `all [2, 3] < 4` is `true`, `all [2, 5] >= 4` is `false`
	- `any [2, 5] > 4` is `true`, `any [3, 4] <= 2` is `false`
	- `all [1] in [1, 2]` is `true`, `all [1, 2] in [1]` is `false`
	- `all [1, 2] not in [3, 4]` is `true`, `all [1] not in [1, 2]` is `false`
	- `any [1, 2] in [2, 3]` is `true`, `any [1, 2] in [3]`is `false`
	- `any [1, 2] not in [2, 3]` is `true`, `any [1, 2] not in [1, 2, 3]` is `false`
- Negation: `not a`
	- `not false` is `true`

## Architecture

The main files you're interested in are `backend/index.js`, `frontend/graph-worker.js`, `frontend/index.js`, `frontend/visualization.js`.

The backend's job is to query the data source, buffer the data in memory, and stream it to clients. Currently, it only handles flow data in the form of CSVs from Bro's connection logs.

The frontend's graph worker thread (`frontend/graph-worker.js`) receives the data stream from the server, computes the *changes to* the current graph, and outputs those changes.

The frontend's main thread (`frontend/index.js`) builds and manages the user interface. It receives the changes to the graph from the graph worker, and sends them to the `Visualization` instance.

The Visualization instance on the main thread (`frontend/visualization.js`) draws the graph and handles interaction with the graph. It uses the cytoscape.js library for the low-level drawing.

## Misc

### Streaming data from a real-time source

Use HttpCsvStreamer to connect to a "real" HTTP endpoint.

### Future directions

There are a few paths to take from here.

* Add better layout algorithms: better ways to position the nodes (frontend/visualization.js)

* Add & show other data sources, like alerts (backend, frontend/graph-worker.js, frontend/visualization.js)

* Add ability to switch NodeAggregator & EdgeAggregator functions from the UI (frontend/flow-graph.js, frontend/index.js)

* Write own graph rendering library that uses WebGL; replaces cytoscape.js (frontend, WebGL)

* Add more ways to color the graph (frontend/index.js, frontend/visualization.js)

* Find ways to pass more information from graph worker to main thread, probably through the node.value & edge.value fields (frontend/flow-graph.js, frontend/graph-worker.js, frontend/index.js)