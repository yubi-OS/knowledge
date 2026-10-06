# 05. Common changes: registries, provenance, pinning

Scope: the 3 change types the skill anticipates for yubiOS.rego: adding an approved registry, turning on the provenance requirement, and the invariant that the policy never replaces digest pinning.

All rules in this doc are from the source doc (yubi-OS/yubiOS skills/docker-build-policy/SKILL.md) unless a dig source is cited.

## Change 1: add an approved registry

Add one line to the allowlist:

```rego
approved_registry(ref) if startswith(ref, "<prefix>/")
```

Rules for the prefix:

- Keep prefixes tight: org path, not bare host (source doc). A bare host prefix such as ghcr.io/ would allow every repository on that host; an org path such as ghcr.io/actions/ allows only the intended owner's images.
- Mirror the change into PINNED.md and AGENTS.md (source doc). The policy is the enforcement point; PINNED.md is the record of which digests are approved, and AGENTS.md carries the instruction for agents working in the repo.

The allowlist today covers 4 prefixes: quay.io/fedora/, dhi.io/, ghcr.io/actions/ and ghcr.io/hadolint/ (source doc; the pattern walk in doc 04).

## Change 2: require provenance

The policy ships with the hasProvenance rule commented out. To require provenance, uncomment it, but only once the base image actually ships provenance: quay.io/fedora/fedora-bootc did not, last checked, so enabling the rule before the base image supports it would deny every build (source doc).

What hasProvenance checks upstream: buildx can attach SLSA provenance attestations to images it builds, and the attestation records how the image was built and is inspectable with imagetools inspect (source: https://docs.docker.com/build/metadata/attestations/slsa-provenance/, weight 0.55). The gate change is a 1-line uncomment, but the prerequisite is a base image registry that actually publishes those attestations. Sequence the change: verify the base image ships provenance first, uncomment second, and run the synthetic tests from doc 07 to confirm the gate still admits the pinned base image.

## Change 3: remember the policy does not replace digest pinning

A new registry approval changes what the policy will pull, not what the Containerfile must contain. The Containerfile FROM must still be @sha256: pinned: the policy enforces isCanonical, PINNED.md records the digest (source doc). This division of labor is deliberate: the rego gate blocks a build that references a mutable tag, and PINNED.md is the human-auditable ledger of which digests the org has vetted.

Why the pinning discipline matters (weak backing, labeled): mutable tags are a recognized supply-chain attack surface. A documented incident is the Trivy supply-chain attack, where a mutable tag was exploited (source: https://www.vmfarms.com/blog/trivy-supply-chain/, weight 0.15, weak backing). Hardening guidance for container images recommends pinning digests rather than tags (source: https://docs.ozarksecuritylabs.com/supply-chain/tier-2-hardened/container-image-digests/, weight 0.4, weak backing; https://safeguard.sh/resources/blog/container-image-digests-vs-tags-why-pinning-matters, weight 0.19, weak backing; https://runbook.academy/courses/kubernetes/lessons/kubernetes-lxiv-01-image-tags-vs-digests/, weight 0.17, weak backing). These are secondary sources; the authoritative statement for yubiOS is the source doc rule itself.

## Change review checklist

Any change to yubiOS.rego should pass 4 checks before merge:

1. The allow condition still requires isCanonical for remote images; nothing weakened to default allow (source doc guardrail, doc 08).
2. Every newly approved prefix corresponds to a digest pinned in PINNED.md (source doc guardrail).
3. The synthetic test cases from doc 07 still pass: a pinned approved image allows, a mutable tag denies with the pinning reason, a non-approved registry denies with the registry reason.
4. PINNED.md and AGENTS.md reflect the change (source doc).
