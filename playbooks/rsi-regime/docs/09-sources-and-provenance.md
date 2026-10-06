# 09 - Sources and provenance

**Scope:** the external and internal sources the source doc cites for its mathematics, and what each actually establishes.

The source doc's Sources section (yubi-OS/yubiOS playbooks/rsi-regime.md) lists 4 entries. This doc records what each one is, what the open web says about it, and the one dated drift note the digs surfaced.

## Vogel 1979 and Saff-Kuijlaars 1997 (Fibonacci sphere)

The source doc cites both names for the Fibonacci sphere. The web record:

- The Vogel model: Hermann Vogel's 1979 model places floret n at angle theta and radius r proportional to sqrt(n), with the divergence angle being the one occurring in nature (https://en.wikipedia.org/wiki/Fermat%27s_spiral, weight 0.62, which cites Vogel 1979 directly for the full model). The Vogel spiral is the discrete arrangement r_n = c*sqrt(n), theta_n = n*alpha (https://mathworld.wolfram.com/VogelSpiral.html, weight 0.68). The regime uses phi_golden = (1+sqrt(5))/2 as its alpha and forbids the pi and (1+sqrt(5))/2*pi variants without renaming (source doc hard rule 1).
- Saff-Kuijlaars: E. B. Saff and A. B. J. Kuijlaars, "Distributing many points on a sphere", The Mathematical Intelligencer, published December 1, 1997, volume 19, pages 5 to 11 (https://link.springer.com/article/10.1007/BF03024331, weight 0.58). The paper's Semantic Scholar record connects spherical Fibonacci point sets to high-quality QMC sampling patterns for spherical integration (https://www.semanticscholar.org/paper/Distributing-many-points-on-a-sphere-Saff-Kuijlaars/61e0cc7213, weak backing, weight 0.48).

Drift note (2026-10-06, dig-sourced): the source doc dates Saff-Kuijlaars to 1997 without a venue. The Springer record places it in The Mathematical Intelligencer, volume 19, pages 5 to 11, December 1997, which is consistent with the source doc's year but adds the venue the playbook omits.

## NIST DLMF (spherical harmonics, Condon-Shortley)

The source doc cites NIST DLMF for the spherical-harmonics machinery. The DLMF is the NIST Digital Library of Mathematical Functions (https://dlmf.nist.gov/, weight 0.96), and its section 14.30 covers spherical and spheroidal harmonics, where Y_l^m are the surface harmonics of the first kind (https://dlmf.nist.gov/14.30, weight 0.91). The Condon-Shortley phase convention the regime freezes is the (-1)^m factor in the harmonics' definition (https://mathworld.wolfram.com/Condon-ShortleyPhase.html, weight 0.66), and DLMF is the authoritative reference the playbook names for it.

## The two y33 papers

The source doc cites two papers in the yubiOS repo itself: yubi-OS/yubiOS refs/y33-fibonacci-sphere-paper-method-equation-block-2026-08-07.md and yubi-OS/yubiOS refs/y33-fibonacci-sphere-paper-revised-passage-2026-08-07.md (source doc). These are internal records of the Y_3^3 = K sin^3 theta * cos(3 phi) basis work and are not independently verified here; the corpus treats the source doc's characterization of them as the record.

## learned-latent-curves-2026-08-06.tex

The source doc names learned-latent-curves-2026-08-06.tex as "the yubiOS paper this playbook operationalizes" (source doc). It is the internal theory document the regime implements; like the y33 papers it is internal, and its 2026-08-06 date places it one day before the playbook's initial codification.

## Changelog

The source doc records one changelog entry: 2026-08-07, initial playbook, codifying the regime from that session's work, with rsi-phi-skill added, the 384-D Fibonacci-sphere variant tested, and the keystone diagram built (source doc). This corpus was minted 2026-10-06 from that playbook text.
