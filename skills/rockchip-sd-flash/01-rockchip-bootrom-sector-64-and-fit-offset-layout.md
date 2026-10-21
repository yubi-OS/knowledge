# 01: Rockchip BootROM Sector 64 and FIT Offset Layout

**Scope:** Why `u-boot-rockchip.bin` writes at sector 64: idbloader (TPL+SPL, RKNS magic `52 4b 4e 53`) at offset 0 and `u-boot.itb` (BL31+TEE+U-Boot+FDT) at byte offset 8,355,840 (sector 16384), vs the SPI NOR layout.

**Ground source:** `yubi-OS/yubiOS skills/rockchip-sd-flash/SKILL.md` (internal record, validated 2026-10-10/11 across 3 verified writes). External claims below come from the Clef-weighted searXNG dig in `dig_context_01.json`; every weight is quoted inline.

## 1. What the packed binary contains

The ground source defines `u-boot-rockchip.bin` as 2 concatenated payloads:

- **idbloader** (TPL + SPL) at file offset 0.
- **`u-boot.itb`**, a FIT image carrying BL31 (TF-A), the TEE (OP-TEE), U-Boot proper, and the FDT, at file byte offset 8,355,840.

The arithmetic: (16384 - 64) x 512 = 16320 x 512 = 8,355,840 bytes. Writing the whole file starting at **sector 64** therefore lands idbloader at sector 64 and the FIT at sector 16384 on the card.

External corroboration of the same packing exists, but only with weak backing:

