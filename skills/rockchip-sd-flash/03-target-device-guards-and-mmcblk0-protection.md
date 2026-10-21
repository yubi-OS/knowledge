# 03: Target Device Guards and mmcblk0 Protection

**Scope:** Pre-write guards on `/dev/mmcblk1` (expected ~59.5G size, 0 mounts, exact 512-byte sector multiple, `ABORT_*` markers) and never touching rock1's OS eMMC (`/dev/mmcblk0`).

**Ground source:** `yubi-OS/yubiOS skills/rockchip-sd-flash/SKILL.md`.

> Internal-record subtopic grounded in yubi-OS/yubiOS skills/rockchip-sd-flash/SKILL.md, no external web dig.

Every claim below comes from the ground source (procedure step 3, procedure step 7, and the Guidelines section) unless explicitly marked as an inference.

## 1. The 2 block devices on rock1

rock1 is a Pine64 RockPro64 v2.1 (RK3399). It exposes 2 MMC block devices that matter here:

| Device | Role | Write policy |
|---|---|---|
| `/dev/mmcblk0` | rock1's eMMC, the **OS disk** | Never write. Hard rule. |
| `/dev/mmcblk1` | SD slot, ~59.5G, a **carrier** for other boards' loader cards | The only permitted dd target |

The device names differ by one digit. That single-character distance is the core hazard the guards exist to contain: a typo or a stale variable turns a loader flash into overwriting the running OS from sector 64 onward.

## 2. The 3 guards

The ground source requires 3 checks, and requires them in **the same bridge call as the write**, not in a separate preceding call:

1. **Size guard.** `lsblk -dn -o SIZE /dev/mmcblk1` must equal the expected card size (~59.5G for the current card). A different size means a different card, a missing card, or the wrong device.
2. **Mount guard.** The mountpoint count on the target must be 0. A mounted target means something on rock1 is actively using it; writing raw sectors under a live filesystem corrupts both.
3. **Sector-multiple guard.** The byte count must be an exact sector multiple: `CNT * 512 == BYTES`, where `BYTES` is the size of the verified `u-boot-rockchip.bin` (doc 02) and `CNT` is its sector count. This keeps the write and the readback window (doc 04) aligned on the same boundary.

On any failure the call **aborts with a named `ABORT_*` marker** before `dd` runs.

## 3. Why same-call, not a prior check

If the guards ran in one bridge call and dd in the next, the device state could change between them (card swapped, automounter fires, a reconnect renumbers devices). Running guard and write in one shell invocation shrinks that window to the gap between consecutive commands in the same script. (Inference: this is a standard time-of-check vs time-of-use argument; the source states the same-call rule without naming it.)

An illustrative shape of the combined call (structure derived from the source rules; marker names beyond the `ABORT_*` prefix are illustrative):

```sh
set -eu
DEV=/dev/mmcblk1
BIN=<dir>/u-boot-rockchip.bin
BYTES=$(stat -c %s "$BIN"); CNT=$(( BYTES / 512 ))
[ "$(lsblk -dn -o SIZE $DEV)" = "59.5G" ] || { echo ABORT_SIZE; exit 1; }
[ "$(lsblk -n -o MOUNTPOINT $DEV | grep -c .)" -eq 0 ] || { echo ABORT_MOUNTED; exit 1; }
[ $(( CNT * 512 )) -eq "$BYTES" ] || { echo ABORT_NOT_SECTOR_MULTIPLE; exit 1; }
# write and readback follow in this same call (doc 04)
```

Named markers matter because the agent reads bridge output, not exit codes alone: `ABORT_SIZE` vs `ABORT_MOUNTED` tells the operator exactly which invariant broke without a second diagnostic round trip.

## 4. Never relax a guard

The Guidelines are explicit: **a guard failure aborts the write before dd runs; never relax the guard to make a write go through.** If the size guard fails, the correct response is to find out why the card reports a different size (wrong card, card not seated, different capacity), then update the expected value deliberately with that evidence, not to loosen the comparison or drop the check.

## 5. What the guards deliberately do NOT check

Procedure step 7: **erased or dirty cards are fine.** The write targets sectors 64 and up, and the Rockchip BootROM only reads from sector 64 (doc 01). Leftover data elsewhere on the card does not affect boot. So there is no "card must be blank" guard, and no partition-table check; only that the card still reports its expected size.

Example from the source: "the card is erased" is answered with "no problem; re-check size and write as normal."

## 6. Interaction with other rules

- **Destructive-op preflight:** the exact dd command is echoed in chat before sending (doc 04). The guards are the machine check; the echo is the human check.
- **Proxy-cut reconciliation:** if the guarded write call returns a network error, it may have executed. Check box-side state before re-sending (doc 06).

## Sources Considered

| # | Source | Type | Weight |
|---|---|---|---|
| 1 | `yubi-OS/yubiOS skills/rockchip-sd-flash/SKILL.md` (step 3, step 7, Guidelines) | Internal record, validated 2026-10-10/11 | n/a (no external web dig) |
