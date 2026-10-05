# 07. The honesty boundary: what the instruments do and do not claim

**Scope.** The line between an instrumentation outcome and task quality, why the ledger stores the verifier's word without grading it, and why recorded negatives stay recorded.

## Measurement validity is not task performance

Construct validity is about how well a test measures the concept it was designed to evaluate [1], and the construct-validation literature insists that what an instrument measures and what a downstream task requires are different claims needing different evidence [2]. The wayfinder instruments encode exactly that separation. Project provenance for this section: the yubi-OS refs corpus document `pfister-keystone-methods-wayfinder-2026-09-17.md` (internal primary source, unweighted).

- A splice that moves zero bits says the instrument is quantization-silent for that content size on that document.
- A splice that changes the isolated count says the statistic responds to known-different content.
- Neither statement is task quality. The control response carries `task_verdict:"not-applicable"` precisely so the two claims cannot be confused.
- Control summaries are comparable only on the same `frame_id` and `instrument_id`; the frozen-frame discipline is the distribution-shift constraint from doc 02 applied to the reading itself.

The consistency endpoint shows the same boundary in a different place. On map 77, a pfister refs doc measured with a primary, a weak, and a strong appended-note variant came back all 3 quantization-silent with 0 bits changed and sign_exact 3 of 3 against a predicted 0. That is an instrument reading: small appended notes do not move this document's bits on this frame. It is not evidence that the document is unimportant, and the response never scores it.

## The ledger stores the verifier's word, it does not grade it

A pre-registered prediction whose sign matches is an instrumentation outcome: the ledger can count that the sign matched. It cannot certify that the verifier's judgment was good, so the ledger deliberately does not try. The verdicts `kept`, `reverted`, `declined`, `abstained`, `neutral` are stored words from the verifier, and the GET response reports them as contingency counts with n, never as a success rate.

The historical 4 of 10 sign agreement from earlier wayfinder rounds remains a historical count until prospective, pre-registered rows exist. The ledger is where those rows now go. This is the preregistration discipline from doc 06 doing its real work: a post-hoc row marked `preregistered:false` cannot retroactively upgrade a historical count into forward evidence [3][4].

## Recorded negatives stay recorded

The source record preserves its negative results explicitly: the A1 admission failed, sd(u) failed, GL was falsified, the Gaunt check was negative, FCS is not identifiable, the Pennes equation is unidentifiable in this setting, and there is no Raman or IR claim. Nothing in the calibration or outcomes work re-opens them.

Preserving negatives is not decorative. Publication bias, the over-representation of successful hypotheses and the under-reporting of failed ones, distorts entire literatures [5][6][7], and the proposed remedies center on making null and negative results visible through the same channels as positive ones [6][7]. An append-only ledger that accepts `declined` and `neutral` verdicts next to `kept` is that remedy in miniature: the negative row is first-class data, not a footnote.

## What the instruments refuse to become

The 2 deferred variants stayed deferred in their original forms for honesty reasons: an axis-importance statistic would have fed ranking, and a consistency gate would have read as a keep/revert rule. Both were shipped only after reframing as trials that report readings and never verdicts (doc 08). The boundary is enforced structurally, by refused inputs and hard-coded fields, not by prose. That is the difference between an honesty policy and an honesty mechanism.

## Sources

1. https://www.scribbr.com/methodology/construct-validity/ (noul 0.6453)
2. https://journals.sagepub.com/doi/10.1177/10944281221115374 (noul 0.9402)
3. https://www.cos.io/initiatives/prereg (noul 0.8232)
4. https://www.cos.io/initiatives/registered-reports (noul 0.9078)
5. https://pmc.ncbi.nlm.nih.gov/articles/PMC5696751/ (noul 0.9043)
6. https://www.gsb.stanford.edu/faculty-research/publications/ending-publication-bias-values-based-approach-surface-null-negative (noul 0.8813)
7. https://journals.plos.org/plosbiology/article?id=10.1371%2Fjournal.pbio.3003368 (noul 0.8165)
