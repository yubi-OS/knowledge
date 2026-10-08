Scope: internal-record subtopic, no dig. Spawning a fresh subagent to write the bug reproduction test, so the test is authored without knowledge of the fix, and the main agent verifies fail then pass.

# 09: Subagents for Reproduction Tests

Grounding spine: the source doc "yubi-OS/yubiOS skills/test-driven-development/SKILL.md", "When to Use Subagents for Testing" section. This is an internal-record subtopic: its content is workflow mechanics defined entirely by the source doc, so no searXNG dig was run and the doc cites the source doc only.

## The workflow

The source doc prescribes the following split for complex bug fixes:

1. Main agent: "Spawn a subagent to write a test that reproduces this bug: [bug description]. The test should fail with the current code."
2. Subagent: writes the reproduction test.
3. Main agent: verifies the test fails, implements the fix, then verifies the test passes.

## Why the separation matters

The source doc gives the rationale in one line: "This separation ensures the test is written without knowledge of the fix, making it more robust." A test author who already knows the fix tends to write assertions shaped by the implementation that is about to exist; a blind author can only encode the reported broken behavior. The blind reproduction test is therefore a stronger proof: it fails for the bug, not for a mismatch with a particular fix design, and it keeps passing across reasonable refactors of the fix.

## When to use it

The source doc scopes this to complex bug fixes. Simple bugs do not need the overhead of a second context; the main agent can apply the Prove-It Pattern directly (doc 02). The complexity threshold is judgment, but the tell is when the bug report is ambiguous about the failure mode: handing reproduction to a fresh context that sees only the bug description tests whether the description is sufficient to reproduce the bug deterministically.

## Position in the corpus

This doc exists to keep the internal-record rule honest: the mechanism is defined by the skill itself, not by external literature, so the corpus records it verbatim from the source doc with zero web weighting. It composes with doc 02 (the Prove-It Pattern supplies the fail-then-pass proof standard) and doc 08 (the verification checklist requires a reproduction test that failed before the fix, which is exactly this artifact).
