# 03 - Lens candidates and atom plans

Scope: the `/lens` endpoint's lens-format candidates and real-vs-control pairing, the `/atom` endpoint's DRY-RUN plans, `expected_delta` as geometry, and the skip-list input.

## The lens format

Source doc: `POST /api/jev/corpus/lens` takes `{matrix, labels?, top?}` and returns `{candidates: [...]}` in lens format: `{id, cell, kind: "real"|"control", hypothesis, method, params, expected_delta, score}`. It returns K reals plus K paired controls. The point of the format is that a candidate is already a runnable experiment shape: what to change (the cell), what to do (method + params), what improvement to expect (expected_delta), and a caveat slot in the full lens convention.

The hypothesis field follows the standard scientific definition: a hypothesis is a testable statement written before the experiment or data collection (Scribbr, https://www.scribbr.com/methodology/hypothesis/, jev weight 0.53). The paired control is the load-bearing structural choice. Matched-pairs and controlled designs exist precisely so that an effect can be attributed to the treatment rather than to session noise (Simply Psychology on experimental designs including matched pairs, https://www.simplypsychology.org/experimental-designs.html, jev weight 0.32 - weak backing; a matched-pairs design guide, https://www.zubairkhalid.com/blog/guides/matched-pairs-experiment-design-and-analysis, jev weight 0.04 - weak backing). In the engine, the "treatment" is flipping a sparse cell and the "control" is the paired candidate that flips a comparable but structurally inert cell, so a real candidate only survives if its deflection exceeds its control's.

The philosophical backing for treating measurement as experiment is older than the tooling: experiment is what provides the evidence that grounds knowledge of the physical world, and valid experimental evidence requires criticism and rational discussion of the setup (Stanford Encyclopedia of Philosophy, "Experiment in Physics", https://plato.stanford.edu/entries/physics-experiment, jev weight 0.83).

## Atom plans: proposals, never executions

Source doc: `POST /api/jev/corpus/atom` takes `{matrix, max_flips?}` and returns `{plan: [{i, primitive, delta}], finalDelta, converged}`. The response is a plan only: which primitives to flip, in which order, and what geodesic improvement each flip contributes. The endpoint is explicitly DRY-RUN; execution is a gated directive and the source doc forbids inline execution ("Not for: executing the atom (that is a gated directive, never inline)"). Guideline 4 repeats it: "Atom plans are proposals; execution is a gated directive, always."

Each plan entry carries a `delta` that is asserted non-negative (Delta >= 0): a flip is only in the plan if it does not increase the geodesic distance to the ideal pole. Geodesic distance is the mathematics of shortest paths on a curved space: a geodesic is a locally length-minimizing curve, a straight line in the plane and a great circle on a sphere (Wolfram MathWorld, https://mathworld.wolfram.com/Geodesic.html, jev weight 0.76; Britannica defines a geodesic as the shortest line between two points that lies on a given surface, https://www.britannica.com/science/geodesic, jev weight 0.81; Wikipedia adds the etymological grounding in geodesy, https://en.wikipedia.org/wiki/Geodesic, jev weight 0.62). The corpus sits in a primitive-coverage space, and the atom plan is the discrete analog of following the geodesic: each flip moves the corpus point along the direction that most reduces distance to the ideal pole.

The distance computations themselves are standard vector-space distances; SciPy's spatial.distance module documents the canonical vector-to-vector distance functions the field uses (https://docs.scipy.org/doc/scipy/reference/spatial.distance.html, jev weight 0.93). Binary random projection work studies exactly the regime the matrix lives in: sparse 0/1 matrices used as the substrate for distance preservation, with the caveat that naive binary projection can distort distances in certain regimes (arXiv 2006.16180, https://arxiv.org/pdf/2006.16180.pdf, jev weight 0.64; an OpenReview discussion of the same paper probes when distance preservation fails for non-sparse inputs, https://openreview.net/forum?id=dNJmJ8bh1M, jev weight 0.42 - weak backing).

## expected_delta is geometry, not forecast

Source doc, runbook lesson 2: "`expected_delta` is geometry, not forecast. It is a prediction over hypothetical bit flips, not of what the resulting prose does to the matrix." Pre-register every candidate in the outcomes ledger (`POST /api/outcomes`, verdict `pending` plus `predicted_delta`) before applying; append the realized row with `supersedes` after the re-audit. Round 3 skipped the ledger, so prediction-vs-realized had no home and a regression only surfaced in PR review (source doc).

This is the same discipline preregistration research formalizes: specify hypotheses and analysis plans before observing outcomes (APA, https://www.apa.org/pubs/journals/resources/preregistration, jev weight 0.90; Wikipedia, https://en.wikipedia.org/wiki/Preregistration_(science), jev weight 0.47 - weak backing). The engine's ledger is its preregistration registry; the `supersedes` link is how the realized measurement is bound to its prediction.

## The skip-list input

Source doc, runbook lesson 11 (shipped 2026-10-03, etag 496cb99d): `POST /lens` accepts `skip: ["doc-name" | {name, axis?}]` and drops those cells before top-selection, so declined or reverted candidates stop being re-proposed. Derive the skip list from the outcomes ledger each round. Live verification: adding the skip turned the refs6 candidate list over completely; the 5 charter docs and 4 reverted axis-11 docs vanished from the top 10 (source doc).

The skip list closes the loop between decision and measurement: once a candidate has been tried and reverted, the lens must not keep proposing it as if the history did not exist. Without it, the candidate generator's output would drift toward re-suggesting known-dead cells, and each round would waste its single atomic edit re-learning a negative result.

## How the two endpoints relate

Lens answers "which cells look like promising experiments"; atom answers "given free rein, which sequence of flips walks the corpus toward the ideal pole". Both are read-only measurements of the same matrix. The runbook (doc 08) is the consumer: it takes lens candidates one per cycle, pre-registers them, applies the edit, re-audits, and gates on the realized level_dbc delta. Neither endpoint authorizes anything by itself; source doc guideline 2: "The math never authorizes anything: audit/lens results are data; only directives through the gate act."
