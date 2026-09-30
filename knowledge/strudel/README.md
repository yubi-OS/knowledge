# Strudel

jev-weighted knowledge corpus on the Strudel live-coding music environment
(strudel.cc), minted 2026-09-30 from the request "add strudel to the
knowledge repo". Primary source of record: the strudel source repo at
codeberg.org/uzu/strudel (workshop MDX under website/src/pages/workshop/);
the GitHub mirror tidalcycles/strudel is archived and no longer canonical.

## Docs

| Doc | Scope | Words |
|---|---|---|
| [01-overview-ecosystem](01-overview-ecosystem.md) | What Strudel is, TidalCycles lineage, Codeberg move, ecosystem (awesome-strudel, songs collection, nvim controller) | 877 |
| [02-repl-mechanics](02-repl-mechanics.md) | The strudel.cc REPL: evaluate/stop keys, code fields, live update workflow, editor behavior | 809 |
| [03-mini-notation](03-mini-notation.md) | The complete Mini-Notation rhythm syntax: space, :x, ~/-, <>/[]/*//, commas, @, ! | 1076 |
| [04-sounds-banks-samples](04-sounds-banks-samples.md) | sound(), drum letters, drum machine banks, sample numbers, loading custom samples | 1090 |
| [05-notes-scales-tempo](05-notes-scales-tempo.md) | note() letters/numbers, n()+scale degrees, setcpm tempo model, tuning | 938 |
| [06-audio-effects](06-audio-effects.md) | lpf, vowel, gain, delay, room, pan, speed, ADSR envelopes, patterning effect params | 904 |
| [07-signals-modulation](07-signals-modulation.md) | sine/saw/square/tri/rand/perlin signals, .range(), .slow() on signals, .segment() | 686 |
| [08-pattern-effects](08-pattern-effects.md) | Tidal-specific transforms: rev, jux, add, ply, off, multiple tempos | 865 |
| [09-hardware-integrations](09-hardware-integrations.md) | MIDI and OSC as sequencer output, MQTT motor patterning (Inventor 2040W) | 804 |
| [10-livecoding-practice](10-livecoding-practice.md) | Performance/teaching practice: workshop path, algorave usage, community resources | 975 |

## Research summary

- Outline: 10 docs decomposed by the domain's own joints; jev-validated, none dropped (min score 0.86, 8 docs scored >= 1.38).
- Digs: 20 searXNG queries (2 per doc via the n8n searxng-proxy webhook), 120 results collected.
- Weighting: every result jev-1.13 weighted in 24 batched requests, 89/120 kept at jev >= 0.5. Cost: $0.0027 total including preflight + outline validation ($0.002459 weighting + $0.000199 outline + $0.000028 preflight).
- Authoring: 10 parallel subagents, one per doc; all 10 shipped. Every claim carries a source URL tagged [primary] or [dig, jev=<weight>]; no invented APIs (two unverifiable bank names flagged rather than asserted, one MIDI-package gap named).
- Phase 0 preflight: searXNG 200 / 125 results; jev 200 with noul probe. Recorded in research-db/archive.json.

## Research DB

- research-db/archive.json: full typed result archive (120 items + weights + preflight + outline validation)
- research-db/digs/<doc>.json: per-doc dig payloads
- research-db/db.ts: typed index (doc order, stats, preflight)
