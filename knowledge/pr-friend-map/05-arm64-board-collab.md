# 05 ARM64 board communities: the friends who make Path A provable

Scope: working with ARM64 firmware and board communities, including TF-A, OP-TEE, U-Boot, and Rockchip RK3588 and RK3399 operators, to review provisioning and recovery sequences before any real-board proof is claimed.

## What is actually proven on the RK3588 today

The honest baseline matters more than enthusiasm. The strongest community-adjacent evidence is that the RK3588 open-source boot chain has improved to the point that the open-source BL31 from ARM Trusted Firmware is included in Collabora's published Debian images for the board (https://www.collabora.com/news-and-blog/blog/2024/02/21/almost-a-fully-open-source-boot-chain-for-rockchips-rk3588/, jev weight 0.8013). That is a real, citable milestone, and it is also a boundary: an open BL31 is one stage of the chain, not the whole secure-boot story.

The rest of the RK3588 secure-boot picture is documented as scarce. A reverse-engineering writeup notes that the RK3588 family can enable Secure Boot so that only approved bootloaders run, but that there is very little public information on how to do so, and that the available knowledge came from reverse engineering two publicly released files (https://github.com/DualTachyon/rk3588-secure-boot, jev weight 0.1405, weak backing). A 2026 embedded conference talk abstract makes the same structural point from a maintainer's perspective: limited documentation and reliance on a closed-source vendor OP-TEE binary and development tools raise concerns, while OP-TEE 4.9.0 and barebox v2026.02.0 may allow users to enable and use Secure Boot (https://cfp.embedded-recipes.org/er2026/talk/ULWYUJ/, jev weight 0.3310, weak backing). A generated reference summary of the vendor rkbin tooling describes secure boot as verifying the authenticity of firmware components during boot, with BL31 and BL32 (OP-TEE) as the surrounding architecture (https://deepwiki.com/rockchip-linux/rkbin/8.3-secure-boot-configuration, jev weight 0.5289).

## Working implementations to compare against

Two community artifacts are close enough to a target design that they deserve direct study rather than paraphrase. A project that runs upstream OP-TEE with a built-in PKCS#11 token on a Radxa ROCK 5B (RK3588) booting edk2-rk3588 UEFI states its goal plainly: a key store whose private keys root cannot read, with import, sign, and no export, and it lists its own remaining holes honestly (https://github.com/nikicat/rock5b-optee, jev weight 0.6333). A build-and-image site ships U-Boot 2025.07 combined with ATF LTS v2.12.5 and OP-TEE v4.7.0 for Rockchip, labels its rk3399 images as HARDENING and rk3588 as TESTING, and publishes sdcard images plus UEFI secure-boot materials including signing your own shim (https://u-boot.omniteck.com/, jev weight 0.5710).

The RK3399 side is more mature in public instructions. The Gentoo wiki documents installing Das U-Boot on the ROCKPro64 from mainline upstream source code, with pre-built images referenced as an alternative (https://wiki.gentoo.org/wiki/PINE64_ROCKPro64/Installing_U-Boot, jev weight 0.7811). A personal writeup covers U-Boot, GRUB, and a minimal Debian rootfs on the same board, confirming it as a low-cost RK3399 single-board computer (https://2names1scott.com/docs/rockpro64boot.html, jev weight 0.2760, weak backing). A standalone RK3399 UEFI package exists but is tied to vendor Android flashing tools for deployment (https://github.com/jeffchenfz/Rockchip, jev weight 0.4954).

## The friend-making move

These communities respond to artifacts, not ambition. The contribution that earns review is a board-specific provisioning checklist, published per board, that states exactly what gets fused, flashed, and rehearsed, and what the recovery path is when each step fails. The ask that goes with it is equally concrete: review the provisioning and recovery sequence, especially the root-of-trust key rehearsal in fuses, OP-TEE and RPMB-backed state, fTPM nonvolatile storage, U-Boot UEFI behavior, and the signed UKI boot path. The ask explicitly seeks corrections and failure modes, not endorsement.

The gate before any of this outreach is a sacrificial-board rehearsal plan: a documented run of the destructive steps on hardware the project can afford to lose, with the failure modes recorded. Practitioners who maintain the sources above have all bricked a board at some point; showing the rehearsal plan is what signals the project understands that.

## What to ask each community

1. TF-A and OP-TEE maintainers: is the BL31/OP-TEE provisioning sequence correct for a production fusing flow, and what does the recovery path look like when RPMB provisioning fails midway?
2. ROCK 5B operators: does the edk2-rk3588 UEFI path behave as documented with signed UKIs, and where does it deviate on real hardware?
3. RK3399 ROCKPro64 maintainers: is the mainline U-Boot instruction set sufficient for a signed-boot variant, and what breaks first?
4. The reverse-engineering authors: what parts of the vendor secure-boot flow are still undocumented, and would a published reproduction help?

The success signal is board-specific corrections: a reply that names a fuse word, a TOSD condition, or an SPI flash step the checklist got wrong. That reply is worth more than any amount of general encouragement, and it is the proof artifact that makes later ARM64 owner-root language safe.
