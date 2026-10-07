# 02: Pre-registration

**Scope:** Pre-registration discipline: pinned instrument parameters, predicted bands per generator class, pass/fail gates, and the dated amendments log, all committed before any measurement.

Grounding spine: the source doc `yubi-OS/yubiOS skills/falsification-corpus/SKILL.md`, plus searXNG digs weighted by jev noul.

## What gets written down

The source doc requires that before ANY measurement you write down and commit 4 things:

1. **The instrument's pinned parameters.** The worked example is edge-standard-v1: MAX_GRID=512, TARGET_COVERAGE=0.06, MIN_COMPONENT=12, window 4..64 px at 8 log scales [4,6,9,13,20,29,43,64].
2. **The predicted band for each generator class**, on the pinned scale set, with the exact subset of scales the gate uses. Not "roughly 1.6": a numeric band on named scales.
3. **The pass/fail gate:** band, r2 floor, evaluation scale, and which classes it applies to.
4. **An amendments log file**, dated, empty until needed.

The rule that binds it together: prediction comes before measurement, always. A gate tuned after seeing results is not a gate.

## Why pre-registration carries weight

The digs show this is the same commitment device that research methods formalized. The Center for Open Science defines preregistration as specifying your research plan in advance of your study and submitting it to a registry, which "creates a specific plan for the upcoming study" and "helps to distinguish planned from unplanned work" (jev weight 0.82, https://www.cos.io/initiatives/prereg). The American Psychological Association describes preregistration as specifying and sharing the details of research in a public registry before conducting the study (jev weight 0.89, https://www.apa.org/pubs/journals/resources/preregistration). A Stanford open-design guide adds the operational content: a pre-registration lists your study design, measures, hypotheses, exclusion criteria, and planned analyses (jev weight 0.55, https://dsi-cores.github.io/OpenByDesign/01-research-practices-%28practical%29/01-preregistration.html).

Map those onto the corpus and the correspondence is exact: pinned parameters are the design, predicted bands are the hypotheses, and the gate is the planned analysis with its exclusion criteria. The amendments log is the registry's role of making the commitment auditable. A weak-backed source (Wikipedia's preregistration article, jev weight 0.46) frames the practice's purpose as distinguishing confirmatory from exploratory analyses; the source doc's phrase "a gate tuned after seeing results is not a gate" is the same distinction stated for measurement instruments.

## The predicted band is the testable object

The source doc makes the predicted band per generator class the centerpiece. A class with an analytically-known local slope (the Sierpinski gasket at 1.585 over scales {13,20,29,43,64}, band +/- 0.05) gives the gate something definite to accept or reject. Without a band there is no falsification, only description: the instrument always reads "something," and nothing can be wrong. The band must be computed on the pinned scale set with the exact gate subset named in advance, because a band evaluated on a different scale subset than the gate uses is a different claim.

## The amendments log: empty until needed

The source doc requires a dated amendments log file that starts empty. Its role is to make the only legal form of gate change visible and timed: pre-run, with a-priori justification, logged with the date. If an amendment is discovered to be necessary mid-run or after results, the log is where the discipline shows itself by absence. An empty log at run time is the proof that the gate you evaluated is the gate you declared.

## Failure mode this doc prevents

The entire downstream pipeline depends on this step. The anti-patterns doc records post-hoc gate movement as the failure that "converts a falsification test into a rubber stamp," and gate windows written against imagined scales as the failure that makes a gate "unfalsifiable and unfailable." Both are pre-registration failures: they are fixed by writing the gate fully and honestly before the first measurement, and by never touching it after.
