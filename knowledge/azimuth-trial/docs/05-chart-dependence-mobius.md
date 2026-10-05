# 05. Chart dependence: the identity chart versus fitted lenses

Scope: why the same corpus can be blind on one coordinate chart and strongly structured on another, the identity-versus-loxodromic result in the azimuth record, and what PSL(2, C) lenses actually are.

## The empirical core of the record

Every measurement in the azimuth trial was taken at the identity Moebius chart, the default coordinate chart of the placement plane (source record: azimuth-trial-2026-09-19, section 5). At that chart, the corpus audit measures the l = 3 angular share below its null: J = -1.51, share 0.031 against 0.074 +/- 0.028 (source record, section 5, citing curved-corpus v2 section 8). The trial's headline conclusion follows from this: the chart is the one element of the failure story that was never tested, and it is the only one with prior positive evidence.

The prior positive evidence is the powered-lens result. Under an optimized loxodromic chart, the same corpus reaches share 0.408 against a collapsed null of 0.0345 +/- 0.0030, a delta J of +126.1, against a selection null with median +5.1 and max +25.5 (source record, section 5). The record compresses this into the governing sentence: "Admission is chart-dependent. The coordinate that fails under the frozen chart is precisely what the powered lens separates."

## What a chart is, and what the lens family is

A coordinate chart is a choice of how a space is parametrized. On the sphere and its relatives, Moebius transformations are the natural family of chart reparametrizations: fractional linear transformations that are one-to-one maps of the extended complex plane, which is the Riemann sphere under stereographic projection ([Cut-the-Knot: Riemann Sphere and Moebius Transformation, w 0.57](https://www.cut-the-knot.org/arithmetic/algebra/RiemannSphere.shtml)). The special linear group over the reals gives the orientation-preserving part of this family in one dimension, and its projective quotient PSL(2, R) acts on the extended real line and hyperbolic plane ([Wikipedia: SL2(R), w 0.75](https://en.wikipedia.org/wiki/SL2(R))). Over the complex numbers, PSL(2, C) is the group of orientation-preserving isometries of hyperbolic 3-space and the full Moebius group of the Riemann sphere; it has six real degrees of freedom, four from the matrix up to scale and the quotient removing one complex degree ([John O. Dvorak lecture notes: The Geometry of Moebius Transformations, w 0.52](http://johno.dk/mathematics/moebius.pdf); [Jaikrishnan lecture notes on constructing Moebius transformations, w 0.39, weak](https://jaikrishnanj.github.io/MA5360/files/mobius.pdf)).

The trial's reignition path 1 is exactly this: fit phi_theta in PSL(2, C) with its six real degrees of freedom, then measure the rotation-invariant statistics under the fitted chart (source record, section 6).

## Why the frozen chart can be blind

A spherical-harmonic decomposition of a field on the sphere reports angular power per l and m mode; the angular power spectrum is a standard analysis object across cosmology and geophysics ([Max Planck lecture: Power Spectrum, w 0.82](https://wwwmpa.mpa-garching.mpg.de/~komatsu/presentation/imprs2020-4.pdf); [MathWorld: Spherical Harmonic, w 0.74](https://mathworld.wolfram.com/SphericalHarmonic.html); [Brilliant: Spherical Harmonics, w 0.75](https://brilliant.org/wiki/spherical-harmonics/)). The l = 3, m = 3 harmonic has azimuthal angular dependence proportional to sin^3(theta) * cos(3 phi), making it the azimuthal member of the l = 3 shell (source record, section 5; standard harmonic form per [MathWorld: Spherical Harmonic, w 0.74](https://mathworld.wolfram.com/SphericalHarmonic.html)).

The failure of the identity chart is a measurement statement, not a data statement. At the identity chart the corpus's angular power at m = 3 is below null. Under a lens reparametrization the same corpus has share 0.408 against a collapsed null. The structure did not appear when the chart changed; it became measurable. This is the same distinction the eigengap analysis makes about the continuous refit plane (doc 08): the coordinate system itself was nearly unstable, so measurements within it carry that instability.

## The trial's specific blind spot

The azimuth trial measured everything at the identity chart and produced three results: a false m = 1 positive from atomicity (doc 03), no detectable angular structure at the identity chart with atomicity removed (doc 09), and the observation that the identity chart is the regime the earlier corpus audit had already measured as blind (source record, section 5). The trial therefore did not kill the azimuthal channel. It killed every identity-chart reading of it, and left the chart question standing as the one untested and previously-positive element (source record, section 5).

## The surviving path

Of the five reignition paths the record orders (source record, section 6), the first is the powered lens: fit the PSL(2, C) chart, measure the rotation-invariant statistics under it, and guard the fit with a selection null (doc 06). The second path, continuous placement as a second coordinate, carries the eigengap caveat that the continuous refit plane is nearly unstable on this fixture, so a lens fitted to it needs an eigengap guard first (source record, section 6, item 2; doc 08). Both surviving paths change the chart; none of the failing paths do. That asymmetry is the record's core finding.
