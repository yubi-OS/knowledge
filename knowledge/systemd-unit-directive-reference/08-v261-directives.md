# New Directives in systemd v259 to v261

Scope: directives and behavior changes from the newest three systemd releases relevant to unit authoring: RestrictFileSystemAccess=, CPUSetPartition=, FileDescriptorStorePreserve=, PSI pressure watches, ConditionFraction=, ConditionMachineTag=, PrivateUsers= variants, and the Varlink enum wire change.

## Release timing

systemd v260 was released on March 17, 2026 (https://0pointer.net/blog/, weight 0.66, quoting the announcement series "On March 17 we released systemd v260 into the wild"). systemd v261 shipped on June 19, 2026, per the release notes verification in the yubiOS systemd reference (session/refs-mint/refs_corpus/systemd-unit-directive-reference-2026-07-23.md), corroborated by press coverage: "The systemd 261 release is out today with a host of new features and capabilities" (https://www.phoronix.com/news/systemd-261, weight 0.33, weak backing). Release pages and NEWS are the authoritative records (https://github.com/systemd/systemd/releases, weight 0.95; https://github.com/systemd/systemd/blob/main/NEWS, weight 0.94).

## RestrictFileSystemAccess= is manager-level, not a unit directive

The single most conflated v261 addition is RestrictFileSystemAccess=. A 2026-07-24 correction in the yubiOS reference pins it down after an earlier table placement error: the directive "is a manager-level setting in the [Manager] section of system.conf (or via the systemd.restrict_filesystem_access= kernel command-line parameter), not a per-service systemd.exec directive, and it has no per-unit opt-out" (session/refs-mint/refs_corpus/systemd-unit-directive-reference-2026-07-23.md, correction verified against the v261 release and systemd-system.conf(5); upstream release records at https://github.com/systemd/systemd/blob/main/NEWS, weight 0.94).

Its semantics: a BPF-LSM restriction that permits executing binaries only from a signed, dm-verity-protected filesystem. It requires booting with dm_verity.require_signatures=1 and lsm=...,bpf, and PID 1 refuses to start without those. It must not be conflated with the older per-unit RestrictFileSystems=, which limits the filesystem type a unit may touch (for example `RestrictFileSystems=~@network`). The first is a global boot-chain invariant for fully verified image-based systems; the second is a per-unit sandbox setting. Adopting the former is a system-wide decision (system.conf plus kernel command line), not a drop-in (yubiOS reference, session/refs-mint/refs_corpus/systemd-unit-directive-reference-2026-07-23.md).

## Other v261 additions

| Directive | Page | Behavior |
|---|---|---|
| CPUSetPartition= | systemd.resource-control | cgroup cpuset partition type: root, isolated, member |
| FileDescriptorStorePreserve=on-success | systemd.service | Preserve the FD store only when the unit stops successfully |
| CPUPressureWatch=, CPUPressureThresholdSec=, IOPressureWatch=, IOPressureThresholdSec= | systemd.resource-control | Per-unit PSI (pressure stall information) notifications |
| ConditionFraction= | systemd.unit | Staged rollout gating via machine-ID hash against a percentage |
| ConditionMachineTag= | systemd.unit | Key off tags set in /etc/machine-info |

These follow the v261 directive rows in the yubiOS reference (session/refs-mint/refs_corpus/systemd-unit-directive-reference-2026-07-23.md), anchored to the upstream release record (https://github.com/systemd/systemd/releases, weight 0.95; https://github.com/systemd/systemd/blob/main/NEWS, weight 0.94). The PSI design is documented upstream beyond the directive list: "Most of systemd's long running components watch for PSI memory pressure events, and release allocation caches and other resources once seen. systemd's service manager provides a protocol for asking services to monitor PSI events and configure the" thresholds (https://github.com/systemd/systemd/blob/main/docs/PRESSURE.md, weight 0.89). ConditionFraction= is the staged-rollout primitive: a percentage compared against a machine-ID hash, which makes progressive rollout of a new unit configuration possible without an external gate.

## v259 and v260 context the table above leans on

Three additions in the two preceding releases round out the current directive surface. Type=notify-reload (v255-era) moves reload signaling into the notification protocol; the freedesktop service page lists it as a first-class service type for services that speak sd_notify (https://www.freedesktop.org/software/systemd/man/systemd.service.html, weight 0.98). PrivateUsers= grew modes: full (v258) for complete user-namespace isolation and managed (v260) for automatic UID management in the namespace (yubiOS reference, session/refs-mint/refs_corpus/systemd-unit-directive-reference-2026-07-23.md, with v260 context at https://www.phoronix.com/news/systemd-260-Released, weight 0.10, weak backing). v260 also removed SysV service script support from the manager and introduced the mstack (RootMStack=) mount-stack mechanism for image-based roots (https://www.phoronix.com/news/systemd-260-Released, weight 0.10, weak backing; https://0pointer.net/blog/, weight 0.66 for the v260 release date).

## The Varlink wire change

v261 changed several io.systemd.Unit Varlink fields from plain strings to enums, with wire values shifting from dash or plus forms to underscore forms: tty-force became tty_force, kmsg+console became kmsg_console. Affected enums: ExecInputType, ExecOutputType, ProtectHome, CGroupController, CollectMode, EmergencyAction, JobMode (yubiOS reference, session/refs-mint/refs_corpus/systemd-unit-directive-reference-2026-07-23.md, verified against the v261 release; upstream record at https://github.com/systemd/systemd/blob/main/NEWS, weight 0.94). Any tooling that talks to the manager over Varlink needs its wire-value strings audited against this rename.

## Also new in v261, outside unit files

systemd-sysinstall arrived as a textual OS installer wrapping systemd-repart, bootctl link, bootctl install and systemd-creds (https://www.phoronix.com/news/systemd-261, weight 0.33, weak backing; also covered by https://www.linuxnews.net/articles/systemd-v261-released, weight 0.06, weak backing). For an image-based distribution that installs via repart and bootc, this is watch-list material rather than an adoption candidate: the installer does not change how unit files are authored, only how they are laid down.

## Adoption checklist for a hardened image

Three gates before adopting any of these on a production image: confirm the directive exists on the running manager's systemd version (the directives(7) index of that version is the ground truth, https://www.man7.org/linux/man-pages/man7/systemd.directives.7.html, weight 0.78); distinguish manager-level from per-unit scope, RestrictFileSystemAccess= being the case where the distinction changes the whole adoption path; and for Varlink clients, regenerate any enum wire-value table after the v261 rename.
