# 05. Bottom-up GTM and product-led growth

Scope: Product-led growth and bottom-up adoption for developer and security tools: individual adoption preceding team purchase, expansion motions, and limits of PLG for infrastructure and hardware products.

## What PLG is

Product-led growth is a go-to-market motion where the product itself drives acquisition, activation, and expansion; instead of leading with sales demos and enterprise contracts, PLG companies let users experience value before any sales contact (source: https://gtm-labs.co/product-led-growth, jev weight 0.34, weak backing). Modern SaaS companies including Slack, Figma, and Notion are the standard reference cases, with open-source developer tools named as a distinct application of the same pattern (source: https://zylos.ai/research/2026-02-11-product-led-growth/, jev weight 0.28, weak backing).

## The bottom-up motion for developer tools

PLG and bottom-up adoption work together: when developers can try before they buy with minimal friction, adoption spreads through organizations and communities (source: https://www.getmonetizely.com/articles/is-bottom-up-adoption-essential-for-developer-tool-success, jev weight 0.15, weak backing). The canonical stage model for devtools has a Land stage whose goal is a single developer reaching a genuine "it works" moment with zero sales contact; this is where the bottoms-up strategy lives or dies, because if the free tier cannot deliver that moment, nothing downstream happens (source: https://www.pmsynapse.in/blog/bottom-up-plg-selling-through-developers, jev weight 0.24, weak backing). Bottom-up adoption targets the individual developer as the entry user rather than the buying committee (source: https://techconcepts.org/blog/developer-led-growth, jev weight 0.09, weak backing).

The expansion mechanics get specific: the discipline covers how to engineer the individual-to-team expansion trigger and which metrics define bottoms-up health (source: https://saasdash.ai/blog/developer-tools-bottoms-up-sales, jev weight 0.27, weak backing). Free-tier design, docs as sales, and usage-based trial conversion are the named levers, and the individual developer also functions as the champion inside the later team deal (source: https://techconcepts.org/blog/developer-led-growth, jev weight 0.09, weak backing).

## The open-core variant

For open-source products the question is whether PLG can coexist with an open-core model. Practitioner material answers yes conditionally: the key is respecting both the principles of product-led growth and the expectations of open-source communities while creating clear, value-based paths to monetization that feel natural rather than extractive (source: https://www.getmonetizely.com/articles/can-you-successfully-execute-product-led-growth-with-an-open-core-model, jev weight 0.32, weak backing). The failure mode is monetizing the wrong layer: if the paid tier walls off something the community considers core, the same product that drove growth becomes the thing driving churn and backlash.

## Limits of PLG

PLG is not universal. Its documented failure conditions include products whose value is not visible to a single user, markets where the buyer expects a sales relationship, and products with a hardware or physical component where the "try it free" moment is structurally unavailable (source: https://mipaoverseas.com/product-led-growth-limits/, jev weight 0.07, weak backing). A security product whose deployment target is a fleet of machines has a slower activation loop than a browser app: the individual can adopt the tooling on their own laptop, but the team-level value (fleet enrollment, audit) does not exist until multiple machines are managed, which pushes the expansion trigger later in the adoption curve.

## Infrastructure and hardware constraints

For an operating-system product with a hardware root of trust, the bottom-up motion has 3 specific constraints:

1. The "it works" moment requires wiping or dual-booting a real machine, which raises the cost of the Land stage far above SaaS norms (source: https://www.pmsynapse.in/blog/bottom-up-plg-selling-through-developers, jev weight 0.24, weak backing).
2. The hardware component means the free tier is genuinely free (open code) but the root of trust itself is a purchase, so the individual tier carries unit revenue that software-only PLG lacks.
3. Enterprise procurement expectations reappear at the top of the pyramid, so the bottom-up motion must be paired with a top-down path for organizations, not assumed to convert on its own.

The honest summary: bottom-up adoption is the documented default for developer tools, but its stage model assumes low-cost activation. Products whose activation requires repartitioning a disk or buying a key inherit a slower Land stage and should measure the funnel accordingly rather than importing SaaS benchmarks.
