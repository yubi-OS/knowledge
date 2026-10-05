# The lens as instrument, not generator

Scope: why the lens measures rather than generates, what its real-vs-control deflection and cell-mobility series are for, and how refs8 proved the rung join beats caller judgment.

## The role split

The unit-round flow separates proposing from measuring. The lens is an instrument, not the generator: its real-versus-control deflection is a detectability filter, and the cell-mobility series (the visco/mobility read) is a measurement output. The map's rungs, with the "prefer joins" rule, are the candidate source on refs/ (source doc, design decision 4).

The distinction is standard measurement theory. Detectability in control systems is a formal property: a system is detectable when every unmeasurable mode is stable, so failures in those modes die out on their own and the measured output is trustworthy for feedback (https://link.springer.com/content/pdf/10.1007/978-1-0716-0590-5_8.pdf, w0.780). Observability is the dual property: whether the internal state can be reconstructed from outputs (https://control.asu.edu/Classes/MAE507/507Lecture09.pdf, w0.722). Applied to the lens: the real-versus-control deflection asks whether a proposed change is distinguishable from noise at all. If the deflection is inside the control band, the candidate is not measurable, and proposing it anyway would put an unmeasurable change through a gate that needs a measurement.

## Filtering before controlling

Signal-conditioning practice makes the same ordering argument: filtering is applied to the measurement prior to its use in a controller, because raw noisy measurements make bad control inputs (https://www.thechemicalengineer.com/features/practical-process-control-part-12-filters/, w0.736). The lens's detectability filter is exactly this: it conditions the candidate stream before the gate consumes it. The quantitative version is the minimum-detectable-change framework, which assesses how large a change must be before it is distinguishable at all (https://www.sciencedirect.com/science/article/pii/S0888327023005642, w0.332, weak backing).

## The mobility series

The cell-mobility series (visco/mobility) is the lens's longitudinal output: how much each corpus cell moves across rounds. It is an instrument reading, so it is comparable across units even though the frozen baseline frames are not (doc 02). This is the instrument-versus-frame split that makes cross-unit comparison possible: instruments are calibrated once and applied repeatedly, frames are rebuilt each round.

Instrument quality is the deciding factor for whether those readings mean anything. Psychometric guidance is blunt: scales and measures need robust evidence of reliability and validity before their data can support conclusions, and using instruments with poor properties undermines the work (https://pmc.ncbi.nlm.nih.gov/articles/PMC10543275/, w0.901). Validation of measuring instruments evaluates exactly the two properties the lens needs: validity (it measures the intended construct) and reliability (it measures it consistently) (https://www.researchgate.net/publication/381009653_Validation_of_Measuring_Instrument_for_Assessment_Purposes_, w0.655). The lens skip-list shipped with refs6 is the operational version: entries the lens cannot measure are excluded from lens-derived inputs rather than being scored as zeros or noise (source doc, refs6).

## Refs8: the rung join out-predicted judgment

Refs8 was the first structure-level round, and its finding is the strongest evidence for the role split: the generator's rung join out-predicted caller judgment 5 out of 5. The map's rungs (the prefer-joins edges between corpus structures) ranked the candidate changes better than the operator's own judgment did in every paired case (source doc, refs8). Two consequences followed. First, the candidate source for refs/ is the map's rungs, not intuition; the flow encodes that. Second, "the generator proposes, the check disposes" (doc 07) is not a polite fiction: the proposal step is genuinely better at ranking candidates than the human or agent judgment it replaces, which is why the flow keeps the generator and gates its output rather than replacing either.

## Why the separation matters for the unit protocol

The whole flow depends on three roles staying distinct: the lens measures detectability and mobility, the generator proposes candidates from the rungs, and the task check keeps or rejects. Merge any two and the measurement stops being independent of the proposal. The unit protocol's one-atomic-change rule (doc 01) gives each role exactly one round-fresh input, and the frozen baseline (doc 02) guarantees the measurement environment is rebuilt cleanly each round. The lens's job ends where the gate begins; it filters and measures, and it never gets the final word.
