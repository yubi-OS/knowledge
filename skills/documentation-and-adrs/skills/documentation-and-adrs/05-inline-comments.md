# Inline Documentation: Comments That Earn Their Lines

Scope: the source doc's inline documentation rules: comment the why not the what, the 3 when-NOT-to-comment exclusions, and documenting known gotchas inline with ADR cross-references.

## Comment the why, not the what (source doc)

The source doc's rule is one sentence: "Comment the *why*, not the *what*." Its paired example makes the rule concrete:

```typescript
// BAD: Restates the code
// Increment counter by 1
counter += 1;

// GOOD: Explains non-obvious intent
// Rate limit uses a sliding window — reset counter at window boundary,
// not on a fixed schedule, to prevent burst attacks at window edges
if (now - windowStart > WINDOW_SIZE_MS) {
  counter = 0;
  windowStart = now;
}
```

The bad comment is redundant with the code; the good comment carries 3 things the code cannot say: the mechanism name (sliding window), the design choice (reset at window boundary, not fixed schedule), and the reason (prevents burst attacks at window edges). This is the line-level instance of the corpus-level philosophy in doc 01.

The rationale that why-comments are stable while what-comments rot is explicit in the source doc's rationalizations table: "Comments get outdated" is answered with "Comments on *why* are stable. Comments on *what* get outdated — that's why you only write the former." A why-comment stays true even when the implementation changes around it (or becomes the record of why the implementation must not change casually); a what-comment diverges from the code the first time the code is edited.

## The 3 exclusions (source doc)

The When NOT to Comment section names 3 anti-patterns with inline examples:

1. **Self-explanatory code**. The example is a one-line `calculateTotal` summing price times quantity; it needs no comment.
2. **TODO comments for things you should just do now**. The example: `// TODO: add error handling` followed by the instruction "Just add it". A TODO used as a procrastination device is a documentation smell, not documentation.
3. **Commented-out code**. The example: an old implementation commented out instead of deleted, with the verdict "Delete it, git has history."

The red flags list in the source doc elevates 2 of these to project-level signals: "Commented-out code instead of deletion" and "TODO comments that have been there for weeks". The second one adds a time dimension: a TODO is not inherently bad, a long-lived TODO is.

External practice echoes the exclusions. JetBrains' IntelliJ IDEA documentation treats TODO comments as tracked work items with dedicated highlighting and a tool window, implying they should resolve rather than accumulate (https://www.jetbrains.com/help/idea/using-todo.html, jev weight 0.29, weak backing). A Stack Overflow engineering blog post frames the same why-over-what principle (https://stackoverflow.blog/2021/12/23/best-practices-for-writing-code-comments/, jev weight 0.12, weak backing). A Stack Exchange discussion of why commented-out code is wrong gives the community-consensus answer the source doc assumes: version control already preserves deleted code (https://softwareengineering.stackexchange.com/questions/377186/why-is-it-wrong-to-comment-out-code-a, jev weight 0.09, weak backing). These are corroborating, weakly-backed sources; the source doc carries the rule itself.

## Document known gotchas (source doc)

The third inline-documentation pattern is the gotcha block: a doc comment on a function whose misuse produces a non-obvious failure. The source doc's example:

```typescript
/**
 * IMPORTANT: This function must be called before the first render.
 * If called after hydration, it causes a flash of unstyled content
 * because the theme context isn't available during SSR.
 *
 * See ADR-003 for the full design rationale.
 */
export function initializeTheme(theme: Theme): void {
```

This example carries 2 disciplines at once: the gotcha is documented exactly where a reader will hit it (on the function, not in a wiki), and the comment links to the decision record (ADR-003) for the full rationale. The inline-to-ADR link is the connective tissue of the skill: line-level documentation answers "what will bite me here", ADRs answer "why is it this way". The verification checklist item "Known gotchas are documented inline where they matter" (source doc) tests the first half; "ADRs exist for all significant architectural decisions" tests the second.

## What the gotcha pattern excludes

Note what the gotcha block is not: it is not a restatement of the function's contract (that belongs in API documentation, doc 06), and it is not a TODO (the problem is known and the mitigation is documented, not deferred). The gotcha block documents an invariant plus its failure mode plus the rationale pointer. If the invariant could be enforced in code, that is usually better than documenting it; the skill's scope stops at documenting, and the source doc does not claim otherwise.

## The time test

Across the source doc's sections, the practical discriminator between a comment that earns its line and one that does not is time stability: will this text still be true and still be informative after the surrounding code changes twice? Why-comments pass that test; what-comments fail it immediately. The README, changelog, and agent-docs docs (07, 08) apply the same test at file and project scope, where the artifact is a document rather than a comment but the stability question is identical.
