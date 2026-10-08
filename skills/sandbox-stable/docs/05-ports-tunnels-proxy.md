# 05. Ports, tunnels, and proxying

Scope: exposing services that run inside a sandbox: the Ports API and preview URLs, the Tunnels API including quick tunnels, and proxying requests from the Worker to the sandbox, plus the production wildcard-DNS requirement for preview hostnames.

Grounding spine: yubi-OS/yubiOS skills/sandbox-stable/SKILL.md (source doc).

## Ports and preview URLs

The Ports API page scopes itself to stable: "Expose sandbox services via public preview URLs using the Sandbox SDK ports API. This page documents ports and preview URLs on today's stable @cloudflare/sandbox package. Examples that use startProcess are stable-only" (https://developers.cloudflare.com/sandbox/api/ports/, jev weight 0.76). The preview-urls concept page positions the two mechanisms next to each other: "Expose Services - Practical patterns for exposing ports. Ports API - Complete API reference. Tunnels API - Zero-config *.trycloudflare.com URLs as an alternative for development" (https://developers.cloudflare.com/sandbox/concepts/preview-urls/, jev weight 0.72). Preview URLs are the primary exposure path: "Sandbox SDK preview URLs provide public Https access to services running inside sandboxes" (https://developers.cloudflare.com/sandbox/concepts/preview-urls/, jev weight 0.75).

## When the Worker fronts the request

The expose-services guide draws the design line: "Follow this guide when you specifically want the Worker itself to front the request (for example, to inject authentication or rewrite responses). This guide shows you how to expose services running in your sandbox to the internet via preview URLs. Expose ports when you need to: [give a service a public URL]" (https://developers.cloudflare.com/sandbox/sdk/guides/expose-services/, jev weight 0.85). So Worker-fronted exposure is the authentication and rewriting seam; direct preview URLs are the plain path.

## Tunnels: quick vs named

The Tunnels API page splits the two modes: "Quick tunnels (sandbox.tunnels.get(port)) — zero-config. Cloudflare assigns a random *.trycloudflare.com hostname for each new cloudflared process. No Cloudflare account, API token, DNS record, or custom domain required. URLs change on every container restart" (https://developers.cloudflare.com/sandbox/api/tunnels/, jev weight 0.79). The 0.x tunnels reference covers the named-tunnel side: "Requires a Cloudflare API token, an account, and a zone. Use quick tunnels for local development, demos, and short-lived .workers.dev deployments where you do not need a stable URL" (https://developers.cloudflare.com/sandbox/sdk/api/tunnels/, jev weight 0.80). The decision rule: quick tunnels for ephemeral work, named tunnels when the URL must be stable, at the cost of an account, token, and zone.

## Proxy transport on stable

The source doc's non-negotiable binds transport choice to exposure work: "Prefer RPC transport when using tunnels or large/binary streaming. HTTP/WebSocket transports are deprecated (cleanup guide below)." The deprecation mechanics live in doc 08, but the coupling is stated here because tunnels and binary streaming are exactly the payloads where the deprecated transports hurt first. The production hostname rule also belongs to this doc: "Production preview hostnames need wildcard DNS on a custom domain when using those URL patterns" (source doc). The custom-domain setup details, wildcard DNS plus routes plus TLS, are worked out in doc 09 with dig backing at 0.83 and 0.84.

## Adjacent but distinct

One dig result covers Cloudflare Tunnel for Workers VPC, a different feature for reaching private network services from Workers (https://developers.cloudflare.com/workers-vpc/configuration/tunnel/, jev weight 0.50). It is included in the research archive for completeness but is not a Sandbox SDK ports or tunnels mechanism, and this doc makes no claims from it.

## Weak-source caution

The DeepWiki port-exposure mirror (0.11), a third-party wiki (0.08), and a community thread (0.07) are weak backing below 0.5 and carry no claims above (https://deepwiki.com/cloudflare/sandbox-sdk/3.5-port-exposure-and-preview-urls, https://wiki.bugculture.io/api-proxy-cloudflare-workers, https://community.cloudflare.com/t/agents-share-sandbox-previews-through-cloudflare-tunnel/931116). Every mechanism claim rests on Cloudflare docs pages at 0.72 or higher, plus the source doc.
