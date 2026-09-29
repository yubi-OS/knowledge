# yubios knowledge corpus

Minted 2026-09-29 from the request "a yubiOS knowledge space" via the
`knowledge-corpus-mint` skill (first live validation run). A knowledge
space about the yubiOS project itself: what it is, what it trusts, and
how it proves it.

## Docs

1. [01-architecture-overview](./01-architecture-overview.md) - immutable OS architecture: bootc + mkosi + systemd, image-mode Linux, A/B atomic upgrades
2. [02-yubikey-trust-boundaries](./02-yubikey-trust-boundaries.md) - YubiKey as sole root of trust: PIV 9c Secure Boot signing, LUKS2 FIDO2, SSH, PAM, homed
3. [03-boot-chain-and-ukis](./03-boot-chain-and-ukis.md) - UKIs, sealed Secure Boot, dm-verity/composefs integrity stack, measured boot
4. [04-supply-chain-gates](./04-supply-chain-gates.md) - digest pinning, OPA/Rego build policies, cosign + SLSA L3 + Rekor v2 posture
5. [05-arm64-hardware-path](./05-arm64-hardware-path.md) - RK3588 boards, TF-A/OP-TEE/U-Boot, fTPM, DDR/TPL constraints, the v1 evidence gate
6. [06-ci-and-test-infrastructure](./06-ci-and-test-infrastructure.md) - runners, VM test lanes, reproducible builds, operational playbooks

## Provenance

- Outline decomposed and jev-validated (6/6 docs scored load-bearing, 0.83-1.99).
- searXNG dug 12 queries; engines were suspended for 5 of 6 docs, so those
  docs are grounded in direct primary-source verification of the
  yubi-OS/yubiOS repo and upstream docs instead of search results.
- Every factual claim carries a source URL; dig-derived claims also carry
  their jev-1.13 quality weight.
- research-db/ holds the full collection record (outline verdict, dig
  results with weights, author provenance, costs).
