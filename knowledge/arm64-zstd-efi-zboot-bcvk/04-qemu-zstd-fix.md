# 04: The upstream QEMU fix and its merge into QEMU 11.0

Scope: the zstd EFI zboot patch series by Daan De Meyer, its review path through the QEMU mailing lists, the commit that landed, and the release that carries it.

## The series: 3 patches, one goal

The fix is a 3 patch series titled "Add support for zboot images compressed with zstd", authored by Daan De Meyer. Its motivation statement is one line: "Fedora arm64 has an EFI_ZBOOT kernel image compressed with zstd. Let's make sure we can use it for direct kernel boot with qemu." (QEMU-devel PATCH v3 0/3 cover letter, jev weight 0.83, https://lists.gnu.org/archive/html/qemu-devel/2025-10/msg02627.html; v2 cover letter with the same statement, jev weight 0.95, https://lists.gnu.org/archive/html/qemu-devel/2025-10/msg02623.html).

The three members are visible in the series index (v2 listing, jev weight 0.95, https://lists.gnu.org/archive/html/qemu-devel/2025-10/msg02623.html; mirrored on the qemu-arm list, jev weight 0.68, https://lists.gnu.org/archive/html/qemu-arm/2025-10/msg00631.html):

1. Rename LOAD_IMAGE_MAX_GUNZIP_BYTES to LOAD_IMAGE_MAX_DECOMPRESSED_BYTES. A pure rename that widens the meaning of the constant from gzip only to any decompression format.
2. Use g_autofree in unpack_efi_zboot_image(). Memory management cleanup that makes adding a second compression branch safe and simple.
3. Add support for zboot images compressed with zstd. The functional patch: it adds a zstd branch to the EFI zboot unpacker and keeps the unsupported-compression error path for other cases (the last clause is the yubiOS reading of the patch, project-internal record).

## Review timeline

The series went through at least v2 and v3 on the mailing lists in October 2025 (v2 dated 2025-10-11 in the series index, jev weight 0.95, https://lists.gnu.org/archive/html/qemu-devel/2025-10/msg02623.html; v3 cover letter, jev weight 0.83, https://lists.gnu.org/archive/html/qemu-devel/2025-10/msg02627.html). A January 2026 follow-up discussion on the list, "Re: Support for zboot images compressed with zstd", shows reviewer and downstream engagement continuing into the merge window: the thread opens with a reply to Davide Cavalca dated 14 January 2026 and is cross-posted to the QEMU list (jev weight 0.78, https://lists.nongnu.org/archive/html/qemu-devel/2026-01/msg02680.html). The yubiOS source record also cites the pull request thread that merged the series, at https://lists.nongnu.org/archive/html/qemu-devel/2026-01/msg04080.html and the patchew discussion at https://patchew.org/QEMU/20251011081347.4063198-1-daan.j.demeyer%40gmail.com/ (project-internal references; the pull mail did not surface in this dig).

## The commit that landed

The commit yubiOS pins, 3a18e8a25992d1643707e2cebdd6e9bb2bd7d3b9, is titled "hw/loader: Add support for zboot images compressed with zstd". An independent mirror repository shows the provenance of that hash: daandemeyer authored and philmd committed commit 3a18e8a "hw/loader: Add support for zboot images compressed with zstd", alongside commit 3fd0734 "hw/loader: Use g_autofree in unpack_efi_zboot_image()" with the same authorship pair (mirror commit listing, weak backing because it is a third party mirror rather than the upstream repository, jev weight 0.36, https://github.com/ToastdRice/hh-qemu/commits?author=daandemeyer). The mirror corroborates but does not replace the upstream record.

Per the yubiOS source record, that exact commit is Daan De Meyer's own zstd EFI zboot fix, authored by him and merged by Philippe Mathieu-Daudé via pull request on 2026-01-20, and included in the QEMU 11.0 line (project-internal record, yubiOS refs source document; consistent with the commit authorship and committership shown in the mirror above).

## The release that carries it

QEMU 11.0.0 was released on 2026-04-22 (QEMU release announcement, jev weight 0.98, https://www.qemu.org/2026/04/22/qemu-11-0-0/; second copy of the announcement, jev weight 0.84, https://www.qemu.org/2026/04/22/qemu-11-0-0/). The 11.0 changelog on the QEMU wiki documents the release's system emulation changes and removed features (jev weight 0.93, https://wiki.qemu.org/ChangeLog/11.0). Because the zstd zboot fix merged in January 2026, before the 11.0 release in April 2026, every distribution QEMU at 11.0 or newer contains the fix.

QEMU 11.1.0 followed on 2026-08-11 (QEMU release announcement, jev weight 0.98, https://www.qemu.org/2026/08/11/qemu-11-1-0/), so the fix lineage is two releases deep by the time of this corpus.

## What the fix means for direct boot

After the fix, a QEMU with commit 3a18e8a can take a Fedora ARM64 EFI zboot image with a zstd payload on -kernel and unpack it the same way it previously unpacked gzip payloads. The error path for genuinely unsupported algorithms remains, so the old failure mode is preserved for future compression formats rather than silently mangled. For the yubiOS harness this converts the blocker from "impossible until upstream acts" to "a version question", which is the framing docs 06 and 09 use: pin the fixed QEMU until the runner's distro ships 11.0 or newer, then retire the pin.
