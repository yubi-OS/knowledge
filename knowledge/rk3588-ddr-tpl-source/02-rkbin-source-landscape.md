# The rkbin repository: where RK3588 DDR/TPL binaries come from

Scope: the single upstream source of RK3588 DDR/TPL blobs, its layout and blob variants, its forks and mirrors, and the licensing picture as the dig found it.

## The repository

There is exactly one upstream source for the RK3588 DDR/TPL binaries: Rockchip's `rockchip-linux/rkbin` GitHub repository. Its own README states the purpose: "The rkbin repository is mainly used to store files that may be used in the early boot stages on Rockchip platforms, including executable binaries, configuration files, tools, and more" (https://github.com/rockchip-linux/rkbin, jev weight 0.9443). A second capture of the same README's description section enumerates what those binaries are: "Boot-related binaries such as SPL/DDR/UsbPlug/BL31/BL32/OPTEE, usually built independently from a single repository" (https://github.com/rockchip-linux/rkbin, jev weight 0.7837). The DDR/TPL blob is one entry in that family: it ships in the same repo as the BL31, BL32/OP-TEE, and USB-plug payloads that surround it in the boot chain.

Rockchip, the manufacturer, describes itself as "a leading fabless IC design company that focuses on Intelligent IoT" and a SoC design specialist (https://www.rock-chips.com/a/en/, jev weight 0.7003). The rkbin repository is published under the company's rockchip-linux GitHub organization, which hosts 11 repositories of "open source software for Rockchip SoCs" (https://github.com/rockchip-linux, jev weight 0.5028). Note the tension in that phrase: the organization is nominally open source, but rkbin's contents are binaries.

## Blob variants and naming

The DDR/TPL blobs are versioned per memory configuration and speed grade. A bare-metal RK3588 bringup guide names the exact artifact a builder needs: "You will need the official rockchip-developed ddr image: https://github.com/rockchip-linux/rkbin/blob/master/bin/rk35/rk3588_ddr_lp4_2112MHz_lp5_2400MHz_v1.18.bin" (https://danielc.dev/rk/rk3588/boot/, jev weight 0.7255). The filename encodes the DRAM types and frequencies the training image supports (LPDDR4 at 2112 MHz and LPDDR5 at 2400 MHz in that variant) plus a binary version (v1.18). The blob lives under `bin/rk35/` in the repo tree.

An RK3588 release-notes document maintained inside a Rockchip SDK GitLab instance under `rk/rkbin` documents "features and updates" for the RK3588 Linux SDK (https://gitlab.com/rockchip_linux_sdk_6.1/rk/rkbin/-/blob/main/doc/release/RK3588_EN.md, jev weight 0.8232), showing that the blob releases are tracked with formal release documentation inside Rockchip's SDK infrastructure, not just dumped into git.

## Forks and mirrors

The dig found two maintained third-party forks, both by distros or board vendors rather than random users:

- Radxa maintains `radxa/rkbin`, "Firmware and Tool Binarys", a direct fork (https://github.com/radxa/rkbin, jev weight 0.7539).
- Armbian maintains `armbian/rkbin`, whose README answers "What is RkBin?" with: "RkBin is a collection of proprietary firmware components essential for proper hardware initialization, booting, and system operation on Rockchip SBCs. It includes the bootloader, trusted firmware, and other binary blobs required for a seamless boot process and efficient hardware utilization" (https://github.com/armbian/rkbin, jev weight 0.8021).

Armbian's phrasing is the clearest independent characterization of the payloads: proprietary firmware components. This matters for the redistribution analysis in doc 05: even the fork maintainers describe the contents as proprietary, and their forks exist to package the blobs, not to relicence them.

## Licensing picture

The dig could not verify the exact license text shipped in the rkbin repository; no collected source quotes it. What the dig does establish:

1. The payload binaries are proprietary firmware components, per the Armbian fork README (https://github.com/armbian/rkbin, jev weight 0.8021).
2. The repository ships binaries, configuration files, and tools together (https://github.com/rockchip-linux/rkbin, jev weight 0.9443), which means any license reading must distinguish tool code from binary payloads.

The specific claim that the rkbin tooling is BSD-3-Clause while the payloads remain Rockchip-proprietary appears in the source research note but was not confirmed by any dig result in this corpus; it is recorded here as unverified rather than stated as fact. The verification step (reading the LICENSE file and blob-side license declarations in the repo) is an open item for the OMN-56 pinning decision.

## Why one source matters

Every build environment examined in doc 04 pulls from this one repository or a fork of it. The blob is not available from a second independent origin with a different provenance story: Rockchip's GitLab SDK instance mirrors it (https://gitlab.com/rockchip_linux_sdk_6.1/rk/rkbin/-/blob/main/doc/release/RK3588_EN.md, weight 0.8232), and community forks redistribute copies, but the generating authority is single. For a supply-chain pinning decision this is actually convenient: there is exactly one canonical URL family to pin by sha256, and drift can only enter through forks, not through divergent upstreams.
