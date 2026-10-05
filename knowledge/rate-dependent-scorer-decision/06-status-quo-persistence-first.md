# 06: Status quo: deterministic scorer, persistence first

Scope: option A, keeping the deterministic scorer with persistence-first discipline, documenting R as trivially 1, and the cost of carrying no time dimension.

## The option

Option A is the state the replay found: a deterministic scorer with persistence-first discipline (source: yubiOS refs decision doc "Rate-dependent scorer decision", 2026-10-02, internal). The elastic or plastic distinction stays in the persistence measurement, which the replay proved sound: 9 of 9 rows persisted under blind re-grading (internal). The recovery fraction R is documented as trivially 1 and not measured. The claimed virtues are real: zero cost, zero new noise. The admitted limitation is equally real: no time dimension anywhere, so rate never enters the instrument.

## The blind re-grading discipline it rests on

The persistence measurement's credibility comes from blind re-grading, and that practice has an established pedagogy behind it. Blind grading strips identifiers from student work before review to reduce bias, with minimized instructor bias and improved student belief in accuracy listed as advantages (source: https://poorvucenter.yale.edu/teaching/teaching-resource-library/blind-grading, jev weight 0.853; the same Yale Poorvu Center page re-collected at https://poorvucenter.yale.edu/BlindGrading, jev weight 0.831). Double-blind workflows go further: multiple evaluations run on the same work, with a primary grader deciding which evaluation the student sees (source: https://www.crowdmark.com/help/double-blind-grading/, jev weight 0.687). Grading-practice implementation guides codify the same discipline (source: https://learn.acue.org/wp-content/uploads/2024/04/FCB1_LO2A_IG_GradingPractices.pdf, jev weight 0.759).

The 9-of-9 blind re-grade is the audit's version of this: the grader re-reads loaded text without knowing which grades it issued before, so a persistent flip is one that survives an unbiased second look. The Crowdmark multi-evaluation pattern (jev weight 0.687) is, structurally, option B: several evaluations of the same artifact, reconciled by a primary reader. Option A declines to build that step.

## The metrology problem it accepts

A single deterministic pass is a single measurement, and metrology has a specific caution about those: the problem of estimating the accuracy of single measurements is neither addressed nor even recognized in traditional metrology guidance, despite single measurements being widely used in industry, trade, and science (source: https://link.springer.com/article/10.1007/s00769-007-0270-9, jev weight 0.869; same article mirrored at https://oadoi.org/10.1007/s00769-007-0270-9, jev weight 0.608, and a PDF version at 0.569). Methods for assessing the quality of measurement systems and results form a studied field with comparable definitions across metrological standards (source: https://www.mdpi.com/2076-3417/15/17/9393, jev weight 0.780).

Option A accepts that unknown uncertainty. The persistence result, 9 of 9 under blind re-grading, is a strong point estimate, but the instrument reports no band around it: there is no inter-pass offset to quote because there was only one pass. When a reviewer asks how much of the 9-of-9 is instrument and how much is world, the option has no answer.

One audit-methodology search result in the dig was low-quality and is cited only as a negative: a LinkedIn post on limitations of single-metric evaluation carries jev weight 0.035, weak backing, and is not used substantively.

## Why it was not chosen

The decision question was explicitly about what makes R non-trivial (internal). Option A answers it by declaring R unmeasured: the metric is documented as trivially 1 and the rate dimension is simply absent. That is honest but leaves the audit unable to detect rate-dependent effects, which was the motivation for the decision in the first place. Against option B's bounded cost, 2 to 4 extra grader lanes per round on edited rows only, measured in minutes with no new worker code (internal, detailed in doc 03), the zero-cost virtue of A buys a permanent blind spot.

The option retains residual value as a fallback: if multi-pass spread reports near zero across a full round, the status quo is what B degenerates to in practice, and the persistence-first discipline is unchanged either way (see the revisit condition in doc 07).
