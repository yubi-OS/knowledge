# 06 - Firmware reproducibility gates

Scope: reproducibility controls and equality gates for firmware components, covering U-Boot, EDK2, TF-A, and OP-TEE, including what enters the byte-equality claim and what stays outside.

## The general principle, applied to firmware

Reproducible builds are a set of software development practices that create an independently verifiable path from source to binary code (weight 0.97, https://reproducible-builds.org/). For firmware that path matters more than almost anywhere else, because the binary boots the machine before any OS-level verification exists.

## U-Boot: the documented model

U-Boot documents its approach directly: in order to achieve reproducible builds, timestamps used in the U-Boot build process have to be set to a fixed value, done using the SOURCE_DATE_EPOCH environment variable, which specifies the number of seconds since 1970-01-01T00:00:00Z (weight 0.78, https://docs.u-boot-project.org/en/latest/build/reproducible.html; same content in the repository source at weight 0.88, https://github.com/u-boot/u-boot/blob/master/doc/build/reproducible.rst, and the stable docs source at weight 0.88, https://docs.u-boot.org/en/stable/_sources/build/reproducible.rst.txt). The docs include a concrete example: to build the sandbox with 2023-01-01T00:00:00Z as the timestamp, the variable is set to that moment's epoch value. This is exactly the commit-derived identity pattern from doc 01, applied to a bootloader: the epoch is the single knob the whole build consumes.

## EDK2

EDK II is the reference development environment for the UEFI and PI specifications, a modern, feature-rich, cross-platform firmware development environment (weight 0.53, https://github.com/tianocore/edk2). The dig did not surface EDK2 determinism documentation directly, so EDK2-specific build flags are not independently verified here. The yubiOS refs doc states that the commit epoch reaches EDK2, that EDK2 receives commit- and platform-scoped deterministic stack-cookie lists, and that prepared payload metadata is normalized and checksummed (per the yubiOS refs doc, 2026-07-22). Those mechanisms follow the same shape as the U-Boot control: a revision-derived value replaces every per-run random or time-derived input.

## TF-A and OP-TEE

The yubiOS refs doc records that the commit epoch reaches OP-TEE and U-Boot, while TF-A receives an explicit timestamp and build string (per the yubiOS refs doc, 2026-07-22; not independently verified in this dig). The distinction is instructive: different firmware components expose different levers, and the contract must name the specific knob for each rather than assuming one environment variable propagates everywhere.

## The gate: a second clean build per board

The yubiOS firmware workflow runs a second clean ARM64 StandaloneMM and per-board build, blocks on exact unsigned-component equality, and retains one JSON report per board for 30 days (per the yubiOS refs doc, 2026-07-22). Structurally this is the two-build verification from doc 03 moved down the stack: separate clean builds of the same revision, comparison as a blocking CI condition, JSON evidence as the artifact. The comparison subject is the unsigned components: the gate compares StandaloneMM, OP-TEE/fTPM, and U-Boot subjects exactly while recording both TF-A envelopes and their digests (per the yubiOS refs doc, 2026-07-22).

## Explicit boundaries

Two boundaries are recorded rather than hidden. First, QEMU TF-A uses CREATE_KEYS=1, so certificate serials, validity periods, RSA-PSS signatures, and key-bound TF-A envelope bytes vary between builds; a public fixed test fixture or a split unsigned TF-A subject is still required before the complete QEMU FIP or flash bytes can enter the equality claim (per the yubiOS refs doc, 2026-07-22). Second, RK3588 source-derived StandaloneMM, OP-TEE/fTPM, TF-A BL31, and U-Boot components do enter reproducibility evidence, but the final bootable Rockchip image cannot enter the claim until the external DDR/TPL blob has an approved immutable digest in the pinned-digests document (per the yubiOS refs doc, 2026-07-22).

The boundary discipline is the transferable lesson. A firmware reproducibility gate that compares every byte will fail on key-bound material; a gate that compares nothing proves nothing. The workable middle is what this corpus's pattern shows: name the unsigned equality subjects exactly, record the signed or random-bound bytes with their digests, and state publicly which boundary still blocks the full-image claim.
