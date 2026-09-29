# yubios knowledge corpus (v2: searXNG-healthy redo)

Minted 2026-09-29. This is the re-mint of the yubios corpus: the v1 run
(same day) executed while searXNG's engines were suspended for 5 of 6
docs, so its research DB carried almost no dig evidence. This redo ran
under the `knowledge-corpus-mint` Phase 0 endpoint-preflight gate (both
endpoints verified healthy before any dig) with the searXNG
engine-diversity fix live.

A knowledge space about the yubiOS project itself: what it is, what it
trusts, and how it proves it.

## Docs

1. [01-architecture-overview](./01-architecture-overview.md) - immutable OS architecture: bootc + mkosi + systemd, image-mode Linux, A/B atomic upgrades
2. [02-yubikey-trust-boundaries](./02-yubikey-trust-boundaries.md) - YubiKey as sole root of trust: PIV 9c Secure Boot signing, LUKS2 FIDO2, SSH, PAM, homed
3. [03-boot-chain-and-ukis](./03-boot-chain-and-ukis.md) - UKIs, sealed Secure Boot, dm-verity/composefs integrity stack, measured boot
4. [04-supply-chain-gates](./04-supply-chain-gates.md) - digest pinning, OPA/Rego build policies, cosign + SLSA L3 + Rekor v2 posture
5. [05-arm64-hardware-path](./05-arm64-hardware-path.md) - RK3588 boards, TF-A/OP-TEE/U-Boot, fTPM, DDR/TPL constraints, the OMN-36 gate
6. [06-ci-and-test-infrastructure](./06-ci-and-test-infrastructure.md) - orchestrator, runner fleet, VM test lanes, reproducible builds, playbooks

## Provenance

- Phase 0 preflight: searXNG 125 results / 0 suspended; jev smoke probe OK (recorded in research-db archive.json `preflight`).
- Outline jev-validated 6/6 (0.91-1.95).
- 12 searXNG queries, 72 results, all jev-weighted (mean 0.45, 17 primary-quality >= 0.8).
- Every claim carries a source URL; dig-derived claims carry their jev weight; the v1 docs were consulted as prior drafts only, never cited.
- Version-sensitive findings surfaced by the redo: mkosi.conf carries no Verity= key despite ADR-007/skill claims (drift flagged in doc 03); Rekor v2 GA dating conflict between repo spec and sigstore blog (doc 04); TF-A/OP-TEE board-lane pins unrecorded (doc 05); ci.yml header comment and CI_MAP lag the code's group dispatch (doc 06).
- research-db/ holds the full collection record (preflight, outline verdicts, dig results with weights, author provenance, costs).
