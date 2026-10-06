# 04 - Deployment Strategies

## Scope

How code moves from merge to production safely: preview deployments per PR, feature flags that decouple deployment from release, staged rollouts with a monitoring window, and the rollback plan every deployment needs.

## Preview deployments (source doc)

The source doc prescribes a preview deployment for every PR so reviewers can test manually. The workflow snippet gates the `deploy-preview` job on `github.event_name == 'pull_request'` and deploys with `npx vercel --token=${{ secrets.VERCEL_TOKEN }}` (source doc). Two things are structural: the token is a secret, never a literal, and the preview exists per PR, which keeps manual testing off shared staging.

## Feature flags (source doc)

Feature flags decouple deployment from release. The source doc lists four capabilities: ship code without enabling it (merge to main early, enable when ready), roll back without redeploying (disable the flag instead of reverting code), canary new features (enable for 1% of users, then 10%, then 100%), and run A/B tests (compare behavior with and without the feature) (source doc). The code pattern is a conditional branch keyed on a flag check with user context: `featureFlags.isEnabled('new-checkout-flow', { userId })` selecting the new render path over the legacy one (source doc).

The flag lifecycle in the source doc is: Create, Enable for testing, Canary, Full rollout, then remove the flag and the dead code. Its warning: "Flags that live forever become technical debt. Set a cleanup date when you create them" (source doc).

External writing covers the same mechanisms. A feature-flag vendor guide describes rolling out from 1% to 100% with rollout steps, monitoring, and safe rollback (https://configcat.com/blog/how-to-implement-a-canary-release-with-feature-flags/, weight 0.25, weak). Another weak-backed source ties the coupling argument to data: it reports a 2026 study finding coupled deployments produce unsafe activations 60% of the time versus none for gated rollouts (https://www.growthbook.io/blog/blog-decouple-deployment-release-feature-flags, weight 0.27, weak). A canary-and-flags explainer notes canary succeeds across machines first, then feature-level rollouts proceed under flags (https://www.harness.io/blog/canary-release-feature-flags, weight 0.32, weak). Treat these as corroboration, not proof: vendor blogs are marketing-adjacent and the corpus weights them below the 0.5 authority line.

## Staged rollouts (source doc)

The source doc's rollout sequence: PR merged to main, staging deployment fires automatically, manual verification on staging, then production deployment (manual trigger or auto after staging), then a 15-minute error-monitoring window, with rollback on detected errors and done on clean (source doc). The 15-minute window is a concrete, falsifiable commitment; treat it as the skill's own standard rather than an industry constant.

## Rollback plan (source doc)

"Every deployment should be reversible" (source doc). The mechanism given is a manual rollback workflow triggered by `workflow_dispatch` with a required `version` input, which runs `npx vercel rollback ${{ inputs.version }}` to redeploy the specified previous version (source doc). The pattern generalizes beyond Vercel: the requirement is an operator-invocable path to a known-good version that does not depend on remembering how the last deploy worked.

External guides on rollback strategy cover triggers, trade-offs, and tooling but from practitioner-blog quality; the strongest of this dig returned weights in the 0.16 to 0.26 band (for example https://qabrains.com/the-ultimate-guide-to-rollback-strategy-best-practices-tools-and-real-worl at 0.16, https://devopsaitoolkit.com/blog/rollback-strategy-in-devops-a-2026-practical-guide/ at 0.17, both weak). None contradict the source doc; none are authoritative enough to extend it.

## Connecting the pieces

The four mechanisms compose: preview deployments verify the change before merge; flags decouple the merged-but-incomplete code path from users; staged rollout moves verified code through staging into production under a monitoring window; the rollback workflow is the exit ramp when that window shows errors. The source doc's red-flag list makes the composition mandatory: "Production deploys without staging verification" and "No rollback mechanism" are both listed red flags (source doc).

## Numbers to keep

- Canary ladder: 1%, then 10%, then 100% of users (source doc).
- Monitoring window after production: 15 minutes (source doc).
- Flag lifecycle stages: 5, from create to removal (source doc).
- Rollout-step data point on coupled deployments: 60% unsafe activations, weak-backed vendor study claim (https://www.growthbook.io/blog/blog-decouple-deployment-release-feature-flags, weight 0.27).
