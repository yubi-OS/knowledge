# 01 - When to Use Spec-Driven Development

Scope: the activation triggers for spec-driven development, the explicit when-not-to-use list, and why a scope check precedes specification.

## The source-doc triggers

The source doc (yubi-OS/yubiOS skills/spec-driven-development/SKILL.md) lists five activation triggers for writing a spec before code:

1. Starting a new project or feature.
2. Requirements are ambiguous or incomplete.
3. The change touches multiple files or modules.
4. You are about to make an architectural decision.
5. The task would take more than 30 minutes to implement.

The same source names the counter-list explicitly: single-line fixes, typo corrections, and changes where requirements are unambiguous and self-contained do not need the workflow. The doc also states the gate that precedes everything: a scope check (Phase 0) activates only when one request bundles several independently testable capabilities; most requests describe one capability and go straight to specifying.

## What spec-driven development is

IBM defines spec-driven development as a software methodology in which a detailed specification of implementation details is authored and agreed upon before development begins, serving as a single source of truth for what to build and how to build it (weight 0.52, https://www.ibm.com/think/topics/spec-driven-development). The same IBM article describes the spec-first variant: the specification is written before any code is generated, in the form of a user story, acceptance criteria, or a formal requirements document (weight 0.52, same URL).

The dictionary sense of "spec" is "specification", usually plural, meaning a single quantity such as a dimension or a measure of performance describing a product as part of a specification (weight 0.79, https://www.merriam-webster.com/dictionary/spec). The corpus uses "spec" in that engineering sense throughout.

## Why the spec precedes code

GitHub's spec-kit states the precision bar this way: specifications must be precise, complete, and unambiguous enough to generate working systems, which eliminates the gap between intent and implementation, and maintaining software means evolving specifications (weight 0.61, https://github.com/github/spec-kit/blob/main/spec-driven.md). The source doc encodes the same idea procedurally: do not advance to the next phase until the current one is validated, and the spec is the shared source of truth between the agent and the human engineer.

IBM's framing of the modern motivation is that AI coding assistants have lowered the barrier to code generation, but AI is only as good as the instructions it receives (weight 0.52, https://www.ibm.com/think/topics/spec-driven-development). A written spec is precisely the instruction artifact that bounds that risk.

## Where the world has moved past the source doc

The source doc treats the spec as a long-lived artifact to keep alive (doc 08 covers that). IBM's spec-first variant explicitly notes that when the initial clarity is provided and code is generated, the spec is not necessarily maintained and may grow outdated as the software evolves; its primary purpose was initial clarity without continued maintenance (weight 0.52, https://www.ibm.com/think/topics/spec-driven-development). Dated correction, 2026-10-06: if you adopt the lighter spec-first reading, the source doc's "keeping the spec alive" rules remain the stricter and recommended posture for yubiOS work.

## Weakly-backed context

Practitioner debate about the limits of spec-driven development exists (weight 0.23, https://isoform.ai/blog/the-limits-of-spec-driven-development), but the retrieved pages on both sides are commentary-grade rather than primary sources, so the corpus records their existence without relying on their claims. Similarly, a CTO-perspective piece on planning before code surfaced in the dig but carries weak weight (0.20, https://dredyson.com/a-ctos-perspective-how-planning-your-code-impacts-strategic), so it is noted, not cited for substance.

## The decision rule

Use the source doc's five triggers as the activation test and its when-not-to-use list as the veto. When a request hits one trigger and bundles several independently testable capabilities, the scope check fires first (doc 02). When it hits no trigger, build without a spec; the source doc is explicit that simple tasks still need acceptance criteria even when they skip the full workflow.
