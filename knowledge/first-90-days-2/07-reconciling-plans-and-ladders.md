# Reconciling sequential phase plans with milestone ladders

Scope: merging a sequential 3-phase plan with an independently defined milestone or readiness ladder into one operational timeline, without silently superseding either artifact.

## The problem shape

Venture and project plans often accumulate two structures: a sequential phase plan (blocks of days with outputs) and a readiness ladder (gates with criteria, independent of the calendar). The reconciliation task is to map one onto the other without redefining either. The surveyed material approaches this from several angles: framework comparison, phase mapping, and alignment checks inside large-organization governance.

## Know what each framework is for

Framework-comparison guides establish that planning frameworks differ in purpose, so a reconciliation must start by naming each artifact's role. One guide compares "five popular roadmap planning frameworks: RICE, OKRs, Now/Next/Later, Weighted Scoring", listing pros, cons, and best use cases per framework (weight 0.25, weak backing, cutline.so/guides/roadmap-planning-frameworks). Another contrasts backward planning with roadmaps: "A backward planning model is the right tool when a fixed date or immovable constraint forces you to plan from the finish line back to today", while a roadmap suits open-ended planning (weight 0.40, weak backing, fastlucid.com/en/blog/backward-planning-vs-roadmaps-when-each-works-2). A third describes theme-based roadmaps that "organize work into overarching categories" (weight 0.27, weak backing, blog.herdr.io/work-management/7-frameworks-for-building-roadmaps/).

The reconciliation rule that follows: a fixed 90-day window plus hard gates is a backward-planning situation, and the phase plan supplies the day mapping while the gate ladder supplies the authorization criteria. Neither should be rewritten by the other; the map is the new artifact.

## Map phases to gates explicitly

Template guidance shows the mapping form: a project plan and milestones template exists specifically to "schedule every phase" and make phase-to-milestone structure visible (weight 0.36, weak backing, ones.com/blog/project-plan-and-milestones-template-how-to-map-every-phase/). A roadmap guide defines the artifact as "a visual representation of goals, milestones, and timelines" serving as a guide for stakeholders (weight 0.35, weak backing, deckary.com/blog/pillar-timelines-roadmaps-guide). Concretely, a day-to-gate table (days 0-30 targeting one gate, days 31-60 the next, days 61-90 the third) is the standard reconciliation artifact: each row names the phase, the target gate transition, and the key outputs.

## Alignment checks inside large-organization governance

Large organizations formalize reconciliation as stage-exit alignment. A state government IT project package for a deployment stage requires "Confirmed alignment with enterprise architecture, security, accessibility, and data governance standards" plus prepared test environments and access controls as stage-exit content (weight 0.71, watech.wa.gov/sites/default/files/2026-05/WaTech%20IT%20Project%20Resources%20Stage%204_0.pdf). The pattern generalizes: when multiple independent frameworks govern one initiative (architecture, security, accessibility, governance), the stage exit is where their alignment is confirmed and recorded, not assumed.

A six-phase implementation methodology from an enterprise guide provides another pattern of layered structure: infrastructure, then services, then further phases, each building on the previous (weight 0.52, hp.com/us-en/tech-takes/ai/how-to/ai-implementation-roadmap.html). Layered phase structures reconcile with ladders the same way: each phase's exit maps to a rung, and mismatches are called out at the boundary.

## Do not silently supersede

The most important reconciliation discipline is provenance: when a newer structure replaces an older one, mark the old one superseded and state what changed; when a newer structure merely maps onto the older one, say so. A meta-level tool exists for the stress-testing half of this problem: a reconciliation routine that brushes "all the finished task plans of a roadmap at once and stress-test[s] that they cohere as a system", checking the seams (weight 0.12, weak backing, www.claudepluginhub.com/skills/ayoubben18-ab-method/reconcile-roadmap). Even at weak weight, the pattern is instructive: reconciliation is a coherence check across plans, and its output is a list of seams that need explicit decisions.

## Practical takeaways

- Name each artifact's role before reconciling: phase plan = day mapping; gate ladder = authorization criteria (weight 0.40, weak backing, fastlucid.com).
- Produce an explicit day-to-gate table with key outputs per row rather than merging prose (weight 0.36, weak backing, ones.com).
- Confirm cross-framework alignment explicitly at each phase exit, as large-organization stage exits do (weight 0.71, watech.wa.gov).
- Mark supersession explicitly; a mapping that silently replaces a prior artifact destroys its provenance (weight 0.12, weak backing, claudepluginhub.com).
