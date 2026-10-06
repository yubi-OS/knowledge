# 03 - The Fibonacci lattice and the real spherical-harmonic basis

Scope: the frozen math conventions that define where corpus items sit and what basis the planted curve is expressed in.

Source of record: yubi-OS/yubiOS skills/curved-corpus-create/SKILL.md. External mechanisms named by the doc (Fibonacci sphere sampling, real spherical harmonics) are grounded by the dig; most results came back weak and are labeled.

## The Fibonacci golden-angle lattice

The lattice is fixed by two formulas [source doc]: z_i = 1 - (2i+1)/N and phi_i = 2 pi i / phi_g with phi_g = (1+sqrt 5)/2. Item i's latitude comes from equal steps in z, and its longitude from successive golden-angle rotations. Independent work on Fibonacci and related equal-area sphere point sets reports that such lattices spread points near-uniformly and support stable quadrature on the sphere [weak backing: https://arxiv.org/pdf/0912.4540, jev weight 0.39].

The convention i = t is frozen [source doc]: the Fibonacci index IS the parameter. Nothing else in the pipeline may be reinterpreted as the parameter t. This is what makes "azimuthal" claims meaningful, because longitude phi_i is a deterministic function of the index.

## The real spherical-harmonic basis

The basis is the real SH basis with an explicit Legendre plus cos/sin split [source doc]. At L = 3 there are 16 functions, with column order (0,0),(1,-1),(1,0),(1,1),...,(3,3). The real basis trades the complex conjugate pairs of the classical basis for cos(m phi) and sin(m phi) factors at fixed Legendre latitude structure; the SHTOOLS reference implementation documents the same real-form convention [weak backing: https://shtools.github.io/SHTOOLS/real-spherical-harmonics.html, jev weight 0.49]. The general spherical-harmonic apparatus (orthogonal functions on the sphere indexed by degree l and order m) is standard material [weak backing: https://en.wikipedia.org/wiki/Spherical_harmonics, jev weight 0.29].

## Frozen downstream conventions

Four conventions are inherited frozen from the regime and may not be renegotiated per run [source doc]:

1. PCA top-2 to stereographic lift from the south pole to S^2, with identity-init Mobius (a=d=1, b=c=0).
2. Closed-form ridge C* = (Phi^T Phi + lambda I)^-1 Phi^T Z with lambda = 1e-3.
3. Chordal S^2 residuals for the per-item gap-to-curve.
4. Gate PC1+PC2 >= 0.40, which is REPORTED, NEVER TRUSTED ALONE.

## The corrected Y_3^3 constant

The real-form Y_3^3 used across the regime is Y_3^3 = K sin^3(theta) cos(3 phi) with K = sqrt(70/(64 pi)) = 0.5900435... (real-orthonormal) [source doc]. The legacy K = sqrt(245/(64 pi)) = 1.1038699... is WRONG; the legacy value equals sqrt(7/2) times the real value [source doc]. New work MUST use the real-orthonormal K. This correction is dated in the source doc and is not a dig result; it is part of the frozen conventions.

## Why the lattice matters to the statistics

The lattice is not an implementation detail; it is what makes the regime's parameter meaningful. Because z_i = 1 - (2i+1)/N steps evenly in z and phi_i rotates by the golden angle each step, consecutive items sweep the sphere without clustering in longitude. The convention i = t (the Fibonacci index is the parameter) means the item ordering IS the azimuthal coordinate [source doc]. This is why guideline 8 requires an ordering-permutation null for any azimuthal claim: if the claim depends on the phi_i ordering, a null that permutes the ordering tests exactly that dependence [source doc].

## Column order is part of the frozen contract

The 16 functions at L = 3 are ordered (0,0),(1,-1),(1,0),(1,1),...,(3,3) [source doc]. The order matters because generate takes the first modes channels starting from channel 0, and channel 0 is always Y_3^3 [source doc]. Reordering the basis would silently change which structure is planted.

## The design matrix in measure

The same 16 functions form the design matrix Phi in the ridge fit C* = (Phi^T Phi + lambda I)^-1 Phi^T Z [source doc]. measure reports design_numrank and design_cond for this matrix; the red-flags table treats design_numrank < 16 as "the SH design collapsed" [source doc]. A collapsed design means the fit is under-determined and sphere R^2 stops meaning anything.
