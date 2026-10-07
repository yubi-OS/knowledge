# Inline Documentation: Comment the Why, Not the What

Scope: the source doc's inline-comment rules, the canonical good and bad comment examples, the three don'ts (self-evident code, TODO-instead-of-do, commented-out code), and the gotcha-documentation pattern.

## The rule

Per the source doc (yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md, "Inline Documentation"), comment the *why*, not the *what*. The rule has a stability argument attached (see doc 09): comments on *why* are stable; comments on *what* get outdated, which is exactly why you only write the former.

The source doc's bad example restates the code:

```typescript
// BAD: Restates the code
// Increment counter by 1
counter += 1;
```

The good example explains non-obvious intent:

```typescript
// Rate limit uses a sliding window — reset counter at window boundary,
// not on a fixed schedule, to prevent burst attacks at window edges
if (now - windowStart > WINDOW_SIZE_MS) {
  counter = 0;
  windowStart = now;
}
```

The code itself is 3 lines; the comment adds what no reader can derive: the threat model (burst attacks at window edges) and the design choice (sliding window, not fixed schedule). A weak-backed practitioner article, Jeff Atwood's "Code Tells You How, Comments Tell You Why" (https://blog.codinghorror.com/code-tells-you-how-comments-tell-you-why/, weight 0.27), argues the same distinction; label it weak, and treat it as corroboration of the source doc. Another weak-backed counterpoint, Hillel Wayne's "Maybe Comments SHOULD Explain 'What'" (http://www.hillelwayne.com/post/what-comments/, weight 0.29), argues some what-comments carry contract information the code cannot express; the source doc's own gotcha pattern (below) already covers that case, since a gotcha comment is a what that would otherwise be invisible.

## The three don'ts

Per the source doc ("When NOT to Comment"):

1. **Don't comment self-evident code.** The example is a reduce over cart items computing a total; the code is its own documentation and any comment would restate it.
2. **Don't leave TODO comments for things you should just do now.** The source doc's verdict on `// TODO: add error handling` is: just add it. A TODO is a decision to defer converted into a comment, and per the source doc's red-flags list (see doc 09), a TODO that has been there for weeks is a documentation smell.
3. **Don't leave commented-out code.** The verdict is: delete it, git has history. Version control already preserves every prior version of every line, so the commented-out block adds no information and adds noise. A weak-backed Stack Overflow discussion on checking in commented-out code (https://stackoverflow.com/questions/758279/checking-in-of-commented-out-code, weight 0.11) records the same community position. A weak-backed code-quality rules page (https://www.aikido.dev/code-quality/rules/why-you-should-remove-commented-out-code-from-your-code, weight 0.18) lists the same rule as a lintable code-quality check.

## Documenting known gotchas

The source doc's third inline pattern is the gotcha block: a JSDoc comment that states the trap, the failure mode, and a pointer to the governing ADR:

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

Three things make this pattern work: the comment states a *consequence* (flash of unstyled content) rather than a restatement; it names the *cause* (theme context not available during SSR); and it cross-links to the ADR that holds the full rationale. The cross-link is the load-bearing part of the pattern: it converts an isolated comment into a node in the decision graph, so an agent or engineer who reads the comment can escalate to the full decision record. The link target convention (ADR-003) matches the numbered ADR storage in doc 03.

## The economic test

The source doc's rationalizations table (doc 09) gives the inline rules their economic footing: "comments get outdated" is answered with "comments on *why* are stable"; "the code is self-documenting" is answered with "code shows what, not why, what alternatives were rejected, or what constraints apply". The verification checklist (doc 09) closes the loop with 2 inline-specific items: known gotchas documented inline where they matter, and no commented-out code remaining.
