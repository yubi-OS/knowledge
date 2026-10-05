# 04 Forecasting and time-series agents: LEAF, Nexus, Synapse

Scope: the three forecasting and time-series links of the 22 (links 9, 10, 20), the stale-data hazard that motivates them, and the deflection statistics the program would put on their win matrices.

## The forecasting-agent landscape

LLM-based forecasting systems now combine language-based reasoning with temporal data, evidence retrieval, external tools, and iterative prediction; a 2026 survey investigates this design space [arxiv.org/abs/2608.23058v1, weight 0.11, weak backing]. Investment-management surveys document the same wave from the finance side: LLM agents capable of complex reasoning, tool use, and autonomous decision-making [dl.acm.org/doi/10.1145/3768292.3770387, weight 0.88]. Benchmarks exist and are maturing: InvestorBench evaluates LLM agents on financial decision-making tasks [aclanthology.org/2025.acl-long.126, weight 0.83], and the Finance Agent Benchmark measures LLMs on real-world financial analysis [arxiv.org/abs/2508.00828, weight 0.79]. An event-driven framework transforms financial news and corporate announcements into forecasts for service-level prediction [link.springer.com/article/10.1007/s11761-026-00508-8, weight 0.46, weak backing].

## LEAF and the stale-data hazard

The synthesis document's link 9 is LEAF, an event-augmented forecasting benchmark with dual-agent consensus, and its headline criticism is that stale data inflated one reported figure by 147 percent, which the document reads as a null-failure in its own right: a comparison computed on outdated evidence measures the data's age, not the method. An aggregator entry describes LEAF's motivation: current forecasting benchmarks rely on narrow or static data, making it hard to tell whether LLMs genuinely forecast [benchmarklist.com, weight 0.11, weak backing]. The 147 percent figure is a source-document claim and is not corroborated by this dig, so it is recorded as reported.

The program's mapping is date-stratified fibre: a ΔV2 deflection on an event × target incidence matrix where the swaps preserve margins within each date stratum, so the null cannot hide a stale-data drift. This is the MP / Narayana moment machinery applied to a benchmark design the field is actively building.

## Nexus: dual-resolution outlook

The synthesis document's link 10 is Nexus, a dual-resolution Macro/Micro forecasting outlook. The dig did not surface the Nexus paper itself. The adjacent literature is consistent with the pattern: forecasting systems that mix macro and micro evidence are common, and the event-driven service framework above is one instance of structured, multi-source forecasting. The program's proposed statistic for Nexus is a shuffled-context permutation plus a caustic check on macro/micro rank collapse: if the two resolution levels' rankings collapse under a margin-preserving context swap, the claimed division of labor between resolutions was not carrying structure. As with LEAP in the formal-methods family, this corpus records the Nexus-specific claims as source-document assertions pending a deflection measurement.

## Synapse: TSFM adaptive arbitration

The synthesis document's link 20 is Synapse, a time-series foundation model (TSFM) adaptive arbitration layer that selects among foundation models at timestamp granularity. The TSFM benchmarking context is well covered by the dig: a dedicated position paper lays out benchmarking challenges and requirements for time-series foundation models [arxiv.org/html/2510.13654v1, weight 0.81]; FoundTS provides comprehensive unified benchmarking across foundation models for forecasting [arxiv.org/html/2410.11802v4, weight 0.93]; TimeSeriesGym is a scalable benchmark for time-series machine-learning engineering agents [github.com/moment-timeseries-foundation-model/TimeSeriesGym, weight 0.62]; and practitioner tooling surveys the foundation-model field [machinelearningmastery.com, weight 0.57, weak backing]. A community comparison of 13 time-series classification methods under one frozen protocol illustrates the win-matrix shape these evaluations take [aimultiple.com, weight 0.25, weak backing].

Synapse's win matrix is the synthesis document's special case: the document says it is the only one of the 22 whose null does not reduce to a plain row-and-column-sum-preserving swap, and marks the open follow-up as a column-constrained curveball. That is follow-up 5 in the source document's own list, and this corpus carries it forward as an open item rather than a completed measurement.

## Standing caveat

The forecasting family's external grounding is the strongest of the agentic groups in this dig: the benchmarks and surveys are real, current, and weighted high. What remains program-side is the deflection layer: none of the surfaced benchmark papers report a margin-preserving null over their comparison matrices, and the synthesis document's specific numbers (147 percent inflation, arbitration win rates) await that measurement.
