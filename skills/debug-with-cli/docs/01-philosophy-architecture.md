# 01 Philosophy and architecture of the debug bridge

Scope: why the debug-with-cli skill exists and why its architecture is an HTTP bridge rather than SSH, MCP, or direct tailnet membership. This is an internal-record subtopic, no dig: every claim here is grounded in the source doc (yubi-OS/yubiOS skills/debug-with-cli/SKILL.md).

## The constraint that shapes everything

The Sauna sandbox is a Cloudflare Worker or Northflank container. It has full outbound network access, but it is not on the user's Tailscale tailnet (source doc). Three consequences follow, all stated by the source doc:

1. There is no `tailscale` binary in the sandbox, so the agent cannot join the tailnet itself.
2. The agent cannot `ssh` to machines that are not publicly routable, which is exactly the condition of a homelab CI runner, SBC, or NAS.
3. The Sauna auth proxy intercepts outbound HTTP and injects credentials, so HTTP is the one transport the sandbox already does well.

When a user says "speed up debug" or "drive the live CI host", the natural ask is to let the agent run commands on the box (source doc). The skill's answer is always the same shape: the target box runs an HTTP server that accepts Bearer-authenticated POST requests carrying an argv-array command, and returns `{stdout, stderr, returncode}` (source doc).

## The four moving parts

The source doc codifies a canonical setup with exactly four components:

- Tailscale Funnel provides the public HTTPS surface, so a box with no public IP is still reachable from the sandbox.
- A roughly 50-line Python stdlib server is the bridge; no pip install, no framework (source doc).
- A 32-byte Bearer token (256 bits) is the entire auth model (source doc).
- A `connection_type: keys` Sauna connection with `auth_type: bearer` makes the Sauna proxy inject the Authorization header on every call (source doc).

## Argv shape as a feature, not a limitation

The `command` field is a JSON array of strings passed straight to `subprocess.run` with no `/bin/sh -c` interpretation. The source doc frames this as a feature: no injection, no quoting issues, no `;`-versus-`&&` confusion. Even when the caller sends `["bash", "-c", "..."]`, that is still argv to bash, not a shell string to `sh -c`; the bridge code enforces `subprocess.run(cmd, shell=False)` regardless (source doc).

This is the load-bearing design decision of the whole skill. It trades shell convenience (pipes, redirection, per-call env) for a command surface that cannot inject. Section 06 covers what that costs and how the skill restores shell features explicitly.

## Why this shape over the alternatives

The source doc documents six alternatives that were tried or evaluated and rejected (covered fully in doc 09). The pattern behind the rejections is consistent: the auth model has to work from an HTTP-only sandbox without per-call interactive flows, and the bridge has to protect hardware-attached machines (a CI SBC with a real YubiKey attached, destructive disk tests on `/dev/sda`). Any approach without inbound request authentication fails that bar; any approach requiring the sandbox to hold identity (tailnet user, client certs) fails the transport bar (source doc).

The resulting architecture is therefore deliberately minimal: one process on the target, one token, one HTTP route (`POST /run`), one JSON response shape. The 20-minute GitHub Actions log round-trip becomes a 20-second curl (source doc).
