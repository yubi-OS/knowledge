# 02 Ideate-solo design pass

Scope: the ideate-solo one-pager step, phase 2 of the pipeline: 5 to 8 variations across 5 lenses, scored and stress-tested, saved to session/<slug>-solo-YYYY-MM-DD.md before the SPEC is written.

Grounding spine: yubi-OS/yubiOS skills/parallel-build-lanes/SKILL.md ("source doc").

Internal-record subtopic: the source doc is the only authority for this step's mechanics, so no searXNG dig was run for it.

## What the source doc specifies

The source doc's sequence lists phase 2 as: "ideate-solo one-pager: 5-8 variations across 5 lenses, scored, stress-tested; save to session/<slug>-solo-YYYY-MM-DD.md." Every token there is a contract. The artifact is one page, not a design bible. It contains 5 to 8 distinct variations of the design, not one design with restated advantages. The variations are generated across 5 lenses, scored, and stress-tested, and the surviving direction becomes the input to the formal SPEC in phase 3. The save path is fixed: session/<slug>-solo-YYYY-MM-DD.md, where slug is the build's slug and the date is the build date.

## Why it sits between the capability map and the SPEC

The placement is doing work. Phase 1 (the capability map) fixes the module boundaries and gets them approved. Phase 2 explores design variation inside those boundaries before any contract language exists. Phase 3 (the SPEC) then freezes endpoint and schema contracts, export names, and test strategy for the lanes. Explored in that order, the cheap exploration happens before the expensive freezing: a variation that changes the internal shape of a module costs nothing in phase 2 and would cost a spec rewrite in phase 3. Skipping the step would mean the lanes implement the first design that occurred to the orchestrator, with no scored alternative on record.

The source doc does not state this rationale explicitly; it is an explication of the ordering the doc itself mandates. The doc's own claims are only the sequence position, the variation count, the lens count, the scoring, the stress-testing, and the save path.

## What the source doc does not specify

Honesty about the boundary of the record matters for this step because the source doc is deliberately terse. It does not enumerate which 5 lenses are meant. It does not define the scoring scale. It does not say how stress-testing is performed or what evidence a stress test must produce. Those mechanics live in the sibling ideate-solo skill (yubi-OS/yubiOS skills/ideate-solo/SKILL.md), which the phase name references. A reader who needs the lens definitions should read that skill; this corpus doc will not invent them. What the parallel-build-lanes doc does pin is the output contract: the one-pager exists on disk at the dated path before phase 3 begins.

## The one-pager as a handoff artifact

The save-to-session rule makes the one-pager a checkable artifact rather than a memory. The build's other phases produce artifacts the same way (the SPEC is a document every lane implements against; lanes write to exact output directories; the advisor produces an integration report and deploy checklist). The one-pager fits that pattern: an agent resuming the build mid-pipeline can read session/<slug>-solo-YYYY-MM-DD.md and know which design direction was chosen and why, without replaying the ideation conversation. The dated filename also makes the artifact append-friendly across days: a build resumed on a later date produces a new file rather than mutating the old record.

## How the step interacts with lane count

The source doc's example build ("Build the X orchestrator as a worker") runs "capability map (approve) -> solo one-pager -> SPEC -> 4-5 lanes -> advisor -> deploy -> live route-by-route verification." The 4 to 5 lanes in that example are the module lanes that come out of the SPEC; the one-pager is upstream of that count. The skill requires 3 or more parallel implementation lanes for the process to apply at all ("any multi-module system build with 3+ parallel implementation lanes"), so the one-pager is never a single-lane design exercise; it is the last design exploration that still treats the system as a whole.

## Recording discipline

Because this is an internal-record subtopic, the record for this doc in the research database lists no dig queries and no weighted results; its claims trace to the source doc alone. The skill's validated history (jev-orchestrator and Jev Automations on the steady-orbit worker, 2026-10-01, per the source doc) is the evidence that the step earns its place in the sequence: it ran in the builds that produced the integration lessons the skill carries.
