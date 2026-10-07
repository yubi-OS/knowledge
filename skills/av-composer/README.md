# av-composer

Knowledge corpus explicating the `av-composer` skill (`yubi-OS/yubiOS/skills/av-composer/SKILL.md`, primary source of record).

**What the skill is:** av-composer composes, captures, and renders a short audio/video piece (launch video, promo, animated explainer, demo clip) entirely with local tooling: an HTML+GSAP composition driven frame-by-frame by headless Chrome, assembled with ffmpeg. Zero external calls at build or render time: no CDN scripts, no Google Fonts, no npm installs, no cloud render or TTS services.

## Doc index

| NN | Doc | Scope |
|---|---|---|
| 01 | [zero-external-calls-contract](01-zero-external-calls-contract.md) | The hard local-only rule and its 5-point verification |
| 02 | [plan-and-storyboard](02-plan-and-storyboard.md) | The 15-25s envelope, storyboard, reading floors, creative laws |
| 03 | [composition-contract](03-composition-contract.md) | The single-file HTML+GSAP contract and declarative audio (dig-grounded) |
| 04 | [capture-pipeline](04-capture-pipeline.md) | Seek-driven frame capture with chrome-headless-shell + puppeteer (dig-grounded) |
| 05 | [ffmpeg-assembly](05-ffmpeg-assembly.md) | libx264 assembly, the declarative audio mix graph, poster bake (dig-grounded) |
| 06 | [bundled-assets-and-cues](06-bundled-assets-and-cues.md) | CC0 music with cue presets and the curated SFX subset |
| 07 | [failure-lessons](07-failure-lessons.md) | The validated failure runbook from real runs |
| 08 | [verify-and-deliver](08-verify-and-deliver.md) | Visual verification of the actual mp4 and the deliverable set |

## Research summary

Minted 2026-10-07 from the yubiOS `skills/av-composer/SKILL.md` (skills-variant brief). Outline: 8 subtopics decomposed by the source doc's own sections, all 8 kept at jev score-validation (range 0.84-1.82, none scored 0). Three web-shaped subtopics dug via searXNG (6 queries, endpoint/qs form): 36 results collected, all jev noul-weighted (11 high >= 0.5, 25 low < 0.5). Five subtopics are internal-record (no dig, source-doc citation only) per the brief's dig-only-where-external-mechanisms rule.

Key external findings (weighted):
- GSAP's Timeline API is documented upstream with `paused()` timeline construction and seek semantics (gsap.com/docs/v3/GSAP/Timeline/, 0.81/0.82; paused(), 0.77; GitHub 0.74) — the composition contract's seek-only rule is grounded in the engine's own control API.
- Chrome's headless shell is Google's own automation/testing binary (developer.chrome.com, 0.63) and Puppeteer documents the screenshot and viewport APIs used by the capture script (pptr.dev/guides/screenshots 0.64, viewport 0.59, root 0.67).
- FFmpeg's filter documentation is the authority for the audio mix graph (ffmpeg.org/ffmpeg-filters.html, 0.76 — amix, adelay, afade are all in the official filter set).

## Research DB

Typed provenance under `research-db/`: `preflight.json` (campaign preflight), `outline.json` (topic + score-validation answers in full), `archive.json` (all collected results with per-decision records), `digs/*.json` (per-subtopic dig records), `jev-log.json` (every jev HTTP request), `db.ts` (TypeScript interfaces).
