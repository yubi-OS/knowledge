# Digest-pinned base images under an OPA build policy

Scope: digest-pinned container base images and the docker buildx Build Policy (OPA/Rego) gate that refuses unpinned FROM inputs; the build-time mirror of the boot chain.

## Tags are mutable, digests are not

Container image tags are mutable pointers; digests are content-addressed and immutable (weight 0.53, https://safeguard.sh/resources/blog/container-image-digests-vs-tags-why-pinning-matters). A kubernetes course lesson puts the consequence in supply-chain terms: tags are mutable, the same tag can refer to different digests over time; digests are immutable, the same digest always refers to the same image; pinning by digest is the foundation of supply chain integrity, and without it every other control, including vulnerability scanning and signature verification, operates on a moving target (weight 0.31, https://runbook.academy/courses/kubernetes/lessons/kubernetes-lxiv-01-image-tags-vs-digests/).

Digest pinning is also what anchors scanning workflows: pinning secures scanning by anchoring results to immutable SHA-256 identifiers instead of mutable tags (weight 0.36, https://safeguard.sh/resources/blog/how-image-digest-pinning-strengthens-container-supply-chain-integrity-in-snyk-workflows). Base-image cookbooks frame it as the precondition for reproducible builds, covering tag mutability and rebuild cadence (weight 0.71, https://containers.codeguides.io/image-policy-vulnerabilities/base-image-pinning-by-digest/).

Pinning is necessary but not sufficient: digest-pinning a base image does not catch every container supply-chain risk, and the same mutable-versus-immutable question applies to GitHub Actions uses: lines and install-time scripts (weight 0.41, https://duncan-haywood.github.io/monorepo-projects/docker-base-image-pin-check/).

## The build policy gate

Docker's build policies are the enforcement mechanism. When you run docker buildx build, Buildx resolves all build inputs, images, Git repos, HTTP downloads; looks for a policy file matching your Dockerfile name, for example Dockerfile.rego; evaluates each input against the policy before the build starts; and allows the build to proceed only if the policy allows it (weight 0.91, https://docs.docker.com/build/policies/).

The usage page adds that policies are written in Rego, the Open Policy Agent language, and that you can test policies with docker buildx policy eval to check whether the policy allows a specific source without running a full build (weight 0.93, https://docs.docker.com/build/policies/usage/).

An independent writeup describes the same flow: Docker build policies are declarative rules written in Rego that validate your build inputs before the build runs, and Buildx resolves all inputs including base images from FROM, files from ADD or COPY, and Git repositories before evaluating them (weight 0.18, https://xor22h.dev/validating-docker-builds-with-rego-policies-because-it-works-on-my-machine-isnt-a-security-strategy/). OPA's own repository shows the pattern being adopted upstream, with a proposal that the tool automatically run Dockerfile.rego against the Dockerfile input if present (weight 0.26, https://github.com/open-policy-agent/opa/issues/8401).

## Why a policy and not a convention

A rule that says always pin by digest is only as strong as its enforcement. The buildx policy evaluation happens before the build starts, inside the builder, so an unpinned FROM is refused rather than merely flagged. Docker markets the same idea at the platform level: trusted sandboxes, governance, and a secure supply chain (weight 0.62, https://www.docker.com/).

## The mirror relationship to the boot chain

The yubiOS source doc names this the build-time mirror of the boot chain: the build policy refuses a mutable tag the way the kernel refuses an unsigned root hash. Both are refusal points that turn a convention into a gate. The chain runs from YubiKey-signed UKI through firmware and kernel down into the image, and the build policy pushes the same discipline one stage earlier, into the inputs of the image itself, so that the object being verified at boot was built from inputs that were themselves verified at build time.
