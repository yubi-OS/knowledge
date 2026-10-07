# ADR Anatomy: When to Write One and the Template

Scope: the source doc's ADR section: the trigger list for writing an ADR, the storage convention (docs/decisions/, sequential numbering), and the 6-section template (Status, Date, Context, Decision, Alternatives Considered, Consequences) with its worked PostgreSQL example.

## When the source doc says to write an ADR

The source doc calls ADRs "the highest-value documentation you can write" and gives 6 triggers:

1. Choosing a framework, library, or major dependency
2. Designing a data model or database schema
3. Selecting an authentication strategy
4. Deciding on an API architecture (REST vs GraphQL vs tRPC)
5. Choosing between build tools, hosting platforms, or infrastructure
6. Any decision that would be expensive to reverse

Trigger 6 is the general form of the other 5: every item on the list is a decision with high reversal cost. The external ADR canon agrees on the shape of these triggers. The architecture-decision-record GitHub organization's reference description centers on capturing "an important architectural decision along with its context and consequences" (https://github.com/architecture-decision-record/architecture-decision-record, jev weight 0.81 and 0.71 across two queries, authoritative). Microsoft's Well-Architected guidance treats the ADR as the vehicle for recording significant decisions and their context (https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record, jev weight 0.83, authoritative).

## Storage convention (source doc)

The source doc says: store ADRs in `docs/decisions/` with sequential numbering (ADR-001, ADR-002, ...). Sequential numbering gives every decision a stable identifier that other documents, code comments, and future ADRs can reference (the gotcha-comment example in the source doc references "ADR-003 for the full design rationale" exactly this way).

## The template (source doc)

The source doc's template has 6 sections, shown here against its worked example (ADR-001: Use PostgreSQL for primary database):

1. **Status**: one of `Accepted | Superseded by ADR-XXX | Deprecated`. The status line is the lifecycle hook that doc 04 develops.
2. **Date**: the decision date (the example uses 2025-01-15).
3. **Context**: the requirements that constrain the decision. The example lists 4: a relational data model (users, tasks, teams), ACID transactions for task state changes, full-text search on task content, and managed hosting for a small team with limited ops capacity. Context is where the constraints live, not where the conclusion lives.
4. **Decision**: one sentence. The example: "Use PostgreSQL with Prisma ORM."
5. **Alternatives Considered**: per-alternative Pros, Cons, and a Rejected line. The example covers MongoDB (rejected: relational data in a document store leads to complex joins or data duplication), SQLite (rejected: not suitable for a multi-user web application in production, despite zero configuration and fast reads), and MySQL (rejected: PostgreSQL has better JSON support, full-text search, and ecosystem tooling). The rejected-alternative record is what prevents the same debate from re-running later.
6. **Consequences**: what the decision commits you to. The example: type-safe database access and migrations via Prisma; PostgreSQL full-text search instead of adding Elasticsearch; a team knowledge requirement (PostgreSQL, judged standard skill, low risk); hosting on a managed service (Supabase, Neon, or RDS).

## Template shape in the wider ADR canon

The community reference at the ADR GitHub organization documents the same canonical section set (title, status, context, decision, consequences) as the base format (https://github.com/architecture-decision-record/architecture-decision-record, jev weight 0.81, authoritative). adr.github.io is the hub for the broader tooling ecosystem built on that format (https://adr.github.io/, jev weight 0.60, authoritative).

One dig result is directly about the Alternatives section: an ADR from the govctl-org project that extends the alternative structure with explicit pros, cons, and rejection rationale (https://govctl-org.github.io/govctl/adr/ADR-0027.html, jev weight 0.66, authoritative). It is a real-world instance of exactly the section the source doc's template carries: each alternative gets its merits, its drawbacks, and the reason it lost. A weaker result, an ArchMan template page, shows the same section set in a commercial tool (https://archman.dev/docs/checklists-and-templates/adr-template, jev weight 0.32, weak backing).

## Why Alternatives Considered is the section that pays

The source doc prices the whole practice in its rationalizations table: "A 10-minute ADR prevents a 2-hour debate about the same decision six months later" (source doc). The mechanism of that prevention is the Alternatives Considered section: the future debate is short-circuited because the rejected options and their rejection reasons are already on the record, with dates. The Context section does the same work for constraints: the future reader (human or agent) sees what was true at decision time, including constraints that may no longer hold, which is why old ADRs are kept rather than rewritten (doc 04).

## What this doc does not cover

The lifecycle mechanics (how an ADR moves from PROPOSED to ACCEPTED to SUPERSEDED, and why old ADRs are never deleted) are doc 04. The relationship of ADRs to agent-facing documentation (ADRs prevent agents from re-deciding past decisions) is doc 08. The template here is the source doc's own; it is a minimal format, and the corpus records it as such rather than importing a heavier template the source doc does not use.
