# Open-source status of the RK3588 boot chain

Scope: which boot-chain stages are open source on RK3588 as of the dig, which remain closed, and where the evidence comes from.

## The picture in one paragraph

Collabora's 2024 blog "Almost a fully open-source boot chain for Rockchip's RK3588" is the anchor source. It records that "previously, to build U-Boot, the stage 2 SPL (Secondary Program Loader) and stage 3 U-Boot proper, it was mandatory to include a closed-source DDR training binary blob and also a pre-built BL31 blob from the vendor" (https://www.collabora.com/news-and-blog/blog/2024/02/21/almost-a-fully-open-source-boot-chain-for-rockchips-rk3588/, jev weight 0.7909). Two closures existed then: the DDR blob and the vendor BL31. One of them has since been solved.

## BL31: open

The same blog states: "recently the boot-chain has improved in the sense that the open-source BL31 (Boot Loader stage 3.1) from TF-A is now included in our Debian images, which are published on our GitLab" (https://www.collabora.com/news-and-blog/blog/2024/02/21/almost-a-fully-open-source-boot-chain-for-rockchips-rk3588/, jev weight 0.7713). Collabora's later upstream-status post adds vendor-side confirmation: "Rockchip provided an open source version for the Trusted Firmware-A (TF-A), which got merged and should become part of the v2.12 release" (https://www.collabora.com/news-and-blog/news-and-events/rockchip-rk3588-upstream-support-progress-future-plans.html, jev weight 0.7910).

The mainline TF-A platform code exists and can be read directly: the arm-trusted-firmware repository carries RK3588 platform code under `plat/rockchip/rk3588`, including the secure-world driver source at `plat/rockchip/rk3588/drivers/secure/secure.c` (https://github.com/ARM-software/arm-trusted-firmware/blob/master/plat/rockchip/rk3588/drivers/secure/secure.c, jev weight 0.8782). BL31 is therefore both source-available and vendor-blessed: the open replacement is upstream, merged, and maintained.

## BL32 and BL33: open

The BL32 stage (OP-TEE, the secure-world OS) and the BL33 stage (U-Boot) are both open source in the RK3588 chain. The mainline U-Boot side is actively maintained: Firefly's mainline U-Boot guide records that "Mainline U-Boot 2024.05 enabled the OF_UPSTREAM feature, and many device trees were migrated to dts/upstream/src/arm64/" (https://community.t-firefly.com/en/docs/mainline/bsp/Uboot, jev weight 0.5951). Collabora's upstream post summarizes the year's RK3588 work as "a great year for improving the RK3588 upstream support" with the boot side reduced to a single remaining closure (https://www.collabora.com/news-and-blog/news-and-events/rockchip-rk3588-upstream-support-progress-future-plans.html, weight 0.7910).

Community infrastructure corroborates the open-space momentum. The `open-rk3588` GitHub organization self-describes as "An opensource space (unofficial) for Rockchip RK3588 platform" (https://github.com/open-rk3588/, jev weight 0.8045), and publishes a repository of "Prebuilt blobs (built from open source projects) for RK3588 SoC on Android" (https://github.com/open-rk3588/, jev weight 0.5826). That phrase is notable: the community re-builds what it can from source and is explicit when a prebuilt is not source-built.

## TPL/DDR: still closed

The same Collabora progress post draws the line precisely: "On the boot side that just leaves the DDR memory training a closed source binary" (https://www.collabora.com/news-and-blog/news-and-events/rockchip-rk3588-upstream-support-progress-future-plans.html, jev weight 0.7910). This is the single remaining closed component in the RK3588 boot chain as of the dig.

A concrete demonstration of how far blob-freeness gets on Rockchip in general comes from a maintained U-Boot binary distribution project: its README documents that "tfa (build Arm Trusted Firmware) or rkbin (prebuilt BL31)" are the two per-board options, and that "47 boards build fully blob-free, DRAM init from U-Boot's own TPL and BL31 from mainline TF-A: the rk3399, rk3328, rk3326 and px30 boards, minus the two generic-* defconfigs that force an external TPL" (https://github.com/schneid-l/u-boot-rockchip, jev weight 0.7010). The list of blob-free SoC families is telling: RK3588 is absent from it. On RK3588, U-Boot's own TPL cannot initialize the DDR controller, so the Rockchip binary is mandatory and the blob-free option does not exist for this platform.

## Consequence for yubiOS

Every stage of the RK3588 boot chain except the TPL/DDR blob can be built from open source and pinned by source digest. That means the RK3588 redistribution question in this corpus is narrowly scoped: it is a question about one binary, the DDR training blob from rkbin (doc 02), and about the acquisition model for that one artifact (doc 05). It is not a question about the boot chain as a whole.
