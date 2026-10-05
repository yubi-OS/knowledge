# 01 Persistence under re-grading

Scope: the `/visco/persistence` route on the steady-orbit worker: auditing base and loaded score matrices internally, measuring which flipped cells persist under caller-supplied independent re-graded rows, and reporting the inter-pass scorer offset.

## What the route does

`POST /visco/persistence` accepts a corpus-audit query with two matrices and a set of independently re-graded rows. The route audits the base and loaded matrices internally, then measures how many of the flipped cells survive when an independent re-grade is run over the loaded text. It returns the fraction of flips that persisted and reports the inter-pass scorer offset so the caller can see how much the two grading passes disagreed [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md].

The recorded live end-to-end run exercised this: 2 flips were applied, 1 persisted, the persistence fraction was 0.5, the verdict was `partially_persisted`, the base audit read -14.85 and the loaded audit -14.49, and the run id was `cr_1098cf9f0d919960` [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md].

## Why persistence leads the instrument set

The design decision that ordered the instrument set around the re-grade leg came out of the creep-recovery replay of jev-corpus round 3 [source: internal replay record, https://raw.githubusercontent.com/yubi-OS/knowledge/main/knowledge/linear-viscoelasticity/08-creep-recovery-replay.md]. In that replay a blind independent grader read the loaded text and credited all 9 applied flips (9/9), and the measured level moved further from baseline (+3.22 dBc) rather than back toward it. By contrast the text-revert unload leg returned the score matrix exactly, making the recovery fraction R = 1.0 for every edit class under a deterministic scorer. The replay concluded that persistence-under-independent-regrading is the discriminating measurement, and the jev qualification scored `persist_beats_R` at 0.92 [source: internal replay record, https://raw.githubusercontent.com/yubi-OS/knowledge/main/knowledge/linear-viscoelasticity/08-creep-recovery-replay.md]. The build record carries this as the jev-qualified decision "persistence-first" at weight 0.83 [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md].

## The scorer-offset report is load bearing

The same replay quantified why the route must report scorer variance with every result: the replayed baseline read -16.88 dBc where the recorded pass had read -11.11, on the same corpus at the same SHA, a 5.77 dBc grader-pass band. Round 3 was gated on a +0.64 effect sitting inside that 5.8-wide band [source: internal replay record, https://raw.githubusercontent.com/yubi-OS/knowledge/main/knowledge/linear-viscoelasticity/08-creep-recovery-replay.md]. The inter-pass scorer offset on `/visco/persistence` is the API surface for that lesson: a caller can tell whether the persistence fraction it received was measured across grading passes that agree.

## Measurement-theory grounding

The instrument is a corpus-audit analogue of two established measurement ideas.

Test-retest reliability is the degree to which test scores remain unchanged when measuring a stable characteristic on different occasions; it measures the stability of scores [source: https://link.springer.com/rwe/10.1007/978-3-031-17299-1_3001, jev weight 0.8999]. A practical guide defines it as a measure used to assess the consistency or stability of a measurement instrument [source: https://researchmethod.net/test-retest-reliability/, jev weight 0.5259]. Persistence-under-regrading applies the same question to a graded corpus: does the score difference survive a second, independent grading pass?

Inter-annotator agreement is the other parent concept. A survey of agreement metrics across complex structured annotation types compares inter-annotator agreement using distance functions over datasets [source: https://arxiv.org/pdf/2212.09503, jev weight 0.9098], and a selection guide argues for choosing and interpreting agreement measures to promote consistent, reproducible human annotation and evaluation [source: https://arxiv.org/html/2603.06865, jev weight 0.623]. The `/visco/persistence` route differs from classic IAA in one way that matters for the corpus gate: it does not ask whether two raters agree in general, it asks whether a specific recorded flip (a cell that moved from 0 to filled or the reverse) is reproduced by a fresh grader that did not see the original grading.

## Verdict vocabulary

The route emits verdicts on the persistence fraction. The recorded live run shows the `partially_persisted` verdict at fraction 0.5 [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md]; the replay calibration case shows the opposite extreme, all 9 flips persisting (9/9) with the measured level moving away from baseline [source: internal replay record, https://raw.githubusercontent.com/yubi-OS/knowledge/main/knowledge/linear-viscoelasticity/08-creep-recovery-replay.md]. The two points together define the useful range of the instrument: a persistence fraction near 1 means the graded differences are substantive enough to survive re-grading; a fraction near 0 means the flips are scoring noise, and the inter-pass offset tells the caller which of the two grading passes to distrust.
