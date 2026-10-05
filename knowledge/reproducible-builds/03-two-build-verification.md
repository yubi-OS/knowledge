# 03 - Two-build byte comparison verification

Scope: how to turn reproducibility from an aspiration into an executable test by building the same subject twice under controlled conditions and comparing bytes, including what to compare, what to exclude, and why transport wrappers are not equality oracles.

## Why a second build is the only honest test

A reproducible build produces a bit-for-bit identical artifact every time it is run from the same source, toolchain, and instructions. This is what turns the promise from "trust our build server" into "verify our build server", because any independent party can rebuild and compare hashes (weight 0.65, https://safeguard.sh/resources/blog/reproducible-builds-why-bit-for-bit-identical-matters). Reproducible Builds allow reviewers to audit the source code and use bit-by-bit reproducibility to establish the causal link to the binary that is executed (weight 0.65, https://fmd-foss.org/security/reproducibility/). The executable form of both statements is the same: run the build twice, compare the outputs.

The practice is rare without a gate. A measurement pipeline applied to a stratified sample of 2,000 GitHub repositories that contained a Dockerfile found that only 56% produce any buildable image, and just 2.7% of those are bitwise reproducible (weight 0.75, https://arxiv.org/html/2602.17678). That gap is why a two-build check belongs in CI as a blocking step rather than as documentation.

## Conditions that make the comparison meaningful

A two-build comparison is only evidence if the two builds are run as independently as possible. The yubiOS refs doc describes the shape: build the real target twice with separate pinned builders, no cache, and no default attestations, then compare the complete OCI layout (per the yubiOS refs doc, 2026-07-22). The no-attestations condition has an externally grounded reason: provenance metadata changes the index digest between runs even when the image manifest is stable, so when testing reproducibility you should build with provenance disabled and compare the image manifest digest, then add provenance back for the release build and make the reproducibility claim about the manifest rather than the index (weight 0.60, https://runbook.academy/courses/docker/lessons/docker-reproducibility/).

## What to compare, and what not to compare

Compare the unpacked OCI layout: the layer tars, the config, and the manifests, as a Merkle-style content comparison. Do not compare transport wrappers. The yubiOS refs doc explicitly rejects docker image save archives and GitHub artifact ZIPs as equality oracles because those wrappers are not stable (per the yubiOS refs doc, 2026-07-22). The same principle appears in deployed practice elsewhere: image digests are the identity used to verify that what you pull is what you built, which is why the comparison should operate at the content-addressed layer rather than on packaging around it (weight 0.78, https://docs.docker.com/dhi/explore/security-concepts/digests/).

## Tooling for the comparison and the diagnosis

diffoscope is the standard tool to compare build artifacts and detect nondeterminism, listed by the Reproducible Builds project under tools to compare build artifacts (weight 0.86, https://reproducible-builds.org/tools/). The yubiOS verification flow uses the same pattern: on a mismatch, the script prints config and layer-member diagnostics before failing, preserves the two OCI layouts when KEEP_REPRO_OUTPUT=1 is set, and points the operator at diffoscope for diagnosis (per the yubiOS refs doc, 2026-07-22).

Automation exists at the entry level too: ReproDocker Doctor builds an image twice, compares the results, classifies every difference, and reports fix recommendations in one command (weight 0.50, https://github.com/ry0y4n/ReproDocker-Doctor). At the 0.5 boundary, cite as corroborating tooling, not as evidence for a claim.

## What the gate proves and what it does not

A passing two-build gate proves that the build process, under the conditions of that run, is deterministic. It does not by itself prove rebuildability months later: if package inputs resolve from live repositories, the gate proves equality against the package state observed during that run, a boundary the yubiOS refs doc states for its own installer and image gates (per the yubiOS refs doc, 2026-07-22). The corollary for the verification script is to record what the equality claim covers, and to keep the JSON evidence of the comparison as the auditable artifact of the run.
