# 04. The stable to @next replacement map

Scope: row-by-row API deltas from the source doc's replacement map, with the doc evidence behind each row.

## Transport and sessions: removed

| Stable | @next |
|---|---|
| `SANDBOX_TRANSPORT` / `transport` / `setTransport` | Remove, RPC only |
| Default / named sessions | Gone: `cwd`/`env` per launch, or one shell script |

The migrate doc gives the exact removal list: "Remove transport selection. Delete SANDBOX_TRANSPORT, the transport option on getSandbox(), SandboxTransport types, and sandbox.setTransport(). No replacement setting is required" ([0.82](https://developers.cloudflare.com/sandbox/1-0-preview/migrate/)). The stable transport page confirms the direction of travel: it documents transport selection on the stable package and states that "Sandbox SDK 1.0 (preview on @next) uses a single RPC control channel" ([0.77](https://developers.cloudflare.com/sandbox/configuration/transport/)). A weakly weighted community post dates the deprecation: "In April 2026, we released the new RPC transport and deprecated the WebSocket transport" ([0.14](https://community.cloudflare.com/t/sandboxes-deprecating-sandbox-sdk-features/933294)), and another weak post summarizes the preview as "RPC as the only transport" ([0.11](https://community.cloudflare.com/t/sandbox-sdk-sandbox-sdk-1-0-preview-on-next/947721)).

Sessions were a stable-API concept: "Create shell sessions with independent working directories and environment variables within a sandbox" ([0.83](https://developers.cloudflare.com/sandbox/api/sessions/)). In the preview, per-launch `cwd` and `env` options replace them (source doc), and state that previously persisted across commands no longer does (doc 03). The migration shape is either per-launch options or folding a multi-command sequence into one shell script invoked with an explicit shell binary.

## exec and process handles: one unified shape

| Stable | @next |
|---|---|
| `await sandbox.exec("cmd")` returns buffered result | `await sandbox.exec(argv)` returns a handle, then `output` / waits |
| `execStream` / `startProcess` | Same handle: `logs`, `waitFor*`, `kill` |

The preview overview states the stable-versus-preview contrast directly: "Command execution Stable: sandbox.exec (string) resolves when the command finishes with buffered output. Long-running services and streaming use separate APIs (startProcess, execStream). Preview: sandbox.exec() takes argv and resolves when the process starts" ([0.75](https://developers.cloudflare.com/sandbox/1-0-preview/)). The processes guide frames the target model: "treat the sandbox as a computer you drive with explicit programs" ([0.79](https://developers.cloudflare.com/sandbox/1-0-preview/processes/)). The process API reference documents the handle surface: `logs`, waits including `waitForExit` over "the supervised process group," and `kill` ([0.82](https://developers.cloudflare.com/sandbox/1-0-preview/api/processes/)). Because one handle now covers what 3 stable APIs covered, every `execStream` or `startProcess` call site collapses onto the same shape.

## Terminals: renamed and restructured

| Stable | @next |
|---|---|
| `sandbox.terminal(request)` / session terminal | `createTerminal` + `terminal.connect(request)` |
| xterm `sessionId` | `terminalId` |

The preview terminal reference covers "createTerminal, Terminal handles, output streams, connect, and control methods" ([0.80](https://developers.cloudflare.com/sandbox/1-0-preview/api/terminals/)) and the terminals guide describes "Interactive PTY terminals... resource model and browser connect" ([0.84](https://developers.cloudflare.com/sandbox/1-0-preview/terminals/)). The stable-era mechanism for comparison: "The server-side terminal() method proxies WebSocket connections to the container, and the client-side SandboxAddon integrates with xterm.js" ([0.78](https://developers.cloudflare.com/sandbox/api/terminal/)), which is what `sessionId` threaded through. A weak community post describes the stable PTY passthrough in more detail ([0.08](https://community.cloudflare.com/t/agents-interactive-browser-terminals-in-sandboxes/890622)).

## Interpreter: moved behind withInterpreter

| Stable | @next |
|---|---|
| Interpreter methods on `Sandbox` | `withInterpreter` then `sandbox.interpreter.*` |

The preview interpreter API states the wiring: "Methods live on sandbox.interpreter after you attach withInterpreter on your Sandbox subclass. Method names match the stable interpreter; runCode returns plain serializable data" ([0.80](https://developers.cloudflare.com/sandbox/1-0-preview/api/interpreter/)). The code shape (subclass with `interpreter = withInterpreter(this)`) is in doc 07. Method names matching stable means the port is mechanical once the attachment exists, but the attachment itself is a new code path the audit must not miss.

## Smaller deltas

| Stable | @next |
|---|---|
| `gitCheckout` | argv `git` via `exec` |
| String kill signals | Numeric only |

There is no preview API page for a `gitCheckout` method; the source doc bans inventing it (hard rule 8). The replacement is a plain `exec` of the `git` binary with argv, shown in doc 07's git shape. Kill signals being numeric only affects every `kill` call site: the default is 15 (SIGTERM, source doc).

## Unchanged areas

| Stable | @next |
|---|---|
| Files, mounts, backups, ports, tunnels, `proxyToSandbox` | Mostly unchanged (ignore session/transport bits on stable pages) |

The source doc's caution here is documentation-shaped: stable-era pages describing these features remain mostly accurate, but any sentence that involves sessions or transport no longer applies. Read them through the preview's smaller contract ([0.74](https://developers.cloudflare.com/sandbox/1-0-preview/index.md)).
