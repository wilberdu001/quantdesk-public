# Execution-cost experiment

## Question

Can a paper engine appear profitable because it ignores spread and transaction costs? This experiment isolates execution friction without introducing a strategy or changing the market midpoint.

## Controls

- Fixed midpoint: $100; valid, explicitly synthetic quote clock.
- Share counts: 10, 100, 1,000.
- Total spread: $0.02, $0.20, $1.00.
- Identical midpoint on entry and exit.
- Entry at ask and exit at bid, each adjusted adversely by 2 bp and rounded against the trader to cents.
- Commission: $0.005 per share, minimum $1 per order.
- Synthetic visible quantity: 100,000 per side. No actual market liquidity is implied.

The script reports midpoint-only P&L, spread cost, slippage cost, commissions, and net P&L for all nine scenarios. The cost decomposition must reconcile to the cash loss. Inputs and result ordering are deterministic; no random seed or external service is needed.

## Findings and scope

Every flat-midpoint scenario loses money after friction. For 100 shares with a $0.20 spread, net P&L is −$27. These results establish accounting and execution properties, not predictive power. They do not demonstrate that any private strategy is profitable.

## Failure cases

Tests reject delayed or expired data, future timestamps beyond tolerance, crossed quotes and insufficient size. They also check that consumed quantity is not available again when the same quote timestamp is reused.

There is deliberately no attempt to reconstruct fills from a last-trade price or to invent a fixed spread when a quote is absent. A supplied timestamp is a caller responsibility; the planner cannot verify a provider's clock independently.

## Next research steps

Validate independent event timestamps and data licensing, model queue position and partial fills, compare modeled costs with an execution simulator, and perform out-of-sample strategy evaluation in the private research project. None of these are claimed as completed by this public demonstration.
