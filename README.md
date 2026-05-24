# Smart Logistics Routing API

A REST API for managing road networks and computing optimal routes between locations using Dijkstra's algorithm.

## Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** NestJS
- **Docs:** OpenAPI / Swagger UI (`/docs`)
- **Tests:** Jest

## Getting Started

```bash
npm install
npm run dev       # development
npm run build     # compile to dist/
npm start         # run compiled build
```

Server starts on `http://localhost:3000`. Swagger UI at `http://localhost:3000/docs`.

## Endpoints

### Upload a network

```
POST /network/upload
```

Accepts a list of edges and returns the graph ID. Stores up to 5 networks in memory (oldest is dropped when the limit is hit).

```json
{
  "edges": [
    { "from": "A", "to": "B", "cost": 10 },
    { "from": "A", "to": "C", "cost": 5 },
    { "from": "B", "to": "D", "cost": 8 },
    { "from": "C", "to": "D", "cost": 12 }
  ]
}
```

### Get nodes

```
GET /network/nodes/:id
```

Returns all nodes in the specified network.

### Optimize a route

```
POST /route/optimize/:id
```

Runs Dijkstra's algorithm and returns the lowest-cost path between two nodes.

```json
{
  "originNodeId": "A",
  "destinationNodeId": "D"
}
```

Response:

```json
{
  "graphId": "...",
  "totalCost": 18,
  "path": ["A", "C", "D"],
  "durationMs": 1
}
```

**Optional fields:**

| Field | Type | Description |
| --- | --- | --- |
| `preference` | `"shortest"` \| `"fastest"` | Switches weight between `cost` and `timeCost`. Defaults to `shortest`. |
| `constraints.avoidHighways` | `boolean` | Excludes edges marked `isHighway: true` from the graph. |

## Running Tests

```bash
npm test
```

11 unit tests covering path finding, unreachable nodes, preference switching, and highway constraints.
