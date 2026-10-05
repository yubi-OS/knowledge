# Risk Framing in Early Collateral

Scope: Risk framing in early collateral. Pilot statements of work, public data sheets, support boundaries, and ROI baseline worksheets drafted under uncertainty.

## The collateral set for an unproven product

The days 0 to 30 collateral set for discussing an early offer with prospective customers has four artifacts: a pilot statement of work (what a pilot includes and excludes), a public data sheet (what the product is, factually), a support-boundaries document (what the vendor will and will not support), and an ROI baseline worksheet (how the customer measures value). Drafting all four while the product is still unproven is the core tension this doc addresses: each artifact must be specific enough to discuss with a real customer, yet must not promise what the product cannot yet do.

## Pilot statements of work

A statement of work standard backed by WorldCC (the contract-commerce standards body) exists as a free template set, treating the SOW as a structured document rather than freeform prose ([statementofwork.org, weight 0.32, weak backing](https://www.statementofwork.org/)). For a pilot of unproven infrastructure, the SOW should carry explicit exclusions that mirror the evidence boundary: unproven capabilities are named as out of scope, support hours and response expectations are stated as best-effort, and the success criteria reference measurements the customer can verify rather than vendor claims. A pilot SOW that does not name its exclusions will import them silently as implied promises.

## Data sheets as buying infrastructure

Spec-sheet guidance from B2B commerce argues that product spec sheets are not merely supporting documents but part of the buying infrastructure: procurement, engineering, and compliance teams rely on them to compare and approve purchases ([ajspecification.com, weight 0.16, weak backing](https://ajspecification.com/b2b-ecommerce-spec-sheet-best-practices-industry-standards-explained/)). This raises the standard for an early-stage datasheet: it will be read as a factual commitment, not as marketing. The datasheet should therefore state proven capabilities in verifiable terms (what runs, on what hardware, demonstrated how) and mark in-progress capabilities with the standing preview label rather than omitting them silently.

Practitioner breakdowns of real B2B datasheets emphasize designing for the late-stage deal: the datasheet's job is to remove hesitation for the reader who is evaluating seriously ([dock.us, weight 0.37, weak backing](https://www.dock.us/library/product-datasheet-examples)). For security infrastructure the serious evaluator is an engineer, so the hesitation-removing content is technical specifics: supported hardware classes, boot chain components, and what the demo environment actually demonstrates.

## Support boundaries

Support-boundary language is the contractual complement of the evidence boundary. Every capability on the unproven side gets a matching support exclusion: no production support, best-effort response only, no uptime commitment. Every capability on the proven side gets an explicit support statement. Writing both sides down prevents the two failure modes of early support: overpromising (implicit 24/7 support for software that changes weekly) and vagueness (support language so general that it cannot be enforced or trusted).

Disclaimer practice for product content provides the template structure: state the limitation, state its consequence, and place it where the reader cannot miss it ([content.terabox.com, weight 0.17, weak backing](https://content.terabox.com/hub/how-to-write-an-effective-disclaimer-for-a-product-with-copy-and-paste-examples)). The same structure applies to technical support boundaries: "capability X is in Technical Preview; it is not covered by support commitments and may change or be withdrawn."

## ROI baselines under uncertainty

An ROI baseline worksheet for an unproven product has a specific shape: it records the customer's current-state cost (what the problem costs today, measured by the customer, not estimated by the vendor) before any claim about improvement. The worksheet's purpose at the pilot stage is not to prove ROI but to define the measurement that a later ROI claim will cite, which keeps the eventual claim inside the evidence discipline. The baseline belongs to the customer's own data collection, which is also what makes the later pilot outcome credible to the next prospect.

## The composite rule

Four rules tie the set together:

1. Every artifact inherits the same evidence boundary. If a capability is unproven, all four artifacts label it identically.
2. Exclusions are named, not implied. The SOW lists what is out of scope; the datasheet marks preview capabilities; the support document states what is unsupported.
3. Numbers come from the customer or from demonstration. No estimated improvement figures in early collateral.
4. The collateral is dated. Because the evidence boundary moves weekly in days 0 to 30, each artifact carries its date, and a stale artifact is treated as an overclaim risk.

## Honest limits of the evidence

All sources backing this doc scored below 0.5 (0.16 to 0.37), practitioner guidance rather than authoritative documentation. The structural recommendations are consistent across independent sources but should be calibrated against the first real pilot SOW and customer feedback.
