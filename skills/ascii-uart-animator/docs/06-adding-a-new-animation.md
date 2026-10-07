# 06. Adding a new animation

Scope: the three-step recipe for extending the catalog with a new animation, including the exact loop-to-bash-script pattern and the verification step that closes it.

Internal-record subtopic, no dig: the recipe and code pattern come from the source doc (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)).

## Step 1: write the renderer

Write `render_frame(n, total)` returning a `\n`-joined string (source doc, https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). The function receives the frame index and the total frame count, so a renderer can express both cyclic motion (a tail that wags through 4 variants, a leg pose that cycles) and cumulative motion (the walking man's 2-pixel-per-frame drift) purely from those two arguments. The built-in renderers in doc 03 are the working references for both styles.

## Step 2: loop the frames into a bash script

The source doc gives the exact loop pattern:

```python
for n in range(TOTAL_FRAMES):
    lines.append(f"printf '\x1b[H\x1b[2J%b\n' {repr(render_frame(n))} > /dev/ttyS2")
    lines.append(f"sleep {FPS_DELAY:.3f}")
```

Each iteration appends two lines: one printf write of the frame to the device, and one sleep. The pattern has three load-bearing details:

1. The `\x1b[H\x1b[2J` prefix is baked into the format string, which selects clear-and-redraw presentation (doc 04). Omitting it from the format string selects scroll mode instead.
2. The frame is passed through Python's `repr()`, and the `%b` directive converts the repr's escaped newlines back into real ones. Substituting `%s` is the documented one-character failure (source doc, https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)).
3. `FPS_DELAY` is formatted with 3 decimal places so sub-10 ms sleeps survive the round trip into the bash script.

## Step 3: post to the bridge

Bundle the lines into one script and POST it to the bridge via `scripts/bridge.py:post_to_bridge` (source doc, https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). This reuses the same JSON `{"command": ["bash", "-c", script]}` transport described in doc 01, so a new animation inherits the bridge's quirks and latency bound without extra code.

## Close the loop against the table

The recipe ends where doc 03's audit rule begins: a modified or newly added script's frame count and FPS must be verified against the Built-in animations table before it is queued (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). In practice that means two checks before a first `play_all`:

- The new script's constants (`TOTAL_FRAMES`, `FPS_DELAY`) match what the table (or the table's updated row) records.
- The new total, added to the existing 309 frames and separator pauses, still respects the bridge latency bound from doc 07, or the script is split into per-batch calls.

The source doc's re-run trigger list makes the same point from the other direction: adding a new animation script is itself a trigger to update the table and the audit line (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). A new animation is not done when it renders; it is done when the table, the constants, and the audit line agree.
