# skills/drm-gpu-quota-secure-time knowledge corpus

Explication corpus for the yubiOS skill `drm-gpu-quota-secure-time`: GPU resource-lockout design (per-cgroup VRAM quota, Panfrost hook points, SMC-mediated hard lockout) and ARM64 secure-time sourcing for OP-TEE on Rockchip (`CFG_SECURE_TIME_SOURCE_CNTPCT`). Ground source: yubi-OS/yubiOS `skills/drm-gpu-quota-secure-time/SKILL.md`; the corpus explicates the skill and does not replace it.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-skill-origin-hallucination-checks.md | Why the skill exists: LLM-sourced kernel API names mixed real and invented; the verify-against-elixir.bootlin.com rule |
| 02 | 02-dev-cgroup-controller-upstream.md | Real upstream state: no merged drmcg, the dev/devcg controller patchset, dev.region.max interface, Panfrost implication |
| 03 | 03-panfrost-bo-hook-points.md | Verified charge/uncharge placement: panfrost_ioctl_create_bo, panfrost_lookup_bos, panfrost_gem_free_object |
| 04 | 04-cgroup-identity-kernel-apis.md | Real cgroup v2 identity APIs vs invented ones; the cgroup_id-keyed gpu_cg_quota pattern |
| 05 | 05-smc-sip-hard-lockout-design.md | The SMC lockout as a from-scratch proposal: SMCCC SiP ranges, TF-A dispatch, Linux-side enforcement |
| 06 | 06-optee-secure-time-cntpct.md | CFG_SECURE_TIME_SOURCE_CNTPCT forced on for plat-rockchip; CNTPCT_EL0 TEE_GetSystemTime; protectionLevel 1000 |
| 07 | 07-yubios-integration-ftpm-measured-boot.md | yubiOS relevance: tamper-resistant timestamps for fTPM NV counters and measured-boot event logs |
| 08 | 08-recheck-sources-protocol.md | The 4 pre-implementation re-checks: dri-devel, elixir signatures, optee_os conf.mk, SMCCC spec |

## Research summary

- Results collected: 86 unique (96 raw, 10 URL duplicates dropped), all jev-weighted via noul.
- Weight split: 37 high (>= 0.5) / 49 low (< 0.5).
- jev requests: 9 total (1 outline score request with 8 questions, 8 noul batches of 12), all via https://api.defapi.org/api/v1/decisions (DefAPI direct, per the 2026-10-06 speed optimization). Usage: outline 1296 in / 124 out tokens; per-batch usage recorded in research-db/jev-log.json.
- Redo counts: 0 digs redone; 0 weighting redos.
- Skipped docs: none. Subtopic 07 was marginal in outline validation (score 0.34) but kept because its dig returned the primary artifacts (GlobalPlatform TEE Internal Core API spec, weight 0.89; official optee_ftpm repository).
- Internal-record subtopics (no dig, source-doc-attributed): the source doc's primitive-coverage/audit-trail sections (least privilege, immutability, cryptographic identity, declarative policy, continuous/adaptive note), covered inside docs 01 and 08.
- Outline validation: no subtopic scored 0; all 8 kept (see research-db/outline.json for per-subtopic scores and verdicts).

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); weighting via DefAPI direct (typesafe/jev-1.13-20260917), worker relay not needed.
