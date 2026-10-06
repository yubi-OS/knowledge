# 03 RK3588 alternates: Orange Pi 5 Plus and NanoPC-T6 LTS

Scope: the Priority 1 alternate lane, two new RK3588 boards that test whether the Path A work is portable beyond ROCK 5B, and the TEE integrations their defconfigs still lack.

Grounding spine: `yubi-OS/yubiOS docs/OPTS.md`, section "Priority 1, RK3588 alternates".

## Why these boards surfaced

These are new board targets rather than a new SoC port. Their value is diagnostic: they test whether the Path A work is genuinely RK3588-wide instead of accidentally ROCK 5B-specific (source doc). If the implementation is portable, the same firmware sources and tests carry over with only board config, storage population, and evidence changing (source doc, recommended next work).

- Current U-Boot Rockchip documentation lists both boards (source doc).
- `orangepi-5-plus-rk3588_defconfig` and `nanopc-t6-rk3588_defconfig` enable SPL FIT signatures, TF-A handoff, and eMMC RPMB transport (source doc).
- The Orange Pi 5 Plus supports eMMC [https://www.orangepi.org/html/hardWare/computerAndMicrocontrollers/details/Orange-Pi-5-plus.html] and the NanoPC-T6 LTS is offered with eMMC configurations [https://friendlyelec.com/index.php?route=product/product&product_id=292] (both per source doc).
- They share TF-A and OP-TEE SoC code with ROCK 5B. OP-TEE's Rockchip configuration gives RK3588 the Rockchip OTP driver and `CFG_RK_SECURE_BOOT`; it also warns that secure-boot simulation defaults on and must be deliberately disabled before real fuse programming (source doc).

## What the upstream ecosystem looks like

The dig results confirm the shape of the Rockchip boot chain from independent sources:

- The Rockchip secure-boot PTA exists inside optee_os itself (`core/pta/rockchip/rk_secure_boot.c`), which is the trusted-side component behind `CFG_RK_SECURE_BOOT` [https://github.com/OP-TEE/optee_os/blob/master/core/pta/rockchip/rk_secure_boot.c] (w 0.90).
- The TF-A side of the RK3588 chain is BL31-only: Collabora's RK3588 upstreaming report notes that the open-source BL31 from TF-A is now included in their Debian images as the boot chain matured [https://www.collabora.com/news-and-blog/blog/2024/02/21/almost-a-fully-open-source-boot-chain-for-rockchips-rk3588/] (w 0.63). This corroborates the source doc's cross-cutting conclusion that TF-A does not hold the BL1/BL2 role on Rockchip.
- Rockchip's own secure-boot mechanism is eFuse based: a device with eFuse programmed enables secure boot ROM and cannot boot unsigned firmware, per a Rockchip application note [http://resource.milesight-iot.com/files/Rockchip-Secure-Boot-Application-Note-V1.9.pdf] (weak, w 0.58).
- Pengutronix's June 2026 writeup describes RK3588 hardware features that verify the integrity and legitimacy of firmware, and what enabling Secure Boot in barebox takes [https://pengutronix.de/en/blog/2026-06-19-rk3588-secure-boot.html] (w 0.58). Independent bootloader vendors shipping RK3588 secure boot is evidence the SoC-level OTP path is real, which is the precondition for any board port in this lane.

## What stays unproven

The source doc records the gaps precisely (source doc):

- Neither board defconfig enables `CONFIG_TEE`, `CONFIG_OPTEE`, `CONFIG_EFI_MM_COMM_TEE`, or `CONFIG_TPM2_FTPM_TEE`. The RPMB support is transport only; the OP-TEE `CFG_RPMB_FS` and StandaloneMM layers that turn transport into persistent UEFI state are absent.
- The board-specific eMMC SKU and RPMB capability must be recorded; NVMe alone cannot satisfy the current secure-variable design.
- The fuse map, owner ROTPK programming, lifecycle closure, and recovery route need board-specific proof even though the SoC is shared with ROCK 5B. The secure-boot simulation default flagged in the OP-TEE config makes this a live hazard on any new board: a team that skips the deliberate disable step is testing a simulation, not the fuse path.
- The normal upstream Rockchip flow still consumes Rockchip DDR/TPL firmware, which must be pinned and placed inside the trust boundary.

## Verdict as recorded

Best low-delta secondary board ports (source doc). The ordering rule is explicit: do not displace ROCK 5B; use one of these two to prove that the RK3588 implementation is portable after the primary hardware proof succeeds (source doc).

## Drift note

The Pengutronix post (2026-06-19) and the Collabora report are dated after the survey's snapshot discipline began but before its 2026-07-19 publication; neither changes the verdict (source doc). The missing pieces on these 2 boards remain U-Boot TEE integrations and board-specific fuse proof, not SoC capability.
