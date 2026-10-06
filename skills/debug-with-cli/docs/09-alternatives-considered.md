# 09 Alternatives considered, and why each was rejected

Scope: the 6 approaches the source doc tried or evaluated before the bridge pattern, with the rejection reasons preserved so future sessions do not re-litigate. Grounded in the source doc (yubi-OS/yubiOS skills/debug-with-cli/SKILL.md); the external projects are grounded in the dig with weights noted.

## 1. mcp-proxy (sparfenyuk, PyPI)

A bridge between MCP transports; its modes include running a proxy server from stdio that connects to a remote server (https://github.com/sparfenyuk/mcp-proxy, weak, weight 0.39; a mirrored fork describes the same transport bridging at https://github.com/iflow-mcp/sparfenyuk-mcp-proxy, weak, weight 0.39). Rejected by the source doc because it has no inbound auth on the SSE/HTTP port: anyone with the URL can call it. Its `ALLOW_COMMANDS` is a command allowlist, not a request-auth filter. Unsuitable for hardware-attached CI runners with a real YubiKey and destructive `/dev/sda` tests (source doc).

## 2. mcp-proxy (punkpeye, npm)

Supports `--apiKey` as an X-API-Key header. Rejected for 3 reasons: it requires Node on the target, requires the user to manage a JSON spec file, and uses X-API-Key rather than Bearer, which would force the Sauna connection to be re-typed with a non-standard auth scheme (source doc).

## 3. Cloudflare Tunnel + Cloudflare Access

The most "enterprise" option: Cloudflare Tunnel routes traffic to internal services through outbound-only connections from a `cloudflared` daemon (https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/, weak, weight 0.44), with Access fronting identity via applications such as a generic OIDC SaaS app (https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/generic-oidc/, weak, weight 0.15). Rejected by the source doc: it adds Cloudflare as a dependency, requires a per-call OIDC flow, and the setup overhead is high for what should be a 2-minute local tool (source doc).

## 4. mTLS

A client certificate presented by the Sauna sandbox. Rejected: the Sauna sandbox has no `~/.ssh`-style cert store, and provisioning client certs in the proxy auth model is awkward (source doc).

## 5. Adding the Sauna sandbox to the tailnet

Deploy a Northflank container with `tailscaled` and an auth key so the sandbox holds a real Tailscale identity. The source doc calls this theoretically the cleanest answer, real Tailscale identity auth, but rejects it: it adds a Northflank container to the infrastructure and does not change the auth model for the public HTTPS surface anyway (source doc).

## 6. Tailscale Funnel ACL grants

Restricting Funnel to specific Tailscale users. Rejected: the Sauna sandbox is not a tailnet user (no `tailscale` binary), so an ACL restriction would lock out the only caller that matters (source doc).

## The pattern in the rejections

All 6 rejections trace to the same 2 constraints established in doc 01: the caller is an HTTP-only sandbox that cannot hold interactive identity or per-call flows, and the target is a machine worth protecting with real request authentication. Approaches that fail one constraint fail the setup; the Bearer-auth bridge with a 256-bit token and Funnel TLS passes both while staying a 50-line stdlib script. The source doc's loading constraints direct future sessions to read this section before re-evaluating the approach: if a proposal surfaces mcp-proxy or Cloudflare Tunnel without checking the auth model, surface this skill as the precedent (source doc).
