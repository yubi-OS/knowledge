# 02. Public data sheet and support boundaries

**Scope:** public data sheets that state what is NOT included, including support-boundary language, known-limitations sections fed from a live source of truth, and non-affiliation notices.

## What a data sheet is for

A datasheet is a document that summarizes the performance and other characteristics of a product, component, subsystem, or software in sufficient detail that a buyer can understand what the product is and a design engineer can understand what it does (weight 0.07, weak backing: en.wikipedia.org, https://en.wikipedia.org/wiki/Datasheet). That definition carries a quiet requirement: the buyer's understanding must match reality. For an early-stage product, the highest-integrity version of a data sheet is one whose "what's NOT included" section is as concrete as its "what's included" section.

## Support boundaries as a published artifact

The strongest found example of boundaries published as a first-class artifact is Park Place Technologies' "Software Technical Support: Product Boundaries" document. It explicitly states that it outlines the known limitations and boundaries of the support offering, is deemed included in and part of the support service description, clarifies the scope of support, and outlines scenarios where additional services may be required to set product-specific expectations (weight 0.13, weak backing: parkplacetechnologies.com, https://www.parkplacetechnologies.com/wp-content/uploads/2026/06/LEGCON005-Software-Technical-Support-Product-Boundaries-English.pdf). The transferable pattern is structural, not stylistic: the boundaries document is not an appendix to the service description, it is legally part of it. A pilot data sheet should therefore list exclusions inside the data sheet itself rather than in a separate document a prospect might never open.

## Known limitations pulled from a live source of truth

Enterprise readiness checklist practice reinforces that a buyer's security and ops teams verify claims against documented evidence before approving a purchase: one checklist describes the required artifact as the set of controls plus the documented evidence for each one, noting that most stalled deals fail on missing evidence rather than missing controls (weight 0.08, weak backing: shantiinfosoft.com, https://shantiinfosoft.com/blog/enterprise-software-security-readiness-checklist/). A readiness checklist covering ownership, information boundaries, resilience, assurance, operations, and handover has the same shape (weight 0.35, weak backing: lumoxtech.com.au, https://lumoxtech.com.au/resources/enterprise-software-readiness-checklist/).

For a data sheet, this implies the known-limitations section must be generated from the project's live blocker tracker at publication time, not paraphrased from a cached copy. Microsoft's release-health model is the public-facing version of this discipline: a continuously updated page of known issues and rollout status for a shipped product, with an API for programmatic access (weight 0.24, weak backing: learn.microsoft.com, https://learn.microsoft.com/en-us/windows/release-health/status-windows-11-25h2). The data-sheet template should name its source of truth for limitations and state that the data sheet is only accurate as of the date that source was last read.

## Exclusions that doctrine, not marketing, dictates

Three categories of exclusion belong in the "what's NOT included" section precisely because a prospect might otherwise assume the opposite:

1. Any access mechanism stronger than the free, public path. If the product's doctrine rules out privileged access tiers, the data sheet should say so plainly rather than leave the assumption open.
2. Early access to security fixes ahead of the public disclosure timeline. If fixes ship to everyone simultaneously, a support contract buys response time, not early fix access. State this explicitly; it is the exclusion most likely to be assumed away.
3. Custody of the customer's key material. If no offer requires surrendering customer cryptographic keys as a condition of the pilot, the data sheet should say so, because for a security product that fact is a purchase criterion.

## Non-affiliation notice

Third-party trademark and affiliation disclaimers are a recognized instrument: a disclaimer indicates that the issuer does not claim exclusive rights to particular wording or design, per the United States Patent and Trademark Office's own guidance (weight 0.06, weak backing: uspto.gov, https://www.uspto.gov/trademarks/laws/how-satisfy-disclaimer-requirement). Legal clause libraries carry open-source disclaimer clauses stating that the vendor makes no representation or warranty with respect to open-source software included with the service (weight 0.04, weak backing: lawinsider.com, https://www.lawinsider.com/clause/open-source-disclaimer). Community-project guidance covers the inverse direction: a project's own documentation of its relationship with third-party entities and its non-affiliation posture (weight 0.03, weak backing: deepwiki.com, https://deepwiki.com/wrapper-offline/wrapperoffline-website/4.2-project-disclaimers-and-affiliation).

The template rule: a project built on or interoperating with a named vendor's hardware or software carries a plain statement that it is not affiliated with or endorsed by that vendor, formalized once trademark review closes. The notice costs one line; the omission risks the entire pilot relationship.

## Structure for the data sheet template

1. One-paragraph description grounded in the project's mission statement, not in aspirational claims.
2. "What's included": bulleted strictly from the offer catalog row.
3. "What's NOT included": the three doctrinal exclusions above, stated as facts.
4. "Known limitations at pilot time": generated live from the blocker tracker, with a freshness date.
5. Non-affiliation notice, with a note on when the formalized version arrives.
