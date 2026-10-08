# Shared surfaces: files, mounts, ports, tunnels, backups, preview URLs

Scope: the surfaces that did not change name across package lines: files, storage and mounts, ports, tunnels, backups, `proxyToSandbox`, and preview URLs, plus what the ports page says about starting services on `@next`.

## The retrieval map's warning

The source doc (yubi-OS/yubiOS skills/sandbox-next/SKILL.md) lists these as "shared surfaces" served by the main docs, with one instruction: ignore stable-only session, transport, and `sandbox.terminal` details when reading them for `@next` work. The ports API page carries the same warning inline: it documents ports and preview URLs on the stable package, and examples that use `startProcess` are stable-only; on `@next`, start services with `exec(argv)` then use `waitForPort`, expose, or tunnels (https://developers.cloudflare.com/sandbox/api/ports/, jev weight 0.79).

## Ports and preview URLs

Exposing a port produces a unique URL that proxies requests to your service running inside the sandbox (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/sandbox/sdk/concepts/preview-urls.mdx, jev weight 0.79). The stable concepts page adds the debugging checklist for a preview URL that does not respond: check whether the service is running with `listProcesses()`, check whether the port is exposed with `getExposedPorts()`, and check that the service binds to `0.0.0.0` rather than `127.0.0.1` (https://developers.cloudflare.com/sandbox/concepts/preview-urls/, jev weight 0.83). The bind-to-all-interfaces point is the one that fails silently most often in local code that works on localhost.

## Exposing services through the Worker

The expose-services guide shows the Worker-side wiring: import `getSandbox` and `proxyToSandbox` from the package, export your `Sandbox` subclass, and in the fetch handler proxy requests to exposed ports first (https://developers.cloudflare.com/sandbox/guides/expose-services/, jev weight 0.84). This is the pattern where the Worker fronts the request so it can inject authentication or rewrite responses before they reach the sandbox service; the 0.x version of the guide states that intent directly (https://developers.cloudflare.com/sandbox/sdk/guides/expose-services/, jev weight 0.38, weak backing: 0.x line).

## Tunnels

The 0.x ports page recommends `sandbox.tunnels` for most public-URL use cases, covering development, `.workers.dev` deployments, and production traffic (https://developers.cloudflare.com/sandbox/sdk/api/ports/, jev weight 0.38, weak backing: 0.x line). A community announcement describes the underlying mechanism: sandboxes can expose a service running inside the container on a public preview URL through the tunnels namespace, using `cloudflared` inside the sandbox, so a running service can be shared without configuring `exposePort()` or a custom domain (https://community.cloudflare.com/t/agents-share-sandbox-previews-through-cloudflare-tunnel/931116, jev weight 0.08, weak backing). One known wrinkle is documented in a filed issue: `sandbox.tunnels.get(port)` is not idempotent under `wrangler dev --local`; after the first successful call establishes a healthy tunnel, a second call throws (https://github.com/cloudflare/sandbox-sdk/issues/874, jev weight 0.74).

## Files and mounts

The source doc's retrieval map sends files and storage or mounts to the main docs (https://developers.cloudflare.com/sandbox/api/files/ and https://developers.cloudflare.com/sandbox/api/storage/), and the repository README confirms what the 1.0 package itself provides: in 1.0 your own Durable Object starts the Container, and the package provides file operations and bucket mounts (https://github.com/cloudflare/sandbox-sdk, jev weight 0.82). So on `@next`, file operations and bucket mounts are first-class SDK surfaces while container lifecycle moves into your Durable Object.

## Backups

Backups are a documented surface (https://developers.cloudflare.com/sandbox/api/backups/) with a known lifecycle interaction: `createBackup()` automatically starts stopped containers, and a race exists where the container can stop after `getState()` reports it as running but before `createBackup()` is called, waking the container (https://github.com/cloudflare/sandbox-sdk/issues/825, jev weight 0.57). Schedule backups with the container state re-checked at call time, not at plan time.

## Weak-backing notes

A DeepWiki page on port exposure and preview URLs describes unique preview URLs with embedded security tokens (https://deepwiki.com/cloudflare/sandbox-sdk/3.5-port-exposure-and-preview-urls, jev weight 0.11, weak backing). A Northflank comparison lists the SDK's surface area as command, file, process, interpreter, backup, storage, and tunnel APIs (https://northflank.com/blog/cloudflare-vs-railway-sandboxes, jev weight 0.10, weak backing). Both are context, not authority. Production custom-domain requirements are covered in the ship-checklist doc of this corpus.
