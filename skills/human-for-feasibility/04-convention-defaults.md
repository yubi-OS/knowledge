# 04 - Convention defaults: inferring when nothing is written down

Scope: Step 2 of the discipline. The 4 convention classes that license inference when no explicit documentation exists, and the external grounding for each.

## The step

Step 2 of the source doc (yubi-OS/yubiOS skills/human-for-feasibility/SKILL.md) covers the gap between "the user said it" and "nobody said anything": even without explicit documentation, does a defensible default exist? If YES, the verdict is: infer, citing the convention, and proceed. The skill names 4 convention classes:

1. Established engineering convention. Examples from the source doc: "use the framework's recommended pattern", "follow the existing code style in the file".
2. Project convention. Examples: "this codebase uses kebab-case", "this org uses OPA Rego for policy gates".
3. Industry convention. Examples: "RESTful CRUD endpoints", "semantic versioning".
4. The skill ecosystem. Examples: "use ideate-solo for autonomous ideation", "use negative-skill-space to map gaps".

## What makes a default "sensible"

The software-engineering literature has a name for the artifact this step relies on. Martin Fowler's bliki defines a sensible default as "a practice that, absent some overriding context, should be used when carrying out a certain kind of task", with software examples like "use version control" (https://martinfowler.com/bliki/SensibleDefault.html, weight 0.29, weak backing, sub-0.5). The definition maps 1:1 onto Step 2: the convention supplies the answer when the user has not, and the agent's job is to notice the absence of overriding context, not to manufacture a question.

The quality bar for a defensible default comes from the principle of least astonishment: "a component of a system should behave in a way that most users expect", and the corresponding engineering law states the idea as "don't surprise the user" (https://en.wikipedia.org/wiki/Principle_of_least_astonishment, weight 0.17, weak backing, sub-0.5; https://lawsofsoftwareengineering.com/laws/principle-of-least-astonishment/, weight 0.17, weak backing, sub-0.5). Read through this skill's lens: a convention-default inference is defensible precisely because a reasonable user, shown the audit entry, would say "yes, obviously". If the inferred choice would surprise the user, it is not a convention default; it is a guess wearing one.

## The 4 classes in practice

- Established engineering convention: the strongest class. Framework-recommended patterns exist because thousands of projects converged on them. The cost of deviating is visible and the deviation is the thing that would need justification.
- Project convention: the most common class for code work. Existing code style, existing directory layout, existing dependency choices all document the answer without anyone having written a rule (source doc's "follow the existing code style in the file").
- Industry convention: semantic versioning, RESTful CRUD endpoints, conventional commit messages. Useful because both the user and the next reader will recognize the pattern.
- The skill ecosystem: the yubiOS-specific class. When a task needs autonomous ideation, ideate-solo exists for it; when a task needs gap mapping, negative-skill-space exists for it. The source doc's point: the ecosystem itself is a convention layer, and routing to the right skill is itself an inference the agent should make without asking.

## How this step interacts with Step 1

Step 1 and Step 2 form a ladder, not alternatives. Step 1 checks whether the choice is documented anywhere (message, turn, memory, skill, artifact, prior session). Step 2 fires only when Step 1 is silent (source doc). The practical sequence: search the working context first, then fall back to the convention classes. A common failure is to jump to Step 2 without checking Step 1, then "infer from convention" a choice the user already answered in their last message. That is the lazy-asking anti-pattern's mirror image: lazy conventioning.

## When conventions conflict

The source doc does not address conflicting conventions explicitly; the defensible reading, consistent with its ordering of evidence rungs in Step 1, is that more specific conventions outrank more general ones. Project convention beats industry convention; the codebase in front of you outranks the style guide from another org. When two same-scope conventions conflict and the cost of being wrong is high, that is no longer Step 2 territory: continue to Step 3 (cost of being wrong) and, if needed, Step 6 (ask well).

## Takeaway

Step 2 licenses inference without asking, but only when the default is citable. Name the convention class, pick the more specific convention when they conflict, and treat user-surprising defaults as guesses rather than conventions. The audit entry for a Step 2 inference cites the convention itself, which is what makes it reviewable.
