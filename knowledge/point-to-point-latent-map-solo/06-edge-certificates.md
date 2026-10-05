# 06 Edge certificates: three edge types, two check tiers, and the transparency-log path

Scope: the three edge types (atom moves, null trades, slerp bridges), each emitting a certificate that names the theorem it shadows, split into identity checks versus honest-fail measurement checks.

## The three edge types

The source record defines 3 edge types for the point map. Atom moves: a point relocating under an atom operation, certified by the delta nonnegativity identity. Null trades: curveball-style exchanges that stay on the fixed-margin fibre, certified by the fibre-preservation theorem. Slerp bridges: geodesic interpolations between placed points, certified by the program's existing slerp-geodesic statement (internal record). Each edge emits a certificate that names the Lean theorem it shadows, so a reader can ask of any drawn edge not "is this plausible" but "which theorem covers this."

## Identity checks versus measurement checks

The record's most important design split is between 2 tiers of check. Identity checks are runtime assertions on proved theorems: they must always pass, and a failure means the code is buggy, not that the data is interesting. Measurement checks (curveball z scores, the PC1+PC2 gate) may honestly fail; a failing measurement check is a result, not a bug (internal record). The split exists to defeat a named failure mode: certificate theater, where 100% pass rates look like rigor but only because the checks are tautologies. The record cites the program's own red flag, "100+ lenses all verdict YES," as the pattern to avoid (internal record).

This mirrors the general verified-computation shape: a verifier wants a prover to compute a function and prove the result correct, and the interesting question is what the certificate actually covers (https://arxiv.org/pdf/2308.15191, weight 0.78). Hardware-backed schemes make the same distinction from the other side, anchoring verification in a trusted component rather than a tautological one (https://ieeexplore.ieee.org/document/9273052, weight 0.89). Survey literature frames the space from interactive proofs to modern succinct systems (https://arxiv.org/pdf/2501.05500, weight 0.66). None of these sources is about statistics, which is the point: the record imports the verification pattern, not any specific protocol.

## Certificate content

A certificate names the theorem, the inputs it was checked against, and the check result. Because the identity layer is ordinal-keyed and the binarization rule is hashed into the map key, a certificate is reproducible: another run with the same key and the same data reproduces the same check (internal record). This reproducibility is what makes the certificates auditable rather than decorative.

## The Rekor-style second-order step

Once edges carry certificates, the record identifies the natural next step: a transparency log of certificates. It explicitly composes with the audit-evidence-packaging pattern (internal record). The concrete anchor is Sigstore's Rekor, which provides a RESTful API-based server for validation and a transparency log for storage, with a CLI to make and verify entries and to query the log for inclusion proofs (https://docs.sigstore.dev/logging/overview/, weight 0.87). Rekor is described as an immutable, tamper-resistant, transparent ledger of signatures and software metadata (https://www.sigstore.dev/, weight 0.75), and its repository documents the same client capabilities, including integrity verification of the log itself (https://github.com/sigstore/rekor, weight 0.91). The official documentation treats the transparency log as the core object (https://docs.sigstore.dev/logging/, weight 0.95). Adjacent tooling shows the attestation pattern generalizes: SLSA provenance, in-toto attestations, and SBOM attestations are all signed evidence artifacts with verification flows (https://docs.safeguard.sh/docs/attestation-signing, weight 0.70). A blog treatment of incrementally verifiable computation, the notion that a receiver can check a handover certificate in constant time, is relevant to the browser-side check cost but is weakly backed here (https://jetsamchain.com/blog/where-o1-came-from/, weight 0.43, weakly backed); the general encyclopedic entry on verifiable computing is likewise weak in this dig (https://en.wikipedia.org/wiki/Verifiable_computing, weight 0.15, weakly backed).

## What the certificates do not claim

The record is explicit about the negative space. A certificate that an edge passes the identity checks does not claim the null is adequate or the effect is genuine; those are measurement claims, and the proof file disowns them (internal record). The certificate's guarantee is exactly as wide as the named theorem. This scoping is why the design can be honest at all: every claim is either provable (identity tier), measurable with a possibly failing check (measurement tier), or not made.
