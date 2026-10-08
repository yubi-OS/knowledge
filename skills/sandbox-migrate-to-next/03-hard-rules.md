# 03. Hard rules: the invariants that make or break the port

Scope: the 9 hard rules the skill enforces, why each exists, and the external evidence behind the non-obvious ones.

## The rule list

The source doc states these hard rules (source doc):

1. The Worker package and the container image must be the same `@next` line.
2. Production cutover uses immediate container rollout. Stable and `@next` control protocols are incompatible both ways; a gradual rollout leaves a broken mixed window. In-flight container work can stop.
3. After cutover, `await sandbox.exec(...)` means process started, not command finished.
4. Argv is as-is: no implicit shell. Shell syntax needs an explicit shell binary.
5. Process handles have no stdin; use terminals for interactive input.
6. Observation `timeout` / `AbortSignal` cancels the wait only, not the process.
7. No single retry loop for every error.
8. Do not invent APIs (no `gitCheckout` on core, no process stdin, no string-exec completion helper).
9. A self-deployed bridge stays on stable (it is not part of the preview line yet).

## Why the rollout rule exists

The rule about immediate rollout is the least obvious, so it deserves the deepest grounding. Cloudflare's rollouts documentation confirms the mechanism: a rollout "applies a target container application configuration after you deploy a Worker that uses Containers," and `rollout_active_grace_period` "applies in every rollout mode, including immediate" ([0.89](https://developers.cloudflare.com/containers/configuration/rollouts/), [0.86](https://developers.cloudflare.com/containers/platform-details/rollouts/)). The configuration copy further notes that containers connected longer "can still be replaced once they pass the window" ([0.85](https://developers.cloudflare.com/containers/configuration/rollouts/index.md)).

The mixed-window hazard is documented on the Cloudflare docs source: "When the image changes, immediate minimizes but does not eliminate the period when the new Worker can reach instances on the previous image" ([0.79](https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/containers/configuration/rollouts.mdx)). If immediate rollout still admits a brief mixed window even for a single image change, then a gradual rollout during a control-protocol change (stable and `@next` being incompatible both ways, per the source doc) would stretch that window across deliberately chosen steps, which is exactly what the hard rule forbids.

One caveat from the field, weakly weighted: a GitHub issue observed (July 9, 2026) that after a `wrangler deploy` image change the rollouts API reported completion under both default and immediate modes with `rollout_active_grace_period: 0` while a Durable-Object-addressed container was not replaced ([0.51](https://github.com/cloudflare/containers/issues/233)). Treat rollout completion reports as a signal to verify, not a guarantee that every instance moved.

## Why the exec semantics rule exists

On stable, `sandbox.exec("cmd")` resolves when the command finishes with buffered output; long-running services and streaming needed separate APIs (`startProcess`, `execStream`). On the preview, `exec()` takes argv and "resolves when the process starts. The call resolves when launch succeeds (you receive a process handle with id and pid properties), not when..." the command finishes ([0.79](https://developers.cloudflare.com/sandbox/1-0-preview/processes/), [0.82](https://developers.cloudflare.com/sandbox/1-0-preview/api/processes/)). The API reference shows the handle carrying `id`, `pid`, output and exit code via waits, plus `getProcess()` returning a handle for a process "running in the current container for this sandbox, or null" ([0.82](https://developers.cloudflare.com/sandbox/1-0-preview/api/processes/)).

This is the semantic inversion behind rule 3: code that treats `await sandbox.exec(...)` as completion will run its "next step" while the command is still starting. The fix is `await process.output({ encoding: "utf8" })` or an explicit wait, shown in doc 07's code shapes.

The argv rule (rule 4) follows from the same design: each `exec()` starts "a new supervised process from argv" ([0.79](https://developers.cloudflare.com/sandbox/1-0-preview/processes/)). A string is not parsed by a shell; `"npm test"` as a string is not a shell pipeline anymore. Shell syntax requires an explicit binary such as `["/bin/bash", "-lc", "..."]` (source doc).

## Why the state rules exist

The old session model persisted shell state across commands: "Preserve session state across commands (cwd, env vars, shell functions)" ([0.65](https://github.com/cloudflare/sandbox-sdk/blob/main/docs/SESSION_EXECUTION.md)). The preview removes that persistence, which is why the source doc warns against assuming `cd` or exports persist across `exec` calls (red flags, source doc) and why per-launch `cwd`/`env` replaces sessions (doc 04).

Interactive input moved to terminals because process handles carry no stdin (rule 5, source doc); the terminals mechanism is documented in doc 04.

## The remaining rules

Rule 6 (wait-only cancellation) and rule 7 (no universal retry loop) are grounded in the errors architecture covered in doc 09: error classes differ (unavailable, interrupted RPC, stale handle, local wait timeout) and each has its own recovery ([0.84](https://developers.cloudflare.com/sandbox/1-0-preview/migrate/), [0.82](https://developers.cloudflare.com/sandbox/1-0-preview/errors/)). Rule 8 bans inventing APIs, including the stable-era `gitClone` convenience the GA-era blog described ("methods like exec, gitClone, writeFile and more" ([0.45](https://blog.cloudflare.com/sandbox-ga/), weak backing for the stable-era shape)) which the preview replaces with argv `git` via `exec`. Rule 9 is corroborated by the preview overview: "The self-deployed Sandbox bridge is not part of the 1.0 preview. Use the stable bridge with the matching stable package and container image" ([0.77](https://developers.cloudflare.com/sandbox/1-0-preview/)).
