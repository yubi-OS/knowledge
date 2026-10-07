# drm-gpu-quota-secure-time knowledge corpus

Minted 2026-10-06 from yubi-OS/yubiOS skills/drm-gpu-quota-secure-time/SKILL.md (the source doc, 16264 bytes fetched over raw.githubusercontent.com with User-Agent omni-agent/1.0). The corpus explicates the skill: GPU resource-lockout design (per-cgroup VRAM quota plus hard enforcement via secure world), ARM64 secure-time sourcing for OP-TEE on Rockchip, and the real upstream DRM device-memory cgroup effort. Claims from the source doc are attributed to it explicitly; claims from digs carry their URL and jev weight, with weights below 0.5 labeled weak.

## Outline

| NN | slug | jev score | verdict |
|---|---|---|---|
| 01 | anti-hallucination-verification | 0.18 | dropped at outline validation (padding) |
| 02 | dev-cgroup-upstream-state | 0.91 | kept |
| 03 | panfrost-hook-points | 0.77 | kept |
| 04 | cgroup-identity-apis | 1.18 | kept |
| 05 | smc-hard-lockout-design | 1.41 | kept |
| 06 | v0-scope-enforcement | 1.21 | kept |
| 07 | optee-secure-time-rockchip | 1.70 | kept |
| 08 | yubios-integration-primitive-coverage | 0.77 | kept (internal-record subtopic, no dig) |

## Docs

- [02-dev-cgroup-upstream-state.md](02-dev-cgroup-upstream-state.md) - the real upstream state: no merged drmcg, the live dev cgroup patchset, the parallel DRM scheduling cgroup RFC, and why Panfrost must not block on it.
- [03-panfrost-hook-points.md](03-panfrost-hook-points.md) - verified Panfrost hook points: panfrost_ioctl_create_bo (allocation-time charge), panfrost_lookup_bos (submit-time guard), panfrost_gem_free_object (free-path uncharge).
- [04-cgroup-identity-apis.md](04-cgroup-identity-apis.md) - real cgroup v2 identity APIs versus invented ones, and the cgroup_id()-keyed gpu_cg_quota accounting shape.
- [05-smc-hard-lockout-design.md](05-smc-hard-lockout-design.md) - the SMC hard lockout as a from-scratch proposal: SMCCC SiP ownership rules and the TF-A BL31 dispatch wiring a real call needs.
- [06-v0-scope-enforcement.md](06-v0-scope-enforcement.md) - enforcement bottoming out in real Linux primitives and the v0 ordering: kernel accounting first, SMC escalation second.
- [07-optee-secure-time-rockchip.md](07-optee-secure-time-rockchip.md) - CFG_SECURE_TIME_SOURCE_CNTPCT forced on in plat-rockchip, CNTPCT_EL0 as the secure clock, protectionLevel 1000.
- [08-yubios-integration-primitive-coverage.md](08-yubios-integration-primitive-coverage.md) - pairing with ftpm-optee-tpm and arm-trusted-firmware-optee, and the primitive-coverage audit records.

## Research summary

- Results collected: 108 archive entries (12 queries in attempt 1, 6 redo queries for subtopics 05, 06, 07; 10 URLs deduplicated across queries).
- Weight split: 8 high (>= 0.5) / 100 low (< 0.5). Low-weight claims are labeled weak in the docs.
- Jev requests: 10 (1 outline validation, 1 response-shape probe, 5 weighting batches over attempt-1 results, 3 weighting batches over redo results), usage 14219 input / 1960 output tokens, via DefAPI direct (https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13). The worker relay fallback was not needed.
- Redos: 3 dig redos (one each for 05, 06, 07) after attempt 1 returned off-topic results (dictionary and company pages).
- Docs skipped for thin digs: none. Subtopic 01 was dropped at outline validation (score 0.18, padding), not for thin digs.
- Metrics: score (outline) and noul (weighting), model typesafe/jev-1.13.

## Research DB

Under research-db/: preflight.json, outline.json, archive.json, jev-log.json, db.ts (TypeScript interfaces), and digs/02 through digs/08 (one record per subtopic; 08 is the internal-record subtopic with no dig).

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); decide endpoint (DefAPI direct, typesafe/jev-1.13) 200.
