# 04. Creep Buckling and Viscoelastic Stability

**Scope:** Time dependent structural stability: creep buckling of viscoelastic columns and shells, delayed instability, why the elastic-viscoelastic correspondence principle does not transfer to stability problems, and how structural codes treat sustained-load stability.

## Findings

### 1. Definition: failure at a finite time below the instantaneous critical load

Creep buckling is instability at a finite time t* under a constant sustained compressive load, even though the applied load never exceeded the instantaneous elastic critical (Euler) load. The classical column literature derives closed-form "formulae for the critical time at which a column fails," treating instantaneous elastic and plastic deformation together with transient and secondary creep in a single creep-law framework (Aeronautical Journal, Cambridge, jev 0.69). For polymeric columns modeled with linear viscoelasticity, instability develops as the growth of initial imperfections computed through hereditary integrals under constant compressive end loads (Int J Solids Structures 1993, sciencedirect.com/science/article/pii/002076839390004Q, jev 0.69). Verified.

### 2. Mechanism: effective stiffness and the critical load decay in time

The mechanism is time dependent degradation of the effective load carrying stiffness: creep strain accumulates, imperfection amplitudes grow, and the load the column can carry falls until it crosses the applied load. The Urbach-Efrati framework confirms this picture with an important correction: models that treat viscoelasticity as an elastic medium with a temporally evolving stiffness capture the phenomenon only qualitatively, and cannot capture creeping at zero load (Science Advances 2020 / PMC7473665, jev 0.68). For spherical shells, viscoelastic creep deformation demonstrably lowers the critical buckling load over time, producing delayed buckling (HAL hal-03337846, arXiv 2104.02554, jev 0.68; critical buckling time, load, and post-buckling deflection treated in the Hutchinson group review, jev 0.68). Importantly, creep buckling is not inevitable at every subcritical load: for materials with limited creep there exists a safe load limit below which the creep buckling process stabilizes in time rather than diverging (J Eng Mech 111(6):757, ASCE 1985, jev 0.68). Verified.

### 3. Two competing stability criteria, later correlated

Two basic analysis routes exist. The Rabotnov-Shesterikov linearized dynamical approach predicts critical creep buckling loads; Hoff's quasistatic nonlinear approach yields critical buckling times. Work on nonlinear single-memory-integral constitutive laws shows the two criteria are correlated, justifying the linear treatment, and Hoff's route can also derive critical creep buckling loads (Acta Mechanica 10.1007/BF01176353, jev 0.69). Verified.

### 4. Why the correspondence principle fails for stability

The elastic-viscoelastic correspondence principle transfers statics problems between the elastic and viscoelastic domains, but stability and limit points require care, and the naive transfer fails. The strongest available statement is Urbach and Efrati's two-result theory for incompressible linearly viscoelastic solids (Science Advances abb2948 and arXiv 1711.09491, both jev 0.68):

- Locally stable configuration stationarity: a system at rest brought instantaneously to a locally stable configuration will never lose stability and will not even move, despite continuous stress relaxation. Stability assessed at the arrival instant is permanent.
- Transient acquired stability: creeping into instability requires two stages. First, an elastically unstable state acquires stability through viscoelastic relaxation while held under external load. Second, on removal of the load the acquired state creeps and inevitably loses stability; acquired stability is always transient.

This proves viscoelastic stability is not reducible to a static elastic eigenvalue problem with time-substituted moduli: the verdict depends on the full relaxation history, not on any single effective modulus. The related static claim that the correspondence principle itself has verified failure regimes is documented for functionally graded nonhomogeneous materials, where the principle fails due to an inconsistency between the replacement of moduli (J Appl Mech 70(3):359, ASME 2003, jev 0.69). UNVERIFIED: the specific Laplace-plane statement that transform inversion can move pole locations so a stable transformed solution maps to an unstable time-domain response. This is the textbook mechanism and is consistent with the two-result theory above, but no retrieved source states it in those terms.

### 5. Standards perspective

Structural codes largely handle creep through load duration and service class factors rather than explicit creep buckling clauses. Eurocode 5 (EN 1995-1-1) for timber structures defines load duration classes and service classes that scale strength and stiffness for sustained load (JRC Eurocodes portal, eurocodes.jrc.ec.europa.eu). Comparative research explicitly benchmarks timber creep provisions across codes (researchgate.net/publication/331984808), long-term creep of timber columns is studied experimentally (sciencedirect.com/science/article/pii/S0141029622013591), and laminated glass buckling checks are beginning to incorporate time dependent moduli explicitly (sciencedirect.com/science/article/pii/S0141029625022758). UNVERIFIED: exact clause-level creep buckling safety formats in EN 1995-1-1 or any polymer-specific code; the digs surfaced the framework, not clause text.

## Sources considered

| Source | Type | jev weight |
| --- | --- | --- |
| sciencedirect.com/science/article/pii/002076839390004Q | Peer reviewed (IJSS) | 0.69 |
| link.springer.com/article/10.1007/BF01176353 | Peer reviewed (Acta Mechanica) | 0.69 |
| Cambridge core pdf, Buckling of Columns in the Presence of Creep | Peer reviewed (Aeronautical Journal) | 0.69 |
| ascelibrary.org/doi/10.1061/(ASCE)0733-9399(1985)111:6(757) | Peer reviewed (J Eng Mech) | 0.68 |
| hal.science/hal-03337846 (arXiv 2104.02554) | Preprint / repository | 0.68 |
| groups.seas.harvard.edu/hutchinson 2022-8 review | Group review pdf | 0.68 |
| science.org/doi/10.1126/sciadv.abb2948 | Peer reviewed (Science Advances) | 0.68 |
| pmc.ncbi.nlm.nih.gov/articles/PMC7473665 | Open access copy of the above | 0.68 |
| arxiv.org/abs/1711.09491 | Preprint | 0.68 |
| asmedigitalcollection.asme.org J Appl Mech 70(3):359 | Peer reviewed | 0.69 |
| web.mit.edu/course/3/3.11/www/modules/visco.pdf | Course notes | 0.67 |
| en.wikipedia.org/wiki/Viscoelasticity | Encyclopedia | 0.69 |
| eurocodes.jrc.ec.europa.eu Eurocode 5 | Official portal | n/a (supplemental, not jev weighted) |
| sciencedirect.com/science/article/pii/S0141029622013591 | Peer reviewed (Eng Structures) | n/a (supplemental) |
| researchgate.net/publication/331984808 | Aggregator-hosted paper | n/a (supplemental) |
