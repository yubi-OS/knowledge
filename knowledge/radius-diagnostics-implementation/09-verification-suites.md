# 09: Verification suites for a frozen-frame instrument

Scope: the verification architecture behind a diagnostic change that must not move production behavior: the 76/76 radius suite, the 43/43 preview suite, integer and graph nulls, storage round-trip and byte-budget checks, browser suites, and fresh-context review.

## The verification problem

A diagnostic layer's hardest requirement is negative: it must not change the thing it observes. The motivating implementation pins this with byte-identity claims: the pointmap.js core and the homepage short-introduction remain byte-identical to the pre-change deployment, and four updated public assets matched SHA256 while core JavaScript stayed unchanged after deploy (project record: https://github.com/yubi-OS/yubiOS/pull/233 ). Verification therefore splits into two families: suites proving the new diagnostic does what it claims, and suites proving nothing else moved.

The second family is the golden-master or characterization-test pattern: capture the current behavior of a module nobody wants to change, freeze it, and verify a change produces identical output. The pattern is standard for legacy code protection; a characterization test describes the actual behavior of existing software and protects it during change (source: https://en.wikipedia.org/wiki/Characterization_test , jev weight 0.27, weak backing). Practitioner guides describe the workflow as capture output, compare against baselines, refactor (source: https://stackpractices.com/patterns/golden-master-testing-pattern/ , jev weight 0.37, weak backing), and tooling exists specifically for "freeze its real behavior first, then verify the rewrite against the frozen oracle" (source: https://github.com/FlyingEggs/golden-regression , jev weight 0.38, weak backing). The byte-identity claims above are golden masters at the artifact level.

## The radius suite: 76/76

The radius suite covers 76 cases across all maps 66 to 76 and exercises the structural cases the mathematics depends on (project record: https://github.com/yubi-OS/yubiOS/pull/233 ):

1. Permutations and rotations: the counts must be invariant when items are permuted or the frame is rotated, because isolation is a property of the point set, not of its presentation. Permutation invariance is a foundational symmetry property in geometric machine learning, where dedicated unit tests for permutation invariance and equivariance are standard teaching material (source: https://colab.research.google.com/github/chaitjo/geometric-gnn-dojo/blob/main/geometric_gnn_101.ipynb , jev weight 0.63), and the statistical theory of permutation-invariant function classes is active research (source: https://arxiv.org/html/2403.01671v3 , jev weight 0.73; source: https://arxiv.org/pdf/2403.01671v3 , jev weight 0.81). Rotation invariance gets the same treatment in point-cloud analysis (source: https://arxiv.org/html/2402.01331v1 , jev weight 0.80).
2. Coincidences and strict ties: items at identical positions or with exactly equal clearances, testing the tie semantics of doc 01.
3. Adjacent Float64 breakpoints: distances one ulp apart at a threshold, testing the boundary handling of doc 04.
4. Bounded perturbations: coordinate moves within the caller-supplied bounds, testing the conditional perturbation bands of doc 06.
5. Witness caps: boundary witness lists longer than 8, testing the total/shown accounting of doc 03.

Property-based testing is the general technique behind this shape: instead of hand-picked examples, the suite asserts properties that must hold for any input (source: https://propertybasedtesting.com/ , jev weight 0.61). Permutation, rotation and tie cases are the properties; the maps 66 to 76 are the concrete instances.

## The null that is degenerate

One null hypothesis was tested and found degenerate, and that finding is itself a result. The suite ran 1,024 simple graphs across 533 degree sequences and confirmed that the isolate count is invariant for a fixed degree sequence; the null is degenerate for this statistic (project record: https://github.com/yubi-OS/yubiOS/pull/233 ). Recording a degenerate null matters more than a silent omission: it tells future readers that a proposed randomization test for this statistic would have no power, before anyone builds one.

## The preview suite and integer rectangles

Two more suites bound the change:

1. Preview suite: 43/43, including real radius-module outputs, unchanged frame bits, coordinates and ranking under diagnostic budgets, and pre-model rejection of radius overrides. The preview is the path with side-effect risk (doc 07), so its suite checks that diagnostic computation leaves persisted state untouched.
2. Integer rectangle suite: 10,201 cases of integer clipped-length and area arithmetic, matching the integer-phrased kernel bounds of doc 06 with concrete exhaustive checks.
3. Storage: 8 checks verifying that the full 400 by 768, d=24 case stores 1,404,802 bytes with the profile attached, below the unchanged 1.9 MB safe cap, and that fields round-trip losslessly. A byte budget is a regression guard with a number in it: any packing change that pushes the size up fails visibly.

## Browser suites and review

Two browser suites close the loop on the UI:

1. The existing browser suite passed 59/59, preserving short-introduction copying and old UI behavior, the golden-master family for the interface.
2. The radius browser suite passed 86/86, covering intervals, domain endpoints, conditional states, named witnesses, escaped markup, mobile layout, and unchanged baselines (doc 08's requirements, each checked).

Finally, the change went through fresh-context general/smart review twice: initial findings were corrected, and the follow-up review returned PASS. The fixes retained scope labeling and made legacy read-time enrichment explicit and nonfatal while keeping preview fail-closed (doc 05 and doc 07 behaviors). The fresh-context discipline matters because a reviewer who shares the author's context inherits the author's blind spots; corrections from the first round were themselves retained and re-verified.

## What the suites do not claim

Browser and API fixtures are labeled test doubles, and historical exact replays remain retrospective: the suites verify the instrument, not the historical event stream. Final receipts are the CI runs and the live verification of doc 10, which are separate evidence.

## Summary

1. Verification splits into positive suites (the diagnostic works) and negative suites (nothing else changed), the latter being golden-master and byte-identity checks.
2. The radius suite's 76 cases target the structural cases: permutation and rotation invariance, ties, Float64 breakpoints, bounded perturbations, witness caps.
3. The graph null result is recorded as degenerate, which is a finding, not a gap.
4. Byte budgets, lossless round-trips, browser coverage of every UI obligation, and fresh-context review with PASS close the evidence chain.

Project record: the motivating implementation's suite results and receipts are recorded at https://github.com/yubi-OS/yubiOS/pull/233 .
