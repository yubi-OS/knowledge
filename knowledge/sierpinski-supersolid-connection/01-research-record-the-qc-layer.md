# 01. Research record (the QC layer)

**Scope:** Research record (the QC layer): detailed analysis grounded in yubi-OS/yubiOS refs/sierpinski-supersolid-connection-2026-10-06.md.

## Why the research record matters

The ground source (yubi-OS/yubiOS refs/sierpinski-supersolid-connection-2026-10-06.md, dated 2026-10-06) is a connection-research document: an ideate-solo one-pager followed by 3 parallel research lanes (supersolid state of the art, prior art, instrument mapping). Before any finding is stated, the document records how its evidence was gathered and filtered. This "QC layer" is what lets a reader judge every later claim, because it says which sources survived qualification and which did not.

## The pipeline, in numbers

The source states the funnel exactly:

- **15 searXNG queries** run through the searxng proxy.
- **83 unique results** returned.
- **77 results qualified** by `/api/decide` (clef), using a per-result noul relevance question plus a 5-level source-quality score, batched 12 questions per request at 5 s spacing.
- **54 results kept** at relevance >= 0.5.

So 6 results (83 minus 77) were not qualified in the first pass, and 23 qualified results (77 minus 54) were dropped for relevance below 0.5. Each lane section then reports kept sources with a (relevance, quality) pair, for example the Nat Rev Phys supersolidity review at (.98/3.67).

## Redo, not degrade

One decide batch returned 502 upstream (a clef inference error). The source records that a REDO round re-ran the affected prior-art queries with a 3-attempt retry per batch, per the redo-not-degrade rule. The point of the rule is that a decision-model failure is never allowed to produce unweighted evidence. Results either get weighted on retry or they do not enter the record.

## How this corpus's own dig compares

This corpus mint ran its own 2-query searXNG dig for this subtopic, weighted by clef noul. It reproduces the same pattern the QC layer is designed to catch: strong primary sources mixed with off-topic noise.

