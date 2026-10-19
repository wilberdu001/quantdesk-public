# Market-data trust contract

A research interface should distinguish these signals instead of presenting a single green “live” badge:

| Signal | Interpretation |
|---|---|
| Source event time | When the provider says the market event occurred |
| Collection time | When the application retrieved it; re-fetching cannot freshen an old event |
| Price type | Trade aggregate, last trade, midpoint and executable bid/ask are different measurements |
| Coverage | A single venue is not a consolidated market or NBBO |
| Adjustment | Corporate-action adjusted OHLC must not be adjusted twice |
| Session | Native daily aggregation and regular-session intraday bars need separate labels |
| Completeness | Missing trading sessions must not be replaced by fabricated candles |
| Synthetic flag | Teaching prices and illustrative experiments must be visibly identified |

A fill also requires fresh two-sided prices, valid sizes, an open market clock, sufficient funds and unconsumed liquidity. A successful HTTP response alone proves none of those conditions.

The public cost laboratory uses explicitly synthetic quotes. It contains no account access, provider credentials, production data, deployment identity or unpublished strategy definitions.
