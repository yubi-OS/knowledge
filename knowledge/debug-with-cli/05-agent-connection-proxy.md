# 05: Agent side connection and credential injection

Scope: registering the bridge as an agent-side connection with bearer auth and a proxy that injects `Authorization` so calls stay plain `curl POST /run`.

## The call surface

From the agent's side, driving the bridge is one HTTP call. `curl` is the canonical tool for transferring data from or to a server (source: https://curl.se/docs/manpage.html, jev weight 0.95), and the bridge call shape is a plain POST with a JSON body:

```bash
curl -sS -X POST 'https://<node>.<tailnet>.ts.net/run' \
  -H 'Content-Type: application/json' \
  -d '{"command":["bcvk","--version"],"timeout":10}'
```

The response is a uniform JSON envelope (stdout, stderr, returncode, see doc 03). Guides for scripting curl document the same building blocks this call uses: a POST method flag, request headers, a data body, and JSON parsing of the response (source: https://www.commandinline.com/shell-script-api-calls-curl/, jev weight 0.27, weak).

## Bearer header mechanics

The bridge authenticates on the `Authorization` header. Setting it with curl is the standard `-H "Authorization: Bearer <token>"` form; a long-running Stack Overflow answer notes that curl's default Basic authentication sends credentials in lightly-obfuscated plaintext, which is why a separate explicit header with a bearer token over HTTPS is the better shape for machine-to-machine calls (source: https://stackoverflow.com/questions/3044315/how-to-set-the-authorization-header-using-curl, jev weight 0.56). Reference docs describe bearer authentication as an HTTP authentication scheme built around a security token presented by the caller (source: https://swagger.io/docs/specification/authentication/bearer-authentication/, jev weight 0.70).

## Credential injection at the proxy

The agent never writes the token into a command line or a prompt. The verified deployment registers the bridge as an agent connection with `connection_type: keys` and Bearer auth pointed at the Funnel URL; the agent platform's proxy then injects the credential automatically for every outbound request matching that connection (source record, refs/debug-with-cli, 2026-08-01, unweighted). The agent's code stays a clean `curl POST /run` with no header at all.

This is an instance of a pattern the AI-agent infrastructure world has converged on: keep upstream tokens and API keys out of the agent, and inject them just in time at the egress point. Agentgateway documents exactly this: keep upstream OAuth tokens and API keys out of AI agents by injecting credentials on egress for MCP and API calls (source: https://agentgateway.dev/blog/2026-07-27-credential-injection-ai-agent-egress-cb4a/, jev weight 0.18, weak). Composio frames the threat directly: keeping API tokens out of the LLM context requires credential isolation via a secure proxy to avoid prompt-injection risks (source: https://composio.dev/content/credential-isolation-ai-agents, jev weight 0.35, weak). Riptides goes further with secretless patterns where agents authenticate without ever holding keys, credentials injected per request outside agent memory (source: https://riptides.io/solutions/secretless-ai/, jev weight 0.24, weak).

The design guidance behind these products is consistent. A 2026 guide to securing AI agent API authentication recommends scoped identities, permission enforcement, controlled tool access, and production-grade observability for agent credentials (source: https://nango.dev/blog/guide-to-secure-ai-agent-api-authentication, jev weight 0.58). The bridge pattern satisfies the spirit with much less machinery: the identity is one bearer token, the scope is the whole target box (which is why doc 07 cares so much about rotation), and observability is the caller's own session log.

A concrete open-source example of the same proxy shape is AWS's sample MCP identity proxy: a lightweight client-side MCP proxy that injects OAuth 2.0 bearer tokens or API keys into requests to MCP servers that authenticate with OAuth or API keys (source: https://github.com/aws-samples/sample-mcp-identity-proxy-for-aws, jev weight 0.71).

## Error handling at the call site

The agent-side caller branches on the same three signatures the bridge returns: 401 for a bad or missing bearer (check the connection row, not the code), 408 for a command timeout (shrink the command or raise the timeout field), and an edge-level 530 for no listening origin (the bridge process or node is down; see doc 02). Treating these as distinct, documented outcomes is what makes the call site a one-liner instead of a retry maze (source record, unweighted).

## Why this shape holds up

The end-to-end property worth protecting is: the token exists in exactly two places, the target's token file (doc 07) and the connection store, and nowhere in between. No chat transcript, session file, or git history ever contains it (source record, unweighted). That is the practical meaning of credential isolation for agents, achieved with a keys-type connection row and a 50-line listener.
