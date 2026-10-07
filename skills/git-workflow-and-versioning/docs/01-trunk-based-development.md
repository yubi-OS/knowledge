# 01 Trunk-Based Development

Scope: why the git-workflow-and-versioning skill recommends keeping `main` always deployable, merging short-lived feature branches within 1 to 3 days, treating long-lived dev branches as costs, and using feature flags instead of long branches.

## The skill's position

The ground source (yubi-OS/yubiOS skills/git-workflow-and-versioning/SKILL.md) names trunk-based development as the recommended default: "Keep `main` always deployable. Work in short-lived feature branches that merge back within 1-3 days." The skill states that long-lived development branches are hidden costs because they diverge, create merge conflicts, and delay integration. It also asserts that DORA research consistently shows trunk-based development correlates with high-performing engineering teams.

Three supporting claims in the source doc:

- Dev branches are costs. Every day a branch lives, it accumulates merge risk.
- Release branches are acceptable when you need to stabilize a release while main moves forward.
- Feature flags beat long branches: prefer deploying incomplete work behind flags rather than keeping it on a branch for weeks.

The skill is explicit that this is a default, not a law: teams using gitflow or long-lived branches can adapt the principles (atomic commits, small changes, descriptive messages) to their branching model, and "the commit discipline matters more than the specific branching strategy."

## What DORA actually says

DORA's own capability page describes trunk-based development as a practice where developers merge small, frequent updates to a main branch, and notes that it requires developers to break work into small batches (https://dora.dev/devops-capabilities/technical/trunk-based-development/, weight 0.48). The same content is mirrored at https://dora.dev/capabilities/trunk-based-development/ (weight 0.39). Both pages make the small-batch requirement explicit, which is the operational bridge to the skill's "1 to 3 days" merge window: a batch that small can realistically land within days.

The claim that trunk-based development correlates with high-performing teams traces to DORA's research program. DORA's 2017 research report discusses continuous delivery, characterized by frequent deployments and fast feedback, contributing to lower deployment pain and improved IT performance (https://dora.dev/research/2017/, weight 0.44). The source doc's summary is a fair paraphrase of this research line, though the exact "consistently correlates" wording is the skill's own.

## Why long-lived branches are treated as costs

Atlassian's guide on trunk-based development describes the counter-model: long-lived feature branches require more collaboration to merge as they have a higher risk of deviating from the trunk (https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development, weight 0.46). This matches the skill's "every day a branch lives, it accumulates merge risk" framing. A practitioner comparison reaches the same conclusion with different emphasis: feature branches let you work in isolation "until merge day, when everything falls apart" (https://sinra.dev/blog/posts/2026-07-01-trunk-based-development-feature-branches/, weight 0.14, weak backing).

One honest counterpoint the corpus should record: feature flags are not free. The trunk-based-development site's feature flags page quotes practitioner concern that toggles "end up NOT being short-lived as intended" (https://trunkbaseddevelopment.com/feature-flags/, weight 0.33, weak backing). A survey piece notes feature flag conditional logic tends to add clutter (https://ardalis.com/trunk-based-development-vs-long-lived-feature-branches/, weight 0.30, weak backing). The skill's "feature flags > long branches" comparison is therefore a tradeoff judgment, not a claim that flags carry zero cost. A flag registry and a removal plan are the implied discipline.

## Practical reading for agents

- Treat `main` as deployable at every commit; the skill's diagram shows only short-lived spurs off a continuous trunk (source doc).
- Budget a merge window of 1 to 3 days per branch (source doc). If work cannot land that fast, the skill's answer is to ship incomplete work behind a flag, not to extend the branch.
- The skill's guidance on sizing (about 100 lines per commit, split above about 1000 lines, doc 04) is the mechanism that makes the 1 to 3 day window achievable.
- Release branches remain acceptable as a stabilization tool (source doc); the prohibition targets development branches, not release engineering.
