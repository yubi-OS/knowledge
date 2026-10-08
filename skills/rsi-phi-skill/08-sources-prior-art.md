# 08 Sources and prior art

Scope: the founding literature behind rsi-phi-skill, the in-repo papers it is built on, and the sibling skills it composes with.

## The two founding papers

Vogel 1979. The source doc (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/rsi-phi-skill/SKILL.md) cites H. Vogel (1979), A better way to construct the sunflower head, as the origin of the golden-angle sampling. The dig confirms the paper exists at that title in Mathematical Biosciences (https://www.sciencedirect.com/science/article/abs/pii/0025556479900804, weak, w=0.43), and a bibliography entry records the full reference as Mathematical Biosciences 44 (3-4): 179-189 (https://zonnebloemen.com/en/biology/fibonacci/, weak, w=0.16). Both are below the 0.5 bar, so treat the volume and page numbers as weakly backed; the title and journal are consistently reported across sources.

Saff and Kuijlaars 1997. The source doc cites E.B. Saff and A.B.J. Kuijlaars (1997), Distributing many points on a sphere, Mathematical Intelligencer 19(1), 5-11. The dig confirms the article at Springer (https://link.springer.com/article/10.1007/BF03024331, weak, w=0.47), and the Spherical Designs citation lists in an open-source sphere-partitioning toolbox reproduce the exact volume, issue, and pages: v19 no1 (1997), pp. 5-11 (https://eqsp.sourceforge.net/, weak, w=0.34). A mirror PDF on Academia.edu summarizes the asymptotic result that optimal configurations of N points on a sphere resemble hexagonal patterns with 12 pentagonal exceptions (https://www.academia.edu/23950259/Distributing_many_points_on_a_sphere, weak, w=0.22).

NIST DLMF. The source doc names dlmf.nist.gov as the standard convention reference for the Condon-Shortley normalization of Y_3^3 (source doc). The dig did not surface a DLMF page directly; this attribution stands as a source-doc claim.

## The two in-repo papers (internal record)

The skill is built on two refs documents in yubi-OS/yubiOS (source doc; internal-record subtopic, no dig needed):

- refs/y33-fibonacci-sphere-paper-method-equation-block-2026-08-07.md: the 3-equation LaTeX block that maps the paper's latent curve c(t) onto S2 via Fibonacci sampling and Y_3^3 modulation.
- refs/y33-fibonacci-sphere-paper-revised-passage-2026-08-07.md: the table-based revised passage patch for the paper's hyperspherical-harmonic section.

## The sibling skills

The source doc names 7 skills in the yubiOS tree and their roles (source doc):

| Skill | Role |
|---|---|
| recursive-self-improvement | Parent skill; this skill is its Fibonacci-sphere variant |
| hyperspherical-harmonic-curve | The S2 basis swap; this skill inherits its S2 to gamma(t) math |
| learned-latent-curve | The curve fitter; the gamma(t) closed-form ridge is the same |
| single-action-curve-rsi | The atomic atom; usable for the per-cycle hypothesis step |
| negative-skill-space | The 12-axis gap-mapper; cycle 1 starts here |
| parallel-deep-research | Per-cycle deep-research subagent dispatch |
| doubt-driven-development | Per-hypothesis supplement in self-mode |

Cross-references in the source doc add curve-guided-rsi as the loop the 3-cycle default cap is inherited from, and name the refs corpus at yubi-OS/yubiOS/refs/ as the primary corpus the skill operates on (source doc).

## Prior-art gap

No dig result describes a recursive self-improvement loop parameterized on a Fibonacci-sampled sphere. The closest external analogues are generic: Wikipedia's RSI article on self-rewriting systems (https://en.wikipedia.org/wiki/Recursive_self-improvement, weak, w=0.28), the arXiv survey on bounded self-refinement as the low end of the RSI autonomy continuum (https://arxiv.org/html/2607.07663v1, weak, w=0.29), and the sphere-sampling literature above. The parameterization itself (i = t, Y_3^3, 384 lobes, dual ordering gate) has no public prior art found in this dig; the honest reading is that its provenance is the two in-repo y33 papers, and the external literature supplies only the components (golden-angle sampling, spherical harmonics, RSI loops) it composes.
