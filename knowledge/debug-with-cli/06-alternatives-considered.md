# 06: Alternatives considered and rejected

Scope: rejected options and why: mcp-proxy with no inbound auth, npm mcp-proxy with X-API-Key, Cloudflare Tunnel plus Access, mTLS, joining the tailnet, and Funnel ACL grants.

## mcp-proxy (Python, sparfenyuk)

The obvious candidate. sparfenyuk/mcp-proxy is a bridge between Streamable HTTP and stdio transports for MCP servers (source: https://github.com/sparfenyuk/mcp-proxy, jev weight 0.73), which lets a remote client connect to a local stdio server over an HTTP port (source: https://github.com/mcp-research/sparfenyuk/mcp-proxy, jev weight 0.22, weak). Model Context Protocol itself is the open standard for connecting AI applications to external systems (source: https://modelcontextprotocol.io/, jev weight 0.87), so an MCP-shaped bridge looks like the right tool for an agent driving a local process.

It was tried first and rejected. The verification found no inbound auth on its HTTP port, and its `ALLOW_COMMANDS` variable is a command allowlist, not a request-auth filter; with the target machine holding a real YubiKey and running destructive disk tests, an unauthenticated HTTP listener is a non-starter (source record, refs/debug-with-cli, 2026-08-01, unweighted). This matters as a category error worth naming: transport bridging and request authentication are different problems, and a tool that solves the first does not automatically solve the second. Notably, the MCP specification itself now defines bearer auth where an MCP server acts as a Resource Server that validates access tokens for protected resources (source: https://mcp-auth.dev/docs/configure-server/bearer-auth, jev weight 0.88), so the ecosystem does have an auth story; the specific proxy tool tested simply did not ship one for its HTTP listener mode.

## mcp-proxy (npm)

A second candidate with an API-key option: the Node-based mcp-proxy ecosystem authenticates with an `X-API-Key` header (source record, unweighted; the tool family is indexed at https://mcpservers.org/servers/sparfenyuk/mcp-proxy, jev weight 0.21, weak). Rejected on three grounds recorded in the source record: a Node dependency on a box that had none, JSON spec-file management, and a non-Bearer auth scheme that complicates the agent-side connection row, which was built around bearer injection. When the agent platform's proxy speaks Bearer, a bridge that speaks anything else adds friction with no added security.

## Cloudflare Tunnel plus Access

Cloudflare's stack is the "enterprise" option: Cloudflare Tunnel exposes apps through Cloudflare's edge while Tailscale creates a private mesh network, different tools for different problems (source: https://intellizu.com/articles/cloudflare-tunnel-vs-tailscale/, jev weight 0.18, weak). Comparison guides treat the pair as the main contenders for secure service exposure (source: https://behind.cloud/cloudflare-tunnels-vs-tailscale-funnel-vs-ngrok-secure-exposure-tools-compared, jev weight 0.14, weak; source: https://devtoolpicks.com/blog/when-to-use-cloudflare-tunnel-vs-tailscale-funnel-vs-public-vps-indie-hackers-20, jev weight 0.34, weak). Tailscale's own comparison page positions the two vendors head to head on identity and integration (source: https://tailscale.com/compare/cloudflare-access, jev weight 0.43).

Rejected for this use case because Access's auth model is OIDC-based (GitHub, Google identities), which means a per-call OIDC flow or a service-token setup, plus Cloudflare as a new dependency in the infrastructure, for a tool that should take 2 minutes to stand up (source record, unweighted). The right general shape, an edge that terminates TLS and a policy layer that authenticates callers, is preserved by Funnel plus a bearer check at smaller scale.

## mTLS

The strongest auth option on paper. Rejected because the agent sandbox has no `~/.ssh`-style certificate store to hold a client key, and provisioning client certificates through the proxy-credential model is awkward (source record, unweighted). mTLS also complicates rotation: rotating a client cert means re-issuing and redistributing a certificate rather than changing one shared secret.

## Joining the tailnet

The theoretically cleanest answer: give the agent's container a real Tailscale identity (for example a container running `tailscaled` with an auth key) so network-level identity auth replaces the bearer token entirely. Rejected for now because it adds a hosted container to the infrastructure, and it does not change the public HTTPS auth model that the Funnel URL implies anyway (source record, unweighted).

## Funnel ACL grants

Restricting Funnel to specific Tailscale users via ACLs fails structurally here: the agent sandbox is not a tailnet user and has no `tailscale` binary, so the ACL would lock out the only caller that matters (source record, unweighted). This is the same constraint that makes Serve (tailnet-only) invisible to the agent (doc 02).

## SSH tunnels

The classic alternative: SSH local port forwarding forwards a port on the local machine through the SSH server to a remote destination (source: https://linuxize.com/post/how-to-setup-ssh-tunneling/, jev weight 0.78). An SSH tunnel is a solid manual-access tool, but it needs a long-lived SSH key on the agent side and an sshd surface on the target, which is a larger attack and setup surface than a stdlib listener behind an HTTPS URL for this pattern (source record, unweighted).

## The selection logic

Across all six rejections the reasoning compresses to one filter: the caller is a cloud agent that can only do Bearer-authenticated HTTPS, and the target is a machine with real secrets attached. Any option that fails either half (no auth, non-Bearer auth, identity the agent cannot hold) is out regardless of its other virtues. The surviving shape, Funnel ingress plus a bearer-checked stdlib bridge, is the smallest design that passes both.
