# When to Write an ADR

Scope: the six ADR trigger classes from the source doc, the "expensive to reverse" test that unifies them, and how external guidance corroborates or extends that list.

## The source doc's trigger list

Per the source doc (yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md, "When to Write an ADR"), write an ADR when:

1. Choosing a framework, library, or major dependency.
2. Designing a data model or database schema.
3. Selecting an authentication strategy.
4. Deciding on an API architecture (REST vs GraphQL vs tRPC).
5. Choosing between build tools, hosting platforms, or infrastructure.
6. Any decision that would be expensive to reverse.

The list is deliberately concrete: each entry names a choice a working team actually faces, and each produces a durable artifact (a dependency, a schema, an auth flow, an API surface) that outlives the person or agent who chose it.

## The unifying test: cost of reversal

Item 6 is the general rule the other 5 instances satisfy. A framework choice costs a rewrite to reverse. A data model costs a migration. An auth strategy costs a security review plus a migration. The Microsoft Azure Well-Architected guidance on architecture decision records (https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record, weight 0.77) treats ADRs as records for decisions that are hard or costly to change once made, matching the source doc. A weak-backed practitioner article on reversible versus irreversible decisions in system design (https://scalewithchintan.com/blog/designing-systems-reversible-vs-irreversible-decisions, weight 0.20) makes the same one-way/two-way door distinction; cite it as weak corroboration only.

The canonical ADR repository (https://github.com/architecture-decision-record/architecture-decision-record, weight 0.76) defines an ADR as a captured, architecturally significant decision, which is the same significance gate the source doc applies: not every decision gets an ADR, only the ones whose reversal is expensive or whose rationale matters later.

## What does NOT need an ADR

The source doc pairs the trigger list with the anti-triggers from "When to Use": obvious code, restating comments, and throwaway prototypes get no documentation, and by extension no ADR. The gate is significance, not novelty. A rename is not an ADR. A dependency bump is not an ADR. Choosing the primary database (the source doc's worked example) is.

## The worked example

The source doc's template section (see doc 03) shows the trigger list in action with ADR-001: choosing PostgreSQL as the primary database. The context section lists the requirements that drove the decision: a relational data model for users, tasks, and teams; ACID transactions for task state changes; full-text search on task content; and managed hosting for a small team with limited ops capacity. The alternatives considered section records MongoDB, SQLite, and MySQL, each with pros, cons, and an explicit rejection reason. That structure is the payoff of the trigger list: because the decision was flagged as ADR-worthy at the moment it was made, the requirements and rejections were written down while they were still fresh.

## Why agents need this list

The trigger list doubles as an instruction to coding agents. An agent mid-task that hits one of the 6 conditions (picking a library, designing a schema, choosing an auth strategy) should stop and produce an ADR rather than bury the choice in a commit message. The source doc's "Documentation for Agents" section (see doc 08) names ADRs as the mechanism that prevents agents from re-deciding settled questions; this trigger list is how an agent recognizes the moment it needs one.

## Community context

The ADR community hub (https://adr.github.io/, weight 0.63) and the Mozilla Normandy ADR documentation (https://mozilla.github.io/normandy/adrs/index.html, weight 0.55) both document the practice of numbering and storing ADRs alongside code, which is the convention the source doc adopts in docs/decisions/ (see doc 03). The trigger conditions themselves vary across organizations; the source doc's list is the yubiOS variant, and its sixth item (expensive to reverse) is the load-bearing rule to apply when a new decision type does not obviously fit items 1 through 5.
