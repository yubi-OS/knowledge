# 05. Audit: finding every call site that must change

Scope: the rg audit command, its full pattern list, and the manual checks the grep cannot catch.

## The audit command

The source doc gives one command to run against the codebase (source doc):

```sh
rg 'SANDBOX_TRANSPORT|transport:|setTransport|enableDefaultSession|createSession|getSession|deleteSession|execStream\(|startProcess\(|killProcess\(|sandbox\.terminal\(|sessionId|gitCheckout\(|SandboxTransport|ExecutionSession'
```

The pattern list maps 1:1 onto the replacement map rows in doc 04:

- `SANDBOX_TRANSPORT`, `transport:`, `setTransport`, `SandboxTransport` are the transport-selection surface that the migrate doc says to delete outright: "Delete SANDBOX_TRANSPORT, the transport option on getSandbox(), SandboxTransport types, and sandbox.setTransport(). No replacement setting is required" ([0.82](https://developers.cloudflare.com/sandbox/1-0-preview/migrate/)).
- `enableDefaultSession`, `createSession`, `getSession`, `deleteSession` are the session surface. The stable sessions page describes what they built: "Create shell sessions with independent working directories and environment variables within a sandbox" ([0.83](https://developers.cloudflare.com/sandbox/api/sessions/)). In the preview all of it is gone; `cwd` and `env` move into per-launch options.
- `execStream(`, `startProcess(`, `killProcess(` are the split stable process APIs that collapse onto the single `@next` process handle with `logs`, `waitFor*`, and `kill` ([0.82](https://developers.cloudflare.com/sandbox/1-0-preview/api/processes/)).
- `sandbox.terminal(` and `sessionId` are the stable terminal surface replaced by `createTerminal` plus `terminal.connect` keyed by `terminalId` ([0.80](https://developers.cloudflare.com/sandbox/1-0-preview/api/terminals/)).
- `gitCheckout(` is the stable convenience method with no preview equivalent ([0.82](https://developers.cloudflare.com/sandbox/1-0-preview/migrate/)).
- `ExecutionSession` is a stable-era type name to hunt for in type annotations and imports.

The audit step's output is 2 lists (source doc): the hits, and the target shapes each hit maps to. Keep both; the target-shapes list becomes the upgrade step's work order and the clarify step's "call sites not covered by the map" question.

## What the grep cannot catch

The source doc adds 3 manual checks beyond the pattern list (source doc):

1. String `exec(`: a call like `sandbox.exec("npm test")` passes a string, which on `@next` means argv element, not shell command. Every string-form exec needs conversion to argv (and an explicit shell binary when shell syntax is intended).
2. `cd` then a later `exec`: this pattern assumes working-directory persistence across exec calls. The stable session execution model did persist state across commands: "Preserve session state across commands (cwd, env vars, shell functions)" ([0.65](https://github.com/cloudflare/sandbox-sdk/blob/main/docs/SESSION_EXECUTION.md)). The preview does not, so these sites need `cwd` per launch or one shell script.
3. Bare `createCodeContext` / `runCode` on `Sandbox`: interpreter calls that used methods directly on the sandbox class must move behind `withInterpreter` ([0.80](https://developers.cloudflare.com/sandbox/1-0-preview/api/interpreter/)).

Manual check 1 matters because it is invisible to a name-based grep: the token `exec(` matches either way, so the audit must also read each match to classify string versus argv.

## Where the deprecated surface came from

The deprecation guide frames the same inventory from the cleanup side: the features leaving the stable line are "transports, default sessions, stream helpers, and related APIs" ([0.66](https://developers.cloudflare.com/sandbox/guides/2026-deprecation/)). Its SKILL copy spells out the stable-side fixes an app makes before even considering `@next`: "Set enableDefaultSession: false on getSandbox(). Replace workflows that depend on persisted shell state with explicit sessions from sandbox.createSession(). Move stream-specific file and command logic to the base readFile(), writeFile(), and exec() APIs" ([0.60](https://github.com/cloudflare/cloudflare-docs/blob/production/public/sandbox/guides/2026-deprecation/SKILL.md)).

That ordering has a practical consequence for this skill's audit: an app that already ran the deprecation guide has fewer hits, because the transport and session greps come back clean by construction. An app that skips the deprecation guide will find those same sites here instead; the fix is the same shape but lands on the preview line directly.

## Re-audit at validation

The audit is not once-and-done: validation step 7 in the source doc is "Grep again for removed APIs" (source doc). Running the same rg command after the upgrade proves the removal actually happened, which is the difference between "we replaced the sites we remembered" and "the surface is actually clean."
