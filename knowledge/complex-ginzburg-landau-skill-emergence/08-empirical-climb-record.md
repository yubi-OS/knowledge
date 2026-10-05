# 08 - The empirical climb record as a candidate phase transition

**Scope:** The guided-curve-ideate empirical record: the climb from 0.2993 to 0.7657 across cycles 4 to 23, a critical corpus size in the 80 to 500 range, saturation near 0.77, and defect rows.

Source doc: `refs_corpus/complex-ginzburg-landau-skill-emergence.md` (yubi-OS/yubiOS refs/). Weights in parentheses are jev noul scores from the research DB. Statements marked "record" come from the source doc's internal measurement record and are reported as recorded, not independently verified.

## The record

The guided-curve-ideate skill has measured a 9-primitive coverage matrix across 23 cycles. The recorded PC1+PC2 values are:

| Cycle | Corpus | PC1+PC2 |
|---|---|---:|
| Paper baseline | small | 0.2993 |
| 4 | 79 skills | 0.6901 |
| 5 | 79 + W18 sweep | 0.8080 |
| 7 | 474 skills, real 24-D | 0.8538 |
| 11 | 1091 (with self) | 0.7635 |
| 12 | 1472 (section-split self) | 0.7657 |
| 14 | 2286 (paper target) | 0.7657 |
| 16 | 1472, 50-digit precision | 0.7656564170155055748523409 |
| 20 | 2286 | 0.723529 |

(record, source doc §3.5)

The climb from 0.2993 to 0.7657, a delta of +0.4664, is the observation the GL framing is meant to explain (record, source doc §1).

## The transition reading, stated carefully

The record supports three regime statements. Below the crossing, coverage is sparse and PC1+PC2 is low (V_2 ≈ 0.30 at baseline). Across cycles 4 to 7, the corpus grew from 79 to 474 rows while PC1+PC2 went 0.69 to 0.85, a steep climb consistent with a critical point in the N ≈ 80 to 500 range. From cycle 14 onward, values hover at 0.72 to 0.77 regardless of corpus expansion, which reads as saturation at the floor of the ordered phase (record, source doc §3.5).

The mean-field GL prediction M² ∝ −α_eff/β on the ordered side would place the critical point in the same range (record, source doc §3.5). But the record itself supplies the caution: the +0.4664 climb could be a smooth crossover rather than a sharp transition, and the diagnostics in doc 09 are what distinguish the two (source doc §5, caveat 7).

## The external parallel, and its warning

The corpus debate has a direct counterpart in the LLM emergence literature. Emergent abilities are defined as capabilities present in larger-scale models but absent in smaller ones, their interest resting on two properties: sharpness, transitioning seemingly instantaneously, and unpredictability (w=0.831, https://arxiv.org/abs/2304.15004). A comprehensive survey of the phenomenon analyzes existing definitions and finds inconsistencies in how emergence is operationalized across studies (w=0.920, https://arxiv.org/html/2503.05788v2).

The critical warning comes from the "mirage" analysis: what looks like an abrupt emergence transition can be an artifact of the metric chosen to measure it. With a different, continuous metric, the same underlying model behavior can look smooth (w=0.969, https://proceedings.neurips.cc/paper_files/paper/2023/hash/adc98a266f45005c403b8311ca7e8bd7-Abstract-Conference.html; w=0.934, https://arxiv.org/pdf/2304.15004). The survey's synthesis concludes that the assumption of scale as the primary driver oversimplifies a more complex picture (w=0.854, https://arxiv.org/html/2503.05788v2).

The parallel is exact enough to transfer: PC1+PC2 is a metric, chosen by the measurement framework. A different metric could make the corpus climb look smooth or sharper. The corpus record already contains a hint of this: cycle 20's value of 0.723529 was measured under consensus OR scoring, and the same corpus scored 0.7657 under other protocols, a Jaccard disagreement of 0.182 between scoring methods (record, source doc §3.5, §1).

## Defects in the record

Cycle 22's manual scoring produced a coverage_sum_distribution of {0: 18, 1: 34, 2: 19, 3: 8, 4: 2}: 18 rows with zero primitive coverage, 34 with one, and so on (record, source doc §3.7). These zero-coverage rows are scattered across memory files rather than arranged periodically, so the record calls them disordered defects, more like a vortex glass than an Abrikosov lattice (see doc 10). The self-corpus is structurally sparse with density 1.284 versus 8.449 for the yubiOS corpus (record, source doc §3.7).

The cross-regime PCA decomposition from cycle 23 shows PC1 is dominated by the eligible-versus-refused contrast: 89.1% under keyword scoring, 77.2% under manual, and 29.7% under consensus (record, source doc §6). This gives the structural explanation for the climb: more corpus means fewer defects, a larger ordered fraction, and a larger PC1+PC2 (record, source doc §6). It is a structural explanation, not yet a causal one; it has no field dynamics behind it (source doc errata E3).

## What would settle it

Three measurements would move the record from vocabulary to testable model: V_2 at fixed corpus sizes 100, 200, 500, 1000, 2000, 5000 to locate N_c; a bootstrap fluctuation peak near N_c; and a metric-sensitivity check repeating the climb under a different scoring protocol to rule out the mirage effect (record, source doc §4.2, §4.4; w=0.969, https://proceedings.neurips.cc/paper_files/paper/2023/hash/adc98a266f45005c403b8311ca7e8bd7-Abstract-Conference.html).
