# docs/adr - the yubiOS ADR spine corpus

A knowledge corpus explicating the yubiOS Architecture Decision Record spine. Ground source: `yubi-OS/yubiOS docs/ADR.md` (64,341 B, last reviewed 2026-07-21). The corpus deepens the source doc; it does not replace it. Every claim in the docs is attributed either to the source doc or to a searXNG dug source carrying a jev weight (noul probability; 0.5 or higher counts as authoritative backing, below 0.5 is labeled weak).

## Docs

1. [01-trust-anchor-identity.md](01-trust-anchor-identity.md) - YubiKey 5 as sole trust anchor, ed25519-sk resident SSH keys, pam-u2f 1.3.1 floor (ADR-001, 004, 005).
2. [02-disk-encryption-unlock.md](02-disk-encryption-unlock.md) - LUKS2 FIDO2 unlock, homed per-user homes, HMAC-secret over PCR binding (ADR-003, 009, 011).
3. [03-secure-boot-signing.md](03-secure-boot-signing.md) - PIV slot 9c over CCID, systemd-sbsign over sbsigntools (ADR-002, 008).
4. [04-immutable-root-partitioning.md](04-immutable-root-partitioning.md) - dual mkosi/bootc paths, composefs plus dm-verity, DPS, first-boot repart (ADR-006, 007, 010, 012).
5. [05-updates-ab-lifecycle.md](05-updates-ab-lifecycle.md) - sysupdate A/B with Boot Assessment, kernel plus rootfs split (ADR-013, 032).
6. [06-build-substrate-supply-chain.md](06-build-substrate-supply-chain.md) - rootless Buildx, digest pinning, bake plus rego, unified tags, reproducibility gates (ADR-014, 015, 022, 026, 030).
7. [07-arm64-secure-world.md](07-arm64-secure-world.md) - ARM64 primacy, TF-A/OP-TEE/fTPM/U-Boot stack, Path A vs Path B, ROCK 5B (ADR-017 to 021, 023, 029).
8. [08-gpu-trust-boundary.md](08-gpu-trust-boundary.md) - virtio-gpu default, vfio-user preferred, IOMMU gate, 4-tier cutoff ladder (ADR-031, 033).
9. [09-governance-version-tracking.md](09-governance-version-tracking.md) - status lifecycle, amendments, PINNED.md rule, v261 adoption, drift checks (ADR-016, 024, 025, 028, process mechanics).

## Research summary

- Results collected: 114 (19 searXNG queries across 9 subtopics; 18 seed queries plus 1 redo query pair for subtopic 03; top 6 kept per query).
- Weight split: 11 high (>= 0.5) / 103 low (< 0.5) of 114, 0 unweighted. The dig layer returned mostly aggregator pages, so most docs lean on the source doc plus the handful of primary sources the dig surfaced; weak results are labeled in the text.
- jev requests: 10 (1 score outline validation + 9 noul weighting batches of 13), usage 14167 input / 2341 output tokens, all via api.defapi.org (DefAPI direct, speed optimization 1) with the worker relay unused.
- Redo counts: 1 dig redo (subtopic 03, query 2 returned 0 raw results; 2 replacement queries both returned results). 0 decide redos (no DefAPI failures).
- Skipped docs: none. All 9 outline subtopics scored >= 0.86 on the 0 to 2 load-bearing legend (none at padding level; the outline validation interpretation rule is recorded in research-db/outline.json) and all 9 dug well enough to author.

## Sources considered per doc

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01-trust-anchor-identity.md | 12 | 3 |
| 02-disk-encryption-unlock.md | 12 | 0 |
| 03-secure-boot-signing.md | 18 | 3 |
| 04-immutable-root-partitioning.md | 12 | 1 |
| 05-updates-ab-lifecycle.md | 12 | 0 |
| 06-build-substrate-supply-chain.md | 12 | 1 |
| 07-arm64-secure-world.md | 12 | 1 |
| 08-gpu-trust-boundary.md | 12 | 2 |
| 09-governance-version-tracking.md | 12 | 0 |

## Preflight

Preflight 2026-10-06: campaign preflight healthy (orchestrator); agent-side probe skipped for speed (MINT-BRIEF-DOCS speed optimization 3); decide weighting via api.defapi.org DefAPI direct, worker relay as fallback (unused).

## Gaps

- The dig layer is anonymous HTTP and returned few primary systemd man page hits (several scored 0.3 to 0.48, just under the 0.5 line); those are labeled weak in the docs even where they corroborate source-doc claims.
- ADR-026's `passless --version` CI assertion, ADR-033's OMN-144 to OMN-147 thread contents, and the refs/ companion documents referenced by the source doc are internal records; they are described only as the source doc states them, without external verification.
