# 05. Inline comments: the why, the gotchas, the deletions

Scope: the skill's inline documentation rules: comment the why not the what, the 3 anti-patterns (self-explanatory-code comments, TODO comments, commented-out code), and documenting known gotchas inline with ADR cross-references.

## The rule (source doc)

The source doc (yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md) states the rule as "Comment the why, not the what" and demonstrates it with a pair:

- Bad: "// Increment counter by 1" above `counter += 1`. The comment restates the code.
- Good: "// Rate limit uses a sliding window — reset counter at window boundary, not on a fixed schedule, to prevent burst attacks at window edges" above the reset logic. The comment explains intent that the code cannot express.

A practitioner essay gives the same rule with a refinement: "the best kind of comments are the ones you don't need," and the first goal should be code so simple it needs no comment; what remains for comments is the why (https://blog.codinghorror.com/code-tells-you-how-comments-tell-you-why/, jev 0.30, weak backing). The source doc's good example is exactly that residue: an intent a simple codebase could not make self-evident.

## The 3 anti-patterns (source doc)

1. Comments on self-explanatory code. The example is a `calculateTotal` function whose reduce is obvious; it gets no comment.
2. TODO comments for things you should just do now. The skill's wording: "// TODO: add error handling — just add it." A TODO that describes minutes of work is procrastination with syntax.
3. Commented-out code. The skill's wording: delete it, git has history. Version control makes the commented-out corpse redundant.

A weak-backed Stack Exchange discussion confirms the practice concern: leaving commented code in the codebase is a bad practice, and the reason it persists is a process misunderstanding rather than a technical need (https://softwareengineering.stackexchange.com/questions/377186/why-is-it-wrong-to-comment-out-code-and-then-gradually-remove-it-to-keep-track-o, jev 0.12, weak backing). A weak-backed essay names the common excuse for keeping corpses, the belief the code "will be needed at some point in the future," and treats it as unfounded (https://codesai.com/en/posts/2025/09/removing-commented-out-code, jev 0.13, weak backing). A weak-backed removal guide (jev 0.15) draws the boundary the skill implies: remove dead code but preserve comments that explain why the code exists, license headers, and tool directives (https://justhandledlabs.com/guides/remove-commented-out-code-safely/). Delete the code, keep the why.

## Gotchas: the third category (source doc)

The skill adds a positive category between the two above: document known gotchas inline, where they matter. Its example is a docblock on `initializeTheme` warning that calling the function after hydration causes a flash of unstyled content because the theme context is unavailable during SSR, ending with "See ADR-003 for the full design rationale."

That example carries 2 lessons:

1. Gotchas belong at the call site, not in a wiki. The warning lives where the mistake would be made.
2. The gotcha comment links to the ADR that explains the design, connecting inline documentation to the decision record. The comment is the tripwire; the ADR is the reasoning.

## Practice notes

1. Before writing a comment, test whether it would still be true if the code below it changed. If yes, it is a why-comment; write it. If no, it is a what-comment; delete it.
2. A TODO is acceptable only as a tracker for work genuinely deferred; if the fix takes minutes, do it now.
3. Never delete a why-comment while refactoring; it documents intent the new implementation must preserve.
4. When a gotcha is discovered, write it inline immediately with an ADR cross-reference if the design has a record.
5. Treat weeks-old TODOs and commented-out code as red flags (they appear verbatim in the skill's red flag list; see doc 10).
