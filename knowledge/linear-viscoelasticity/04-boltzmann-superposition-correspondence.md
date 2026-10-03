# Boltzmann Superposition and the Viscoelastic Correspondence Principle

**Scope:** The hereditary-integral formulation of linear viscoelasticity and the transform method that reuses elastic solutions, from Roylance (MIT, 2001) sections 4.4, 5.2, 5.3 and Lee (1962).

## The superposition principle

Linear viscoelasticity can be stated as an integral postulate rather than through spring-dashpot models. The material must obey a general statement of linearity: the response to a sum of excitations is the sum of the responses each would generate alone, so sigma(epsilon-1 + epsilon-2) = sigma(epsilon-1) + sigma(epsilon-2). Combined with multiplicative scaling this gives the general statement of linear viscoelasticity:

`sigma(a*epsilon1 + b*epsilon2) = a*sigma(epsilon1) + b*sigma(epsilon2)` (Roylance Eqn. 43, weight 0.82)

## The Boltzmann superposition integral

Consider the stress at time t due to a small strain increment Delta-epsilon applied at an earlier time xi. From the definition of the relaxation modulus this is `Erel(t - xi) * Delta-epsilon`; superposing all increments and taking the continuous limit gives the Boltzmann superposition integral (Roylance Eqn. 44, weight 0.82):

`sigma(t) = integral over all xi of Erel(t - xi) (depsilon(xi)/dxi) dxi`

Example: for constant strain rate (epsilon = R*t) and a standard linear solid `Erel(t) = ke + k1*exp(-t/tau)`, the integral gives `sigma(t) = ke*R*t + k1*R*tau*(1 - exp(-t/tau))`, matching the one-arm model result of Eqn. 37.

## Four equivalent Duhamel forms

A unit step strain epsilon(t) = epsilon-0*u(t) transforms to epsilon-bar = epsilon-0/s, so `E-bar(s) = s*Erel-bar(s)` and, since `s*f-bar` is the transform of df/dt, `sigma-bar = Edot_rel-bar*epsilon-bar`. Applying the convolution transform four ways gives four equivalent relations (Roylance Eqn. 45, weight 0.82), all forms of Duhamel's formula with Erel(t) interpreted as the stress response to a unit strain input:

1. `sigma(t) = integral_0^t Erel(t - xi) * epsdot(xi) dxi`
2. `sigma(t) = integral_0^t Erel(xi) * epsdot(t - xi) dxi`
3. `sigma(t) = integral_0^t Edot_rel(t - xi) * epsilon(xi) dxi`
4. `sigma(t) = integral_0^t Edot_rel(xi) * epsilon(t - xi) dxi`

## The compliance-side form

If stress rather than strain is the input, the analogous development gives (Roylance Eqn. 46, weight 0.82):

`epsilon(t) = integral_0^t Ccrp(t - xi) * sigmadot(xi) dxi`

where Ccrp(t), the strain response to a unit stress input, is the creep compliance.

## Deconvolution: relaxation and compliance as convolution inverses

Transforming both constitutive forms (`sigma-bar = s*Erel-bar*epsilon-bar` and `epsilon-bar = s*Ccrp-bar*sigma-bar`) and combining gives `Erel-bar * Ccrp-bar = 1/s^2`. In the time plane this is (Roylance, weight 0.82):

`integral_0^t Erel(t - xi) * Ccrp(xi) dxi = integral_0^t Erel(xi) * Ccrp(t - xi) dxi = t`

So the relaxation modulus and creep compliance are convolution inverses up to the factor t: obtaining one from the other requires solving an integral equation, sometimes analytically via Laplace transforms, otherwise numerically.

## The viscoelastic correspondence principle

In elastic materials, boundary tractions and displacements may depend on time as a parameter because no time derivatives appear in the governing equations; with viscoelastic materials the constitutive equation becomes time-differential. The correspondence principle (origin: E.H. Lee, "Viscoelasticity," in W. Flugge, ed., Handbook of Engineering Mechanics, McGraw-Hill, 1962, Chap. 53, cited by Roylance as footnote 5; weight 0.88) adapts a known elastic solution instead of solving from scratch. Transforming the whole problem (structure, materials, boundary conditions) to the Laplace plane leaves the spatial aspects of its description unchanged; only the time-dependent material properties are altered, so the transformed problem is an "associated elastic problem" of the same shape, solved from the elastic-solution library, then inverted.

