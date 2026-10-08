# 01. Trigger and Scope

Scope: when the parallel-deep-research skill fires, what its default reading is, and the boundary that keeps its scope inside deep-research dispatches. This is an internal-record subtopic, no dig: every claim here is grounded in the source doc, yubi-OS/yubiOS skills/parallel-deep-research/SKILL.md.

## The trigger

The skill's own frontmatter description (source doc) names the trigger: a user request for "deep research X" or "research X with parallel agents". The workflow section adds an interpretive rule (source doc): when the user asks for "deep research X" without specifying parallelism, parallel dispatch is the established default. An operator does not need to say "with parallel agents"; the phrase "deep research X" alone selects this skill.

The skill also names its principal operator in the workflow preamble (source doc): the flow is written for requests from Jenny, the project's operator. That attribution matters for corpus readers because it explains the workflow's opinionated choices: the skill encodes one person's standing preferences for how research gets dispatched, synthesized, and landed in the repo, not a generic framework.

## What the trigger selects

Three things ride along with the trigger (source doc):

1. A dispatch shape: 3-N parallel subagents, with 3 to 5 described as the sweet spot.
2. A set of named angles: deep-dive, prior art and alternatives, and comparative or relevance analysis.
3. A canonical landing: findings are synthesized and pushed to `refs/<topic-slug>-YYYY-MM-DD.md` on `yubi-OS/yubiOS` main.

The required app for the skill is `github` (frontmatter `requiredApps: [github]`, source doc), because steps 5 and 6 of the workflow touch the GitHub API: pushing the refs/ note and inspecting repo state to verify borrow intent.

## The scope boundary

The Guidelines section closes the skill with a hard boundary (source doc): "Every use stays inside the frontmatter description's scope; anything beyond it is a different skill's job." In practice this splits responsibilities along clear lines:

- Requests that only name a trigger without the artifact it acts on are routed to the owning surface rather than improvised here (source doc, Examples section, boundary case note).
- Code changes that might result from research findings are not part of the research dispatch itself; they are gated by the borrow-intent verification described in doc 07.
- Reading existing refs/ docs or running a single-issue RSI cycle on one doc is the job of the repo-refs and single-action-curve skills, not this one.

## Borrow intent as part of scope

The frontmatter description carries a second clause that is unusual for a research skill (source doc): "Always verify 'borrow' intent against actual repo state before proposing code changes (workspace skills may be stale relative to main)." Scope therefore includes not just producing the research but vetting what the research recommends before anyone acts on it. This clause is the source doc's own summary of its most expensive lesson, and doc 07 expands it in full.

## Why the trigger defaults to parallel

The established-default reading exists because the skill's value is coverage and independence, not speed alone (source doc, Workflow section): each stream covers a different angle with its own context window, so conflicts between streams surface weak claims. A sequential single-agent read would not generate those conflicts. The trigger phrase is deliberately broad so the default behavior is the safer one.

Source doc: `yubi-OS/yubiOS skills/parallel-deep-research/SKILL.md` (frontmatter description; Workflow; Examples; Guidelines sections).
