# 09. Production deployment and the ship checklist

Scope: taking a stable-package app to production: the same-line package and image rule, typechecking against installed stable types, keeping live secrets out of sandbox env, the sandbox lifecycle states and options, wildcard DNS for production preview hostnames, and the self-deployed bridge.

Grounding spine: yubi-OS/yubiOS skills/sandbox-stable/SKILL.md (source doc).

## The ship checklist

The source doc's "Before you ship" list has five items: Worker package and container image on the same stable line; typecheck against installed stable types; no live secrets in sandbox env; finish or track deprecated transports and helpers against the 2026 deprecation guide; and use sandbox-migrate-to-next when the team is ready for 1.0, never forcing the cutover unprompted. Items 1, 3, and 4 have their own corpus docs (01, 07, 08); this doc covers the deployment surface and lifecycle.

## Lifecycle: states and options

The Lifecycle API page scopes itself to stable and lists its jobs: "Get sandbox instances, configure options, and clean up resources. This page documents lifecycle helpers on today's stable @cloudflare/sandbox package" (https://developers.cloudflare.com/sandbox/api/lifecycle/, jev weight 0.79). The concept page names the state machine: "Sandbox SDK sandboxes transition through running, sleeping, and destroyed states based on activity" (https://developers.cloudflare.com/sandbox/concepts/sandboxes/, jev weight 0.77). The same lifecycle page carries the forward-compat note relevant to cleanup planning: "In the 1.0 preview (@next), remove transport options on getSandbox() and do not rely on enableDefaultSession" (https://developers.cloudflare.com/sandbox/api/lifecycle/, jev weight 0.79). The 0.x lifecycle reference covers the same surface one release back (https://developers.cloudflare.com/sandbox/sdk/api/lifecycle/, jev weight 0.79).

## Preview hostnames on your own domain

The source doc's non-negotiable: "Production preview hostnames need wildcard DNS on a custom domain when using those URL patterns." The dig fills in the setup. The hostnames guide: "A domain for previews on Cloudflare, such as example-previews.com, with Cloudflare managing its DNS. Use a domain that your application does not use. Route preview hostnames to your Worker. In the DNS settings of the preview domain, add a proxied wildcard record" (https://developers.cloudflare.com/sandbox/previews/serve-previews-on-their-own-hostnames/, jev weight 0.84). The custom-domain guide scopes when this is needed: "Set up wildcard DNS, routes, and TLS so exposePort() preview URLs work on your domain. To deploy the Worker and sandbox image, refer to Deploy a Sandbox application. Custom domain setup is only needed if you use exposePort() to expose services from sandboxes" (https://developers.cloudflare.com/sandbox/sdk/guides/preview-urls-custom-domain/, jev weight 0.83). Two rules fall out: a dedicated preview domain the app does not serve from, and a proxied wildcard record routing to the Worker. And the trigger is conditional: apps that never call exposePort skip the whole setup.

## The self-deployed bridge

The source doc pins the bridge to the stable line: "Self-deployed bridge stays on the stable package and image", pointing at the Bridge docs (https://developers.cloudflare.com/sandbox/bridge/) and the Bridge HTTP API (https://developers.cloudflare.com/sandbox/bridge/http-api/). This subtopic's dig did not return a bridge-specific result, so no dig-backed bridge claims are made here; bridge configuration signatures must be confirmed against the Bridge docs and installed stable types, per the source doc's retrieval rule.

## Learning and examples surfaces

Two orientation resources round out the production picture: the interactive tutorial covering "containers, code execution, and AI integration" (https://labs.cloudflare.dev/sandbox-sdk/, jev weight 0.62), and the examples tree on GitHub for stable and main (https://github.com/cloudflare/sandbox-sdk, jev weight 0.80). The product marketing page (https://www.cloudflare.com/products/sandboxes/, jev weight 0.48, weak backing below 0.5) adds no mechanism detail and is not cited for claims.

## Weak-source caution

The DeepWiki preview-URLs mirror (0.09) is weak backing below 0.5 and carries no claims (https://deepwiki.com/cloudflare/sandbox-sdk/8.3-preview-urls-and-custom-domains). Every lifecycle and DNS claim rests on Cloudflare docs pages at 0.77 or higher, plus the source doc.
