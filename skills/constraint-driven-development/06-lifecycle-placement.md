# Wiring checks to the lifecycle

Scope: Step 5, phase placement with time budgets, the scope-to-the-diff rule, and the cost-decides-placement rule. Primary source: the skill's Step 5 section.

## The phase table

The source doc's warning frames the section: the single biggest mistake is running everything everywhere. A check that stalls the agent gets switched off, and a gate people switched off is worse than no gate, because the bar still looks like it exists (source doc). The table places each check layer in a phase with a budget (source doc):

| Phase | What runs | Budget |
|---|---|---|
| BUILD | types, lint, secrets, the floor | under 5 s, changed file only |
| VERIFY | related tests, coverage on changed lines | under 90 s |
| REVIEW | everything, plus the diff-watch guards | minutes |
| SHIP | direction checks, no regressions | CI |

The BUILD and VERIFY budgets correspond to the `check:fast` and `check:task` scripts from 05; the REVIEW phase is where the floor-guard and threshold-comparison checks of 07 run, and SHIP is where `check:full` and the measured-metric direction checks run in CI.

## Two placement rules

1. Scope to the diff. Check the lines this change touched, not the whole repo. The source doc's reasoning: coverage of changed lines is a number the agent can move; project coverage is one it inherited (source doc).
2. Cost decides placement. Anything over a few seconds moves out of the edit loop. Mutation testing on a whole repo takes hours; on the files a change touched it takes under a minute, which is the difference between a check people run and one they do not (source doc).

## External corroboration

The fast-feedback principle is standard practice in the hooking ecosystem: the pre-commit framework positions itself as a framework for managing and maintaining hooks that run before a commit, precisely so problems are caught at edit speed (https://pre-commit.com/, jev weight 0.17, weakly backed; https://github.com/pre-commit/pre-commit-hooks, jev weight 0.41, weakly backed). Pipeline-architecture guidance makes the mirror-image point at the CI end: stages are ordered from fast lint and type checks to slower test and security stages, with the slowest gates running only near merge (https://knowledgelib.io/software/system-design/cicd-pipeline/2026, jev weight 0.12, weakly backed; https://jarroba.com/en/ci-continuous-integration-analysis-tests-quality-and-security/, jev weight 0.19, weakly backed). A 2026 piece on AI coding feedback loops argues the same for agent workflows: the inner loop must be seconds-fast or the agent stops using it, which is the same mechanism the source doc describes for a stalling check (https://www.aihero.dev/essential-ai-coding-feedback-loops-for-type-script-projects, jev weight 0.13, weakly backed).

The red-flag tie-in: slow checks landing in the edit loop until someone starts passing `--no-verify` is listed in the source doc as a stop signal (source doc, see 09).
## The REVIEW and SHIP phases

REVIEW is the only phase with a minutes-scale budget, and that is deliberate: it is where the expensive, low-frequency checks live, the diff-watch guards that compare `CONSTRAINTS.md` against its branch-point state and the mutation run scoped to the changed files (source doc, see 07). SHIP is CI's domain: direction checks and regression checks, the `check:full` layer from 05 plus the ratchet comparisons from 08, where the unlimited wall-clock budget of a pipeline makes slow-but-thorough checks affordable (source doc).

The hooking ecosystem supports the same split. Pre-commit-style hooks carry the BUILD layer: framework documentation describes running checks before each commit so issues are caught at authoring time, not review time (https://pre-commit.com/, jev weight 0.17, weakly backed), and lint-staged workflows scope those hook runs to the files the change touched (https://dev.to/samueldjones/run-a-typescript-type-check-in-your-pre-commit-hook-using-lint-staged-husky-30id, jev weight 0.12, weakly backed). Pipeline best-practice guides make the SHIP-side mirror argument: keep full feedback under roughly 10 minutes so the pipeline gets used at all (https://docs.gitscrum.com/en/best-practices/continuous-integration-best-practices, jev weight 0.14, weakly backed), and stage ordering runs from cheap fast checks to expensive security scans (https://jarroba.com/en/ci-continuous-integration-analysis-tests-quality-and-security/, jev weight 0.19, weakly backed).

## The failure mode placement prevents

The budget column is not decoration; it is the mechanism that keeps the gate alive. The source doc's warning, that a gate people switched off is worse than no gate because the bar still looks like it exists, implies a test: if a check were deleted from the config tomorrow, would anyone notice from behavior? A check inside its budget passes that test by being run on every relevant change; a check outside its budget gets `--no-verify`, and the bar silently stops firing while the file still claims it (source doc, see 09). This is also why the `Runs at` column in `CONSTRAINTS.md` (04) and the budget column here are two views of the same decision: the file records where a check fires, the lifecycle section records why it fires there and nowhere else.
