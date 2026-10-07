# 01 Capability map approval gate

Scope: mapping the architecture to modules with responsibilities, dependencies, and build order, presented in chat and approved before any spec is written.

Grounding spine: yubi-OS/yubiOS skills/parallel-build-lanes/SKILL.md ("source doc").

## What the gate is

The parallel-build-lanes skill opens every big build with a capability map, not a specification. The source doc is explicit about the order: "Capability map first: map the architecture to modules with responsibilities, dependencies, and build order. Present in chat, get approval BEFORE writing any spec." Three properties make this a gate rather than a draft: it is presented in chat where the human can read it, it asks for approval rather than offering a status update, and it precedes all spec writing. Nothing downstream starts until the map is accepted.

## The three fields every module entry carries

The source doc pins the shape of the map: each module gets responsibilities, dependencies, and build order.

Responsibilities say what the module owns. Dependencies say what it consumes and from where, which is what later makes lanes independently testable (the lane rules require that lane tests import nothing from other lanes). Build order is the third field and it is the one that turns the map into a dispatch plan: when lanes are dispatched in parallel, the build order tells the integrator which modules must exist before which seams can be exercised.

A map that carries all three fields is a decision document. A map that carries only names and one-line descriptions is a table of contents, and it hides exactly the boundary questions the approval step exists to settle.

## Why approval comes before the SPEC

The source doc gives the reason directly in its guidelines: "Always present the capability map for approval before writing the SPEC - she edits module boundaries there cheaply." Boundary edits are cheap in a map and expensive in a spec. A spec distributes module boundaries across endpoint contracts, export names, test expectations, and success criteria; moving a responsibility after that means touching every lane's prompt and every test file. In the map, the same move is a line edit.

This is also why the skill forbids writing any spec before approval. The spec is a commitment device for the lanes; the map is the last cheap moment to change what the lanes will be. The sequence makes the human's boundary judgment land at the point where it costs the least.

## Where the gate sits in the full sequence

The source doc's example line shows the gate in context: "Build the X orchestrator as a worker: capability map (approve) -> solo one-pager -> SPEC -> 4-5 lanes -> advisor -> deploy -> live route-by-route verification." The map is the first of 6 phases and the only one marked with "(approve)" in the example. Everything after it (the ideate-solo one-pager, the SPEC, the lanes, the advisor pass, the deploy and verification) inherits its module boundaries from the approved map.

The full validated process, per the source doc, was used for the jev-orchestrator and Jev Automations builds on the steady-orbit worker, dated 2026-10-01, descending from the 2026-08-01 playbooks build and the 2026-09-29 mega-task fan-out. Those dates matter: the gate is not aspiration, it is the recorded practice of 3 completed builds.

## What the wider practice says

The skill does not cite external material for this step, so the dig here is context rather than backing, and all of it carries weak jev weights (below 0.5) and is labeled as such. Sources on architectural decomposition converge with the doc's three fields: a decomposition wiki page describes splitting a system into elements with clear responsibilities and defined relationships (weak, 0.14; synchronium.github.io/software-architecture-wiki/concepts/architectural-decomposition.html), and a practitioner essay on modules, components, and decomposition argues that decomposition decisions should be visible and reviewable artifacts rather than implicit in code (weak, 0.16; edbedbed.com/extending-the-architecture-blueprint-modules-components-and-decomposition/). A course text on documenting software architecture treats responsibilities and dependencies as the primary decomposition axes (weak, 0.17; sunner.cn/courses/SA/Documenting_Software_Architecture,_2nd_edition.pdf), and a German academy page makes the same pairing explicit for software architecture responsibilities and dependencies (weak, 0.12; ccd-akademie.de/en/software-architecture-responsibilities-and-dependencies/). None of these name an approval-in-chat gate; that specific mechanism is the source doc's own contribution.

## Operating rules for the agent running the gate

Three rules follow from the source doc. 1: present the map in chat as the first output of the build, before the ideate-solo pass, because the map bounds what the design variations explore. 2: make the three fields (responsibilities, dependencies, build order) explicit per module so the approval decision is about boundaries, not vibes. 3: treat approval as a hard gate: if the human edits boundaries in the map, the SPEC is written against the edited map, not the original one. The skill's guideline is unconditional: always present, never pre-write the spec.
