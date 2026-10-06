# The yubiOS drop-in naming convention

Scope: the yubiOS prefix convention for fire-after overrides (vfio-yubiOS-, kvm-yubiOS-, yubiOS-), when a low numeric prefix is still acceptable, and why ordering is verified mechanically rather than inferred from the name.

## The decision rule

The playbook's decision is stated as a rule for drop-ins in `usr/lib/modprobe.d/`, `usr/lib/dracut.conf.d/`, `usr/lib/tmpfiles.d/`, `usr/lib/systemd/*.service.d/`, and `usr/lib/udev/rules.d/` (source doc: yubi-OS/yubiOS playbooks/drop-in-override-naming.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/playbooks/drop-in-override-naming.md):

- Drop-ins whose intent is "fire after upstream" must carry a prefix that lex-sorts after every upstream file they override: `vfio-yubiOS-...`, `kvm-yubiOS-...`, or `yubiOS-...`.
- Never a bare numeric prefix for that intent.
- "Fire before upstream" may keep a low numeric prefix, since digits sort early and low numbers sort before high ones under lex order for equal-length prefixes.
- Ordering is verified mechanically at author time, never inferred from the number.

The prefixes are chosen so the first byte of the yubiOS filename is a lowercase letter. In the OMN-149 case the fix renamed `53-yubiOS-no-static-vfio.conf` to `vfio-yubiOS-no-static-vfio.conf`, where `'v'` is 0x76 and sorts after `'s'` (0x73) of upstream's `static-nodes-permissions.conf` (source doc). The domain-specific prefixes (`vfio-`, `kvm-`) also encode which subsystem the override concerns, so the prefix doubles as a topic tag.

## Why letter prefixes work where numbers fail

The sort that decides execution order compares full filenames byte by byte in lexicographic order. systemd.unit(5) documents that multiple drop-in files in a unit's `.d` directory "are read if present, processed in lexicographic order of their filename" (https://www.man7.org/linux/man-pages/man5/systemd.unit.5.html, jev 0.9; mirrored at https://manned.org/man/arch/systemd.unit.5, jev 0.83), and tmpfiles.d(5) applies the same filename sort to its configuration files regardless of the directory they reside in (https://www.man7.org/linux/man-pages/man5/tmpfiles.d.5.html, jev 0.92).

Under that comparison, a leading digit (0x30 to 0x39) always sorts before a leading lowercase letter (0x61 to 0x7A). A numeric prefix therefore guarantees the file sorts before any letter-initial upstream filename, which is the opposite of what a fire-after override needs. A letter prefix such as `vfio-yubiOS-` gives the author control: pick a first letter that sorts after the first letter of every upstream file being overridden, and the ordering follows from the name.

## Numeric prefixes still exist in the ecosystem

Numeric prefixes in `.d` directories are widespread and are a real convention in some contexts, which is why the habit persists. A Unix and Linux Stack Exchange question collecting examples such as `/etc/grub.d/` with `00_header`, `10_linux`, and `30_os-prober` asks exactly what the number means (https://unix.stackexchange.com/questions/134520/what-is-the-number-prefix-in-config-files-from-d-directory, jev 0.11, weak backing). The distinction the playbook draws is per directory: the tools listed in the playbook's Context section sort lexicographically, so the numeric vocabulary belongs to other contexts (sysv rcN.d, grub.d-style scripts) and not to these.

## Author-time verification over name reading

The decision rule ends with "Ordering is verified mechanically at author time, never inferred from the number" (source doc). The playbook's verification recipe proves the effective order with a sort of the touched directory and a pairwise assertion that the yubiOS filename sorts after the upstream filename it overrides; the recipe is expanded in the verification doc of this corpus. The naming convention is only half the safety property; the other half is the mechanical check that the chosen name actually lex-sorts where intended against the current set of upstream files.

## Fit with the .d-directory model

Red Hat's documentation on `.d` configuration directories notes a practical hazard of the drop-in model: syntax-checking commands may need to check all files in the directory at once rather than one file (https://www.redhat.com/en/blog/etc-configuration-directories, jev 0.6). For yubiOS this reinforces shipping drop-ins with names that are stable and self-describing: the `vfio-yubiOS-` style prefix makes a file's subsystem and its override intent readable at a glance, while the mechanical sort check carries the ordering guarantee.
