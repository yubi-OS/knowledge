# Actions Cache: The Near-Term Step (V4)

Scope: Step 1 (Variation 4) of the adopted decision: adding a GitHub Actions cache to the per-runner build, the cache key design over commit SHA, base image digest and runner OS, hit/miss observability, and hit-rate measurement as the decision data for Step 2.

## What Step 1 changes and what it does not

Step 1 is a single workflow file edit. The decision record specifies editing .github/workflows/ci_test-vgpu-vm.yml to add an actions/cache step (pinned version per yubiOS PINNED.md), keyed on three components: the pinned libvfio-user commit (libvfio-user-<commit>, 37491ed9 at decision time), the base image digest from PINNED.md (fedora-bootc:45), and the runner OS. No code changes outside the workflow file, no new artifact surface, roughly 5 minutes of work.

The cache key composition is well-supported by GitHub's own documentation. A cache key can include any of the contexts, functions, literals, and operators supported by GitHub Actions (https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching, jev weight 0.81). The three chosen inputs are exactly the right set because they exhaustively determine the build output: change the commit, the toolchain image, or the runner platform and the cached build is no longer the build you want.

## The observability payoff

The cache action reports its own outcome: the cache-hit output is set to true when the cache is restored using the primary key, and to false when the cache is restored using restore-keys or when no cache is restored at all (https://github.com/actions/cache, jev weight 0.78). This single field is the measurement instrument of Step 1. The decision record calls for reading the hit rate from the cache-step logs over 5 to 10 runs, and using that data to decide whether Step 2 (the published artifact) is worth its maintenance cost.

This is the property that made V4 the first step rather than V1: the cheap change generates the data that justifies or kills the expensive change. If the hit rate is high, above 80 percent, V1's marginal value is small because the per-runner build is already mostly skipped. If the hit rate is low, the cache is not saving enough and the durable artifact earns its keep.

## The constraints the cache operates under

GitHub Actions cache storage has real limits that bound how much V4 can carry alone:

- The classic cap is 10 GB per repository. Once the limit is reached, older caches are evicted based on when the cache was last accessed, and caches not accessed within the last week are also evicted (https://github.com/actions/cache, jev weight 0.86).
- The limits reference page points to the cache storage limits and how to increase them (https://docs.github.com/en/actions/reference/limits, jev weight 0.92).
- As of November 2025, repositories can exceed the previous 10 GB cap on a pay-as-you-go model, while every repository continues to receive 10 GB at no cost (https://github.blog/changelog/2025-11-20-github-actions-cache-size-can-now-exceed-10-gb-per-repository/, jev weight 0.73).
- On budgeted setups, exceeding configured budgets makes the cache read-only until billing status resolves or usage drops below the free 10 GB through expiry or deletion (https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching, jev weight 0.91).

For one pinned C library build, the footprint is small enough that none of these limits bind. But they matter for the design of the key: because a per-commit key (libvfio-user-<commit>) creates a new cache entry on every bump, a high commit-cadence dependency would churn entries fast. libvfio-user's low cadence is one of the facts that makes the per-commit key viable here.

Restore-keys are the safety valve for misses. If no cache hit occurs for the primary key, restore-keys are used sequentially in the order provided to find and restore a cache (https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching, jev weight 0.82). For a libvfio-user build this buys little, since a partial restore of a different commit's build tree risks stale artifacts, and the decision record correctly keeps the design simple: exact key, exact path.

## Why the staging path matters

The workflow already stages the build to /opt/libvfio-user/<commit>, and the cache key matches that path (decision record). This is not cosmetic. The cache action restores and saves directory paths, so the key and the path must describe the same thing: the fully built tree for a specific commit. When the key says libvfio-user-37491ed9 and the path holds the build of 37491ed9, a restore is semantically identical to a fresh build and the downstream steps cannot tell the difference.

## What Step 1 deliberately does not do

No OCI artifact is created, nothing is published to 0mniteck/yubios, nothing new needs signing, and the meson/ninja stage stays in the workflow. All of that is Step 2, and Step 2 waits for the hit-rate data. The failure mode the two-step ordering avoids is paying for durability before knowing whether durability is needed: caches are free at the margin and evict themselves, artifacts cost signing, auditing, refresh ownership, and registry coordination on every bump.