- inindev/uboot-rockchip describes `u-boot-rockchip.bin` as "a combined binary that includes both idbloader.img (offset 0) and u-boot.itb (offset 8m-32k)", designed for SD card or eMMC flashing (https://github.com/inindev/uboot-rockchip, clef weight: 0.3495) (weak backing, clef weight < 0.5). Note that 8 MiB - 32 KiB = 8,388,608 - 32,768 = 8,355,840, which matches the ground source to the byte.
- stevenliuit/uboot-rockchip-build lists `u-boot-rockchip.bin` as the "Combined image for SD/eMMC (idbloader + u-boot.itb)" and separates out `u-boot-rockchip-spi.bin` "For SPI NOR flash (with offset adjustments)" (https://github.com/stevenliuit/uboot-rockchip-build, clef weight: 0.2019) (weak backing, clef weight < 0.5).

## 2. Why sector 64

Per the ground source, sector 64 is the Rockchip BootROM load address on SD/eMMC: the BootROM reads idbloader from there, and SPL then loads the FIT from sector 16384. This is why erased or dirty cards are acceptable for this flow (see doc 04): the BootROM only reads from sector 64 onward.

Supporting context from the dig:

- The RK-SPI-NOR-Chainloader docs state their image "follows U-Boot's Rockchip LBA-64 firmware layout and Armbian's bs=32k seek=1 binman writer", with no partition table, kernel, initramfs, DTB, or root filesystem, and must be written "to the whole SD device, not a partition" (https://hqnicolas.github.io/RK-SPI-NOR-Chainloader/docs/rk356x/chainloading.html, clef weight: 0.4213) (weak backing, clef weight < 0.5). bs=32k seek=1 equals a 32,768-byte offset, which is 64 x 512 bytes, i.e. the same sector 64.
- The PINE64 RK3399 boot sequence page (rock1's own SoC) notes SD is probed on the SDMMC controller using normal SD enumeration at 375 kHz, and that after initialization eMMC and SD behave much the same (https://wiki.pine64.org/wiki/RK3399_boot_sequence, clef weight: 0.3094) (weak backing, clef weight < 0.5).
- Rock-Chip.com's guides index advertises a stage-by-stage walkthrough of BootROM, TPL, SPL, BL31, U-Boot and Linux, "where each piece lives on flash", and how to tell from the serial log which stage failed (https://rock-chip.com/guides, clef weight: 0.7299). This is the only high-weight result for this subtopic; the snippet confirms the stage chain but not the specific sector numbers.
- ArmSoM's Rockchip boot intro distinguishes upstream/Rockchip U-Boot TPL/SPL from the Rockchip idbLoader built from rkbin's DDR init and miniloader blobs (https://docs.armsom.org/advanced-manual/rockchip-boot, clef weight: 0.3907) (weak backing, clef weight < 0.5).
- Flipper One's RK3576 boot-flow page documents the cold boot from on-chip boot ROM through DDR init, SPL, the FIT-packaged main bootloader (U-Boot + TF-A), and the on-flash layout the boot ROM and SPL rely on (https://docs.flipper.net/one/resources/rockchip/boot-flow?pubDate=20260521, clef weight: 0.3437) (weak backing, clef weight < 0.5).

## 3. SD/eMMC layout vs SPI NOR layout

The ground source carries a hard prohibition: **never dd `u-boot-rockchip-spi.bin` raw to an SD card**. That file uses the SPI NOR layout (RKNS at 0x8000), not the sector-64 SD layout. The stevenliuit build listing above (weight 0.2019, weak backing) agrees that the SPI variant is a distinct artifact with offset adjustments; the exact 0x8000 placement is asserted only by the ground source.

## 4. Empirical pre-write layout check

Before the first write of any new build, the ground source requires 3 checks:

1. The file starts with the RKNS magic bytes `52 4b 4e 53` (ASCII "RKNS").
2. `idbloader.img` is a byte-prefix of the packed bin.
3. `u-boot.itb` appears at offset (16384 - 64) x 512 = 8,355,840.

A minimal shell form (illustrative, derived from the 3 rules above):

```sh
head -c 4 u-boot-rockchip.bin | xxd -p          # expect 524b4e53
cmp -n "$(stat -c %s idbloader.img)" idbloader.img u-boot-rockchip.bin
cmp u-boot.itb <(tail -c +8355841 u-boot-rockchip.bin | head -c "$(stat -c %s u-boot.itb)")
```

## 5. Carrier model

rock1 (Pine64 RockPro64 v2.1, RK3399) only carries the card: its SD slot `/dev/mmcblk1` (~59.5G) holds loader cards for ROCK 5B (RK3588) and PineTab2 (RK3566). The card image's SoC never has to match rock1, because rock1 never boots from it.

## Gaps

No result at weight >= 0.5 states the sector-64 or sector-16384 numbers directly; those rest on the ground source plus weak-backing corroboration. The RKNS-at-0x8000 SPI claim has no external backing in this dig.

## Sources Considered

| # | URL | Clef weight | Backing |
|---|---|---|---|
| 1 | https://rock-chip.com/guides | 0.7299 | authoritative |
| 2 | https://hqnicolas.github.io/RK-SPI-NOR-Chainloader/docs/rk356x/chainloading.html | 0.4213 | weak backing, clef weight < 0.5 |
| 3 | https://docs.armsom.org/advanced-manual/rockchip-boot | 0.3907 | weak backing, clef weight < 0.5 |
| 4 | https://github.com/inindev/uboot-rockchip | 0.3495 | weak backing, clef weight < 0.5 |
| 5 | https://docs.flipper.net/one/resources/rockchip/boot-flow?pubDate=20260521 | 0.3437 | weak backing, clef weight < 0.5 |
| 6 | https://wiki.pine64.org/wiki/RK3399_boot_sequence | 0.3094 | weak backing, clef weight < 0.5 |
| 7 | https://github.com/stevenliuit/uboot-rockchip-build | 0.2019 | weak backing, clef weight < 0.5 |
| 8 | https://rock-chip.com/tools | 0.1288 | weak backing, clef weight < 0.5 (not cited) |
| 9 | https://www.rock-chips.com/a/en/ | 0.0365 / 0.0281 | weak backing, clef weight < 0.5 (corporate landing page, not cited) |
