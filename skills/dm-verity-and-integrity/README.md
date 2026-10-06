# Knowledge corpus: dm-verity-and-integrity

Explicates the yubiOS skill `skills/dm-verity-and-integrity/SKILL.md` (ground source: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/dm-verity-and-integrity/SKILL.md): full-stack filesystem integrity for yubiOS, dm-verity on /usr, fs-verity signing, composefs signed catalogs, IMA appraisal and audit, dm-integrity, and systemd-dissect verification.

## Docs

| NN | Doc | Scope |
| --- | --- | --- |
| 01 | [01-four-layer-integrity-stack.md](01-four-layer-integrity-stack.md) | The four-layer integrity stack (dm-verity, fs-verity, composefs, IMA) plus dm-integrity and the /usr invariant that anchors them |
| 02 | [02-dm-verity-roothash-computation.md](02-dm-verity-roothash-computation.md) | dm-verity Merkle-tree mechanics, the root hash, and mkosi computation including --verity=defer and mkosi-sandbox offline signing |
| 03 | [03-roothash-update-flow.md](03-roothash-update-flow.md) | The five-step root-hash update flow across kernel updates: bootc upgrade, BLS entries, systemd-boot chaining, signed-payload verification |
| 04 | [04-fs-verity-signing.md](04-fs-verity-signing.md) | fs-verity per-file Merkle trees, the fsverity enable/sign/verify flow, builtin vs userspace signatures, and the yubiOS protected file set |
| 05 | [05-composefs-signed-catalog.md](05-composefs-signed-catalog.md) | composefs signed digest catalogs composing sysext/confext layers over a dm-verity base, and why the signature is load-bearing |
| 06 | [06-ima-policy-and-measurement.md](06-ima-policy-and-measurement.md) | IMA appraisal vs audit mode by path, the signed ima-sig policy, PCR 10 measurement, and the PCR 10+11 attestation handoff |
| 07 | [07-dm-integrity-write-paths.md](07-dm-integrity-write-paths.md) | dm-integrity per-sector tags and journaled write atomicity, the dm-verity comparison, and why yubiOS confines it to rare write paths |
| 08 | [08-systemd-dissect-verification.md](08-systemd-dissect-verification.md) | systemd-dissect introspection and verification of DDIs, the --mount verity gap (issue 34807), and the sysext/confext service relation |
| 09 | [09-anti-patterns-and-layer-selection.md](09-anti-patterns-and-layer-selection.md) | The six anti-patterns, the layer-selection rule each encodes, and out-of-scope routing to LUKS2, ftpm-optee-tpm, and mkosi-image-builder |

## Research summary

- **Results collected:** 96 (2 searXNG queries per web-shaped subtopic, top 6 per query kept; 8 subtopics dug).
- **Weight split:** 26 high (>= 0.5) / 70 low (< 0.5) of 96 weighted. Subtopic split: 01 3/9, 02 3/9, 03 3/9, 04 3/9, 05 2/10, 06 2/10, 07 5/7, 08 5/7.
- **Jev requests:** 10 logged (1 outline score request with 9 questions; 8 noul weighting batches of 12; 1 recorded failed request, missing model field, code 1010, retried). Usage: 13645 input / 1995 output tokens. Weighting ran DefAPI direct (https://api.defapi.org/api/v1/decisions, typesafe/jev-1.13) per the SKILLS brief speed optimizations; zero 429s.
- **Redos:** 0. No dig required a redo.
- **Skipped docs:** none. Subtopic 09 was deliberately not dug (internal-record subtopic: the anti-patterns and layer-selection guidance is the skill's own recorded content, cited from the source doc).

## Preflight

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); DefAPI decide (typesafe/jev-1.13) 200, agent-side probe skipped for speed per the SKILLS brief.
