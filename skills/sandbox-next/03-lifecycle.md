# Lifecycle: sandbox ID, container, sleep, and durability

Scope: how a sandbox instance relates to its container, the running and sleeping and destroyed states, why process and terminal handles are container-local, and what to store if work must survive a container replace.

## The instance model

A sandbox is backed by a Durable Object: each sandbox instance is an isolated container environment, and the Durable Object behind it manages the container lifecycle, providing persistent identity and state management (https://cloudflare-sandbox-sdk.mintlify.app/concepts/sandbox-instances, jev weight 0.59). The source doc (yubi-OS/yubiOS skills/sandbox-next/SKILL.md) makes the same point operationally: process and terminal IDs belong to the current container, not forever to a sandbox ID. For work that must survive replace, store the full job (argv, cwd, env, app state), not only an id.

## States

Sandboxes transition through running, sleeping, and destroyed states based on activity (https://developers.cloudflare.com/sandbox/concepts/sandboxes/, jev weight 0.77). The same page lists what each instance has: a unique identifier (sandbox ID), an isolated filesystem, a dedicated Linux container, and state maintained while the container is active (https://developers.cloudflare.com/sandbox/concepts/sandboxes/, jev weight 0.77). On the stable 0.x line the same page notes that when the container stops, the next request creates a fresh container with a clean environment, a pattern used for interactive environments and notebooks (https://developers.cloudflare.com/sandbox/sdk/concepts/sandboxes/, jev weight 0.39, weak backing; it describes 0.x, not the 1.0 preview).

## Handles are container-local

The lifecycle API page states it directly: process and terminal handles are container-local after stop or replace (https://developers.cloudflare.com/sandbox/api/lifecycle/, jev weight 0.79). This is the mechanism behind the source doc's rule about storing full jobs rather than ids. A handle that was valid before the container stopped is stale afterward, and the processes page gives the recovery path: when `getProcess` returns null or a call throws `StaleProcessHandleError`, use the documented reattach route (https://developers.cloudflare.com/sandbox/1-0-preview/processes/, jev weight 0.88).

## Getter semantics

The source doc's contract section records a subtle rule: `getProcess`, `listProcesses`, `getTerminal`, and `listTerminals` do not start a container; they return `null` or `[]` when none is up. This matters in code that assumes the first call spins the environment up. The same null semantics appear in the processes API documentation for `getProcess()` (https://developers.cloudflare.com/sandbox/1-0-preview/api/processes/, jev weight 0.90).

## The Durable Object under the sandbox

The Worker wiring shapes the lifecycle: the containers block in wrangler config tells Cloudflare to build your Dockerfile and make it available to the Sandbox Durable Object, and the Durable Object manages lifecycle and state for each sandbox instance (https://labs.cloudflare.dev/sandbox-sdk/, jev weight 0.75). The public API surface is `getSandbox(binding, id)`, which returns the Durable Object stub for the named sandbox (https://labs.cloudflare.dev/sandbox-sdk/, jev weight 0.75). A third-party description agrees that `getSandbox()` is the primary entry point for obtaining the Sandbox Durable Object stub, with helpers like `proxyToSandbox` alongside it (https://deepwiki.com/cloudflare/sandbox-sdk/4.4-getsandbox-and-helpers, jev weight 0.12, weak backing).

## Sleep policy

A community-sourced deep dive documents a `SANDBOX_SLEEP_AFTER` environment variable, cold-start behavior, and a loading page shown during startup on sandbox containers (https://deepwiki.com/cloudflare/moltworker/3.2.3-container-lifecycle-and-sleep-policy, jev weight 0.17, weak backing). Treat it as a pointer, not doctrine; the authoritative sleep behavior is in the official lifecycle docs referenced above.

## Backups interact with the container state

Backups are not lifecycle-neutral. A filed bug describes a race where a container can stop after `sandbox.getState()` reports it as running but before `sandbox.createBackup()` is called; because `createBackup()` automatically starts stopped containers, the backup wakes the container (https://github.com/cloudflare/sandbox-sdk/issues/825, jev weight 0.57). The practical lesson for the ship checklist: when scheduling backups, do not treat a recent `running` reading as a guarantee the container is still up at call time.

## Faster cold starts change the calculus

Cloudflare reports rebuilt Containers that start more than 6x faster, let code choose each sandbox's image and compute resources at runtime, and support filesystem snapshots so workspaces can be saved and restored (https://blog.cloudflare.com/faster-agent-sandboxes/, jev weight 0.63). Snapshots plus container-local handles is the pairing to remember: snapshots preserve the filesystem, but your in-flight process and terminal ids do not survive a replace, which is exactly why the source doc says store the full job.
