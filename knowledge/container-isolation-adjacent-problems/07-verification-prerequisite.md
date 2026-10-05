# The verification chain: digest admission as the prerequisite of container trust

Scope: the adjacent problem that gates every boundary in this corpus: a container is only as trustworthy as the digest the build policy admitted, and how digest pinning, signing, and provenance attestations close that chain.

## Why this is a prerequisite, not a boundary

Isolation confines a process; verification decides whether the artifact deserves confinement. The relation is prerequisite: on a bootc host every isolation boundary (nspawn RootImage=, ephemeral VM, unit sandboxing) ultimately boots or executes content that arrived as an OCI image reference. If the reference is mutable, the boundary protects a process running something other than what was reviewed. The adjacent-problem framing is exactly that: the container is only as trustworthy as the digest the build policy admitted.

## Digest pinning

Digests give the reference immutability. Once an image is built and its digest is generated, the content tied to that digest cannot change; digests help prevent supply chain attacks [https://docs.docker.com/dhi/explore/security-concepts/digests/, weight: high]. The mechanics are strict identity: the image's manifest hash is the identity, and any tampering, at the registry, on the CDN, or in flight, produces a different digest and the pull fails; this is the SHA-pinning model applied to containers [https://docs.ozarksecuritylabs.com/supply-chain/tier-2-hardened/container-image-digests/, weight: low]. In scanning and audit workflows, digest pinning secures results by anchoring them to immutable SHA-256 identifiers instead of mutable tags [https://safeguard.sh/resources/blog/how-image-digest-pinning-strengthens-container-supply-chain-integrity-in-snyk-workflows, weight: low]. The cost side is an update duty: digest pinning creates reproducibility, but it also creates an update obligation, since a pinned digest never picks up fixes on its own [https://gsconsultingllc.com/insights/devsecops-container-security, weight: low].

Digest pinning sits within a broader ecosystem of supply chain controls that define how artifact identity, build provenance, and deployment integrity are verified [https://inferensys.com/glossary/preemptive-algorithmic-cybersecurity/ml-pipeline-security-hardening/digest-pinning, weight: low].

## Signing and provenance attestations

Pinning proves the bits did not change; signing and provenance prove who built them and how. SLSA build provenance and SBOM attestations are signed metadata attached to a container image as a co-located OCI artifact, attached and verified using cosign, in-toto, and Kyverno [https://www.systemshardening.com/articles/cicd/container-image-attestations/, weight: high]. In CI the two halves that make signing meaningful are producing a keyless Cosign signature and SLSA provenance attestation, and enforcing verification at the Kubernetes admission layer so that an unsigned or unattested image is rejected outright [https://www.syslabs.in/technical-articles/signing-and-verifying-container-images-in-ci-cd-a-cosign-and-slsa-provenance-walkthrough, weight: high].

The threat this closes is concrete: if an attacker compromises CI/CD credentials or registry access, they can replace a legitimate container tag with a backdoored image and nothing downstream notices; Sigstore Cosign closes that hole by cryptographically signing OCI images in CI, keylessly, with no long-lived credentials [https://imzye.com/Container/Cosign-Image-Signing-SLSA-Provenance/, weight: low]. Admission-time verification with Kyverno using KMS, Cosign, and workload identity is the enforcement point where policy turns into a block [https://blog.sigstore.dev/how-to-verify-container-images-with-kyverno-using-kms-cosign-and-workload-identity-1e07d2b85061/, weight: high].

## The build-policy gate on an immutable host

On yubiOS the admission point is the build policy itself: every build input (the FROM images) is vetted before any layer executes, with approved registries and digest-pinned references. The order of operations matters: the policy runs at build time, so a digest that fails admission never becomes an image, never gets signed, and never reaches a boundary that would boot it. Verification before isolation means the four boundaries in this corpus only ever contain admitted content.

## How the chain hooks into each boundary

Build (rootless podman): the user-namespace boundary confines the build process, but the policy confines its inputs; both are needed because a rootless build of a malicious base image produces a perfectly isolated compromised image. Dev (nspawn RootImage=): the signed image is itself the verified artifact, so the dev environment inherits verification from the image, not from the container mechanism. Whole-OS test (ephemeral VM): the VM boots a disk image produced from the verified bootc image, so the test is trustworthy only as far as the upstream digests. Service confinement (unit sandboxing): the units run out of the host's own verified /usr, so the verification chain terminates in the image integrity layer rather than in per-service policy.

## Failure mode to watch

The chain fails silently when a tag replaces a digest. Every mutable reference is a hole exactly the size of the registry compromise threat described above. The discipline is mechanical: digests in build policies, digests in deployment manifests, signatures checked at admission, and the update duty scheduled rather than improvised.
