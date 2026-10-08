# 02 Feature Flag Strategy

Scope: decoupling deployment from release with feature flags: the flag lifecycle, the ownership and expiry rules, and the anti-patterns to avoid.

## Why flags exist

The source doc's thesis is one sentence: "Ship behind feature flags to decouple deployment from release" (source doc, Feature Flag Strategy). The code example shows the pattern: fetch flags for the user, branch on the flag, and fall through to the existing behavior when the flag is off (source doc). Deployment and release are different events, and the flag is the seam between them.

Martin Fowler's article on feature toggles, the canonical reference for this technique, defines it the same way: toggles allow teams to modify system behavior without changing code, and they fall into various usage categories whose distinctions matter when implementing them (https://martinfowler.com/articles/feature-toggles.html, jev 0.86). The practical consequence Fowler draws, and the source doc implies, is that a flag is not a config value; it is a code path with its own lifecycle.

## The lifecycle

The source doc specifies a 5-stage lifecycle (source doc):

1. DEPLOY with flag OFF. Code is in production but inactive.
2. ENABLE for team or beta. Internal testing in the production environment.
3. GRADUAL ROLLOUT. 5% then 25% then 50% then 100% of users.
4. MONITOR at each stage. Watch error rates, performance, and user feedback.
5. CLEAN UP. Remove the flag and the dead code path after full rollout.

The critical property of stage 1 is that the deploy itself is safe by construction: with the flag off, the new code ships but no user reaches it. The critical property of stage 5 is that cleanup is part of the lifecycle, not an afterthought. A flag that survives its rollout is an unfinished change.

## The rules

The source doc states 4 rules (source doc): every feature flag has an owner and an expiration date; flags are cleaned up within 2 weeks of full rollout; feature flags are not nested, because nesting creates exponential combinations of states; and both flag states (on and off) are tested in CI.

The no-nesting rule is the one with the largest blast radius if ignored: 2 nested flags produce 4 combinations, 3 produce 8, and none of the combinations beyond the 2 the author thought about get tested. Fowler's article makes the same debt argument in general terms: toggles that outlive their purpose become one of the worst kinds of technical debt (https://martinfowler.com/articles/feature-toggles.html, jev 0.86; the debt framing is also made in a DZone piece, https://dzone.com/articles/feature-toggles-are-one-worst, jev 0.13, weak backing).

Flag debt management is a named practice in the flags industry: Unleash discusses using the flag system itself to track and manage flag debt (https://www.getunleash.io/blog/using-feature-flags-to-manage-technical-debt, jev 0.28, weak backing). The source doc's owner-plus-expiration rule is the minimal version of that: a flag with an owner and an expiry cannot silently become permanent.

## Kill switch as a corollary

The staged rollout doc in this corpus uses the flag as a rollback mechanism: disabling a flag is the fastest rollback path in the source doc's rollback plan, budgeted at under 1 minute versus under 5 minutes for a redeploy (source doc, Rollback Strategy). Unleash frames the same choice between kill switches and progressive delivery as a deployment-strategy decision (https://www.getunleash.io/blog/kill-switch-vs-progressive-delivery, jev 0.40, weak backing). The source doc's position is that you get both: progressive delivery through the lifecycle, and a kill switch because the flag exists.

## What the source doc does not cover

The source doc does not name a flag-management system, does not specify how the 5/25/50/100 ramp is implemented (client-side evaluation versus server-side config), and does not discuss experiment toggles or A/B measurement. Those are out of scope for the skill: its scope line covers the flag discipline around launches, not the tooling ecosystem. Do not import tooling claims into this corpus that the source doc does not make.
