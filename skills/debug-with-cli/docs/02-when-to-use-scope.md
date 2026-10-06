# 02 When to use and when not to

Scope: the trigger conditions for reaching for the debug bridge, and the four boundaries that keep it from being used where a simpler tool already exists. This is an internal-record subtopic, no dig: every claim is grounded in the source doc (yubi-OS/yubiOS skills/debug-with-cli/SKILL.md).

## Apply when

The source doc lists 4 trigger conditions:

1. The user wants the agent to run shell commands on a machine the agent cannot otherwise reach: a CI runner (rock1, the yubiOS ARM64 SBC), a homelab dev box, a NAS, anything with Tailscale that is not publicly SSH'd (source doc).
2. The debug loop is "read logs, inspect state, run a probe". This is the loop the skill turns a 20-minute GitHub Actions round-trip into a 20-second curl (source doc).
3. The user explicitly says "drive that machine", "live shell", "connect you to a CLI", "use Tailscale to issue CLI", or an equivalent (source doc).
4. Existing yubiOS CI debug work needs to be reproduced or extended on the runner host directly, for example re-running a step that the GitHub Actions log truncated (source doc).

The frontmatter description adds its own trigger phrases: "run command on rock1", "execute on remote", "debug the runner", "check service on the box", "tail journalctl on the live host" (source doc).

## Do NOT use

The source doc is explicit about 4 anti-trigger cases, and they are the interesting half of the section because each names the better tool:

- The work is already an HTTP API call. Use the existing connection row directly; do not add a shell layer underneath it (source doc). A bridge in front of an API adds an argv conversion step and an extra process for nothing.
- The user wants a one-off read on a single log line. Use the GitHub Actions logs API or `mcp list` against an existing MCP server; do not stand up a new bridge for one grep (source doc).
- The target machine has no Tailscale and no way to install it. The skill presumes Tailscale as the bootstrap; without it there is no public HTTPS surface and no Funnel URL (source doc).
- The action needs a real interactive PTY. The bridge is `subprocess.run`, non-interactive. For TUI or REPL needs the source doc points at `ttyd` or ssh-over-WebSocket instead (source doc).

## The trigger-vs-artifact boundary rule

The source doc states a general routing rule: when a request only names a trigger ("speed up debug") without the artifact it acts on, route to the owning surface instead of improvising inside this skill (source doc). In practice this means the agent should ask which machine and which command surface the user means rather than guessing that the nearest SBC is the target.

## Practical reading

The scope is narrower than "run anything anywhere". It is: persistent, Bearer-authed, argv-array shell execution on one specific machine the sandbox cannot reach otherwise, for the read-logs-inspect-probe debugging loop. Everything outside that shape (interactive sessions, one-off API calls, machines with no Tailscale) belongs to a different tool, and the source doc says so explicitly rather than leaving the boundary implicit.
