# strudel-live-coding knowledge corpus

Minted 2026-10-05 from the yubi-OS/yubiOS refs doc `refs_corpus/strudel-live-coding-2026-09-30.md` (skill conceptualization for strudel.cc live coding: the browser REPL, Mini-Notation rhythm syntax, sounds and effects, pattern stacks, and the workshop curriculum).

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | repl-getting-started | What Strudel is, the strudel.cc browser REPL, evaluation keybindings, and the getting-started path. |
| 02 | mini-notation-rhythm | Mini-Notation syntax for rhythms: sequences, rests, sub-sequences, alternates, elongation, polyrhythms, sample numbers. |
| 03 | sounds-drums-banks | The sound catalog: s() sounds, drum samples, sample banks, sample numbers, gain shaping. |
| 04 | notes-and-scales | note(), n(), scales, scale/chord helpers, note sequencing, elongate and replicate for note patterns. |
| 05 | effects-and-signals | Audio effects (lpf, vowel, gain, adsr, delay, room, pan, speed) and continuous signals for smooth modulation. |
| 06 | pattern-transformations | rev, jux, add, ply, off and other pattern functions; multiple tempos; how transformations compose. |
| 07 | pattern-stacks | stack() for layering patterns, building complete tunes, arranging parts into a full piece. |
| 08 | hardware-motors | MQTT-driven motor patterning on hardware (Inventor 2040W) from the motors chapter. |
| 09 | workshop-curriculum | The full workshop chain, canonical function and syntax tables, and the source repo location (Codeberg vs archived GitHub). |

Docs sit at the corpus root as `01-repl-getting-started.md` ... `09-workshop-curriculum.md`.

## Research summary

- Results collected: 108 (9 subtopics, 2 seed queries each, top 6 kept per query, deduplicated per query, weighted per unique URL).
- Weight split (jev noul, clef): 78 authoritative (>= 0.5), 30 weak (< 0.5), 0 unscored.
- Jev requests: 17 (1 preflight probe, 1 outline validation with 9 score questions, 15 noul weighting batches of 5).
- Jev usage: 12591 input tokens, 0 output tokens.
- Redo counts: 0 digs required a redo; all first-pass digs returned enough results.
- Skipped docs: none. All 9 subtopics validated as load-bearing (score >= 1, none scored 0) and all digs authored.

Preflight 2026-10-05: searXNG 94 results healthy; /api/decide (clef) 200.

## Method

1. Outline decomposed into 9 subtopics, validated in ONE /api/decide score request (criteria: padding: drop / marginal: keep only if the dig comes back strong / load-bearing: core subtopic). All 9 kept.
2. Each subtopic dug with 2 searXNG queries, top 6 results per query kept.
3. Every result weighted with a noul decision (true = primary/official source worth citing). Claims with weight >= 0.5 are authoritative backing; < 0.5 is labeled weak backing in the docs.
4. Every factual claim in the docs carries its source URL and weight. A claim with no source was deleted, not softened.
5. The thin-dig redo rule was armed but never triggered (all digs returned 7+ kept results on the first pass).

The research-db (schema v2) holds the full provenance: `preflight.json`, `outline.json`, `archive.json`, `digs/`, `jev-log.json`, `db.ts`.
