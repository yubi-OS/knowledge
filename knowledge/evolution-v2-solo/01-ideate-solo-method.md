# 01. The ideate solo method

Scope: How the ideate-solo method generates and scores design variations without a human in the loop, and where its scoring discipline sits in the wider practice of LLM assisted ideation.

## What the framing log is

The evolution v2 framing log is the output of an ideate-solo pass: a structured ideation run performed without dialogue, dated 2026-10-01, scoped as systemic. It produced 7 design variations for the question of how the evolution loop's machine-side run could become self-sustaining, quality assessed by jev at every stage, and honest about its own claims, without inflating blast radius or inventing new trust anchors (source: the framing log, refs/evolution-v2-solo-2026-10-01.md).

Each variation was generated through a named lens and scored on 4 axes, P, S, D and T, summed into a sigma score. The lenses used were Inversion (V1), Constraint removal (V2), Audience shift (V3), Combination (V4 and V6), and Simplification (V5 and V7). Sigma scores ranged from 10 (V1) to 18 (V6 and V7) (source: the framing log).

## Why solo ideation is a distinct method

Research on LLM assisted ideation treats generation and evaluation as separable stages that can each be structured. A review of ideation assisted by large language models documents emerging trends and unaddressed gaps in exactly this pattern of machine generated, machine screened ideas (https://arxiv.org/abs/2503.00946, weight 0.93, authoritative; the same review is available as full text at https://arxiv.org/pdf/2503.00946, weight 0.75, authoritative).

A survey of creativity in LLM based multi-agent systems observes that single-agent pipelines, such as one-shot or simple iterative LLM prompting, execute in isolation and often converge on familiar patterns (https://arxiv.org/pdf/2505.21116, weight 0.81, authoritative). This is the problem the lens system exists to counter: forcing each variation through a different transformation (invert the control, remove a constraint, shift the audience, combine two ideas, simplify) is a deliberate anti-convergence device. The framing log's lens set plays the same role as the classical creativity canons, where SCAMPER style lens lists are the standard structured variation set (https://www.imd.org/blog/innovation/scamper-method-design-thinking/, weight 0.45, weak; https://www.6sigma.us/lean-tools/scamper-technique/, weight 0.39, weak).

## How solo runs score ideas

The framing log's P, S, D, T axes are a small scoring rubric applied consistently across all 7 variations, with a threshold beneath which variations are dropped. This matches the direction of the idea evaluation literature: an empirical study of idea evaluation processes argues that structured criteria matter because evaluation is resource-intensive and error-prone, with the costly failure modes being dismissing breakthrough ideas and advancing flawed ones (https://www.sciencedirect.com/science/article/pii/S0166497226000982, weight 0.89, authoritative). Vendor material on criteria-based scoring, feasibility, impact and strategic alignment, makes the same argument but is marketing adjacent and carries weak weight (https://qmarkets.net/resources/article/idea-matrix/, weight 0.28, weak; https://vizologi.com/key-criteria-for-idea-evaluation-explained/, weight 0.32, weak; https://ideawake.com/idea-evaluation-process-and-criteria/, weight 0.18, weak).

## What the solo pass produced

The pass produced 3 finalists by sigma score: V6 (standard-candle governance, sigma 18), V7 (single-action atom cadence, sigma 18) and V3 (reader-first digest, sigma 16). Two variations were dropped below threshold with recorded reasons: V1 for switching cost, because moving execution of repo pushes across the autonomy boundary was explicitly reserved, and V2 as an untestable bet on email-link security (source: the framing log). The winning direction fused V6 and V7 rather than picking one, which is a combination lens applied at selection time, not only at generation time.

The method's key property, visible in the log's own stress test, is that every judgment is recorded: each variation carries its lens, its axis scores, its drop reason or finalist status. Research on LLM agents as research assistants shows the same discipline applied at the pipeline level: agent pipelines that integrate human input with LLM-driven agents for literature review, experimental planning and data preparation keep the division of labor explicit (https://arxiv.org/pdf/2501.04227, weight 0.73, authoritative).
