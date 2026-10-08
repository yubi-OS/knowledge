Scope: the RED, GREEN, REFACTOR cycle as the core mechanic of test-driven development: a failing test first, the minimum code to pass, then cleanup under green.

# 01: The TDD Cycle

Grounding spine: the source doc "yubi-OS/yubiOS skills/test-driven-development/SKILL.md", Overview and "The TDD Cycle" sections. The source doc states the core rule: write a failing test before writing the code that makes it pass, and "A test that passes immediately proves nothing."

## RED: write a failing test

The source doc's Step 1 is unconditional: the test must fail. A test that passes on its first run is not a proof of anything; it either tests code that already exists, or it does not execute the behavior it claims to check. The source doc illustrates RED with a test for a taskService.createTask call that does not exist yet, asserting the returned task has an id, the given title, a default status of "pending", and a createdAt date. The failure is the signal that the test is wired to real behavior.

Martin Fowler's bliki entry on Test Driven Development (https://martinfowler.com/bliki/TestDrivenDevelopment.html, jev weight 0.86) describes the same discipline and adds a step the source doc implies but does not name: before the cycle starts, write out a list of test cases first, then take them one at a time. Fowler also stresses writing only enough code to pass the current test, resisting the urge to implement anything else.

## GREEN: minimal code to pass

The source doc's Step 2 is deliberately narrow: write the minimum code that makes the failing test pass, and do not over-engineer. Its example implements createTask with exactly the fields the test asserted: id, title, status defaulted to "pending", createdAt set to a new Date, one insert, return. Anything the test did not demand is out of scope in GREEN. Fowler (same source, weight 0.86) frames this as the discipline that keeps the cycle short: the developer's job at this step is to make one test pass, not to design a system.

A tertiary tutorial corpus backs the same structure. The Codecademy article on red, green, refactor (https://www.codecademy.com/article/tdd-red-green-refactor, jev weight 0.24, weak) and the zetcode TDD tutorial (https://zetcode.com/terms-testing/tdd/, jev weight 0.28, weak) both describe the identical three-step loop, which indicates the cycle is the standard formulation across teaching material and not a project-local convention.

## REFACTOR: clean up with tests green

The source doc's Step 3 lists what refactoring means here: extract shared logic, improve naming, remove duplication, optimize if necessary. The invariant is behavioral: tests still pass after every refactor step, and the doc says to run the tests after every refactor step to confirm nothing broke. The cycle then repeats.

The value of REFACTOR depends on RED and GREEN being honest. Because each new behavior entered the codebase through a failing test, the suite accumulated during RED/GREEN cycles is a behavioral specification, so aggressive cleanup is safe.

## Why the cycle fits agents

The source doc's Overview makes the stakes explicit for agentic coding: "seems right" is not done, a codebase with good tests is an AI agent's superpower, and a codebase without tests is a liability. In an agent workflow the cycle doubles as a verification protocol: the agent can only claim completion when the test it wrote in RED now passes in GREEN, which converts an unfalsifiable claim ("I implemented it") into a checkable one.

## Notes on the corpus record

The dig for this subtopic returned 12 results; 1 carries jev weight above 0.5 (Fowler, 0.86). The remainder are tutorials and aggregator pages in the 0.06 to 0.28 band and are cited here only as corroboration of the cycle's shape, labeled weak per the corpus rules. One search result was a speed-test homepage with weight 0.24; it is recorded in research-db/archive.json but supports no claim here.
