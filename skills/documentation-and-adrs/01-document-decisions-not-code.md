# Document Decisions, Not Just Code

Scope: the overview philosophy of the yubiOS documentation-and-adrs skill: documentation must capture the why (context, constraints, trade-offs) rather than restate what the code does, because that context is what future humans and agents need.

## The core claim from the source doc

The source doc (yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md, Overview section) states the discipline directly: "Document decisions, not just code. The most valuable documentation captures the *why* — the context, constraints, and trade-offs that led to a decision." Code shows *what* was built; documentation explains *why it was built this way* and *what alternatives were considered*. The doc names two beneficiary groups explicitly: future humans and future agents working in the codebase. All of this is a source-doc claim; it is the grounding spine of this corpus.

## Why the why outlives the what

The skill's argument is that code is a lossy record of its own history. A codebase can show the current shape of a system, but it cannot show:

- the constraints that forced a shape (regulatory, operational, team-size)
- the alternatives that were evaluated and rejected, and the reasons for rejection
- the trade-offs that were consciously accepted

External write-ups of the same principle align with the source doc. The Microsoft Azure Well-Architected Framework describes the Architecture Decision Record as a way to capture the context and consequences of architectural decisions so they remain auditable after the conversation that produced them has ended (https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record, jev weight 0.83). The community-maintained ADR GitHub organization frames ADRs as a record of decisions "that others can review and follow" (https://github.com/architecture-decision-record/architecture-decision-record, jev weight 0.67).

The ADR project hub at adr.github.io aggregates tooling and guidance around the same idea: decisions have a shelf life and a paper trail matters (https://adr.github.io/, jev weight 0.60). These three are the authoritative (weight >= 0.5) external anchors for this doc; the rest of the dig results for this subtopic came back weak (0.06 to 0.36) and are used below only as weakly-backed color.

## The complement: comments on the why

The same why-over-what split applies at the line level, which the skill develops later in its Inline Documentation section. A weakly-backed but consistent external voice argues that comments should never restate the code's mechanics (https://methodnotfound.com/blog-post-2.html, jev weight 0.23, weak backing). The source doc's own code example makes the point concretely: a comment reading "Increment counter by 1" above `counter += 1` is bad; a comment explaining that a sliding-window rate limiter resets at window boundaries rather than on a fixed schedule to prevent burst attacks at window edges is good. The first restates the what; the second carries the why that the code cannot express.

## Consequences of skipping the why

The skill's Red Flags list treats "architectural decisions with no written rationale" as the first red flag of the discipline (source doc). Its Common Rationalizations table also pre-answers the pushback: "The code is self-documenting" is countered by the observation that code shows what but not why, not what alternatives were rejected, and not what constraints apply (source doc). And "Nobody reads docs" is countered with "Agents do. Future engineers do. Your 3-months-later self does" (source doc). These are internal-record claims from the skill itself; they anchor the corpus because the whole corpus explicates them.

## Relation to the rest of the corpus

This overview philosophy is the load-bearing premise for every other doc in the corpus:

- The when-to-document triggers (doc 02) exist because decisions need capturing at the moment the why is live in a person's head.
- The ADR anatomy and lifecycle docs (03, 04) are the artifact format for capturing the why.
- The inline-comment and API-documentation docs (05, 06) are the line-level and interface-level expressions of the same split.
- The docs-for-agents doc (08) is the machine-reader version: agents cannot infer the why from code either, so conventions, specs, and ADRs are their documentation surface.

The skill also carries a verification checklist item "Known gotchas are documented inline where they matter" (source doc, Verification section), which is the practical test that the why-over-what discipline actually landed in the codebase rather than only in principle.

## What the corpus does not claim

The dig for this subtopic surfaced mostly low-weight pages (dictionary definitions, product marketing, a K-12 curriculum site), which are recorded in the research-db as weighted 0.06 to 0.36 and are not used to substantiate any claim here. The authoritative anchors above (Microsoft, the ADR GitHub organization, adr.github.io) plus the source doc carry the doc's substance. No claim in this doc rests on a page the decision model scored below 0.5 without an explicit weak-backing label.
