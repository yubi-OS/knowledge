# 06: QEMU virt DT Divergence and Proxy-Cut Reconciliation

**Scope:** Why QEMU `virt,secure=on` cannot reproduce board-specific OP-TEE/fTPM device-tree failures, and reconciling proxy-cut bridge calls before retrying.

**Ground source:** `yubi-OS/yubiOS skills/rockchip-sd-flash/SKILL.md`.

> Internal-record subtopic grounded in yubi-OS/yubiOS skills/rockchip-sd-flash/SKILL.md, no external web dig.

The outline validation scored this subtopic 0.4626 (probabilities: padding 0.5901, marginal 0.3572, load-bearing 0.0527). It was kept, not dropped, but it is the weakest doc in the corpus: 2 guidelines that sit beside the flash procedure rather than inside it. Every claim below comes from the ground source Guidelines section unless explicitly marked as an inference.

## Part A: QEMU virt reproduces nothing board-specific

### A1. The rule

The ground source states: **QEMU (`virt,secure=on`) reproduces nothing board-specific.** QEMU generates its own device tree with an OP-TEE node. A board that fails TEE or TPM init needs DT or TF-A fixes, not a QEMU repro.

### A2. Why the divergence is structural

On the real board, the device tree U-Boot and Linux see comes from the loader written to the card: the FDT is packed into `u-boot.itb` alongside BL31, the TEE, and U-Boot proper (doc 01). Whether OP-TEE is described correctly under `/firmware`, and whether an fTPM depends on it, is a property of that board-specific FDT plus TF-A's handoff.

Under QEMU `virt,secure=on`, the machine model synthesizes its own device tree, and that DT already contains an OP-TEE node. So:

- A missing or malformed `/firmware` OP-TEE node in the board FDT is **invisible** in QEMU, because QEMU supplies its own correct one.
- A TF-A or secure-world handoff bug specific to the RK3588 or RK3566 platform port is **not exercised**, because QEMU runs a different platform.
- A QEMU boot that reaches a working TEE therefore proves only that the generic stack works on QEMU's machine, which says nothing about the board. (Inference from the rule above.)

### A3. What to do instead

When TEE or TPM init fails on a target board:

1. Use the board-side UART loop (doc 05): `bdinfo` to locate the live FDT, `fdt addr <addr>`, then `fdt print /firmware`, and compare against what the board port should describe.
2. Fix the DT source or TF-A configuration in the firmware build.
3. Rebuild through CI, then reflash via docs 02 to 04 (digest pull, sha256 match, guards, sector-64 write, readback).
4. Retest on the board.

QEMU remains useful for generic regressions unrelated to the board (inference; the source only rules it out for board-specific failures).

## Part B: Proxy-cut reconciliation

### B1. The rule

The ground source states: **a bridge call that returns a network error may still have executed.** Check box-side state (processes, logs) before re-sending. This is the RULES proxy-cut reconciliation discipline.

### B2. Why it matters here

The rock1 shell bridge is an HTTP hop. A network error tells you the response did not arrive; it does not tell you whether the command ran. For this skill, blind retries are risky:

| Step | If it ran and you resend blindly |
|---|---|
| `podman pull` (doc 02) | Harmless but wastes time; another pull eats rock1's small root fs (~100MB each per the source) |
| `podman create --name fw` (doc 02) | Fails on a name collision with the existing `fw` container |
| Guarded dd write (docs 03 and 04) | Rewrites the same bytes to sectors 64+; the danger is not the duplicate itself but losing track of which bin was written and whether a readback ever confirmed it |

(The per-step consequences are inferences from the commands in the ground source.)

### B3. What to check before resending

Following the source's "processes, logs" instruction, on rock1:

1. **Processes:** is a `podman` or `dd` process still running? If so, wait; do not start a second one against the same target.
2. **Logs and banners:** the `/dev/ttyS2` banner echoed before a write (doc 04) is a box-side record that the destructive step began.
3. **Artifacts:** does `<dir>/u-boot-rockchip.bin` exist, and does its sha256 match the CI artifact hash? Does container `fw` exist?
4. **Card state:** run the readback alone (doc 04 step 6). If the readback hash already equals the CI artifact hash, the write landed; report it and stop. Do not rewrite.

Only after reconciling do you resend, and then only the steps that verifiably did not complete.

### B4. Combined with the guards

The guards in doc 03 run in the same call as the write, so a resent guarded write re-checks size, mount count, and sector multiple before dd. Reconciliation is still required: guards prevent writing to the wrong target, not losing track of what was already written.

## Gaps

No external sources were dug for this subtopic by design. The QEMU-generated-DT claim and the proxy-cut rule both rest solely on the ground source.

## Sources Considered

| # | Source | Type | Weight |
|---|---|---|---|
| 1 | `yubi-OS/yubiOS skills/rockchip-sd-flash/SKILL.md` (Guidelines) | Internal record, validated 2026-10-10/11 | n/a (no external web dig) |
