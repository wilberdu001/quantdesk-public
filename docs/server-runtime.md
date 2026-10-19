# Persisted paper robot runtime

The private implementation uses a scheduled server handler, a user-scoped paper workspace, and conditional revision updates. One minute is the intended inspection interval, not a guarantee of execution time. The browser only configures or displays state.

A cycle reads persisted bot state, verifies the designated data owner, obtains a market clock, obtains IEX quotes and completed adjusted daily bars, then evaluates a documented daily moving-average baseline. All book, liquidity, bot and audit updates commit atomically. A concurrent pause changes the revision and defeats an in-flight stale cycle. The same minute is deduplicated after restart.

Closed markets, stale/crossed quotes, history gaps and incomplete sessions produce a persisted waiting reason. Fixed allocation caps, stop-loss and peak drawdown exits apply; exits remain subject to fresh quotes and visible liquidity. Unexpected revisions to a held position's adjusted reference history pause the bot for corporate-action review rather than inventing a split adjustment. Pausing leaves inventory in place and permits an explicit manual exit.

Tests cover restart without duplicate fills, quote consumption, risk exit accounting, pause-versus-cycle races, provider failure, and market-closed heartbeats. Production closed-market continuity is separate from open-market fill validation. The system sends no broker orders, makes no profitability claim, and does not migrate legacy browser strategies automatically.

Official scheduling contract: [Cloudflare scheduled handler](https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/). Data scope: [Alpaca market data FAQ](https://docs.alpaca.markets/us/docs/market-data-faq).
