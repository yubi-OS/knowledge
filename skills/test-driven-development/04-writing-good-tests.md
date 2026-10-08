Scope: test-writing craft: state-based assertions over interaction tests, DAMP over DRY in test code, Arrange-Act-Assert, one assertion per concept, and names that read like a specification.

# 04: Writing Good Tests

Grounding spine: the source doc "yubi-OS/yubiOS skills/test-driven-development/SKILL.md", "Writing Good Tests" section.

## Test state, not interactions

The source doc's first rule: assert on the outcome of an operation, not on which methods were called internally. Interaction-based tests break when you refactor even if behavior is unchanged. Its good example asserts that a task list comes back sorted by creation date, newest first; its bad example asserts that db.query was called with a string containing ORDER BY created_at DESC. The first survives a query rewrite; the second does not.

The strongest external backing for this rule is Martin Fowler's "Mocks Aren't Stubs" (https://www.martinfowler.com/articles/mocksArentStubs.html, jev weight 0.90), which draws exactly this line: state verification checks the state of the tested object after a call, behavior verification checks that the expected calls happened, and behavior verification couples tests to implementation structure. Fowler's framing also explains why the anti-pattern table later in the source doc lists "testing implementation details" first: it is the single most common way tests become fragile. A weaker corroborator is the Stack Overflow thread on state-based versus mock-based testing (https://stackoverflow.com/questions/54943/how-do-i-know-when-to-use-state-based-testing-ve, jev weight 0.09, weak), which treats the two as complementary tools rather than mutual exclusives; the source doc is stricter, preferring state assertions wherever the outcome is observable.

## DAMP over DRY in tests

The source doc's rule: in production code DRY (Don't Repeat Yourself) is usually right; in tests, DAMP (Descriptive And Meaningful Phrases) wins. A test should read like a specification and tell a complete story without tracing through shared helpers. Duplication in tests is acceptable when it makes each test independently understandable. The Stack Overflow answer that coined the distinction (https://stackoverflow.com/questions/6453235/what-does-damp-not-dry-mean-when-talking-about, jev weight 0.09, weak) confirms DAMP stands for "descriptive and meaningful phrases" and is the opposite of DRY in readability, not in everything-should-be-duplicated.

## Arrange-Act-Assert

The source doc structures every test as arrange (set up the scenario), act (perform the action under test), assert (verify the outcome). The pytest documentation's "Anatomy of a test" page gives this structure first-class treatment: the test is ultimately the act and assert steps, with arrange preparing the world and cleanup picking up after itself so other tests are not influenced (https://docs.pytest.org/en/stable/explanation/anatomy.html, jev weight 0.93). Microsoft's .NET unit-testing best-practices guide goes further and recommends only one Act per test (https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices, jev weight 0.94), suggesting a separate test per Act when a method has several responsibilities.

## One assertion per concept

The source doc splits title validation into three tests: rejects empty titles, trims whitespace, enforces maximum length. Its bad example lumps all three into one test named "validates titles correctly", so one failure hides the other two outcomes. The pattern is one behavior per test, even when a test contains several expect calls for the same concept.

## Name tests descriptively

The source doc's good examples read as behavior specifications: "sets status to completed and records timestamp", "throws NotFoundError for non-existent task", "is idempotent: completing an already-completed task is a no-op". Bad examples are "works", "handles errors", "test 3". Test names are documentation; the Red Flags section later treats "test names that do not describe the expected behavior" as a defect in their own right.

## Why craft matters for the agent loop

For an agent working test-first, these five rules are quality gates on the RED step itself. A poorly written test can pass trivially, test the mock instead of the code, or fail for the wrong reason; the discipline above keeps the cycle's signal clean. Notably, the dig also surfaced the likely upstream of the source doc itself: the agent-skills repository's copy of the same test-driven-development SKILL.md (https://github.com/addyosmani/agent-skills/blob/main/skills/test-driven-development/SKILL.md, jev weight 0.33, weak), whose visible excerpt covers the same DAMP, anti-pattern, and red-flag content, corroborating that the source doc is a widely distributed skill text rather than a project-local variant.
