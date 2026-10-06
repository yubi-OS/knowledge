# 09 - Examples, boundaries, and guidelines

Scope: the worked setup, in-repo touchpoints, boundary routing, and usage guidelines the source doc encodes, plus its corpus-audit annotations.

Grounding spine: source doc `yubi-OS/yubiOS skills/docker-login-action/SKILL.md` (Examples, Guidelines, and the cycle 5 to 7 RSI sections).

This is an internal-record subtopic: it explicates the source doc's own organizational sections. No searXNG dig was run for it; every claim below cites the source doc.

## Worked setup

The source doc's Examples section names a worked setup: the flow this skill drives, using its own artifacts. The concrete flow is the one its pattern sections define, and the source doc points at the cycle 5 run record as its example artifact: "cycle 5 RSI: closed segmentation primitive gap (corpus-wide count 22 to 23 of 70). See refs/cycle5-results-2026-08-06.md for the corpus-fit delta measurement" (source doc, Changelog). In yubiOS the doc's worked flow is therefore: quay.io login step, then ghcr.io login step, then the push steps, with the registry artifacts recorded in the refs/ cycle log (source doc).

## In-repo touchpoints

The source doc declares the sections it owns or extends: When to use, Action reference, Supported registries, yubiOS pattern (quay.io + GHCR) (source doc, Examples section). Those four sections are the skill's canonical content; the corpus docs 01 through 05 map onto them one-to-one.

## Boundary case

The source doc gives an explicit routing rule: when the request only names a trigger without the artifact it acts on, route to the owning surface instead of improvising here (source doc, Examples, Boundary case). For this skill that means: "docker login" alone is not enough context to act on. The artifact must be named, for example a workflow that pushes to ghcr.io or a job that pushes to quay.io, and if the artifact belongs to another surface, the request belongs there.

## Guidelines

The source doc's guideline section is a single rule: every use stays inside the frontmatter description's scope, and anything beyond it is a different skill's job (source doc, Guidelines). The frontmatter scope is: authenticate to a container registry (Docker Hub, GHCR, quay.io, dhi.io, and so on) using docker/login-action in GitHub Actions, for a workflow that needs to push images to any registry before building or pushing (source doc, frontmatter). Concretely, out of scope for this skill: building images (docker/build-push-action), tagging and metadata (docker/metadata-action), multi-platform build setup (docker/setup-buildx-action), registry-side policy enforcement (docker-build-policy), and provenance or signing work (slsa-provenance, sigstore-rekor-v2). Those boundaries follow the source doc's own interaction notes and the sibling skills it names in its trust chain description (source doc).

## Trust chain position (per the source doc's own annotation)

The source doc carries an explicit trust-chain annotation: this skill is the trust-chain bootstrap for build pipelines, and the registry token is the first link in the supply-chain trust chain (source doc, cycle 5 section). It then locates itself in the yubiOS chain: YubiKey, then fTPM, then UKI PCR 11, then dm-verity root hash, then bootc image digest, then SLSA L3 attestation, with this skill as one contributor in that chain (source doc). The outline validation scored a dedicated trust-chain doc below threshold, so this section preserves the source doc's positioning without expanding it.

## Corpus-audit annotations

The source doc carries three curve-guided-rsi cycle annotations, which are internal records rather than technical claims:

1. Cycle 5 (2026-08-06): closed the segmentation primitive gap for this skill; the corpus-wide segmentation count moved 22 to 23 of 70; content-additive edit, no existing content removed (source doc, cycle 5 section and Changelog).
2. Cycle 6 (2026-08-06): closed the declarative policy primitive gap, referencing the skill's declarative policy (.rego / OPA / Build Policy) integration (source doc, cycle 6 section).
3. Cycle 7 (2026-08-06): closed the least privilege primitive gap, third-priority movable per skill post-cycle-6 baseline, referencing least privilege enforcement (sandbox / capability / ProtectSystem / NoNewPrivileges) (source doc, cycle 7 section).

The source doc also declares its position on the continuous/adaptive primitive: the skill's outputs feed the continuous/adaptive layer of the yubiOS pipeline, consumers that reason about continuous/adaptive coverage can credit this skill's contribution, and any change to the skill should be reviewed for impact on continuous/adaptive coverage, with gaps tracked in the corpus audit cycle log at refs/ on yubi-OS/yubiOS (source doc, continuous/adaptive section). Its attestation note says the skill relates to measured-boot evidence and the yubiOS trust chain, with internal-big-picture as the full primitive reference (source doc, attestation section).

These annotations matter to a reader of the corpus because they are the skill's declared interfaces to the audit machinery: they tell the curve-guided corpus audit where to credit this skill, and they tell a maintainer which primitives a change to this skill can perturb.

## Reading order

For a newcomer: doc 01 (when and where to log in), then doc 03 (registry table), then doc 04 (GHCR, the cheapest path), then doc 05 (quay and dhi), then doc 02 (full input surface), then doc 06 (secret handling), then this doc for boundaries. The source doc itself remains the primary source of record; this corpus explicates it and does not replace it.
