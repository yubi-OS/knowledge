# Non-destructive recommendations: nothing the map suggests can delete a source

Scope: how the audit removed destructive authority from the wayfinder, made outliers review-only, shrank synthetic ADD to one row, and kept every candidate a hypothesis.

## The defect

The pre-audit isolation output authorized deleting a source. A geometric outlier in the embedding map, which is one of the weakest signals the system produces, could be translated by the operator surface into an instruction to remove a real document from the corpus. The synthetic-ADD probe compounded the problem by cloning three rows per synthetic insertion, tripling the footprint of an exploratory action. Neither behavior matched what the geometry can actually justify.

## The repair

Three changes closed the gap:

1. Isolation no longer authorizes deleting a source. Outliers are review-only. The map can flag a point; it cannot remove a document.
2. Synthetic ADD uses one row rather than three cloned rows. A probe inserts one hypothesis, not three copies of one.
3. Candidates remain hypotheses. Acting on a candidate requires content inspection and a task check; no path from geometry to mutation exists without those two gates.

## Why the guard pattern is standard

The audit's position matches the direction mainstream agent systems have taken. Microsoft's security alert triage agent is built around the fact that an automated classifier cannot be trusted to act alone: it identifies "which alerts represent real attacks and which are false positives" so that analysts can focus on real threats, with "transparent, step-by-step reasoning to support every decision" (https://learn.microsoft.com/en-us/defender-xdr/security-alert-triage-agent, weight 0.879). The agent proposes; a human with content access disposes.

The same division appears in safety-critical automation. IIHS rates partial automation systems specifically on their safeguards, treating driver monitoring and intervention limits as first-class evaluation criteria rather than optional extras (https://www.iihs.org/ratings/partial-automation-safeguards, weight 0.532). A weaker source in this dig frames the category directly: autonomy red lines are "the categorical, non-negotiable limits on what an agent can do without human approval", and teams that defer defining them get an incident to define the boundaries instead (https://tianpan.co/blog/2026/05/05/pre-deployment-autonomy-red-lines-ai-agents, weight 0.454, weak).

Outlier handling in data practice follows the same shape: detect with numbers, diagnose the cause, and only then decide whether to keep, transform, or remove (https://metricgate.com/blogs/workflow-for-detecting-and-handling-outliers/, weight 0.253, weak). Removal is the last step of a review, never the output of a detector.

## Why geometry cannot justify deletion

An outlier in the embedding map means "far from other points under the current embedding and projection". That is a statement about the representation, not about the document. The causes include a misfit chunking choice, a lossy pooled embedding, a projection artifact, or a document that is genuinely unlike the rest of the corpus. Only the last of those is even a candidate reason to change a corpus, and deciding between them requires reading the source, which is exactly the content-inspection gate the audit added.

The synthetic-ADD reduction follows the same logic. Cloning three rows per insertion tripled the geometric footprint of a probe and made isolation results on synthetic data harder to interpret; one row makes the probe minimal and its result attributable.

## Candidates as hypotheses

The surviving recommendation path is deliberately weak. A candidate is a claim that a document might deserve attention, carrying the geometric evidence that produced it. Turning a candidate into an edit requires two gates: content inspection (a human or agent reads the source) and a task check (the proposed edit must serve a stated task). This mirrors the discipline the audit demands elsewhere: the sampler must state what it is, the measurement must separate channels, and the evidence standard doc 10 covers separates passing tests from predictive usefulness. A recommendation that cannot act without passing two gates is the correct strength for a signal that comes from anonymous azimuthal sectors and unvalidated axes.

## What this does not fix

The guardrail changes authorization, not signal quality. Isolation still has no validated semantic meaning (doc 05), and the review-only path still depends on the reviewer actually inspecting content. What changed is the blast radius: the worst outcome of a bad geometric signal is now a wasted review, not a deleted source.
