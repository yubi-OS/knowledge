# curve-guided-rsi-self Knowledge Corpus

A knowledge corpus explicating the yubiOS skill `curve-guided-rsi-self`: the closed-loop audit pipeline retargeted at self-doc corpora. It fits learned-latent-curves on SELF.md and SELF-CHANGELOG.md (or the expanded 10-memory-file corpus), uses sparse-cell detection to prioritize self-archaeology dispatch and RSI cycles, and enforces the whole-self output requirement per SELF.md Bias #11.

Ground source: yubi-OS/yubiOS `skills/curve-guided-rsi-self/SKILL.md` (40557 B, fetched 2026-10-06). The source doc is the primary source of record; the corpus explicates and deepens it.

## Index

| Doc | Slug | Scope |
|---|---|---|
| 01 | philosophy-and-scope | Philosophy of the offshoot, the six commitments, when to use and when NOT to use |
| 02 | granularity-rule | Each version is one corpus item, the 11-file item-unit table, the decomposition rule, the 3-level bound |
| 03 | five-stage-pipeline | Stage 1 per-corpus fit, Stage 2 sparse-cell detection, Stage 4 RSI cycles with the whole-self requirement, Stage 5 re-fit metrics |
| 04 | two-stage-dispatch | Stage 3: NSS or self-archaeology proposes, the atom disposes, the only-positive-delta invariant |
| 05 | primitive-bases | The three per-corpus 9-D primitive bases (rows, entries, unified memory files) and why one shared basis fails |
| 06 | validation-evidence | The v1 and v1.1 validation metrics from the source doc changelog (internal record) |
| 07 | anti-patterns-and-red-flags | 7 inherited plus 7 new anti-patterns, 11 red flags with fallbacks |
| 08 | verification-and-lifecycle | Pre-fit asserts, per-corpus and cross-corpus checklists, cadence, persistence, rollback |
| 09 | skill-composition | The 13 named skill relations, cross-reference consistency, and the Composition Rule |

## Research summary

- Results collected: 108 (96 initial plus 12 from 1 redo of subtopic 02).
- Weight split: 1 result at or above 0.5 (github.com/semantic-release/semantic-release at 0.57), 107 below 0.5. Dig quality for this topic was thin: the topic is largely internal-record, so docs ground primarily in the source doc, and every dig-backed claim is labeled weak in text.
- Jev requests: 10 (1 score request for outline validation with 9 questions, 9 noul weighting requests with 108 questions total), usage 14176 input / 2119 output tokens. All weighting went through DefAPI direct (https://api.defapi.org/api/decisions path https://api.defapi.org/api/v1/decisions), zero 429s.
- Redo counts: 1 dig redo (subtopic 02, changelog-format queries).
- Skipped docs: none. Subtopic 06 (validation-evidence) is an internal-record subtopic and was authored from the source doc with no dig by design.
- Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); decide healthy via DefAPI direct, agent-side probe skipped for speed.
