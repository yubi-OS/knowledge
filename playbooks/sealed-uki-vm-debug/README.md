# sealed-uki-vm-debug

Knowledge corpus explicating the yubiOS sealed-UKI VM debug playbook. Ground source: `yubi-OS/yubiOS playbooks/sealed-uki-vm-debug.md` (the sealed-UKI VM debug decision tree, dated 2026-08-01). The source doc is the primary source of record; this corpus explicates and deepens it and does not replace it.

## Corpus index

| NN | doc | scope |
|---|---|---|
| 01 | [01-lane-overview.md](01-lane-overview.md) | What the sealed-UKI VM lane is: ci_test_sealed-uki-vm.yml, 3 jobs, 6 assertions, PKCS#11-signed UKI via SoftHSM emulating PIV 9c, OVMF Secure Boot, canonical pattern ci_mkosi-installer.yml |
| 02 | [02-debug-doctrine.md](02-debug-doctrine.md) | The four decision rules: diff against canonical, trust nothing in comments, parse state before step logs, one change per iteration |
| 03 | [03-yaml-parse-failures.md](03-yaml-parse-failures.md) | Row 0: total_count 0 means YAML parse failure, unquoted colon in step names, PyYAML YAML 1.1 quirks, the pre-dispatch gate proposal |
| 04 | [04-sbsign-pkcs11-signing.md](04-sbsign-pkcs11-signing.md) | Rows 1, 2, and 7: systemd-sbsign PATH and ephemeral containers, provider:pkcs11 URIs with embedded PIN, SoftHSM ECDSA multipart failure and its two fixes |
| 05 | [05-container-state-pitfalls.md](05-container-state-pitfalls.md) | Rows 3 to 6: shadowed /var/lib/softhsm mounts, diverging docker run mounts and EISDIR, cross-version BDB tokens, set -u unbound variables |
| 07 | [07-ovmf-secureboot-gap.md](07-ovmf-secureboot-gap.md) | Row 8: missing OVMF_CODE.fd / OVMF_VARS.fd provisioning and ROTPK enrollment into db, and why an OVMF rejection masks the enrollment gap |
| 08 | [08-failure-timeline-v25-v83.md](08-failure-timeline-v25-v83.md) | The V25 to V39 failure timeline (runs #33 to #51), the not-yet-green caveat, PR #154 / #155, and the V83 arm64 boot_timeout green state |
| 09 | [09-cross-refs-open-gaps.md](09-cross-refs-open-gaps.md) | B-BOOTC-SEAL, Permanent CI-Evidence Patterns, Linear OMN chain, ADRs, sibling refs and playbooks, gaps 1 and 12 |

## Research summary

- Results collected: 54 (10 searXNG queries across 5 web-shaped subtopics, 2 queries each, top 6 kept per query).
- Weight split: 6 high (>= 0.5) / 48 low (< 0.5) of 54, via the jev noul metric. All 54 results carry non-null weights.
- Docs with internal-record subtopics (no dig, cited to the source doc): 02, 08, 09. Subtopic 06 (softhsm-ecdsa-multipart) scored 0 at outline validation (dropped) and its row 7 material is folded into doc 04.
- jev requests: 5 (1 outline score validation + 4 noul weighting batches of 12 to 14 questions), usage 8563 input / 1127 output tokens. Weighting ran via DefAPI direct (https://api.defapi.org/api/v1/decisions); zero 429s, no fallback to the worker relay needed.
- Redos: 0 dig redos, 0 decide-failure redos.
- Skipped docs: none. Dropped at validation: 06 (folded into 04).

## Preflight

Preflight 2026-10-06: campaign preflight healthy (orchestrator-run searXNG probe and decide probe); agent-side probe skipped for speed per the mint brief speed optimizations.

## Verification

VERIFIED: files 19, research-db 9 parse, weights 54/54.
