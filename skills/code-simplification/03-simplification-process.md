# 03 The Simplification Process

Scope: the skill's 4-step process, from understanding before touching (Chesterton's Fence) through incremental application and final verification, including the Rule of 500 automation threshold.

## Step 1: Understand Before Touching (Chesterton's Fence)

Before changing or removing anything, understand why it exists. The source doc names this Chesterton's Fence: if you see a fence across a road and do not understand why it is there, do not tear it down. First understand the reason, then decide if the reason still applies (source doc, The Simplification Process).

The source doc requires the agent to answer 6 questions before simplifying (source doc):

1. What is this code's responsibility?
2. What calls it? What does it call?
3. What are the edge cases and error paths?
4. Are there tests that define the expected behavior?
5. Why might it have been written this way? (Performance? Platform constraint? Historical reason?)
6. Git blame: what was the original context for this code?

If you cannot answer these, you are not ready to simplify. Read more context first (source doc).

The fence principle is a real G.K. Chesterton parable, not an engineering invention. Farnam Street's explainer describes it as a reminder to understand why something is the way it is before meddling in change (https://fs.blog/chestertons-fence/, jev 0.42, weak backing), and Wikipedia anchors the parable to Chesterton himself, the English writer of the early 20th century (https://en.wikipedia.org/wiki/G._K._Chesterton, jev 0.60). In software the principle applies with force to code whose purpose is opaque: the skill treats git blame as a required research step, not an optional one.

## Step 2: Identify Simplification Opportunities

The source doc instructs scanning for concrete patterns, "each one is a concrete signal, not a vague smell", across 3 categories: structural complexity, naming and readability, and redundancy. The full catalog lives in doc 04 of this corpus (source doc).

## Step 3: Apply Changes Incrementally

The incremental loop is: make one simplification, run the test suite, commit or continue if tests pass, revert and reconsider if they fail (source doc). Avoid batching multiple simplifications into a single untested change; if something breaks, you need to know which simplification caused it (source doc).

Two hard rules ride on this step. First, submit refactoring changes separately from feature or bug fix changes: a PR that refactors and adds a feature is two PRs, split them (source doc). Second, the Rule of 500: if a refactoring would touch more than 500 lines, invest in automation (codemods, sed scripts, AST transforms) rather than making the changes by hand, because manual edits at that scale are error-prone and exhausting to review (source doc).

The literature independently converges on small steps. Refactoring.Guru's how-to page prescribes refactoring as a series of small changes, each making the code slightly better while the program stays in working order (https://refactoring.guru/refactoring/how-to, jev 0.56). A practitioner account of incremental refactoring argues small changes let you maintain confidence and monitor the impact of each alteration, and that change size should scale with test coverage: with thin coverage, keep changes small (https://alanparr.github.io/incremental-refactoring-for-the-win, jev 0.19, weak backing). The inverse case is documented too: refactoring without good tests creates a first problem of not knowing when behavior breaks (https://codeclimate.com/blog/refactoring-without-good-tests/, jev 0.39, weak backing). The Big Ball of Mud study of iterative-incremental development documents how uncontrolled incremental growth degrades a system into sprawl, which is the failure mode the test-after-each-change loop exists to prevent (https://www.laputan.org/mud/mud.html, jev 0.38, weak backing).

## Step 4: Verify the Result

After all simplifications, evaluate the whole with a 4-question comparison (source doc):

1. Is the simplified version genuinely easier to understand?
2. Did you introduce any new patterns inconsistent with the codebase?
3. Is the diff clean and reviewable?
4. Would a teammate approve this change?

If the "simplified" version is harder to understand or review, revert. Not every simplification attempt succeeds (source doc). This is the process-level backstop for Principle 4 (maintain balance): the skill explicitly authorizes failure and undo, which is what keeps agents from defending a bad simplification because it is already written.

## The process as a loop

The 4 steps are not strictly linear. Step 4 can send you back to Step 3 (revert one simplification), and Step 1 research repeats for each new area the pass touches. What the process forbids is skipping: no change without a Step 1 answer, no commit without a passing test run, no pass without a Step 4 whole-result comparison.

## Sources

- Source doc: yubi-OS/yubiOS skills/code-simplification/SKILL.md (The Simplification Process, Steps 1 to 4).
- https://fs.blog/chestertons-fence/, jev 0.42 (weak backing).
- https://en.wikipedia.org/wiki/G._K._Chesterton, jev 0.60.
- https://refactoring.guru/refactoring/how-to, jev 0.56.
- https://codeclimate.com/blog/refactoring-without-good-tests/, jev 0.39 (weak backing).
- https://www.laputan.org/mud/mud.html, jev 0.38 (weak backing).
- https://alanparr.github.io/incremental-refactoring-for-the-win, jev 0.19 (weak backing).
