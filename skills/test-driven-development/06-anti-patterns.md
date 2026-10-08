Scope: the six test anti-patterns from the source doc (implementation-detail testing, flaky tests, framework testing, snapshot abuse, missing isolation, mocking everything), their symptoms and fixes.

# 06: Test Anti-Patterns

Grounding spine: the source doc "yubi-OS/yubiOS skills/test-driven-development/SKILL.md", "Test Anti-Patterns to Avoid" table. Each row below gives the source doc's problem statement and fix, then the strongest dig corroboration.

## Testing implementation details

Problem: tests break when refactoring even if behavior is unchanged. Fix: test inputs and outputs, not internal structure. This is the anti-pattern the "test state, not interactions" rule (doc 04) prevents; Fowler's state-versus-behavior distinction (https://www.martinfowler.com/articles/mocksArentStubs.html, jev weight 0.90) is its theoretical basis. The roninsway article on fragile tests (https://roninsway.dev/article/2f7683eff038?lang=en, jev weight 0.17, weak) describes the same symptom: tests that know how a method works instead of verifying what it does.

## Flaky tests

Problem: tests that fail intermittently due to timing or order dependence erode trust in the suite; once a team ignores a red build, the suite's protection value collapses. Fix: deterministic assertions and isolated test state. The flaky-test engineering guides agree on the prevention list: test isolation, deterministic data, stable locators, explicit waits, and environment consistency (https://www.testmuai.com/software-testing-questions/how-to-avoid-flaky-tests/, jev weight 0.11, weak; https://deflaky.com/blog/flaky-test-strategies, jev weight 0.17, weak; https://flakyguard.com/blog/prevent-flaky-tests, jev weight 0.19, weak, whose thesis is that prevention beats detection). A minimal independent definition: flaky tests are tests which do not pass or fail consistently (https://hitchdev.com/hitchstory/approach/flaky-tests/, jev weight 0.15, weak).

## Testing framework code

Problem: it wastes time testing third-party behavior. Fix: only test your own code. The codepipes testing anti-patterns catalog (https://blog.codepipes.com/testing/software-testing-antipatterns.html, jev weight 0.17, weak) collects this family of mistakes at the process level; the yegor256 full list of unit-testing anti-patterns (https://www.yegor256.com/2018/12/11/unit-testing-anti-patterns.html, jev weight 0.33, weak) includes tests that are called unit tests but are really integration tests, the adjacent failure of not knowing which layer you are testing.

## Snapshot abuse

Problem: large snapshots nobody reviews, which break on any change, so reviewers reflexively approve the update and the snapshot verifies nothing. Fix: use snapshots sparingly and review every change. The buglyst guide names the hidden failure modes: snapshots can hide real bugs, bloat diffs, and silently break CI (https://buglyst.com/blog/snapshot-testing-pitfalls, jev weight 0.11, weak).

## No test isolation

Problem: tests pass individually but fail together, usually through shared mutable state. Fix: each test sets up and tears down its own state. The pytest "Anatomy of a test" doc states the invariant directly: cleanup is where the test picks up after itself, so other tests are not accidentally influenced by it (https://docs.pytest.org/en/stable/explanation/anatomy.html, jev weight 0.93).

## Mocking everything

Problem: tests pass while production breaks, because the mocks encode assumptions rather than behavior. Fix: prefer real implementations > fakes > stubs > mocks, and mock only at boundaries where real dependencies are slow or non-deterministic. Full treatment in doc 05; primary backing at https://testing.googleblog.com/2024/02/increase-test-fidelity-by-avoiding-mocks.html (jev weight 0.83) and https://testing.googleblog.com/2013/05/testing-on-toilet-dont-overuse-mocks.html (jev weight 0.78).

## The meta-lesson

The source doc's six rows share one root cause: a test that verifies something other than the behavior it names. The TestUnity catalog reaches the same conclusion from the practitioner side, opening with "The Liar", tests that always pass (https://blog.testunity.com/testing-anti-patterns-common-mistakes-fixes/, jev weight 0.17, weak). The defensive discipline is the same one the TDD cycle enforces: if every test entered the suite by failing for the named reason first (RED), liar tests, untested snapshots, and implementation-coupled tests are caught at authoring time rather than eroding the suite silently.
