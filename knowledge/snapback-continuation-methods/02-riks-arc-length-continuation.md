# 02. The Riks / Arc-Length Continuation Method

**Scope:** How the arc-length (Riks) constraint augments the equilibrium equations so a nonlinear static solve can pass limit points and trace the full load-displacement path, including unstable branches.

## Why load and displacement control fail

In conventional nonlinear static analysis the load parameter lambda is prescribed and Newton's method solves the residual equation R(u, lambda) = R_int(u) - lambda*F = 0 for the displacement vector u. This works until the solution passes a limit point, where the applied load changes from increasing to decreasing; load control then meets convergence difficulties because no equilibrium solution exists for the next load increment [1]. Displacement control mirrors the failure on the other axis: at a snap-back point the displacement reverses under rising load, and prescribing displacement loses the path. The standard interpretation is that the relevant tangent becomes singular (dP/du = 0 at a load limit point), which the sources support in substance: both original papers and the survey literature frame the failure as Newton iteration stalling "when the solution contains limit points" [1][2][3].

## The arc-length constraint

The Riks method treats both the displacement vector u and the load parameter lambda as unknowns, so one more equation is needed. The arc-length constraint augments the residual equation with a condition that fixes the length of the solution increment in the combined displacement-load space [1][2]:

$$\Delta u^T \Delta u + \Phi \, \Delta\lambda^2 (F^T F) = \Delta s^2$$

where Delta-s is the step length. The value Phi = 0 gives the cylindrical form and Phi = 1 the spherical form [2]. Geometrically the constraint defines a hypersurface intersecting the equilibrium path at the next solution point; because lambda may increase or decrease, the solve keeps going past the limit point where load control would fail [1][3]. ABAQUS implements exactly this idea as the Riks procedure: it "treats the load magnitude as an additional unknown" and "solves simultaneously for loads and displacements", using another quantity (arc length) to measure progress [4].

Algorithmically each step is a predictor-corrector: a predictor estimates the next equilibrium point and Newton iterations correct it against the augmented system [1]. Following Crisfield's reformulation, the linearized equilibrium equation is solved for delta-u in terms of delta-lambda, and substitution into the constraint yields a quadratic in delta-lambda with two roots; a root-selection criterion picks the forward branch (for example Crisfield's scalar-product rule, which chooses the root with the smallest angle to the previous correction direction) [2][3][7]. Open practical issues include initial step length, adaptive step control, root selection, branch switching at bifurcations, and convergence of the corrector [1][2].

## Variants: spherical, cylindrical, Crisfield, pseudo-arc-length

Wempner (1971) and Riks (1972) developed the idea independently [1]; Riks's paper is "The Application of Newton's Method to the Problem of Elastic Stability", Journal of Applied Mechanics 39(4):1060-1065, and Wempner's is "Discrete approximations related to nonlinear theories of solids", International Journal of Solids and Structures 7(12):1581-1599 [1]. Crisfield reformulated the method in 1981 ("A fast incremental/iterative solution procedure that handles 'snap-through'", Computers & Structures 13(1-3):55-62), which is the version most FEA codes implement, and extended it in 1983 with line searches and accelerations [1][6]. The spherical versus cylindrical distinction is the scaling parameter Phi above [2]. A further Crisfield-style modification measures the constraint from the last iteration rather than the last converged point (the "updated" or normal-plane variant); the surveyed sources confirm variant families differ mainly in constraint formulation, predictor, root selection, and step-length control, but the specific normal-plane attribution was not directly verified here (UNVERIFIED detail) [2]. Pseudo-arc-length formulations (constraint defined on a hyperplane normal to the predictor) are widely cited in the continuation literature but were not confirmed by the sources collected in this dig (UNVERIFIED).

## Tracing the full equilibrium path

Because lambda is free to reverse sign, the method follows the load-displacement response past a limit point, through snap-through and snap-back regions, and along unstable branches where load decreases while displacement grows [1][2][5]. Documented applications: post-buckling of plates, shells, and cylindrical panels; snap-through of shallow arches; strain softening, damage, and fracture where snap-back appears [1]. The truss-positional-FEM paper frames the method as the standard tool for "equilibrium paths, bifurcation points and limit points related to ... snap-through" [5], and a worked implementation traces the von Mises truss through the limit point that load control cannot cross [8].

