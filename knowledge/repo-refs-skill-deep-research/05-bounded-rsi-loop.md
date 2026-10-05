# 05 - The Bounded RSI Loop on a Documentation Archive

Scope: recursive self-improvement applied to a documentation archive under a strict bound: gap-map, hypothesis, single edit, re-map, and the fixpoint-or-continue rule with a cycle cap.

## The bounded and open-ended split, from the current literature

The load-bearing distinction comes from a 2026 taxonomy paper that separates bounded self-refinement, characterized as convergent, evaluable, and industrial practice, from open-ended recursive self-improvement, which remains bounded by grounding requirements, collapse dynamics, and compute constraints on every measured axis (https://arxiv.org/abs/2607.07663, jev weight 0.70, high). The same paper frames the field as a continuum of increasing AI autonomy in the improvement loop: humans writing all code before 2023, through chatbot-assisted coding and autonomous coding agents, to agents that delegate work to other agents, ending at the spectrum's edge with agents that close the loop themselves (https://arxiv.org/html/2607.07663, jev weight 0.65, high).

A practitioner definition aligns with that split: recursive self-improvement is a loop in which a system makes a persistent change that improves its future performance and its ability to produce subsequent improvements (https://www.philschmid.de/recursive-self-improvement, jev weight 0.49, weak). An industry guide adds the bound as an observed fact: every real example running today is bounded; agents rewrite code, optimize runs, or generate harder tasks for themselves within limits (https://datasciencedojo.com/blog/recursive-self-improvement-agentic-ai/, jev weight 0.14, weak). For an archive-maintenance loop this is the correct design posture: keep the loop in the bounded half of the taxonomy, where each cycle is evaluable.

## Document repair as the concrete instantiation

The closest published analog to improving documentation in a closed loop is the iterative document repair protocol: a closed-loop evaluation method in which each episode runs for a bounded number of iterations, a tutor localizes the earliest incorrect step and generates policy-dependent feedback, and a student produces a revision conditioned on that feedback (https://link.springer.com/content/pdf/10.1007/978-3-032-36033-5_19.pdf?pdf=inline+link, jev weight 0.82, high). Mapping that onto a docs archive: the gap-map is the localization step, the hypothesis is the policy-dependent feedback, and the single edit is the revision. The iteration cap is not incidental, it is what makes the episodes evaluable.

Feedback quality is the measured ingredient in whether such loops help. A meta-analysis in the review literature finds that giving feedback is an effective strategy for improving achievement (https://journals.sagepub.com/doi/abs/10.3102/003465430298487, jev weight 0.78, high). A vision-system implementation shows the loop mechanics at scale: a pre-trained model predicts, users correct, and the refined annotations are fed back for incremental improvement, progressively enhancing accuracy while reducing manual load (https://arxiv.org/html/2411.19835, jev weight 0.72, high). The parallel for an archive loop: corrections authored in one cycle must feed the next cycle's map, or the loop is not closed.

## Cycle discipline

A practitioner writeup of scored improvement loops states the discipline compactly: define what good looks like with deterministic checks and rubrics, enforce single-change iteration discipline, and run cycles until scores clear the bar (https://codex.danielvaughan.com/2026/04/27/codex-cli-scored-improvement-loops-eval-driven-iterative-problem-solving/, jev weight 0.27, weak). Single-change discipline is the detail that matters most for an archive: one edit per cycle keeps attribution clean when the next re-map moves or does not move.

## The fixpoint rule and the cap

Assembling the sourced pieces, the bounded loop on an archive is:

1. Gap-map the corpus (detect the current gaps).
2. Form one hypothesis about which gap to close.
3. Make one edit.
4. Re-map.
5. Apply the fixpoint rule: continue only if there are new substantive gaps, old gaps remain unclosed, or new anti-patterns appeared; otherwise stop.
6. Hard cap the cycle count.

Every element of that loop is bounded in the taxonomy sense: the edit is evaluable against the re-map, the fixpoint rule is a deterministic stop condition, and the cap prevents unbounded recursion (https://arxiv.org/abs/2607.07663, jev weight 0.70, high). The feedback literature justifies the loop's engine (https://journals.sagepub.com/doi/abs/10.3102/003465430298487, jev weight 0.78, high), the document-repair protocol justifies the shape of each episode (https://link.springer.com/content/pdf/10.1007/978-3-032-36033-5_19.pdf?pdf=inline+link, jev weight 0.82, high), and the annotation-loop result justifies feeding each cycle's corrections into the next map (https://arxiv.org/html/2411.19835, jev weight 0.72, high). Generic recursion definitions add nothing beyond naming the pattern (https://en.wikipedia.org/wiki/Recursion, jev weight 0.09, weak), and a general encyclopedia entry on recursive self-improvement describes a self-prompting execution loop without the bound (https://en.wikipedia.org/wiki/Recursive_self-improvement, jev weight 0.07, weak); both are context only.
