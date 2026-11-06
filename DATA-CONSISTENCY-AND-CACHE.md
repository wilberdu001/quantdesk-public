# Data consistency and cache efficiency

The complete private platform now refreshes daily and five-minute provenance together through its canonical historical loader. Each interval reports its own failure; failed reloads clear obsolete provenance rather than presenting old metadata as verified. Stock and ETF history retains a single provider/feed/adjustment contract, while quotes and completed trade bars remain distinct price types.

Two bounded engineering changes reduce redundant work without deleting account history:
- The browser request cache removes expired entries during access and retains at most 64 historical datasets. This cap does not claim to bound all browser heap usage or active chart references.
- Concurrent misses for the same complete cache key share upstream work inside one server instance. Credential-scoped identities remain separate, failures release the pending entry, and later attempts may retry. This does not imply coordination across instances or regions.

Controlled private regression scenarios verify both intervals refresh, one interval can fail without discarding the other, 70 distinct historical requests retain 64 cache entries, and two simultaneous identical misses execute upstream work once. Distinct owner keys and retry-after-failure are checked independently. These are reproducible correctness/resource-contract results, not measured production latency, CPU or memory savings.

The public demo remains synthetic and contains no private market-data access, licensed snapshots, account identifiers, unpublished strategies or deployment credentials. This document is independently curated; the private implementation and its history are not copied into this repository.

## Bounded public-endpoint retention

A separate browser cache for public endpoint results and errors is now capped at 96 entries. Access removes expired entries; a hit promotes retention priority without modifying its collection time. Successful results retain caller-defined freshness limits, and errors keep the existing 30-second cooldown. Pending identical requests still share work.

Controlled regression scenarios cover mixed success/error capacity, hot-entry retention, oldest-entry eviction, unchanged collection timestamps, retry after cooldown, concurrent request sharing and expired-entry removal. These generic methodology results do not disclose authenticated production metadata or claim measured production heap/CPU savings. User-authored notes and trading history are not a request cache and must not be deleted as a cache optimization.
