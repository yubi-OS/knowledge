# 07. Bridge quirks and limits

Scope: the two operational quirks of the shell-bridge transport, the failure modes they create, and the mitigations the source doc records.

Internal-record subtopic, no dig: all claims are from the source doc (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)).

## Quirk 1: no shell interpolation at the bridge boundary

The bridge runs `subprocess.run(argv)` directly, so there is no shell interpolation at the transport layer (source doc, https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). The practical consequence the source doc draws: everything dangerous, quoting included, goes inside the `bash -c` script as one big quoted string.

This is a security-positive design. With argv-style execution, the JSON body's command array cannot be split, globbed, or substituted by an intermediate shell. It also concentrates all quoting complexity in one place: the bash script itself must carry correct quoting for every frame write, which is exactly where the `%b` versus `%s` rule from doc 04 lives. A frame string containing single quotes, newlines, or backslashes is safe only because `repr()` escaping plus the quoted `bash -c` argument keep those bytes intact until printf interprets them.

The flip side is a debugging hazard: an error in the bash script surfaces as whatever bash prints to the bridge response, not as a structured failure. Since the script is opaque text inside a JSON string, the usual instinct to "quote it for the shell" at the wrong layer produces silent corruption rather than an error. The correct layering, per the source doc: Python builds and quotes the payload, bash executes it, printf writes it, and the tty renders it (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)).

## Quirk 2: large scripts cost 20+ seconds

A bridge call carrying a multi-thousand-line bash script takes 20+ seconds of wall clock (source doc, https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). The source doc pairs this fact with a rule: if a single animation's script approaches this bound, split it into per-batch calls instead of growing TOTAL_FRAMES.

The mitigation direction matters. The instinct under a slow animation is to add frames, but frames are exactly what grows the script toward the bound. The documented alternative keeps TOTAL_FRAMES moderate and issues several bridge calls, each carrying a chunk of the frame sequence. The separator-pause pattern that `play_all` uses between its four segments (doc 03) is the same shape applied at the segment scale.

The caller-side mitigation is a timeout: set the `run_script` timeout accordingly for bridge calls with large payloads (source doc, https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). A 20-second-plus round trip exceeds most default timeouts, so an unset timeout fails the invocation even though the bridge would have completed it.

## Quirk 3 (derived): the response is not the animation

Neither quirk produces a visible error on the receiving device. A script that quotes wrong renders garbage; a script that times out on the agent side may still be running on rock1. Both quirks therefore funnel into the same discipline doc 08 formalizes: verify intent against the calibration table before queueing, and interpret observed symptoms through the wire-interval model rather than blaming the renderer or the UART (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)).

## Boundary

These quirks are properties of the shell-bridge transport as the skill uses it, not of Tailscale Funnel generally. The source doc records only what this skill's operation measured: the argv execution model, the 20-second bound, and the timeout requirement (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). Anything about the bridge's token lifecycle belongs to the shell-bridge connection itself and surfaces in this skill only through the stale-connection failure covered in doc 08.
