# 01. How it works: the bridge execution model

Scope: the end-to-end pipeline that carries a rendered ASCII animation from an agent-side Python script, through the rock1 shell bridge, onto the UART character device.

## The 5-step pipeline

The source doc specifies the pipeline exactly:

1. Python builds a per-frame ASCII string for the requested animation.
2. The frame string is wrapped in a `printf '...\n' '<frame>' > /dev/ttyS2` line. For a clean redraw instead of a scroll, the line is prepended with `\x1b[H\x1b[2J` (cursor home plus clear screen).
3. All frames are bundled into one bash script with `sleep FPS_DELAY` between them.
4. The script is POSTed to the bridge at `https://rock1.tail3a04f5.ts.net/run` as a JSON body of the shape `{"command": ["bash", "-c", "<script>"]}`.
5. rock1 runs the script as user `shant`, who owns `/dev/ttyS2` at mode `0600`.

Every one of those five statements is a source-doc claim (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). The design has two halves worth explicating: the transport (why a bridge) and the sink (why a tty device file).

## The transport: a Tailscale Funnel HTTP bridge

The bridge URL lives under `rock1.tail3a04f5.ts.net`, the Tailscale tailnet domain of the rock1 box. Tailscale Funnel is the feature that routes public-internet traffic to a service on a tailnet node, which is what makes the `/run` endpoint reachable from an agent without a VPN on the agent side (https://tailscale.com/docs/reference/examples/funnel, weight 0.05, weak backing; https://tailscale.com/docs/use-cases/application-testing/share-local-dev-server, weight 0.05, weak backing).

The request body is a JSON object with a single `command` key whose value is an argv array. The bridge executes it with `subprocess.run(argv)` directly, with no shell interpolation (source doc, https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). That is why the animation payload travels as one element of the argv: the whole bash program, including every frame write, is the second argument after `bash -c`. Consequences of this choice are covered in doc 07.

## The sink: writing to a UART character device

The animation target is `/dev/ttyS2`, a standard Linux serial-port device node. Serial ports on Linux map to `/dev/ttyS*` device files, and programs interact with them by writing bytes to the device as if it were a file (https://www.baeldung.com/linux/map-serial-port-dev-tty, weight 0.21, weak backing). The tty subsystem sits between applications and the serial hardware, providing line discipline and device semantics (http://www.linusakesson.net/programming/tty/, weight 0.39, weak backing).

The write side needs no terminal emulator attached. Serial console guides assume an interactive reader on the other end (https://wiki.archlinux.org/title/Working_with_the_serial_console, weight 0.43, weak backing), but this skill deliberately writes blind: the receiving device just renders whatever bytes arrive, which is exactly what makes the UART a usable canvas for animation.

## The frame write model

Each frame is one `printf` write. The frame is a multiline string: `printf` receives it as a single argument and emits its bytes in one shot to the device. Between frames the script sleeps for `FPS_DELAY` seconds (source doc, https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). There is no frame protocol and no acknowledgment: pacing is entirely open-loop, which is why the wire-interval arithmetic in doc 05 matters.

Because every frame goes through the same write path, the animation is also a throughput instrument: a known number of bytes at a known cadence makes deviations observable. The source doc names that as a use case: testing UART throughput and exercising the debug CLI bridge with something tangible (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)).

## What this doc does not claim

The bridge's authentication mechanism (the shell-bridge connection carries a bearer token), rock1's hardware identity, and the electrical layer on the far side of the UART are outside this corpus. The source doc pins only what the skill itself touches: the URL, the JSON shape, the executing user, and the device node.
