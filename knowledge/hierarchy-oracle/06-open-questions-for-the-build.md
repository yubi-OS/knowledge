# 06. Open Questions for the Build

**Scope:** Open questions for the build: detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-oracle-2026-10-06.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/hierarchy-oracle-2026-10-06.md, no external web dig

## Three open questions

The one-pager ends with three questions it deliberately did not answer at ideation time. Each is a pre-registration decision that has to be fixed before measurement.

## Question 1: which gasket level for the gold eigen-solve?

The doc frames the trade-off with vertex counts:

| Level | Vertices | Feasibility |
|---|---|---|
| 5 | 243 | Jacobi-feasible |
| 6 | 729 | borderline in stdlib |

The gasket graph at level n has (3^(n+1) + 3)/2 vertices under one common indexing; the doc's own figures (243 and 729, which are 3^5 and 3^6) suggest it counts by powers of 3, so the absolute convention should be confirmed against the builder. What matters is the scaling: each level roughly triples the vertex count, and a dense Jacobi eigen-solve costs on the order of the cube of the vertex count, so level 6 is about 27 times the work of level 5.

Why the level matters: a deeper gasket gives more octaves of self-similarity inside the counting window, which makes the exponent fit and the log-periodic wiggle easier to see. A shallower gasket is cheap and exact but may not span enough scales.

**Resolution in the SPEC**: the SPEC's gold row 1 uses levels 3 (27 vertices) and 4 (81 vertices) with exact Jacobi eigenvalues, and the MVP plan validates the decimation recursion against Jacobi at levels 2 and 3. The SPEC's vertex counts (27 and 81) use the powers-of-3 convention, consistent with the one-pager's 243 and 729.

## Question 2: how to pin the d_w window?

The doc's phrasing: walk steps 1..64? Log-spaced like the box scales? It adds that the choice must be pre-registered in the harness before measuring.

The tension: random walks have a short-time regime dominated by lattice-step effects and a long-time regime dominated by finite-size saturation. The scaling regime is in between, and its location depends on graph size. A window that is too early reads lattice artifacts; too late reads the graph boundary.

**Resolution in the SPEC**: the walk-step ladder is the taste scale lattice [4, 6, 9, 13, 20, 29, 43, 64], the same 8-point log ladder as box counting, multiplied by a step-scale factor so a level-4+ gasket's hierarchy falls inside the window. It is pre-registered and never retuned to an outcome. This answers the "log-spaced like the box scales?" question with yes.

## Question 3: role of the log-periodic wiggle

The one-pager answers its own question: secondary gate (oscillation presence), never a fit parameter.

Reason: exact gasket spectra are log-periodically modulated. A global power-law fit averages the modulation away. The companion solo log's stress-test names this as the strongest critique: a counting exponent over a pinned window is a 1-parameter read of a rich spectrum. The answer is twofold: test presence of the wiggle as a separate gate, and store the full series in the run row so band definitions can be refined later without losing data.

Making the wiggle a fit parameter would let the model absorb the very structure it is meant to detect, and would give the fit extra freedom to match noise.

**Resolution in the SPEC**: gold row 8 requires residual alternation across successive octave bands on exact gasket eigenvalues, with the method recorded as `residual-octave-alternation`.

## Summary

| Open question | Risk if unpinned | SPEC resolution |
|---|---|---|
| Gold gasket level | too few octaves, or infeasible solve | levels 3 and 4 exact; decimation checked vs Jacobi |
| d_w window | lattice or boundary artifacts; post-hoc tuning | taste lattice x step-scale factor, pre-registered |
| Log-periodic wiggle | absorbed into fit, or ignored | secondary presence gate, never fitted |

## The common pattern

All three questions are about pre-registration. None asks what the answer should be; each asks what the rule should be before the answer is seen. That is the falsification-corpus discipline the one-pager cites for the harness, applied at ideation time.
