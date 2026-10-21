# 06. Not Doing (and Why)

**Scope:** Not Doing (and Why): detailed analysis grounded in yubi-OS/yubiOS refs/supersolid-program-next-steps-solo-2026-10-06.md.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/supersolid-program-next-steps-solo-2026-10-06.md, no external web dig

## Four exclusions

The source's "Not Doing (and Why)" lists 4 items. Each is a deliberate deferral, and each has a stated trigger or reason.

### 1. v3 matched-extent shuffle

**Excluded because:** "a measurement, belongs in the next build turn after the docs land."

**What it is.** The control that holds array extent fixed while destroying translational order, to test whether the v2 gap between the triangular lattice (D 1.2636) and the shuffle (D 1.030 to 1.046) was order or extent.

**Why it is the hardest exclusion.** It scored 15 in the generation log (Inversion lens), the second-highest total, and the source calls it "the gate before any 'D reads order' claim." Excluding it costs scientific momentum. The source accepts that cost to protect the artifacts.

**When it lifts.** In the next build turn, after Lanes A, B, and C are pushed and CI-verified.

### 2. Knowledge-corpus mint of the supersolid material

**Excluded because:** "the refs doc is the record; minting now would duplicate it before the program stabilizes."

**What it is.** Running a knowledge-corpus mint to turn the supersolid material into a standalone knowledge corpus in yubi-OS/knowledge.

**Why.** Two problems. Duplication: the refs doc with its addenda already is the record, and two records drift. Timing: the program was still changing (the v3 control was pending), so a minted corpus would go stale immediately. The generation log scored this variation 12 (Combination lens), noting "duplicates the refs doc; premature."

**When it lifts.** When the program stabilizes. The source does not define stability more precisely.

### 3. The `supersolid_order` taste axis

**Excluded because:** it "stays gated on a discriminating measurement on controlled real data."

**What it is.** A new taste-engine axis that would score images for supersolid-like order.

**Why.** The axis would claim D reads order. The evidence did not yet support that. The generation log scored this 11 (Audience shift, physicists), "gated on a discriminating measurement."

**What happened.** The companion record shows the v3 control later found the lattice-versus-shuffle gap was extent-driven (jitter mean 1.2609 versus 1.2636, a difference of 0.0027), and the axis was REFUTED as designed. The exclusion prevented a refuted axis from ever being built.

### 4. Pumpkin/Y33 theory proposal

**Excluded because:** "parked pending the v3 control and any real hierarchical candidate."

**What it is.** A theory direction based on the exploratory pumpkin classes: pumpkin_ring (6 droplets at the |Y33| maxima, D 0.9772) and pumpkin_field (the orthographic |Y33| render, D 1.0384). Both read as smooth ordered morphology near D 1, roughly a full unit below the Sierpinski gasket at about 1.60.

**Why.** Two dependencies: the v3 control (to know what D does and does not read), and a real hierarchical candidate (since no real data had yet read near the Sierpinski band). The related "Paper draft" variation scored 11, "blocked on v3 + prior-art differentiation work."

## The rejected non-option

"Do nothing, measure next session" scored 12 but was rejected outright because it "fails the external-copies rule." It is not an exclusion with a trigger; it is ruled out.

## What the exclusions have in common

Every exclusion is a measurement, a claim, or a duplicate record. None is a documentation task. The MVP keeps everything that reduces risk (moving artifacts into the repo, documenting methodology, guarding with CI) and defers everything that creates new claims or new records.

## Reading the exclusions in hindsight

Two of the four (the v3 control, and through it the axis decision) resolved shortly afterward. The axis exclusion was vindicated by refutation. The v3 control ran after the documentation, as planned. The mint and the pumpkin/Y33 proposal remain parked in the record as of the companion doc's Addendum 7.
