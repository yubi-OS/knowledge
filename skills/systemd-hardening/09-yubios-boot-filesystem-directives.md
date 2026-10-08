# yubiOS Boot and Filesystem Gating Directives

Scope: the two yubiOS-specific directives the skill highlights from the man pages: ConditionSecurity=measured-os (v261) and RestrictFileSystems= (v250), including their kernel support requirements and verification commands.

## Source-doc position

The yubiOS skill (source doc: yubi-OS/yubiOS skills/systemd-hardening/SKILL.md) documents both directives as "sourced from man pages" additions specific to yubiOS service gating, with an explicit warning that an earlier research pass fabricated the name `RestrictFileSystemAccess=`; the correct name is `RestrictFileSystems=` and all yubiOS files were corrected.

## ConditionSecurity=measured-os

`ConditionSecurity=` gates a unit on the security technology the system booted with. The systemd.unit man page (high weight 0.96, https://www.man7.org/linux/man-pages/man5/systemd.unit.5.html) is the authoritative reference for the directive and its value table. The source doc's table:

| Value | Meaning |
|---|---|
| selinux | SELinux MAC |
| apparmor | AppArmor MAC |
| uefi-secureboot | UEFI Secure Boot |
| tpm2 | TPM2 with full UEFI/TCG PC Client support |
| measured-uki | UKI with PCR 11 measurements (systemd-stub), added v255 |
| measured-os | OS PCR measurements enabled, added v261 |
| cvm | Confidential VM (SEV/TDX) |

`measured-os` is typically equivalent to `measured-uki` but can also be set explicitly via the `systemd.tpm2_measured_os=` kernel command-line option (source doc, matching the man7 wording). The directive itself was added in v244; the `measured-os` value arrived in v261. Negation uses the `!` prefix.

The yubiOS application: `yubiOS-enroll.service` carries `ConditionSecurity=measured-os` in its `[Unit]` section, so the enrollment wizard silently skips on a system that did not boot with a measured stack. The source doc's phrasing is the point: it will not run on an unsigned or unverified boot chain.

## RestrictFileSystems=

`RestrictFileSystems=` (added v250, systemd.exec) restricts which filesystem types a service may access, implemented through the LSM BPF hook. The kernel's LSM BPF documentation (high weight 0.94, https://docs.kernel.org/bpf/prog_lsm.html) describes the mechanism: BPF programs attached to LSM hooks for runtime mandatory access control. The Kinvolk write-up that introduced the feature (weight 0.38, weak) describes the implementation as attaching a BPF program of type BPF_PROG_TYPE_LSM, and a systemd issue report (weight 0.66) shows the `restrict_filesystems` BPF program live in practice on systemd 255 with kernel 6.7, with observable CPU cost when loaded.

Syntax (source doc):

- Allow-list: `RestrictFileSystems=tmpfs proc sysfs` makes only the listed types accessible.
- Deny-list: `RestrictFileSystems=~@network` denies the listed set and allows the rest.

Predefined sets (source doc): `@basic-api` (basic filesystem API), `@auxiliary-api` (auxiliary filesystem API), `@common-block` (common block device filesystems), `@network` (NFS, CIFS and similar), `@temporary` (tmpfs, ramfs), `@known` (all known filesystems). The directive index (high weight 0.95, https://www.freedesktop.org/software/systemd/man/latest/systemd.directives.html) is the cross-check for the directive's current location in systemd.exec.

## Kernel support requirements

The directive is silently ignored if the kernel lacks `CONFIG_BPF_LSM=y` or if the system does not use the unified cgroup hierarchy (source doc). The verification commands:

```sh
systemd-analyze filesystems 2>/dev/null
grep CONFIG_BPF_LSM /boot/config-$(uname -r)
```

`systemd-analyze filesystems` lists the filesystem types the running kernel knows, which is also how you discover what an allow-list can name.

## yubiOS application

For `yubiOS-enroll.service` the source doc prescribes the deny-list form:

```ini
[Service]
RestrictFileSystems=~@network
```

The reasoning: a deny-list blocks NFS and CIFS without enumerating every local filesystem the enrollment script might touch. An allow-list would require maintaining an exhaustive local-type list across kernel updates, which is the kind of list that drifts.

## Anti-pattern recorded in the source doc

The skill explicitly documents its own correction: earlier research fabricated `RestrictFileSystemAccess=`, which does not exist in systemd. Any tool, review, or corpus that mentions that name should be treated as contaminated and corrected to `RestrictFileSystems=`. This is a useful precedent for yubiOS agents: directive names are verified against systemd.exec and systemd.unit, not against memory.

Sources: source doc plus 5 dig results (4 high weight, 1 weak).
