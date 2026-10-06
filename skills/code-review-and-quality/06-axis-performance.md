# 06 Axis 5: Performance

Scope: the fifth review axis, whether the change introduces performance problems, and the 6 problem classes the reviewer hunts.

Grounding spine: `yubi-OS/yubiOS skills/code-review-and-quality/SKILL.md` (source doc). External mechanisms are cited with their jev weight.

## Delegation boundary

Like the security axis, this one is a merge-time gate, not a profiling discipline: for detailed profiling and optimization the reviewer is pointed to the `performance-optimization` skill (source doc). The axis catches the regression at review; the other skill owns the deep work.

## The problem classes

The source doc lists 6 questions (source doc):

1. Any N+1 query patterns?
2. Any unbounded loops or unconstrained data fetching?
3. Any synchronous operations that should be async?
4. Any unnecessary re-renders in UI components?
5. Any missing pagination on list endpoints?
6. Any large objects created in hot paths?

## The named classes in external tooling

The classes are not arbitrary; each corresponds to a defect category that static analysis treats as first-class. Unbounded writes, the general class behind "unbounded loops or unconstrained data fetching", is a named CodeQL query family: code that writes to storage or memory without a bound can exhaust resources under adversarial input, which is why reviewers gate on it rather than trusting load tests to catch it later (noul 0.93, https://codeql.github.com/codeql-query-help/cpp/cpp-unbounded-write/).

Unnecessary re-renders, the UI entry in the list, is a standard React-family review concern: components re-render when state or props change even when output is identical, and the standard remedies are memoization, dependency-array hygiene in hooks, and lifting state to shrink the re-render subtree. Practitioner writeups document the review-side checklist for this (noul 0.23, weak, https://aspnetzero.com/blog/react-performance-and-preventing-unnecessary-renders).

The N+1 pattern is the classic database antipattern where a query runs once and then one more query per item in its result set. The skill's pairing of N+1 with missing pagination covers the two ways list endpoints degrade: per-item queries and unbounded result sets.

## Severity and specificity

The honesty section of the source doc gives the reviewer the standard for phrasing performance findings: quantify when possible. "This N+1 query will add roughly 50ms per item in the list" is better than "this could be slow" (source doc). Quantified findings are also actionable: they tell the author whether the fix is worth the churn, which is the approval standard again, applied to performance.

## The checklist boxes

The review checklist carries 3 performance boxes into the merge gate (source doc): no N+1 patterns, no unbounded operations, and pagination on list endpoints. These are the 6 walk-through questions compressed to what a reviewer can check per file: data access shape, loop bounds, and result-set limits.

## Where the axis fits in the walk

The implementation walk runs the 5 axes per file changed, and performance is last: does the code do what the test says (correctness), can I understand it (readability), does it fit the system (architecture), any vulnerabilities (security), any bottlenecks (performance) (source doc). Performance findings, like all findings, are labeled with severity prefixes so the author knows what is required versus optional (source doc). A slow-but-correct change is a Required or Optional finding, never a Critical one: the Critical prefix is reserved for security vulnerability, data loss, and broken functionality (source doc).
