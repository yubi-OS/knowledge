# Distribution options for the RK3588 DDR/TPL binary in a redistributable OS

Scope: the candidate acquisition and distribution models for the RK3588 DDR/TPL blob, what each requires, and what the dig evidence says about each.

## The constraint

The blob is mandatory and closed. Collabora records that building U-Boot for RK3588 "was mandatory to include a closed-source DDR training binary blob" (https://www.collabora.com/news-and-blog/blog/2024/02/21/almost-a-fully-open-source-boot-chain-for-rockchips-rk3588/, jev weight 0.7909), and its later status post confirms DDR memory training is the only closed binary left on the boot side (https://www.collabora.com/news-and-blog/news-and-events/rockchip-rk3588-upstream-support-progress-future-plans.html, jev weight 0.7910). Armbian's rkbin fork README characterizes the whole payload family: "a collection of proprietary firmware components essential for proper hardware initialization, booting, and system operation on Rockchip SBCs" (https://github.com/armbian/rkbin, jev weight 0.8021). Any distribution option therefore deals with a proprietary artifact that no open build can replace today.

## Option 1: pull rkbin at build time

The build system clones or downloads the pinned blob from https://github.com/rockchip-linux/rkbin (the repository README describes exactly this role: storing "files that may be used in the early boot stages" including "executable binaries", jev weight 0.9443) at CI time, verifies it against a recorded sha256, and embeds it in the image. The OS distributor never re-hosts the blob; users who receive the image receive Rockchip's artifact as processed by the build. This is the pattern the whole ecosystem already runs on (doc 04): Radxa SDKs vendor a rkbin copy (weight 0.8356), edk2-rk3588 assembles the blobs into firmware (weight 0.9015), and the reproducible U-Boot binary project fetches rkbin where a board forces it (weight 0.7010). The legal posture is the gray one: the blob travels inside the OS image, so the question "is that redistribution?" is unanswered by any collected source.

## Option 2: carry the blob in-repo

Committing the blob to the OS repository makes the build hermetic and the blob's identity auditable by git history, but it is the most aggressive redistribution posture: the blob is literally re-published by the OS project. The dig found no evidence that any distro holds a Rockchip redistribution license for rkbin payloads; Armbian's fork (weight 0.8021) redistributes copies, but its README claims no license grant, and no collected source describes any negotiated permission. This option has the clearest legal exposure and no documented ecosystem precedent of a license that would bless it.

## Option 3: out-of-band user fetch

The image build excludes the blob; each user downloads it from rkbin, places it at a known path, and the build verifies sha256 before use. This is the only option with zero redistribution by the OS project. The trade is friction: every user performs a manual step. The dig found an analogous pattern in vendor firmware distribution: fwupd "provides... the ability to update device firmware" by fetching vendor-provided artifacts client-side (https://fwupd.org/, jev weight 0.4176, weak backing; the snippet confirms the service's nature only). The pattern is common in firmware delivery, but applying it to a core boot stage pushes a build-blocking step onto every user.

## Option 4: negotiate a redistribution license

Contacting Rockchip for explicit redistribution rights would make option 2 clean. The dig found no public record of any such license being granted to an OS project, and no collected source describes a Rockchip licensing channel for rkbin payloads. This option is viable in principle, unverifiable in practice from open sources, and slow by nature.

## Option 5: wait for an open replacement

The DDR training problem has an open-source endgame (doc 07), but no collected source offers a timeline. Collabora's progress post ends its boot-chain accounting with "that just leaves the DDR memory training a closed source binary" (weight 0.7910), with no announced replacement date. Waiting is a real option only if the OS can tolerate the closed blob for an unbounded period, which for a shipping image it cannot.

## The instructive counterexample: what licensed redistribution looks like

Not all vendor firmware blobs are unlicensed. A vendored-blob repository for NXP firmware documents a different situation: "The license (COPYING) is BSD-3-Clause-Clear: redistribution of the firmware blobs in binary form is permitted as long as the license travels with the binary. That's exactly what this repo does: blob + license sit next to each other in the same git tree" (https://github.com/firmwai/firmware-blobs, jev weight 0.5736). This is the concrete shape option 4 would produce for Rockchip: a written grant that permits binary redistribution with the license attached. The contrast also clarifies why rkbin carriers proceed without it: NXP blobs carry an explicit grant; rkbin payloads, per the collected evidence, carry none that any source in this dig could quote.

## Where embedded distros put these decisions

The Yocto Project frames itself as the standard environment for building custom embedded distributions ("It's not an embedded Linux distribution, it creates a custom one for you", https://www.yoctoproject.org/, jev weight 0.7085). Yocto-based and similar build systems typically isolate vendor artifacts in dedicated layers or fetch steps rather than the core repo, which matches option 1's shape. No collected source documents a canonical policy statement for closed boot blobs in embedded distros; the ecosystem evidence (doc 04) is the available guidance.

## Assessment

The evidence pattern supports option 1 (build-time pull with sha256 pinning) as the ecosystem-conforming path: every examined RK3588 firmware project consumes rkbin this way, no examined project claims a redistribution license, and the supply-chain properties (pinned digest, verified at build) are satisfiable without re-hosting. Option 3 remains the cleanest legally and the worst ergonomically; options 2 and 4 depend on a license nobody in the collected record possesses. The decision itself belongs to the OMN-56 process (doc 08).
