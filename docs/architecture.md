# Architecture

## Complete platform (private)

```mermaid
flowchart LR
  Provider[Market data adapters] --> Guard[Source time / session / delay checks]
  Guard --> Planner[Bid / ask execution planner]
  Strategy[Private strategy engine] --> Planner
  Planner --> Ledger[Paper ledger and fee allocation]
  Ledger --> Metrics[Net robot and portfolio metrics]
  Ledger --> State[Versioned account persistence]
  UI[Browser UI] --> Strategy
  UI --> State
  API[Authenticated API] --> State
```

The browser frontend coordinates simulated trading and analysis; an API service handles market-data adapters, authentication and versioned state persistence. Simulated-data and market-data accounts are isolated. This high-level diagram deliberately omits deployment identifiers, private strategies and internal framework implementation.

## This repository (public)

```mermaid
flowchart LR
  Inputs[Synthetic reference quote + controls] --> Planner[src/execution.js]
  Planner --> Demo[Interactive cost breakdown]
  Planner --> Tests[Boundary tests]
  Planner --> Experiments[Deterministic scenarios]
  Experiments --> Results[Committed results JSON]
```

The public build has no backend, external data connection, credentials, user data or broker integration. `scripts/serve.mjs` is an optional localhost static server. The demo imports only the public planner and reads the user's illustrative inputs.
