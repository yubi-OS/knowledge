# What the RK3588 TPL/DDR binary is and where it sits in the boot chain

Scope: what the RK3588 TPL/DDR blob actually is, its job in the boot chain, and why it is not U-Boot code.

## The component

On Rockchip RK3588, the earliest stage of the boot chain after the BootROM is a memory initialization firmware stage. ArmSoM's Rockchip boot documentation describes the flow directly: "If loader1 is tpl and spl, bootrom will first run to tpl, tpl init ddr and return to bootrom, bootrom load and run to spl" (https://docs.armsom.org/advanced-manual/rockchip-boot, jev weight 0.7827). The TPL's single job is to bring up the DDR memory subsystem: it probes the memory controller, calibrates timings, and returns control to the BootROM so the next stage can load out of working RAM.

An rkbin-focused walkthrough of the Rockchip boot process states the same thing from the blob side: "The DDR firmware is the first component loaded by Boot ROM and is responsible for complete memory subsystem initialization. It is configured in the [CODE471_OPTION] section of RKBOOT INI files" (https://deepwiki.com/rockchip-linux/rkbin/2-boot-process-architecture, jev weight 0.5942). So the same component appears under different names depending on the packaging: TPL in the U-Boot build flow, DDR init bin in the Rockchip loader flow, and CODE471 payload in RKBOOT packaging.

## Why it is not U-Boot code

U-Boot itself is open source, and its SPL stage is compiled from source. The DDR training stage that precedes it is not. Collabora's 2024 blog on the RK3588 boot chain records that "to build U-Boot, the stage 2 SPL (Secondary Program Loader) and stage 3 U-Boot proper, it was mandatory to include a closed-source DDR training binary blob and also a pre-built BL31 blob from the vendor" (https://www.collabora.com/news-and-blog/blog/2024/02/21/almost-a-fully-open-source-boot-chain-for-rockchips-rk3588/, jev weight 0.7909). The blob is consumed by the U-Boot build; it is not U-Boot source and cannot be rebuilt from U-Boot's tree.

A hands-on RK3588 cluster writeup reaches the same conclusion from the builder's perspective: "The SPL and TPL are closed source binary blobs provided by the CPU manufacturer (Rockchip). They are combined in the bootloader build process... This second stage bootloader is typically combined with U-Boot during the firmware build process" (https://soliddowant.github.io/2024/01/23/rk3588-cluster-4, jev weight 0.5564). Note the phrase "provided by the CPU manufacturer": the blob's provenance is Rockchip's binary releases, not any community source tree.

The official U-Boot documentation for Theobroma's RK3588 SOM makes the blob a first-class build input: the step-by-step boot instructions include "Get DDR init (TPL) binary" as an explicit acquisition step before anything is built (https://docs.u-boot-project.org/en/stable/board/theobroma-systems/tiger_rk3588.html, jev weight 0.7618). In other words, even mainline U-Boot's own board docs treat the TPL as something you fetch, not something you compile.

## The two loader paths

ArmSoM's documentation lays out the alternative build paths that exist on Rockchip platforms: "Use U-Boot TPL/SPL from upstream or Rockchip U-Boot, complete source code. Use Rockchip idbLoader, which is composed of Rockchip ddr init bin file and miniloader bin file in Rockchip rkbin project" (https://docs.armsom.org/advanced-manual/rockchip-boot, jev weight 0.7880). This is the central tension for redistribution:

1. The U-Boot TPL/SPL path is described as complete source code in the ArmSoM text, but on RK3588 the TPL inside that path is still the Rockchip DDR binary, fetched separately, as the U-Boot Tiger documentation shows.
2. The idbLoader path is explicitly blob-composed: "Rockchip ddr init bin file and miniloader bin file in Rockchip rkbin project" (same source, weight 0.7880). Both branches terminate at the same rkbin repository.

## Terminology note

"DDR blob", "DDR init bin", "TPL", and "DDR training binary" all refer to this same stage in practice. The name varies by which tool is talking: U-Boot build systems call it TPL, Rockchip loader packaging calls it the DDR init bin (ArmSoM, weight 0.7880; https://docs.armsom.org/advanced-manual/rockchip-boot), and RKBOOT INI packaging calls it the CODE471 option (https://deepwiki.com/rockchip-linux/rkbin/2-boot-process-architecture, weight 0.5942). The U-Boot README.TPL in a Rockchip vendor U-Boot tree documents the TPL concept and the handoff where SPL "loads the final uboot image into DDR, then jump to it to begin execution" (https://github.com/Firefly-rk-linux/u-boot/blob/rk3588/firefly/doc/README.TPL, jev weight 0.6371), which is exactly the sequence the DDR stage enables by making RAM usable in the first place.

## Why this matters for redistribution

Because the TPL is the first component after the BootROM and because every build path consumes it, any OS image that boots an RK3588 board ships or fetches this blob one way or another. There is no source-built alternative in the current chain (see doc 03 and doc 07). The redistribution question is therefore not whether to use the blob but how to acquire it reproducibly: pull from the single upstream at build time, vendor it, or require a user-side fetch. Those options are analyzed in doc 05.
