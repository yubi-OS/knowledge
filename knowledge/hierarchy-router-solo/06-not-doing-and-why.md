# 06. Not Doing (and Why)

**Scope:** Not Doing (and Why): detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-router-solo-2026-10-06.md.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/hierarchy-router-solo-2026-10-06.md, no external web dig

## Four exclusions, each with a reason

The source's "Not Doing (and Why)" section lists 4 items. Each is a deferral or rule, and each reason ties back to a principle stated elsewhere in the doc.

### 1. Measurement predicates inside the gate contract

**What it is.** Policy rules that consult instruments directly, so a gate rule could read "block if D above X." This is the generation log's "Measurement predicates in the policy gate" variation, from the Constraint removal lens.

**Why not now.** The source calls it "the deeper integration, gated behind the MVP proving the loop." The log shows why: it scored the top defensibility (D 5) but only S 2, totaling 14 against the finalist's 17. Low S reflects the cost of changing the gate contract, which every other action depends on. Proving the routing loop first means that if measurement-gated routing turns out to be flawed, the gate contract was never touched.

**Principle served.** The gate's contract stays stable while a new kind of proposer is tested against it.

### 2. Routing text corpora by scorer bands in the same MVP

**What it is.** Using the scorer as the instrument for text docs.

**Why not now.** "One artifact class first (images), text second." The Open Questions explain the ordering: both instruments are described as proven, but the detector's claim set is freshest for images.

**Principle served.** One variable at a time. If the MVP fails, the failure is attributable to routing, not to a second instrument.

### 3. Learning or adaptive band adjustment

**What it is.** Letting band edges move automatically based on observed traffic or outcomes.

**Why not.** "Bands are pinned policy, changed only by promote." This one is a rule, not a deferral, and it follows from two commitments. First, the calibration precondition requires pre-registered band edges; an adaptive edge is by definition not pre-registered. Second, the doctrine that measurements are data, never authorization, would be undermined if measurement could silently rewrite the policy that governs it.

**Principle served.** Policy changes go through the audited promote flow, and only there.

### 4. Any new model deployment

**What it is.** Standing up new models as routing targets.

**Why not.** "The lanes are the existing 3-tier Llama runtime + automations." The regime is about where work goes, not what does the work.

**Principle served.** Composition over construction. A new model would add an uncalibrated lane and confound the MVP evaluation.

## Exclusions implied by the generation log

The source also implicitly does not pursue three other variations:

- **Instrument the models' outputs** (route by measured output morphology), Inversion lens, total 13.
- **Triage mesh** (all instruments, one routing table), Combination lens, total 12: broad, but T 2 reflects the difficulty of testing many instruments together.
- **Public intake triage for the Steady Orbit site**, Audience shift lens, total 12: P 2, low pain.

## How the exclusions fit together

Taken together the exclusions protect three things:

- **The gate contract.** Unchanged by the MVP (exclusion 1).
- **Attributability.** One instrument, one artifact class, existing lanes (exclusions 2 and 4).
- **Policy integrity.** Bands change only via promote (exclusion 3).

## When the exclusions lift

The source gives explicit unlock conditions for two. Measurement predicates unlock once the MVP proves the loop. Text routing unlocks after images. The other two (adaptive bands and new models) have no unlock condition and should be read as standing rules for this regime. The stress-test's second-order effect sketches the expected path: once routing is measurement-gated, future instruments become route authorities simply by adding bands to policy, which is how the regime grows without revisiting any of these exclusions.
