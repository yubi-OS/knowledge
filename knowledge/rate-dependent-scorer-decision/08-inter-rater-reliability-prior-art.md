# 08: Inter-rater reliability prior art

Scope: the measurement-theory grounding for multi-pass grading: test-retest reliability, intraclass correlation, Krippendorff alpha, and self-consistency sampling.

## Test-retest reliability and the ICC family

Reliability, the consistency of a test or measurement, is frequently quantified in the measurement sciences with the intraclass correlation coefficient (source: https://www.researchgate.net/publication/8028009_Quantifying_Test-Retest_Reliability_Using_The_Intraclass_Correlation_Coefficient_and_the_SEM, jev weight 0.525). ICC is a widely used reliability index in test-retest, intrarater, and interrater reliability analyses (source: https://www.sciencedirect.com/science/article/pii/S1556370716000158, jev weight 0.955). For patient-reported outcomes, test-retest guidance lists intraclass correlation coefficients and the assessment time period as the key considerations for reliability evaluations (source: https://oadoi.org/10.1007/s11136-018-2076-0, jev weight 0.878).

The tooling literature shows what a mature ICC workflow reports: the full Shrout-Fleiss family of ICCs, an F-test, confidence intervals, a paired t-test for systematic change, the standard error of measurement, and the minimal detectable change (source: https://metricgate.com/docs/test-retest-icc/, jev weight 0.638). That list is exactly the reporting shape a multi-pass grader protocol wants: not one agreement number, but an interval around the measurement and a threshold below which observed change is indistinguishable from noise.

## The mapping to the grader protocol

Map the protocol of doc 03 onto the ICC frame (protocol facts internal, from the yubiOS refs decision doc of 2026-10-02; the mapping framing is this corpus's own):

1. The K grader passes are the test occasions: repeated administrations of the same instrument on the same units.
2. The edited rows are the units of analysis.
3. per_pass_fractions, the per-pass persistence fractions reported by /visco/persistence, are the per-occasion scores.
4. scorer_variance.inter_pass_offset_dbc plays the role of the standard error of measurement: the band within which a change is attributable to the instrument rather than the world.
5. The elastic-by-uncertainty rule (a flip credited inconsistently across passes counts as recovered) is a minimal detectable change rule: change below the pass band does not count as real.

The ICC literature's insistence on reporting the assessment time period alongside the coefficient (jev weight 0.878) also maps: the passes must be independent reads of the same loaded text, taken within one round, or the agreement statistic mixes instrument noise with real drift.

## Krippendorff alpha for coder agreement

Where units are text and coders may be few or partial, content analysis uses Krippendorff's alpha. It is an alternative to Cohen's kappa for determining inter-rater reliability that ignores missing data entirely and handles various sample sizes (source: https://www.statisticshowto.com/krippendorffs-alpha/, jev weight 0.720). A dedicated tooling paper highlights its flexibility across levels of measurement and its capacity to manage missing data (source: https://www.sciencedirect.com/science/article/pii/S2215016123005411, jev weight 0.908; a calculator reference at https://www.cogn-iq.org/statistical-tools/krippendorff-alpha/, jev weight 0.850). Alpha has been used in content analysis since the 1970s for coding sets of units of analysis (source: https://en.wikipedia.org/wiki/Krippendorff%27s_alpha, jev weight 0.215, weak backing, labeled as such).

The relevance to the protocol: edited rows only means each round's agreement matrix is small and ragged, exactly the missing-data regime where alpha outperforms kappa-family coefficients. If the pass count K grows or rows are dropped mid-round, alpha is the statistic that degrades gracefully.

## Self-consistency sampling as the computational cousin

The LLM-evaluation literature supplies the computational analog: self-consistency samples a model multiple times and aggregates, improving reliability and reducing hallucination (source: https://aclanthology.org/2025.naacl-long.184/, jev weight 0.924, from this doc's dig sibling in doc 03). The distinction this corpus keeps, consistent with the consistency-of-evaluators taxonomy (source: https://arxiv.org/pdf/2412.00543, jev weight 0.850), is that self-consistency in sampling decoding is a property of the grader's repeated reads, not of the scoring scale. The multi-pass protocol exercises exactly that half: same pinned instrument, repeated reads, spread as the output.

## Why prior art supports K = 2 as a floor

Test-retest designs need at least 2 occasions by definition; ICC and alpha are both computable at K = 2, with widening uncertainty as K shrinks. The protocol's K = 2 minimum (internal) is the smallest design that produces a real pass spread, and the ICC reporting stack (confidence interval, SEM, minimal detectable change) is the form the round report should converge toward as rounds accumulate pass data.
