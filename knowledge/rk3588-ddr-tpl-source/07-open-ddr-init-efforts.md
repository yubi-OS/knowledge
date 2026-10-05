# Open-source DDR init efforts for Rockchip SoCs

Scope: what the dig found on community efforts to replace the closed DDR training blob, how hard the problem is, and what a timeline would need.

## The current state

The closed DDR training binary remains the last closed component of the RK3588 boot chain. Collabora's upstream-status post is the most recent authoritative statement collected: "Rockchip provided an open source version for the Trusted Firmware-A (TF-A), which got merged and should become part of the v2.12 release. On the boot side that just leaves the DDR memory training a closed source binary" (https://www.collabora.com/news-and-blog/news-and-events/rockchip-rk3588-upstream-support-progress-future-plans.html, jev weight 0.7910). The 2024 blog made the same point when the BL31 closure was still open: the DDR blob was the mandatory closed input even then (https://www.collabora.com/news-and-blog/blog/2024/02/21/almost-a-fully-open-source-boot-chain-for-rockchips-rk3588/, jev weight 0.8469).

The dig found no collected source announcing an in-progress open-source DDR init for RK3588, and none offering a timeline for one. This absence is itself the finding: the ecosystem's state is "closed, replacement unknown", not "replacement underway".

## Why the problem is hard

DDR training is controller-specific firmware that must calibrate physical memory timings against a specific SoC's memory controller. Two collected sources describe the depth of the stage:

1. The rkbin deep-dive documentation states: "Memory initialization is a complex but critical part of the Rockchip boot process. The dedicated DDR initialization binaries handle the intricate tasks of" controller bring-up, and records the RK3588 memory configuration as "LPDDR4/4X: up to 2112MHz (production), 2736MHz (experimental)" (https://deepwiki.com/rockchip-linux/rkbin/2.2-memory-initialization, jev weight 0.4756, weak backing at 0.4756).
2. The bare-metal bringup guide treats the official blob as simply required: "You will need the official rockchip-developed ddr image" (https://danielc.dev/rk/rk3588/boot/, jev weight 0.7255), with no open alternative even considered for the memory step while everything around it (secure register file setup, and so on) is written from scratch in about 100 lines.

The contrast is instructive: a bare-metaller reproduces the boot chain by hand down to register writes, yet still pulls the DDR image from rkbin. That is a direct measurement of how little of the DDR training path is replicable outside Rockchip.

## The community space

The most active organized community effort is the `open-rk3588` GitHub organization, which self-describes as "An opensource space (unofficial) for Rockchip RK3588 platform" (https://github.com/open-rk3588/, jev weight 0.8045). Its repository list includes `android_vendor_open-rk3588_prebuilts`: "Prebuilt blobs (built from open source projects) for RK3588 SoC on Android" (https://github.com/open-rk3588/, jev weight 0.5826). The phrasing is significant: the org rebuilds what it can from open projects and is explicit that its prebuilts come from open sources. The DDR blob does not appear in that description, consistent with it having no open source to rebuild from.

Collabora's blog documents the pattern that solved the previous closure and would presumably apply to this one: BL31 was replaced by upstreaming open code into TF-A with Rockchip's participation ("Rockchip provided an open source version for the Trusted Firmware-A (TF-A), which got merged", weight 0.7910). That path required the vendor to provide the source. No equivalent vendor gesture for DDR init appears anywhere in the collected record.

## What the other SoC families show

The blob-free board inventory of the maintained U-Boot binary project marks where open DDR init already exists on Rockchip silicon: "47 boards build fully blob-free, DRAM init from U-Boot's own TPL and BL31 from mainline TF-A: the rk3399, rk3328, rk3326 and px30 boards" (https://github.com/schneid-l/u-boot-rockchip, jev weight 0.7010). Older Rockchip SoCs (RK3399 and earlier) have source-level DRAM init in U-Boot; the RK3588 generation does not. This shows open DDR init on Rockchip silicon is achievable in principle (it exists for RK3399), while marking RK3588's DDR controller as the boundary of what the community has reached so far.

## Timeline outlook

No collected source offers a date. The honest summary of the dig:

1. The BL31 closure took the vendor-provided-open-source path and is solved (weight 0.7910).
2. The DDR init closure has no announced vendor program, no community project claiming work on it, and no timeline in any collected source.
3. The RK3399 precedent (blob-free DRAM init from U-Boot TPL, weight 0.7010) proves the end state is possible on Rockchip hardware but says nothing about when RK3588 reaches it.

For the yubiOS decision this means option 5 in doc 05 (wait for an open replacement) has an unbounded horizon and cannot be the plan of record. The blob is a standing input for the foreseeable future, which pushes the decision toward build-time acquisition with pinning (doc 08) while keeping the open-replacement watch as a background item, not a dependency.
