# 06 - Digest extraction and supply-chain pinning

Scope: the digest output as the supply-chain artifact, pinning FROM lines by digest, the yubiOS.rego enforcement hook, and build secrets hygiene.

## The digest output is the pinning artifact

The ground source (`yubi-OS/yubiOS skills/docker-build-push-action/SKILL.md`, Extracting digest section) shows the wiring: the build step gets an `id: build`, and later steps consume `steps.build.outputs.digest`, a content-addressable `sha256:...` digest. The doc's example continues into the consumption pattern: "Pin FROM quay.io/yubi-os/yubios@${{ steps.build.outputs.digest }}". The Notes section makes the enforcement claim: "the digest output is what to pin in FROM lines (yubiOS.rego policy requires this)". That links this action directly to the yubiOS Docker Build Policy gate, where the Rego policy vets build inputs and digest pinning is the required form for image references.

Why pin by digest: a tag is mutable, a digest is not. The action's README documents the digest output as one of the action's three outputs (weight 0.97, https://github.com/docker/build-push-action). Docker's digest documentation page for hardened images scored 0.46, below the 0.5 threshold, so its specific guidance is labeled weak backing here (https://docs.docker.com/dhi/explore/security-concepts/digests/): the mutability argument stands on the source doc plus the official README, not on that page.

## Provenance of the digest output

The digest output exists because the action repository added it deliberately: issue 46, "Return image digest as action output", is the feature request that produced the `digest` output (weight 0.74, https://github.com/docker/build-push-action/issues/46). That makes the output a designed contract, not an accident, and explains why it is safe to wire into automated downstream pinning.

An open issue titled "outputs.digest and outputs.imageid not showing anything" (weight 0.67, https://github.com/docker/build-push-action/issues/596) reports the outputs appearing empty in some configurations; doc 02 covers the caveat. The operational takeaway for pinning: verify the digest is populated in your configuration before trusting the pin step, since an empty digest silently produces a broken FROM reference.

## Build secrets and build args

The Key inputs table records the two sensitive-input channels:

- `secrets`: `id=mysecret,src=/path/to/secret`, consumed inside the build via secret mounts, never persisted in layers.
- `build-args`: `KEY=VALUE` build arguments.

The supply-chain discipline the source doc teaches is to keep secrets in the secrets channel and treat build-args as non-sensitive configuration, since build args are visible in image history and are frequently logged by builders.

## Weak-evidence notes

Third-party pinning tooling and guidance from the dig scored below threshold: a CLI digest-pinning tool (0.07, https://github.com/azu/dockerfile-pin), a hardened-guidance page on pinning container image digests (0.21, https://docs.ozarksecuritylabs.com/supply-chain/tier-2-hardened/container-image-digests/), a homelab write-up on digest pinning (0.15, https://dreamlab.ing/posts/25-image-digest-pinning-homelab/), and a vendor page on unpinned tag risk (0.13, https://www.sourcery.ai/vulnerabilities/docker-unpinned-image-tags). None is used as backing for a claim in this corpus; the source doc plus the official README carry the argument.

## Sources

- Source doc: `yubi-OS/yubiOS skills/docker-build-push-action/SKILL.md` (sections: Extracting digest for supply chain pinning, Key inputs, Notes).
- https://github.com/docker/build-push-action (weight 0.97)
- https://github.com/docker/build-push-action/issues/46 (weight 0.74)
- https://github.com/docker/build-push-action/issues/596 (weight 0.67)
