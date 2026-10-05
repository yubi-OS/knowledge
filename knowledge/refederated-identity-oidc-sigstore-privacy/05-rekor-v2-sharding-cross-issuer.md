# Rekor v2: Tile Sharding and Cross-Issuer Attestation

Scope: Rekor v2 tile-based transparency log model: sharding that can hold entries from multiple issuers, witness quorum configuration recognizing multiple CA roots, and the Rekor v1 versus v2 difference for cross-issuer attestation.

## What Rekor v2 is

Rekor v2, "aka rekor-tiles or Rekor on Tiles, is a redesigned and modernized Rekor, Sigstore's signature transparency log, transitioning its backend to a modern, tile-backed transparency log implementation to simplify maintenance and lower operational costs" [1] [2]. The Sigstore project's alpha announcement makes the same point: Rekor v2 is "transitioning its backend to a modern, tile-backed transparency log implementation" [3]. The backend switch is concrete: Rekor v2 "uses the tile-based Tessera storage architecture instead of the Trillian Merkle tree backend used by Rekor v1" [4] (weak backing, 0.23).

Rekor v1 remains a full transparency-log service in its own right: it "fulfils the signature transparency role of sigstore's software signing infrastructure" but "can be run on its own and is designed to be extensible to working with different manifest schemas and PKI tooling" [5]. The Rekor docs describe the service surface that both generations share: "a restful API-based server for validation, and a transparency log for storage", plus a CLI to verify entries, query inclusion proofs, check integrity, and retrieve entries [6].

## Sharding and multi-issuer logs

A tile-backed log stores its entries in fixed-size tiles addressed by index, which is what makes the log cheap to operate and independently verifiable. The design property that matters for refederation is structural: the log is a sequence of signed tree heads over an append-only entry stream, so entries made under different OIDC issuers coexist in the stream without the log itself asserting anything about their relationship. There is no log-level cross-issuer correlation unless verification policy creates one. That is the mechanism behind the claim that a tile-based log "can hold entries from multiple issuers without a single log-level cross-issuer correlation": the log records; the verifier's trust configuration decides which issuer roots make an entry trustworthy.

The practical constraint sits in the witness configuration: entries from multiple issuers compose cleanly only if the parties verifying the log recognize all the issuers' CA roots in their trust setup.

## Witness quorum and checkpoint cosignature

Tile-backed logs inherit the transparency ecosystem's witness machinery. The transparency-dev witness "verifies that logs are evolving in an append-only manner and counter-signs checkpoints that represent an append-only evolution from any previously witnessed checkpoints", and "these witnessed checkpoints can be consumed by clients that want protection against split-views" [7]. Checkpoints are multi-signature by design: "a common way to see Checkpoints in a witnessed ecosystem is with a log signature and multiple witness signatures" [8].

The C2SP tlog-cosignature specification defines the contract: "a cosignature is a statement by a cosigner that it verified the consistency of a checkpoint. Log clients can verify a quorum of cosignatures to prevent split-view attacks before trusting an inclusion proof" [9]. For a multi-issuer deployment, the witness quorum is therefore the policy point: which witnesses watch the log, and which CA roots the verification policy recognizes, together determine whether a refederated issuer's entries are acceptable.

## Rekor v1 versus v2 for refederation

The operative differences for a refederation scenario:

1. **Backend and verification model.** v1 runs on Trillian's Merkle tree [4] (weak backing, 0.23); v2 runs on Tessera tiles [1] [3]. Both provide inclusion proofs; the tile model is the modernized substrate.
2. **Operational cost.** The v2 design goal is to be "cheaper to run, simpler to maintain" [3].
3. **Multi-issuer composition.** Neither version correlates issuers at the log level; v2's tile model gives explicit sharding structure that keeps multi-issuer entries separable, while v1's single Merkle tree treats all entries as one stream.

In both cases, the verifier-side trust list (which issuer CA roots are accepted) is where refederation is actually decided, and the witness quorum is where split-view protection lives.

## Sources

All weights from the jev noul weighting of this corpus's dig.

1. sigstore/rekor-tiles repository, https://github.com/sigstore/rekor-tiles (0.60)
2. rekor-tiles module, pkg.go.dev, https://pkg.go.dev/github.com/sigstore/rekor-tiles/v2 (0.71)
3. Rekor v2 - Cheaper to run, simpler to maintain, Sigstore blog, https://blog.sigstore.dev/rekor-v2-alpha/ (0.90)
4. Rekor Tiles (Rekor v2), deepwiki (sigstore/helm-charts), https://deepwiki.com/sigstore/helm-charts/4.3-rekor-tiles-(rekor-v2) (0.23, weak)
5. sigstore/rekor repository, https://github.com/sigstore/rekor (0.65)
6. Rekor - Sigstore docs, https://docs.sigstore.dev/logging/overview/ (0.93)
7. transparency-dev/witness repository, https://github.com/transparency-dev/witness (0.55)
8. witness/README.md, https://github.com/transparency-dev/witness/blob/main/README.md (0.86)
9. Transparency Log Cosignatures, C2SP, https://c2sp.org/tlog-cosignature@v1.0.1 (0.66)
