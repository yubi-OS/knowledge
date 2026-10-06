# 03 - Cache strategies: gha, registry, s3, and mode=max

Scope: how cache-from and cache-to select and shape build cache in build-push-action, the three backend types the source doc records, and the mode=max semantic.

## The grammar (source doc)

The ground source (`yubi-OS/yubiOS skills/docker-build-push-action/SKILL.md`, Cache strategies and Key inputs sections) gives the cache inputs a backend-selector grammar. `cache-from` and `cache-to` take comma-separated key/value strings naming a backend type plus its options. The three backends recorded are:

1. `type=gha` - the GitHub Actions cache backend. The source doc marks it "recommended for public repos": `cache-from: type=gha`, `cache-to: type=gha,mode=max`.
2. `type=registry,ref=...` - the registry cache backend, storing cache manifests inside the target registry. The source doc marks it "recommended for private registries / persistent cache", exemplified as `ref=quay.io/yubi-os/yubios:buildcache`.
3. `type=s3,...` - the S3 backend, listed in the Key inputs table without a workflow example.

`cache-to` carries a `mode` option. The source doc states `mode=max` "caches all layers", meaning intermediate stages and unused layers are exported to the cache too, not just the final image layers. The default min-mode exports only the layers of the final result.

`cache-from` accepts multiple sources at once. The source doc shows the multi-source form:

```yaml
cache-from: |
  type=gha
  type=registry,ref=quay.io/yubi-os/yubios:buildcache
```

The comment in the source doc explains the intent: try the GitHub Actions cache first, then the registry cache. A cache miss on the first source falls through to the next, so a workflow can combine a fast ephemeral backend with a persistent one.

## Dig-backed confirmation of the backends

The official Docker documentation for the GitHub Actions cache backend is "Use the GitHub Actions cache to manage your build cache in CI" (weight 0.84, https://docs.docker.com/build/cache/backends/gha/; the same page scored 0.68 from the second query). Docker's cache-management page for GitHub Actions CI is "Cache management with GitHub Actions" (weight 0.73 and 0.79 across the two queries, https://docs.docker.com/build/ci/github-actions/cache/). These two pages are the authoritative companions to the source doc's grammar: the first documents the gha backend itself, the second its use inside build-push-action workflows.

The buildx CLI reference, the underlying engine the action drives, scored 0.64 for this topic's sibling query set (https://docs.docker.com/reference/cli/docker/buildx/build/, listed under doc 05) and confirms the same cache flags exist at the buildx level the action wraps.

## Weak-evidence notes

Community and vendor material on Docker layer caching scored below the threshold and is not used as backing: a RunsOn guide (0.12, https://runs-on.com/github-actions/docker-layer-caching/), a Dash0 FAQ (0.1, https://www.dash0.com/faq/cache-docker-images-github-actions), a Blacksmith caching guide (0.17, https://www.blacksmith.sh/blog/cache-is-king-a-guide-for-docker-layer-caching-in-github-actions), a Stack Overflow question about gha cache and registry references (0.1, https://stackoverflow.com/questions/76227392/), and two starsling.dev pages (0.1 and 0.1). Their presence in the dig shows the topic is widely discussed, but nothing from them is asserted here.

## Operational discipline from the source doc

The source doc's yubiOS pattern and full workflow example both wire `cache-from: type=gha` and `cache-to: type=gha,mode=max` together; a cache-to without a matching cache-from on later runs wastes the exported cache. The Notes section adds `no-cache: false` as the default, meaning cache is always consulted unless explicitly disabled, and the Key inputs table confirms `no-cache` disables all cache when true.

## Sources

- Source doc: `yubi-OS/yubiOS skills/docker-build-push-action/SKILL.md` (sections: Cache strategies, Key inputs, Full workflow example, Notes).
- https://docs.docker.com/build/cache/backends/gha/ (weight 0.84 and 0.68)
- https://docs.docker.com/build/ci/github-actions/cache/ (weight 0.73 and 0.79)
- https://docs.docker.com/reference/cli/docker/buildx/build/ (weight 0.64, cross-referenced)
