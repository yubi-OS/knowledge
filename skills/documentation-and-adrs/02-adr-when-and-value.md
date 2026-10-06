# 02. When to write an ADR and what they are worth

Scope: the skill's trigger list for ADRs (frameworks, schemas, auth strategy, API architecture, build tools, expensive-to-reverse decisions) and the claim that ADRs are the highest-value documentation a team can write.

## The skill's position (source doc)

The source doc (yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md) calls ADRs "the highest-value documentation you can write" because they capture the reasoning behind significant technical decisions. It gives 6 triggers for writing one:

1. Choosing a framework, library, or major dependency.
2. Designing a data model or database schema.
3. Selecting an authentication strategy.
4. Deciding on an API architecture (REST vs. GraphQL vs. tRPC).
5. Choosing between build tools, hosting platforms, or infrastructure.
6. Any decision that would be expensive to reverse.

Trigger 6 is the general rule; triggers 1 through 5 are its common instances. What unites them is reversal cost: the source doc's own rationalization table prices this ("A 10-minute ADR prevents a 2-hour debate about the same decision six months later").

## How the wider ecosystem defines the artifact

The canonical community definition matches the skill: "An architecture decision record (ADR) is a document that captures an important architectural decision made along with its context and consequences. An architecture decision (AD) is a software design choice that addresses a significant requirement" (https://github.com/architecture-decision-record/architecture-decision-record, jev 0.81).

Microsoft's Well-Architected guidance makes the same value claim with the accumulation argument: "An architecture decision record (ADR) is one of the most important deliverables of a solution architect. Your architecture is the accumulation of its decisions, so the ADR is effectively a record of how and why the system came to be its current shape" (https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record, jev 0.89). That framing explains why the skill ranks ADRs above other docs: code and feature docs describe the current state, while ADRs accumulate into a record of the path.

A weak-backed practitioner guide sizes the artifact: an ADR is "a one to two page document that records a single architecturally significant decision," one decision per record (https://docsio.co/blog/architecture-decision-record, jev 0.19, weak backing). The source doc's template is consistent with that sizing: its example ADR-001 covers exactly one decision (PostgreSQL as primary database) plus rejected alternatives.

## Reading the trigger list against the digs

The ecosystem material reinforces the skill's emphasis on reversal cost and single-decision granularity, and adds nothing that contradicts it. One weak-backed article frames ADRs as "a ready reckoner to the context, options considered, and the rationale behind specific architectural decisions" (https://www.linkedin.com/top-content/project-management/decision-analysis-in-project-management/using-architecture-decision-records-in-engineering-teams/, jev 0.15, weak backing), which is a restatement of the skill's Alternatives Considered section rather than new doctrine.

## Practical reading

1. If a decision would be expensive to reverse, it earns an ADR regardless of how confident the team feels at the time.
2. One record per decision. Do not merge framework choice and hosting choice into one ADR; they reverse at different times.
3. The ADR's value is realized later, not at writing time. The accumulation argument (Microsoft, jev 0.89) is why old ADRs are never deleted, which doc 04 covers.
4. When a dig or a reviewer proposes skipping the ADR because the decision feels obvious, check the reversal cost first. Cheap decisions do not need records; expensive ones need them precisely because they feel settled in the moment.
