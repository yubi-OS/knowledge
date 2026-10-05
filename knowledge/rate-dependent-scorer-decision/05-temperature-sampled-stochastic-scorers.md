# 05: Temperature-sampled stochastic scorers

Scope: option C, a grader sampled at T greater than 0 as a noise-temperature instrument, its WLF analogy, and why it was rejected for now.

## What temperature does

Temperature is the sampling parameter that controls how random a model's output is: different temperature settings introduce different levels of randomness when a generative model produces text (source: https://www.ibm.com/think/topics/llm-temperature, jev weight 0.925). Lower settings concentrate the output distribution; higher settings spread it. A grader run at T greater than 0 is therefore a genuinely stochastic instrument: two reads of the same text can legitimately disagree, and the disagreement distribution is a tunable property of the instrument.

## The viscoelastic analogy, done properly

Option C was described in the decision as the most faithful viscoelastic analog (source: yubiOS refs decision doc "Rate-dependent scorer decision", 2026-10-02, internal). The grounding is time-temperature superposition: the principle states that changing temperature from T to T0 is equivalent to multiplying the time scale by a constant shift factor that depends only on the two temperatures (source: https://fractan.net/guides/time-temperature-superposition-wlf-equation, jev weight 0.568). The Williams-Landel-Ferry equation gives that shift factor empirically as a function of temperature with 2 material constants and a reference temperature (source: https://www.tainstruments.com/pdf/literature/RN11.pdf, jev weight 0.701; the Wikipedia treatment at https://en.wikipedia.org/wiki/Williams%E2%80%93Landel%E2%80%93Ferry_equation carries jev weight 0.276, weak backing, and is cited here only for naming). The superposition principle extends beyond viscoelasticity into the viscoplastic domain while keeping the same shift factors (source: https://www.sciencedirect.com/science/article/pii/S0142941821002361, jev weight 0.942).

The analogy: in viscoelasticity, response becomes a function of a temperature that shifts the effective time scale; in option C, the grader's response becomes a function of a noise temperature that shifts the effective uncertainty scale. Raising T widens the pass-spread distribution the way raising temperature widens the relaxation-time spectrum. That is exactly what a rate-dependent instrument wants: a dial that trades determinism for sensitivity to change.

(Reference-quality background on superposition itself sits in the dig at https://en.wikipedia.org/wiki/Time%E2%80%93temperature_superposition with jev weight 0.034, weak backing, and https://www.polymerhubofindia.com/lessons/time-temperature-superposition-wlf-shifts-and-rheological-master-curves at 0.197, weak; the strong backing for this section is the Fractan, TA Instruments, and ScienceDirect sources above.)

## Why it was rejected for now

Two reasons, both from the decision record (internal):

1. Discipline. Temperature sampling imports generation-side nondeterminism into a measurement path the program keeps deterministic, the same discipline that keeps jev probabilities advisory rather than authoritative. The measurement side stays pinned; variation enters only through explicitly repeated passes of the pinned instrument, not through un-pinning the instrument itself.
2. Noise floor. The round-3 lesson says effects at the 0.64 dBc scale are already inside a 5.77 dBc grader-pass band. Added sampling noise would swamp the gate before it added signal: the signal-to-noise ratio would get worse exactly where it is already the binding constraint (see doc 04).

A secondary practical note: the LLM temperature literature is dominated by generation-side guidance, blog-grade material with low source weights in the dig (for example https://sureprompts.com/blog/llm-temperature-sampling-complete-guide-2026 at jev weight 0.128, weak backing, and https://ai-tldr.dev/learn/llm-fundamentals/sampling-and-hallucination/llm-temperature-explained/ at 0.172, weak), so option C's implementation guidance would lean on weak sources; the IBM reference (0.925) covers the concept but not measurement design.

## The revisit condition

The decision does not kill option C, it parks it: if pass spread stays near zero across a full round under option B, revisit C with a wider effect to measure (source: yubiOS refs decision doc, 2026-10-02, internal). The logic is coherent with the analogy: superposition is only useful when the shift is observable. If K = 2 passes of the pinned instrument show no spread, the instrument has no rate dimension to expose, and a temperature dial becomes the next experiment, run against an effect large enough to clear the widened noise floor.
