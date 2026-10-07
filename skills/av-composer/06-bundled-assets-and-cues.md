# 06. Bundled Assets and Cue Presets

Source doc: `yubi-OS/yubiOS/skills/av-composer/SKILL.md` (primary source of record). Internal-record subtopic, no dig.

av-composer ships its audio library inside the skill so that the zero-external-calls contract holds without any downloads. Two asset families live under `<skill-dir>/assets/`.

## Music with cue presets

Two CC0 tracks from the "Happy Beats / Business Moves" set by ende.app:

| Track | Character | Best for |
|---|---|---|
| `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` | Steady and clean | polished, cinematic |
| `happy-beats-business-moves-vol-1-by-ende-dot-app.mp3` | Full upbeat, most energetic | default, app-store |

Each track ships with a precomputed cue preset pair in `assets/music/cues/` (`.music-cues.json` + `.music-cues.md`). The preset carries the track's duration, estimated tempo, a beat grid (timestamps ~0.53s apart at ~110 BPM), and a `strongCues` array: the highest-intensity landing moments with `time`, `intensity`, and `kind` (`strong_beat` / `onset_peak`).

The cue file is a bias instrument, not a control sheet. Per the source doc: lock 1-3 major reveals to strong cues within about ±0.15s, snap smaller sequential events to nearby beat points within about ±0.10s, and snap sequential readable text to every other beat (never one line per beat at fast tempos, which outruns reading). If snapping hurts readability, scene pacing, or the product story, the natural timing wins. Comment each lock in the composition (`// beat-locked: 8.74s`) so the edit intent is auditable.

## The curated SFX subset

`assets/sfx/` carries a curated CC0 subset organized by family and use:

- `interface/` — drops (element landing), clicks (taps/CTAs), a deep bell (`bong_001`, dramatic announcement, use sparingly), select and switch sounds.
- `impact/` — bells (`impactBell_heavy_000/003/004`: cinematic reveal, logo slam, outro), soft thuds (`impactSoft_medium_*`: the safest major-reveal family), heavy soft thud, glass clink (sparkle), wood knock (warm accent).
- `casino/` — card slide/place, chip stack/collide (counter increments, celebratory weight).
- `ui/` — clicks and mouse click for simulated cursor interaction.
- `keyboard/` — 10 keypress WAVs for typing moments; randomize across the set so repeated characters do not sound robotic.

Volume policy: music 0.25-0.4, SFX 0.55-0.85. Sparse beats dense: 3-5 well-timed SFX usually reads better than a cue on every motion, and nothing loud should compete with the hook.

## Working with other libraries

The subset is a floor, not a ceiling: any local audio file can be dropped into the composition's `assets/` tree and declared the same way. When the `brag` skill is installed alongside, its larger bundled music and SFX libraries can be copied in (the skills share lineage and licensing); av-composer never calls brag's external tooling, it only reuses files.

## Sources

- `yubi-OS/yubiOS/skills/av-composer/SKILL.md` (source doc, primary)
- `yubi-OS/yubiOS/skills/av-composer/assets/music/cues/` (bundled cue presets)
