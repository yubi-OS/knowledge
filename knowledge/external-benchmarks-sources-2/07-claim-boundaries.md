# Claim boundaries

Scope: the directional benchmark versus product evidence boundary: what it supports and do not use for pairs, misuse patterns, and per claim validation notes.

## The core distinction

A benchmark can be two different things, and the register separates them explicitly. A directional benchmark is evidence about an industry, a category, or a regulatory environment: breach costs, market growth, regulatory direction. Product evidence is evidence about the specific product: its measured performance, its certifications, its customer outcomes. Third party sources can supply the first; they can never supply the second unless they actually measured the product. The register operationalizes this with a paired statement on every benchmark row: "What it supports" names the directional claim the source backs, and "Do not use for" names the product specific claim it does not back.

## Why the boundary is absolute in this register

The product in this register has zero customers. That makes the misuse patterns mechanically detectable rather than judgment calls:

- Any "market share" claim for the product is false by arithmetic, not by citation error. A share of a market requires customers; zero customers means zero share, regardless of what any benchmark says.
- Any "customers save X dollars" claim imported from an industry average is a substitution of population mean for individual outcome. The IBM breach cost average describes 600 breached organizations (per the 2025 report primary PDF, https://www-api.ibm.com/adobe/assets/urn:aaid:aem:75bd923e-e263-40c0-b62b-4b43da492394/original/as/cost-of-a-data-breach-report-2025.pdf, weight 0.8774, primary), not any particular future customer.
- Any "certified against standard S" claim requires certification evidence that exists nowhere in the register's passes for the product itself, even though the standards body sources themselves are strong (NIST SP 800-63B revision 4, https://pages.nist.gov/800-63-4/sp800-63b.html, weight 0.9059, primary).

## Claim to source alignment as a general discipline

External writing on citation practice converges on the same requirement, that the cited source actually supports the specific claim attached to it:

- A citation claim techniques reference discusses examining whether citations genuinely support the claims they are attached to, rather than merely that they exist (https://seandavi.github.io/scriptorium/concepts/knowledge/critique-techniques/citation-claim-alignment/, weight 0.7420, moderately to well backed practitioner reference).
- A replication stamp service exists to mark computational work whose claims can be independently reproduced, a transparency mechanism built on exactly this alignment requirement (https://www.replicabilitystamp.org/, weight 0.8063, well backed).
- A claim boundaries guidance page frames writing claims with explicit boundaries around what the evidence does and does not cover (https://www.eviwrite.com/guidance/framework/claim-boundaries/, weakly backed, weight 0.2853).
- Advertising claim substantiation research practice emphasizes that every claim in market facing material must trace to evidence in a file before publication (https://imslegal.com/asset/68a359d500397/IMS-Claim-Substantiation-Research_2508.pdf, weakly backed, weight 0.4643).
- A marketing evidence framework distinguishes substantiation from mere citation, requiring a dossier behind each claim (https://veritypress.ai/blog/substantiation-vs-citation-evidence-dossier-ai-marketing-claims, weakly backed, weight 0.1124).
- Citation benchmarking metrics in academic publishing measure a work against comparison sets, a reminder that a benchmark without a defined comparison basis is meaningless (https://libguides.asu.edu/citation/citationbenchmarking, weight 0.8191, well backed for its own subject).

## Validation notes as boundary enforcement

The register's validation gate (checklist item 3) is where boundaries get tested against reality. The live example: a worksheet figure (the 25 dollar hardware floor) could not be reconciled against the primary retail source across two passes, so it was flagged to its owner rather than silently corrected (see 05-hardware-cost-validation.md). The same discipline applies to boundaries: when a downstream document reaches for a benchmark to support a product claim, the correct response is to flag the reach as out of scope, not to soften the wording until it vaguely fits.

## Failure modes this boundary prevents

1. Benchmark inflation: citing an industry figure in a context that reads as a product claim. Prevented by the paired statement.
2. Silent drift: a number gradually losing its caveats as it moves between documents. Prevented by requiring every downstream citation to reference the register row, which carries the caveats.
3. Certification borrowing: implying proximity to a certification because the standard's source is strong. The strength of the NIST and OMB sources is about the standards, not about the product.
4. Zero customer contradictions: claims like "adopted by teams" or "trusted in production" that conflict with the register's own recorded customer count.
