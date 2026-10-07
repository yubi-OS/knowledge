# 02. Plan and Storyboard Discipline

Source doc: `yubi-OS/yubiOS/skills/av-composer/SKILL.md` (primary source of record). Internal-record subtopic, no dig.

av-composer inherits its planning discipline from the brag creative contract and compresses it into one required artifact: `<output-dir>/av-plan.md`, written before any composition work.

## What the plan must contain

Per the source doc, the minimum content is: the angle/hook, a scene-by-scene storyboard (name, duration, what appears, what is read), the total duration, tone, and the audio plan (music choice, volume, SFX moments, fade). Two rules are enforced at plan time rather than at render time:

1. **The 15-25s envelope.** Scene durations MUST sum to 15-25 seconds for launch-style pieces. The envelope is a creative law, not a suggestion: a short promo that outruns it stops being shareable.
2. **Reading floors.** A short label holds about 0.8s settled; a sentence holds about 0.3s per word. If a scene carries more text than its duration allows, the plan says cut copy or split the scene, never speed it up. This is the same discipline the brag skill uses, and the source doc keeps it because the failure mode (text pulled off screen before it can be read) is invisible in a plan that only counts seconds.

## The creative laws

The source doc carries the brag contract's laws forward because they are what make short videos work regardless of tone: short, readable, specific, show the real thing, hook in the first 2s. The hook rule is operationalized in planning: the first 2 seconds determine whether anyone keeps watching, so the hook is a plan-level decision, not a composition-time discovery. The "specific" law grounds the whole pipeline: the video must show the real project (its hero, its UI, its copy), and the composition step exists to stage that material, not to replace it with abstract motion graphics.

## Planning for the capture pipeline

The plan is also the contract for what the pipeline can execute:

- **Seekability.** Every planned beat must be expressible as a GSAP tween at an absolute time. Anything that would require wall-clock animation (CSS keyframes, timers) is out of contract (doc 03).
- **Audio as data.** Every planned sound must be expressible as a declarative audio element (start, duration, volume, optional fade), because assembly consumes audio from a manifest (doc 05).
- **Resumability.** Scene boundaries should land on clean states so an interrupted capture resumes without visual seams.

## Tone and structure

Tone presets (default, polished, yc-parody, chaotic, deadpan, cinematic, app-store) are inherited guidance, not hard constraints: they shape pacing, scene count, and restraint, and a freeform creative direction can refine or override them. The scene pattern (hook, reveal, highlights, punchline/outro) is a starting shape; the source doc keeps brag's caveat that not every project needs exactly 3 highlights.

## Why plan-before-compose matters here specifically

In a local frame-capture pipeline, layout changes are cheap to iterate (a re-capture is ~70s for 600 frames) but a wrong plan is expensive to discover late: text-on-bright collisions, overlong holds, and unreadable sequential reveals are all plan-detectable. The source doc's ordering (plan gates composition) is the cheapest place to catch them.

## Sources

- `yubi-OS/yubiOS/skills/av-composer/SKILL.md` (source doc, primary)
