# 08. Calibration and the UART testing discipline

Scope: the measured calibration values the skill's own operation produced, the false-positive check, and the testing discipline that makes a blind UART write trustworthy.

## The calibration record

The source doc's calibration section records measured numbers from this skill's own operation on rock1 at 115200 8N1 with bridge user `shant` (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)):

- Wire-interval floor: the actual frame interval is `FPS_DELAY + (bytes_per_frame / baud_rate)`. At 115200 baud a 200-byte frame adds about 17 ms of transmission time. Recompute the wire interval before touching FPS_DELAY when pacing looks stuttery.
- Demonstrated FPS ceiling: 30 fps (0.033 s interval) is demonstrated working end-to-end (`bouncing_ball_ansi`, 30 frames at 30 fps). Higher rates are untested on this bridge and must be treated as unvalidated.
- Bridge latency bound: one bridge call with a multi-thousand-line bash script takes 20+ seconds of wall clock; split into per-batch calls rather than growing TOTAL_FRAMES.
- Calibration source of truth: the Built-in animations table (9 at 10 fps, 30 at 30 fps, 150 at 25 fps, 120 at 20 fps, 309 mixed, about 17 s for `play_all`). Verify a modified script's frame count and FPS against that table before queueing it.
- False-positive check: a rendered-but-frozen animation means pacing was scheduled but transmission dominated. Recompute the wire interval; do not blame the renderer or the UART.

Every one of those numbers is a measured artifact, not a design goal. That is what makes them calibration values rather than documentation: they are the baseline against which future changes are diffed (source doc, https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)).

## The false-positive check as a testing lesson

The false-positive check is the discipline's core: the most likely misdiagnosis of a broken animation is the wrong layer. The symptom "frames render but the animation is frozen" has three candidate causes (renderer, UART, pacing), and the calibration record says which one to eliminate first: recompute the wire interval (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). The wire math from doc 05 shows why this is checkable from the desk: if bytes-per-frame times 86.8 microseconds exceeds the intended interval, the diagnosis is settled without touching the device.

## Observing the UART from the other side

The skill writes blind, but the receiving side can be opened with standard serial-terminal tooling, and the digs support that picture. picocom is a minimal dumb-terminal emulation program designed for simple configuration, testing, and debugging of serial connections (https://linux.die.net/man/8/picocom, weight 0.52). It is one of the standard programs (screen, minicom, picocom, tio) used to reach serial consoles, where a regular user without serial-port access typically hits permission denied until added to the dialout group (https://cmaven.github.io/en/etc/linux-serial-terminal-programs/, weight 0.16, weak backing). Serial-console debugging workflows commonly attach through minicom or screen (https://www.jeffgeerling.com/blog/2021/attaching-raspberry-pis-serial-console-uart-debugging, weight 0.27, weak backing), and device vendors document the same stty-plus-terminal pattern for UART setup (https://developer.toradex.com/software/development-resources/configuring-serial-port-debug-console-linuxu-boot/, weight 0.41, weak backing; https://www.rt-thread.io/document/site/programming-manual/device/uart/uart/, weight 0.41, weak backing).

That permission point mirrors the skill's own constraint: `/dev/ttyS2` is mode `0600` and owned by the bridge user `shant` (source doc, https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)), the same class of restriction the tooling guides describe for interactive users (weak backing, the dialout-group claim above). The skill sidesteps the interactive path by running as the owning user inside the bridge.

## The three test uses

The source doc's frontmatter names what the skill is for: testing UART throughput, verifying ANSI rendering on the receiver, and exercising the debug CLI bridge with something tangible (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). The calibration record is what turns each from a slogan into a procedure:

- Throughput testing works because the payload is deterministic: known bytes at a known cadence, so a throughput regression shows up as the frozen-frame symptom of the false-positive check.
- ANSI-rendering verification works because the built-in contrast pair (scrolling `bouncing_ball` versus redrawn `bouncing_ball_ansi`, doc 03) makes the escape-sequence handling observable as two visibly different behaviors on the same device.
- Bridge exercising works because `play_all` pushes 309 frames in one call chain, near the documented latency bound, which makes bridge stress measurable in wall-clock seconds.

## Governance and re-run triggers

The recursion section adds the standing self-audit rules: verify the live rock1 bridge connection id before every play, because the frontmatter's connection id has churned before (the 2026-09-24 auth repair deleted the old `conn_6rp6oRY9DBJG` rows); run the table-versus-scripts audit before any `play_all`; and never re-add unsupported claims, per the 2026-09-17 precedent that removed template paragraphs asserting capabilities the skill does not implement (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). Re-run triggers are: the UART device path or baud rate changes on rock1, the shell bridge is re-created or re-tokened, or a new animation script is added, in which case update the table and the audit line (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)).

Note on connection ids: the source doc's Running section still shows `conn_6rp6oRY9DBJG`, while the Recursion section records that rows under that id were deleted during the 2026-09-24 auth repair and the live id must be checked in the session's connection list before posting (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). The current live rock1 shell bridge connection id is `conn_W36n4EetFoNp` (verified against this session's connection list, internal record, 2026-10-06). The dated drift is recorded here as a correction, not a contradiction: the skill's own recursion rule anticipated it.
