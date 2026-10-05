# reproducible-builds

Knowledge corpus minted 2026-10-05 from yubi-OS/yubiOS `refs/reproducible-builds-2026-07-22.md`. Topic: reproducible build contracts for OS images, turning reproducibility from aspiration into executable tests for OCI subjects, with commit-derived seeds and verification scripts.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-build-identity.md](01-build-identity.md) | Build identity from the commit epoch: SOURCE_DATE_EPOCH derivation, validation, and the anti-reassignment contract |
| 02 | [02-oci-container-repro.md](02-oci-container-repro.md) | Deterministic container image builds with BuildKit/Buildx: epoch pass-through, timestamp clamping, fixed OCI metadata |
| 03 | [03-two-build-verification.md](03-two-build-verification.md) | Two-build byte comparison verification: separate pinned builders, no cache, OCI-layout comparison, transport wrappers rejected as oracles |
| 04 | [04-context-hygiene.md](04-context-hygiene.md) | Build context and state hygiene: context minimization, ldconfig and package-manager cache removal, deterministic compilation flags |
| 05 | [05-mkosi-installer-repro.md](05-mkosi-installer-repro.md) | mkosi installer reproducibility: epoch and seed inputs, pinned toolchain, dracut initrd, canonical manifest gate |
| 06 | [06-firmware-repro.md](06-firmware-repro.md) | Firmware reproducibility gates: U-Boot, EDK2, TF-A, OP-TEE deterministic build inputs and per-board two-build equality |
| 07 | [07-key-boundary.md](07-key-boundary.md) | Key-bound and non-deterministic boundaries: fresh keys and certificates, signature envelopes, filesystem UUIDs, recorded not compared |
| 08 | [08-package-pinning.md](08-package-pinning.md) | Package input pinning and repository snapshots: live-repo resolution vs immutable snapshots, RPM/Fedora and Debian rebuild infrastructure |

## Research summary

- Results collected: 108 archive entries (77 unique URLs from the first pass, 9 additional unique URLs from one redo; duplicate captures across queries share their first-assigned weight)
- Weight split: 57 results at weight >= 0.5 (authoritative), 51 results at weight < 0.5 (weak, labeled as such where cited)
- Jev requests: 23 (1 preflight probe, 1 outline validation, 18 first-pass weighting batches with 3 retried failures, 2 redo weighting batches), usage 13573 input tokens / 0 output tokens
- Redos: 1 (subtopic 08, dig too thin on first pass, redone with different queries)
- Skipped docs: none
- Outline validation: 8 subtopics scored, none dropped; 7 scored >= 1.58, subtopic 06 scored 1.19 (marginal) and was kept because its dig came back strong (7 of 12 kept results at weight >= 0.5)

Preflight 2026-10-05: searXNG 46 results healthy; /api/decide (clef) 200

## Method

Each doc was authored only from results collected through the searXNG dig and weighted by the clef decision model (noul metric). Claims with no source were deleted. Results below weight 0.5 are cited only as weak backing and labeled as such. Mechanisms taken from the source refs doc that this dig could not independently verify are labeled "per the yubiOS refs doc; not independently verified in this dig". The full record of decisions, digs, and usage is in research-db/ (preflight.json, outline.json, archive.json, digs/, jev-log.json, db.ts).
