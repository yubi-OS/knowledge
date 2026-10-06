# 10: New gaps G1 to G6, the order of attack, and the honesty constraints

Scope: source doc finding F13 plus the merged order of attack and the honesty constraints carried into Part II.

Grounding spine: [source doc](file://yubi-OS/yubiOS playbooks/lensing-question-space.md), 2026-08-13, sections F13, "Order of attack", and "Honesty constraints".

Internal-record subtopic, no dig: all content is test designs, sequencing, and discipline rules from the source doc against internal data files.

## The six Part II gaps

1. G1, closed-form defocus verified against simulation: apply exp(-l(l+1) t) decay to the measured Parseval shares of the 2286x9 corpus and confirm against explicit Brownian simulation on the Fibonacci lattice; the spectrum is already in results/real-gwtc-results.json shape (source doc).
2. G2, diffusion-time null: t-hat needs its own non-degenerate null under the membership condition; compute t-hat on curveball draws, and if the null's t-hat distribution is degenerate the coordinate is inadmissible (source doc).
3. G3, scale-space sweep: z(t) profiles for Delta V2z and E_33 on yubiOS and GWTC at 5 to 10 log-spaced t; pre-registerable prediction: the m=3 starvation effect should invert or die at moderate t, since diffusion scrambles the PC1-ordering mechanism that causes it (source doc).
4. G4, sphere Langevin versus compass: run the S2 Langevin with Phi = chordal distance to pole at the compass's T grid, verify the k-shell marginal reproduces pi_T(k), and locate the sphere-native crossover; extends the compass's 8-of-8 selftest to the continuum (source doc).
5. G5, RSGM feasibility: 2286 points on S2 is tiny by RSGM standards, but the exact S2 heat kernel removes the usual approximation pain; the risk is that the corpus is 176 distinct rows, so the point cloud is heavily atomic and may need kernel-smoothed targets first, with vMF bandwidth as another t (source doc).
6. G6, caustics of the reverse flow: where the learned score focuses mass onto lower-dimensional sets, the reverse flow develops the same rank-collapse signature as F4; monitor the anti-caustic guard (rank plus condition number) along diffusion time, not just at endpoints (source doc).

## Order of attack

The merged ordering, cheapest first (source doc): 1. G1, hours, pure verification, unlocks Part II. 2. B, the Snell invariant, re-analysis only. 3. G3, first new science, falsifiable m=3 prediction. 4. D, power the Moebius lens, flagship of Part I. 5. G4, the Langevin-compass continuum check on an already-green selftest. 6. A, C, G2, theory choices and admissibility nulls. 7. G5, E, G6, F, generative model, caustic classification, bridge unification.

## Honesty constraints (carried into Part II)

The four rules (source doc): 1. No coordinate enters the map without a demonstrated non-degenerate null, t-hat included. 2. Empirical null quantiles, never Gaussian tails, for any statistic built from over-dispersed z. 3. "Diffusion", "lens", and "focus" stay reserved vocabulary until the corresponding construction passes the membership condition; the compass set the precedent with designed dynamics and a wall between corpus facts and design facts. 4. T is a knob of designed dynamics, not an observable of the corpus; the same rule applies verbatim to diffusion time t.

These rules are the playbook's load-bearing discipline: every mechanism named in docs 06 through 09 enters the map only through a null it has passed, which is why the gap list assigns each new coordinate its admissibility test before any use.
