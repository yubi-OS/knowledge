# skills/rockchip-sd-flash: Flashing Rockchip U-Boot Loaders to SD Cards via rock1

A knowledge corpus on the yubiOS `rockchip-sd-flash` skill: writing a Rockchip U-Boot loader (`u-boot-rockchip.bin`) to an SD card in rock1's slot (Pine64 RockPro64 v2.1, RK3399) for ROCK 5B (RK3588) and PineTab2 (RK3566) boards. Covers the sector-64 layout, digest-pinned on-device sourcing, target guards, the dd write plus readback, the board-side UART loop, and the QEMU and proxy-cut guidelines.

**Ground source:** `yubi-OS/yubiOS skills/rockchip-sd-flash/SKILL.md` (procedure validated 2026-10-10/11, 3 verified writes).

## Documents

Scores are the Clef `score` metric from `research-db/outline.json` (0 = padding, 1 = marginal, 2 = load-bearing). No subtopic was dropped.

| NN | Doc | Scope | Score | Grounding |
|---|---|---|---|---|
| 01 | [01-rockchip-bootrom-sector-64-and-fit-offset-layout.md](01-rockchip-bootrom-sector-64-and-fit-offset-layout.md) | Why the bin writes at sector 64: idbloader (RKNS magic) at offset 0, `u-boot.itb` at byte 8,355,840 (sector 16384), vs the SPI NOR layout | 1.3915 | Ground source + Clef-weighted dig |
| 02 | [02-on-device-digest-pinned-podman-extraction-and-sha256.md](02-on-device-digest-pinned-podman-extraction-and-sha256.md) | Sourcing the bin on rock1 via digest-pinned `podman pull` + `podman export`, then sha256 cross-check against the CI artifact | 1.3754 | Internal record, no dig |
| 03 | [03-target-device-guards-and-mmcblk0-protection.md](03-target-device-guards-and-mmcblk0-protection.md) | Same-call guards on `/dev/mmcblk1` (size, 0 mounts, sector multiple, `ABORT_*` markers); never touch `/dev/mmcblk0` | 1.7882 | Internal record, no dig |
| 04 | [04-sector-64-dd-write-and-readback-verification.md](04-sector-64-dd-write-and-readback-verification.md) | Chat echo preflight, `/dev/ttyS2` banner, `conv=fsync,notrunc` dd at `seek=64`, exact byte-count readback sha256 | 1.8686 | Ground source + Clef-weighted dig |
| 05 | [05-board-side-uart-loop-and-u-boot-shell-commands.md](05-board-side-uart-loop-and-u-boot-shell-commands.md) | Booting the target from MMC2, the 1500000-baud UART console, pipe-free U-Boot commands (`dm tree`, `bdinfo`, `fdt addr`/`fdt print`) | 1.5221 | Ground source + Clef-weighted dig |
| 06 | [06-qemu-virt-dt-divergence-and-proxy-cut-reconciliation.md](06-qemu-virt-dt-divergence-and-proxy-cut-reconciliation.md) | Why QEMU `virt,secure=on` cannot reproduce board DT failures; reconciling proxy-cut bridge calls before retrying | 0.4626 | Internal record, no dig |

## Research Summary

| Metric | Value |
|---|---|
| Results collected | 30 (10 per dug subtopic: 01, 04, 05) |
| High weight (`>= 0.5`) | 5 |
| Low weight (`< 0.5`) | 25 |
| jev requests | 7 |
| Redos | 0 |
| Skips | 0 |
| Outline metric | Clef `score` (padding / marginal / load-bearing), 0 dropped, 6 kept |
| Source weighting metric | Clef `noul` (true = primary / authoritative source) |

Weight distribution by subtopic:

- **01:** 1 high (rock-chip.com/guides, 0.7299), 9 low.
- **04:** 0 high, 10 low. The dd and readback procedure rests on the ground source; external sources only corroborate the general hash-after-dd pattern.
- **05:** 4 high (U-Boot `bdinfo` docs 0.8831, U-Boot usage index stable 0.8636 and v2023.10 0.7677, RK3588 U-Boot `README.console` 0.5450), 6 low.

Every cited source with weight `< 0.5` is labeled `(weak backing, clef weight < 0.5)` in its doc. Subtopics 02, 03, and 06 are internal-record subtopics grounded in `yubi-OS/yubiOS skills/rockchip-sd-flash/SKILL.md`, with no external web dig by design.

## Gaps

- No high-weight external source states the sector-64 / sector-16384 numbers directly (doc 01); they rest on the ground source with weak-backing corroboration.
- The "RKNS at 0x8000" SPI NOR claim has no external backing in the dig.
- Doc 04 has no high-weight external source.
- Doc 06 scored below 1 (marginal-to-padding) but was kept; it records 2 guidelines adjacent to the procedure.

## Preflight

Preflight 2026-10-21: searXNG 59 results healthy; /api/decide (clef) 200

## Research DB

See `research-db/` for `preflight.json`, `outline.json`, `archive.json`, `digs/`, `jev-log.json`, and `db.ts`.
