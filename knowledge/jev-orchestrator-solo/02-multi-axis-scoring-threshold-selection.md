# Multi-axis scoring and threshold selection in the jev-orchestrator-solo framing log

Scope: the P/S/D/T scoring rubric, the raw variation totals, the threshold cut, and which variations were dropped and why.

## The rubric: 4 axes, 1 to 5 each

The framing log scores every variation on 4 axes labeled P, S, D, T, each 1 to 5, summed to a Sigma. The log does not expand the abbreviations; what the numbers reveal is the behavior of the axes. P (plausibility, presumably) is highest for V1 (5) and the axis on which V6 collapses to 2; S (simplicity or scope-fit) is where V2's everything-port scores 1; D (durability or depth) is V5's peak (4 to 5 range); T (testability) is where V2 scores 1 and V6 scores 3. The totals range from 9 (V6) to 17 (V1 and V5).

This is a weighted-free multi-criteria scoring rubric: 4 equally weighted criteria, integer anchors, sum as the ranking statistic. That structure matches the standard weighted decision matrix, in which each option is rated against a set of criteria and the totals rank the options (https://asana.com/resources/decision-matrix-examples, jev weight 0.45, weak backing; https://www.si-labs.com/en/articles/decision-matrix/, jev weight 0.32, weak backing). The framing log's variant differs from the textbook form in one way: no per-criterion weights. Equal weighting is the honest choice for a solo run where criteria weights would themselves be an unevidenced judgment call.

## The scores

| Variation | Lens | P | S | D | T | Sigma |
|---|---|---|---|---|---|---|
| V1 thin controller | Simplification | 5 | 4 | 3 | 5 | 17 |
| V2 full diagram port | Constraint removal | 4 | 1 | 4 | 1 | 10 |
| V3 gate-as-library | Inversion | 3 | 3 | 2 | 4 | 12 |
| V4 n8n-first template | Audience shift | 4 | 4 | 3 | 4 | 15 |
| V5 ledger extension | Combination | 4 | 5 | 4 | 4 | 17 |
| V6 LLM-scored gate | Inversion | 2 | 3 | 1 | 3 | 9 |
| V7 Sauna-first | Audience shift | 3 | 3 | 3 | 4 | 13 |

## The threshold cut and the drop reasons

Two variations were dropped below threshold, and the log gives structural (not numeric) reasons for both:

- V2 (10): untestable, and 1 on switching cost. A full port including tenants and improve-loop auto-activation cannot be validated with the MVP-grade tests the log proposes elsewhere.
- V6 (9): it violates the diagram's own deterministic-gate invariant, that LLMs hold no authorization. This is the only drop justified by an invariant of the source architecture rather than by score.

The V6 drop is the more instructive one: the score alone (9, lowest) would have dropped it anyway, but the log records the invariant violation as the reason. Scoring ranked it; the invariant convicted it. That ordering, score first, reason recorded, is what makes the log auditable after the fact.

## The threshold in context

The log calls 17 the finalist tier and treats everything at 13 and below as out. V4 at 15 is the interesting boundary case: it is not dropped as a design, it is absorbed as a constraint (see the finalist-merging doc). The cut is therefore not a pure Sigma threshold; it is a threshold plus a disposition per survivor (merge, fold, or drop).

Classic Pugh concept selection treats this differently and instructively: each alternative is scored relative to a datum concept, and concepts with mixed scores are candidates for hybrid concept development (https://www.patsnap.com/resources/blog/articles/pugh-concept-selection-matrix-for-design-comparison/, jev weight 0.32, weak backing). Pugh's own framing is that the method "does not aim to select the best concept, but to develop the best concept," since usually no single concept is superior and each has strengths and weaknesses (https://appinventor.mit.edu/explore/sites/all/files/teachingappcreation/unit4/DesignUnit4.pdf, jev weight 0.55, authoritative backing). The framing log lands in the same place by a different route: V1 and V5 tie at 17, and instead of a tiebreak the two are merged. The totals reveal relative strengths (V5 wins S and D, V1 wins P and T), and the merge exploits exactly that complementarity. Compiling per-alternative scores to reveal where each option excels and falls short is precisely what the Pugh matrix is for (https://www.6sigma.us/six-sigma-in-focus/pugh-matrix/, jev weight 0.57, authoritative backing).

The multi-criteria scoring tradition this sits in traces to Saaty's Analytic Hierarchy Process (1980) and was surveyed alongside related methods by Velasquez and Hester (2013) (https://goalsandprogress.com/weighted-decision-matrix/, jev weight 0.37, weak backing). The framing log is a minimal, unweighted instance of that family: small criteria set, integer anchors, explicit drop reasons, and a merge instead of a tiebreak.
