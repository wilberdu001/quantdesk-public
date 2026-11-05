# Open-session execution validation — November 5, 2026

This independently curated report contains derived results only. Raw licensed quotes, account identifiers, production snapshots and private strategy details are excluded.

A disposable simulated account with a USD 2,000 virtual budget was observed during an actual open market session. With the platform page unloaded, a real server scheduler bought two shares. Subsequent scheduler cycles advanced the heartbeat without another entry. The independently recomputed marked equity matched the stored bot equity with a USD 0.00 difference.

After an explicit pause, two manual one-share simulated exits tested partial cost allocation and cleanup. Three orders incurred USD 3.00 commission, USD 0.185 spread costs and USD 0.28 adverse slippage costs. Market midpoint movement contributed USD 0.825. Net P&L reconciled to 0.825 - 0.185 - 0.28 - 3.00 = USD -2.64; final cash was USD 1,997.36. Entry fees were included in cost basis and allocated proportionally on partial exit. All order sizes were within observed visible quantities.

The cost assumptions were 2 basis points of adverse slippage, conservative cent rounding, and USD 0.005 per share with a USD 1 minimum per order. Spread and slippage were included in fill prices rather than deducted again. The temporary bot was paused, all positions closed, and the experiment archived with its budget released.

Observed: actual scheduled entry, persistence across page unload/reload, multiple-cycle entry deduplication, fee-inclusive accounting, partial manual exit and final cleanup. Not observed: an automatic sell signal, stop-loss or drawdown exit, cross-deployment recovery during this run, or simultaneous cross-account liquidity contention. No new code defect was found; no redeployment was needed.

This is a small engineering validation of simulated execution from a single-exchange feed. It is not consolidated NBBO execution, broker fill evidence, or a claim of profitable trading. The standalone public demo remains synthetic and does not expose private market-data access.
