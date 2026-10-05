# 10. Business-model re-review

Scope: the re-review discipline that keeps a covenant aligned with the commercial layer as the business model lands and changes; how to check a concrete offer (SKU, pricing tier, hosted service) against covenant commitments.

## Why re-review is a distinct discipline

A covenant written before the business model exists makes claims about compatibility: "these boundaries hold under any pricing model that sells services around the OS rather than access to the trust chain". That claim is a hypothesis, not a proof. The moment a concrete offer lands (a pricing page, an enterprise tier, a hosted service), the covenant must be re-checked against it, because abstraction hides conflicts that a concrete SKU exposes.

The monetization literature is consistent on the general shape: the most effective open-source business models solve genuine pain points and simplify complexity [1] (weight 0.13, weak backing); revenue strategies for free software span funding models from support to hosting [2] (weight 0.10, weak backing); and vendors deliberately choose tools with sustainable business models and active communities when building their own stacks [3] (weight 0.07, weak backing). None of these sources resolve the covenant question, which is precisely why the re-review step exists: the commercial literature optimizes revenue, and the covenant's job is to constrain which revenue shapes are acceptable.

## The checklist: what to re-check when an offer lands

Each concrete commercial artifact gets checked against the covenant's core boundaries:

1. **Trust-gating check.** Does the SKU unlock a trust capability (a stronger boot path, a signing tier, faster security fixes) that free users lack? If yes, the offer conflicts.
2. **Key-custody check.** Does using the paid product require surrendering keys, credentials, or signing material to the vendor? If yes, the offer conflicts.
3. **Telemetry check.** Does the offer's data collection leak into the free artifact, or is it confined to the hosted service the customer opted into?
4. **Disclosure check.** Does the offer create an embargo tier or early-fix channel for paying customers? If yes, it conflicts with the disclosure commitment.
5. **Convenience-equivalence check.** For every paid convenience feature, does a documented, owner-executable free path exist?

This checklist is covenant-design reasoning grounded in the boundaries established in docs 02, 04, and 07; the external sources here support the commercial-shape context, not the checklist itself.

## Governance hooks that make re-review survivable

Two mechanisms keep the discipline from depending on one person's memory:

- **Scheduled review trigger.** Covenant text names the events that force a re-review: a new pricing tier, a new hosted service, an acquisition or stewardship change. Compliance review frameworks for open-source projects bundle license analysis, contributor frameworks, vulnerability disclosure, and governance review into one structured process [4] (weight 0.19, weak backing), which is the shape a covenant re-review should imitate.
- **Contribution agreements as precedent.** Foundations formalize the IP and conduct frame through contribution agreements, e.g. the OpenID Foundation's contribution agreements covering its working groups [5] (weight 0.72). A covenant can be wired into the same machinery: new commercial activities require a written compatibility finding, appended to the covenant record.

## Failure mode: assuming compatibility

The standing temptation is to declare compatibility once ("our boundaries are model-agnostic") and never re-check. The dig's commercial sources show why this fails in practice: monetization strategies are designed around pain points and willingness to pay [1] (weight 0.13, weak backing), and the natural evolution of such strategies is toward locking more value into paid tiers. Every evolution step is a potential covenant boundary crossing, and only an explicit re-review catches it.

## Caveats

This doc is the weakest-sourced of the corpus: the commercial-monetization sources are all weakly backed (0.07 to 0.13) and used only for the general claim that commercial pressure evolves. The checklist and governance mechanisms are design reasoning, not sourced fact. Treat the strong claims in docs 02 through 09 as the foundation; this doc describes the maintenance discipline that keeps them true.

## Sources considered

| # | Source | Weight |
|---|---|---|
| 1 | https://www.getmonetizely.com/articles/monetizing-open-source-how-to-build-a-sustainable-business-model | 0.13 |
| 2 | https://dev.to/jennythomas498/open-source-project-revenue-strategies-sustainable-funding-for-free-software-4nm0 | 0.10 |
| 3 | https://www.techsaas.cloud/blog/open-source-business-models-how-companies-monetize/ | 0.07 |
| 4 | https://www.roncooklawfirm.com/open-source-compliance/ | 0.19 |
| 5 | https://openid.net/intellectual-property/openid-foundation-contribution-agreements/ | 0.72 |
| 6 | https://b-plannow.com/en/open-source-business-models-strategies-examples-and-advantages-for-building-a-solid-project/ | 0.12 |
| 7 | https://handwiki.org/wiki/Software:Spotify | 0.12 |
| 8 | https://handwiki.org/wiki/Software:Ubuntu | 0.10 |
| 9 | https://www.openevidence.com/ | 0.26 |
| 10 | https://www.fosshub.com/resources/community/governance/ | 0.17 |
| 11 | https://opensource.google/projects | 0.48 |
| 12 | https://www.openevidence.com/ | 0.12 |
