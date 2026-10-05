# 02 - The fractalrabbit stochastic mobility simulator and Darling's three tiers

Scope: the NSA fractalrabbit simulator and Darling's 2018 three-tier stochastic mobility model, the generative model that the falsification harness re-implements to produce synthetic corpora with known structure.

## The published model

Darling's paper, "Retro-preferential Stochastic Mobility Models on Random Fractals Under Sporadic Observations," defines a mobility model built from three stochastic components composed in sequence [1] (weight 0.51). The accompanying open-source simulator, published by the US National Security Agency under the name fractalrabbit, creates realistic synthetic sporadic waypoint data sets using those three tiers [2] (weight 0.82).

The three tiers, as described in the official repository README [2] (weight 0.82) and the paper [1] (weight 0.51):

1. Agoraphobic Point Process (AGP). Generates a set V of space points whose limit is a random fractal. The process produces a set of candidate sites rather than a smooth density; the "agoraphobic" name refers to the points avoiding a limiting structure, producing site sets with fractal geometry.
2. Retro-preferential Process (RP). Generates a trajectory through the site set, with strategic homing and self-reinforcing site fidelity as observed in human and animal behavior [1] (weight 0.51). Past visits bias future visits, so the trajectory is recurrent rather than memoryless.
3. Sporadic Reporting Process (SRP). Embeds the trajectory in continuous time and generates reports about location from time to time [3] (weight 0.65). Report times are sporadic and bursty, in contrast to the regular or exponentially spaced times of classical point-process models [2] (weight 0.82).

The reporting tier is what makes the data realistic for the intended application: real location traces are sampled irregularly, and the SRP models that irregularity directly rather than thinning a regular grid.

## Provenance and availability

The repository README is authored by Richard W. R. Darling, with an update dated February 2019 [4] (weak backing, weight 0.35). The same project is mirrored on GitLab under the nationalsecurityagency group [5] (weak backing, weight 0.35). A wiki history page records updates to the stochastic-models documentation in April 2022 [6] (weak backing, weight 0.46).

The paper itself is available as a PDF through ResearchGate, including via Darling's author profile [3] (weight 0.65). The DOI cited by the falsification harness source document is 10.13140/RG.2.2.15267.40489, matching the ResearchGate deposit.

## Fractal stochastic processes in a wider context

Fractal-based stochastic processes appear in other algorithmic traditions as well. A decade-scale review of Stochastic Fractal Search describes a metaheuristic built on diffusion properties of random fractals, unrelated to mobility simulation but part of the same mathematical family of using fractal structure as a generative or search substrate [7] (weight 0.65). The overlap is conceptual: both lines of work exploit the scale-richness of fractal limits, but fractalrabbit uses it to generate realistic site geography, while SFS uses it to explore optimization landscapes.

## Re-implementation for the falsification harness

The harness this corpus documents re-implements the three tiers in pure Python rather than running the original Java simulator. Two fidelity caveats are recorded in the source document itself: the AGP uses rejection sampling rather than the cited random-fractal construction, and the SRP is a 2-state burst process with Pareto gaps rather than Darling's specific burst model. The re-implementation keeps the three-tier composition and the qualitative behaviors (fractal-ish site geography, retro-preferential revisits, bursty reporting) while trading exact mathematical fidelity for programmatic access to per-observation internals.

That tradeoff is the reason the harness can plant anomalies at all: the original simulator is a one-shot CLI producing waypoint output, with no interface for planting rare feature combinations downstream. The re-implementation exposes per-observation features, which is precisely what a planted-anomaly falsification test needs.

## Sources

[1] https://www.researchgate.net/publication/340741639_Retro-preferential_Stochastic_Mobility_Models_on_Random_Fractals_Under_Sporadic_Observations (weight 0.51)
[2] https://github.com/NationalSecurityAgency/fractalrabbit (weight 0.82)
[3] https://www.researchgate.net/profile/Richard-Darling-3/publication/340741639_Retro-preferential_Stochastic_Mobility_Models_on_Random_Fractals_Under_Sporadic_Observations/links/5e9b4eeba6fdcca789244645/Retro-preferential-Stochastic-Mobility-Models-on-Random-Fractals-Under-Sporadic-Observations.pdf (weight 0.65)
[4] https://gitlab.com/nationalsecurityagency/fractalrabbit/-/blob/master/README.md (weight 0.35, weak)
[5] https://gitlab.com/nationalsecurityagency/fractalrabbit/-/blob/430cda5999b23d446b822fc44bf0ac9d963fe916/README.md (weight 0.51, see archive entry; GitLab mirror)
[6] https://github.com/NationalSecurityAgency/fractalrabbit/wiki/_history (weight 0.46, weak)
[7] https://www.sciencedirect.com/org/science/article/pii/S1526149225000438 (weight 0.65)
