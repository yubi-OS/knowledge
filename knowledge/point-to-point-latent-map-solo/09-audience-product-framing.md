# 09 Audience and product framing: the SMB skin as a deployment target, not the core

Scope: audience framing: the SMB self-serve "is my data structured or noise" skin (V3) as a deployment target on top of the /api/map output, kept out of the core mapping design.

## What V3 proposed and where it landed

The source record's V3 variation shifted audience: a Stable Orbit client drops any CSV or embedding dump and gets a null-standardized map with zero yubiOS vocabulary. It scored 14, tied with V1 and V5, but was not chosen as the core. The record's verdict is explicit: the SMB user does not care about the underlying ladders, they care about "is my data structured or noise," and that is a UX skin on the /api/map output. V3 is kept as the Stable Orbit deployment target, not the core (internal record).

## The audience the self-serve skin addresses

The self-serve analytics category exists for exactly this persona: platforms that let business users who are not data analysts or data engineers explore data directly (https://data-pilot.com/blog/self-service-analytics-tools/, weight 0.05, weakly backed). The category's pain is ad-hoc data requests that business users generate and that analysts must otherwise field one by one (https://www.holistics.io/blog/self-service-analytics/, weight 0.24, weakly backed). Comparison guides for self-service BI make the same frame, with "what works and what fails" as the evaluation axis (https://www.blazesql.com/blog/self-service-bi-tools, weight 0.08, weakly backed). An AI-analytics product listing describes the target as making data accessible to non-technical business users through self-service analytics (https://techreviewer.co/products/athenic-ai, weight 0.14, weakly backed). Every one of these is weakly backed in this dig, which is honest to report: the commercial literature is mostly vendor content, and the record's decision does not rest on it.

The record's phrase "is my data structured or noise" is a single-question product framing. That is closer to a diagnostic than an analytics suite: the skin answers one question per corpus rather than offering a workspace.

## Product-led growth framing of the same skin

V3's placement as a deployment target rather than a product line matches product-led growth mechanics. PLG tools are platforms that help SaaS companies use the product itself to drive acquisition, activation, retention, and expansion (https://www.guideflow.com/blog/product-led-growth-tools, weight 0.12, weakly backed), and interactive demos are the recognized PLG instrument for letting users experience value before signup (https://www.chameleon.io/blog/interactive-demos-product-led-growth, weight 0.29, weakly backed). A demo-platform selection guide states the underlying principle as buyer autonomy: self-guided interactive experiences replace gatekept demos (https://www.demofa.st/blog/product-led-growth-tools-demo-platform-selection/, weight 0.20, weakly backed). Developer-tool PLG examples include product tours from infrastructure companies (https://www.markepear.dev/examples/product-led-growth, weight 0.19, weakly backed). Under this lens, the static V5 sphere is the natural PLG artifact: a zero-install page a prospect can paste data into, which is also why the record keeps it despite scoring D=1 (internal record).

## Why the skin stays out of the core

The record's architecture decision is that V3 is a client of /api/map, not a modification of it (internal record). Two reasons justify the split.

First, vocabulary hygiene. The core module's artifacts carry map keys, binarization rules, theorem names, and certificate results. The SMB skin must translate these into user language, and a translation layer that lives in the core would leak yubiOS vocabulary into artifacts that external users share. Keeping the skin a separate consumer of the same JSON output keeps the core's artifacts stable for both audiences.

Second, claim surface control. The core's certificates are scoped by the identity-versus-measurement split; the skin's single question ("structured or noise") is a measurement judgment. The only honest bridge is for the skin to render the measurement-tier outputs (null z scores, PC1+PC2 gate results, the SD0 admissibility verdict) rather than assert its own conclusion, since the proof file disowns measurement claims (internal record). The skin inherits its honesty from the core's check tiers rather than making its own.

## Deployment target as a scope decision

Naming Stable Orbit as the deployment target makes V3 a distribution decision rather than a design one. The core module is the product; the deployment target decides who first sees it and in which skin. This ordering, core before skin, certificate before marketing, is consistent with the rest of the record: the pain the finalist attacks is claims outrunning evidence, and the audience layer is the last place that failure mode should be allowed back in (internal record).

## What remains open for the skin

The record leaves the skin's copy, thresholds for the "structured or noise" verdict, and the exact rendering of weak versus strong backing open; these are implementation decisions for the deployment, not design decisions for the map (internal record). The dig supports the category framing weakly (the sources above); no authoritative source contradicts the skin-over-core split, and none addresses proof-carrying corpus maps at all, which the record counts as the defensibility argument for the core (internal record).