In production FEA the procedure appears as ABAQUS/Standard's Riks (static, unstable collapse and postbuckling analysis) [3][4] and ANSYS Mechanical APDL's ARCLEN command; Wikipedia lists both under the names Static Riks, Riks, or arc-length control [1].

## Sources considered

| Source | URL | jev noul |
|---|---|---|
| Wikipedia, "Arc-length method" (with Riks 1972, Wempner 1971, Crisfield 1981, Ritto-Correa 2008 references) | https://en.wikipedia.org/wiki/Arc-length_method | 0.72 |
| ABAQUS/Standard v6.6 manual 6.2.4, Unstable collapse and postbuckling analysis (WUSTL mirror) | https://classes.engineering.wustl.edu/2009/spring/mase5513/abaqus/docs/v6.6/books/usb/pt03ch06s02at03.html | 0.82 |
| Crisfield 1983, IJNME, arc-length with line searches and accelerations | https://onlinelibrary.wiley.com/doi/abs/10.1002/nme.1620190902 | 0.94 |
| ResearchGate 269394472, trusses via arc-length + positional FEM | https://www.researchgate.net/publication/269394472 | 0.65 |
| ResearchGate 334082942, The Riks method and Arc length method | https://www.researchgate.net/publication/334082942 | 0.14 |
| Physicsbase blog, Crisfield arc-length on the von Mises truss | https://www.physicsbase.ai/blog-arclength.html | 0.08 |
| Scribd, Riks method in Abaqus (user upload) | https://www.scribd.com/doc/98805119/Riks-Method | 0.04 |
| Scribd, arc length for passing limit points (user upload) | https://www.scribd.com/document/344952577 | 0.05 |
| TrueGeometry blog page | https://blog.truegeometry.com/api/exploreHTML/2de94d6914ad80f638e9657b5b62cc58.exploreHTML | 0.03 |
| YouTube "Riks" channel (unrelated) | https://www.youtube.com/c/Riksstudios | 0.01 |

## Verification notes

- VERIFIED: Wempner 1971 and Riks 1972 as independent originators; full citations and DOIs [1].
- VERIFIED: constraint equation, spherical (Phi=1) vs cylindrical (Phi=0) forms, quadratic in delta-lambda, root selection [2].
- VERIFIED: Crisfield 1981 snap-through paper citation; Crisfield 1983 line-search paper fetched directly [1][6].
- VERIFIED: ABAQUS Riks treats load magnitude as an additional unknown and solves simultaneously for loads and displacements [4].
- UNVERIFIED: the exact ABAQUS wording "static stabilization ... follow the load-displacement response past a limit point" (vendor docs page fetch failed on a certificate error; only the v6.6 mirror snippet was retrievable).
- UNVERIFIED: Crisfield's updated/normal-plane variant attribution; pseudo-arc-length (Keller-type) formulation.

## References

[1] Wikipedia, "Arc-length method", https://en.wikipedia.org/wiki/Arc-length_method (cites Riks 1972 JAM 39(4):1060-1065 doi:10.1115/1.3422829; Wempner 1971 IJSS 7(12):1581-1599 doi:10.1016/0020-7683(71)90038-2; Crisfield 1981 Computers & Structures 13(1-3):55-62 doi:10.1016/0045-7949(81)90108-5; Ritto-Correa & Camotim 2008 doi:10.1016/j.compstruc.2007.08.003; Abaqus 2024 docs; ANSYS ARCLEN command reference).
[2] Ritto-Correa & Camotim 2008, "On the arc-length and other quadratic control methods", Computers & Structures 86(11-12):1353-1368, as summarized in [1].
[3] ABAQUS/Standard v6.6 User's Manual 6.2.4, https://classes.engineering.wustl.edu/2009/spring/mase5513/abaqus/docs/v6.6/books/usb/pt03ch06s02at03.html
[4] ResearchGate 334082942, "The Riks method and Arc length method", https://www.researchgate.net/publication/334082942
[5] ResearchGate 269394472, "Geometrically static analysis of trusses using the arc-length method and the positional formulation of the finite element method", https://www.researchgate.net/publication/269394472
[6] Crisfield, M. A. (1983), "An arc-length method including line searches and accelerations", IJNME 19, https://onlinelibrary.wiley.com/doi/abs/10.1002/nme.1620190902
[7] Scribd notes on Crisfield root selection, https://www.scribd.com/document/344952577 (low-trust, corroborative only)
[8] Physicsbase, https://www.physicsbase.ai/blog-arclength.html (low-trust, corroborative only)
