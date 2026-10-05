# 02: bootc rollback and automatic boot assessment

Scope: bootc rollback and systemd automatic boot assessment: A/B deployment layout, boot counting on failed boots, and bootloader fallback to the previous deployment.

## Boot counting: how the fallback mechanism works

systemd provides support for automatically reverting to the previous version of the OS or kernel when the system consistently fails to boot. The UAPI.1 Boot Loader Specification describes how to annotate boot loader entries with a counter that specifies how many attempts should be made to boot the entry [1]. The systemd-boot loader maintains a per entry counter that is decreased by one on each attempt to boot the entry, and prioritizes entries with non zero counters over those that already reached zero when choosing which entry to boot [2].

When a boot succeeds, `systemd-bless-boot.service` automatically marks the boot loader entry, for which boot counting is enabled, as good, which turns off boot counting for it [3] [4]. So the full loop is: boot attempt decrements the counter, a successful boot is blessed and stops counting, and an entry whose counter reaches 0 is deprioritized in favor of the previous entry [1] [2]. That loop is the mechanism a negative upgrade test targets: a deliberately bad deployment must exhaust its counter and lose the boot selection to the previous deployment.

## What bootc rollback does

`bootc rollback` is the explicit, operator driven counterpart to the automatic assessment. There is a `bootc rollback` verb, and an associated declarative interface accessible to tools via `bootc edit`; it swaps the bootloader ordering to the previous boot entry [5].

Two properties from the bootc rollback man page are directly testable and directly surprising:

1. Rollback reorders existing deployments. It does not create new deployments [6].
2. Any changes made to files in /etc do not carry over to the rolled back deployment. The /etc files revert to their state from that previous deployment instead, because rollback just reorders the existing deployments and /etc merges happen only when new deployments are created [7] [6] (the upstream doc source carries the same wording, w=0.93) [8].

A rollback test therefore asserts both the bootc status outcome (previous deployment now booted) and the /etc consequence (state reverts, not preserved).

## Deployment layout after one upgrade

The A/B shape a test can assert on is the deployment list: after a first successful upgrade from a base image, the system has the previous deployment and the new deployment, and the booted one is the new one [9] (weak backing, w=0.14, image management internals). The explicit rollback verb then flips the ordering back to the previous entry [5], which is the same ordering swap the automatic boot assessment performs when it demotes a failed entry.

## Auto-update context

By default, Fedora and CentOS bootc systems perform continual auto updates via a stock copy of the upstream `bootc-fetch-apply-updates.timer` and the corresponding `bootc-fetch-apply-updates.service` [10]. A VM test that wants deterministic upgrade behavior must account for that timer running concurrently with the test's manual upgrade commands.

## Test design implications

1. Negative path: to prove the fallback fires, break the new deployment so it fails at sysinit, then reboot repeatedly. The counter on the failing entry decrements per attempt [1] [2]; the test asserts the bootloader reverts to the previous deployment once the counter is exhausted.
2. Explicit path: `bootc rollback` swaps the ordering to the previous boot entry [5]. The test asserts the booted image matches the previous deployment.
3. Both paths should assert the deployment count stayed at the expected number, since rollback does not create deployments [6].

## Sources

1. https://github.com/systemd/systemd/blob/main/docs/AUTOMATIC_BOOT_ASSESSMENT.md (w=0.79)
2. https://chromium.googlesource.com/chromiumos/third_party/systemd/+/refs/heads/chromeos-v247/docs/AUTOMATIC_BOOT_ASSESSMENT.md (w=0.71)
3. https://systemd.io/AUTOMATIC_BOOT_ASSESSMENT/ (w=0.60)
4. https://src.rivoreo.one/systemd-stable/+/main/docs/AUTOMATIC_BOOT_ASSESSMENT.md (w=0.61)
5. https://jmarrero.github.io/bootc/upgrades.html (w=0.87)
6. https://bootc.dev/bootc/man/bootc-rollback.8.html (w=0.83)
7. https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-rollback.8.md (w=0.93)
8. https://www.mankier.com/8/bootc-rollback (w=0.05, weak)
9. https://deepwiki.com/bootc-dev/bootc/2.4-image-management (w=0.14, weak)
10. https://docs.fedoraproject.org/en-US/bootc/auto-updates/ (w=0.86)