**Exception:** the body's shape is unchanged, but boundary conditions may change spatially on transformation. A traction `T(x,t) = cos(x*t)` transforms to `T-bar = s/(s^2 + x^2)`, a different spatial form. Separable space-and-time factors are safe: `T(x,t) = f(x)*g(t)` transforms to `T-bar = f(x)*g(s)`, so time-independent or separable boundary data leaves the spatial form unchanged.

**Recipe** (Roylance 5.3): (1) determine the associated elastic problem (usually identical in appearance); (2) obtain its elastic solution from handbooks (e.g. Roark's Formulas for Stress and Strain; Timoshenko and Goodier, Theory of Elasticity); (3) recast the elastic constants as viscoelastic operators, replacing E and nu with the shear and hydrostatic operators: `E(s) = 9*G(s)*K(s) / (3*K(s) + G(s))` and `N(s) = (3*K(s) - 2*G(s)) / (6*K(s) + 2*G(s))`; (4) replace applied tractions and displacements by their transforms; (5) invert back to the time plane.

## What viscoelasticity does and does not change

For statically determinate problems the stress distribution contains no material constants and is unaffected by viscoelasticity: the hoop stress in an open-ended thin-walled cylindrical pressure vessel remains `sigma-theta = p*r/b`. Displacements are affected: the elastic radial expansion `delta-r = p*r^2/(b*E)` becomes `delta-r = (p*r^2/b)*C` with C the compliance, and for constant pressure the value at time t is simply `(p0*r^2/b) * Ccrp(t)`. With a standard linear solid, `Ccrp(t) = Cg + (Cr - Cg)*(1 - exp(-t/tau))` gives `delta-r(t) = (p0*r^2/b)*[Cg + (Cr - Cg)*(1 - exp(-t/tau))]`.

If both pressure and compliance are time-dependent, substituting the instantaneous p(t) is incorrect because the expansion at time t depends on pressure at all previous times. The correct procedure folds pressure and compliance together in a convolution (Roylance Eqn. 57): `delta-r(t) = (r^2/b) * integral Ccrp(t - xi) * pdot(xi) dxi`.

The correspondence method reproduces the superposition result exactly when the elastic solution has two time-dependent quantities in the numerator (as in Eqn. 54): `delta-r = p*r^2*C/b` becomes `delta-r-bar = (r^2/b)*p*s*Ccrp-bar`, and inversion of `s*Ccrp-bar * p-bar` returns the same convolution integral. It is more straightforward for complicated mixes of time-dependent functions, such as the closed-end vessel `delta-r = (p*r^2/(b*E))*(1 - nu/2)`, where the two material descriptors must be transformed via the G(s) and K(s) operators and inverted together.

## Sources considered

| Source | Type | jev noul | Notes |
|---|---|---|---|
| [Roylance, "Engineering Viscoelasticity," MIT, Oct 24, 2001, secs. 4.4, 5.2, 5.3](https://web.mit.edu/course/3/3.11/www/modules/visco.pdf) | University course notes (primary) | 0.82 | Full text read; all equations above (Eqns. 43-46, 54-57, operator definitions) verified against the extract |
| E.H. Lee, "Viscoelasticity," in Handbook of Engineering Mechanics (W. Flugge, ed.), McGraw-Hill, 1962, Chap. 53 | Canonical book chapter (primary) | 0.88 | Cited as origin of the correspondence principle (Roylance footnote 5); not independently read |

**Dig note:** the searXNG dig endpoint (n8n searxng-proxy webhook) returned HTTP 500 "Error in workflow" on 6 attempts spanning both queries (including retries after 45s and 60s waits). Zero dig results were collected, so no external web sources were jev-weighted. The document is authored entirely from the verified primary anchor (Roylance extract) plus the Lee citation it contains. jev task_id: ta37f80e-a5bb-482e-944b-7a2c0791df2e.
