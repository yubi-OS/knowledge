# The corrected Ginzburg-Landau mathematics

> Scope: the overbroad claim in the old GL note, the exact b = c Lyapunov functional with its reactive component, the unequal-coefficient counterexample, and the 2/9 correction, each grounded in the primary literature.

## The claim being corrected

The corpus's earlier note on the complex Ginzburg-Landau skill emergence (`refs/complex-ginzburg-landau-skill-emergence.md`, program record: [existing GL note](https://github.com/yubi-OS/yubiOS/blob/main/refs/complex-ginzburg-landau-skill-emergence.md)) stated in section 2.5 and caveat 4 that nonzero imaginary coefficients preclude a monotonically decreasing scalar free energy. The September 2026 research-phase record ([round-three results](https://github.com/yubi-OS/yubiOS/blob/e4be4854764f3217eaab08c01f15e62d5509e3ec/refs/wayfinder-round3-results-2026-09-13.md), program record) corrects this: the statement is too broad.

The complex Ginzburg-Landau equation is one of the most studied nonlinear equations in physics, and its behavior varies enormously across its parameter plane ([The World of the Complex Ginzburg-Landau Equation](https://arxiv.org/abs/cond-mat/0106115), weight 0.85; [review PDF](https://arxiv.org/pdf/cond-mat/0106115), weight 0.79). Blanket claims about what the imaginary coefficients do or do not allow are exactly the kind of statement this literature punishes.

## The b = c construction

For the normalized deterministic equation with b = c = beta, define

```
B = e^{i*beta*t} A,     G(B) = B - |B|^2 B + laplacian B
```

Then the transformed field obeys

```
d/dt B = (1 + i*beta) G(B)
```

For periodic or appropriate no-flux boundary conditions, take the functional

```
F[B] = integral ( |grad B|^2 - |B|^2 + (1/2)|B|^4 ) dx
```

Its functional derivative is -G, so

```
dF/dt = -2 Re integral G* (1 + i*beta) G dx = -2 integral |G|^2 dx <= 0
```

(program record). Three readings follow:

- beta = 0 is pure gradient flow.
- Equal nonzero imaginary coefficients retain a Lyapunov functional with a reactive component.
- A global phase rotation leaves F unchanged, so decreasing F alone does not prove convergence of the original field A to a time-independent state. Noise, forcing, and general unequal coefficients require separate analysis.

The question of Lyapunov functionals for the complex Ginzburg-Landau equation has a numerical literature: the Graham functional was studied numerically in one dimension as a candidate Lyapunov potential ([Numerical Study of a Lyapunov Functional for the Complex Ginzburg-Landau Equation](https://www.semanticscholar.org/paper/Numerical-study-of-a-Lyapunov-functional-for-the-Montagne-Hern%C3%A1ndez-Garc%C3%ADa/f6b1381168f23623e24731b40061fe2c85ef5a33), weight 0.91; [arXiv 9508115](https://arxiv.org/abs/cond-mat/9508115), weight 0.43, weakly backed), and it does not decrease monotonically for all parameter values. The record's b = c identity is a special case where the functional does decrease, which is consistent with both threads.

## Numerical verification

The record's independent checks (program record):

- The operator identity was verified on finite periodic systems at beta = 0, 0.7, 1.5 and -2, with maximum relative identity error 5.10e-16.
- A direct unequal-coefficient counterexample at b = 2, c = -1 has positive directional derivative 1.730246e-5, confirmed by a symmetric energy difference of 1.730247e-5. It uses 16 sites, a cosine perturbation of amplitude 0.01, and a real to imaginary amplitude ratio of 0.05. The rise is a property of the vector field at that state, not an explicit-Euler instability.

The identity is corroborated by the Aranson and Kramer review ([arXiv 0106115](https://arxiv.org/abs/cond-mat/0106115), weight 0.85), which is the standard reference treatment of the equation's variational limits.

## The 2/9 correction

The old note also contained the statement `2/9 ~= 0.78`. In fact 2/9 = 0.2222 (program record). The correct mathematical statement: for a nonzero positive-semidefinite 9-dimensional covariance, the fraction 2/9 is the isotropic lower bound on the share of total variance carried by the top two directions; it is not a universal upper saturation value. The later *Is This X?* paper ([papers/is-this-x](https://github.com/yubi-OS/yubiOS/blob/e4be4854764f3217eaab08c01f15e62d5509e3ec/papers/is-this-x-2026-08-12-Final.tex), program record) already distinguishes the floor from ensemble-specific values, and the dated correction should make that precedence explicit.

## What the correction does not reopen

Correcting the b = c mathematics does not revive the falsified phase-transition predictions or the retired Hodge/vortex interpretation. Empirical claims live and die under their recorded protocols, not under algebra (see the audit boundaries doc).
