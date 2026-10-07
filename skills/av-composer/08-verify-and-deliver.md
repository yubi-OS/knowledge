# 08. Verify and Deliver

Source doc: `yubi-OS/yubiOS/skills/av-composer/SKILL.md` (primary source of record). Internal-record subtopic, no dig.

The skill's verification rule is blunt: "Never report a render without looking at it." A finished file is not evidence; stills read by a person (or agent acting as one) are.

## The verification steps

1. **Extract stills from the actual MP4.** `ffmpeg -ss <t> -i out.mp4 -frames:v 1` at 4-6 representative times (one per scene, plus both ends of key transitions). Reading stills from the mp4, rather than trusting captured frames, verifies what a player will actually show.
2. **Read them.** Check: every text element readable against its background, no text-on-bright collisions (doc 07's lesson), transitions landed at the planned times, the last frame fades correctly, the poster frame is the intended one.
3. **ffprobe the container.** Duration must match the plan (and the 15-25s envelope), and the audio stream must exist with the expected codec (aac). A silent mp4 is a defect, not a fallback (doc 05's failure behavior).

## The deliverable set

A completed run delivers all of these, kept together:

| Artifact | What it is |
|---|---|
| `av.mp4` | The rendered video (libx264 yuv420p, aac, exact duration) |
| `av.jpg` | The picked poster frame |
| `share-copy.txt` | One sentence of share copy (punchy, not corporate) |
| `av-plan.md` | The plan (angle, storyboard, audio plan, reading floors) |
| `composition/` | The composition source: the editable master |
| `frames/` | The captured frame sequence (keep for cheap re-encodes; delete between projects if space-constrained) |

## Why the composition source is a deliverable

The composition is the source of truth. A copy tweak, a new poster frame, a different music bed, or a format change (vertical cut, different duration) are all cheap re-runs of the same pipeline against the same composition, provided the composition survives. Deleting it reduces every future edit to a full re-author.

## The full gate sequence of a run

A run's state is exactly which gates have fired: plan written (step 1) -> composition authored and timeline registered (step 2) -> readiness gate passed and frames captured (step 3) -> audio manifest built and assembly clean (step 4) -> stills read + ffprobe checks passed + poster baked (step 5). Any pause in a run can be resumed by checking which gate last fired; every script skips completed artifacts, so resumption is resumable by construction.

## Reporting

A completion report states the artifact paths, duration, resolution, audio presence, the poster frame's time, and any honest scope notes (for example: narration not included because voice requires an external provider; audio-reactive treatment skipped because the extraction helper belongs to a different skill). Scope notes are deliverables too: an honest "not done" beats an implied "done".

## Sources

- `yubi-OS/yubiOS/skills/av-composer/SKILL.md` (source doc, primary)
