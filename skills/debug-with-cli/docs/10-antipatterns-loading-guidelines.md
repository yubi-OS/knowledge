# 10 Anti-patterns, loading constraints, and guidelines

Scope: the 8 named anti-patterns, the 5 loading constraints, and the 2 guidelines that govern long-lived operation of the bridge. This is an internal-record subtopic, no dig: every claim is grounded in the source doc (yubi-OS/yubiOS skills/debug-with-cli/SKILL.md).

## The 8 anti-patterns

1. **Listening on `0.0.0.0` instead of `127.0.0.1`.** The bridge binds localhost only; Funnel is the ingress. On all interfaces, anything on the target's LAN can probe port 8080 without going through Funnel's TLS (source doc).
2. **Logging the Bearer token in plaintext.** Not in journald, not in `/var/log/`, not in `~/.bash_history`, not in the chat. The token is the auth; leak it, lose it (source doc).
3. **Using a short token.** `openssl rand -hex 32` is 64 characters. Anything shorter than 128 bits is brute-forceable in practice (source doc).
4. **Using a string command instead of argv.** `{"command":"ls /"}` is a shell-injection vector the moment someone writes `{"command":"ls /; rm -rf /"}`. The bridge parses argv, not strings; keep it that way (source doc).
5. **Forwarding Funnel to a non-localhost port that is already exposed.** If port 8080 already hosts other services on the target, pick a different port for the bridge (source doc).
6. **Treating `sudo` as a free action.** `sudo` hangs without a TTY unless `-n` is passed. Pass `-n` always (source doc).
7. **Skipping the local smoke test.** A Funnel'd bridge that fails `curl http://127.0.0.1:8080/run` locally will fail through Funnel too; debug the local case first (source doc).
8. **Mistaking Cloudflare `530` / error 1016 for an auth issue.** That error means the origin (the target box) is not listening on the Funnel'd port. It is a server-up problem, not an auth problem: restart the bridge, check `tailscale funnel status`, verify the process is running with `ss -tlnp | grep 8080` (source doc).

## The 5 loading constraints

- **Argv-only by design.** Do not extend the bridge to accept shell strings. A caller who needs pipes or `&&` passes `["bash", "-c", "..."]` themselves, and accepts the responsibility (source doc).
- **No logging by default.** The bridge logs request lines to stderr at INFO level only if turned on; filter before forwarding to journald. Command stdout and stderr returned in the response body are the default audit (source doc).
- **One bridge per target machine.** If the target needs multiple "shells" (for example different allowlists), run them on different ports. Do not multiplex allowlists via env vars; that is a footgun (source doc).
- **Token rotation cadence.** Rotate the Bearer when (a) the Sauna connection is dropped, (b) the target box's Tailscale node is removed or re-added, (c) any team member with access to the box changes. Rotation is a new `openssl rand -hex 32`, an update to `/etc/rock1-shell.env`, a bridge restart, and a Sauna connection form update (source doc).
- **Read the alternatives section before re-evaluating.** If a future session proposes mcp-proxy or Cloudflare Tunnel without checking the auth model, surface this skill as the precedent (source doc).

## The 2 guidelines

1. Argv-only by design (as above; the guidelines section restates it as rule 1) (source doc).
2. One bridge per target machine (restated as rule 2) (source doc).

## Scope closure

The source doc closes with a containment rule: every use stays inside the frontmatter description's scope; anything beyond it is a different skill's job (source doc). Combined with the do-NOT-use list in doc 02, this makes the boundary explicit at both ends: what triggers the skill, and what the skill must refuse to grow into.
