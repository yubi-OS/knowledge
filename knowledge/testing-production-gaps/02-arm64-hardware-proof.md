# 02 - ARM64 real-board proof

## Scope

Real-board ARM64 evidence: RK3588 TPL/DDR boot, ROTPK fuse provisioning, RPMB, and owner root-of-trust custody that QEMU cannot prove.

## Why QEMU evidence is a different class

An emulator run proves that the build produces the right artifacts and that the software chain can be exercised. It cannot prove that the SoC's boot ROM actually verifies signatures against fuses, that the eMMC RPMB partition enforces replay protection, or that a human being is holding the root of trust material. This distinction is the reason yubiOS separates Path A (real board) from Path B (emulated) evidence and refuses to claim production readiness on Path B alone (yubiOS source: refs/testing-production-gaps-2026-08-01).

## The RK3588 secure boot mechanism

The RK3588 family of SoCs has the ability to enable Secure Boot so that only approved bootloaders can run, and the mechanism is guarded by eFuses: a device whose eFuse has been programmed enables the secure boot ROM and cannot boot from unsigned firmware, and attempting to upgrade with unsigned or mismatched signed firmware fails (source: http://resource.milesight-iot.com/files/Rockchip-Secure-Boot-Application-Note-V1.9.pdf, jev weight 0.61). Public documentation for the flow is thin; the best public reverse-engineering of the RK3588 secure boot process documents how the SoC verifies bootloader signatures and what key material the boot ROM consumes (source: https://github.com/DualTachyon/rk3588-secure-boot, jev weight 0.55). Rockchip's own rkbin tooling covers the configuration surface: the secure boot architecture, the OTP parameters, and the signing configuration for the boot chain (source: https://deepwiki.com/rockchip-linux/rkbin/8.3-secure-boot-configuration, jev weight 0.40, weak backing).

The practical consequences for a test program:

1. eFuse programming is irreversible. A rehearsal must run on a sacrificial board because a wrong ROTPK hash bricks the boot ROM chain permanently.
2. The root of trust public key hash (ROTPK) must be provisioned before the first signed boot. There is no undo, so the ceremony order (generate key, derive hash, verify hash on the board, burn) needs a second human check.
3. The TPL/DDR stage is SoC-vendor code that runs before anything the project builds; proving the RK3588 TPL and DDR init work on real silicon is its own gate, separate from the OS image.

## RPMB and fTPM on the board

The firmware TPM approach yubiOS uses depends on persistent state that only real storage enforces. U-Boot support for fTPM provides TPM 2.0 functionality through Microsoft's fTPM Trusted Application running in the OP-TEE secure world, using eMMC RPMB as persistent storage (source: https://www.mail-archive.com/u-boot@lists.denx.de/msg568159.html, jev weight 0.59). In QEMU the RPMB backend is a simulation, so the replay-protection property is asserted, not measured. On a real board, the RPMB write counter and key provisioning are physical behaviors, which is why the yubiOS Path A plan splits RPMB bring-up into its own milestone (OMN-46 in the yubiOS tracker, yubiOS source: refs/testing-production-gaps-2026-08-01).

## What the board proof must capture

The yubiOS gap audit lists what is missing: real RK3588 TPL plus DDR boot, U-Boot UEFI Secure Boot variable enforcement on hardware, ROTPK/fuse provisioning, RPMB bring-up, and owner root-of-trust custody (yubiOS source: refs/testing-production-gaps-2026-08-01). A defensible rehearsal record for each item should contain:

- The exact firmware images and their hashes, so the run is reproducible.
- A serial log showing the boot ROM accepting the signed TPL and rejecting a deliberately unsigned one.
- The RPMB write counter before and after, proving monotonic state.
- The key ceremony record: who generated the key, who verified the hash, who burned the fuse, each signed off.

Owner custody matters because a root key that only CI machines can use is not a root of trust in any meaningful sense; the audit ties this to a named human sign-off for the ritual phases (yubiOS source: refs/testing-production-gaps-2026-08-01).

## Cost and sequencing

The yubiOS audit prices the full ARM64 Path A proof at 6 to 12 weeks plus one sacrificial board and a human sign-off for ritual phases (yubiOS source: refs/testing-production-gaps-2026-08-01). The sequencing logic generalizes to any immutable OS project:

1. Board bring-up first: TPL, DDR, and U-Boot on real silicon, with unsigned boot still allowed. This is recoverable.
2. RPMB and fTPM bring-up second: still recoverable, but state-bearing, so record the RPMB key material handling.
3. Fuse ceremony last: irreversible, single-shot, done only after the two recoverable stages are green and recorded.

Attempts to compress this order create the classic failure: the fuse ceremony happens early, a bug surfaces in stage 1, and the sacrificial board is already committed with no way to re-provision.

## Sources

- http://resource.milesight-iot.com/files/Rockchip-Secure-Boot-Application-Note-V1.9.pdf (weight 0.61)
- https://www.mail-archive.com/u-boot@lists.denx.de/msg568159.html (weight 0.59)
- https://github.com/DualTachyon/rk3588-secure-boot (weight 0.55)
- https://deepwiki.com/rockchip-linux/rkbin/8.3-secure-boot-configuration (weight 0.40, weak backing)
- https://www.embedcrest.com/blog/secure-boot-arm-cortex-m (weight 0.39, weak backing)
- https://github.com/DualTachyon/rk3588-secure-boot/blob/main/README.md (weight 0.23, weak backing)
- yubiOS refs/testing-production-gaps-2026-08-01 (internal source doc for all repo-internal claims)
