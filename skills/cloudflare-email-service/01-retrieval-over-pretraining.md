# Retrieval Over Pretraining

Scope: why the Cloudflare Email Service skill demands retrieval-first behavior for every task in its domain, and the 4 retrieval sources it names.

The source doc (yubi-OS/yubiOS skills/cloudflare-email-service/SKILL.md) opens with a warning that frames everything else in the skill: your knowledge of Cloudflare Email Service, Email Routing, or Email Sending may be outdated, and the product "launched in 2025 and is evolving rapidly". The skill's standing instruction is "Prefer retrieval over pre-training for any Email Service task". This is not boilerplate. It is an operating rule: a coding agent that answers from memory about this product is answering from a snapshot of a fast-moving surface, and the skill explicitly tells you not to do that.

## The discrepancy rule

The source doc is explicit about the authority ordering: "If there is any discrepancy between this skill and the sources below, always trust the original source. The Cloudflare docs, REST API spec, `@cloudflare/workers-types`, and Agents SDK repo are the source of truth. This skill is a convenience guide — it may lag behind the latest changes." So the skill positions itself as a fast index, not as the record. When the skill's example and the live docs disagree, the live docs win. The corpus treats the source doc the same way: it is the grounding spine, and dig results that have moved past it are recorded as dated corrections, not as contradictions of it.

## The 4 retrieval sources

The skill's Retrieval Sources table (source doc) names 4 sources, each with a retrieval method and a use case:

1. Cloudflare docs, retrieved via the Cloudflare MCP `docs` tool or the URL https://developers.cloudflare.com/email-service/. Use for API reference, limits, pricing, and latest features.
2. REST API spec, at https://developers.cloudflare.com/api/resources/email_sending. Use for the OpenAPI spec of the Email Sending REST API.
3. Workers types, at https://www.npmjs.com/package/@cloudflare/workers-types. Use for type signatures and binding shapes.
4. Agents SDK docs, fetched as `docs/email.md` from https://github.com/cloudflare/agents/tree/main/docs. Use for email handling in the Agents SDK.

The dig confirmed the primary source is live and actively maintained. The Email Service docs root (w 0.75, https://www.cloudflare.com/products/email-service/) describes the product as "Email for applications, workflows, and agents", giving applications and agents "a native way to send transactional email, receive inbound messages, and automate workflows on a global network". The documentation corpus shows fresh revision stamps from 2026: the email routing examples page is dated Apr 21, 2026 (w 0.96, https://developers.cloudflare.com/email-service/examples/email-routing/), the send-bindings configuration page Jun 9, 2026 (w 0.96, https://developers.cloudflare.com/email-service/configuration/send-bindings/), and the domain configuration page Sep 16, 2026 (w 0.96, https://developers.cloudflare.com/email-service/configuration/domains/). Five dated revisions across 5 months in 2026 is direct evidence for the skill's "evolving rapidly" claim.

## What the live docs establish about scope

The get-started routing page states that Email Service routes "incoming emails sent to your domain to existing mailboxes, Workers for processing, or other destinations" and, importantly, "You must be using Cloudflare DNS to use Email Service" (w 0.96, https://developers.cloudflare.com/email-service/get-started/route-emails/). That DNS prerequisite is a hard platform constraint the skill's quick-start sections assume but do not spell out, and it is exactly the kind of fact a pre-training answer would miss.

The Email Routing product page (w 0.77, https://www.cloudflare.com/products/email-routing/) describes Email Routing as "a free, private service for creating custom email addresses and forwarding messages to any inbox, protecting your primary email from spam". The dig weights this at 0.77, above the 0.5 authoritative threshold but below the docs pages, because it is the marketing surface rather than the technical reference.

## Operating pattern

For an agent working in this domain, the retrieval-first rule resolves into 3 concrete behaviors (source doc, adapted):

1. Before writing any email code, retrieve the current state of the relevant docs page rather than recalling an API shape.
2. When the skill's snippets and the docs disagree, follow the docs and treat the disagreement as a dated drift note.
3. When a task touches the REST API or the Agents SDK, go to the OpenAPI spec or the Agents SDK repo rather than the skill's prose, because those two sources are the ones most likely to have changed.

The Workers API docs page (w 0.96, https://developers.cloudflare.com/email-service/api/send-emails/workers-api/), last revised Sep 16, 2026 in the dig, is a good example of why: it confirms the `send_email` binding and the `send()` method the skill teaches, but it is the page, not the skill, that carries the current request and response shape.

## Backing summary

Claims grounded in the source doc carry its path as the citation. Claims grounded in the dig carry the URL and weight shown: 6 of the 12 collected results for this subtopic scored 0.5 or higher, led by 4 developer.cloudflare.com pages at 0.96 and the product page at 0.75. The remaining 6 results (a generic search-engine homepage, a login page, a Wikipedia entry, and 3 aggregator pages) scored below 0.5 and were not used.
