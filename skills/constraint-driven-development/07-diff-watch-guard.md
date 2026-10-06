# Guarding the bar itself: the diff-watch mechanism

Scope: Step 6, the five cheapest-road-to-green diff moves, the four suppression comments, the floor-guard reference implementation, and the external/project/suite circularity ranking. Primary source: the skill's Step 6 section.

## The cheapest road to green

The source doc opens with the circularity objection: someone will point out that if the agent writes the code and the checks, the checks prove nothing. The doc calls this half right and worth engineering around, on the ground that agents do not craft clever loopholes; they hit a red check and take the cheapest road to green (source doc). Five moves to watch in the diff at review time (source doc):

1. The threshold moved. A budget lowered, a severity dropped, a check removed from the fast stage. Compare `CONSTRAINTS.md` against its state at the branch point.
2. A test got easier. `.skip` added, a test file deleted, assertions pulled out of tests that stayed.
3. A checker got silenced. New `@ts-ignore` or `eslint-disable`. 4 suppressions deserve special attention because they switch off a check you rely on: `istanbul ignore` drops code from coverage instead of testing it, `Stryker disable` hides a surviving mutant, and `nosemgrep` and `gitleaks:allow` do it for security findings.
4. Work is unfinished. A stub that throws, an empty `catch` turning a failure into silence, a `TODO` standing where the implementation should be.
5. An exception appeared. A new row in the Exceptions table nobody discussed.

The governing sentence: none of this needs tooling beyond `git diff`; tightening the bar should be silent, loosening it should be loud (source doc).

## Tool corroboration for the watch list

The suppression-specific claims check out against tool documentation. Biome ships a `noSkippedTests` lint rule whose stated purpose is to disallow focused or skipped tests, i.e. exactly the test-weakening move (https://biomejs.dev/linter/rules/no-skipped-tests/javascript/, jev weight 0.56, the strongest dig source in this corpus). Stryker documents mutation-ignoring mechanisms as an explicit opt-out that removes mutants from scoring, which is why the source doc flags `Stryker disable` as a checker silencer (https://stryker-mutator.io/docs/stryker-net/ignore-mutations/, jev weight 0.49, weakly backed). A community tool named falsegreen exists solely to find false-green tests, tests that pass without exercising the behavior they claim (https://github.com/vinicq/falsegreen, jev weight 0.13, weakly backed), independent corroboration that the false-green problem is real enough to warrant tooling.

## The floor-guard reference implementation

Unlike the numbered dimensions, the floor has no de facto tool of its own, so an agent asked to enforce it tends to write a checker from scratch, and 2 agents write 2 different ones. The skill therefore ships a reference implementation of the five checks in `references/floor-guard.md`, diff-scoped, with exit codes 0, 1, and 2, and patterns adaptable per ecosystem. The instruction is to adapt it rather than reinvent it, for the same reason every dimension names a de facto tool: so the mechanism is the same across runs and stacks (source doc).

## Circularity ranking

Not all checks are equally circular. The ranking question: can the agent make this pass by writing code that does not work? 3 tiers (source doc): external checks, where the oracle is outside the project (axe-core encodes WCAG, `osv-scanner` reads a vulnerability database, Lighthouse measures a real browser) and the agent cannot argue with them; project checks, where a human owns the file (your lint rules, your layer boundaries); and suite checks, your own tests, the most useful and the only genuinely circular tier. The bar: a bar made entirely of the third kind is worth less than one with an outside opinion in it; check that at least one external constraint is present (source doc).
