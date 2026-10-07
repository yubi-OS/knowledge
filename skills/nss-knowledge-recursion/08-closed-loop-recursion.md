# 08 Closed-loop recursion

Source doc: yubi-OS/yubiOS skills/nss-knowledge-recursion/SKILL.md (the ground source). Scope: the recursion axis, strange loops, double-loop learning, self-archaeology trajectory notes, and the state-to-audit-to-change-to-verify-to-memory chain.

## What the rubric scores

The recursion axis asks whether a file "merely talks about learning and self-reference or actually forms a closed, evidence-bearing improvement loop": the file describes its own state or history, audits it against explicit criteria, identifies a failure or gap, changes the file/system/practice, verifies the change, records what was learned, and uses that record to drive the next audit (source doc). Twelve axes, 0 to 4 each, max 48, from object_boundary through provenance_version, self_archaeology, current_state, failure_inventory, reflexive_audit, explicit_recursion, learning_loop, feedback_independence, change_mechanism, verification_metrics, to memory_propagation (source doc).

## Strange loops

Hofstadter's strange loop is "a cyclic structure that goes through several levels in a hierarchical system", arising when moving up or down through the system's levels brings you back to where you started [1] (weight 0.44, weak). The concept originates in "Godel, Escher, Bach" (1979) and is developed in "I Am a Strange Loop" (2007) as an account of how selfhood emerges from self-referential loops [2] (weight 0.35, weak). The ground source borrows the structure, not the metaphysics: its axis 7 (explicit_recursion) scores "a checklist audits the document that defines the checklist; a postmortem changes the runbook and the next incident review checks whether that change worked" (source doc).

The distinction the ground source draws is sharp: "Self-reference is not recursion. 'This document describes itself' is not a feedback loop. Recursion requires a closed chain (state -> audit -> change -> verify -> memory)" (source doc, anti-patterns).

## Double-loop learning

Argyris and Schon's distinction between single-loop and double-loop learning is, per a 2023 European Management Review synthesis, "arguably one of the most popularized categorizations of organizational learning" [3] (weight 0.74). Single-loop learning corrects errors within existing rules and assumptions; double-loop learning modifies the goals or decision-making rules themselves in light of experience [4] (weight 0.55, weak). Argyris's associated Model I / Model II distinction contrasts behaviors that hide, cover up, and blame with behaviors that test assumptions openly [5] (weight 0.29, weak).

The ground source's reflexive_audit axis (number 6) encodes exactly this: 0 is no self-audit, 2 is both loops named, 3 examines methods, categories, assumptions, and blind spots, 4 examines "the incentives and rules producing behavior" and asks explicitly "why did we define the problem this way" (source doc).

## Self-archaeology

Self_archaeology (recursion axis 3) scores trajectory preservation (source doc): 0 is no trajectory, 1 is flat history, 2 is an earlier position noted, 3 is the chain earlier-position to evidence/event to revision to current state, 4 preserves the reason for revision and does not invent retrospective history. The ground source's guideline 6: "A note that says 'we believe X' without 'we used to believe Y because Z' loses the reason for revision." The red-flag table marks the invention failure: "A trajectory note says 'earlier we believed X' without 'because Y': archaeology invented, not recovered" (source doc).

## Gating the loop closed

The recursion gates (source doc): if explicit_recursion is below 2, cap the result at nominal; if feedback or verification is below 2, call it unverified self-improvement; if provenance or memory is below 2, call it non-persistent learning; if self-archaeology is 0 or 1, the file describes the present but does not demonstrate self-archaeology; and a score of 4 requires observed evidence of a completed cycle, not merely a detailed plan.

## Sources

1. https://en.wikipedia.org/wiki/Strange_loop (weight 0.44, weak)
2. https://en.wikipedia.org/wiki/I_am_a_strange_loop (weight 0.35, weak)
3. https://onlinelibrary.wiley.com/doi/full/10.1111/emre.12615 (weight 0.74)
4. https://en.wikipedia.org/wiki/Double-loop_learning (weight 0.55, weak)
5. https://pubadmin.institute/administrative-thinkers/double-loop-learning-in-organizations-chris-argyris (weight 0.29, weak)
