# skills/radio-queue: knowledge corpus on the rock1 radio queue

Explication corpus for the yubiOS skill `radio-queue` (ground source: yubi-OS/yubiOS skills/radio-queue/SKILL.md): a continuous radio-style music queue on rock1 with on-device yt-dlp and ffmpeg downloads, a queue.txt append interface, a daemon that transcodes to stereo 44.1 kHz raw PCM, an ES8316 mixer locked at 100 percent per song, and a background prequeue worker that eliminates inter-track gaps.

Minted 2026-10-06 per the skills-variant brief (branch mint/skills-radio-queue-2026-10-06).

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-why-bridge-offload.md | Why downloads moved off the Sauna-to-rock1 bridge and onto the device |
| 02 | 02-architecture-and-artifacts.md | The /tmp/audio/queue/ layout, current.* and next.* pipelines, daemon phases |
| 03 | 03-ondevice-toolchain.md | yt-dlp and ffmpeg on-device: flags, install shape, bot-detection workarounds |
| 04 | 04-pcm-alsa-es8316.md | Raw PCM s16le stereo 44.1 kHz transcode, ALSA hw:1,0, the ES8316 mixer lock |
| 05 | 05-prequeue-worker.md | The prequeue overlap pattern, the lock guard, the atomic swap, cold fallback |
| 06 | 06-queue-operations.md | queue.txt append interface, clip args, queue.sh verbs, one-shot deploy |
| 07 | 07-url-verification.md | Probing URLs with yt-dlp before queueing and the cost of bad IDs |
| 08 | 08-clean-stop-lifecycle.md | Stopping cleanly around the root-owned play2.py, /proc walk, pkill hazard |
| 09 | 09-example-playlists.md | The five example playlists, their verification discipline, file inventory |

## Research summary

- Results collected: 78 (13 searXNG queries across 6 web-shaped subtopics, top 6 per query)
- Weight split: 23 high (>= 0.5) / 55 low (< 0.5) of 78, all weighted, none null
- jev: 13 requests total (1 outline score validation + 6 first-pass weighting + 6 second-pass weighting), usage 16,329 input / 3,010 output tokens
- Redos: 0 dig redos. One weighting re-pass was needed: the first pass returned 200 for all 6 batches but an agent-side merge bug failed to capture the responses, so the identical 78 results were re-weighted in a second pass whose responses were captured and verified.
- Skipped docs: none. One outline subtopic (bot-detection, score 0.24, padding-dominant) was dropped as a standalone doc by the jev outline validation and folded into doc 03 as a sub-claim with dig citations.
- Internal-record subtopics (02, 06, 09) ran no dig and cite the source doc per the skills-variant brief.

## Preflight

Preflight 2026-10-06: searXNG healthy, 13 live dig queries all HTTP 200 with 42 to 52 raw results each; decision model typesafe/jev-1.13 via DefAPI direct (https://api.defapi.org/api/v1/decisions) HTTP 200 on every call, steady-orbit /api/decide kept as unused fallback (skills-variant optimization 3: campaign preflight ran orchestrator-side, agent-side probe skipped for speed).

## Research DB

research-db/ carries the full audit trail (schema v2): preflight.json, outline.json, archive.json (78 weighted entries with per-decision records), digs/NN-slug.json per doc, jev-log.json (one entry per jev HTTP request), and db.ts (TypeScript interfaces for every shape).
