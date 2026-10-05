# 06 - Claim boundaries: what a benchmark may and may not support

Scope: drawing explicit use-for and do-not-use-for boundaries on each benchmark so directional third-party data is never read as product evidence.

## The boundary table is the artifact

The core practice, codified in the internal reference doc, is a two-column boundary on every benchmark: what it is used for and what it must never be used for. The distinction that drives both columns is the one between directional evidence about an industry and evidence about a specific product. The reference doc states this separation outright: its benchmarks support pricing, commercialization, and market-framing language with directional third-party data, and are not evidence about the product itself. A benchmark with no recorded do-not-use-for column is an unbounded claim waiting to happen.

Three boundaries recur across the benchmark set:

1. Industry average vs customer outcome. A breach-cost average supports the argument that credential-phishing incidents are expensive industry-wide; it does not support any claim that a specific customer would avoid that dollar figure. A customer's avoided cost requires that customer's own baseline data.
2. Market direction vs revenue projection. Market-research growth figures support an order-of-magnitude growth argument; they do not support a specific revenue projection for one vendor, especially when vendor-to-vendor estimates diverge by 2 to 3 times for the same category.
3. Regulatory tailwind vs certification. NIST, CISA, and OMB guidance supports the argument that policy pushes toward phishing-resistant authentication generally; it never supports a claim that any specific product holds FIPS, FedRAMP, or any other certification. Certification claims require the certifying body's own listing.

## Qualification language as the enforcement mechanism

The regulatory analogy is instructive because it is formalized. In FTC environmental-marketing practice, the Code of Federal Regulations directs that where a general environmental benefit claim is made, marketers should use clear and prominent qualifying language that limits the claim to the specific benefit asserted, to prevent deception about the nature of the claim (16 CFR 260.4(c), https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-260/section-260.4, weight 0.95). Transposed to benchmark citations: a directional number must travel with a qualifier that states what it does not prove. "Phishing incidents cost an industry average of $4.8 million (IBM CoDB 2025)" is a qualified claim; "our key saves customers $4.8 million" is the unqualified form the boundary forbids.

Research-writing guidance makes the same move in a different register: bounded claims are claims limited to what the underlying design and data support, typically including the sample or context and avoiding universal or causal claims that are not justified (https://scispace.com/resources/writing-accurate-bounded-abstracts/, weight 0.23, weak backing). The mechanism generalizes: state the population, the source, and the edition, and the claim bounds itself.

Related legal context sharpens the stakes. Enforcement attention around third-party benchmarking information sharing means that even the act of benchmarking against third-party data can carry compliance review obligations, not just the marketing claims built on it (https://www.aoshearman.com/en/insights/doj-cracks-down-on-third-party-information-benchmarking, weight 0.34, weak backing). And ISO's brochure on misuse of third-party marks of conformity documents how implying conformity with requirements when none was certified is itself a recognized misuse class (https://www.iso.org/publication/PUB100461.html, weight 0.47, weak backing). Both are cautionary context, not citations for product claims.

## Single-benefit vs multi-benefit framing

Consumer-behavior research examines when marketers should feature a single product benefit versus multiple benefits and under what conditions each is preferred (https://www.sciencedirect.com/science/article/abs/pii/S0148296324006131, weight 0.84). The citation discipline implication is narrow but real: a benchmark supports the single claim it was collected for. Stretching one breach-cost figure to support several benefit claims (security, savings, compliance) multiplies the unbounded surface. One benchmark, one supported claim, one recorded boundary.

## Enforcement checklist

Before any external number ships in business material: the source class is recorded; the weight is recorded; the use-for column matches the sentence; the do-not-use-for column is checked; a qualifier names edition and population; and no certification implication rides on guidance documents. If any check fails, the claim is cut, not softened.

## Sources considered

| Source | URL | Weight |
|---|---|---|
| 16 CFR 260.4 general environmental benefit claims (eCFR) | https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-260/section-260.4 | 0.95 |
| Claiming single or multiple product benefits (ScienceDirect) | https://www.sciencedirect.com/science/article/abs/pii/S0148296324006131 | 0.84 |
| Planetary boundaries framework update (Science) | https://www.science.org/doi/10.1126/science.1259855 | 0.85 (off-topic) |
| Misuse definition (Merriam-Webster) | https://www.merriam-webster.com/dictionary/misuse | 0.69 (definitional only) |
| Privacy policy (Porsche Newsroom) | https://newsroom.porsche.com/en/privacy-policy.html | 0.62 (off-topic) |
| Avoid definition (Merriam-Webster) | https://www.merriam-webster.com/dictionary/avoid | 0.88 (definitional only) |
| DOJ third-party benchmarking enforcement (AO Shearman) | https://www.aoshearman.com/en/insights/doj-cracks-down-on-third-party-information-benchmarking | 0.34 (weak) |
| Misuse of third-party marks of conformity (ISO) | https://www.iso.org/publication/PUB100461.html | 0.47 (weak) |
| Bounded claims in research abstracts (SciSpace) | https://scispace.com/resources/writing-accurate-bounded-abstracts/ | 0.23 (weak) |
| Claims controls for commodity EACs (S3 Markets) | https://www.s3markets.com/blog/claims-controls-commodity-eacs-avoid-overclaiming | 0.23 (weak) |
| Honest marketing overclaiming (TikTok) | https://www.tiktok.com/@jkherbs_hq/video/7572583600210578696 | 0.05 (weak) |
| Biden junta (off-topic) | https://www.conservapedia.com/Biden_junta | 0.06 (weak) |
