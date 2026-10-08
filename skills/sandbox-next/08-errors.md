# Errors and recovery

Scope: the typed error surface of the 1.0 preview, the retry versus relaunch decision, and the symptom-to-fix map for common failures.

## Typed errors

The 1.0 preview documents error handling on `@cloudflare/sandbox@next` with class names, codes, and context fields listed on its Errors API page (https://developers.cloudflare.com/sandbox/1-0-preview/errors/, jev weight 0.91). The errors API module exports `ErrorCode`, `SandboxError`, `createErrorFromResponse`, and other domain errors covering files, ports, interpreter, mounts, and related context types (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/sandbox/1-0-preview/api/errors.mdx, jev weight 0.82). So failures arrive as typed, domain-scoped errors rather than opaque exceptions, which is what makes per-class recovery decisions possible.

The errors API page frames its own scope as "error classes and codes returned by the Sandbox SDK 1.0 preview, with short recommended actions", pointing to the full recovery procedures in the Errors and recovery page (https://developers.cloudflare.com/sandbox/1-0-preview/api/errors/, jev weight 0.90). A key categorization from that recovery page: some failures mean the container never started your work at all (https://developers.cloudflare.com/sandbox/1-0-preview/errors/, jev weight 0.91).

## Why one retry loop is wrong

The source doc (yubi-OS/yubiOS skills/sandbox-next/SKILL.md) lists "do not use one retry loop for every error" in its contract section and routes to the Errors docs. The reason is visible in the error taxonomy above: errors span domains (files, ports, interpreter, mounts) and lifecycle conditions (container never started, stale handles), and the correct action differs by class. A startup failure wants a relaunch of the container path; a stale process handle wants the reattach path documented on the processes page, which directs you there when `getProcess` returns null or a call throws `StaleProcessHandleError` (https://developers.cloudflare.com/sandbox/1-0-preview/processes/, jev weight 0.88). Retrying `exec` blindly against a dead container would loop forever, while a transient HTTP error on a file operation may well succeed on retry.

## The symptom-to-fix map

The troubleshooting page is organized as a symptom-to-fix map, and points to the errors and recovery page for deeper recovery and the lifecycle page for container behavior (https://developers.cloudflare.com/sandbox/1-0-preview/troubleshooting/, jev weight 0.92). Its first listed symptom is the gate failure this corpus covers in the package-line doc: the Worker package and the container image are on different lines, fixed by using the same line on both (https://developers.cloudflare.com/sandbox/1-0-preview/troubleshooting/index.md, jev weight 0.84). That the mismatch is the first troubleshooting entry matches how the source doc makes it the first gate check.

## Known sharp edges from the field

Two GitHub issues illustrate failure classes that are easy to hit in development. First, a tunnels idempotency bug: `sandbox.tunnels.get(port)` is not idempotent under `wrangler dev --local`, throwing on the second call after the first established a healthy tunnel (https://github.com/cloudflare/sandbox-sdk/issues/874, jev weight 0.74). If your retry logic treats that thrown error as transient, you make it worse; the correct handling is to keep the handle from the first call rather than re-get.

Second, the backup race: `createBackup()` automatically starts stopped containers, and a container can stop after `getState()` reports running but before `createBackup()` runs, so the backup itself wakes the container (https://github.com/cloudflare/sandbox-sdk/issues/825, jev weight 0.57). The recovery design lesson is that some operations have state-dependent side effects, so their error handling must consider the container lifecycle, not just the call result.

## Local wait versus remote failure

One error-adjacent rule from the source doc belongs in every recovery plan: a local wait `timeout` or `AbortSignal` cancels the wait only, not the process. Use `kill` or `exec`'s remote timeout to stop the actual work (source doc). A recovery loop that times out locally and then relaunches without killing can pile up orphaned processes in the container, since the timed-out process is still running.

## Recovery decision table

Summarizing the documented guidance into a decision order (all from the pages cited above):

1. Classify the error by its type and domain first (https://developers.cloudflare.com/sandbox/1-0-preview/api/errors/, jev weight 0.90).
2. If the container may never have started your work, do not retry the operation; follow the recovery page's container-start path (https://developers.cloudflare.com/sandbox/1-0-preview/errors/, jev weight 0.91).
3. For stale process handles, use the reattach path, not exec retry (https://developers.cloudflare.com/sandbox/1-0-preview/processes/, jev weight 0.88).
4. For package and image line mismatches, fix the deployment rather than the code (https://developers.cloudflare.com/sandbox/1-0-preview/troubleshooting/, jev weight 0.92).
5. Only retry operations whose failure class the errors docs mark as retriable (source doc, citing the Errors docs).

## Weak-backing notes

Unofficial troubleshooting writeups for adjacent projects circulate but document different codebases (https://deepwiki.com/cloudflare/moltworker/14.1-common-issues, jev weight 0.11, weak backing). A security research post about a disk isolation bug in Cloudflare Containers is out of scope for SDK error handling and should not shape recovery logic (https://accomplish.ai/blog/escaping-the-cloudflare-sandbox/, jev weight 0.09, weak backing). The authoritative sources remain the 1.0 preview errors, troubleshooting, and processes pages.
