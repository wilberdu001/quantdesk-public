# Data consistency and cache efficiency

The complete private platform now refreshes daily and five-minute provenance together through its canonical historical loader. Each interval reports its own failure; failed reloads clear obsolete provenance rather than presenting old metadata as verified. Stock and ETF history retains a single provider/feed/adjustment contract, while quotes and completed trade bars remain distinct price types.

Two bounded engineering changes reduce redundant work without deleting account history:
- The browser request cache removes expired entries during access and retains at most 64 historical datasets. This cap does not claim to bound all browser heap usage or active chart references.
- Concurrent misses for the same complete cache key share upstream work inside one server instance. Credential-scoped identities remain separate, failures release the pending entry, and later attempts may retry. This does not imply coordination across instances or regions.

Controlled private regression scenarios verify both intervals refresh, one interval can fail without discarding the other, 70 distinct historical requests retain 64 cache entries, and two simultaneous identical misses execute upstream work once. Distinct owner keys and retry-after-failure are checked independently. These are reproducible correctness/resource-contract results, not measured production latency, CPU or memory savings.

The public demo remains synthetic and contains no private market-data access, licensed snapshots, account identifiers, unpublished strategies or deployment credentials. This document is independently curated; the private implementation and its history are not copied into this repository.
