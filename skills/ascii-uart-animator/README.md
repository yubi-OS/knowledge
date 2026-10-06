# ascii-uart-animator knowledge corpus

A corpus explicating the yubiOS skill `skills/ascii-uart-animator` (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md): sending framed ASCII animations to a UART device (for example `/dev/ttyS2` on rock1) over the Tailscale-Funnel shell bridge, the built-in animations, the ANSI redraw mode, and the UART testing and calibration discipline the skill encodes.

## Documents

| NN | Doc | Scope |
|---|---|---|
| 01 | 01-how-it-works.md | The 5-step bridge execution model: Python renders frames, one printf write per frame, one bundled bash script, POST to the rock1 bridge, executed as user shant |
| 02 | 02-running-the-skill.md | Invocation contract: run_script with the bridge connection, self-contained scripts, inline render_frame prototyping |
| 03 | 03-built-in-animations.md | The five built-ins (9@10fps, 30@30fps, 150@25fps, 120@20fps, 309 mixed) and the table as calibration source of truth |
| 04 | 04-ansi-rendering-mode.md | Clear-and-redraw versus scroll: ESC[H ESC[2J, the %b printf directive, repr() newline escaping, the two-hex-digit rule |
| 05 | 05-pacing-and-wire-interval.md | The knobs and the wire-interval model: FPS_DELAY plus bytes/baud, the 17 ms example, the 30 fps demonstrated ceiling |
| 06 | 06-adding-a-new-animation.md | The extension recipe: render_frame(n, total), the loop-to-bash pattern, post_to_bridge, table verification |
| 07 | 07-bridge-quirks-and-limits.md | No shell interpolation at the bridge boundary; 20+ second wall clock for large scripts; the derived response-is-not-the-animation caveat |
| 08 | 08-calibration-and-testing-discipline.md | The measured calibration values, the false-positive check, receiver-side observation tooling, and the governance/re-run triggers |

Subtopic 09 (governance-coverage-and-recursion) was dropped at outline validation (score 0.11); its load-bearing parts are folded into doc 08.

## Research summary

- Results collected: 84, weighted high (>= 0.5) 6 / low (< 0.5) 78. Weak-backed claims are labeled in the docs.
- Jev requests: 7 (typesafe/jev-1.13 via DefAPI direct, https://api.defapi.org/api/v1/decisions), usage 10356 input / 1843 output tokens.
- Redos: doc 05 dig redone once (attempt 1 noise; attempt 2 produced Wikipedia async-serial 0.53 and UART 0.50); doc 08 dig redone twice (best final results: Wikipedia UART 0.51, Analog Devices 0.51, picocom man page 0.52).
- Skipped docs: none. Dropped at outline: 09.
- Preflight 2026-10-06: searXNG healthy (campaign preflight, orchestrator-side); /api/decide (typesafe/jev-1.13) 200 via DefAPI direct.

## Source attribution

The ground source is the primary source of record; every doc cites it as its grounding spine. Web-shaped subtopics (01, 04, 05, 08) carry searXNG digs; internal-record subtopics (02, 03, 06, 07) cite the source doc only and say so.
