# 03 - Simplicity First

Scope: Rule 0, ask what is the simplest thing that could work, the simplicity checks that catch premature complexity, and avoiding abstraction until the third use case demands it.

## The rule

The source doc (`yubi-OS/yubiOS skills/incremental-implementation/SKILL.md`) states Rule 0 as a question to ask before writing any code: "What is the simplest thing that could work?" After writing code, the doc requires a review against 4 checks:

1. Can this be done in fewer lines?
2. Are these abstractions earning their complexity?
3. Would a staff engineer look at this and say "why didn't you just..."?
4. Am I building for hypothetical future requirements, or the current task?

The doc's simplicity checks give concrete failures: a generic EventBus with a middleware pipeline for one notification is wrong, a simple function call is right; an abstract factory for 2 similar components is wrong, 2 straightforward components with shared utilities is right; a config-driven form builder for 3 forms is wrong, 3 form components is right.

## YAGNI, the principle behind the rule

Rule 0 is a restatement of YAGNI. Martin Fowler defines it precisely: Yagni ("You Aren't Gonna Need It") is the principle that we should not build presumptive features, and he is explicit that this is not a license to neglect internal quality of what you do build (https://martinfowler.com/bliki/Yagni.html, jev weight 0.87). The cost arithmetic comes from Extreme Programming: keep the system uncluttered with extra stuff you guess will be used later, because only 10% of that extra stuff will ever get used, so you are wasting 90% of the effort you spend on it (http://www.extremeprogramming.org/rules/early.html, jev weight 0.77).

The fourth check in the source doc ("hypothetical future requirements, or the current task?") is exactly the presumptive-feature test. If you cannot name a current requirement that needs the abstraction, YAGNI says do not build it.

## The rule of three

For abstractions, the source doc sets the bar at the third use case: red flag "Building abstractions before the third use case demands it". This matches the classic rule of three, "three strikes and you refactor", a code refactoring rule of thumb to decide when similar pieces of code should be refactored to reduce duplication: the first time you do something you just do it, the second time you wince at the duplication but duplicate anyway, and the third time you refactor (https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming), jev weight 0.49, weak backing).

The reasoning for waiting until 3: write the code three times before you generalize, because by then you understand the variation space and the abstraction has a chance of being correct (https://decastro.work/blog/stop-premature-abstractions-rule-of-three/, jev weight 0.27, weak backing). A good abstraction separates responsibilities and clarifies the intent of the code; a wrong one hides duplication that was not really duplication (https://understandlegacycode.com/blog/refactoring-rule-of-three/, jev weight 0.34, weak backing).

## Naive first, optimize after

The source doc's closing instruction for Rule 0: "Implement the naive, obviously-correct version first. Optimize only after correctness is proven with tests." This orders the increment cycle around simplicity: within a slice, write the plain version, prove it with the test step, and only then consider structure. The order matters because an optimization applied before a test exists cannot tell you whether it preserved behavior.

## What simplicity is not

Rule 0 does not mean the code should be careless. Fowler's YAGNI entry draws the boundary: do not build presumptive features, but keep the internal quality of the features you do build high (https://martinfowler.com/bliki/Yagni.html, jev weight 0.87). In the source doc's terms, the simplest thing that could work is still subject to the increment checklist: it must pass the test suite, the build, type checking, and linting before the increment commits.
