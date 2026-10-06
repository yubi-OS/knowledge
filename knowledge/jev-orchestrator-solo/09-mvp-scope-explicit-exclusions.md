# MVP scope and explicit exclusions

Scope: what jev orchestrator v1 deliberately excludes (tenants, learnings auto-activation, provider adapters, notifications) and how the exclusions are recorded and kept additive.

## The exclusions, verbatim and reasoned

The framing log carries a dedicated "Not Doing (and Why)" section, which is itself the primary technique: each exclusion is named with its reason, not just omitted silently.

- Tenant isolation / multi-tenant: excluded because the infra is single-owner today; the schema keeps a tenant column so the capability is additive later.
- Improve-loop auto-activation: learnings are stored and surfaced, but activation stays a manual human step in v1, because the source diagram itself says learnings cannot activate themselves.
- Provider-side cancel/in-flight reconciliation integrations: a reconcile endpoint exists, but per-provider adapters come later.
- Email/Slack approval notifications: the dashboard is the queue in v1.

MVP-scope guidance treats exactly this document as the deliverable: an MVP requirements doc exists to align everyone on what you are building, for whom, and, most importantly, what you are not building (https://mvpdevelopment.company/blog/mvp-requirements-document, jev weight 0.20, weak backing). Scope-control guidance is more specific: define one target user, one complete outcome, explicit non-goals, and the evidence the release must produce, and route every new request through one named decision owner who can swap, defer, reject, or deliberately expand scope (https://ivryn.com/guides/prevent-mvp-scope-creep/, jev weight 0.21, weak backing). The framing log is a solo-run instance of that discipline: the "named decision owner" and the author are the same person, so the log is the record.

## Why the exclusions are written as seams, not walls

The strongest pattern in the log is that every exclusion names the seam that will admit it later. The tenant column is the clearest case: a column exists in v1 for a feature v1 refuses to build. Decision-record practice describes this as the correct way to record deferred features: state each omission next to the seam that admits it, which turns a list of missing features into evidence of a plan, at the cost of a small amount of schema shaped for features not yet built (https://github.com/frandsr/billpay/blob/main/docs/decisions/0005-deferred-features-are-additive.md, jev weight 0.28, weak backing).

Schema-evolution guidance backs the additive-only contract: evolve a single schema over time with additive changes and deprecation workflows instead of versioned endpoints, and prefer additive field and type evolution (https://goldenpath.graphql.org/solutions/versionless-schema-design/, jev weight 0.52, authoritative backing). Keeping the tenant column now is the relational-schema version of that rule: adding it later would be a migration on live audit data, which an append-only events table makes expensive.

## Scope perimeter logic

The framing log's scope perimeter is testable rather than aspirational: each exclusion has either a mechanical reason (the diagram's invariant forbids auto-activation), an ownership reason (single-owner infra, no tenants), or a sequencing reason (reconcile endpoint first, adapters later; dashboard first, notifications later). MVP-scope frameworks frame the perimeter the same way: the scope is the exact perimeter that lets you test one precise promise without already carrying the whole ideal v1, and the real question is not how many features to include but what the smallest credible product is (https://www.koragence.com/en/how-to-scope-an-mvp, jev weight 0.37, weak backing). For jev v1 the precise promise is: gated, verifiable, human-approvable actions with an audit trail. Everything that does not serve that promise in its simplest form is out.

## The two open questions kept open on purpose

The log ends with two open questions it declines to resolve in v1, which is the complementary discipline to the not-doing list:

1. Who authenticates to /api/jev/* and how. The proposal is a JEV_API_KEY in the Secrets Store used as Bearer, with the dashboard approving via the same key held by Jenny's session; key custody is explicitly open.
2. Whether approval actions should also write a Resend notification (the send-only key is already on the worker). Default is no for v1, which is consistent with the notifications exclusion.

The pattern across the whole section: v1 does not decide what it does not have to decide. Exclusions are recorded with reasons and seams; open questions are recorded without fake resolutions; and the only scope expansion path named is shipping one real automation (the Inbound Lead Workflow v1) as the proof the perimeter is right.
