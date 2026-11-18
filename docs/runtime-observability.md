# Separate scheduler liveness from strategy progress

A scheduler heartbeat answers whether an account-level scheduling window was committed. It does not prove that every strategy was evaluated, that a signal existed, or that an order filled. A useful paper-trading interface exposes these facts separately.

| Observation | Interpretation | Safe interface behavior |
|---|---|---|
| Recent heartbeat, recent strategy evaluation | The committed snapshot contains recent progress | Show the evaluation time; do not promise a fill |
| Recent heartbeat, old strategy evaluation | Account scheduling and strategy progress disagree | Highlight the individual strategy and suggest inspecting its logs |
| Strategy is paused with a recorded reason | The snapshot contains an explicit reason | Display that reason without automatically resuming |
| Strategy is paused without a recorded reason | Historical causality is unknown | Say the cause was not recorded; do not blame a release or risk limit |
| Connection fails | The browser cannot confirm the current state | Label the last confirmed snapshot; avoid claiming the server stopped |
| Timestamp is ahead of the client clock | Clock skew can invalidate age calculations | Request a clock check instead of reporting healthy progress |
| Snapshot cannot be decoded | The interface cannot determine strategy count | Report unavailable data rather than an empty account |

For a synthetic example, an account heartbeat may be 30 seconds old while a strategy evaluated ten minutes ago. If that strategy is configured to evaluate every five seconds, its progress deserves attention. If its interval is ten minutes, the same age can be expected. The threshold must include the configured interval and a scheduling allowance.

This diagnostic can be derived from the existing committed snapshot and normal status refresh. It needs no additional market-data polling, persistent status history, order submission, or full trade-archive download. Escape all strategy-supplied text before rendering it, and retain disclosure state when refreshing the interface.

These are generic observability methods for synthetic paper-trading systems. This document contains no production snapshots, account identifiers, private strategies, credentials, or evidence of live trading profitability. A read-only status panel cannot recover a historical pause cause that was never recorded.
