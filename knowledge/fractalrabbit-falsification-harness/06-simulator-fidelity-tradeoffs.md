# 06 - Simulator fidelity versus programmatic access

Scope: the tradeoff between re-implementing a published model faithfully and re-implementing it usefully, and the documentation discipline that makes either choice auditable.

## Two goals that pull apart

A ground-truth generator for falsification testing needs two things from a simulator: fidelity to the published model (so the synthetic corpus resembles the phenomenon) and programmatic access (so the harness can plant anomalies and read per-item internals). These pull apart. The highest-fidelity implementation is often a research artifact optimized for producing one kind of output, while the most hackable implementation is a re-implementation that simplifies internals.

The safety-validation literature treats this as the multifidelity problem: simulators for validation must balance accuracy against computational efficiency, and the right fidelity level depends on the specific safety properties being tested, not on fidelity in the abstract [1] (weight 0.79). The same program argues that multifidelity simulation opens new paths toward comprehensive safety validation precisely because different questions need different fidelity levels [2] (weight 0.66). Fidelity assessment is itself a developed discipline in domains like rotorcraft simulation, where fidelity is a prerequisite for most research and development programs and is measured with specific methods and metrics [3] (weight 0.82).

## The documented harness's choice

The falsification harness re-implemented Darling's three-tier mobility model in pure Python instead of running the original Java simulator. The recorded reasons: the execution environment lacks Java and Maven; the original is a one-shot CLI producing waypoint output without exposing per-observation primitives; and planting sparse cells requires controlling the 9-D feature vectors directly (source document: falsification harness, 2026-08-06). The re-implementation is explicit about its simplifications: rejection sampling instead of the random-fractal construction in the Agoraphobic Point Process, and a 2-state burst process with Pareto gaps instead of Darling's specific burst model in the Sporadic Reporting Process.

The published model remains the fidelity anchor: the three-tier composition and the qualitative behaviors (fractal site geography, retro-preferential revisits, bursty reporting) are preserved from the paper and the official NSA repository [4] (weight 0.82) [5] (weight 0.51). What is traded away is exact stochastic equivalence, and the harness records that trade rather than hiding it.

## Documentation makes either choice auditable

Whether a simulator is faithful can only be judged if the simulator is precisely described. The agent-based modeling community has standardized this documentation. The ODD protocol (Overview, Design concepts, Details) is widely accepted and used to document individual- and agent-based models in journal articles [6] (weight 0.88). More recent work proposes structured description protocols aimed at machine reproducibility of agent-based simulation models, with a reproduction package containing everything needed to rerun the model [7] (weight 0.66) and a companion repository implementing that package [8] (weight 0.62). Foundational methodological literature on agent-based modeling established the practice of publishing models in a form others can implement and verify [9] (weight 0.74).

The practical checklist for a harness-grade simulator:

1. State which published algorithms are reproduced exactly and which are approximated.
2. State the approximation for each (rejection sampling for fractal construction; Pareto gaps for burst process).
3. Expose per-item internals needed by the test (per-observation feature vectors).
4. Keep the generator seeded and cheap to rerun, so the falsification suite runs on every change.
5. Record provenance: which paper, which repository, which DOI.

## When approximation invalidates the test

An approximate generator can still ground a falsification test, but only for properties expected to be robust to the approximation. The harness's T1 (fit quality) and T3 (invariant) results depend on generic low-rank cluster structure, which the simplified generator still exhibits. T2 (sparse-cell recovery) depends on the exact geometry of natural clustering, which is exactly what the simplification alters. The honest reading, recorded in the source document as an open review question, is that T2's instability might partly be an artifact of the approximate generator rather than a property of the detector. That ambiguity is the cost of choosing access over fidelity, and it is the cost the harness accepted deliberately.

## Sources

[1] https://onlinelibrary.wiley.com/doi/epdf/10.1002/aaai.12141 (weight 0.79)
[2] https://onlinelibrary.wiley.com/doi/full/10.1002/aaai.12141 (weight 0.66)
[3] https://hal.science/hal-03592354/document (weight 0.82)
[4] https://github.com/NationalSecurityAgency/fractalrabbit (weight 0.82)
[5] https://www.researchgate.net/publication/340741639_Retro-preferential_Stochastic_Mobility_Models_on_Random_Fractals_Under_Sporadic_Observations (weight 0.51)
[6] https://www.jasss.org/23/2/7.html (weight 0.88)
[7] https://arxiv.org/html/2607.28027v1 (weight 0.66)
[8] https://github.com/AgentLabCn/visa (weight 0.62)
[9] https://www.pnas.org/doi/10.1073/pnas.082080899 (weight 0.74)
