# 05: Board-Side UART Loop and U-Boot Shell Commands

**Scope:** Booting the target board (ROCK 5B RK3588, PineTab2 RK3566) from MMC2, reading the 1500000-baud UART console, and using pipe-free U-Boot commands (`dm tree`, `bdinfo`, `fdt addr`/`fdt print`).

**Ground source:** `yubi-OS/yubiOS skills/rockchip-sd-flash/SKILL.md` ("Board-side loop (user drives)" section). External claims come from the Clef-weighted searXNG dig in `dig_context_05.json`, which produced the strongest results in this corpus (4 of 10 at weight >= 0.5).

## 1. Who drives which half

The flash flow splits at the card. rock1 (Pine64 RockPro64, RK3399) writes and verifies the loader card through the shell bridge (docs 02 to 04). After that, **the user drives**: the card moves to the target board, the board boots, and the user debugs by pasting the UART log from the U-Boot `=>` prompt back into the session. The agent never has a live console on the target; it reasons from pasted text and replies with commands to type.

## 2. Confirming the card is what booted

Per the ground source, the target board boots from its microSD and SPL prints **"Trying to boot from MMC2"**. That line is the first checkpoint: it shows TPL/SPL loaded from the card written at sector 64 (doc 01) and SPL is now loading `u-boot.itb` from the same device. If the line is absent, the board did not boot this card, and the fault is upstream of U-Boot proper.

Rock-Chip.com's guides index (cited in doc 01 at weight 0.7299) frames this same approach, telling "from the serial log which stage failed". Treat it as context; it is not in this subtopic's dig.

## 3. The console baud rate

Rockchip consoles default to 1,500,000 baud. A Gentoo wiki page for building and installing U-Boot on the RK3588S Rock 5c states: "By default, Rockchip uses 1500000 bauds, which may be too fast for common USB-to-serial adapters" (https://wiki.gentoo.org/wiki/User:Brendlefly62/Rockchip_RK3588S_Rock_5c/Build-Install-U-Boot, clef weight: 0.2750) (weak backing, clef weight < 0.5). Neardi's RK3588 SDK docs describe changing the CPU serial baud configuration and note the platform supports multiple rates (https://wiki.neardi.net/docs/Linux-system-manual/common/hardware/uart-configuration/, clef weight: 0.2468) (weak backing, clef weight < 0.5). A Rockchip RK3588 U-Boot fork carries a `doc/README.console` for console behavior (https://github.com/VaillerTeeter/Rockchip-RK3588-u-boot/blob/next-dev/doc/README.console, clef weight: 0.5450); the snippet confirms only that the file exists, not the rate. Firefly's Core-3588J serial debug page is board marketing in its snippet (https://wiki.t-firefly.com/en/Core-3588J/debug.html, clef weight: 0.1951) (weak backing, clef weight < 0.5).

Practical consequence: if the pasted log is garbage characters, suspect the adapter or the baud setting before suspecting the loader.

## 4. The shell has no pipes

The ground source is explicit: **U-Boot's shell has no pipes and no grep.** Every reply to the user must be single, standalone commands. Long output cannot be filtered on the board; ask for the narrowest command instead.

The official U-Boot usage index lists the relevant topics, including Booting from TPL/SPL, Environment Variables, Device Tree Overlays, Flat Image Tree (FIT), Command-line Parsing, and Measured Boot (https://docs.u-boot-project.org/en/stable/usage/index.html, clef weight: 0.8636); the v2023.10 index lists the same core set (https://docs.u-boot-project.org/en/v2023.10/usage/index.html, clef weight: 0.7677).

## 5. The 3 commands the source names

| Command | What it answers | Backing |
|---|---|---|
| `dm tree` | Which devices driver model bound and probed, by uclass | Ground source; nexembedinnovation describes `dm tree` as "list probed devices and uclasses" (https://nexembedinnovation.com/2025/07/12/bootloaders-explained-u-boot-internals-and-customization/, clef weight: 0.1685) (weak backing, clef weight < 0.5) |
| `bdinfo` | Board info, including where U-Boot's device tree lives | Official `bdinfo` docs list fields `fdt_blob` ("address of U-Boot's own device tree, NULL if none"), `new_fdt` (relocated device tree location), `fdt_size`, `lmb_dump_all` (memory reservations), and `devicetree` (source of the device tree) (https://docs.u-boot.org/en/v2023.04/usage/cmd/bdinfo.html, clef weight: 0.8831) |
| `fdt addr <addr>` then `fdt print /firmware` | The live `/firmware` node: where OP-TEE and related secure-world nodes appear | Ground source; nexembedinnovation pairs `bdinfo, fdt addr, fdt print` to "inspect memory map and live devicetree" (same URL, clef weight: 0.1685) (weak backing, clef weight < 0.5) |

The intended sequence: run `bdinfo`, read the `fdt_blob` or `new_fdt` address, pass that address to `fdt addr`, then `fdt print /firmware`. That inspects the device tree U-Boot actually uses on this board, which is the evidence needed when TEE or TPM init fails (see doc 06 on why QEMU cannot stand in for this).

The same nexembedinnovation article also lists `crc32 ${loadaddr} ${filesize}` to verify payload integrity and `env default -a` to recover from a corrupted environment (clef weight: 0.1685) (weak backing, clef weight < 0.5). These are not in the ground source; treat them as optional.

## 6. Loop discipline

1. Ask for one command at a time; each pasted output informs the next.
2. Anchor on "Trying to boot from MMC2" before analyzing anything later.
3. A DT or TF-A problem found here is fixed in the firmware build, reflashed via docs 02 to 04, and retested on the board.

## Sources Considered

| # | URL | Clef weight | Backing |
|---|---|---|---|
| 1 | https://docs.u-boot.org/en/v2023.04/usage/cmd/bdinfo.html | 0.8831 | authoritative |
| 2 | https://docs.u-boot-project.org/en/stable/usage/index.html | 0.8636 | authoritative |
| 3 | https://docs.u-boot-project.org/en/v2023.10/usage/index.html | 0.7677 | authoritative |
| 4 | https://github.com/VaillerTeeter/Rockchip-RK3588-u-boot/blob/next-dev/doc/README.console | 0.5450 | authoritative |
| 5 | https://wiki.gentoo.org/wiki/User:Brendlefly62/Rockchip_RK3588S_Rock_5c/Build-Install-U-Boot | 0.2750 | weak backing, clef weight < 0.5 |
| 6 | https://wiki.neardi.net/docs/Linux-system-manual/common/hardware/uart-configuration/ | 0.2468 | weak backing, clef weight < 0.5 |
| 7 | https://wiki.t-firefly.com/en/Core-3588J/debug.html | 0.1951 | weak backing, clef weight < 0.5 |
| 8 | https://nexembedinnovation.com/2025/07/12/bootloaders-explained-u-boot-internals-and-customization/ | 0.1685 | weak backing, clef weight < 0.5 |
| 9 | https://www.youtube.com/ | 0.0360 | weak backing, clef weight < 0.5 (off-topic, not cited) |
| 10 | https://www.rock-chips.com/a/en/ | 0.0257 | weak backing, clef weight < 0.5 (corporate landing page, not cited) |
