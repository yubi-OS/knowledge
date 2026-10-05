# 09: Distro QEMU 11.0 availability and retiring the workaround

Scope: the runner-image question that decides when the pinned QEMU workaround can be removed, and the release and packaging evidence needed to answer it.

## The open question, stated precisely

The yubiOS source record closes with a sharp reframing: the exact commit yubiOS pins (3a18e8a25992d1643707e2cebdd6e9bb2bd7d3b9) is Daan De Meyer's own zstd EFI zboot fix, merged by Philippe Mathieu-Daudé on 2026-01-20 and included in the QEMU 11.0 line. So yubiOS is already pinning the correct fix commit, and the remaining open question is purely a runner-image question: does the CI self-hosted runner's distro package manager ship QEMU 11.0 or newer yet? If yes, the pinned-workaround step in ci_test-vm.yml may already be removable. The recommended next step is checking the self-hosted rock1 runner's installed QEMU version against 11.0, a much closer target than waiting for an unmerged upstream fix (project-internal record, yubiOS refs source document).

## The release timeline that bounds the answer

The fix merged on 2026-01-20 (doc 04). The releases that carry it:

1. QEMU 11.0.0, released 2026-04-22 (QEMU release announcement, jev weight 0.98, https://www.qemu.org/2026/04/22/qemu-11-0-0/).
2. QEMU 11.1.0, released 2026-08-11 (QEMU release announcement, jev weight 0.98, https://www.qemu.org/2026/08/11/qemu-11-1-0/; highlights including UFS emulation and vhost-host-user support, jev weight 0.96, https://www.qemu.org/2026/08/11/qemu-11-1-0/).

The QEMU wiki ChangeLog for 11.0 documents the release's system emulation changes and its removed features, such as the removal of the Arm ast2700a0-evb machine and several old pc machine types (QEMU wiki, ChangeLog/11.0, jev weight 0.93, https://wiki.qemu.org/ChangeLog/11.0). Any runner distro shipping 11.0 or newer therefore has the zstd branch in unpack_efi_zboot_image(), and the old error cannot recur on that binary.

## Packaging evidence: Fedora already carries it

The strongest packaging signal in this dig is the Fedora package index entry for qemu-11.1.0-0.2.rc3.fc45 in Fedora 45 (Fedora packages index, jev weight 0.69, https://packages.fedoraproject.org/pkgs/qemu/qemu/fedora-45.html). That means a Fedora 45 based runner image resolves its qemu package at 11.1, comfortably past the 11.0 floor. The yubiOS guest in the CI evidence is itself Fedora Linux 45 aarch64 (project-internal record, doc 07), so the guest and a Fedora 45 runner image would be on the same release family.

QEMU's download page lists the per-distro install paths, noting that most distributions install meta-packages that pull in emulator binaries for all available targets, and recommending checking the distribution's package list first (QEMU download page, jev weight 0.96, https://www.qemu.org/download/; same page, jev weight 0.87, https://www.qemu.org/download/). That is exactly the check the runner question needs: query the runner's distro package manager for the installed qemu version, not the binary version in some other environment.

One 11.0 packaging note matters for CI planning: third party coverage reports that QEMU 11.0 dropped all 32-bit host support, added a Diamond Rapids CPU model for x86, and brought broad changes across ARM, RISC-V, KVM, and migration (linuxiac coverage article, weak backing because it is a news aggregator rather than the release announcement, jev weight 0.24, https://linuxiac.com/qemu-11-0-released-with-dropped-32-bit-host-support/). Dropping 32-bit hosts is irrelevant for the ARM64 aarch64 runner, but any runner image upgrade should read the release removals, not just the version number.

## How to retire the workaround

Retirement is a sequence, not a flag flip (project-internal record, doc 06):

1. Verify the runner's installed QEMU version is 11.0 or newer. This is a single package query on the runner image.
2. Run the ARM64 bcvk lane once with the distro QEMU and confirm the zstd payload unpacks and the guest boots, so the pin is demonstrably unnecessary.
3. Remove the pinned-QEMU install step from ci_test-vm.yml, keeping the exact-error skip until the fleet of runner images is confirmed homogeneous, then remove the skip too.

The keep-the-skip rule follows the project's own discipline: the exact-error skip exists for stale self-hosted caches and manual runs with an older QEMU, and those can outlive the workflow change (project-internal record, doc 06).

## Fedora release cadence context

Fedora Linux has a relatively short life cycle: each version is usually supported for at least 13 months, where version X is supported only until one month after version X plus 2 is released, with approximately six months between most releases (Wikipedia, Fedora Linux, weak backing, jev weight 0.23, https://en.wikipedia.org/wiki/Fedora_Linux). For the runner image this means the package manager's QEMU version is not frozen: within a supported Fedora release window, distro updates deliver the QEMU 11.x line, and release upgrades deliver it wholesale. The retirement decision is therefore a matter of checking the runner, not lobbying a distro.

## The decision rule

Restated for the record (project-internal record): pin until the distro ships the fix, retire the pin once the runner's package manager delivers QEMU 11.0 or newer and one clean CI run proves it. The pin was always a bridge; the bridge's far end is a package version on one machine.
