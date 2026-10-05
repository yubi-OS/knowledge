# Knowledge corpus: bootc-upgrade-rollback-sysext-portable-test-spec

VM test spec for bootc lifecycle operations: bootc upgrade and rollback with diff checks, sysext attach and detach cycles, and portable service activation tests. Minted 2026-10-05 from `yubi-OS/yubiOS refs/bootc-upgrade-rollback-sysext-portable-test-spec-2026-08-04.md` (the OMN-156 test spec).

## Documents

| NN | Doc | Scope |
| --- | --- | --- |
| 01 | [01-bootc-upgrade-semantics.md](01-bootc-upgrade-semantics.md) | bootc upgrade staging semantics: --download-only staging, bootc status fields, applying a staged upgrade, and the reboot-discards-stage behavior |
| 02 | [02-bootc-rollback-boot-assessment.md](02-bootc-rollback-boot-assessment.md) | bootc rollback and systemd automatic boot assessment: boot counting on failed boots, bootloader fallback, and the /etc consequence of rollback |
| 03 | [03-sysext-overlay-usr.md](03-sysext-overlay-usr.md) | systemd-sysext merging extension images onto /usr via overlayfs: refresh, list, merge and unmerge lifecycles, image placement |
| 04 | [04-portable-services-portablectl.md](04-portable-services-portablectl.md) | portable services: portablectl attach, detach, list and reattach, the RootImage= unit wiring, and image format expectations |
| 06 | [06-bcvk-ephemeral-vm-harness.md](06-bcvk-ephemeral-vm-harness.md) | bcvk ephemeral VMs as a CI test harness: podman wrapped QEMU, run/stop/rm lifecycle, port forwarding, teardown discipline |
| 07 | [07-ci-vm-workflow-integration.md](07-ci-vm-workflow-integration.md) | GitHub Actions lanes for VM tests: workflow_dispatch inputs, amd64 + arm64 matrix, shellcheck gates, artifact upload, orchestrator routing |
| 08 | [08-negative-test-failure-injection.md](08-negative-test-failure-injection.md) | negative path test design: corrupt image rejection, the signed-sysext missing-key boot hang, bad deployment injection, sandbox deny probes |

## Research summary

- Results collected: 83 archive entries (77 from the initial dig of 7 kept subtopics, 6 added by the doc 08 redo).
- Weight split: 45 high (w >= 0.5), 38 low (w < 0.5), 0 unresolved. Low-weight claims are labeled in the doc text.
- Jev (clef) requests: 20, usage 14724 input / 0 output tokens.
- Redos: 1 (doc 08 negative-test-failure-injection: original queries returned off-topic results, redone with different queries, up-weighted).
- Skipped docs: none, but 1 outline subtopic was dropped at validation: 05-homed-luks2-fido2 scored 0.0714 on the score metric (94.9% probability on "padding: drop"), so no doc was authored for it. The homed FIDO2 surface is partially covered inside doc 08's scope only where the dig supported it.

Preflight 2026-10-05: searXNG healthy (probe 55 results on a live query); /api/decide (clef) 200. Probe numbers recorded in research-db/preflight.json.
