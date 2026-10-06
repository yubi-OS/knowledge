# 06 RK3576: the new Rockchip intersection, still watch lane

Scope: RK3576 as the genuinely new three-way upstream intersection (Radxa ROCK 4D, ArmSoM Sige5), why it is behind RK3588, and what has to land upstream before it is a Path A board.

Grounding spine: `yubi-OS/yubiOS docs/OPTS.md`, section "Priority 2, RK3576: ROCK 4D and ArmSoM Sige5", plus the ROCK 4D / ArmSoM Sige5 row of the comparison matrix.

## Why it surfaced

RK3576 is new in the current three-way upstream intersection (source doc):

- TF-A's Rockchip platform list and the RK3576 platform makefile now contain RK3576 BL31 support.
- OP-TEE's Rockchip configuration contains an RK3576 flavor and platform source.
- Current U-Boot lists 7 RK3576 boards. `rock-4d-rk3576_defconfig` and `sige5-rk3576_defconfig` enable eMMC RPMB transport.
- The ROCK 4D has an eMMC/UFS module connector; the Sige5 is sold in eMMC variants. Prefer eMMC for the first proof because the current yubiOS secure-state design is explicitly eMMC RPMB based.

The two boards check out as RK3576 hardware in vendor documentation: the Radxa ROCK 4D is a compact SBC featuring the Rockchip RK3576 or RK3576J SoC, an octa-core CPU (4x Cortex-A72 + 4x Cortex-A53), Mali-G52 GPU, and a 6 TOPS NPU [https://docs.radxa.com/en/rock4/rock4d] (w 0.82), with the product page adding HDMI 2.1, dual MIPI CSI, PCIe expansion, and support for local LLM inference [https://radxa.com/products/rock4/4d/] (weak, w 0.50). The ArmSoM Sige5 uses the RK3576 second-generation 8nm high-performance AIOT platform with up to 16 GB memory, 8K video codec support, dual Gigabit ports, and WIFI6/BT5 [https://docs.armsom.org/armsom-sige5] (w 0.77).

The comparison matrix row compresses the state: early owner-verification is "Rockchip ROM + TPL/SPL" with "no reviewed RK3576 owner-fuse implementation"; RPMB transport only; the principal blockers are "Secure-boot/OTP code, TEE integration, DDR blob"; the lane is Priority 2 watch (source doc).

## Why it is behind RK3588

The source doc records 4 reasons (source doc):

1. The reviewed OP-TEE RK3576 flavor does not enable the RK3588 `CFG_RK_SECURE_BOOT`/OTP provisioning path. The Rockchip secure-boot trusted application exists in optee_os for the Rockchip platform generally [https://github.com/OP-TEE/optee_os/blob/master/core/pta/rockchip/rk_secure_boot.c] (w 0.90), but the RK3576 flavor does not wire it up with the OTP provisioning path the RK3588 flavor has.
2. The reviewed U-Boot board configs do not enable OP-TEE, EFI MM communication, or fTPM. The eMMC RPMB support they do enable is transport only, which under the candidate gates proves nothing about secure variables (see 01-path-a-candidate-gates.md, gate 5).
3. Current U-Boot documentation still requires Rockchip DDR/TPL binaries.
4. TF-A provides BL31 only. BootROM plus U-Boot TPL/SPL, not TF-A BL1/BL2, must implement and prove the early owner-verification chain.

That last point is the structural one and is expanded in 09-cross-cutting-conclusions.md: Rockchip upstream simply does not give TF-A the BL1/BL2 role on these SoCs, so the "complete chain" gate has to be argued over a different set of stages than on NXP parts.

## The eFuse reality on Rockchip

Rockchip's secure-boot mechanism is OTP/eFuse based: a device whose eFuse is programmed enables secure boot ROM and cannot boot unsigned firmware, per a Rockchip application note [http://resource.milesight-iot.com/files/Rockchip-Secure-Boot-Application-Note-V1.9.pdf] (weak, w 0.58). Pengutronix's 2026 writeup describes the equivalent mechanism working on RK3588 with an independent bootloader [https://pengutronix.de/en/blog/2026-06-19-rk3588-secure-boot.html] (w 0.58). That is the class of mechanism an RK3576 owner-verification implementation would have to sit on, and it does not yet exist in reviewed upstream form for RK3576.

## Verdict as recorded

Highest-value new Rockchip research target, but not a near-term Path A board (source doc). The recorded rule is to first upstream or carry a reviewed RK3576 fuse/OTP implementation and negative-test it before purchasing multiple devices (source doc). The source doc's recommended next work treats RK3576 as a watch lane to re-evaluate when upstream has a real secure-boot/OTP path (source doc). Until then the boards are survey subjects, not purchases: the hardware proof packet and its research-candidate label rule (see 10-next-work-proof-packet.md) apply.
