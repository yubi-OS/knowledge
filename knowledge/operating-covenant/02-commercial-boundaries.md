# 02. Commercial boundaries: what the commercial layer may sell

Scope: which commercial offerings sit legitimately around an open-source project (services, support, hardware, hosting, consulting) and where the boundary sits against selling security or trust itself.

## The economics: selling around free software works

Source code in OSS is freely available for use, modification, and redistribution under open licenses; hardware designs can follow the same pattern. Early skepticism about the viability of "free" products gave way as viable models emerged [1] (weight 0.77). The catalog of models that sell *around* the code is well established: support contracts, managed hosting, hardware bundles, training, integration consulting, and paid convenience features. Sustainability surveys of free and open source software reach the same conclusion: commercial activity around the project is compatible with the project, provided the free artifact itself is not the thing being sold [2] (weight 0.42, weak backing).

## The pattern to avoid: security as a paid tier

A live example of the boundary case: an AI vendor positions "more security features and controls" as enterprise-grade value for API customers, bundling security into the paid tier [3] (weight 0.57). The practice is common enough that it draws sustained criticism: single sign-on, a security-relevant capability, is frequently locked behind expensive enterprise pricing, leaving smaller teams and individual users without that security capability [4] (weight 0.26, weak backing). The same critique appears in practitioner posts arguing that tiering essential security features is an ethics failure, not just a pricing choice [5] (weight 0.06, weak backing). A separate argument holds that enterprise tiering and forced bundling are self-defeating commercially as well [6] (weight 0.26, weak backing).

## The two-sided boundary for a covenant

A covenant on commercial boundaries has to state both halves:

**What may be sold.** Services and goods adjacent to the free artifact: deployment, enrollment, support and SLAs, hosted infrastructure, hardware, training, consulting, and paid convenience features. The Harvard Business School review of open source and open hardware business models treats this adjacency as the normal, sustainable shape of the market [1] (weight 0.77).

**What may never be sold.** Access to a security or trust capability that free users do not get. If a paid tier unlocks a stronger or different trust path, withholds a security fix, or requires surrendering keys or credentials to the vendor, the covenant line is crossed. The enterprise-feature bundling debate [3] (weight 0.57) is the concrete failure mode a covenant names so it cannot be reintroduced as a "premium security SKU".

## The convenience-feature test

Paid convenience is acceptable under one condition: a documented, owner-executable equivalent path exists without payment. The SSO debate is a good test case because SSO sits on the line: as an operational convenience it can be a paid add-on, but as the only way to get a secure configuration it is a security paywall [4] (weight 0.26, weak backing). A covenant should define which of the two a feature is before it ships.

## Caveats

Most of the practitioner literature in this dig is blog- and wiki-grade; the strongest sourced claim in this doc is the general economic framing [1] (weight 0.77) and the observed vendor practice of security-as-enterprise-value [3] (weight 0.57). Claims drawn from the weak-backed sources are labeled as such above and should be treated as the debate record, not settled fact.

## Sources considered

| # | Source | Weight |
|---|---|---|
| 1 | https://hbsp.harvard.edu/product/725489-PDF-ENG | 0.77 |
| 2 | http://www.oss-watch.ac.uk/resources/businessworkshop09 | 0.42 |
| 3 | https://openai.com/index/more-enterprise-grade-features-for-api-customers/ | 0.57 |
| 4 | https://mandysidana.github.io/posts/sso/ | 0.26 |
| 5 | https://medium.com/bofoss/is-sso-an-enterprise-tier-feature-a40cf5812f94 | 0.06 |
| 6 | https://andrewbaker.ninja/2026/02/24/enterprise-software-tiering-why-bundle-pricing-fails/ | 0.26 |
| 7 | https://en.wikipedia.org/wiki/Business_models_for_open-source_software | 0.16 |
| 8 | https://b-plannow.com/en/open-source-business-models-strategies-examples-and-advantages-for-building-a-solid-project/ | 0.09 |
| 9 | https://www.openevidence.com/ | 0.25 |
| 10 | https://handwiki.org/wiki/Software:PowerBuilder | 0.14 |
| 11 | https://www.ebay.com/sl/sell?msockid=2b45e5a5b98963a52c49f24cb87262f1 | 0.06 |
| 12 | https://www.namepros.com/threads/network-gtld-generic-top-level-domain.1398746/ | 0.03 |
