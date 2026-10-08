# exec contract and process handles

Scope: the `sandbox.exec(argv)` contract, the process handle methods, why there is no implicit shell, and why each launch is independent. Grounded in the source doc contract section plus the official 1.0 preview process docs.

## The contract from the source doc

The source doc (yubi-OS/yubiOS skills/sandbox-next/SKILL.md) states the non-negotiables: `sandbox.exec(argv)` takes an argv list and resolves when the process starts. It returns a handle, not a finished command result. Results are collected with handle methods: `output()`, `logs()`, `waitForExit()`, `waitForPort()`, `waitForLog()`, and `kill(signal?)`. There is no implicit shell; shell syntax needs an explicit shell such as `["/bin/bash", "-lc", script]`.

The official get-started page confirms the same shape and adds the core warnings: `await sandbox.exec(...)` creates a process and does not wait for exit; use `output()`, `waitForExit()`, or other handle methods for completion; and each `exec()` is independent, so a `cd` or `export` in one call is not remembered in the next (https://developers.cloudflare.com/sandbox/1-0-preview/get-started/, jev weight 0.88).

## One handle for short and long work

The 1.0 preview collapsed two stable-era APIs into one: the same handle covers short commands and long-running services, and there is no session-based command state or transport picker (https://developers.cloudflare.com/sandbox/1-0-preview/index.md, jev weight 0.85; https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/sandbox/1-0-preview/index.mdx, jev weight 0.76). The stable page for the same area shows the contrast in code: stable took `await sandbox.exec("npm test")` as a string and gave you `result.stdout` directly, while the 1.0 preview takes `await sandbox.exec(["npm", "test"])` and gives you a process (https://developers.cloudflare.com/sandbox/1-0-preview/index.md, jev weight 0.85).

## Handle methods in detail

The processes API page documents the handle surface. `getProcess()` returns a handle for a process running in the current container for this sandbox, or `null`, and does not start a container if none is running (https://developers.cloudflare.com/sandbox/1-0-preview/api/processes/, jev weight 0.90). The source doc generalizes this: `getProcess`, `listProcesses`, `getTerminal`, and `listTerminals` never start a container; they return `null` or `[]` when none is up. The same API page adds a practical tip: prefer `logs()` when output may exceed what a single `output()` call buffers (https://developers.cloudflare.com/sandbox/1-0-preview/api/processes/, jev weight 0.90).

For completion, `waitForExit({ timeout })` returns the exit code, signal, and a `timedOut` flag. The documented example runs a build with an explicit shell and working directory: `sandbox.exec(["/bin/bash", "-lc", "npm run build"], { cwd: "/workspace/app" })` then `build.waitForExit({ timeout: 600_000 })` (https://developers.cloudflare.com/sandbox/1-0-preview/api/processes/, jev weight 0.63). The process-execution page adds `status()` alongside `waitForPort()`, `waitForExit()`, and `kill()`, and notes that log cursors apply only while the process still exists in the current container (https://developers.cloudflare.com/sandbox/1-0-preview/processes/, jev weight 0.88).

## Shell, environment, and launch independence

Because there is no implicit shell, anything that needs shell semantics needs an explicit one. The documented build example uses `["/bin/bash", "-lc", "npm run build"]` with `cwd` passed per launch (https://developers.cloudflare.com/sandbox/1-0-preview/api/processes/, jev weight 0.63). The source doc draws the same conclusion differently: pass `cwd` and `env` per launch, or put the whole sequence in one shell script, since a `cd` or `export` in one `exec` is invisible to the next (source doc; confirmed at https://developers.cloudflare.com/sandbox/1-0-preview/get-started/, jev weight 0.88).

## Stale handles and cancellation semantics

Two failure modes from the source doc are worth repeating because they look like bugs and are not. First, a local wait `timeout` or `AbortSignal` cancels the wait only, not the process; to actually stop work, use `kill` or `exec`'s remote timeout (source doc). Second, process and terminal IDs belong to the current container, not forever to a sandbox ID; the processes page directs you to the reattach path when `getProcess` returns null or a call throws `StaleProcessHandleError` (https://developers.cloudflare.com/sandbox/1-0-preview/processes/, jev weight 0.88).

## Reference example

Cloudflare ships a `process-workspace` example that deploys a Worker to start named background processes in a Container, then check status, read or follow output, wait for a log line or an exit, and stop them (https://github.com/cloudflare/sandbox-sdk/tree/main/examples/process-workspace, jev weight 0.82). The repo's own session-execution notes explain why background-heavy patterns use temp files rather than process substitution for foreground capture: process substitution runs asynchronously and bash returns when the substitution starts, not when it finishes writing (https://github.com/cloudflare/sandbox-sdk/blob/main/docs/SESSION_EXECUTION.md, jev weight 0.78).

## Weak-backing notes

A third-party deep-dive on `exec()` and `execStream()` covers sync and streaming modes but is generated secondary documentation (https://deepwiki.com/cloudflare/sandbox-sdk/3.1-executing-commands, jev weight 0.15, weak backing). Do not treat its API signatures as authoritative; check the installed `@next` types as the source doc requires.
