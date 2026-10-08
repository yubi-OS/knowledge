# Environment, config, and secrets

Scope: `cwd` and `env` per launch, `setEnvVars`, the non-secret-only rule for sandbox environment variables, and the outbound-handler pattern that keeps live credentials out of the container.

## The source doc's two rules

The source doc (yubi-OS/yubiOS skills/sandbox-next/SKILL.md) separates configuration from credentials. Configuration: each launch is independent, so pass `cwd` and `env` per launch, or run one shell script when state must carry over. Credentials: non-secret config only goes in `setEnvVars` or launch `env`; live credentials stay in the Worker, and you use outbound handlers when the sandbox calls external APIs.

## Environment variables on the 1.0 preview

The 1.0 preview environment page describes three layers for process environment: the container image itself, `setEnvVars`, and per-launch `env`. Its policy line is explicit: use environment variables for non-secret configuration such as paths, feature flags, and NODE_ENV, and do not put live API keys or other live secrets in the sandbox (https://developers.cloudflare.com/sandbox/1-0-preview/environment/, jev weight 0.88). This mirrors the stable line's documented ordering, which lists 1. sandbox-level with `setEnvVars()`, 2. per-command with `exec()` options, and 3. session-level with `createSession()` (https://developers.cloudflare.com/sandbox/configuration/environment-variables/, jev weight 0.77). Note the drift: the session-level layer is a 0.x concept; the 1.0 preview removed session-based command state, so on `@next` the practical layers are image, `setEnvVars`, and per-launch `env` (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/sandbox/1-0-preview/index.mdx, jev weight 0.76).

Unsetting is supported: the stable configuration docs show passing `undefined` or `null` to unset an environment variable (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/sandbox/sdk/configuration/environment-variables.mdx, jev weight 0.81). The documented use pattern for `setEnvVars` is one set of variables shared across multiple commands in the sandbox (https://developers.cloudflare.com/sandbox/configuration/environment-variables/, jev weight 0.77).

## Why secrets stay in the Worker

The outbound-traffic guide explains the mechanism: outbound handlers let you intercept and modify HTTP traffic leaving a sandbox with trusted code, and the documented uses are to allow or deny specific origins, to safely inject authorization headers or tokens, and to transparently reroute traffic (https://developers.cloudflare.com/sandbox/guides/outbound-traffic/, jev weight 0.82). The key architectural fact is where handlers run: they execute in the Workers runtime, outside the container, and they have access to your Worker's bindings, so sandbox traffic can be routed to internal platform resources without changing application code (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/sandbox/guides/outbound-traffic.mdx, jev weight 0.64).

## The reference pattern

Cloudflare's authentication example demonstrates the full shape: secure credential injection using outbound traffic interception, where secrets live in the Worker environment and are injected transparently, so the sandbox never sees them and requires no configuration (https://github.com/cloudflare/sandbox-sdk/tree/main/examples/authentication, jev weight 0.82). A third-party writeup states the same conclusion plainly: Cloudflare Sandbox is the provider where the credential-never-enters-the-sandbox shape needs no proxy at all, because outbound handlers run in the Workers runtime outside the container and attach credentials to requests on the way out (https://www.seekrit.dev/docs/guides/sandboxes/cloudflare-sandbox, jev weight 0.17, weak backing; use it as corroboration, not authority).

## What this means in practice

Three habits fall out of the two rules. First, treat `setEnvVars` and launch `env` as a config surface for anything that is safe to leak into a shell inside the container, because anything in the container's environment is readable by the code you run there. Second, when the sandbox needs to call an authenticated external API, write an outbound handler that attaches the Authorization header in the Worker, and give the sandbox code no knowledge of the credential at all; the source doc phrases this as "live credentials stay in the Worker". Third, when you need the sandbox to reach internal platform resources, use the handler's binding access to route to them rather than copying internal URLs and tokens into the container (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/sandbox/guides/outbound-traffic.mdx, jev weight 0.64).

The 1.0 preview environment page puts the boundary where the source doc does: image, `setEnvVars`, and per-launch `env` are for configuration; the outbound handler is the credential path (https://developers.cloudflare.com/sandbox/1-0-preview/environment/, jev weight 0.88).

## Related Worker-side context

Worker-level environment variable handling is its own documented surface: local dev vars can be loaded from `.env` files, and `CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV` set to "false" disables that loading without providing a `.dev.vars` file (https://developers.cloudflare.com/workers/local-development/environment-variables/, jev weight 0.40, weak-to-medium backing; it documents Workers, not the Sandbox SDK). A third-party guide suggesting `.dev.vars` for API keys during sandbox development (https://neon.com/guides/cloudflare-sandbox-neon-branching, jev weight 0.20, weak backing) is consistent with keeping keys on the Worker side, but the authoritative pattern for sandbox calls is the outbound handler documented above.