The primary-source hits weight high. The Nature 2025 photonic-crystal polariton supersolid paper is the top result [Emerging supersolidity in photonic-crystal polariton ... - Nature](https://www.nature.com/articles/s41586-025-08616-9) (clef weight: 0.9688), with its PDF copy close behind [PDF Emerging supersolidity in photonic-crystal polariton condensates - Nature](https://www.nature.com/articles/s41586-025-08616-9.pdf) (clef weight: 0.8423). The arXiv preprint of the same work, 2407.02373, which the source cites in Lane 1, also weights high [[2407.02373] Emerging supersolidity from a polariton condensate in...](https://arxiv.org/abs/2407.02373) (clef weight: 0.9169). A 2025 arXiv paper on thermally assisted supersolidity in a dipolar BEC, describing supersolidity as "the coexistence of crystalline density modulation and global phase coherence" [Thermally Assisted Supersolidity in a Dipolar Bose-Einstein Condensate](https://arxiv.org/html/2510.24419v1) (clef weight: 0.8655), and a Physical Review Research study of self-bound dipolar droplets and supersolids in molecular BECs [Self-bound dipolar droplets and supersolids in molecular Bose-Einstein ...](https://journals.aps.org/prresearch/pdf/10.1103/PhysRevResearch.4.013235) (clef weight: 0.8285) round out the authoritative set.

The noise weights low, exactly as the relevance cut intends. An accounting-schools page [Best Accounting Schools in New York](https://www.accounting.com/states/new-york/) (weak backing, clef weight < 0.5; clef weight: 0.0194) and the Polariton Wikipedia entry [Polariton - Wikipedia](https://en.wikipedia.org/wiki/Polariton) (weak backing, clef weight < 0.5; clef weight: 0.0530) sit near zero. Encyclopedia and wiki overviews (the BEC Wikipedia article [Bose–Einstein condensate - Wikipedia](https://en.wikipedia.org/wiki/Bose%E2%80%93Einstein_condensate) (weak backing, clef weight < 0.5; clef weight: 0.1304) and a handwiki page on superfluid helium-4 [Superfluid helium-4](https://handwiki.org/wiki/Physics:Superfluid_helium-4) (weak backing, clef weight < 0.5; clef weight: 0.2237)) are relevant background but are not primary sources. An institutional highlight page from CNR Nanotec summarizing the polariton result [Emerging supersolidity from a polariton condensate in a photonic ...](https://nanotec.cnr.it/highlights/emerging-supersolidity-from-a-polariton-condensate-in-a-photonic-crystal-waveguide/) (weak backing, clef weight < 0.5; clef weight: 0.1436) is a secondary restatement and weights low even though its content agrees with the primary paper.

The takeaway: 5 of 10 results in this dig clear 0.5, and all 5 are journal or preprint primaries. That is the same discrimination the source's 0.5 relevance cut performs.

## The sourcing error the QC layer caught

The source records one error honestly in Lane 2: arXiv 1309.2061 was kept at relevance .51 as "ultracold atoms in optical lattices" but is actually a withdrawn 2013 superlattice preprint, mislabeled upstream. It was excluded from the evidence base. This is the QC layer working as a second check: a relevance score just above threshold did not protect a source whose content turned out to be wrong.

## Known gaps in the record

The source states two coverage caveats:

- **Four APS/arXiv-hosted sources did not load** during Lane 1. The negative finding (no fractal or box-counting supersolid diagnostic) is therefore stated as confirmed at review level: the review sources that would have surfaced such a method contain none.
- **Norcia Nature 596, 357 (2021)** is named as the community reference for in-situ droplet images but was "not figure-verified by the lane." Addendum 6 later extracts Fig. 2b directly from the arXiv PDF, closing this gap.

## Where the full record lives

The full kept-source table with (relevance, quality) weights is inline in the lane sections. The decide state string and query list are reproduced in the session QC log at `session/supersolid/`. Readers verifying a claim should start from the lane table entry and its pair of weights.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Self-bound dipolar droplets and supersolids in molecular Bose-Einstein ... | https://journals.aps.org/prresearch/pdf/10.1103/PhysRevResearch.4.013235 | 0.8285 | authoritative (>= 0.5) |
| 2 | Bose–Einstein condensate - Wikipedia | https://en.wikipedia.org/wiki/Bose%E2%80%93Einstein_condensate | 0.1304 | weak (< 0.5) |
| 3 | Thermally Assisted Supersolidity in a Dipolar Bose-Einstein Condensate | https://arxiv.org/html/2510.24419v1 | 0.8655 | authoritative (>= 0.5) |
| 4 | Superfluid helium-4 | https://handwiki.org/wiki/Physics:Superfluid_helium-4 | 0.2237 | weak (< 0.5) |
| 5 | Best Accounting Schools in New York | https://www.accounting.com/states/new-york/ | 0.0194 | weak (< 0.5) |
| 6 | [2407.02373] Emerging supersolidity from a polariton condensate in... | https://arxiv.org/abs/2407.02373 | 0.9169 | authoritative (>= 0.5) |
| 7 | Emerging supersolidity in photonic-crystal polariton ... - Nature | https://www.nature.com/articles/s41586-025-08616-9 | 0.9688 | authoritative (>= 0.5) |
| 8 | Polariton - Wikipedia | https://en.wikipedia.org/wiki/Polariton | 0.0530 | weak (< 0.5) |
| 9 | PDF Emerging supersolidity in photonic-crystal polariton condensates - Nature | https://www.nature.com/articles/s41586-025-08616-9.pdf | 0.8423 | authoritative (>= 0.5) |
| 10 | Emerging supersolidity from a polariton condensate in a photonic ... | https://nanotec.cnr.it/highlights/emerging-supersolidity-from-a-polariton-condensate-in-a-photonic-crystal-waveguide/ | 0.1436 | weak (< 0.5) |
