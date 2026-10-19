# Isolated strategy books

The private platform adds a separate paper research budget pool. Allocation is capped, each strategy book owns its cash, fee-inclusive cost basis, inventory, realized P&L and immutable order audit. Existing manual ledgers remain separate.

A session-scoped server command carries a unique id and expected revision. One conditional database update commits the book and its receipt together. Repeated identical commands replay their receipt; conflicting payloads or revisions fail. Quote consumption is shared across strategy books so multiple strategies cannot reuse the same visible quantity. No broker order endpoint is used.

Verification covers cash conservation, partial-exit fee allocation, overdraw/short rejection, account isolation, stale updates and idempotency. A constant-midpoint synthetic round trip at bid 99.90 / ask 100.10 for 100 shares ends at -27 dollars after 2 bp adverse slippage, conservative cent rounding and one-dollar commission per order. A loss in a flat market is the expected result.
