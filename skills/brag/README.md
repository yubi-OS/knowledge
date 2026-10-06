# brag

Knowledge corpus explicating the `/brag` skill (`yubi-OS/yubiOS/skills/brag/SKILL.md`, primary source of record).

**What the skill is:** `/brag` turns the current project website or app into a short (15-25s), polished, shareable launch video using Hyperframes. It reads the project code directly, plans a concept specific to the project, scripts and storyboards it, hands a focused composition brief to Hyperframes, then validates, renders, and writes share copy.

## Doc index

| NN | Doc | Scope |
|---|---|---|
| 01 | [invocation-and-options](01-invocation-and-options.md) | Flag table, defaults, opt-in voice, brag-slim model-check dispatch |
| 02 | [workflow-overview](02-workflow-overview.md) | The 5-step flow and the hard gate at each step |
| 03 | [tone-system](03-tone-system.md) | The 7 tone presets and freeform-tone mapping |
| 04 | [creative-laws](04-creative-laws.md) | The 8 tone-independent quality laws and the scene pattern |
| 05 | [hyperframes-composition](05-hyperframes-composition.md) | The Hyperframes handoff contract and the `hyperframes check` gate (dig-grounded) |
| 06 | [audio-and-music-cues](06-audio-and-music-cues.md) | Bundled music/SFX, cue presets, beat-sync detection, kill flags |
| 07 | [voice-narration-kokoro](07-voice-narration-kokoro.md) | Opt-in narration via Kokoro, single-provider design (dig-grounded) |
| 08 | [output-and-delivery](08-output-and-delivery.md) | Output dirs, poster-frame pick-and-bake, share copy |

## Research summary

Minted 2026-10-06 from the yubiOS `skills/brag/SKILL.md` (9,111 B, skills-variant brief). Outline: 8 subtopics decomposed by the source doc's own sections, all 8 kept at jev score-validation (range 0.24-1.7, none scored 0). Two web-shaped subtopics dug via searXNG (8 queries attempted, 4 REDO'd after the bare-`?q=` proxy shape failed, endpoint/qs shape recovered all 4): 24 results collected, all jev noul-weighted (9 high >= 0.5, 15 low < 0.5). Six subtopics are internal-record (no dig, source-doc citation only), per the skills-variant brief's dig-only-where-external-mechanisms rule.

Key external findings (weighted):
- Hyperframes is HeyGen's open-source HTML-to-video tool (github.com/heygen-com/hyperframes, 0.61; official docs 0.71; CLI guides 0.60-0.65). The dig also surfaced name-collision products (hyperframes.app 0.12, hyperframes.net 0.18) recorded for disambiguation only.
- Kokoro is hexgrad's open-weight 82M-parameter TTS model (huggingface.co/hexgrad/Kokoro-82M, 0.76; reference impl 0.77), with an ONNX export (0.45) enabling browser-side use.

## Research DB

Typed provenance under `research-db/`: `preflight.json` (campaign preflight), `outline.json` (topic + score-validation answers in full), `archive.json` (all collected results with per-decision records), `digs/*.json` (per-subtopic dig records with redo logs), `jev-log.json` (every jev HTTP request), `db.ts` (TypeScript interfaces).
