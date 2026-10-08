# 09. Validation, red flags, and the handoff to sandbox-next

Scope: the 8-point validation checklist, the red flags that mean stop and fix, and the post-migration mode switch to the sandbox-next skill.

## The validation checklist

The source doc's validation step lists 8 checks in order (source doc):

1. Lockfile + Dockerfile on the same `@next` line. This is the version-parity hard rule (doc 03) checked on artifacts rather than intentions: the lockfile's resolved `@cloudflare/sandbox` version and the image tag in the Dockerfile must name the same preview line. The migrate doc phrases the lockfile side as "Confirm the lockfile resolves @cloudflare/sandbox to a preview build" ([0.85](https://developers.cloudflare.com/sandbox/1-0-preview/migrate/)).
2. Typecheck against `@next`. After the package swap, the compiler is the cheapest audit of the replacement map: removed types (`SandboxTransport`, `ExecutionSession`) and renamed methods (`createTerminal`, `terminalId`) surface as type errors at every call site the audit missed.
3. Smoke argv `exec` + `output({ encoding: "utf8" })`. One round trip proves the core shape change: launch resolves at process start and `output()` is what returns the buffered result (doc 07).
4. Smoke long process / terminal / interpreter if used. Each of these has its own failure surface (waits, terminal IDs, `withInterpreter` wiring), so each feature the app actually uses gets its own smoke.
5. Errors distinguished: unavailable / interrupted-RPC / stale / local wait. The migrate doc phrases the bar as "Confirm error handling distinguishes unavailable, interrupted/RPC, stale handle, and local wait timeouts" ([0.84](https://developers.cloudflare.com/sandbox/1-0-preview/migrate/)). The preview ships an error reference with "error classes and codes... with short recommended actions" ([0.83](https://developers.cloudflare.com/sandbox/1-0-preview/api/errors/)) and an "Errors and recovery" guide covering "Retry and recover from Sandbox SDK 1.0 preview failures when containers start, stop, or interrupt work" ([0.82](https://developers.cloudflare.com/sandbox/1-0-preview/errors/)). The 4 classes are why hard rule 7 bans one retry loop for every error: each class has its own recovery, so a universal wrapper misclassifies at least 3 of them.
6. No live secrets in sandbox env. The stable env-vars docs list the injection levels ([0.84](https://developers.cloudflare.com/sandbox/sdk/configuration/environment-variables/)), and the sandbox is untrusted work space; secrets belong in the Worker's secret bindings, not in `setEnvVars` or a launch `env`.
7. Grep again for removed APIs. Re-run the doc 05 audit command after the upgrade; the surface must be clean, not "mostly clean."
8. Production used `--containers-rollout=immediate`. Verify the actual deploy command, not the intention (doc 08).

## Red flags: stop and fix

The source doc lists 9 red flags (source doc). Each maps to a hard rule or a map row, which makes them a fast re-derivation of the whole skill:

- Mixing `@next` Worker with stable image (or reverse). Version parity violated; fix before anything else.
- Gradual container rollout for this cutover. Protocol incompatibility makes every intermediate step broken.
- Treating `await exec` as command completion. The start-versus-finish semantic inversion (doc 03).
- Assuming `cd` / exports persist across `exec` calls. Session persistence is gone; use per-launch `cwd`/`env` or one shell script.
- One retry wrapper for every error. The 4 error classes need distinct handling (check 5).
- Inventing `gitCheckout`, process stdin, or undocumented APIs. Hard rule 8; use argv `git` via `exec` and terminals instead.
- Keeping pre-cutover process/terminal IDs after deploy. They are invalid after cutover (doc 08); expect and handle null lookups.
- Forcing production cutover without user agreement. Violates the clarify gate (doc 06).
- Putting live secrets in `setEnvVars` / launch `env`. Violates check 6.

## The handoff

"Then day-to-day work uses `sandbox-next`" (source doc). The migration skill is a one-shot: once the port validates, its job is done and the app's ongoing development is governed by the sibling skill that owns `@next` day-to-day work. The deprecation guide's index.md frames the same chain from the other direction: finish stable-line cleanup, then "move on to the Sandbox SDK 1.0 preview on @cloudflare/sandbox@next when you can" ([0.60](https://developers.cloudflare.com/sandbox/guides/2026-deprecation/index.md)).

## Known caveat

A weakly weighted third-party issue reports an adapter-level concern outside the SDK itself: RPC operations "should have a bounded host-side deadline" because an adapter call "can hang past timeout" ([0.40](https://github.com/withastro/flue/issues/497)). The relevance to validation check 5 is that host-side wait deadlines are part of the app's own code surface: the SDK cancels waits, but the caller still owns bounding its own promises around them.
