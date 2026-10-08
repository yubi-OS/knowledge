# play-audio-on-rock1 knowledge corpus

Ground source: yubi-OS/yubiOS skills/play-audio-on-rock1/SKILL.md (fetched 2026-10-06, 11021 bytes, User-Agent omni-agent/1.0).

Topic: generating short audio clips via ElevenLabs and playing them on rock1's audio outputs through the shell bridge: pure-stdlib ctypes-to-ALSA player, one-shot and loop playback, mixer inspection and control, UART banner tee.

The SKILL.md is the primary source of record. This corpus explicates and deepens it; claims from the source doc are attributed as "source doc", claims from digs carry their URL and jev weight (weight 0.5 or higher is authoritative backing, below 0.5 is weak backing and labeled as such in the docs).

## Docs

| NN | file | scope |
|---|---|---|
| 01 | 01-why-ctypes-alsa.md | Why the skill avoids apt-installed audio tools and drives libasound.so.2 via ctypes, plus the end-to-end pipeline shape |
| 02 | 02-rock1-audio-hardware.md | The RockPro64 audio hardware map: HDMI card hw:0,0 versus ES8316 Analog card hw:1,0 |
| 03 | 03-elevenlabs-sound-generation.md | Sauna-side clip generation with ElevenLabs sound-generation, raw PCM S16LE mono output |
| 04 | 04-pcm-transfer-shell-bridge.md | Base64 chunked transfer of the clip and player over the shell bridge, with the argv and POST-body limits |
| 05 | 05-playback-recipes.md | One-shot and loop-N playback with PIPESTATUS return codes and /dev/ttyS2 banner tee (internal-record subtopic, no dig) |
| 06 | 06-mixer-inspection.md | inspect.py: cards from /sys/class/sound, PCM streams from /proc/asound/pcm, mixer controls via ctypes |
| 07 | 07-mixer-control-and-persistence.md | set_mixer.py force-on targets and alsactl store persistence across reboots |
| 08 | 08-quirks-and-anti-patterns.md | The 8 quirks and 4 anti-patterns, with the external backing for each |

## Research summary

- Results collected: 84 (14 searXNG queries, 2 per web-shaped subtopic, top 6 kept per query)
- Weight split: 12 at 0.5 or higher, 72 below 0.5, of 84 total
- jev requests: 8 (1 outline score request, 7 noul weighting batches of 12), usage 12361 input / 1748 output tokens, model typesafe/jev-1.13 via api.defapi.org
- Redos: 0
- Skipped docs: none. Doc 05 is an internal-record subtopic and skipped the dig by design
- Drift note: the source doc's attestation and primitive-coverage sections were corrected on 2026-09-17 as unsupported template boilerplate (see doc 01)

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide (typesafe/jev-1.13 via api.defapi.org) 200.

## Research database

Under research-db/: preflight.json, outline.json, archive.json (84 weighted results), digs/01-08 per-doc dig records, jev-log.json (every jev HTTP request with usage tokens), db.ts (TypeScript interfaces matching all shapes).
