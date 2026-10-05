# The OMN-56 recommendation: build-time pull with fail-closed pinning

Scope: the proposed resolution for OMN-56 and the B-RK3588-TPL blocker, the alternative it competes with, and how the dig evidence weighs on the choice.

## The proposal

The research note behind this corpus proposes, pending review: pull rkbin at build time, fail closed if the pinned sha256 is absent, and document the redistribution scope in the project's pinned-inputs record. The reasoning in brief:

1. The blob is mandatory and closed (doc 01, doc 03): Collabora records that building RK3588 U-Boot "was mandatory to include a closed-source DDR training binary blob" (https://www.collabora.com/news-and-blog/blog/2024/02/21/almost-a-fully-open-source-boot-chain-for-rockchips-rk3588/, jev weight 0.7909), and its status post confirms DDR training is the one remaining closed binary (https://www.collabora.com/news-and-blog/news-and-events/rockchip-rk3588-upstream-support-progress-future-plans.html, jev weight 0.7910).
2. Every ecosystem build environment already consumes rkbin at build time (doc 04): Radxa's SDK documents its rkbin directory as "Pre-built Rockchip binaries" (https://wiki.radxa.com/Rock5/guide/build-u-boot-on-5b, jev weight 0.7618), and the reproducible signed-binary project switches per-board between "tfa (build Arm Trusted Firmware) or rkbin (prebuilt BL31)" (https://github.com/schneid-l/u-boot-rockchip, jev weight 0.7010).
3. No collected source shows any RK3588 firmware project holding a redistribution license for the payloads (doc 05); the fetch-at-build pattern is what the ecosystem actually does, with the legal gray zone acknowledged rather than resolved.

## Why fail-closed pinning is the control

The supply-chain argument (doc 06) carries the proposal's security half. SLSA's provenance requirement is that provenance record "the verifiable information about software artifacts describing where, when and how something was produced" (https://slsa.dev/spec/v0.1/provenance, jev weight 0.8863), and SLSA's levels spec is explicit that an artifact's rating says nothing about its dependencies, "it is possible for a SLSA 4 artifact to be built from SLSA 0 dependencies" (https://slsa.dev/spec/v0.1/levels, jev weight 0.9514). A closed blob is a dependency with no build-process protections, so the honest posture is to pin it by digest and record it as a fetched input rather than to pretend it is source-built. Docker's build-input validation documentation gives the fail-closed rationale: validating inputs "protects your build supply chain from compromised registries, unexpected updates, and unauthorized base images" (https://docs.docker.com/build/policies/validate-images, jev weight 0.5679).

Concretely, the pin record names the exact variant (for example `rk3588_ddr_lp4_2112MHz_lp5_2400MHz_v1.18.bin` from the bare-metal bringup guide, https://danielc.dev/rk/rk3588/boot/, jev weight 0.7255), its upstream URL, and its sha256; CI fetches and verifies, and a mismatch or missing fetch fails the build.

## The alternative: user fetch plus sha256 verify

The fallback proposal pushes the fetch to each user: the image build excludes the blob, the user downloads it from rkbin, and the build verifies the digest before use. This is the only zero-redistribution posture available. Its cost is ergonomic: a core boot input becomes a manual prerequisite for every user, and the ecosystem evidence shows no RK3588 firmware project asks this of its users (doc 04): even the most reproducibility-focused project in the record ships signed binaries with the rkbin inputs already handled (https://github.com/schneid-l/u-boot-rockchip, jev weight 0.7010).

## What the dig says about the decision inputs

The proposal rests on four factual legs, each now dig-grounded:

1. Single upstream source: rkbin, with its blob family "SPL/DDR/UsbPlug/BL31/BL32/OPTEE" described by the repository itself (https://github.com/rockchip-linux/rkbin, jev weight 0.7837), mirrored in Rockchip's SDK GitLab (https://gitlab.com/rockchip_linux_sdk_6.1/rk/rkbin/-/blob/main/doc/release/RK3588_EN.md, jev weight 0.8232).
2. Ecosystem precedent: every examined project fetches rather than relicences (doc 04, weights 0.8356, 0.9015, 0.7010).
3. No open replacement on any horizon: the community open-source space rebuilds only what has open sources (https://github.com/open-rk3588/, jev weight 0.5826) and the blob-free board list excludes RK3588 (https://github.com/schneid-l/u-boot-rockchip, jev weight 0.7010).
4. A licensing counterexample exists that defines what "permitted redistribution" looks like when it is real: the NXP blob repo whose license "is BSD-3-Clause-Clear: redistribution of the firmware blobs in binary form is permitted as long as the license travels with the binary" (https://github.com/firmwai/firmware-blobs, jev weight 0.5736). Rockchip has no equivalent grant in the record, which is exactly the gap the proposal's documentation step addresses.

## Open item: the license text

One input remains unverified and should be closed before the decision is finalized: the exact license text in the rkbin repository. The dig could not quote it (doc 02). If a future read of the repository's LICENSE and blob-side declarations finds an explicit redistribution grant, option 2 (carry in-repo) upgrades from legally murky to clean and the documentation step becomes a citation instead of a caveat. Until then, the proposal's build-time-pull posture with documented scope is the option best supported by the collected evidence.

## Relationship to the blocker

The B-RK3588-TPL blocker exists because the hardware-evidence chain cannot proceed without deciding how the blob enters the image. The dig evidence says the blocker is narrow: it is not a boot-chain problem (all other stages are open, doc 03), not a sourcing problem (one canonical upstream, doc 02), and not a supply-chain-tooling problem (pinning and provenance patterns are established, doc 06). It is a licensing-posture decision about one artifact, and the evidence assembled here gives the deciding review everything it needs to pick between the two live options.
