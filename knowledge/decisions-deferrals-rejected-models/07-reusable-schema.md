# Reusable schemas and row patterns for decision registers

Scope: lightweight, copyable row formats for a decision register, including the two-table pattern (adopted rows with Decision/Source, rejected rows with Rejected-model/Why/Source) and what each schema variant trades away.

## Two registers at different granularities

Engineering practice supports two register shapes. The ADR is the per-decision unit: a document that captures an important architectural decision made along with its context and consequences (https://github.com/architecture-decision-record/architecture-decision-record, jev weight 0.75). The decision log is the cross-decision unit: a structured document that records key decisions made during a project, along with rationale, stakeholders involved, and outcomes (https://thedigitalprojectmanager.com/project-management/decision-log/, jev weight 0.40, weak backing).

The ADR GitHub repository explicitly acknowledges the family of formats: many templates and tools for decision capturing exist, citing agile communities such as Nygard’s ADRs and traditional software engineering and architecture design processes, including table layouts suggested by IBM UMF and by Tyree and Akerman from CapitalOne (https://github.com/architecture-decision-record/architecture-decision-record, jev weight 0.61 for the second hit). The Tyree-Akerman lineage is the tabular ancestor of decision-log rows.

## The row patterns worth copying

For a compiled decision log, three row patterns cover the state space:

1. Adopted: Decision | Source. The decision stated in one checkable sentence, plus a pointer to the document and section that decided it. Microsoft’s ADR guidance underlies this: every key decision gets a record with options considered and outcome (https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record, jev weight 0.94).
2. Deferred: Deferred item | What evidence unblocks it | Source. This row pattern encodes the lean decide-as-late-as-possible discipline in a fixed three-column shape: the item, the unblocking evidence, the provenance. The academic basis for deferral being legitimate is the research showing deferral increases the chance sufficient information is available at decision time (https://webdocs.cs.ualberta.ca/~jonathan/PREVIOUS/Papers/Papers/toplas.pdf, jev weight 0.77).
3. Rejected: Rejected model | Why | Source. The why column should cite a governing constraint, making the rejection re-verifiable rather than a matter of taste.

The three patterns share one property that makes them reusable: each row is checkable against its Source column. That is the difference between a register and a memory dump, and it is the property the ADR community’s traceability tooling depends on.

## Lightweight ADRs as the per-row expansion

The lightweight ADR movement (pioneered by Nygard’s blog post) keeps the file format deliberately small so the register stays maintainable: a version of recording architecture decisions was proposed in Nygard’s blog post, and the lightweight-architecture-decision-records repository collects the minimal practices around it (https://github.com/peter-evans/lightweight-architecture-decision-records, jev weight 0.71). In a two-tier setup, the decision log carries the compiled rows and each row links to a full ADR when the decision warrants one.

## Template landscape and what it trades away

Ready-made decision-log templates exist in quantity, typically with fields for the decision, date, owner, rationale, stakeholders, and status (https://www.projectmanager.com/templates/decision-log-template, jev weight 0.35, weak backing; https://www.standin.co/blog/engineering-decision-log-system, jev weight 0.38, weak backing). The trade they make for convenience is checkability: template fields like owner and stakeholders record who was involved, not where the authoritative reasoning lives. A register optimized for re-derivation should keep the Source column mandatory even if it adopts the other template fields.

The MADR format is the middle point: a lean template capturing context, decision drivers, considered options, and outcomes (https://adr.github.io/madr/, jev weight 0.94), which expands naturally into the alternatives-considered section that rejected-model rows summarize.

## Source quality note

Strong anchors: the ADR GitHub repository, Microsoft Learn, MADR, and the TOPLAS deferral paper. Template-vendor pages are weak and used only to characterize the template landscape, never as authority on what a register should contain.
