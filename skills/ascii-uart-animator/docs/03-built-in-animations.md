# 03. The built-in animations

Scope: the five built-in animation scripts, their frame counts, frame rates, and scene content, and why the table below is the calibration source of truth.

Internal-record subtopic, no dig: the table and scene descriptions are verbatim capability facts from the source doc (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)).

## The catalog

| Script | Frames | FPS | Scene |
|---|---|---|---|
| `bouncing_ball.py` | 9 | 10 | Single `o` ball arcing across `=` ground. No clear between frames, so the animation scrolls. |
| `bouncing_ball_ansi.py` | 30 | 30 | Same ball, but ANSI `\x1b[H\x1b[2J` between frames so it redraws in place. |
| `fish_swim.py` | 150 | 25 | Header plus bubbles row plus fish (4 tail-wag variants) in rows 2/3 plus water plus `~` sea floor. |
| `walking_man.py` | 120 | 20 | Stick figure `O /\|` with 4 cycling leg poses, walks right 2 px/frame across `=` ground. |
| `play_all.py` | 309 | mixed | All four in sequence with 1 s separator pauses between. About 17 s total. |

## What each entry teaches

The five scripts are not five variations of one idea. They form a deliberately contrastive set:

- `bouncing_ball` versus `bouncing_ball_ansi` isolates the single variable of doc 04: identical subject matter, the only difference is whether each frame prepends the clear-and-home escape pair. Watching both on the same device makes the scroll-versus-redraw distinction visible rather than theoretical.
- `fish_swim` is the dense-scene case: 150 multiline frames at 25 fps, with layered content (header, bubbles, two fish rows, water column, sea floor) and a 4-variant tail-wag cycle. It is the largest frame body in the catalog, which makes it the most demanding case for the wire-interval arithmetic in doc 05.
- `walking_man` demonstrates per-frame state changes: the stick figure's leg pose cycles through 4 variants while the whole figure translates right 2 pixels per frame across the `=` ground line. Position and pose change on independent cadences within one renderer.
- `play_all` is the integration case: 309 total frames (9 + 30 + 150 + 120), mixed pacing, and 1 s separator pauses between the four segments. Its total runtime of about 17 s makes it the end-to-end smoke test for the whole pipeline.

## The table is the calibration source of truth

The source doc states this explicitly: the Built-in animations table is the calibration source of truth, and a modified script's frame count and FPS must be verified against that table before the script is queued (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). The recursion section strengthens it into an audit rule: before any `play_all` run, verify the table's frame counts and FPS against the actual constants in `scripts/*.py`, because the table rots if scripts change without it (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc); audit discipline expanded in doc 08).

That rule exists because the table is load-bearing in both directions. Downstream, the wire-interval math needs a frame's byte count, which depends on scene width and frame count. Upstream, `play_all`'s 17 s runtime is derived from the four per-script schedules. A silent edit to one script invalidates both without any error being raised anywhere.
