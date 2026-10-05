# Evidence Boundaries: What a Pre-Proven Product Can Claim

Scope: Defining and maintaining an evidence boundary. What a pre-product security infrastructure project can claim publicly, and how to keep every claim traceable to what is actually proven today.

An evidence boundary is a written, dated statement of what a product can currently back up with proof, used as a hard constraint on all external messaging before the product is proven. The practice exists because security infrastructure products are bought on trust, and trust is destroyed fastest by claims the vendor cannot demonstrate on request.

## The core mechanism

An evidence boundary is maintained as a living artifact, not a one-time memo. In the yubiOS days 0 to 30 plan, the boundary is a blocker list reviewed on a fixed date (last reviewed 2026-07-22), where each row is a capability that is not yet proven and each row implies a specific messaging restriction. For example, if hardware boot attestation is not proven on real boards, the boundary forbids calling the product production-ready on that hardware, in any channel. This pattern is generalizable: the boundary artifact has three parts: the proven-today list (what demos and evidence exist), the unproven list (what is in progress, with the specific gap named), and the implied message rules (which claims each unproven row forbids).

## Why vague security claims backfire

Analysis of security product marketing argues that vague security language trains buyers to accept confidence instead of evidence, and that the corrective is precise communication about what a product actually does and does not do ([attomus.com, weight 0.33, weak backing](https://attomus.com/blog/2026-the-wrong-way-to-market-a-security-product/)). This matters most early, before a product has a track record: at that stage the only differentiator available is honesty about the boundary, since no customer reference or uptime history exists yet.

Research into fear-based cybersecurity marketing finds that marketing which leans on fear rather than demonstrated protection can leave consumers less secure, because it displaces accurate risk assessment ([iastate.edu research announcement, weight 0.48, weak backing](https://research.iastate.edu/2025/01/07/selling-fear-marketing-for-cybersecurity-products-often-leaves-consumers-less-secure/)). For an infrastructure product whose buyers are engineers, the implication is direct: claims should map to verifiable mechanisms, not to threat imagery.

## The reputational cost of overclaiming

Guidance for security-industry product launches treats reputation management as a launch prerequisite: companies eyeing product launches must prioritize reputation management or risk losing credibility before they gain market traction ([securityinfowatch.com, weight 0.54, authoritative backing](https://www.securityinfowatch.com/security-executives/article/55305389/how-to-mitigate-the-reputational-risks-of-a-bad-product-launch)). The failure mode is asymmetric: an overclaim made during days 0 to 30 is cheap to make and expensive to retract, because early prospects become the reference base for later sales. A retraction at that stage poisons the exact asset the company needs most.

## Building the boundary in practice

Pre-launch content guidance converges on the same structure: publish what you know, name what you do not know yet, and build the audience on the learning process itself rather than on finished-product promises ([relato.com, weight 0.45, weak backing](https://www.relato.com/blog/content-strategy-for-pre-launch-startups-what-to-say-before-youre-ready-to-sell/)). Concretely, an evidence boundary discipline looks like:

1. One dated artifact. A single document lists proven capabilities, unproven capabilities with named gaps, and the date of last review. All messaging inherits from it.
2. Claim-to-evidence mapping. Every external claim traces to a row on the proven list. Claims with no row are deleted, not softened.
3. Explicit unproven labeling. Capabilities in progress get a standing label (for example, Technical Preview) applied consistently in every channel, not just in fine print.
4. Review cadence. The boundary is re-reviewed whenever a blocker closes or opens, because a stale boundary overclaims by omission.

## What this buys

The payoff of an evidence boundary is that the company can discuss the offer with prospective customers at all. Without a documented boundary, every conversation carries a hidden legal and reputational risk that a claim will turn out to be unsupported, which pushes teams toward silence. With a boundary, the safe surface area for discussion is explicit: everything inside it can be discussed freely, everything outside it is either labeled in-progress or left unsaid. This converts a vague caution ("be careful what you promise") into an operational rule that non-founder employees can follow without judgment calls.
