# Verifying a persisted paper robot during an open session

The private application was exercised with a separately labelled disposable virtual account during an open exchange session. The platform page was unloaded before a real server scheduler cycle produced a paper entry from the normal daily moving-average policy. No brokerage order was sent. This page publishes the verification method, not a licensed market-data snapshot or a strategy performance result.

## Evidence boundaries

- A fresh quote is evidence of a working data connection, not evidence of a trade.
- A manually requested paper fill tests execution and accounting, not autonomous scheduling.
- A scheduled fill after unloading the page establishes server execution. Persisted heartbeats and an unchanged order count across later cycles test continuity and duplicate prevention.
- A deployment while a disposable position exists tests recovery from persisted state. It does not prove recovery from every infrastructure failure.
- Record market event time separately from collection time. Historical completed trade bars and live quote midpoints have different meanings even when their provider is shared.

## Defect found: a pre-fill mark persisted after a fill

The account ledger correctly charged commission, spread and slippage, but the robot's saved equity mark described the account immediately before its order. This could temporarily overstate the displayed value until the next scheduled cycle. The repair recomputes the mark from post-fill cash and remaining inventory at the same quote midpoint. It leaves the quote, execution assumptions and strategy unchanged.

The accounting invariant is:

```text
saved_equity = post_fill_cash + remaining_shares * quote_midpoint
```

A fully synthetic regression case makes the defect reproducible without private market data: start with $20,000, bid $99.90, ask $100.10 and a 99-share entry. With adverse 2 bp slippage and conservative cent rounding, the fill is $100.13 per share plus a $1 fee. Cash becomes $10,086.13 and inventory marked at the $100 midpoint is $9,900. Saved equity must therefore be $19,986.13 in that same cycle. The regression also covers a partial risk exit and the final flattening fill.

## Reconciliation and cleanup

Independently replay fills in cents, charge the fee floor per order, include entry fees in basis, allocate basis once across partial exits, and reconcile cash, realized P&L and remaining inventory. Keep market movement separate from half-spread, adverse slippage and commission; a real quote-driven experiment need not have the same loss as a constant-price synthetic example.

Finish by pausing the disposable robot, explicitly flattening with a valid quote, then archiving only after inventory is zero. Preserve redacted assertions and aggregate results rather than publishing raw quotes, account identifiers, credentials, infrastructure identities or internal strategy history.

This exercise validates engineering behavior in one observed session. Paper fills, single-exchange coverage and visible quote quantities do not establish executable real-market profitability.

## Observed outcomes and remaining limits

The October 19, 2026 exercise observed two scheduled paper entries in separate disposable virtual books. Eight paper fills, including explicit manual cleanup exits, reconciled independently. Both robots were paused and both books were flat and archived at completion. The corrected entry mark agreed with the ledger in its execution cycle, and later scheduler cycles did not duplicate the entry. A separate interface regression protects an expanded robot configuration from automatic refresh, including a refresh already in flight when editing begins.

The final private release passed 99 automated checks, 38 live checks and nine isolated-account checks; this public demonstration passed its eight tests. Automatic signal exits and stop-loss exits were not triggered during the observed session. Their synthetic regressions must not be described as observed live exits. No raw licensed quote records or private account snapshots are distributed here.
