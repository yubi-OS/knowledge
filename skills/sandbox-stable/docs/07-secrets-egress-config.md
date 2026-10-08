# 07. Secrets, egress, and configuration

Scope: the configuration and secrets discipline of the stable package: non-secret configuration in sandbox environment variables, live credentials held in the Worker, and outbound handlers for sandbox processes that call external APIs.

Grounding spine: yubi-OS/yubiOS skills/sandbox-stable/SKILL.md (source doc).

## The split: config in the sandbox, secrets in the Worker

The source doc's non-negotiable draws the line: "Non-secret config in sandbox env; live credentials in the Worker. Use outbound handlers when processes call external APIs." The environment variables page covers the sandbox side: "Pass configuration, secrets, and runtime settings to Sandbox SDK containers using environment variables" (https://developers.cloudflare.com/sandbox/configuration/environment-variables/, jev weight 0.81). Note the page's own wording admits env vars can carry secrets; the source doc's discipline narrows that: env vars are for non-secret config, and anything live stays in the Worker.

One env-var mechanic is worth carrying into code review: "The Sandbox SDK supports unsetting environment variables by passing undefined or null values. This enables idiomatic JavaScript patterns for managing configuration" (https://developers.cloudflare.com/sandbox/configuration/environment-variables/, jev weight 0.81). That makes conditional config spread, such as `...(flag ? { KEY: value } : { KEY: undefined })`, a supported idiom rather than a hack.

The configuration index ties the knobs together: "Configure Sandbox SDK deployments with Wrangler, Dockerfiles, environment variables, and transport modes. Pass configuration and secrets to your sandboxes using environment variables" (https://developers.cloudflare.com/sandbox/configuration/, jev weight 0.78).

## Outbound handlers: the egress control plane

The outbound-traffic guide defines the mechanism and its three jobs: "Outbound handlers let you intercept and modify HTTP traffic from a sandbox with trusted code. Use them to: Allow or deny specific origin destinations. Safely inject authorization headers or tokens. Transparently reroute traffic" (https://developers.cloudflare.com/sandbox/guides/outbound-traffic/, jev weight 0.83). That is the enforcement point for the source doc's rule: when a sandbox process calls an external API, the call passes through a handler the Worker owns, not through credentials baked into the sandbox.

The handler architecture is precise about where code runs: "Outbound Workers are Workers that handle HTTP requests made by your sandbox. They act as programmable egress proxies, running on the same machine as the sandbox with access to all Workers bindings" (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/sandbox/guides/outbound-traffic.mdx, jev weight 0.71).

## Why credentials survive outside the container

The containers-level guide states the trust argument: "Because outbound handlers run in the Workers runtime — outside the container sandbox — they can hold secrets that the container itself never sees. The container makes a plain HTTP request, and the handler attaches the credential before forwarding it to the upstream service" (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/containers/guides/outbound-traffic.mdx, jev weight 0.54). This is the same pattern the s3-mount example applies to bucket credentials (doc 04): short-lived credentials issued on demand by the Worker, never resident in the container.

## Ship-check coupling

The source doc's ship checklist includes "No live secrets in sandbox env". The review rule that follows from this doc's sources: grep sandbox-side env assignment for anything resembling a token, key, or password; anything found is a finding, and the fix is an outbound handler or a Worker-side fetch. The 0.x environment variables page (https://developers.cloudflare.com/sandbox/sdk/configuration/environment-variables/, jev weight 0.84) is the same surface one release back and confirms the mechanism is not new in the stable line.

## Weak-source caution

A third-party secrets guide (0.27) and a community thread (0.09) are weak backing below 0.5 and carry no claims above (https://www.seekrit.dev/docs/guides/sandboxes/cloudflare-sandbox, https://community.cloudflare.com/t/containers-agents-secure-credential-injection-and-dynamic-egress/...). Every mechanism claim rests on Cloudflare docs pages or the cloudflare-docs repo at 0.54 or higher, plus the source doc.
