# 07 - Buildx cache management

Scope: the cache backends buildx supports (inline, registry, GitHub Actions gha), what mode=max changes, and the yubiOS CI cache pattern.

## Why cache export is a driver question first

Only builders with the full BuildKit feature set can export cache. The docker driver cannot export cache at all; the docker-container driver can (source doc, doc 04). So every cache strategy below presumes a docker-container builder.

## The three backends the source doc uses

Inline cache. Embedded in the image itself: --cache-to type=inline --cache-from type=registry,ref=<image>. The source doc's own note: only useful for small images, since the cache rides along in the pushed image (source doc).

Registry cache. The most common in CI per the source doc: --cache-to type=registry,ref=dhi.io/yubi-OS/yubiOS-cache:latest,mode=max --cache-from type=registry,ref=dhi.io/yubi-OS/yubiOS-cache:latest. The registry backend embeds the build cache into a separate image pushed to a dedicated location apart from the main output (https://docs.docker.com/build/cache/backends/, weight 0.89). Keeping the cache in a separate ref keeps the output image clean (source doc ref choice, docs.docker.com backend description).

GitHub Actions cache. --cache-to type=gha,mode=max --cache-from type=gha. The gha backend page documents that when url, url_v2, or token parameters are left unspecified, the backend falls back to environment variables provided by the Actions runner (https://docs.docker.com/build/cache/backends/gha/, weight 0.80), which is why the source doc's command needs no explicit parameters inside a workflow.

## mode=min versus mode=max

The official backends page and CI-focused writeups agree on the semantics: mode=min (the default) caches only the layers that end up in the final image, while mode=max caches all layers including intermediate stages of a multi-stage build (https://docs.docker.com/build/cache/backends/, weight 0.89; https://runs-on.com/github-actions/docker-layer-caching/, weight 0.10, weak backing, used only to corroborate the same semantics). yubiOS commands use mode=max throughout (source doc), which is the right choice for multi-stage Containerfiles where intermediate stages are expensive to rebuild.

## External cache for CI speed

The backends page frames the purpose directly: external cache is useful to create a shared cache that speeds up inner-loop and CI builds (https://docs.docker.com/build/cache/backends/, weight 0.89). For yubiOS that shared cache lives next to the image at dhi.io/yubi-OS/yubiOS-cache:latest (source doc).

## yubiOS quick pattern

    docker buildx build \
      --cache-to type=registry,ref=dhi.io/yubi-OS/yubiOS-cache:latest,mode=max \
      --cache-from type=registry,ref=dhi.io/yubi-OS/yubiOS-cache:latest \
      .

(source doc.) Note the cache ref is distinct from the image ref dhi.io/yubi-OS/yubiOS:latest; the Build Policies gate applies to the image build, and the cache push is a separate artifact (source doc).

References: source doc at https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/docker-buildx-rootless/SKILL.md; https://docs.docker.com/build/cache/backends/ (weight 0.89); https://docs.docker.com/build/cache/backends/gha/ (weight 0.80); weak-backed corroboration at 0.10 as labeled above.
