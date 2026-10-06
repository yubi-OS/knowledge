# 08 - Rationalizations, Red Flags, and the Verification Checklist

## Scope

The source doc's five rationalization-versus-reality pairs, its seven red flags, and the seven-item post-setup verification checklist, with dig-grounded detail on flaky tests and skip mechanics.

## Rationalizations (source doc)

The source doc tabulates five excuses and their corrections:

1. "CI is too slow" versus: optimize the pipeline, do not skip it; a 5-minute pipeline prevents hours of debugging.
2. "This change is trivial, skip CI" versus: trivial changes break builds; CI is fast for trivial changes anyway.
3. "The test is flaky, just re-run" versus: flaky tests mask real bugs and waste everyone's time; fix the flakiness.
4. "We'll add CI later" versus: projects without CI accumulate broken states; set it up on day one.
5. "Manual testing is enough" versus: manual testing does not scale and is not repeatable; automate what you can (source doc).

Each correction is a redirect to a different doc in this corpus: 1 to CI optimization (doc 07), 3 to flaky-test discipline (this doc, below), 4 to the day-one pipeline in doc 02, 5 to the automated gate pipeline in doc 01.

## Flaky tests: the rerun trap (high-backed dig)

The source doc's third rationalization is the one external sources substantiate most strongly. Nx's knowledge base defines a flaky test precisely: "a flaky test passes and fails on the same code" (https://nx.dev/docs/kb/flaky-tests-in-ci, weight 0.81). That definition is what makes rerunning dishonest: the binary outcome stops encoding information about the code.

CircleCI's engineering blog describes the prevailing alternative as "rerun until green" and states plainly that it "works in the moment" while leaving the underlying defect in place (https://circleci.com/blog/fix-flaky-tests-with-chunk/, weight 0.54). This matches the source doc's "flaky tests mask real bugs" verbatim in substance.

The weak band of the dig adds detection and cause taxonomy: guides listing 7 detection methods for flaky tests in pipelines (https://deflaky.com/blog/how-to-detect-flaky-tests, weight 0.22, weak) and cause-and-fix breakdowns (https://saucelabs.com/resources/blog/how-to-reduce-flaky-tests-in-ci-cd, weight 0.37, weak; https://oneuptime.com/blog/post/2026-01-24-fix-flaky-tests-cicd/view, weight 0.19, weak). The consistent message across weights: diagnose the cause, do not normalize the retry.

## Skip instructions and required checks (high-backed dig)

A related discipline risk is the `[skip ci]` commit-message instruction. Buildkite's documentation explains that a `[skip ci]` inside a squashed commit message suppresses the build for the merge commit itself, so teams must remove the instruction from the squash (https://buildkite.com/docs/pipelines/configure/skipping, weight 0.94). GitHub's docs add the enforcement interaction: with required status checks configured, a skipped workflow blocks merge until a new commit without the skip instruction is pushed (https://docs.github.com/en/actions/how-tos/manage-workflow-runs/skip-workflow-runs, weight 0.96). Together these bound the legitimate use of skipping (irrelevant-trigger workflows) and expose its abuse (dodging required gates).

## Anti-pattern corroboration (weak band)

A practitioner CI/CD book chapter reports that survey respondents consider ignoring a task's outcome when determining build status (labeled BP16) a defeat of CI's primary purpose, citing static analysis warnings that do not fail the build (https://alexyorke.github.io/beginning-ci-cd-book/chapters/General_CICD_Anti-patterns.html, weight 0.36, weak). A curated anti-pattern list covers monolithic builds and their consequences (https://najx.dev/cicd-anti-patterns/, weight 0.22, weak). Both agree with the source doc; neither carries enough authority to extend it.

## Red flags (source doc)

The source doc lists seven red flags, which double as an audit instrument for an existing setup:

1. No CI pipeline in the project.
2. CI failures ignored or silenced.
3. Tests disabled in CI to make the pipeline pass.
4. Production deploys without staging verification.
5. No rollback mechanism.
6. Secrets stored in code or CI config files, not a secrets manager.
7. Long CI times with no optimization effort (source doc).

Each maps to a doc in this corpus: 1 and 3 to doc 01, 2 to docs 01 and 06, 4 and 5 to doc 04, 6 to doc 05, 7 to doc 07.

## Verification checklist (source doc)

After setting up or modifying CI, the source doc requires checking:

1. All quality gates are present: lint, types, tests, build, audit.
2. Pipeline runs on every PR and push to main.
3. Failures block merge, via branch protection.
4. CI results feed back into the development loop.
5. Secrets are stored in the secrets manager, not in code.
6. Deployment has a rollback mechanism.
7. Pipeline runs in under 10 minutes for the test suite (source doc).

Items 1 through 3 verify the gate pipeline exists and is enforced; item 4 verifies the feedback loop is wired; items 5 through 7 verify the operational hygiene that docs 05, 04, and 07 cover.

## Why this doc is a corpus doc

The rationalizations and red flags are the skill's immune system: they pre-answer the arguments used to weaken everything else the skill prescribes. The dig adds one sharpening that the source doc does not state numerically: a flaky test is one that passes and fails on the same code (https://nx.dev/docs/kb/flaky-tests-in-ci, weight 0.81), which converts "the test is flaky" from a vague excuse into a diagnosable defect class with a required fix.
