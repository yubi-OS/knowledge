# 03. ADR template anatomy

Scope: the skill's ADR template (Status, Date, Context, Decision, Alternatives Considered, Consequences), its storage convention (docs/decisions/ with sequential numbering), and how its fields compare to the wider ADR template families.

## The template (source doc)

The source doc (yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md) prescribes storing ADRs in `docs/decisions/` with sequential numbering (ADR-001, ADR-002, ...) and gives a worked template with 6 sections:

1. Title: "ADR-001: Use PostgreSQL for primary database", a numbered one-line decision statement.
2. Status: one of Accepted | Superseded by ADR-XXX | Deprecated.
3. Date: the decision date (2025-01-15 in the example).
4. Context: the requirements that constrain the decision. The example lists a relational data model, ACID transactions for task state changes, full-text search on task content, and managed hosting because the team has limited ops capacity.
5. Decision: one sentence. "Use PostgreSQL with Prisma ORM."
6. Alternatives Considered: for each alternative (MongoDB, SQLite, MySQL in the example), pros, cons, and an explicit Rejected line with the reason.
7. Consequences: what follows from the decision, including costs (team needs PostgreSQL knowledge) and simplifications (PostgreSQL full-text search replaces a planned Elasticsearch).

The example is deliberate in shape: Context carries constraints, not background prose, and every rejected alternative gets a rejection reason tied to a constraint from Context.

## Field-level comparison with template families

The canonical community repo keeps the same core: an ADR "captures an important architectural decision made along with its context and consequences" (https://github.com/architecture-decision-record/architecture-decision-record, jev 0.78). Context and Consequences are the two load-bearing fields across template families; the skill's template adds the explicit Alternatives Considered section.

A comparison page (jev 0.25, weak backing) positions the two best-known families against each other: "Use the Nygard ADR template when a compact context, decision, and consequences record captures enough rationale. Use the MADR template when reviewers need explicit decision drivers, considered options, option-level pros and cons, or a confirmation method" (https://www.adr.zone/compare-formats). Read against the skill, its template is a compact Nygard-style record plus the alternatives-with-pros-cons structure that MADR formalizes. The skill's Alternatives section with per-option pros, cons, and a Rejected line is effectively the MADR option block without the MADR ceremony.

A template gallery entry (jev 0.13, weak backing) shows the same structure repackaged as a productized template (https://www.notion.so/templates/architecture-decision-record-template), and a weak-backed writeup of a template system (jev 0.13, weak backing) adds context linking (relating ADRs to projects, components, and other ADRs) and searchable history (https://dev.to/datanestdigital/adr-template-system-architecture-decision-records-adr-system-2pp5). Those additions are tooling conveniences; the skill's convention is the file-based minimum: numbered markdown files in docs/decisions/.

## Why the alternatives section is not optional

The source doc's example rejects MongoDB because "our data is inherently relational", SQLite because it lacks production multi-user write support and managed hosting, and MySQL because PostgreSQL has better JSON support, full-text search, and ecosystem tooling. Each rejection cites a Context constraint. That is the property a dig source names for MADR's option blocks (option-level pros and cons, adr.zone, weak backing) and it is what makes the record auditable: a future reader can check whether the constraints changed, which is exactly the supersede trigger in doc 04.

## Practice notes

1. Number sequentially and never renumber. The numbers are identifiers, not rankings.
2. Keep Status machine-parseable (Accepted, Superseded by ADR-XXX, Deprecated) so lifecycle state is greppable.
3. Write Context as constraint statements with reasons, not as project history.
4. Give every rejected alternative a Rejected line that cites a constraint from Context.
5. Consequences must include the costs, not only the wins; the source doc example records the team's PostgreSQL knowledge requirement as a consequence.
