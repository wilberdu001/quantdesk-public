# Account state consistency

Two defects can misrepresent a paper account even when execution costs are correct.

## Cached inventory after an external exit

A legacy browser robot can retain an inventory cache after the shared account has exited. Showing that cache as a live position creates fictitious floating P&L. The repaired private platform uses a read-only projection: confirm signed quantity, cost and attribution against the current ledger before displaying floating value. A flat ledger displays flat inventory. An ambiguous non-flat ledger displays a reconciliation requirement and cannot be closed through the stale robot card.

Historical fills, realized statistics, fees, logs, equity history and strategy definitions remain unchanged. An external fill is not silently assigned to a robot. A historical inventory reference is distinct from a current holding. Current equity can change when fictitious floating value is removed; historical realized statistics are not reset.

## A lost save acknowledgement

A versioned write can commit while its response is lost. A retry with the old version will then receive a conflict containing the very value it submitted. That is an acknowledgement of the submitted snapshot. Advance its version; clear the dirty flag only if no newer edit was made in flight. Otherwise send the newer edit with the acknowledged version.

A different server value is a genuine conflict. Preserve a recovery copy and avoid overwriting it blindly. Reload only the affected domain: a synthetic market snapshot conflict must not reload an unrelated ledger with pending orders. A conflict in an inactive data mode must not replace the current mode's account.

## Verification boundary

The private regression suite tests both robot types, flat and ambiguous inventory, stale close controls, lost acknowledgements, in-flight edits, genuine conflicts, mixed batches and mode isolation. The small public [synthetic model](../src/state-consistency.js) demonstrates the decisions without authentication, persistence, broker access or private account data. It is not a full synchronization service. Production records, strategy definitions and infrastructure identities are excluded.
