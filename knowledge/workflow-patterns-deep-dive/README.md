# workflow-patterns-deep-dive knowledge corpus

Minted 2026-10-05 from yubi-OS/yubiOS refs/workflow-patterns-deep-dive-2026-07-30.md. Topic: CI workflow pattern analysis across a real repository, three angles (container+dind, action SHA pinning and integrity, crypto/signing) over 24 workflow files with the patterns and anti-patterns found.

## Docs

- [01](01-container-block-architecture.md) - The digest-pinned container: block as yubiOS CI security architecture: canonical 4-key shape (options, volumes, credentials, image), dhi.io/debian-base multi-arch index digest, 21 of 24 workflow coverage, --privileged rationale.
- [02](02-dind-patterns.md) - Docker-in-docker patterns inside container jobs: rootless dockerd over a unix socket driven by docker buildx bake versus legacy inner-dind with --privileged --pid=host --ipc=host.
- [03](03-sha-pinning-discipline.md) - Full-length commit SHA pinning of every uses: ref: 65 uses across 24 workflows, zero floating refs, PINNED.md allowlist as source of truth, 8 stale actions/checkout v6.0.2 SHAs in 5 workflows.
- [04](04-pinning-doc-drift.md) - Stale in-repo documentation (AGENTS.md, github-actions skill) drifting from the PINNED.md allowlist: superseded checkout SHA and container digest still documented, copy-paste re-introduction of drift, missing allowlist entries.
- [05](05-permissions-matrix-hygiene.md) - Workflow permissions blocks (top-level least privilege, redundant job-level overrides, no read-write GITHUB_TOKEN defaults) and matrix strategy conventions (include stubs, fail-fast false, pinned ubuntu-24.04 runner).
- [06](06-secure-boot-signing-pattern.md) - Canonical Secure Boot signing pattern: SoftHSM token bootstrap, mkosi --secure-boot-key-source provider:pkcs11 with systemd-sbsign per ADR-008, sbverify gate before VM boot, mkosi.conf Validation block.
- [07](07-stub-divergence-analysis.md) - How the sealed-UKI-VM workflow stub diverges from canonical: hardcoded slot vs --free, missing SOFTHSM2_CONF, engine:pkcs11 vs provider:pkcs11, wrong libsofthsm2.so path, no private key import, no cert generation.
- [08](08-ovmf-provisioning-gap.md) - The OVMF provisioning gap: OVMF_CODE.fd and OVMF_VARS.fd sourced from the edk2 build artifact, yubiOS ROTPK enrollment into OVMF db with virt-fw-vars, before QEMU Secure Boot tests.
- [09](09-remediation-roadmap.md) - Prioritized fix list distilled from the audit: skill update, checkout SHA roll, container block restore, canonical signing adoption, OVMF provisioning; ordering rationale and verification gates.

## Research summary

- Results collected: 108 result occurrences over 18 queries (2 per subtopic), 98 unique URLs kept.
- Weight split (unique URLs): 55 authoritative (weight >= 0.5), 43 weak (< 0.5).
- Jev requests: 23 (9 outline score questions in 1 request, 22 noul weighting questions in batches of 5). Usage: 17283 input tokens, 0 output tokens.
- Redos: 0 digs redone, 0 jev requests failed after retry.
- Skipped docs: none. All 9 subtopics dug strong enough to author.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

