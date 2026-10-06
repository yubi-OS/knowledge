# 06 - Discrepancy standing of the Fibonacci sphere

## Scope

Where the Fibonacci sphere sits in the discrepancy landscape: its O(1/N^2)-style area behavior, its relation to Niederreiter low-discrepancy sets and quasi-Monte Carlo, and where it falls short of strict QMC membership.

## Definitions first

Discrepancy measures how unevenly a finite point set covers a domain: for a family of test regions, it is the worst deviation between the region's true area fraction and the fraction of sample points inside it. OpenTURNS' theory documentation defines it in Niederreiter's notation and states the consequence: if the points are chosen as elements of a low-discrepancy sequence, the resulting integration method is the quasi-Monte Carlo method (weight 0.53, https://openturns.github.io/openturns/latest/theory/reliability_sensitivity/low_discrepancy.html). So "low discrepancy" is a precise property of the point set, and QMC is the integration method built on it.

## What the Fibonacci lattice achieves

The arxiv study of Fibonacci versus latitude-longitude lattices measures the practical form of this property: the area of a spherical region can be estimated by point counting, checking which sampling points of the lattice fall inside the region, and the paper compares how the two lattices perform at that task (weight 0.89, https://arxiv.org/pdf/0912.4540). The Fibonacci lattice's uniform-in-z spacing gives each point roughly equal spherical area, which is the geometric reason its point-counting error is small and uniform over the sphere, while the latitude-longitude lattice concentrates error near the poles where its points pile up. The KIT paper on deterministic von Mises-Fisher sampling states the key idea directly: a Fibonacci lattice generates high-quality deterministic samples on the sphere (weight 0.88, https://isas.iar.kit.edu/pdf/SDFMFI23_Frisch.pdf), used as the substrate for directional statistics sampling.

## Where it falls short of strict QMC

The source artifact makes a careful claim: the Fibonacci sphere is not QMC in the strict Niederreiter sense but has O(1/N^2) area discrepancy, comparable for moderate N. The "not strict QMC" half is grounded: Niederreiter-style low-discrepancy sequences are one-dimensional or tensor-product constructions with explicit t,m,s parameters, and the OpenTURNS documentation frames QMC as sequences in that family (weight 0.53). The Fibonacci lattice is instead a single deterministic lattice tailored to S^2, with the golden-angle turn as its only parameter. The O(1/N^2) figure is the artifact's own citation from the discrepancy literature and did not come back from the dig with a directly matching authoritative page; treat that exponent as weakly backed in this corpus and verify against the lattice-discrepancy literature before quoting it externally.

The honest summary: the Fibonacci sphere is a deterministic equal-area-style point set whose empirical coverage behavior rivals low-discrepancy constructions at moderate N, without carrying the QMC machinery's guarantees. That is precisely the position the revised passage takes when it calls the result a low-discrepancy diagnostic grid rather than a QMC rule.

## Sources

- https://arxiv.org/pdf/0912.4540 (weight 0.89)
- https://isas.iar.kit.edu/pdf/SDFMFI23_Frisch.pdf (weight 0.88)
- https://openturns.github.io/openturns/latest/theory/reliability_sensitivity/low_discrepancy.html (weight 0.53)
