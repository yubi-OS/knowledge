# wlf-policy-shift-study

Knowledge corpus minted 2026-10-05 from yubi-OS/yubiOS `refs/wlf-policy-shift-study-2026-10-02.md`. Topic: the WLF time-temperature superposition study applied to corpus policy evolution, reading policy version as the corpus's temperature, shift factors, and how the study becomes executable once policy versions accumulate.

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | wlf-equation-fundamentals | The WLF equation, the log(a_T) form, universal constants C1 = 17.4 and C2 = 51.6 at T_ref = T_g, and what the shift factor means. |
| 02 | time-temperature-superposition | TTS as a principle: thermorheologically simple materials, master curve construction by horizontal log-time shifting, when it holds or breaks. |
| 03 | policy-as-temperature | The mapping: policy version is temperature, response curves are moduli, invariant gate structure is the material that must not reshape. |
| 04 | shift-factor-measurement | Segmenting response history into per-version windows, building response curves, computing per-version shift factors by superposition fitting. |
| 05 | simplicity-testing | The joint-superposition test: one shift factor per version must superpose all curves, or the analog restricts to rate-only changes. |
| 06 | policy-version-stamping | The instrument: stamp policy_version on every run row plus an append-only policy changelog outside the wipe protocol. |
| 07 | audit-log-wipe-resilience | The 2026-10-01 14:44Z wipe as a case study and the design of wipe-resistant durable ledgers. |
| 08 | calibration-anchors | The 102.86 dBc-units round 3 dissipation anchor as the predefined threshold any WLF comparison must beat. |
| 09 | analogy-limits | What the temperature metaphor hides, when physical analogies mislead, and the no-numbers reporting discipline. |

## Research summary

- Results collected: 130 (deduplicated across 24 queries: 18 first-pass + 6 redo).
- Weight split: 40 results at weight >= 0.5 (authoritative backing), 90 results below 0.5 (weak backing, labeled as such in text where used).
- Jev requests: 28 total (1 preflight probe, 1 outline validation with 9 score questions, 19 noul batches of 5 on first-pass results, 7 noul batches on redo results). Usage: 22309 input tokens, 0 output tokens.
- Redos: 3 subtopic digs redone once with different queries under the REDO RULE (06 policy-version-stamping, 07 audit-log-wipe-resilience, 09 analogy-limits) after first-pass weighting produced fewer than 3 authoritative results each. One 429 on a weighting batch (b80) retried after 30s and succeeded.
- Skipped docs: none. All 9 subtopics authored.

## Data notes

- Every factual claim in the docs carries its source URL and jev weight. Claims with weight >= 0.5 are treated as authoritative; claims below 0.5 are labeled weak backing in the text.
- The source doc is method-complete but data-blocked (the 2026-10-01 wipe removed policy-change timestamps), so no policy-level numbers are claimed anywhere in this corpus.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
