# 1D chain dispersion: monatomic and diatomic chains

**Scope:** the canonical dispersion relations of the 1D monatomic and diatomic harmonic chains, the two-branch structure that appears once the unit cell has two degrees of freedom, the zone boundary, and the band gap that closes exactly when the two masses are equal.

## The monatomic chain dispersion relation

For a 1D chain of identical masses M connected by springs of constant C, the equation of motion for the displacement of the s-th plane leads directly to the dispersion relation (Binghamton Solid State Physics notes, [7-1_Phonon_I.pdf](https://bingweb.binghamton.edu/~suzuki/SolidStatePhysics/7-1_Phonon_I.pdf), jev weight 0.811):

omega^2 = (C/M)(2 - 2 cos ka) = (2C/M)(1 - cos ka) = (4C/M) sin^2(ka/2)

so omega(k) = 2 sqrt(C/M) |sin(ka/2)|. The boundary of the first Brillouin zone lies at k = +/- pi/a (Binghamton, same source, weight 0.811). Any displacement can always be described by a wavevector inside the first Brillouin zone, because subtracting an appropriate reciprocal lattice vector G from k gives an equivalent wavevector k' = k + G (Binghamton, weight 0.811).

At small wavevector the dispersion is linear in k; Tong's Cambridge lecture notes derive omega = 2 sqrt(C/M) |sin(ka/2)| and note that at small k the phonon dispersion is linear, "more reminiscent of the massless, relativistic dispersion relation for light" than of a massive nonrelativistic particle ([aqmfour.pdf](https://www.damtp.cam.ac.uk/user/tong/aqm/aqmfour.pdf), jev weight 0.708).

## Why a diatomic chain has two branches

Adding a second degree of freedom per unit cell produces a second branch: "Systems with more than one degree of freedom per unit cell result in independent oscillation amplitudes" for the two atoms in the cell, and the resulting modes split into an acoustic and an optical family ([University of Tasmania solid-state notes, 3.2 The diatomic chain](https://ssp.utasphys.cloud.edu.au/3-1d/3-2-diatomic/), jev weight 0.746). The MIT 5.62 lecture notes state the same physical point directly: "The presence of two different atoms in the chain leads to optical phonons in addition to acoustic phonons" in a 1D chain of alternating masses ([MIT OCW 5.62 lecture 23](https://ocw.mit.edu/courses/5-62-physical-chemistry-ii-spring-2008/86d804b712f38d00c750ab6d51ef175e_23_562ln08.pdf), jev weight 0.518).

For a diatomic chain with masses m and M coupled by spring constant C, Tong derives two frequencies for each wavevector ([aqmfour.pdf](https://www.damtp.cam.ac.uk/user/tong/aqm/aqmfour.pdf), jev weight 0.708):

omega^2(+/-) = [ m + M +/- sqrt( (m - M)^2 + 4mM cos^2(ka) ) ] / (mM)

The lower frequency omega(-) is the acoustic branch and the upper frequency omega(+) is the optical branch (Tong, weight 0.708; the same branch naming appears in the Tasmania notes, weight 0.746). The acoustic branch is linear at small wavevector, which is why it is called acoustic ([University of Tasmania notes](https://ssp.utasphys.cloud.edu.au/3-1d/3-2-diatomic/), weight 0.746).

## The zone boundary

At the zone boundary the character of the modes changes qualitatively. The Tasmania notes ask the reader to evaluate the behavior of both curves at the zone boundary and to show that the group velocity at the zone boundary for the optical branch is zero ([University of Tasmania notes](https://ssp.utasphys.cloud.edu.au/3-1d/3-2-diatomic/), jev weight 0.746). For the monatomic chain the sin^2(ka/2) form makes the flattening at k = +/- pi/a visible directly in the dispersion formula (Binghamton, weight 0.811).

## The gap and when it closes

Tong's notes give the decisive structural fact: "For m = M, the gap closes, and we reproduce the previous dispersion relation, now plotted on half the original Brillouin zone" ([aqmfour.pdf](https://www.damtp.cam.ac.uk/user/tong/aqm/aqmfour.pdf), jev weight 0.708). That is, the band gap between the acoustic and optical branches of the diatomic chain is a function of the mass contrast, and it vanishes exactly at equal masses, at which point the diatomic chain is physically a monatomic chain with a doubled unit cell. The University of Tasmania notes reach the same conclusion from the mode structure: the optical and acoustic branches are the two independent oscillation amplitudes of the two-atom cell, and the qualitative behavior (a gap at the zone boundary, an acoustic branch going linearly to zero) is present whenever the two degrees of freedom differ ([3.2 The diatomic chain](https://ssp.utasphys.cloud.edu.au/3-1d/3-2-diatomic/), weight 0.746).

## What survives generalization

The pattern that generalizes beyond 1D: one degree of freedom per cell gives one acoustic branch reaching omega = 0 linearly; two degrees of freedom per cell give an acoustic plus an optical branch, with the optical branch's zone-center frequency set by the intra-cell restoring forces (Tong, weight 0.708; MIT OCW, weight 0.518; Tasmania notes, weight 0.746). Normal modes of such coupled chains are found by the same plane-wave-in-a-unit-cell ansatz used in the monatomic case (Tasmania notes, weight 0.746).
