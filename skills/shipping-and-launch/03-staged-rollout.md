# 03 Staged Rollout

Scope: the 6-step rollout sequence from staging to full rollout, with the monitoring window at each stage.

## The sequence

The source doc fixes the order of operations (source doc, Staged Rollout):

1. DEPLOY to staging. Full test suite in the staging environment plus a manual smoke test of critical flows.
2. DEPLOY to production with the feature flag OFF. Verify the deployment succeeded via health check and check error monitoring for no new errors.
3. ENABLE for team (flag ON for internal users). The team uses the feature in production, with a 24-hour monitoring window.
4. CANARY rollout (flag ON for 5% of users). Monitor error rates, latency, and user behavior; compare canary metrics against baseline; 24 to 48 hour monitoring window; advance only if all thresholds pass (see the thresholds doc in this corpus).
5. GRADUAL increase: 25%, then 50%, then 100%, with the same monitoring at each step and the ability to roll back to the previous percentage at any point.
6. FULL rollout: flag ON for all users, monitored for 1 week, then the feature flag is cleaned up.

Two design choices are worth naming. First, staging and production deployment are separate steps, and production deploy happens with the flag off, so step 2 changes no user-visible behavior. Second, every expansion step has a monitoring window in front of it; the windows (24 hours for team enablement, 24 to 48 hours for canary, 1 week at full) are stated numbers in the source doc, not defaults to negotiate per launch.

## Why canary works

Fowler's definition: canary release is a technique to reduce the risk of introducing a new software version in production by slowly rolling out the change to a small subset of users before rolling it out to the entire infrastructure and making it available to everybody (https://martinfowler.com/bliki/CanaryRelease.html, jev 0.80). The source doc's step 4 is exactly this, with the subset fixed at 5% and the comparison target fixed at baseline.

The Kubernetes project's own canary tutorial describes the same mechanics: deploy the new version alongside the existing version, give the canary a small percentage of traffic, and monitor it with real production traffic (https://kubernetes.io/docs/tutorials/stateless-application/canary-deployment/, jev 0.90). This is the mechanism-level description of what the source doc's flag-percentage ramp implements at the application layer: the source doc rolls out by flag evaluation, Kubernetes rolls out by replica weighting, and both are "small percentage first, watch, then expand".

Google's SRE book treats launch coordination as an engineering function with explicit deployment strategies for product launches, rather than a scheduling problem (https://sre.google/sre-book/reliable-product-launches/, jev 0.90). That framing matches the source doc's: the rollout sequence is a designed artifact, reviewed before the launch, not improvised during it.

## Automation drift note (2026-10-08)

The source doc's sequence is manual: humans watch dashboards at each stage and decide to advance. The surrounding ecosystem has moved toward automating the advance-or-hold decision. Red Hat's Argo Rollouts is a Kubernetes controller providing canary deployment with canary analysis built in (https://developers.redhat.com/articles/2024/05/01/canary-deployment-strategy-argo-rollouts, jev 0.71), and Google and Netflix's Kayenta runs automated canary analysis inside a delivery pipeline by fetching configured metrics, running statistical tests, and producing an aggregate judgment (https://cloud.google.com/blog/products/gcp/introducing-kayenta-an-open-automated-canary-analysis-tool-from-google-netflix-and-stitch-fix, jev 0.72). The thresholds doc in this corpus covers the metric comparison the source doc does by hand; when the rollout is executed on a platform with automated canary analysis, the same thresholds become the automation's configuration. This is a dated correction of emphasis, not a contradiction: the source doc's monitoring windows and advance criteria still apply.

## Rollback granularity

The source doc notes that at each gradual step you can "roll back to the previous percentage at any point" (source doc). This is a property the flag implementation must actually have: reducing a percentage must be possible without a redeploy. If the flag system cannot shrink the cohort quickly, the canary stage loses its main safety property, which is that the blast radius is a dial, not a commitment.
