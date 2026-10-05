# kvm-arm-nested-virtualization

Knowledge corpus on KVM-on-ARM nested virtualization: verification and enablement of `kvm_arm=nested` on ARM64 hosts, its status, and how to test it. Minted 2026-10-05 from yubi-OS/yubiOS `refs/kvm-arm-nested-virtualization-2026-08-07.md`.

## Documents

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-interface-history.md](01-interface-history.md) | The three nested-virt selection mechanisms in ARM KVM history and why the old sysfs/module-parameter path is stale. |
| 02 | [02-kvm-arm-mode.md](02-kvm-arm-mode.md) | The kvm-arm.mode tri-state (nvhe, protected, nested), mutual exclusivity, and upstream documentation. |
| 03 | [03-feat-nv-feat-nv2-hardware.md](03-feat-nv-feat-nv2-hardware.md) | FEAT_NV vs FEAT_NV2 and the hardware matrix, with honest confidence labels per silicon. |
| 04 | [04-verify-host.md](04-verify-host.md) | Verifying nested KVM state on a running ARM64 host: cmdline, dmesg, and the limits of module checks. |
| 05 | [05-enable-cmdline.md](05-enable-cmdline.md) | Enabling kvm-arm.mode=nested via the kernel command line; why the modprobe recipe is not the ARM path. |
| 06 | [06-nested-qemu-guest.md](06-nested-qemu-guest.md) | Running nested guests with qemu-system-aarch64: the layer model, guest CPU model, and ID-register masking. |
| 07 | [07-internals-vncr.md](07-internals-vncr.md) | Internals: VNCR_EL2, shadow stage-2, the bi-annual series drops, and feature gating. |
| 08 | [08-ci-testing-drift.md](08-ci-testing-drift.md) | Nested KVM in CI: host matrix, fail-closed test design, security notes, and upstream drift surfaces. |

## Research summary

- Results collected: 104 (kept top 6 per query, 2 queries per subtopic, deduplicated per subtopic)
- Weight split: high (>= 0.5) 54, low (< 0.5) 50, unweighted 0
- Jev requests: 28 (1 preflight probe, 1 outline validation, 26 weighting batches), usage 18976 input / 0 output tokens
- Redo digs: 2 (04-verify-host and 05-enable-cmdline, 1 redo each, with different queries)
- Skipped docs: none; all 8 subtopics authored. Docs 04 and 05 had first-pass digs with ARM-specific claims backed only by low-weight sources and were re-dug before authoring.

Outline validation (jev score metric, lowest-first): scores 01: 0.557 (marginal, kept: dig strong), 02: 1.115, 03: 1.702, 04: 1.892, 05: 1.718, 06: 1.666, 07: 0.779, 08: 0.757. Dropped: none.

Weak-backing claims are labeled in text per the weight rule (weight < 0.5 is cited as weak).

## Research DB

`research-db/` holds preflight.json, outline.json, archive.json (one entry per collected result with its full noul decision record), digs/<NN>-<slug>.json (per-doc dig records with redo logs), jev-log.json (one entry per jev HTTP request), and db.ts (TypeScript interfaces). Usage tokens in archive.json decision records are per-batch usage divided evenly across the batch, because the decide API reports usage at request granularity.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
