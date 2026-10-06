# 06. Audio: Bundled Music, SFX, and Cue Guidance

Source doc: `yubi-OS/yubiOS/skills/brag/SKILL.md` plus its `references/audio.md` (primary source of record). Internal-record subtopic, no dig.

## Two audio channels, two kill flags

`/brag` carries audio in two independent channels, each with its own opt-out flag at invocation:

- **Music** (`--no-music` disables; default on): the soundtrack.
- **SFX** (`--no-sfx` disables; default on): spot sound effects cued by the storyboard.

Both flags are parsed at invocation time (step 0), so the audio plan is fixed before step 2 writes the storyboard and before step 3 composes.

## Bundled assets

The skill ships its audio assets under `<skill-dir>/assets/`:

- **Music:** 5 tracks (volumes 1, 9, 10, 11, and 12 of the "Happy Beats Business Moves" set), each an mp3 under `assets/music/`.
- **Music cue presets:** for each track, a `.music-cues.md` and `.music-cues.json` pair under `assets/music/cues/`, produced by the skill's `scripts/analyze_music_cues.py` analyzer (a Python project with a `pyproject.toml` and lockfile).
- **SFX:** categorized libraries under `assets/sfx/`: `casino/` (cards, chips, dice), `impact/` (footsteps across carpet/concrete/grass/snow/wood, plus impact bells, glass, metal, plates, punches, wood), `interface/` (bongs, clicks, drops, errors, glitches, selects, switches), `keyboard/` (32 keypress wavs), and `ui/` (clicks, rollovers, switches). An `sfx-analysis.md` and `sfx-analysis.json` catalog the set.

The SFX library is themed for product-storytelling gestures: a card slide for a feature reveal, a keypress for a command, an impact for a hook landing. The categories, not specific filenames, are what the storyboard cues reference.

## Music cue guidance in the plan

Step 2's plan gains a compact `Music cue guidance` section when music is selected. The source doc's rule for filling it:

1. If the chosen track has a bundled cue preset, read it from `<skill-dir>/assets/music/cues/`.
2. If not, note that cues will be detected at composition time: the source doc states any track now supports beat sync (see `references/audio.md`).

The cue metadata is optional timing guidance only. The source doc is explicit about the priority order: story, readability, pacing, and product clarity stay primary. A beat-matched cut never outranks a readable hold time or a clear product beat.

## Where the audio decisions live

Music and SFX selection are `/brag`-owned decisions handed to Hyperframes in the composition brief (source doc, step 3 ownership split). Hyperframes implements the timing mechanically; `/brag` decides what plays and when it should land.

## Sources

- `yubi-OS/yubiOS/skills/brag/SKILL.md` (source doc, primary)
- `yubi-OS/yubiOS/skills/brag/references/audio.md` (referenced by the source doc)
- `yubi-OS/yubiOS/skills/brag/assets/music/` and `assets/sfx/` (bundled assets)
