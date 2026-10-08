# Before you ship: the checklist

Scope: the pre-deploy checks from the source doc, expanded with what the official deployment and troubleshooting pages say about production configuration for sandbox apps.

## The four checks from the source doc

The source doc (yubi-OS/yubiOS skills/sandbox-next/SKILL.md) lists four pre-ship checks: lockfile and Dockerfile on the same `@next` line; typecheck against installed `@next` types; no live secrets in sandbox env; and production preview hostnames need wildcard DNS on a custom domain when using those URL patterns. Each has a documented failure mode behind it, covered below.

## Line alignment in the build

The lockfile and Dockerfile check is the deploy-time form of the gate. The troubleshooting page lists the mismatch as a first-class symptom: the Worker package and the container image are on different lines, fixed by putting the same `@next` tag on both (https://developers.cloudflare.com/sandbox/1-0-preview/troubleshooting/, jev weight 0.92; https://developers.cloudflare.com/sandbox/1-0-preview/troubleshooting/index.md, jev weight 0.84). The migrate guide frames the whole production cutover as one deploy of the preview Worker package plus the matching container image (https://developers.cloudflare.com/sandbox/1-0-preview/migrate/, jev weight 0.87), which is why the two artifacts must move together rather than in separate releases.

## Typecheck against installed types

The source doc's standing instruction is to prefer preview docs and installed `@next` types over memory, because APIs change (source doc). In a CI or pre-ship context this becomes: typecheck against the types that ship with the installed `@next` package, and treat any reference built from stable-era memory as suspect until it compiles. The 1.0 API reference is organized for exactly this use: mental-model pages for why, API pages for signatures and types (https://developers.cloudflare.com/sandbox/1-0-preview/api/index.md, jev weight 0.85).

## No live secrets in sandbox env

This check is the ship-time form of the environment rules: non-secret configuration goes in `setEnvVars` or launch `env`; live credentials stay in the Worker and reach external APIs through outbound handlers (source doc; documented at https://developers.cloudflare.com/sandbox/1-0-preview/environment/, jev weight 0.88 and https://developers.cloudflare.com/sandbox/guides/outbound-traffic/, jev weight 0.82). The authentication example is the reference implementation: secrets live in the Worker environment and are injected transparently, so the sandbox never sees them (https://github.com/cloudflare/sandbox-sdk/tree/main/examples/authentication, jev weight 0.82). A pre-ship grep for API keys in `setEnvVars` calls or Dockerfile `ENV` lines is the cheap version of this check.

## Wildcard DNS for preview hostnames

Production preview URL patterns require wildcard DNS on a custom domain (source doc). The 0.x concept page explains what preview URLs are: public HTTPS access to services running inside sandboxes, with a unique URL per exposed port that proxies requests to the service (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/sandbox/sdk/concepts/preview-urls.mdx, jev weight 0.79). Because each sandbox gets its own hostname under the pattern, a single wildcard record is what makes arbitrary per-sandbox hostnames resolve in production; `.workers.dev` and local dev do not need it, which is why the failure only appears after production deploy.

## Production wiring

Three more production facts from the digs round out the checklist. First, the sandbox container runs under the Durable Object scheduling policy, which is in public beta (https://developers.cloudflare.com/sandbox/1-0-preview/api/, jev weight 0.86), so production capacity behavior can change during the preview. Second, the expose-services guide's Worker-fronted proxy pattern (import `getSandbox` and `proxyToSandbox`, export the Sandbox subclass, proxy requests to exposed ports first) is the production shape for routing traffic through auth before it reaches sandbox services (https://developers.cloudflare.com/sandbox/guides/expose-services/, jev weight 0.84). Third, `wrangler dev` has its own quirks that should not gate a ship decision but should shape it: the tunnels idempotency bug under `wrangler dev --local` is development-only (https://github.com/cloudflare/sandbox-sdk/issues/874, jev weight 0.74).

## Error-readiness as a ship item

Since the errors doc in this corpus covers recovery in depth, the ship version is one line: make sure error handling distinguishes retriable errors from container-start failures and stale handles, rather than running one retry loop for everything (source doc; taxonomy at https://developers.cloudflare.com/sandbox/1-0-preview/errors/, jev weight 0.91). A final smoke test that starts a process, waits for a port, and kills it cleanly exercises the most common production paths.

## Weak-backing notes

A third-party guide covering sandbox development with `.dev.vars` files for API keys (https://neon.com/guides/cloudflare-sandbox-neon-branching, jev weight 0.20, weak backing) corroborates the keep-secrets-on-the-Worker check but is not authoritative for this SDK. The Cloudflare marketing page for Sandboxes describes lifecycle management from the Worker at a promotional level (https://www.cloudflare.com/products/sandboxes/, jev weight 0.46, weak backing).
