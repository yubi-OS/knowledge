# 06. Not Doing (and Why)

**Scope:** Not Doing (and Why): detailed analysis grounded in yubi-OS/yubiOS refs/sierpinski-supersolid-connection-solo-2026-10-06.md.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/sierpinski-supersolid-connection-solo-2026-10-06.md, no external web dig

## Four exclusions

The source's "Not Doing (and Why)" lists 4 items. Each protects the MVP's status as a clean measurement.

### 1. No new theory paper yet

**Excluded.** The Sierpinski-supersolid proposal as a theory paper.

**Why.** "The measurement result decides whether the theory question is worth writing." Writing theory first would commit the program to a framing before knowing whether the instrument can certify the target state.

**Connection to the generation log.** The "Sierpinski-gasket supersolid theory proposal" variation (Constraint removal) scored 13, with defensibility 5 but testability 3 because it "needs simulation infrastructure we don't have yet." It stays parked pending the prior-art lane.

**What the companion record later showed.** Lane 2 of yubi-OS/yubiOS refs/sierpinski-supersolid-connection-2026-10-06.md judged the Sierpinski-gasket droplet crystal NOVEL, with the closest prior (Rydberg fractal order at ln3/ln2) lacking any superfluid component. After Addendum 7 the proposal is "UNCHANGED and strengthened." The exclusion's condition (measurement first) was met, but the record does not show the paper drafted.

### 2. No live-experiment collaboration or data requests

**Excluded.** Contacting experimental groups or requesting unpublished data.

**Why.** "Public imagery first." Public data is reproducible by anyone and needs no coordination, which fits a scope-medium, this-week MVP.

**Consequence.** The real-data pass depends on what happens to be public. In practice this meant Norcia Fig. 2b single-trial panels and a 1D Zenodo dataset. The companion record lists multi-trial averaged in-situ images as a later next action.

### 3. No modification of edge-standard-v1 pinned parameters

**Excluded.** Retuning the window, coverage, or component thresholds.

**Why.** "Any retuning is a major version bump and stays out of the MVP."

**Why this is the most important exclusion.** An instrument tuned toward the result it is testing cannot falsify anything. The companion record repeats the rule as a "Never" item: never retune TARGET_COVERAGE, MIN_COMPONENT, or the window toward a D outcome. When v1 failed the gate, the fix went into the generator design (uniform droplet radius, more depth), not the instrument. The gate window was re-expressed as {13, 20, 29, 43, 64} only because "16 to 64" was ill-posed on the pinned scale set, and that amendment was logged before v2 ran.

### 4. No `admitted: true` flip on any taste axis from this result alone

**Excluded.** Admitting a new taste axis directly from the MVP.

**Why.** "The rayleigh admission protocol governs." Admission requires a multi-class trial recorded in refs/, not a single favorable result.

**What the record shows.** The axis was never admitted. After the matched-extent control, the `supersolid_order` axis was refuted as designed.

## Exclusions implied by the follow-on logic

Two more things are deferred by conditional language:

- **The visco-supersolid loop** (D(t) under interaction ramps, with hysteresis rollup) becomes the follow-on only if the MVP discriminates. Since D does not read order at matched extent, the trigger for this follow-on is at best partially met.
- **Other modulated-matter domains** (charge density waves, vortex lattices, skyrmion micrographs) are named as a second-order effect, not a commitment.

## How the exclusions protect the result

- **Exclusion 3** protects validity: the instrument cannot be bent toward the hypothesis.
- **Exclusion 4** protects the taste engine: one result cannot change production scoring.
- **Exclusions 1 and 2** protect scope: no theory and no coordination until the measurement says it is worth it.

## A note on what was not excluded

The source did not exclude negative results. It explicitly counts "D does not separate the classes" as "a publishable instrument-negative in the fractalrabbit ledger." That inclusion is why the later refutation of the order-parameter framing reads as a success of the method rather than a failure of the project.
