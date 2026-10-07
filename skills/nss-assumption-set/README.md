# nss-assumption-set knowledge corpus

Knowledge corpus minted from the yubiOS skill `yubi-OS/yubiOS skills/nss-assumption-set/SKILL.md` (51201 bytes, fetched 2026-10-07). The skill is the cycle-12 deep-research synthesis for the NSS Assumption set axis: for every file, what it silently assumes, across eight channels, grounded in Design by Contract, SPARK Ada contracts, rely/guarantee reasoning, and requirements engineering.

## Docs

| NN | File | Scope |
|---|---|---|
| 01 | 01-channels.md | The eight-channel assumption taxonomy and the 12-field assumption record |
| 02 | 02-prior-frames.md | Design by Contract, SPARK Ada GNATprove, rely/guarantee, requirements engineering |
| 03 | 03-manifests.md | Dependency manifests as machine-readable assumption sets and the 5-question checker |
| 04 | 04-ledger.md | The assumption ledger, the 10-step gap-finding procedure, RAID logs, ADRs, problem frames, ISO 29148 |
| 05 | 05-yubios-surface.md | File-type patterns: Containerfile, mkosi.conf, systemd units, GitHub Actions, scripts, refs notes |
| 06 | 06-anti-patterns.md | Guidelines, constraints, anti-patterns, and red flags (internal-record, no dig) |
| 07 | 07-composition.md | Composition with the NSS skill family and the 8-point verification checklist (internal-record, no dig) |

The source doc is the primary source of record; every doc cites it for its grounding spine and carries searXNG-dig sources for the external mechanisms, each with its jev weight.

## Research summary

- Results collected: 90 (84 across the 10 initial dig queries plus 2 redo rounds on subtopic 01 and 1 on subtopic 05, then 6 more on the second redo of 01ch1).
- Weight split: 12 results at weight 0.5 or higher, 78 below 0.5 (labeled weak in the docs).
- jev: 8 requests via DefAPI direct (api.defapi.org/api/v1/decisions), model typesafe/jev-1.13. Usage: 11584 input tokens, 1757 output tokens. One outline-validation request (score metric, 7 questions) plus 7 noul-weighting requests (batches of 6 to 15).
- Redos: 2 (subtopic 01 re-dug twice, subtopic 05 re-dug once, per the REDO rule with different queries; all logged in digs).
- Skipped docs: none. All 7 subtopics authored.
- Gaps: the "implicit assumptions / works on my machine" dig angle stayed weak after 2 redos (top weight 0.21); doc 01 labels those citations weak and leans on the source doc plus the strong Eiffel/DbC sources instead.

Preflight 2026-10-06: searXNG healthy (campaign preflight, orchestrator-side); /api/decide (clef) healthy (campaign preflight, orchestrator-side); agent-side probe skipped for speed per the skills-variant brief.

## Files

- 7 numbered docs (01 to 07 above)
- research-db/: preflight.json, outline.json, archive.json, digs/01-channels.json ... digs/07-composition.json, jev-log.json, db.ts
