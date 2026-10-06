# 01. Document the why, not the what

Scope: the core doctrine of the documentation-and-adrs skill. Documentation captures the why (context, constraints, trade-offs) that led to a decision. Code shows what was built; docs explain why it was built this way and what alternatives were rejected. Includes the skill's triggers for when to document and when not to.

## The doctrine (source doc)

The source doc (yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md) states the doctrine plainly: document decisions, not just code. The most valuable documentation captures the why, meaning the context, constraints, and trade-offs that led to a decision. Code shows what was built; documentation explains why it was built this way and what alternatives were considered. The skill names two audiences for that context: future humans and agents working in the codebase.

This matches the older concept of design rationale. HandWiki defines design rationale as "an explicit documentation of the reasons behind decisions made when designing a system or artifact," a concept originally developed by W.R. Kunz and Horst Rittel to give argumentation-based structure to design decisions (https://handwiki.org/wiki/Design_rationale, jev 0.15, weak backing). A wiki mirror gives the same framing: "the explicit listing of decisions made during a design process, and the reasons why those decisions were made" (https://mdwiki.org/wiki/Design_rationale, jev 0.32, weak backing). The skill's doctrine is the software-engineering application of that same idea.

A practitioner essay makes the same distinction at the code-comment level: code tells you how, comments tell you why, and you should first strive to make code simple enough to understand without comments (https://blog.codinghorror.com/code-tells-you-how-comments-tell-you-why/, jev 0.30, weak backing). The source doc agrees: comments that restate the code are worthless, comments that explain non-obvious intent are the ones worth writing.

## When to document (source doc)

The skill lists 6 triggers:

1. Making a significant architectural decision.
2. Choosing between competing approaches.
3. Adding or changing a public API.
4. Shipping a feature that changes user-facing behavior.
5. Onboarding new team members (or agents) to the project.
6. When you find yourself explaining the same thing repeatedly.

Trigger 6 is the operational tell. If the same explanation is being repeated in PR reviews, standups, or onboarding sessions, the explanation has outlived the conversation and needs a durable home.

## When NOT to document (source doc)

The skill draws a hard boundary: do not document obvious code, do not add comments that restate what the code already says, and do not write docs for throwaway prototypes. This is the same principle the comment guidelines enforce later in the skill: a comment like "Increment counter by 1" above `counter += 1` is noise, while a comment explaining that a rate-limit counter resets at a sliding window boundary rather than on a fixed schedule (to prevent burst attacks at window edges) is signal (source doc).

A weak-backed dig agrees from the tooling side: one workflow guide argues dead-code removal should preserve comments that "explain why the code exists" while deleting the rest (https://justhandledlabs.com/guides/remove-commented-out-code-safely/, jev 0.15, weak backing). The why-comments survive because they are the only comments that stay accurate; what-comments rot with the code.

## Why the audience includes agents

The source doc explicitly addresses "future humans and agents" as the readership, and its Documentation for Agents section repeats it. A weak-backed dig on context infrastructure argues codebase context should be treated as durable infrastructure rather than something re-derivable on demand (https://www.driver.ai/blog/why-current-approaches-fail/, jev 0.22, weak backing). The skill's practical answer to that problem is simpler: record the why once, in ADRs and rules files, so no future reader has to re-derive it.

## What this doc means for practice

1. Before writing any doc, name the decision it records, not the code it describes.
2. Write the constraints down. "Managed hosting available (for small team, limited ops capacity)" in the source doc's ADR example is exactly the kind of constraint a future reader cannot recover from the code.
3. List the rejected alternatives with the rejection reason. The source doc's example records why MongoDB, SQLite, and MySQL were rejected, not just why PostgreSQL won.
4. When you catch yourself explaining something a second time, that is the trigger to write it down.
5. Do not produce documentation for prototypes or for code whose intent is obvious. Restating code is the anti-goal.
