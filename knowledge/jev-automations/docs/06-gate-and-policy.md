# The deterministic gate and policy v4

Scope: `propose_actions` outputs enter the existing deterministic gate unchanged; the LLM never authorizes; policy v4 adds `web.fetch_public` (GET-only, hosts `["*"]`, credential-less, response-capped) and `places.search` (POST places.googleapis.com with credential `GOOGLE_PLACES_API_KEY`); the any-host read-only tool is a deliberate bounded exception.

## The gate is the only authorizer

The architecture's central security invariant: LLM outputs do not authorize anything. Every action, whether caller-supplied or LLM-proposed, passes the same deterministic gate before dispatch. The gate checks the action against the policy (tool allowlists, hosts, credentials, predicates) and produces an allow/deny verdict that is reproducible. Microsoft's agent-security guidance frames the stakes: agents plan, chain actions across systems, and invoke tools in sequences while no single human explicitly approves each step, which shifts the control point to identity, access, and tool binding (https://www.microsoft.com/en-us/security/blog/2026/07/16/least-privilege-for-ai-agents-identity-access-and-too, weight 0.76). The complementary principle from the same source: keep agent identity stable and make privileges time-limited and just-in-time (https://learn.microsoft.com/en-us/security/zero-trust/sfi/least-privilege-for-ai-agents, weight 0.95).

## Tool allowlists as policy

The policy is the tool allowlist plus per-tool constraints, evaluated by the gate. Tool allowlisting and approval gates are the standard permission model for agent systems (https://datascale-ai.github.io/data_engineering_book/en/part10/ch35_security_permission_collaboration/, weight 0.58, moderate backing for the general model; the v4 policy contents below are stated properties of the system). The gate's output is auditable by construction: each decision lands in the task's record.

## Policy v4 and the two additions

Policy v4 shipped through the audited improve flow (a prior learning, `l_415c2960c6ec1556`, was promoted). It added two tools:

1. `web.fetch_public`: GET-only, hosts `["*"]`, credential-less, response-capped. This is the deliberate bounded exception: an any-host read-only fetch. The containment measures are the argument for allowing it: no method except GET, no credentials ever attached, response size capped, every response logged. OWASP's SSRF guidance sorts fetch access into two cases, requests limited to identified trusted applications (allowlist possible) versus requests to any external address (allowlist unavailable), and prescribes different defenses for each (https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html, weight 0.95). `web.fetch_public` sits in the second case and compensates with the four bounds above. PortSwigger's SSRF material catalogs what server-side fetch abuse enables (internal endpoints, metadata services), which is why credential-less is the critical bound here (https://portswigger.net/web-security/ssrf, weight 0.90).
2. `places.search`: POST to places.googleapis.com with credential `GOOGLE_PLACES_API_KEY`. A narrow, credentialed, single-host tool; the opposite risk profile of `web.fetch_public`.

Def validation refuses any non-GET stage that uses `web.fetch_public`, so the GET-only bound is enforced where automations are defined as well as at the gate.

## The governance note, on the record

The v4 governance note states the reasoning: an any-host read-only tool is the same risk class as a browser; it carries no credentials and its responses are capped and logged. The risk-class argument is what makes the exception principled rather than ad hoc: a browser on a developer machine can already read any public page without authenticating, so the tool grants no capability beyond that baseline, while the cap and the logging add bounds a browser does not have.

## Policy evolution as a gated process

Policy changes do not ship by editing a config file directly; they flow through the audited improve flow where a proposed change is evaluated, recorded as a learning, and promoted. That keeps the policy's own history auditable: v4 is traceable to learning `l_415c2960c6ec1556`, and the promotion step is itself a gate on the gate.
