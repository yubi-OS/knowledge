# 05. Pacing and the wire-interval model

Scope: the three knobs that control an animation's speed, the wire-interval formula that makes the real frame interval longer than the scheduled one, and the arithmetic that connects the two.

## The knobs

Every script carries three constants near the top (source doc, https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)):

- `W` is the scene width in characters.
- `TOTAL_FRAMES` is how many frames the loop contains.
- `FPS_DELAY` is the seconds of sleep between frames; lower means faster.

Scene width matters because it sets frame size, and frame size matters because of the next section. A wide `fish_swim` frame costs far more wire time than a narrow bouncing-ball frame at the same FPS_DELAY.

## The wire-interval formula

The source doc states the core model: the actual frame interval on the wire is `FPS_DELAY + (bytes_per_frame / baud_rate)`. At 115200 8N1, a 200-byte frame adds about 17 ms of transmission time on top of the schedule (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). The formula exists because the sleep only paces script execution; each frame's bytes still have to physically cross the UART, and that transfer consumes real time the sleep does not account for.

## The arithmetic behind the 17 ms

The 8N1 configuration frames each byte as a 10-bit character: 1 start bit, 8 data bits, 1 stop bit. That framing is the standard asynchronous serial layout (https://en.wikipedia.org/wiki/Asynchronous_serial_communication, weight 0.53; https://en.wikipedia.org/wiki/Universal_asynchronous_receiver-transmitter, weight 0.50).

From there the arithmetic is direct:

- 115200 baud with 10 bits per byte gives 11520 bytes per second of raw capacity.
- One byte therefore takes 1/11520 of a second, about 86.8 microseconds.
- A 200-byte frame takes 200 x 86.8 microseconds, about 17.4 ms, which matches the source doc's "about 17 ms" figure (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)).

Frame-time calculators used across embedded work compute the same quantity from baud rate, data bits, parity, and stop bits (https://rftools.io/calculators/protocol/uart-baud-rate/, weight 0.27, weak backing; https://binarycon.com/tools/serial-transmission-time-calculator/, weight 0.18, weak backing; https://www.compu-tools.com/uart/, weight 0.20, weak backing).

## What the formula explains

The source doc's calibration section draws the operational conclusion: when pacing looks stuttery, recompute the wire interval before touching FPS_DELAY (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). A rendered-but-frozen animation means pacing was scheduled but transmission dominated, so the fix is arithmetic, not the renderer and not the UART (source doc, https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)).

Concretely, at 30 fps the scheduled interval is 0.033 s. A 200-byte frame's 17 ms of transmission is half of that budget again, so the true interval is about 50 ms, or 20 fps effective. The larger and wider the frame, the worse the gap: `fish_swim` at 25 fps with its multi-line layered scene is the catalog's heaviest frame, per doc 03's table.

## The demonstrated ceiling

The source doc records the demonstrated ceiling: 30 fps (a 0.033 s interval) is demonstrated working end-to-end via `bouncing_ball_ansi` with 30 frames at 30 fps. Rates above that are untested on this bridge and must be treated as unvalidated (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). Since every additional fps shrinks the sleep while the transmission component stays fixed, the ceiling is a pacing-margin statement: above 30 fps the fixed 17 ms of a 200-byte frame crowds out the scheduled interval entirely.

## Design rule

Treat FPS_DELAY as the pacing knob and frame size as the hidden second knob. The workflow the source doc implies: compute the intended interval, estimate bytes per frame from `W` and the scene's line count, add the transmission term, and only then decide whether the schedule is achievable at 115200 8N1 (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). If the resulting interval exceeds the ceiling, the honest options are smaller frames, a lower FPS, or a higher baud rate, not a shrunk sleep.
