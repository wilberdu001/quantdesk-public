# Durable teaching simulations

This case study describes a synthetic teaching workload. It is separate from live-market paper execution. No private strategy, account record, production identifier or market-data permission is included.

## One authoritative writer

Browser timers stop when a page closes or the computer sleeps. Persisting a `running` label cannot make a browser timer a server process. The runtime therefore transfers ownership of a reviewed, versioned snapshot to the scheduler. The snapshot contains the existing teaching book, robot configuration, custom definitions and synthetic prices. Adoption does not reset cash or start deliberately paused robots.

The scheduler commits a completed minute with a revision compare-and-swap. A stale worker may compute, but cannot overwrite a newer manual command or commit the same minute twice. A database transaction includes the authoritative revision and new order archive records. Missing minute windows are not replayed as invented fills.

```mermaid
stateDiagram-v2
  Browser --> Server: saved versions match
  Server --> Server: scheduled minute / revision CAS
  Server --> Server: authenticated command / idempotency receipt
  Server --> Browser: all robots paused / atomic handback
```

Old browser writes are fenced inside the database write statement, including old requests with otherwise valid versions. Other account preferences and the separate market-data environment remain independent. A return to browser control atomically publishes the latest entries and advances their legacy revisions.

## Shared code, separate models

The teaching runner builds its strategy and matching code from the browser sources at build time. It does not use runtime `eval` or copy unpublished strategy definitions into this showcase. The browser displays committed synthetic prices rather than advancing a second market. The private build checks that the generated engine matches its source.

Synthetic random market-making remains an educational probability model. Moving that model to a server does not establish real-market profitability, actual liquidity or a brokerage execution record.

## History without repeated storage

The visible recent-order list remains bounded. A separate append-only archive preserves its previous entries and subsequent terminal orders, including expired pending orders. Content identity avoids re-storing identical records and preserves distinct trades whose legacy numeric IDs may repeat after an explicitly requested reset. Only new terminal records are considered after the initial archive pass. No historical records are deleted to reduce storage.

## Verification boundaries

Local verification used the actual Worker runtime and an isolated persistent database through ordinary authenticated endpoints. A disposable teaching book retained an existing position, historical order and custom definition while signal and market-making robots executed. The teaching page was actually closed. After a local runtime restart, another scheduling invocation advanced the persisted state without repeating the original signal entry. Cash was independently reconstructed from archived fills. The disposable robots were paused, positions closed and state returned without resetting the account.

Local scheduler invocations are not evidence of a production cron or real-market execution. Production evidence is reported separately below. The standalone public example models the revision and ownership contract; it is not an account service or robot implementation.

See [the pure ownership example](../src/scheduled-owner.js) and [its tests](../tests/scheduled-owner.test.mjs). Run `npm test` without dependencies or credentials.


## Handoff races found before production rollout

Additional synthetic regression work found two browser handoff defects before this candidate was deployed: an adoption request could continue after an account switch, and a committed server snapshot could discard an unsaved local book without preserving a recovery copy. The private candidate now checks the account generation after each asynchronous boundary. It freezes local teaching computation and mutations during adoption, preserving deliberately running robot statuses. An uncertain acknowledgement retains the original command and keeps the browser fenced until server ownership is confirmed.

Unsaved conflicting records are preserved in account-scoped recovery storage before replacing the display cache. A late response from the legacy save endpoint cannot restore an old book over the authoritative snapshot. Six additional regressions cover these boundaries; the final private suite has 143 passing checks. These are synthetic regression results, not production cron or live-market evidence.


## Production verification — 2026-11-16

The completed rollout used ordinary authenticated endpoints in two clearly marked disposable teaching accounts. The test accounts had no open browser page or browser trading loop. Genuine scheduled production invocations, not manual cron calls, produced the fills. The earlier local test had separately closed the actual browser tab before checking persistent restart recovery.

Across production versions, the corrected experiment grew from 6 archived records to 61. The signal strategy entered once throughout, while the synthetic market-making workload grew from 4 to 59 fills. Prior archive prefixes were unchanged, robot statistics and evaluation times advanced, and cash, weighted cost, realized and unrealized P&L, equity and robot performance were independently reconciled. A separate full-universe check advanced all 148 synthetic symbols over multiple scheduled minutes, including symbols without robot positions. Both experiments finished paused, flat and handed back with history retained.

The observation exposed a real precision defect: rounding each partial exit before accumulation can introduce a one-cent difference. Buying one share at each of $100.00, $100.02 and $100.02 costs $300.04; three exits at $100.03 return $300.09. The total gain is $0.05. Rounding each fractional-cost exit to $0.02 incorrectly reports $0.06. Future robot accumulation now uses the full-precision cash P&L delta and rounds only for display. Existing records and historical statistics are preserved, rather than retroactively rewritten.

The final private release passed 143 platform tests, 39 live resource/interface checks and 9 isolated-account checks. Repeated account creation reached the normal registration rate limit; verification then logged into and retained an existing marked teaching fixture. No authentication, rate limit or market-data permission was bypassed. The separately curated public examples retain 12 passing tests.

These are synthetic teaching results. They do not establish live-market profitability, real market-making liquidity, brokerage execution or completion of a separate live-session market-data audit.
