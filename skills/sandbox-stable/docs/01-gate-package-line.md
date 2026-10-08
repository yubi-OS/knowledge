# 01. Gate: confirm the package line

Scope: confirming that an app is on the default stable @cloudflare/sandbox package with the matching stable container image, and routing to sandbox-next or sandbox-migrate-to-next when the ask is 1.0, new work, or a port.

Grounding spine: yubi-OS/yubiOS skills/sandbox-stable/SKILL.md (source doc).

## The two checks

The source doc makes the gate a two-row check performed before any code is written. First, the npm dependency must be the default `@cloudflare/sandbox` tag, not `@next` and not any preview tag. Second, the container image must be the matching stable image, not `cloudflare/sandbox:next`. Both checks exist because the SDK ships on two lines at once: the 1.0 preview "is available now as a preview on the npm @next tag" while "the current stable package remains published for existing apps" (https://developers.cloudflare.com/sandbox/1-0-preview/, jev weight 0.56). The preview install is a different package name entirely: `npm i @cloudflare/sandbox@next` and its peers, and the preview docs say to "deploy the Worker package and the sandbox container image from the **same** preview line" (https://developers.cloudflare.com/sandbox/1-0-preview/index.md, jev weight 0.61). That same-line rule is what the gate enforces on the stable side too.

## Routing outcomes

The source doc defines three exits from the gate. If the inspection finds `@cloudflare/sandbox@next` or a `next` image, stop and load the sandbox-next skill. If the user wants to port to 1.0 or `@next`, stop and load sandbox-migrate-to-next, and do not half-apply preview APIs on a stable package. If the request is only cleaning deprecated stable APIs, stay on stable and use the 2026 deprecation guide, which is explicitly not a move to `@next`. The source doc closes the loop with one hard rule: never mix a stable Worker package with an `@next` container image, or the reverse.

## What the stable line actually is

The stable package is worth knowing at gate time because the check is not arbitrary. A sandbox "is a Durable Object and the Container it starts", and "your Worker decides who gets a sandbox, which hosts it can reach, and which credentials stay out of it" (https://github.com/cloudflare/sandbox-sdk, jev weight 0.81). The npm package itself describes the capability set that the stable line has shipped since before the preview: "execute commands, manage files, run background processes, and expose services", aimed at "AI code execution, interactive development environments, data analysis platforms, CI/CD systems" (https://www.npmjs.com/package/@cloudflare/sandbox, jev weight 0.55). The overview adds the operational posture: run a web server from your browser inside a sandbox, keep credentials in your Worker, decide which services the sandbox can reach, list a user's sandboxes, and record when and why each one stops (https://developers.cloudflare.com/sandbox/, jev weight 0.79).

The product context also matters for gate decisions: one adopter reports the SDK let them "remove ~12k lines of orchestration code" and improved sandbox startup times (https://sandbox.cloudflare.com/, jev weight 0.61). That is a vendor page quote, but it signals that the stable line is actively marketed, not a frozen legacy.

## Why new projects still route to @next

The source doc's Guidelines say new projects are recommended on `@cloudflare/sandbox@next` with the sandbox-next skill, and that teams should "plan a move" with sandbox-migrate-to-next "so you are ready when 1.0 becomes the stable release", without forcing that port unless the user asks. The dig corroborates the framing from the product side: the 1.0 overview is dated Aug 13, 2026, and states that Sandbox SDK 1.0 is the next major release, in preview on the @next tag, while existing apps stay on the current stable package (https://developers.cloudflare.com/sandbox/1-0-preview/, jev weight 0.56). Tutorials for the stable line continue to be published and maintained as step-by-step paths for agents, code executors, and test pipelines (https://developers.cloudflare.com/sandbox/tutorials/, jev weight 0.76).

## Weak-source caution

One result in this subtopic's dig is a Cloudflare community thread about the 1.0 preview on @next, weighted 0.09 and therefore not citable as authority (https://community.cloudflare.com/t/sandbox-sdk-sandbox-sdk-1-0-preview-on-next/947721, weak backing below 0.5). Everything above about package lines and preview mechanics rests on the Cloudflare docs pages and the GitHub repo weighted at 0.55 or higher, plus the source doc itself.
