# 03 - RK3588 TPL Blob (B-RK3588-TPL)

Scope: the external DDR/TPL blob requirement on RK3588, why the green publish job is diagnostic packaging rather than a flashable image, and the pin-checksum-fail-closed unblock path.

Grounding spine: source doc `yubi-OS/yubiOS docs/BLOCKERS.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/BLOCKERS.md), row B-RK3588-TPL.

## The blocker as stated

The register states that run 29869527608 compiled the RK3588 components but recorded that U-Boot requires a real external DDR/TPL blob (source doc). The bundle lacked the expected `u-boot-rockchip.bin`, so its green publish job is diagnostic packaging, not a flashable image (source doc). The root-cause class here is a proprietary firmware dependency: the DRAM initialization (TPL) for RK3588 comes from a vendor blob that the project cannot build from source, so the CI pipeline can compile everything else and still produce something that will never boot.

## What the TPL is and why it is external

In the U-Boot build model, the TPL (Tertiary Program Loader) is the earliest stage; the upstream TPL documentation describes a chain where the earliest loader brings up memory before SPL loads the final U-Boot image into DDR (source: https://github.com/Firefly-rk-linux/u-boot/blob/rk3588/firefly/doc/README.TPL, jev weight 0.63). On RK3588 boards, the DDR init binary is a distinct input: the Theobroma Systems RK3588-Q7 board documentation lists "Get DDR init (TPL) binary" as an explicit build prerequisite, with the SoM providing up to 16GB LPDDR4x (sources: https://docs.u-boot-project.org/en/v2026.10/board/theobroma-systems/tiger_rk3588.html, jev weight 0.7; https://docs.u-boot-project.org/en/stable/board/theobroma-systems/tiger_rk3588.html, jev weight 0.74).

The vendor side of this dependency is documented by Rockchip itself: the official U-Boot board documentation describes packaging Rockchip images from rkbin binaries and notes that "rkbin binaries are regularly updated, so it would be recommended to use the latest version" (source: https://docs.u-boot.org/en/v2024.01/board/rockchip/rockchip.html, jev weight 0.72). rkbin is exactly the class of binary blob the blocker names: regularly updated, vendor-published, and not built from the project's own tree.

## How open the RK3588 boot chain actually is

The dig's strongest external context is the Collabora analysis of the RK3588 boot chain: as of 2024-02-21 you can build a complete working BL31 (Boot Loader stage 3.1) and replace the closed binary blob with an open-source binary (source: https://www.collabora.com/news-and-blog/blog/2024/02/21/almost-a-fully-open-source-boot-chain-for-rockchips-rk3588/, jev weight 0.62). The word "almost" in the title is the honest summary: parts of the boot chain have open-source replacements, while DDR/TPL initialization remains the closed dependency that keeps the chain incomplete. That is precisely why B-RK3588-TPL exists as a row while other RK3588 components compile cleanly in CI.

## The unblock path

The register prescribes 4 moves (source doc):

1. Select a legally redistributable source for the DDR/TPL blob.
2. Pin its immutable ref and checksum.
3. Fail closed when the blob is absent, so the build cannot silently ship a diagnostic-only artifact.
4. Prove the resulting combined image on sacrificial ROCK 5B hardware.

This is a supply-chain answer to a firmware dependency: since the blob cannot be eliminated, the project's control point is how it is sourced, pinned, and verified. Failing closed matters most: a green publish job that produces a non-flashable image is exactly the failure mode where CI status lies about reality, and the blocker explicitly relabels that green job as "diagnostic packaging" (source doc).

## The dependency-management lesson

B-RK3588-TPL teaches the difference between "compiles in CI" and "boots on hardware" as a dependency question. The missing blob was invisible to the build system because it is an external input the compiler never sees; only the absence of `u-boot-rockchip.bin` in the bundle exposed it. The register's answer is to make the invisible dependency visible at 3 points: pinned and checksummed at acquisition, fail-closed at build, and physically proven at flash. In a hardware-coupled OS project, every vendor blob is a dependency that CI can compile around but never eliminate, and the ledger's job is to keep that fact in the active list until a real board closes it.
