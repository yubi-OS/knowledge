# Lex-Sort Drop-In Naming: Ordering Semantics and the Fire-After Convention

Scope: how lexicographic file ordering works in tmpfiles.d, modprobe.d, dracut.conf.d, udev rules.d, and systemd drop-in directories, and the naming convention that keeps override files firing in the intended order.

## The ordering rule

Multiple config directories in a boot-critical Linux system process their files in filename order, and that order decides which configuration wins:

- **tmpfiles.d:** "All configuration files are sorted by their filename in lexicographic order, regardless of which of the directories they reside in. If multiple files specify the same path, the entry in the file with the lexicographically earliest name will be applied" (https://www.man7.org/linux/man-pages/man5/tmpfiles.d.5.html, jev weight 0.79, high). The tool that consumes these files is systemd-tmpfiles, which creates, deletes, and cleans up files and directories per tmpfiles.d configuration (https://www.man7.org/linux/man-pages/man8/systemd-tmpfiles.8.html, jev weight 0.78, high; https://www.freedesktop.org/software/systemd/man/251/systemd-tmpfiles.html, jev weight 0.96, high).
- **dracut.conf.d:** drop-in files "are then read in alphanumerical order and will override parameters set in /etc/dracut.conf" (https://www.man7.org/linux/man-pages/man5/dracut.conf.5.html, jev weight 0.78, high). Order matters at initramfs build time (https://www.man7.org/linux/man-pages/man7/dracut.modules.7.html, jev weight 0.59, high).
- **modprobe.d:** module blocklists live in config files read by modprobe; preventing a module from loading at boot requires the blocklist entry to be present in the processed configuration (https://access.redhat.com/solutions/41278, jev weight 0.72, high).
- **udev rules.d and systemd *.service.d/*.conf:** drop-in style directories where file order determines precedence (source doc enumeration, consistent with the same lex-sort pattern; weak dig backing for the specific claim beyond tmpfiles/dracut, jev weight not established for these two directories in this dig).

The key property: the sort is lexicographic on the filename, so byte values decide order. A digit prefix like `53` (0x35) sorts before any letter like `s` (0x73) or `v` (0x76). That means a numeric prefix does not mean "late"; it usually means "early".

## The incident that produced the convention

The yubiOS OMN-149 failure: an override intended to fire after the upstream `static-nodes-permissions.conf` was named `usr/lib/tmpfiles.d/53-yubiOS-no-static-vfio.conf`. systemd-tmpfiles sorted it first, so the yubiOS override removed the `/dev/vfio` cdev and upstream re-created it afterward. The override was silently negated on every boot for 4 days (introduced in `59f4332`, 2026-07-26) until a step-21 VM test surfaced it, and the fix in `f92c6010` (2026-07-30, https://github.com/yubi-OS/yubiOS/commit/f92c6010db9d19ed439ebfe80d84a1afb2f562bd) was purely a rename to `vfio-yubiOS-no-static-vfio.conf`, whose `v` (0x76) now sorts after `s` (0x73). Source doc evidence for the incident; the ordering semantics carry the man-page weights above.

The subtlety worth internalizing: this is not a workflow input problem at all, yet the failure mode is identical to the input-shape failures. An implicit contract (the filename must sort in a particular position), enforced by no machine, validated by no test. That is why the doctrine absorbs it as Rule 6.

## The naming convention

For drop-in overrides in lex-order directories:

- Intent "fire after upstream package files": the filename must lex-sort AFTER every upstream file it intends to override. Acceptable forms: `vfio-yubiOS-...`, `yubiOS-...`, or any prefix that sorts after every upstream package file in the same directory.
- Intent "fire before upstream": a low numeric prefix or `yubiOS-` is fine.
- Every override file should declare its intent in a header comment ("fire after upstream X" or "fire before upstream X"), because the machine check reads the intent and verifies the name against it.

## The verification recipe

After any rename or addition: `ls -1 usr/lib/<dir>/ | sort -u`, and confirm every yubiOS file whose intent is "after" sorts after every upstream file it targets. Repeat whenever a future upstream package could add a same-prefix file, because upstream package updates can silently re-break ordering: a new upstream file that sorts between an existing override and its target restores the original bug without any yubiOS change.

## Machine enforcement

The validate-input-shape gate's `lex_sort_check.py` implements exactly this check at lint time: for each drop-in directory, list files, sort byte-wise (Python's default string sort is byte-wise ASCII, which matches the ordering semantics of systemd-tmpfiles, modprobe, dracut, and udev), and for each yubiOS file whose header intent is "fire after", assert no upstream file sorts after it. A contradiction between the declared intent and the actual sort position produces an error finding. The validator cannot read the boot runtime, but it can read the sort order, and the sort order is the contract.
