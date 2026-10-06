# 03 - Localize and Bisect

Scope: Step 2 of the triage checklist, narrowing WHERE the failure happens across the 6-layer tree, and git bisect as the regression-localization tool.

## The layer tree

The source doc's Step 2 asks one question, which layer is failing, and routes to a first inspection point for each answer:

- UI / Frontend: check console, DOM, network tab
- API / Backend: check server logs, request and response
- Database: check queries, schema, data integrity
- Build tooling: check config, dependencies, environment
- External service: check connectivity, API changes, rate limits
- Test itself: check if the test is correct (a possible false negative)

Two layers deserve emphasis. The "test itself" branch is the anti-guessing branch: before blaming code, the source doc makes you consider that the test may be the wrong party. The "external service" branch encodes the reality that a correct local system can still fail on third-party drift: connectivity, API changes, and rate limits are listed as first-class causes, not footnotes. Cloud documentation organizes the same discipline as a collection of interrogation techniques for a specific layer, for example virtual networking (https://canonical-openstack.readthedocs-hosted.com/en/latest/reference/network-debugging/, w 0.76), which is the layer-tree idea applied one level deeper.

## Bisection for regressions

For regression bugs, where something worked before and stopped, the source doc prescribes git bisect:

```
git bisect start
git bisect bad                     # current commit is broken
git bisect good <known-good-sha>  # this commit worked
git bisect run <test command>     # automate the midpoint testing
```

The official git-bisect documentation confirms the mechanism and its generality: git bisect finds the commit that changed any property of your project, and the terms "old" and "new" can replace "good" and "bad" or be customized entirely (https://git-scm.com/docs/git-bisect, w 0.88). That generality matters for the yubiOS context: bisection is not limited to test pass or fail, it localizes any observable property change, including a fix landing or a benchmark improving.

The source doc's bisect example again uses npm as placeholder syntax and directs you to substitute the repository's own focused-test command, consistent with the reproduce step's convention.

## Where localization stops

Step 2 ends when the failure is pinned to a layer and, for regressions, to a commit. It deliberately does not try to explain the bug yet. The source doc sequences localization before reduction (Step 3) and root-cause work (Step 4) because a localized, minimal, reproducible failure is cheap to reason about, while an unlocalized one invites symptom patching. Generic definitions of debugging as the process of finding, isolating, and resolving errors describe the same find-then-isolate-then-fix ordering (https://aws.amazon.com/what-is/debugging/, w 0.51).
