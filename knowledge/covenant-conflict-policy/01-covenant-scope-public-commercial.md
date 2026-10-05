# 01 - Covenant scope: what stays public vs commercial

Scope: what open-source covenants define as public versus commercial, how the open-core boundary is drawn, what the free core guarantees, and what the commercial layer may legitimately sell.

## The open-core shape

The open-core model is the dominant template for separating a public commons from a commercial layer: a core product is published under an open-source license while the same vendor sells proprietary add-ons, paid editions, or hosted services on top. Wikipedia's overview describes it as a business model where a for-profit company provides significant development support to a free, feature-limited core while monetizing the edge (weight 0.34, weak backing, cited as a general reference only: https://en.wikipedia.org/wiki/Open-core_model). A pricing-focused explainer describes the same shape plainly: "a free, open base draws in users, and a paid edge of proprietary features, support, and hosting captures revenue" (weight 0.15, weak backing: https://opensourcelicenserisk.com/commercial-licensing/open-core-pricing-models-explained/). A 2025 survey of feature-tier boundaries makes the same point from the vendor side: open-core businesses "blur the line between community and commerce," and the durable ones are explicit about which features sit on which side of the line (weight 0.15, weak backing: https://www.lavapi.com/blog/open-core-free-vs-paid-features).

A catalog of OSS business models frames open core as one option among several, alongside dual licensing, support-and-services, and hosted (SaaS) variants (weight 0.24, weak backing: https://en.wikipedia.org/wiki/Business_models_for_open-source_software). The practical lesson for covenant design is that the covenant should say which of these models applies, not leave the boundary to be discovered by users after a release ships.

## What the free core must guarantee

The boundary is only credible when the free core stands on its own. A practitioner guide argues the free core should be genuinely usable, not a crippled teaser, because the commons is what earns distribution and trust (weight 0.10, weak backing: https://www.heavybit.com/library/blog/building-an-open-source-business). A survey of open-source monetization models reaches a compatible conclusion: models differ in where they put friction, but every workable one preserves a real free tier (weight 0.15, weak backing: https://hwaelchli.com/open-source-business-models/).

The strongest criticism of the model targets exactly this line. Simon Phipps' long-running critique argues open core "exploits open source and is a game on software freedom": the proprietary edge often withholds exactly the capabilities users assumed they had (weight 0.13, weak backing, archived copy: https://web.archive.org/web/20110128014410/http://blogs.computerworlduk.com/simon-says/2010/06/open-core-is-bad-for-you). A founder-oriented guide agrees the model "depends on a credible boundary between community value, commercial value, and user trust" and that trust is the asset at stake when the line moves (weight 0.12, weak backing: https://www.fosshub.com/resources/sustainability/open-core-business/).

## Why the boundary belongs in a covenant

Two design consequences follow for a covenant document. First, the covenant should enumerate what the public layer guarantees in positive terms (security fixes ship to everyone, core features do not move behind payment), because the open-core literature shows boundary drift is the standard failure mode. Second, it should reserve the commercial layer's legitimacy to things adjacent to the commons, such as support, hosting, and enterprise management, since those are the categories every cited model treats as safely commercializable.

All sources for this doc carry weak jev backing (below 0.5); the subtopic is kept because the dig returned consistent, cross-corroborating descriptions of the same boundary pattern, but treat the specifics as directionally useful rather than authoritative.
