# Package line gate

Scope: confirming the @next package line before writing any code. Covers the npm dependency and container image alignment check, what changes between the stable and 1.0 preview lines, why mixing lines is a failure mode, and how to route around this skill to sibling skills.

## What the source doc requires

The source doc (yubi-OS/yubiOS skills/sandbox-next/SKILL.md) makes the gate the first step: before writing code, inspect the app and confirm two things. First, the npm dependency must be `@cloudflare/sandbox@next` or another preview tag. Second, the container image must be on the same line, for example `cloudflare/sandbox:next` or `next-python`. If the app uses the default `@cloudflare/sandbox` package with no `@next`, the source doc says stop and load `sandbox-stable`, and do not apply this skill's APIs. If the user wants to port a stable app to `@next`, stop and load `sandbox-migrate-to-next`. Never mix an `@next` Worker package with a stable container image, or the reverse.

## The two package lines

Sandbox SDK 1.0 is the next major release of the SDK. It is available now as a preview on the npm `@next` tag, and the current stable package remains published for existing apps (https://developers.cloudflare.com/sandbox/1-0-preview/, jev weight 0.87). The stable 0.12.x line is what npm shows as the latest published release (https://www.npmjs.com/package/@cloudflare/sandbox, jev weight 0.54). An official announcement confirms the same split: 1.0 preview on `@next`, stable staying on the 0.12.x line (https://community.cloudflare.com/t/sandbox-sdk-sandbox-sdk-1-0-preview-on-next/947721, jev weight 0.12, weak backing, treat as a dated echo of the official docs rather than an authority).

The gate matters because the two lines have different contracts. The 1.0 preview is a thinner SDK on the same foundation: one process handle for short and long-running work, no session-based command state, no transport picker, terminals as first-class PTYs, and a code interpreter surface (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/sandbox/1-0-preview/index.mdx, jev weight 0.76).

## What changes under the hood

In 0.x, a `Sandbox` class owned the Container and ran commands for you. In 1.0, your own Durable Object starts the Container, and the package provides file operations and bucket mounts; the migration guide maps each 0.x API to its replacement (https://github.com/cloudflare/sandbox-sdk, jev weight 0.82). The `exec` shape changed too. The stable package accepts a command string, while the 1.0 preview takes an argv array and returns a process handle (https://developers.cloudflare.com/sandbox/1-0-preview/index.md, jev weight 0.85).

## Why line mixing breaks

Stable Sandbox and `@next` use different control protocols. The migrate guide frames production cutover as one deploy of the preview Worker package plus the matching container image (https://developers.cloudflare.com/sandbox/1-0-preview/migrate/, jev weight 0.87). The troubleshooting page lists the mismatch as its own symptom: a Worker package and container image on different lines, fixed by using the same line on both (https://developers.cloudflare.com/sandbox/1-0-preview/troubleshooting/, jev weight 0.92). This is why the source doc's gate checks the lockfile and the Dockerfile together rather than one or the other.

## The container foundation

Both lines run isolated work on Cloudflare Containers (https://developers.cloudflare.com/sandbox/1-0-preview/, jev weight 0.87; https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/sandbox/1-0-preview/index.mdx, jev weight 0.76). Cloudflare reports rebuilt Containers that start more than 6x faster, let your code choose each sandbox's image and compute resources at runtime, and support filesystem snapshots so workspaces can be saved and restored (https://blog.cloudflare.com/faster-agent-sandboxes/, jev weight 0.63). Each sandbox runs in an isolated Linux container with Python, Node.js, and common development tools preinstalled (https://developers.cloudflare.com/sandbox/concepts/containers/, jev weight 0.75). Under 1.0, a Durable Object in your Worker starts the container instance from an image and runs a command in it via `container.start({ image, entrypoint })` (https://developers.cloudflare.com/sandbox/1-0-preview/api/, jev weight 0.86). The Durable Object scheduling policy used by a sandbox container is in public beta (https://developers.cloudflare.com/sandbox/1-0-preview/api/, jev weight 0.86).

## Routing away from this skill

The source doc gives three stop conditions, all routing rather than failure: default package, load `sandbox-stable`; porting request, load `sandbox-migrate-to-next`; self-deployed bridge only, keep bridge on the stable package and image, because bridge is not on the 1.0 preview line yet (source doc). The skills themselves install through Cloudflare's agent setup flow (https://developers.cloudflare.com/agent-setup/, https://github.com/cloudflare/skills, source doc).

## Deprecated 0.x surface

Cloudflare has deprecated features in the stable SDK where they were superseded by newer capabilities or saw low adoption, and directs new work away from them (https://community.cloudflare.com/t/sandboxes-deprecating-sandbox-sdk-features/933294, jev weight 0.14, weak backing). Read it as directional context only; the authoritative list lives in the official migrate and deprecation docs.
