# Decision Framework and Variation Scoring

Scope: How the bundling-versus-per-runner decision was made: five variations scored on a 4 to 20 scale across five ideation lenses, finalist selection of V1 and V4, and the two-step adoption ordering rationale.

## The scoring frame

The decision was produced by a solo ideation session (framing log session/omn-100-bundle-vs-per-runner-solo-2026-07-30.md, referenced from the yubiOS decision record, Linear OMN-100) that generated one variation per lens and scored each on a 4 to 20 scale. The five variations:

| Variation | Lens | Score | Verdict |
|---|---|---|---|
| V1, bundle as OCI artifact | Simplification | 12 | Finalist, medium-term |
| V2, per-runner build, keep it | Constraint-removal | 13 | Dropped, does not address the question |
| V3, hybrid AMD64-bundle plus ARM64-per-runner | Audience-shift | 11 | Dropped, complicates without proportionate gain |
| V4, bundle only as a CI cache | Combination | 14 | Finalist, near-term first step |
| V5, bundle via bcvk's image model | Inversion | 9 | Dropped, scope creep into bcvk |

The scoring shows something worth naming: the highest-scoring variation (V2, 13) was still rejected. Score alone was not the decision rule. Each variation was judged on whether it actually removes the constraint that motivated the review, and V2 does not. This is the same distinction build systems draw between a task that runs and a task whose inputs have changed: re-executing a task that would only re-produce the same output is waste (https://docs.gradle.org/current/userguide/gradle_optimizations.html, jev weight 0.93). V2 is the task that runs; V4 is the change that makes it not run.

## The two finalists

V4 (14/20) and V1 (12/20) both attack the repeat-build cost, at different points on the durability spectrum:

- V4 keeps everything in the existing build path and adds memory to it. No new artifact, no new surface to sign, audit, or refresh.
- V1 creates the durable pre-built artifact: 0mniteck/yubios:libvfio-user-<sha>, a published OCI artifact that CI pulls by digest instead of building.

The general trade these two sit on is the cache-versus-artifact trade that every CI system exposes. GitLab's documentation treats artifacts as job outputs stored for retrieval and reuse across jobs and pipelines (https://docs.gitlab.com/ci/jobs/job_artifacts/, jev weight 0.97); caches are the mirror-image mechanism, an input snapshot stored so the producing step can be skipped. V4 lives entirely on the cache side of that line; V1 crosses to the artifact side.

## Why the two-step ordering wins

The adopted decision is explicitly two-step (yubi-OS/yubiOS refs/libvfio-user-bundle-decision-2026-07-30.md, Linear OMN-100):

1. Near-term: add a GitHub Actions cache to the existing per-runner build (V4), eliminating repeat-build cost on cache hits.
2. Medium-term: publish 0mniteck/yubios:libvfio-user-<sha> as the durable pre-built artifact (V1), retire the per-runner meson/ninja stage, and have CI pull the digest.

Three reasons carry the ordering:

- Observability. V4 is measurable in workflow logs: cache hit or miss is visible on every run. Measuring the hit rate over 5 to 10 runs turns the V1 question from a debate into a data point. If the hit rate is high, above 80 percent, V1's marginal value is small; if low, V1 is essential.
- Cost of being wrong. V4 is described in the decision record as a one-line workflow edit, roughly 5 minutes of work. If it solves the problem, V1 never needs to exist. Going straight to V1 without that data would pay the full cost of a new artifact surface (signing, audit, refresh ownership) before knowing whether it is needed.
- Alignment with the existing distribution scheme. ADR-022 (Unified OCI Distribution, Per-Artifact Tags on 0mniteck/yubios) already establishes per-artifact OCI tags as the durable distribution surface. V1 is not a new pattern, it is the canonical pattern applied to one more artifact. That makes V1 safe as a later step, but it does not make it free, which is why it waits for the data.

## What the framework deliberately avoided

The framework refused to score options that did not answer the question. V2 scored well and was dropped anyway. V3 and V5 scored worst and were dropped for the right reasons: V3 because splitting the bundle by architecture adds a second build path without proportionate gain, V5 because routing the bundle through bcvk's image model drags the decision into bcvk's scope rather than the build's. The record also makes the un-testable bet explicit: the full generation log, including stress-tests of V1 and V4 and the bet that could not be tested, lives in the framing log rather than being asserted as settled in the decision itself.

That restraint is the transferable part of this framework. Score everything, but let the question, not the score, eliminate options. Sequence adoption so the cheapest observable step generates the data the expensive step needs. And keep the rejected reasoning written down, because the next person to open this question will otherwise regenerate V3 and V5 from scratch.
