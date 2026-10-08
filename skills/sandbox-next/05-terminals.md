# Terminals: interactive PTYs instead of stdin

Scope: why process handles have no stdin, how terminals fill that gap, what the 1.0 preview changes versus the stable terminal surface, and the operational details that follow from terminals being container-local.

## The gap the source doc names

The source doc (yubi-OS/yubiOS skills/sandbox-next/SKILL.md) puts it in the contract section: process handles have no stdin. Interactive use goes through terminals, via `createTerminal` plus `connect`. This is a deliberate design boundary, not a missing feature. The 1.0 preview description confirms the direction: terminals are first-class PTYs on this line, while the stable-era session and transport surfaces are gone (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/sandbox/1-0-preview/index.mdx, jev weight 0.76).

The practical consequence is a routing rule: if a task needs to type into a program, answer prompts, or run a REPL interactively, do not try to feed stdin to an `exec` handle. Open a terminal. If the task is a batch command, `exec` with collected output remains the right shape (source doc; handle methods documented at https://developers.cloudflare.com/sandbox/1-0-preview/api/processes/, jev weight 0.90).

## What terminals are for

The stable-line concept page, which the source doc's retrieval map points at for shared understanding, describes the model terminals implement: instead of executing discrete commands with `exec()`, a terminal connection opens a persistent, bidirectional channel to a bash shell (https://developers.cloudflare.com/sandbox/concepts/terminal/, jev weight 0.75). The stable API page shows how browser UIs attach: a server-side method proxies WebSocket connections to the container, and a client-side `SandboxAddon` integrates with xterm.js for rendering (https://developers.cloudflare.com/sandbox/api/terminal/, jev weight 0.78).

Read those stable pages as background for the interaction model, not as the `@next` call surface. The source doc explicitly forbids using `sandbox.terminal(request)` on the preview line; it names it among removed stable APIs (source doc). On `@next`, the entry points are `createTerminal` and `connect` (source doc).

## Operational details

Two properties from the dig results shape how you build terminal features. First, terminal handles, like process handles, are container-local after stop or replace (https://developers.cloudflare.com/sandbox/api/lifecycle/, jev weight 0.79). The source doc draws the matching conclusion: terminal IDs belong to the current container, not forever to a sandbox ID, so store full job state, not just an id, for anything that must survive a replace (source doc).

Second, the getter rule applies: `getTerminal` and `listTerminals` do not start a container; they return `null` or `[]` when none is up (source doc).

## A reference pattern

Cloudflare's terminal-workspace example deploys a Worker to open a live shell in a named Container from the browser, and the shell runs in a tmux session so it keeps running when the page closes or the connection drops (https://github.com/cloudflare/sandbox-sdk/blob/main/examples/terminal-workspace/README.md, jev weight 0.79). That tmux detail is the practical answer to the container-locality problem above: keep the durable session inside the shell multiplexer and treat the terminal connection as disposable.

The same example directory is listed by the source doc's retrieval map under the examples index for the `next` branch (source doc).

## Weak-backing notes

Community announcement threads describing PTY passthrough and `sandbox.terminal(request)` date from the stable era and carry low weight (https://community.cloudflare.com/t/agents-interactive-browser-terminals-in-sandboxes/890622, jev weight 0.11, weak backing). A third-party sandbox product's terminal documentation is not about this SDK (https://docs.simplesandbox.dev/interactive-terminals, jev weight 0.57, weak backing for this context because it describes a different product's API). For signatures on `@next`, prefer the installed `@next` types over any of these, as the source doc instructs.
