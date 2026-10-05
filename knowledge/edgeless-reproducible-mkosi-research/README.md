# edgeless-reproducible-mkosi-research

Knowledge corpus minted 2026-10-05 from yubi-OS/yubiOS `refs/edgeless-reproducible-mkosi-research-2026-07-30.md`. Topic: the edgelesssys/reproducible-mkosi project: reproducible mkosi builds, its techniques, and how it compares as prior art for reproducible OS image verification.

## Docs

| NN | File | Scope |
|---|---|---|
| 01 | [01-repo-overview-status.md](01-repo-overview-status.md) | What the repo is, its layout, frozen status, and adoption signals (37 stars, 2 forks, demo-not-production clarification in issue #13) |
| 02 | [02-reproducibility-techniques.md](02-reproducibility-techniques.md) | The technique catalogue: SOURCE_DATE_EPOCH=0, repart seed, sorted cpio, CleanPackageMetadata, RemoveFiles, and the upstream PRs Edgeless authored |
| 03 | [03-two-build-verifier.md](03-two-build-verifier.md) | The diffimage.sh two-build verifier: DPS-aware partition extraction, mtree/package/verity/cmdline diffing, exit non-zero on divergence |
| 04 | [04-nix-pinned-toolchain.md](04-nix-pinned-toolchain.md) | Nix flake pinning of the toolchain and the empirical evidence for functional package management (69% to 91% reproducibility at scale) |
| 05 | [05-ci-verification-flow.md](05-ci-verification-flow.md) | The single e2e.yml daily rebuild-and-diff workflow, the moving-toolchain-pin ceiling, and un-archived live distro mirrors |
| 06 | [06-signing-attestation-gap.md](06-signing-attestation-gap.md) | The missing signing/attestation chain, the Edgeless philosophy that reproducibility substitutes for trust in the signer, and the cosign/in-toto/Rekor model Edgeless ships elsewhere |
| 07 | [07-prior-art-landscape.md](07-prior-art-landscape.md) | Flashbots mkosi-poc and flashbots-images, Jelly's Arch mkosi research, repro-get's deprecation, the btrfs dead end, and upstream --reproduce consolidation |
| 08 | [08-academic-foundations.md](08-academic-foundations.md) | IEEE Software 2021, the reproducible-builds.org index, Debian's continuous statistics, and the attestable-build-chain literature |
| 09 | [09-yubios-comparative-analysis.md](09-yubios-comparative-analysis.md) | Overlap with yubiOS, the complementary hardware-signing versus rebuild-verification trust models, and the corrected borrow list |

## Research summary

- Results collected: 108 (9 subtopics, 2 searXNG queries each, top 6 per query kept). Raw results across queries: 1080.
- Weight split: 72 results at weight >= 0.5 (primary/official), 36 below 0.5. Every shipped doc cites each claim's URL and the jev weight behind it; weak-backed claims are labeled in text.
- Jev: 47 /api/decide requests total, usage 35440 input tokens / 0 output tokens (see jev-log.json). That total includes 22 requests from a first weighting pass whose answers were discarded by an extraction bug and then redone (22 requests plus a 1-question shape probe), which pushed the count past the ~40-request budget; the redo is logged per dig.
- Redo counts: dig queries 0 redos. Weighting pass: 1 full redo round (all 108 results re-weighted, none dropped unweighted).
- Skipped docs: none. All 9 subtopics authored. Outline validation dropped nothing (no score-0 subtopics).

Preflight 2026-10-05: searXNG probe 200 with 44 results healthy; /api/decide (clef) 200.
