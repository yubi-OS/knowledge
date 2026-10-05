# Trademark and non-affiliation boundaries in honest project claims

Scope: non-affiliation and trademark boundaries as part of the honest-claims surface: explicit disclaimers that a project is not affiliated with or endorsed by a trademark holder, independent of blocker status.

## A different class of claim

Most evidence boundaries say "not yet proven." Trademark boundaries say "never true." The yubiOS evidence-boundary snapshot (OMN-68, 2026-07-25) carries the non-affiliation claim in its reusable external summary: "yubiOS is not affiliated with or endorsed by Yubico." This claim is off-limits not until some blocker closes but permanently, because it is false regardless of evidence state, and the name similarity (yubiOS versus Yubico) makes confusion likely rather than hypothetical. The snapshot grounds the disclaimer in two sibling documents: the pilot collateral doc (OMN-84, PR #113), which already flags the non-affiliation notice, and the naming, licensing and provenance doc (OMN-81, PR #114), which flags the trademark question.

## Why the disclaimer is structural, not cosmetic

Trademark use in open source creates an inference of association. A trademark policy from the Cartesi Foundation states the mechanism plainly: use of the marks suggests an "official" link between your product or service and the foundation or its open-source project, and prohibited uses include using the marks as part of the name of a company, organization, or trade name (https://cartesi.io/trademark-usage-policy/, weight 0.89, primary). A project whose name embeds another's mark (yubiOS and Yubico share the "yubi" prefix) sits squarely inside the association-inference zone.

Meta's open-source trademark policy explains the lawful counter-move: trademark law allows "nominative fair use," meaning third parties may use a trademark to identify the trademark holder's software or projects, so long as such use (1) cannot be readily identified without using the trademark, and (2) does not suggest sponsorship or endorsement (https://opensource.fb.com/legal/trademark/, weight 0.79, primary). Condition (2) is the operative one for this corpus: nominative use licenses naming the thing, never implying a relationship with it. An explicit non-affiliation disclaimer is the cheapest way to satisfy condition (2).

Google's open-source casebook treatment of trademarks in open source extends the point to licensor control: a project that wishes to permit use of its marks in some circumstances must think about how the licensor maintains contractual or actual control over those uses (https://google.github.io/opencasebook/trademarks/, weight 0.71, primary). From the recipient's side, the symmetric discipline is to assume no permission exists until the holder states it.

## What a compliant claims surface looks like

For a project whose name alludes to a trademark holder's brand, the honest-claims surface includes:

1. A standing non-affiliation and non-endorsement disclaimer, stated in the same words in every external document. The yubiOS snapshot puts one sentence in the reusable summary; the pilot collateral repeats it.
2. No use of the holder's marks in ways that imply endorsement: no logos, no "powered by," no "official," no combined branding.
3. Nominative use only where technically necessary: referring to the holder's product when describing compatibility is lawful and honest; styling the reference as a partnership is neither.
4. A trademark-status note in the project's naming and licensing documentation, recording whether the holder's mark is registered and whether any permission has been sought. The USPTO is the primary registry for US trademark status (https://www.uspto.gov/trademarks, weight 0.82, primary).

The Xen Project's community documentation illustrates the ecosystem norm from the holder side: long-running open source projects maintain explicit usage norms for their names and marks (http://wiki.xen.org/wiki/Xen_Best_Practices, weight 0.77, secondary).

## Evidence boundary implications

The non-affiliation line interacts with the rest of the evidence boundary in two ways. First, it is evidence-independent: no CI run, pilot, or blocker closure changes it. Governance lists should therefore mark affiliation claims as "never" rather than assigning them a gate, as discussed in the off-limits-claims doc in this corpus. Second, it is reputational amplification: an overclaimed technical statement damages credibility when challenged, but a false affiliation claim can draw legal exposure independent of technical honesty. The snapshot's decision to include the disclaimer in the reusable external summary (rather than burying it in legal docs) reflects that asymmetry.

Secondary sources cover the trademark-for-open-source landscape at lower rigor: a blog guide to protecting a brand in open source, forks, and naming (https://www.termsfeed.com/blog/open-source-trademark/, weight 0.33, weak), a Wikipedia article on nominative use as the underlying doctrine (https://en.wikipedia.org/wiki/Nominative_use, weight 0.26, weak), a maintainer-oriented trademark management resource (https://www.fosshub.com/resources/maintainers/trademarks/, weight 0.21, weak), and a legal-explainer piece on trademark use in open source projects (https://credenmark.com/trademark-use-in-open-source-projects/, weight 0.16, weak). These are consistent with the primary sources above but add no independent authority, and this corpus labels them weak.

One observation for maintainers: the strongest sources on this topic are policies written by the trademark holders themselves (Cartesi, Meta) and casebook material, not intermediaries. When in doubt about a specific use, the holder's own published policy outranks any secondary guide.
