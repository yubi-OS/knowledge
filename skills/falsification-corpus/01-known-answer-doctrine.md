# 01: The known-answer doctrine

**Scope:** What a known-answer corpus is, why the instrument never validates itself, the skill's use and no-use boundaries, and where the doctrine comes from.

Grounding spine: the source doc `yubi-OS/yubiOS skills/falsification-corpus/SKILL.md` (the "source doc" below), plus searXNG digs weighted by jev noul.

## What the corpus is

The source doc defines a falsification corpus as a known-answer corpus: synthetic classes with analytically-known or pinned expected values, run through the instrument BEFORE real data, so every failure is attributable to the instrument, not the data. The two words are doing exact work here. "Synthetic" means made artificially rather than arising naturally (Merriam-Webster, jev weight 0.83, https://www.merriam-webster.com/dictionary/synthetic; Cambridge Dictionary, weight 0.70, https://dictionary.cambridge.org/dictionary/english/synthetic). "Known" means the answers are established in advance, not discovered from the run (Merriam-Webster, weight 0.79, https://www.merriam-webster.com/dictionary/known; Cambridge Dictionary, weight 0.77, https://dictionary.cambridge.org/dictionary/english/known). A known-answer corpus is therefore an artifact you build where you already hold the right answer, and the instrument's job is to recover it.

## The doctrine

The source doc states the doctrine in one line: the instrument never validates itself. Only a corpus with known answers can pass or fail it, and every gate is written before any measurement. An instrument reporting its own health is circular; the corpus is the external check that breaks the circle.

This is not a yubiOS invention. The digs show instrument validation is a formal external-requirement pattern. ASTM E2857, the standard guide for validating analytical methods, describes method validation as a process of demonstrating that the method meets the required performance capabilities, and notes that international standards such as ISO/IEC 17025, certifying bodies, and regulatory agencies require evidence that analytical methods are capable of producing valid results (jev weight 0.84, https://www.astm.org/e2857-22.html). That is the same logic: the method is not trusted until an independent demonstration of capability exists. The falsification corpus is that demonstration, built for a numeric measurement instrument.

The weak-backing dig also points the same direction: Fovea Lab's lab note on "synthetic ground truth" treats generated data with known properties as a method for testing analysis pipelines (jev weight 0.32, weak backing, https://www.fovealab.com/lab-notes/method/synthetic-ground-truth). Treat that as corroboration only.

## Provenance

Per the source doc, the skill was distilled from the 2026-10-06 supersolid falsification-corpus run: edge-standard-v1 measured against fractal droplets, with the canonical record at `refs/sierpinski-supersolid-connection-2026-10-06.md` on yubi-OS/yubiOS. The skill's changelog marks v1 (2026-10-06) and states that all measured anchors, anti-patterns, and failure examples come from that run and nothing is projected. Every measured number quoted in this corpus (D 0.9478, the ~12% ink cliff, the 4.5e-5 parity delta, and the rest) traces to that run through the source doc.

## When to use it

The source doc lists 4 triggers:

1. A measurement instrument (or a change to one) is about to be trusted on real data.
2. A normalization rule, component filter, or quality gate was edited and you must prove it did not silently change semantics.
3. Two implementations of the same instrument must be shown equivalent.
4. A published claim rests on a morphology read and you must test whether the data can even support it.

## When NOT to use it

The source doc is explicit about the boundary: NOT for scoring taste axes (that is the taste-engine skill's job), NOT for authoring research corpora (knowledge-corpus-mint), and NOT for general statistical testing. The corpus exists to falsify an instrument, not to train one. Every use stays inside the frontmatter description's scope; anything beyond it is a different skill's job.

## Why the order of the pipeline matters

The source doc presents a 7-step pipeline in strict order: pre-registration, generator design, gate design, advisor review before build, L-convergence calibration before gate evaluation, live-route parity, and the real-data pass protocol. "No step is optional." The doctrine makes the order load-bearing: prediction comes before measurement, calibration comes before gate evaluation, and parity comes before any real-data claim. The remaining docs in this corpus walk the steps that jev scored as load-bearing, and the anti-pattern doc records what happens when the order is violated.
