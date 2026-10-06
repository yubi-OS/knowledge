# 03. The Tone System

Source doc: `yubi-OS/yubiOS/skills/brag/SKILL.md` plus its `references/tones.md` (primary source of record). Internal-record subtopic, no dig.

## Seven presets

`/brag` ships 7 tone presets. Each changes scripting energy, pacing, typography personality, and transition style. The source doc's own table:

| Tone | Energy | One-liner |
|---|---|---|
| `default` | Playful, clean, postable | The good-vibes default |
| `polished` | Serious, elegant | For projects that are not jokes |
| `yc-parody` | Deadpan startup energy | Fake seriousness applied to absurd projects |
| `chaotic` | Fast, loud, aggressive | Over-the-top and unhinged |
| `deadpan` | Calm, dry, understated | The joke is that nothing is a joke |
| `cinematic` | Dramatic, trailer-scale | Big motion, bigger claims |
| `app-store` | Smooth, feature-card clean | Corporate but not boring |

Full definitions live in `references/tones.md`, read during the composition step.

## Presets are defaults, not limits

The source doc states this twice, which is the tell for how important it is: tone is an axis of expression, not a menu constraint. Two mechanisms make that real:

1. **Freeform creative directions.** The `--tone` flag accepts any description ("fake Series A launch from 2016", "museum exhibit", "overproduced mobile game ad"). The skill maps the direction to the nearest preset for pacing and structure, but preserves the user's direction in the plan and the composition brief. The preset carries the mechanics; the user's words carry the intent.
2. **Refinement and override.** "Always allow a freeform creative direction to refine or override the preset" (source doc). A preset chosen as a base can still be bent by the description that came with it.

## What tone actually changes

Per the source doc, tone changes 4 things at once, and they are coupled: scripting energy (how the copy is written), pacing (how fast scenes move), typography personality (what the text looks like), and transition style (how scenes hand off). A tone preset is therefore a package across writing and rendering, not a color swap. That is why tone is parsed at invocation time (step 0) rather than discovered during composition: the plan and storyboard inherit it before any Hyperframes work starts.

## Choosing

The default is `inferred`: with no `--tone` flag, the skill picks a preset from the project's character. `default` is the fallback posture (playful, clean, postable). The `polished` row carries the most context in its one-liner: "For projects that are not jokes", which is the boundary of the whole tone system. `/brag` is comedic-leaning by default, and `polished` is the escape hatch for serious products.

`yc-parody` and `deadpan` are the two humor-forward presets, and they differ in mechanism: `yc-parody` applies fake seriousness to absurd projects (the humor is in the mismatch); `deadpan` is the joke that nothing is a joke (the humor is in the restraint).

## Sources

- `yubi-OS/yubiOS/skills/brag/SKILL.md` (source doc, primary)
- `yubi-OS/yubiOS/skills/brag/references/tones.md` (referenced by the source doc)
