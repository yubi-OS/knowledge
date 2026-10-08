# 02 - Phase 0: The Capability Map

Scope: detecting bundled capabilities, proposing a capability map with stable module ids and dependency direction, gating it, and recursing per module.

## The detection test

The source doc (yubi-OS/yubiOS skills/spec-driven-development/SKILL.md) gives three tests for whether a single requirement bundles several independently testable capabilities and therefore needs decomposition before any spec is written:

1. The requirement names distinct capabilities with their own consumers or data, for example identity, billing, notifications, reporting.
2. Acceptance criteria cluster into groups that could ship and be verified separately.
3. One capability could be cut or replaced without rewriting the others' requirements.

Phase 0 exists for the exception, not the rule: if the request describes one capability, skip to Phase 1, and the phase puts no hierarchy on single-capability features.

## What the map contains

The source doc prescribes a small, reviewable artifact: a module table plus a build order, not a project plan. Its worked table has four modules (identity, billing, notifications, reporting) with one responsibility line each and an explicit depends-on column, then a single build-order line: identity first, then billing and notifications, then reporting. Three structural rules govern the table:

- Stable module ids. Kebab-case, chosen once, never renamed mid-initiative. Specs, plans, and downstream commands select work by these ids instead of guessing which spec is active.
- Dependency direction, no cycles. Arrows point one way. If two modules each need the other, they are one module.
- Interfaces live at the boundary. The map records that billing depends on identity; the contract between them belongs in the provider module's spec, which the source doc delegates to the api-and-interface-design skill.

The map is gated like every phase: the human reviews module boundaries, dependency direction, and build order before any module spec is written. The source doc's rationale is explicit: getting the map wrong is expensive; reviewing ten lines is not.

## The external grounding for decomposition

NASA's systems-engineering reference defines logical decomposition as the process for creating the detailed functional requirements that enable programs and projects to meet stakeholder expectations; it identifies the "what" that should be achieved at each level, uses functional analysis to create a system architecture, and decomposes top-level parent requirements and allocates them down to the lowest desired levels (weight 0.76, https://www.nasa.gov/reference/4-3-logical-decomposition/). That is the canonical large-scale analogue of what the capability map does at initiative scale: parent requirements (the bundled request) are decomposed into child requirements (modules) whose relationships are made explicit.

The dictionary sense of module is a standard or unit of measurement (weight 0.78, https://www.merriam-webster.com/dictionary/module); in this corpus a module is the unit of decomposition that the map names and orders.

## Weakly-backed context

The modular monolith pattern, in which a single deployable is deliberately structured as modules with explicit boundaries, is documented in practitioner literature (weight 0.39, weak, https://www.kamilgrzybek.com/blog/posts/modular-monolith-primer). It is context for why module boundaries are drawn up front rather than discovered later, but the corpus does not lean on it. General system-design writeups of module decomposition surfaced in the dig with weak weight (0.16, https://www.geeksforgeeks.org/system-design/module-decomposition-system-design/), so they are recorded here only as corroboration that decomposition is a recognized design activity.

## After the map is approved

The source doc then recurses: run Specify, Plan, Tasks, Implement for each module in dependency order. Each module gets its own spec scoped to that module's objective, boundaries, and success criteria. The approved map is saved at the project root and each module's spec sits alongside it, named by module id (SPEC-identity.md, SPEC-billing.md), so the map, not filename guessing, is the index of what exists.

The audit red flag that enforces this phase: module boundaries or build order decided implicitly during implementation because no capability map was approved up front (source doc). The pre-implementation checklist adds two items: if the request bundles several independently testable capabilities, a capability map was approved before any module spec was written, and every module spec traces to a module id in the approved map (source doc).
