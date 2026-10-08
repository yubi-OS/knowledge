# Strudel Live Coding Knowledge Corpus

Knowledge corpus for the yubiOS skill `skills/strudel-live-coding` (ground source: yubi-OS/yubiOS skills/strudel-live-coding/SKILL.md). Topic: authoring, teaching, and verifying Strudel live-coding music patterns: the browser REPL, Mini-Notation rhythm syntax, sounds and drum machine banks, notes and scales, audio effects, signal modulation, pattern stacks, and the canonical verified workshop tunes.

The source doc is the primary source of record; every doc below cites it as its grounding spine and adds searXNG-dig sources with jev noul weights for the external mechanisms.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-what-strudel-is.md](01-what-strudel-is.md) | Strudel identity: browser-based TidalCycles port, strudel.cc REPL, uses, workshop ladder, Codeberg as canonical home |
| 02 | [02-repl-mechanics.md](02-repl-mechanics.md) | REPL evaluate loop: Ctrl+Enter play/update, Ctrl+. stop, comments, `$:` stacks, `_$:` mute, `.hush()`, on-demand samples |
| 03 | [03-mini-notation.md](03-mini-notation.md) | Mini-Notation operators table and the cycle-squish mental model |
| 04 | [04-sounds-drums-banks.md](04-sounds-drums-banks.md) | Named samples, drum letters, `.bank()` machines, `s()` alias, sample resolution |
| 05 | [05-notes-scales-tempo.md](05-notes-scales-tempo.md) | MIDI vs letter notes, pitched sounds, melodic slowing, scale degrees, `setcpm` tempo math |
| 06 | [06-audio-effects.md](06-audio-effects.md) | lpf, vowel, gain, delay, room, pan, speed, ADSR, fast/slow, patterning effects without changing rhythm |
| 07 | [07-signals.md](07-signals.md) | Continuous modulation: signal set, default range, `.range()`, `.slow()`, `.segment()` |
| 08 | [08-pattern-effects.md](08-pattern-effects.md) | Tidal-specific toolbox: `rev`, `jux`, `add`, `ply`, `off`, multi-tempo `.slow()` |
| 10 | [10-tunes-and-teaching.md](10-tunes-and-teaching.md) | Canonical verified workshop tunes, the build-from-scratch path, idea-to-Mini-Notation conversion, verify/debug checklist |

## Research summary

- Ground source fetched: yubi-OS/yubiOS skills/strudel-live-coding/SKILL.md, 12559 B.
- Results collected: 68 (after per-URL dedupe; top 6 per dig query, 18 queries across 9 web-shaped subtopics, 782 raw dig results).
- Weight split (noul, weight >= 0.5 counts as authoritative backing): 23 high / 45 low of 68. Every collected result carries a non-null weight.
- jev: 6 requests total (1 outline validation with 10 score questions + 5 noul weighting batches of 15/15/15/15/8), via DefAPI direct POST https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13. Usage: 9491 input tokens / 1321 output tokens across the 6 requests (1772/154 outline + 8319/1167 weighting).
- Redos: 0 dig redos. 0 decision-model failures (all DefAPI requests returned 200 on the first attempt).
- Skipped docs: 09-motors-beyond-audio, dropped in outline validation (score 0.08, 92% probability of score 0 padding). The workshop motors chapter was still located by the dig and is cited in doc 01.
- Internal-record subtopic: 10-tunes-and-teaching (no dig; content is the source doc's own verified examples and checklists).
- Gaps: none beyond the dropped motors subtopic.

## Preflight

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); DefAPI direct (typesafe/jev-1.13) 200 on all agent weighting requests. Agent-side probe skipped for speed per the skills-variant brief.

## Research-db

Schema v2 under [research-db/](research-db/): preflight.json, outline.json, archive.json (68 weighted results), digs/ (10 per-subtopic records), jev-log.json, db.ts (interfaces).
