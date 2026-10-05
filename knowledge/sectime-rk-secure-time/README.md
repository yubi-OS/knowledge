# sectime-rk-secure-time

Knowledge corpus on secure-world time on Rockchip SoCs: what an OS can safely claim about secure time on RK3399/RK3588, the CNTPCT source, and the evidence still required from hardware. Minted 2026-10-05 from yubi-OS/yubiOS `refs/sectime-rk-secure-time-2026-07-17.md`.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-op-tee-secure-clock-contract.md | OP-TEE's REE time versus system/TA persistent time contract and the protection-level requirement (100 vs 1000). |
| 02 | 02-cntpct-tee-time-source.md | The TEE-controlled ARM counter path: CFG_SECURE_TIME_SOURCE_CNTPCT and tee_time_arm_cntpct.c. |
| 03 | 03-ree-fallback-limits.md | The REE-backed fallback: rollback clamping within a boot, protection level 100, and why it cannot support secure-time claims. |
| 04 | 04-tfa-opteed-bl32-handoff.md | TF-A loading OP-TEE as BL32 through SPD=opteed versus insecure post-boot SMC loading. |
| 05 | 05-linux-optee-interface.md | The Linux OP-TEE driver, SMCCC protocol, and the client path a smoke test would use. |
| 06 | 06-safe-claims-boundary.md | What an OS may safely claim about secure-world time before and after hardware proof. |
| 07 | 07-smoke-test-and-suspend-evidence.md | The smoke-test design, per-board suspend/resume checks, and CNTPCT continuity across suspend states. |
| 08 | 08-adr-time-decision-split.md | Which decisions may consume secure-world elapsed time versus which need RPMB/fTPM NV counters, sealed state, or verifier freshness. |

## Research summary

Results collected: 96 (16 searXNG queries across 8 subtopics, top 6 kept per query, no dedup across near-identical URLs).

Weight split (noul probability >= 0.5 counts as authoritative backing): 61 high / 35 low of 96. Low-weight results are cited in the docs only where they carry unique factual content, and every such citation is labeled "weak backing" with its weight in text.

Jev requests: 22 total (1 preflight probe, 1 outline validation with 8 score questions, 20 noul weighting batches of 5 results each). Usage: 17177 input tokens, 0 output tokens (per the /api/decide responses).

Redo counts: 0. All 16 queries returned results on the first attempt; all 20 weighting batches succeeded on the first attempt.

Skipped docs: none. All 8 subtopics scored load-bearing in outline validation (scores 1.14 to 1.89, none dropped) and every dig returned enough weighted material to author honestly.

Known limitation recorded in doc 03: the dig did not surface an independent weighted web result covering `tee_time_ree.c` itself, so the fallback's within-boot rollback-clamping behavior carries the yubiOS refs source doc's code-level provenance rather than a jev weight. This is labeled in the doc text.

## Provenance

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.

Decision model: clef via https://steady-orbit.systems-a.workers.dev/api/decide. Dig source: self-hosted searXNG via https://p01--n8n-service--mcx7zcrbvdyt.code.run/webhook/searxng. Every collected result, its weight, and its full decision record are in `research-db/archive.json`; every jev HTTP request is in `research-db/jev-log.json`; per-subtopic dig ledgers are in `research-db/digs/`.
