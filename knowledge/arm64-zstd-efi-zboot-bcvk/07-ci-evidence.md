# 07: CI evidence: what the workaround proved on the ARM64 lane

Scope: the concrete CI run that validated the pinned QEMU workaround end to end, what it reached in the guest, and the failure that remained after the loader blocker cleared.

## The run

GitHub Actions run 29525332901 in the yubiOS repository is the primary evidence for the workaround's effectiveness. Per the project record (project-internal record, yubiOS refs source document, run at https://github.com/yubi-OS/yubiOS/actions/runs/29525332901):

1. The ci_test-vm.yml workflow installed or reused QEMU built from commit 3a18e8a25992d1643707e2cebdd6e9bb2bd7d3b9 and reported "QEMU emulator version 10.2.50".
2. The ARM64 job pulled the yubiOS image, relaxed AppArmor profiles, and ran tests/vm/test-luks-fido2-ci.sh through bcvk.
3. The guest reached Fedora Linux 45 aarch64 login, multi-user.target, and graphical.target.
4. The remaining failure was bootloader-update.service inside the guest, not the earlier host loader failure.

The decisive point is the transition between failure modes. Before the workaround, the ARM64 lane died on the host at "unable to handle EFI zboot image with zstd compression" and no guest code ever ran. With the pinned QEMU, the loader blocker disappeared, the zstd payload unpacked, and the failure moved inside the guest. That proves the pinned commit is effective enough to reach the guest on the primary ARM64 lane.

## Why the run matters for planning

The project record draws the planning consequence directly: keep the workaround and the stale-cache skip, but treat the next blocker as guest boot and update-service triage rather than zstd DirectBoot bring-up. The zstd problem is solved as a class; whatever fails next is a different problem with different owners (project-internal record, cross-referenced to the run's own e2e notes).

This is the normal shape of harness bring-up evidence: one run does not prove the workaround is permanent, it proves the current blocker moved. The doc 09 record tracks when the workaround itself can be retired.

## The guest failure: bootloader-update.service

The remaining failure was bootloader-update.service inside the guest. The service belongs to the bootupd project, which Fedora includes in Fedora and CentOS bootc images for updating the bootloader on EFI system partition and BIOS MBR layouts. Fedora's bootc documentation describes bootloader updates as not currently automatic and usually relevant on bare metal scenarios, or virtualized hypervisors that support Secure Boot; an example reason to update the bootloader is the BootHole vulnerability (Fedora Docs, Updating the bootloader, jev weight 0.83, https://docs.fedoraproject.org/en-US/bootc/bootloader-updates/). The Fedora CoreOS variant documents that bootloader updates are performed automatically by bootloader-update.service, and that both the EFI system partition and BIOS MBR can be updated by bootupd (Fedora Docs, jev weight 0.75, https://docs.fedoraproject.org/en-US/fedora-coreos/bootloader-updates/; staging copy, jev weight 0.87, https://docs.stg.fedoraproject.org/en-US/bootc/bootloader-updates/).

Downstream evidence that this service can fail after a Fedora CoreOS release transition exists in the wild: after upgrading a ucore image from a Fedora CoreOS 42 based build to a Fedora CoreOS 43 based build, users reported "bootloader-update.service: Failed with result 'exit-code'" during boot (ucore issue tracker, weak backing, jev weight 0.28, https://github.com/ublue-os/ucore/issues/325), with the same failure tracked in the Fedora CoreOS issue tracker (weak backing, jev weight 0.48, https://github.com/coreos/fedora-coreos-tracker/issues/2072). These reports are weakly weighted because they are user issue trackers rather than project documentation, and they concern FCOS 43 transitions in general; the yubiOS guest failure has its own specifics and is tracked project-internally. They establish only that bootloader-update.service failures after release transitions are a known failure class, not that they share a root cause.

## How the test environment itself is shaped by bcvk

The test script runs through bcvk ephemeral, which creates a podman container reusing the host virtualization stack without requiring root privileges or dedicated VM infrastructure (bcvk repository, jev weight 0.86, https://github.com/bootc-dev/bcvk). Two environment details from the project record follow from that: the host must relax AppArmor profiles so the container can drive QEMU, and the pinned QEMU prefix must be bind-mounted into the container so the right binary executes (project-internal record, detailed in doc 06). The guest reaching graphical.target confirms that the whole chain (image pull, container, QEMU, zstd unpack, kernel, userland) was healthy end to end on the pinned binary.

## What remains open

Per the project record, the open work after run 29525332901 is guest side triage of bootloader-update.service, plus the runner image question from doc 09: whether the self-hosted runner's distro now ships a QEMU at 11.0 or newer, which would let the pinned-workaround step in ci_test-vm.yml be removed (project-internal record).
