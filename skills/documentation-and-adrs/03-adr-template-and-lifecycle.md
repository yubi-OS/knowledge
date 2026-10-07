# ADR Template and Lifecycle

Scope: the source doc's ADR template (stored in docs/decisions/ with sequential numbering), the worked PostgreSQL example, the PROPOSED to ACCEPTED to SUPERSEDED or DEPRECATED lifecycle, the never-delete rule, and how the template compares with community standards like MADR.

## Where ADRs live and how they are numbered

Per the source doc (yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md, "ADR Template"), ADRs are stored in `docs/decisions/` with sequential numbering (ADR-001, ADR-002, and so on). Sequential numbering gives every decision a stable address that other documents, comments, and agents can reference. The ADR community hub (https://adr.github.io/, weight 0.63) documents the same convention: numbered, timestamped decision records kept in the repository next to the code they govern. The Mozilla Normandy project's ADR index (https://mozilla.github.io/normandy/adrs/index.html, weight 0.56) is a working example of that convention in production documentation.

## The template

The source doc template has 6 sections:

1. Title: `# ADR-001: Use PostgreSQL for primary database` (number plus a one-line decision statement).
2. Status: one of Accepted, Superseded by ADR-XXX, or Deprecated.
3. Date: the decision date (the example uses 2025-01-15).
4. Context: the requirements that drove the decision. The example lists 4: a relational data model (users, tasks, teams with relationships), ACID transactions for task state changes, support for full-text search on task content, and managed hosting for a small team with limited ops capacity.
5. Decision: one sentence ("Use PostgreSQL with Prisma ORM").
6. Alternatives Considered: each alternative with Pros, Cons, and an explicit Rejected line.
7. Consequences: what follows from the decision (type-safe database access via Prisma, using PostgreSQL full-text search instead of adding Elasticsearch, the team's need for PostgreSQL knowledge, and hosting on a managed service such as Supabase, Neon, or RDS).

The Alternatives Considered section is the part most teams skip and the source doc insists on. Each rejection carries its reason: MongoDB is rejected because relational data in a document store leads to complex joins or data duplication; SQLite because it lacks multi-user production concurrent-write support and managed hosting; MySQL because PostgreSQL has better JSON support, full-text search, and ecosystem tooling for the feature requirements. Writing the rejections down is what makes the record auditable later.

## The lifecycle

Per the source doc ("ADR Lifecycle"), the state machine is:

```
PROPOSED -> ACCEPTED -> (SUPERSEDED or DEPRECATED)
```

Two rules govern it:

- **Don't delete old ADRs.** They capture historical context. A superseded ADR is the record of why the current decision made sense at the time and what has changed since.
- **When a decision changes, write a new ADR that references and supersedes the old one.** The Status line of the old ADR becomes "Superseded by ADR-XXX", and the new ADR carries the new reasoning. The chain of supersession is the decision history.

The Microsoft Azure Well-Architected ADR guidance (https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record, weight 0.77) describes the same append-only discipline: record the decision when made, and when circumstances change, document the new decision rather than rewriting history.

## Comparison with MADR

The source doc's template is a minimal 6-section form. The community standard MADR (Markdown Architectural Decision Records) at https://adr.github.io/madr/ (weight 0.71) is a more structured variant: it adds Decision Drivers, Considered Options with decision-outcome tables, and explicit links. A weak-backed ADR template vendor page (https://www.cavaro.io/templates/architecture-decision-record-adr, weight 0.28) shows the same family of templates commercially packaged. The source doc does not mention MADR; where a team wants more structure than the source doc's template, MADR is the standard extension point, but the corpus records no contradiction: both share the Context, Decision, Consequences spine and the numbered-file convention.

## Why the template is agent-readable

The template's fixed section names (Status, Date, Context, Decision, Alternatives Considered, Consequences) make ADRs machine-parseable. An agent asked "why is this on PostgreSQL?" can locate docs/decisions/ADR-001.md, read the Context and Alternatives sections, and recover the reasoning without asking a human. That is the mechanism behind the source doc's claim (in "Documentation for Agents") that ADRs prevent agents from re-deciding settled questions, and it is why the never-delete rule matters: deleted history turns settled questions back into open ones.
