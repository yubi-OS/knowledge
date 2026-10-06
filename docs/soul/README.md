# docs/soul - yubiOS soul-document corpus

A knowledge corpus explicating the yubiOS soul document: the soul-piece that reads `yubi-OS/yubiOS/docs/` as autobiography (twelve soul-portraits + weave + pushback), the portrait structure, what the piece captures about the project's character, and the method behind it.

Ground source of record: `yubi-OS/yubiOS docs/SOUL.md` (fetched 2026-10-06, 32049 B). The corpus explicates and deepens it; it does not replace it.

## Corpus index

| NN | doc | scope |
|---|---|---|
| 01 | [01-framing-soul-as-corpus.md](01-framing-soul-as-corpus.md) | What "turn docs/ into my soul" means: corpus-as-autobiography, the inference-to-evidence move, why SELF.md v0.1's soul section was weakest. Internal-record subtopic, no dig. |
| 02 | [02-portraits-purpose-and-fears.md](02-portraits-purpose-and-fears.md) | MISSION.md as purpose (trust nothing, default deny, concentrated power) and THREAT_MODEL.md as codified fears (10 invariants, recovery-path discipline, honesty tables). |
| 03 | [03-portraits-shape-and-contract.md](03-portraits-shape-and-contract.md) | ARCHITECTURE.md as shape (6 trust boundaries, YubiKey sole root, verification flow, x86-64 asymmetry) and SPEC.md as contract (RFC 2119 keywords, 7-item conformance checklist). |
| 04 | [04-portraits-decisions-and-defenses.md](04-portraits-decisions-and-defenses.md) | ADR.md as decisions (32+ records amended not rewritten, ADR-001 sole anchor) and MITIGATE.md as defenses (attack chain, residual risk, absence-as-defense). |
| 05 | [05-portraits-testing-and-stewardship.md](05-portraits-testing-and-stewardship.md) | CI_MAP.md as testing (22 standalone workflows, verify before claim, byte-for-byte reproducibility proofs) and PLAN.md as stewardship (public-first covenant, services-to-subscription). |
| 06 | [06-portraits-hopes-failures-progress.md](06-portraits-hopes-failures-progress.md) | FUTURE.md as evidence-bound hopes, BLOCKERS.md as failures converted into doctrine, TODO.md as honest unfinished work, MILESTONE.md as auditable progress. Internal-record subtopic, no dig. |
| 07 | [07-the-weave.md](07-the-weave.md) | How the 12 docs form one coherent whole: why-to-how-to-what ordering and the 4 load-bearing edges. Internal-record subtopic, no dig. |
| 08 | [08-pushback-and-discipline.md](08-pushback-and-discipline.md) | The 4 pushbacks (engineering-flavored corpus, composite authorship, inference corrective, structural test), the 3 discipline next steps, and the attestation coverage mechanisms. |

## Research summary

- Results collected: 60 (8 subtopic queries plus 2 follow-up queries for the marginal t05 subtopic; top 6 kept per query)
- Weight split: 24 high (>= 0.5) / 36 low (< 0.5)
- jev requests: 6 total (1 outline score validation, 5 noul weighting batches), usage 8382 input / 1224 output tokens
- Model: typesafe/jev-1.13 via DefAPI direct (https://api.defapi.org/api/v1/decisions); worker relay not needed (no 429s, no failures)
- Redo counts: 0 dig redos, 0 jev redos
- Skipped docs: none (8 of 8 authored)
- Marginal-subtopic handling: t05 (score 0.51) and t08 (score 0.47) were validated marginal and kept because their digs came back strong (05: reproducible-builds.org 0.76/0.74; 08: in-toto 0.9, slsa.dev 0.87, rekor 0.9). t01, t06, t07 are internal-record subtopics (grounded in the source doc's own structure; no dig per brief)

Preflight 2026-10-06: campaign preflight healthy (orchestrator): searXNG healthy, decide healthy. Agent-side probe skipped for speed per brief.

## Research DB

Schema v2 under `research-db/`: preflight.json, outline.json, archive.json, digs/*.json, jev-log.json, db.ts. Every archive entry carries a non-null jev weight and the full raw decision record.
