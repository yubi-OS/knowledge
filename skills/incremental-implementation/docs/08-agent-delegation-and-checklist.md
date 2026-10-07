# 08 - Agent Delegation, Checklist, and Rationalizations

Scope: internal-record subtopic, no dig. Directing agents to implement incrementally, the per-increment checklist, final verification, common rationalizations, and red flags. Grounded entirely in the source doc `yubi-OS/yubiOS skills/incremental-implementation/SKILL.md`.

## Directing an agent

The source doc's Working with Agents section gives a template for delegating an increment. The example instruction does 3 things explicitly:

1. Scopes the increment: "Start with just the database schema change and the API endpoint."
2. Marks the exclusion: "Don't touch the UI yet, we'll do that in the next increment."
3. Requires verification: "After implementing, run the repository's test and build commands to verify nothing is broken."

The doc's summary line: "Be explicit about what's in scope and what's NOT in scope for each increment." For agent-driven work this is the load-bearing sentence, because an agent without an explicit exclusion will fill the increment with adjacent changes; the scope-discipline rules (Rule 0.5) exist to close exactly that gap.

## The increment checklist

After each increment, the doc requires verification with the repository's own commands, referencing the test-driven-development skill's "Discover the Stack First" section for finding them. The checklist:

1. The change does one thing and does it completely.
2. All existing tests still pass (the repository's test command: `npm test`, `./gradlew test`, `pytest`, and similar).
3. The build succeeds (the repository's build command).
4. Type checking passes, where the stack has one (`npx tsc --noEmit`, `mypy`, and similar).
5. Linting passes (the repository's lint command).
6. The new functionality works as expected.
7. The change is committed with a descriptive message.

The note attached to the checklist prevents checklist theater: run each verification command after a change that could affect it, and after a successful run do not repeat the same command unless the code has changed since. Re-running on unchanged code adds no information.

## Final verification

After completing all increments for a task, the doc's Verification section requires:

1. Each increment was individually tested and committed.
2. The full test suite passes.
3. The build is clean.
4. The feature works end to end as specified.
5. No uncommitted changes remain.

The See Also section adds the outer gate: per-increment verification is the local check, but before declaring a task done, apply the project-wide Definition of Done as the final bar every increment clears regardless of the task: tests pass, no regressions, behavior verified at runtime, docs updated.

## Common rationalizations

The doc's table of rationalizations pairs each excuse with its correction. These are the 6 entries:

| Rationalization | Reality |
|---|---|
| "I'll test it all at the end" | Bugs compound. A bug in Slice 1 makes Slices 2 through 5 wrong. Test each slice. |
| "It's faster to do it all at once" | It feels faster until something breaks and you cannot find which of 500 changed lines caused it. |
| "These changes are too small to commit separately" | Small commits are free. Large commits hide bugs and make rollbacks painful. |
| "I'll add the feature flag later" | If the feature is not complete, it should not be user-visible. Add the flag now. |
| "This refactor is small enough to include" | Refactors mixed with features make both harder to review and debug. Separate them. |
| "Let me run the build command again just to be sure" | After a successful run, repeating the same command adds nothing unless the code has changed since. |

## Red flags

The doc's red-flag list is the negative space of the whole skill: more than 100 lines of code written without running tests, multiple unrelated changes in a single increment, "let me just quickly add this too" scope expansion, skipping the test or verify step to move faster, build or tests broken between increments, large uncommitted changes accumulating, building abstractions before the third use case demands it, touching files outside the task scope "while I'm here", creating new utility files for one-time operations, and running the same build or test command twice in a row without any intervening code change.

## When not to use the skill

The doc's When NOT to use clause: single-file, single-function changes where the scope is already minimal. Running the increment cycle on a change that is already one small unit adds process without adding safety.
