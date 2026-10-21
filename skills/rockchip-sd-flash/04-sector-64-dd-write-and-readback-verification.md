# 04: Sector-64 dd Write and Readback Verification

**Scope:** Destructive-op preflight chat echo, `/dev/ttyS2` banner tee, `conv=fsync,notrunc` dd at `seek=64`, and exact byte-count readback sha256 verification.

**Ground source:** `yubi-OS/yubiOS skills/rockchip-sd-flash/SKILL.md` (procedure steps 4 to 7, validated 2026-10-10/11 across 3 verified writes). External claims come from the Clef-weighted searXNG dig in `dig_context_04.json`. Note: **every result in this dig scored below 0.5**, so all external material here is weak backing; the procedure itself rests on the ground source.

## 1. Preflight: 2 echoes before the write

Ground source step 4 requires 2 announcements before dd runs:

1. **Echo the exact dd command in chat before sending it.** This is the RULES destructive-op preflight: the human sees the literal device path and offset before anything irreversible happens. It is the human counterpart to the machine guards in doc 03.
2. **Echo a banner to `/dev/ttyS2` first**, per the bridge debug rule. rock1's UART carries a live record that a destructive operation started, which survives even if the bridge call itself is cut mid-flight (useful for doc 06 reconciliation).

## 2. The write

Ground source step 5, verbatim:

```sh
sudo dd if=<bin> of=/dev/mmcblk1 bs=512 seek=64 conv=fsync,notrunc status=none; sync
```

Flag by flag:

- **`bs=512 seek=64`**: `seek` counts output blocks of size `bs`, so the write starts at byte 64 x 512 = 32,768, which is sector 64, the Rockchip BootROM load address (doc 01). A FreeBSD forum thread on flashing U-Boot with dd shows this exact confusion in practice ("So 'seek=' is where to begin writing on the disk with dd? That is in bytes? What is the bs=512 doing here?") (https://forums.freebsd.org/threads/u-boot-flash-with-dd.86776/, clef weight: 0.0558) (weak backing, clef weight < 0.5). The answer: not bytes; blocks of `bs` bytes.
- **`conv=fsync`**: dd fsyncs the output before exiting, so a clean exit means data reached the device, not just the page cache.
- **`conv=notrunc`**: do not truncate the output. On a block device truncation is not meaningful, but the flag keeps the command safe if `of=` ever points at an image file instead of a device.
- **`status=none`**: suppresses transfer statistics so the bridge output carries only guard markers and hashes.
- **trailing `sync`**: a belt-and-braces flush of any remaining dirty buffers.

General dd semantics (block-oriented read/write/convert) are summarized by Wikipedia's dd article (https://en.m.wikipedia.org/wiki/Dd_%28Unix%29, clef weight: 0.1584) (weak backing, clef weight < 0.5). Pre-built Rockchip loader distributions such as schneid-l/u-boot-rockchip ship signed `u-boot-rockchip` binaries for 120 mainline-supported Rockchip ARM64 boards, built reproducibly from upstream sources (https://github.com/schneid-l/u-boot-rockchip, clef weight: 0.2964) (weak backing, clef weight < 0.5); yubiOS instead sources its bin from its own CI by digest (doc 02).

## 3. Readback verification

Ground source step 6:

```sh
sudo dd if=/dev/mmcblk1 bs=512 skip=64 count=$CNT status=none | head -c $BYTES | sha256sum
```

- **`skip=64`** mirrors `seek=64`: it skips input blocks, reading from the same sector the write started at.
- **`count=$CNT`** reads exactly the sector count of the bin (`CNT = BYTES / 512`, guaranteed integral by the doc 03 sector-multiple guard).
- **`head -c $BYTES`** trims to the exact file length. With the sector-multiple guard this is a no-op, but it keeps the hash window correct if that invariant ever changes.
- The result **must equal the CI artifact hash** established in doc 02. Report both hashes.

The general pattern (hash the source, hash the written device region, compare) is common in imaging and forensics:

- tekk/boot-image-verifier: "Verify that an ISO file written with `dd` matches the block device segment" (https://github.com/tekk/boot-image-verifier, clef weight: 0.2386) (weak backing, clef weight < 0.5).
- A Claw GRC acquisition guide pairs dd/dcfldd with dual MD5 and SHA-256 hashing and software write-blocking via `blockdev --setro` (https://clawgrc.com/skills/acquiring-disk-image-with-dd-and-dcfldd, clef weight: 0.3595) (weak backing, clef weight < 0.5).
- Thonykay1/USB-image-and-hash-verification demonstrates dd acquisition plus SHA-256 integrity verification (https://github.com/Thonykay1/USB-image-and-hash-verification, clef weight: 0.1732) (weak backing, clef weight < 0.5).
- A Unix & Linux Stack Exchange answer claims "Usually when you dd, it is always perfect" but still recommends hashing original and copy (https://unix.stackexchange.com/questions/45817/how-to-check-integrity-of-a-dd-backup, clef weight: 0.0803) (weak backing, clef weight < 0.5). yubiOS does not accept "usually": the readback hash is mandatory.

## 4. Erased or dirty cards

Ground source step 7: erased or dirty cards are fine. The write covers sectors 64 onward and the BootROM only reads from sector 64; check only that the card still reports its expected size (doc 03).

## 5. Why the readback is not optional

`conv=fsync` proves the kernel accepted and flushed the write; it does not prove the card stored the right bytes at the right offset. A wrong `seek`, a failing card, or a wrong source file all pass dd silently. Only the readback hash, compared to the independently-derived CI artifact hash, closes that loop.

## Gaps

No result at weight >= 0.5 for this subtopic. The `conv=fsync,notrunc` semantics and the readback procedure are carried by the ground source; external sources only corroborate the general hash-after-dd pattern.

## Sources Considered

| # | URL | Clef weight | Backing |
|---|---|---|---|
| 1 | https://clawgrc.com/skills/acquiring-disk-image-with-dd-and-dcfldd | 0.3595 | weak backing, clef weight < 0.5 |
| 2 | https://github.com/schneid-l/u-boot-rockchip | 0.2964 | weak backing, clef weight < 0.5 |
| 3 | https://github.com/tekk/boot-image-verifier | 0.2386 | weak backing, clef weight < 0.5 |
| 4 | https://rock-chip.com/cheatsheet | 0.2115 | weak backing, clef weight < 0.5 (not cited) |
| 5 | https://github.com/Thonykay1/USB-image-and-hash-verification | 0.1732 | weak backing, clef weight < 0.5 |
| 6 | https://en.m.wikipedia.org/wiki/Dd_%28Unix%29 | 0.1584 | weak backing, clef weight < 0.5 |
| 7 | https://archlinuxarm.org/platforms/armv8/rockchip/odroid-m1 | 0.1359 | weak backing, clef weight < 0.5 (not cited) |
| 8 | https://unix.stackexchange.com/questions/45817/how-to-check-integrity-of-a-dd-backup | 0.0803 | weak backing, clef weight < 0.5 |
| 9 | https://forums.freebsd.org/threads/u-boot-flash-with-dd.86776/ | 0.0558 | weak backing, clef weight < 0.5 |
| 10 | https://bugzilla.redhat.com/show_bug.cgi?id=2104746 | 0.0255 | weak backing, clef weight < 0.5 (off-topic, not cited) |
