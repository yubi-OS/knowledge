# 04. ANSI rendering mode: clear and redraw versus scroll

Scope: the two frame-presentation modes, the escape sequences and shell quoting rules that implement the redraw mode, and why the `%b` printf directive is the hinge.

## Two presentation modes

The skill ships both modes deliberately. `bouncing_ball.py` sends 9 frames with no clear between frames, so the receiving display scrolls and the ball leaves a trail of prior positions down the screen. `bouncing_ball_ansi.py` sends 30 frames of the same ball but prepends `\x1b[H\x1b[2J` to each frame, so the display clears and redraws in place, producing a crisp bouncing ball rather than a streak (both claims: source doc, https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)).

The escape pair decomposes as: `\x1b[H` moves the cursor to the home position, and `\x1b[2J` erases the display. These are standard ANSI/VT100 control sequences from the CUP (cursor position) and ED (erase display) families, documented in the VT100 programmer reference (https://vt100.net/docs/vt100-ug/chapter3.html, weight 0.53) and in modern ANSI escape code references (https://en.wikipedia.org/wiki/ANSI_escape_code, weight 0.38, weak backing; https://espterm.github.io/docs/VT100%20escape%20codes.html, weight 0.35, weak backing; https://www2.ccs.neu.edu/research/gpc/VonaUtils/vona/terminal/vtansi.htm, weight 0.30, weak backing).

## Why `%b`, not `%s`

The frame strings are produced in Python, and Python's `repr()` of a multi-line string wraps the whole thing in single quotes and escapes internal newlines as the two-character sequence `\n`. The source doc flags this as the reason `%b` is required: the `%b` printf directive interprets those `\n` escapes as real newlines, while `%s` would emit them literally as backslash-n text on the wire (source doc, https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)).

Bash built-in printf background: the `%b` directive causes escape sequences in the argument to be interpreted, which is the documented behavior the skill depends on (https://linuxize.com/post/bash-printf-command/, weight 0.16, weak backing; https://www.gnu.org/software/bash/, weight 0.11, weak backing). Stack Exchange threads on printf backslash escaping show the failure mode in the other direction: uninterpreted escapes print as literal text (https://stackoverflow.com/questions/31224368/how-do-i-escape-a-series-of-backslashes-in-a-bash-printf, weight 0.06, weak backing).

The consequence is a one-character bug class: swap `%b` for `%s` and every frame renders as a single line of visible `\n` characters instead of a multi-line scene. Because there is no error, only wrong output, the built-in scripts' correct usage is the reference.

## The two-hex-digit constraint

Bash `printf` requires `\xHH` with exactly two hex digits. The source doc points out that `\x1b[H\x1b[2J` works because `\x1b` is exactly two hex digits (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). An escape written with the wrong digit count is either parsed as a different byte or as literal text, so the clear-and-home prefix is written in its exact two-digit form everywhere in the skill.

## Picking a mode

The source doc frames the choice as functional, not aesthetic: use the escape pair for a clean redraw instead of a scroll (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). The decision rule that follows from the built-in contrast pair: if the animation is a moving object over a fixed background, redraw mode is correct. If the point is to show history or a growing trace, scroll mode is correct and the escape pair must be omitted. `bouncing_ball` and `bouncing_ball_ansi` are the paired reference implementations for both choices, and doc 03's table pins their frame counts and rates.
