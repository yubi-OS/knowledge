# docs/ci-map knowledge corpus

Minted 2026-10-06 from the yubiOS docs ground source: `yubi-OS/yubiOS docs/CI_MAP.md` (https://github.com/yubi-OS/yubiOS/blob/main/docs/CI_MAP.md), the CI architecture map for the 40-file `.yml` surface of yubi-OS/yubiOS. The source doc is the primary source of record; this corpus explicates and deepens it.

## Index

| NN | doc | scope |
|---|---|---|
| 01 | [01-census.md](01-census.md) | the 40-file YAML census: counts, supersede history, cross-check against ci-launchpad |
| 02 | [02-orchestrator-dispatch.md](02-orchestrator-dispatch.md) | ci.yml orchestrator: group choice input, no-chain fan-out, Docker_push propagation, the all group |
| 03 | [03-image-builders.md](03-image-builders.md) | the 4 OCI builders: Bake targets, rego policy gate, ARM64 reproducibility proofs, two-stage publication |
| 04 | [04-firmware-lane.md](04-firmware-lane.md) | ci_firmware-rk.yml: StandaloneMM, OP-TEE/fTPM/TF-A/U-Boot board builds, equality proof, QEMU e2e, publication |
| 05 | [05-pre-image-tests.md](05-pre-image-tests.md) | the tests group's 8 validation workflows and their trigger/VM-legs rules |
| 06 | [06-vm-e2e.md](06-vm-e2e.md) | the vm-tests group: bcvk e2e, vGPU variant, sealed-UKI Secure Boot e2e, destructive-input guardrails |
| 07 | [07-fetches-and-forks.md](07-fetches-and-forks.md) | the fetches group (PINNED.md refresh) and the forks group (8 component validators) |
| 08 | [08-audits-governance.md](08-audits-governance.md) | the audits group: 5 governance guards, cron cadence, PR-time self-edit validation |
| 09 | [09-research-ci.md](09-research-ci.md) | the research group's 6 workflows plus the non-workflow YAML (FUNDING.yml) |
| 10 | [10-bake-inventory-verification.md](10-bake-inventory-verification.md) | canonical Bake graph, full .yml inventory, ci-launchpad cross-check, trigger policy, drift discipline |

## Research summary

- Results collected: 108 (2 searXNG queries per web-shaped subtopic, top 6 kept per query). The census subtopic (01) is an internal-record subtopic and skipped searXNG entirely.
- Weight split (jev noul via DefAPI direct, typesafe/jev-1.13): 10 high (>= 0.5) / 98 low (< 0.5) of 108. Weakly-backed dig claims are labeled as such in the docs; structural claims are grounded in the source doc.
- Jev requests: 9 logged (1 outline validation score request, 8 noul weighting batches of 10 to 15 questions), plus 1 earlier outline validation request whose log entry was lost to a sandbox filesystem persistence failure before the weighting phase (recorded honestly here; the re-run validation is the one recorded in research-db).
- Redos: 0 dig redos. No doc was skipped for a thin dig.
- Skipped docs: none. All 10 subtopics kept at outline validation (scores 0.34 to 1.27, none scored 0).
- Gaps: none.

Preflight 2026-10-06: searXNG healthy (campaign preflight run orchestrator-side, agent-side probe skipped for speed per the docs-variant brief); decide via https://api.defapi.org/api/v1/decisions (typesafe/jev-1.13), DefAPI direct with the steady-orbit /api/decide relay as fallback (never needed).

## Source attribution convention

Every factual claim carries its source: `source doc` claims cite yubi-OS/yubiOS docs/CI_MAP.md; dig claims carry their URL and jev weight, with weights below 0.5 labeled weak in the text.
