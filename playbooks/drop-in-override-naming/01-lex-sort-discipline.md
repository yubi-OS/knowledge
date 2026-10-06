# Lexicographic sort discipline for drop-in directories

Scope: which yubiOS drop-in directories sort by full filename lexicographically, how merges resolve when two files target the same path, and what that ordering rule implies for any file whose job is to override another file.

## The directories the rule covers

The yubiOS playbook applies this discipline before shipping any new or renamed drop-in in `usr/lib/modprobe.d/`, `usr/lib/dracut.conf.d/`, `usr/lib/tmpfiles.d/`, `usr/lib/systemd/*.service.d/`, and `usr/lib/udev/rules.d/` (source doc: yubi-OS/yubiOS playbooks/drop-in-override-naming.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/playbooks/drop-in-override-naming.md). All 5 directories are configured through loose files in a shared directory, and the consuming tools order those files by name.

## tmpfiles.d sorts the whole filename, across directories

The tmpfiles.d(5) manual page states: "All configuration files are sorted by their filename in lexicographic order, regardless of which of the directories they reside in. If multiple files specify the same path, the entry in the file with the lexicographically earliest name will be applied" (https://www.man7.org/linux/man-pages/man5/tmpfiles.d.5.html, jev 0.92). The same wording appears in the Debian systemd manpages (https://manpages.debian.org/jessie/systemd/tmpfiles.d.5.en.html, jev 0.93; https://manpages.debian.org/buster/systemd/tmpfiles.d.5.en.html, jev 0.94).

Two consequences follow from that wording, and both matter for overrides:

1. Directory tier does not break ties inside the sort. A file in `/usr/lib/tmpfiles.d/` and a file in `/etc/tmpfiles.d/` are ordered together by filename alone. A local file named `53-x.conf` does not outrank a vendor file named `z.conf` just because it sits in the administrator directory.
2. For conflicting entries on the same path, the lexicographically earliest filename wins. This is the opposite of the numeric-prefix intuition: to apply an entry after (and thereby against) a vendor file, the yubiOS filename must sort later than the vendor filename, not earlier.

The freedesktop.org systemd-tmpfiles(8) page confirms the configuration model of reading all files listed in tmpfiles.d(5) (https://www.freedesktop.org/software/systemd/man/251/systemd-tmpfiles.html, jev 0.94).

## modprobe.d uses the same lex order, with replace semantics

The modprobe.d(5) manual page states: "All configuration files are sorted in lexicographic order, regardless of the directory they reside in. Configuration files can either be completely replaced (by having a new configuration file with the same name in a directory of higher priority) or partially replaced (by having a configuration file that is ordered later)" (https://www.man7.org/linux/man-pages/man5/modprobe.d.5.html, jev 0.9; same text at https://man.archlinux.org/man/modprobe.d.5, jev 0.92, and https://manpages.debian.org/stretch/kmod/modprobe.d.5.en.html, jev 0.92).

So for modprobe.d there are 2 override mechanisms: same filename in a higher-priority directory replaces completely, and a lex-later filename partially replaces an earlier file's directives. Either way the comparison key is the filename compared lexicographically, never a parsed leading number.

## Unit drop-ins sort lexicographically too

For service units, systemd.unit(5) documents that multiple drop-in files in a `unit.d/` directory "are read if present, processed in lexicographic order of their filename" (https://www.man7.org/linux/man-pages/man5/systemd.unit.5.html, jev 0.9; mirrored at https://manned.org/man/arch/systemd.unit.5, jev 0.83). This is the same rule as tmpfiles.d and modprobe.d: the filename is the sort key, byte by byte.

## What the discipline means in practice

The playbook's central discipline is mechanical: a drop-in whose intent is "fire after upstream" must carry a filename that lex-sorts after every upstream file it overrides, and "after" is a byte comparison of the full filename, not a numeric comparison of a leading prefix (source doc). In ASCII, digits (0x30 through 0x39) sort before lowercase letters (0x61 through 0x7A), so any filename starting with a digit sorts before any filename starting with a lowercase letter such as `s` (0x73) or `v` (0x76). A `53-` prefix therefore sorts before `static-nodes-permissions.conf` even though 53 is the larger number in human terms.

The failure mode the playbook warns about is silent: when the override sorts too early, the upstream file runs after it and wins, and the system logs nothing that points at ordering (source doc). The verification recipe in the playbook exists precisely because the order must be proven at author time, not inferred.
