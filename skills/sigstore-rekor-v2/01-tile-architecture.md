# 01 - Tile-based log architecture

Scope: how Rekor v2 (rekor-tiles) structures its transparency log as many small Merkle tree tiles, what each tile carries, and why the tile model replaced the single-tree design of Rekor v1.

## What Rekor v2 is

Rekor v2, also called rekor-tiles or Rekor on Tiles, is a redesigned and modernized version of Rekor, Sigstore's signature transparency log. Its headline change is a transition of the backend to a modern, tile-backed transparency log implementation to simplify maintenance and lower operational costs (https://github.com/sigstore/rekor-tiles, weight 0.81; https://blog.sigstore.dev/rekor-v2-alpha/, weight 0.81). The upstream Rekor README states the design intent directly: Rekor v1 is in maintenance mode, a new version of Rekor is actively being developed that is easier to maintain and cheaper to operate, and it builds on the active development in the Certificate Transparency ecosystem (https://github.com/sigstore/rekor, weight 0.95).

The "tiles" model is the same idea that the Certificate Transparency ecosystem standardized for large logs: instead of one monolithic Merkle tree that grows forever, the log is cut into fixed-size shards, each with its own tree and its own signed statement of what it contains. A weak-weight dig source describes Rekor Tiles as a Tessera-based implementation of the transparency log, providing signature transparency as part of the Sigstore project (https://deepwiki.com/sigstore/helm-charts/4.3-rekor-tiles-(rekor-v2), weight 0.10, weak backing). Tessera is the tile-based storage and transparency library behind the implementation; treat that specific dependency name as weakly corroborated.

## The structure of a tile

Per the source doc (yubi-OS/yubiOS skills/sigstore-rekor-v2/SKILL.md), a Rekor v2 entry is published to a tile, and a tile is a Merkle tree shard with four properties:

1. A fixed size, default 2^12 = 4096 entries per tile, configurable per deployment.
2. A witness quorum (default 2-of-3; Sigstore's public deployment uses multiple independent witnesses).
3. A signed checkpoint at tile completion: the tile's witness quorum signs the Merkle root, the tile ID, and the previous tile's hash.
4. An inclusion proof for each entry: the entry's position in the tile's Merkle tree plus a path to the tile root.

Two consequences follow directly. First, there is no single global checkpoint: each tile has its own checkpoint signed by that tile's witness quorum, and an entry's inclusion proof references the specific tile it was appended to (source doc). Second, there is no single point of compromise: Rekor v1 had a single root key whose compromise would invalidate the entire log, while Rekor v2's per-tile witness quorum means a witness compromise can only invalidate that tile, not the whole log (source doc).

A weak-weight dig source confirms the operational direction of this model from the monitoring side: the Rekor v2 consistency check differs from v1 by interacting with a sharded log environment and using the rekor-tiles library; the monitor must identify the correct shard, fetch a signed checkpoint, and verify against it (https://deepwiki.com/sigstore/rekor-monitor/2.2-rekor-v2-consistency-checking, weight 0.10, weak backing).

## How the API surface stayed compatible

Rekor exposes a REST API-based server for validation plus a transparency log for storage, and a CLI application to make and verify entries, query the log for inclusion proofs, and run integrity verification (https://docs.sigstore.dev/logging/overview/, weight 0.94). The tile restructure changed the storage backend, not the client contract: clients using the publicly distributed SigningConfig and TrustedRoot files transition to Rekor v2 automatically and seamlessly (https://blog.sigstore.dev/rekor-v2-ga/, weight 0.83).

The live deployment is probeable: the Sigstore project runs filesystem consistency probers (a tiles-fsck) against Rekor v2 logs, which unlike traditional Certificate Transparency logs use a tiles-based storage format rather than a single linear Merkle tree (https://deepwiki.com/sigstore/sigstore-probers/3.4-tiles-merkle-tree-prober, weight 0.09, weak backing). This is corroborating context for the sharded structure, not an operational dependency for yubiOS.

## What changed vs v1 at the storage layer

Three deltas are worth holding onto:

1. One tree becomes many. Rekor v1 had a single append-only log with one Merkle tree per checkpoint; Rekor v2 shards the log across many small Merkle trees, and the global state is the sum of all active tiles (source doc).
2. One key becomes a quorum per tile. The v1 single root key is replaced by a witness quorum signing each tile's checkpoint (source doc; https://github.com/sigstore/rekor, weight 0.95 for the maintenance-mode framing).
3. Cost and maintenance improve. The redesign was explicitly motivated by making the log cheaper to run and simpler to maintain (https://blog.sigstore.dev/rekor-v2-alpha/, weight 0.81; https://github.com/sigstore/rekor, weight 0.95).

## yubiOS implications

For yubiOS pipelines that publish attestations, the tile model is invisible at the API layer: you publish to a tile via cosign or the Rekor v2 client, and verification references a tile-scoped inclusion proof. What changes operationally is failure analysis: a transparency-log incident can now be scoped to one tile and its witnesses instead of the whole log. The default tile size of 4096 entries matters only for private deployments choosing their own sizing; the source doc marks it configurable per deployment.
