Scope: the discipline layer around the cycle: rationalizations against TDD and their counters, red flags, the Beyonce rule, and the post-implementation verification checklist.

# 08: Verification Discipline

Grounding spine: the source doc "yubi-OS/yubiOS skills/test-driven-development/SKILL.md", "Common Rationalizations", "Red Flags", and "Verification" sections.

## The rationalizations table

The source doc lists seven rationalizations, each with a reality check. The load-bearing ones:

1. "I'll write tests after the code works." Reality: you won't, and tests written after the fact test implementation, not behavior.
2. "This is too simple to test." Reality: simple code gets complicated; the test documents the expected behavior.
3. "Tests slow me down." Reality: they slow you down now and speed you up every later change.
4. "I tested it manually." Reality: manual testing does not persist; tomorrow's change can break it with no way to know.
5. "The code is self-explanatory." Reality: tests ARE the specification, documenting what the code should do.
6. "It's just a prototype." Reality: prototypes become production code; tests from day one prevent test debt.
7. "Let me run the tests again just to be extra sure." Reality: after a clean run, repeating the same command adds nothing unless the code changed since.

The dig corroborates the two most contested entries. On "tests slow me down": the Codemanship post "TDD Slows Me Down. Good." (https://codemanship.wordpress.com/2026/02/08/tdd-slows-me-down-good/, jev weight 0.25, weak) argues the small steps and continuous testing feel slower while delivering sooner, and an educative.io course module (https://www.educative.io/courses/test-driven-development-in-java/writing-tests-slows-me-do, jev weight 0.28, weak) frames the slowdown myth as an investment that pays back in fewer defects. On test debt: practitest's analysis lists the compounding costs as slower release cycles, increased production defects, reduced stakeholder trust, knowledge loss, and higher long-term costs (https://www.practitest.com/resource-center/blog/test-debt-impact-qa-leaders/, jev weight 0.17, weak). IBM's TDD primer states the base definition the rationalizations push against: software tests are written before their corresponding functions (https://www.ibm.com/think/topics/test-driven-development, jev weight 0.60).

## The Beyonce rule

The source doc states it as: "If you liked it, you should have put a test on it." Infrastructure changes, refactoring, and migrations are not responsible for catching your bugs; your tests are. The rule's primary source is the Software Engineering at Google book, published by Abseil: chapter 11 describes the Beyonce Rule, phrased colloquially as "If you liked it, you should have put a CI test on it" (https://abseil.io/resources/swe-book/html/ch11.html, jev weight 0.77). Secondary mentions: a dedicated explainer (https://briansigafoos.com/beyonce-rule/, jev weight 0.11, weak) and Addy Osmani's applied summary crediting Google's testing culture with the rule (https://addyo.substack.com/p/applied-software-engineering-at-google, jev weight 0.25, weak). In the source doc the rule does the specific work of closing the "it worked before their change" loophole: if an infrastructure change breaks your code and no test failed, the missing test is your defect.

## Red flags

The source doc's red flags, condensed: writing code without any corresponding tests; tests that pass on the first run (they may not be testing what you think); "all tests pass" when no tests were actually run; bug fixes without reproduction tests; tests that test framework behavior instead of application behavior; test names that do not describe the expected behavior; skipping tests to make the suite pass; and running the same test command twice in a row without any intervening code change. The last two are integrity failures rather than craft failures, which is why they are red flags and not anti-patterns: they indicate the suite's signal is being falsified.

## The verification checklist

After completing any implementation, the source doc requires: every new behavior has a corresponding test; all tests pass; bug fixes include a reproduction test that failed before the fix; test names describe the behavior verified; no tests were skipped or disabled; coverage has not decreased if tracked. The closing note repeats the seventh rationalization's rule: run each test command after a change that could affect the result; re-running on unchanged code adds no confidence.

The checklist is the practical exit gate for the whole skill: an agent that cannot check every box has not finished, regardless of whether the code appears to work.
