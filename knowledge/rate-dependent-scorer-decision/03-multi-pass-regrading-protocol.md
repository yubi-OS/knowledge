# 03: The multi-pass re-grading protocol

Scope: option B, the adopted design: K independent grader passes per edited row as the rate dimension, with pass spread separating plastic credit from noise.

## The protocol

The adopted round protocol re-grades each edited doc's loaded text with K independent grader passes, K = 2 minimum, over edited rows only, honoring the pinned-scorer discipline (source: yubiOS refs decision doc "Rate-dependent scorer decision", 2026-10-02, internal). The pass spread is the rate dimension. The decision rule is a two-sided filter:

1. A flip credited by all passes is plastically real: it survives every independent reading, so it is credited as persistent change.
2. A flip credited inconsistently across passes sits inside measurement noise: its metric contribution is elastic-by-uncertainty, counted as recovered to the extent the passes disagree.

## R becomes a distribution

Under the protocol, R is no longer a single number but a distribution of per-pass persistence fractions. This is exactly the shape the persistence endpoint already consumes and reports: POST /visco/persistence takes regraded: [{pass, rows}] and reports scorer_variance.inter_pass_offset_dbc and per_pass_fractions (source: yubiOS refs decision doc, 2026-10-02, internal). Feeding both passes to the existing endpoint is the whole integration; no new worker code is required.

## Measurement-theory grounding

The protocol is a standard measurement-design move. Inter-rater reliability is the degree of agreement among independent raters who assess the same items, and it evaluates whether different raters applying the same measurement procedure produce consistent results (source: https://en.wikipedia.org/wiki/Inter-rater_reliability, collected in the dig; https://researchmethod.net/inter-rater-reliability/, jev weight 0.579; https://statisticsbyjim.com/hypothesis-testing/inter-rater-reliability/, jev weight 0.666). The K passes are the raters, the edited rows are the items, and the pass spread is the agreement statistic. The correct coefficient depends on the scale of measurement and the number and selection of raters (source: https://researchmethod.net/inter-rater-reliability/, jev weight 0.579), which in this instrument means the per-pass fraction scale and K = 2 as the floor.

## Self-consistency prior art in LLM evaluation

The LLM-evaluation literature independently arrived at the same design for graders. Self-consistency methods sample multiple reasoning paths and aggregate, improving reliability and mitigating hallucination (source: https://aclanthology.org/2025.naacl-long.184/, jev weight 0.924; https://arxiv.org/html/2408.17017v1, jev weight 0.867). Applied specifically to grading, self-consistency with multiple samples is used to make LLM grading reliable (source: https://www.mdpi.com/2504-4990/8/3/74, jev weight 0.794). A consistency study of LLM evaluators separates two aspects: interscale consistency across scoring scales and self-consistency in sampling decoding, compared across 4 state-of-the-art instruction-following LLMs (source: https://arxiv.org/pdf/2412.00543, jev weight 0.850). The multi-pass protocol exercises the self-consistency half of that taxonomy: repeated sampling of the same grader on the same input, with spread as the reported statistic.

The dynamic self-consistency literature also flags the cost side: sampling the model multiple times brings significant computational cost, which motivates adaptive schemes that spend samples only where needed (source: https://arxiv.org/html/2408.17017v1, jev weight 0.867). The protocol's edited-rows-only restriction is the same economy: full-corpus re-grading is not needed, only the rows a round touched.

## Cost and noise accounting

The protocol's cost is 2 to 4 extra grader lanes per round on edited rows only, measured in minutes, with no new worker code (source: yubiOS refs decision doc, 2026-10-02, internal). Its noise contribution is bounded and, critically, observed rather than assumed: every pass lands in the per_pass_fractions report, and the inter-pass offset is computed by the endpoint. The b_no_new_noise qualification concern (jev weight 0.67, internal) is that this bounded noise dimension could still interfere with the round gate; the reporting requirement is the safeguard, and the re-evaluation trigger (doc 07) closes the loop after one round of real pass-spread data.

What the protocol deliberately does not do is sample the grader at elevated temperature: passes are independent runs of the same pinned instrument, not temperature variants (doc 05).
