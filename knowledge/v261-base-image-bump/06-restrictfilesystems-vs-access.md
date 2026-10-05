# 06. RestrictFileSystems= versus RestrictFileSystemAccess=

Scope: the consistency trap between two similarly named systemd directives, one a BPF LSM filesystem-type control and one a v261 signed-filesystem control, and why confusing them changes what a unit actually enforces.

## The two directives

The source ref's consistency note records the distinction (source ref, no external weight for the yubiOS-specific usage):

1. `RestrictFileSystems=`: the older control that allows or denies filesystem types (for example `ext4`, `btrfs`, `nfs`) for processes in the unit. yubiOS uses `RestrictFileSystems=~@network` in its enrollment unit.
2. `RestrictFileSystemAccess=`: the v261 control for restricting execution to signed and verified dm-verity-backed filesystems.

The names differ by one word, "type" filtering versus "access" enforcement, and they operate at different layers. Confusing them means a unit that appears to restrict execution to verified filesystems is in fact only filtering filesystem types, or vice versa.

## Where RestrictFileSystems= comes from

`RestrictFileSystems=` is implemented with eBPF: the systemd implementation attaches a BPF program of type `BPF_PROG_TYPE_LSM` to the `file_open` BPF LSM hook, so the allow or deny decision happens at file-open time in the kernel (https://kinvolk.io/blog/2021/02/extending-systemd-security-features-with-ebpf, noul 0.53, weak backing for the implementation detail). The underlying kernel mechanism is documented in the kernel's own BPF LSM documentation: BPF programs attached to LSM hooks allow privileged users to implement system-wide MAC and audit policies at runtime (https://docs.kernel.org/bpf/prog_lsm.html, noul 0.97). Security work on that mechanism is active: LWN covers hardening BPF LSM programs against tampering, noting that a BPF program attached to an LSM hook is reference-counted against its submitting user-space program (https://lwn.net/Articles/1082111/, noul 0.80). This is the layer `RestrictFileSystems=` occupies: a filesystem-type policy enforced through BPF LSM.

## Where RestrictFileSystemAccess= comes from

The kernel command line man page documents `systemd.restrict_filesystem_access=` as controlling the `RestrictFileSystemAccess=` execution enforcement policy, and stamps it "Added in version 261" (https://www.man7.org/linux/man-pages/man7/kernel-command-line.7.html, noul 0.82). That version stamp is the corpus's hard anchor for the claim that `RestrictFileSystemAccess=` is a v261 control, and therefore that a systemd version bump to v261 is a precondition for evaluating it. The directive index pages list the configuration directive namespace in both the latest and historical versions (https://www.freedesktop.org/software/systemd/man/latest/systemd.directives.html, noul 0.83; https://www.freedesktop.org/software/systemd/man/253/systemd.directives.html, noul 0.93), which is how a version-relative absence or presence of a directive is checked.

## The decision recorded in the source ref

The source ref records that future work may evaluate the v261 `RestrictFileSystemAccess=` control, but the currently shipped yubiOS unit uses `RestrictFileSystems=` (source ref, no external weight). The practical reading: the shipped unit enforces a filesystem-type policy through the BPF LSM path, and the signed-filesystem execution policy is a candidate for later evaluation once the base systemd version carries it, which the v261 bump established.

## How to avoid the confusion in practice

Three checks prevent the mixup:

1. Version check: `RestrictFileSystemAccess=` requires systemd 261 or later; the man page version stamp is the authoritative marker (noul 0.82). Older systemd versions cannot evaluate it at all.
2. Mechanism check: a `RestrictFileSystems=` policy is a BPF LSM filesystem-type filter (https://docs.kernel.org/bpf/prog_lsm.html, noul 0.97), not a dm-verity verification policy. The two give different guarantees even when both are present.
3. Documentation check: the systemd directives index is versioned per release online, so a directive's presence in a specific version's man page is directly queryable (noul 0.83, 0.93).

The general hardening context for unit sandboxing directives like `ProtectSystem` and `ProtectHome` is documented in hardening guides (https://oneuptime.com/blog/post/2026-03-02-use-systemd-protectsystem-protecthome-directives, noul 0.44, weak backing), but the specific FileSystems pair above is the pair this corpus tracks, because the enrollment unit's actual enforcement depends on which one is written down.
