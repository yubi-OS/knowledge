# 01 - Setting Up Chrome DevTools MCP

Scope: how the browser-testing-with-devtools skill wires Chrome DevTools MCP into an agent environment: the npx server entry, the three profile modes, and the Sauna runtime translation of that setup.

Grounding spine: source doc yubi-OS/yubiOS skills/browser-testing-with-devtools/SKILL.md (the "Setting Up Chrome DevTools MCP" section).

## The server entry

The skill assumes a Claude-Code-style project config that launches the DevTools MCP server through npx (source doc):

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest", "--isolated"]
    }
  }
}
```

Two details carry the meaning. The `-y` flag skips the npx install confirmation so an unattended agent does not stall on a prompt. The `@latest` tag pins nothing: the server is whatever npm shipped most recently, which keeps setup one-line but couples the agent's tool surface to upstream release cadence. The package is published on npm as `chrome-devtools-mcp` (https://www.npmjs.com/package/chrome-devtools-mcp, jev weight 0.16, weak backing). Chrome's own documentation now treats "Chrome DevTools for agents" as a first-class setup path with the same npx-based flow (https://developer.chrome.com/docs/devtools/agents/get-started, jev weight 0.90).

## Three profile modes, one decision

The source doc draws a hard line between three ways the server can obtain a Chrome instance, and the choice is a security decision, not a convenience toggle (source doc):

1. **Dedicated profile (no connect flags).** The server launches Chrome with its own profile under `~/.cache/chrome-devtools-mcp/`, separate from the user's personal browser. This is the default.
2. **`--isolated`.** One step further: a temporary profile that is wiped when the browser closes. The source doc calls this the right setup for most testing.
3. **`--autoConnect`.** Attaches the agent to the user's running Chrome instead of launching a new one. Requires Chrome 144 or newer and requires the user to enable remote debugging through `chrome://inspect/#remote-debugging` (source doc). Chrome's own use-case documentation for auto-connect describes the same attach-to-your-personal-browser flow and its tradeoffs (https://developer.chrome.com/docs/devtools/agents/use-cases/auto-connect, jev weight 0.84).

The default-to-isolated rule exists because of what each mode exposes. The dedicated and isolated modes give the agent a clean browser with no session cookies, no logged-in email, no saved passwords. `--autoConnect` gives the agent everything the human browser holds. The source doc states the rule plainly: only use `--autoConnect` when the test genuinely needs the logged-in state, and read the Profile Isolation rules first (source doc). Chrome's engineering blog on letting a coding agent debug your browser session frames the same boundary from the vendor side (https://developer.chrome.com/blog/chrome-devtools-mcp-debug-your-browser-session, jev weight 0.76).

## The remote debugging substrate

`--autoConnect` sits on top of Chrome's remote debugging port machinery. That machinery changed under the ecosystem in Chrome 136: Chrome stopped letting `--remote-debugging-port` attach to the default user data directory and now requires a non-default `--user-data-dir` for the debugging port to open at all (https://developer.chrome.com/blog/remote-debugging-port, jev weight 0.85). The motivation was attack-surface reduction: a debugger port pointed at the real profile is a standing credential-exfiltration channel. A Chromium issue tracker entry documents the residual default-directory-bypass discussion on that change (https://issues.chromium.org/issues/429117827, jev weight 0.57). The general remote-debugging workflow that underlies these modes is documented for device debugging as well (https://developer.chrome.com/docs/devtools/remote-debugging, jev weight 0.95).

For the skill this produces a concrete consequence: any mode that attaches to a real profile is fighting the platform's own security posture, and the friction the user feels (`chrome://inspect/#remote-debugging` enablement, Chrome 144 minimum) is deliberate. The skill treats that friction as a feature: it makes accidental attachment to the user's daily browser harder (source doc).

## The Sauna runtime translation

The source doc carries a dated environment note (2026-07-24) that matters for any reader operating outside a Claude-Code-style project: the `.mcp.json` setup does not exist in Sauna's runtime. Sauna has its own `browser_use` tool for interactive browser tasks and its own `connect_account` / `mcp` CLI flow for MCP servers, not a project-local config file. The note also records that yubiOS itself has no browser UI in scope, so the skill rarely triggers for yubiOS work; if a future yubiOS admin UI or attestation dashboard needs browser verification, the instruction is to translate the workflow to Sauna's `browser_use` tool rather than following the MCP setup steps literally (source doc).

The translation is mechanical: the profile modes become Sauna's per-session browser isolation, the tool table becomes `browser_use` capabilities, and the security boundaries in doc 04 apply unchanged because they are about agent behavior, not about which MCP client launched the browser.

## Sources for this doc

- Source doc: yubi-OS/yubiOS skills/browser-testing-with-devtools/SKILL.md (primary source of record).
- https://developer.chrome.com/docs/devtools/agents/get-started (jev 0.90)
- https://developer.chrome.com/docs/devtools/agents/use-cases/auto-connect (jev 0.84)
- https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/skills/chrome-devtools-cli/references/installation (jev 0.79)
- https://developer.chrome.com/blog/chrome-devtools-mcp-debug-your-browser-session (jev 0.76)
- https://developer.chrome.com/docs/devtools/remote-debugging (jev 0.95)
- https://developer.chrome.com/blog/remote-debugging-port (jev 0.85)
- https://issues.chromium.org/issues/429117827 (jev 0.57)
- https://www.npmjs.com/package/chrome-devtools-mcp (jev 0.16, weak backing)
