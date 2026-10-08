# 04 Azimuthal lobe extension to 384

Scope: extending the native 3-fold probe to 384 azimuthal lobes via m = 3k, the dual (l, m) parameterization test, and the PCA top-2 gate that picks the winner.

## From one lobe to 384

The source doc (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/rsi-phi-skill/SKILL.md) defines the per-item basis vector b_i as a 384-dimensional vector whose components are sin^3 theta_i cos(m phi_i) lobes, with m = 3k for k = 1, 2, ..., 128, so m ranges over {3, 6, 9, ..., 384}. The cos(384 phi) lobe is the high-resolution extension that keeps the sin^3 theta polar factor; 384 factors as 2^7 times 3, which is what makes the 384-fold structure symmetric with the native 3-fold probe (source doc).

The user tests BOTH orderings (l=128, m=256) and (l=256, m=128) and reports which passes the gate (source doc). For 384 lobes with (l, m) SH-pairs, 192 lobes use (l=128, m=256) and 192 use (l=256, m=128); in that form the sin^3 theta polar factor is replaced by sin^l theta (source doc).

## The gate: PC1 + PC2 under both orderings

Constraint 5 makes the dual test mandatory: both orderings must be tested in the cycle's parameterization step, and the gate is the higher PC1+PC2 of the two, because the sparse-cell signal picks which order loses less information (source doc). The cycle parameterization table sets the defaults: l defaults to 3 (native), alternates 128 and 256; m defaults to 3, alternates 256 and 128; sample count N defaults to len(corpus) with alternates 256, 384, and 1024; modulation amplitude alpha defaults to 0 with alternates 0.1 and 1.0 (source doc).

## Why the coverage delta is the primitive

By construction every basis vector is non-zero (Fibonacci sampling never lands on a zero of cos(m phi)), so raw per-item primitive coverage saturates at 384/384 for every item and carries no signal (source doc). The interesting primitive is the per-item coverage delta: which lobes the item's content activates under the SH projection (source doc). This is why the skill's cycle-1 example from its own changelog mattered: the hypothesis said the native (l=3, m=3) basis under-fills the 384-D basis, the edit added the (l, m) lobe enumeration, and the re-map showed new sparse cells at m in {6, 12, ..., 384}, so fixpoint was not reached and cycle 2 was required (source doc).

## External grounding on degree and order

Spherical harmonics carry two indices, degree l and order m, and MathWorld defines Y_l^m as the angular part of Laplace's-equation solutions in spherical coordinates (https://mathworld.wolfram.com/SphericalHarmonic.html, high, w=0.54, 0.58, 0.60 across three dig queries). Wikipedia's article places them as basis functions for the irreducible representations of SO(3) (https://en.wikipedia.org/wiki/Spherical_harmonics, weak, w=0.38). The MRtrix3 documentation discusses maximum spherical harmonic degree lmax as the practical resolution knob and notes the zonal basis containing only m=0 terms as a degenerate case (https://mrtrix.readthedocs.io/en/latest/concepts/sh_basis_lmax.html, weak, w=0.38), which is useful context for why an azimuthal-order sweep (varying m) is a different axis than a degree sweep (varying l). A spherical PCA paper on arXiv treats principal components on the sphere directly (https://arxiv.org/pdf/1903.06877.pdf, weak, w=0.43), which grounds the PCA top-2 step in prior art, weakly.

All of the lobe-enumeration specifics (384 = 2^7 times 3, m = 3k, the 192/192 split, the PC1+PC2 gate) are source-doc claims with no external counterpart found; the dig literature discusses degree and order generally, never this parameterization. Label any external claim here weak.
