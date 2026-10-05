# Version evolution: v257 through v261

Scope: what each systemd release from v257 to v261 changed in the homed/homectl surface, and the one upstream limitation that has not moved.

## The version timeline

| Version | Homed-relevant changes |
|---|---|
| v257 | userdbctl --fuzzy; users can change their own record fields |
| v258 | aliases, tmp/shm quotas, home Areas, signing-key management via D-Bus, register/unregister for network homes, --match= and per-machine conditions, --seize= |
| v259 | homectl update --recovery-key=, --prompt-shell=, --prompt-groups=, --chrome=, --mute-console= |
| v260 | PrivateUsers=full ID mapping, SIGUSR1 rescans /home/ |
| v261 | homectl --birth-date= (birthDate field in the JSON user record) |

The v257 through v260 rows summarize the source reference's version table; the v258 release facts are corroborated by third-party coverage: v258 shipped tmpfs quota support and removed cgroups v1 support entirely (source: https://lwn.net/Articles/1038458/, weight 0.54, weak-to-medium backing: reputable news coverage of the release, not the release notes themselves).

## v258: the big homed release

v258 is the release where the homed surface broadened. Beyond the reference table's aliases and Areas items, the release announcement on systemd-devel clarifies a distinction that matters for image builders: the new "userdb load-credentials" mechanism creates static user records via drop-in files in /run/userdb/ (covering system users and the like), while systemd-homed creates only homed-managed regular users; the two credentials paths are explicitly unrelated (source: https://lists.freedesktop.org/archives/systemd-devel/2025-September/051670.html, weight 0.76). The man pages snapshotted at v258 confirm the service's scope: create, remove, change, or inspect home areas including directories, network mounts, and real or loopback block devices with a filesystem, optionally encrypted, with most functionality accessible through homectl (source: https://www.freedesktop.org/software/systemd/man/258/systemd-homed.html, weight 0.96).

## v259 and v260

v259 added recovery-key updating on existing homes (homectl update --recovery-key=) plus prompt and console-behavior knobs (--prompt-shell=, --prompt-groups=, --chrome=, --mute-console=) (source: https://www.freedesktop.org/software/systemd/man/259/systemd-homed.service.html, weight 0.95, for the service's scope at that release). v260 added PrivateUsers=full ID mapping and the SIGUSR1-triggered rescan of /home/ that migration flows now rely on (source: https://www.man7.org/linux/man-pages/man8/systemd-homed.8.html, weight 0.88, for the rescan behavior as currently documented).

## v261: --birth-date

v261 added the homectl --birth-date=YYYY-MM-DD option, which sets a new optional birthDate field in the JSON user record. The field is an ISO 8601 calendar date, the earliest representable year is 1900, and an empty string resets or unsets it (source: https://www.altusintel.com/public-yyr571/, weight 0.13, weak backing: third-party summary; the field's specification belongs to the JSON user record documentation at https://systemd.io/USER_RECORD/, weight 0.92, and the release itself at https://github.com/systemd/systemd/releases, weight 0.94). For an image-based OS this is cosmetic today; no image-level action is required.

## Issue 28893: the constraint that has not moved

The single most operationally relevant upstream item is issue 28893, "Allow multiple FIDO2 devices for a given home directory w/ systemd-homed." It has been open since 2023 with no merged fix or maintainer commitment as of the July 2026 refresh of the source reference (source: https://github.com/systemd/systemd/issues/28893, weight not dig-scored: primary upstream issue carried from the source reference). It is the concrete limitation behind the one-FIDO2-device-per-home rule documented in the FIDO2 doc of this corpus, and any backup-YubiKey enrollment story that wants homed-managed homes has to route around it at the LUKS2/cryptenroll layer until it closes.

## Tracking upstream

The authoritative places to watch for future homed changes are the systemd release index on GitHub (source: https://github.com/systemd/systemd/releases, weight 0.94) and the live man pages on freedesktop.org, which are re-snapshotted per release (source: https://www.freedesktop.org/software/systemd/man/homectl.html, weight 0.98). The source reference itself flags that its version-sensitive claims were not re-diffed against a v261 changelog in the September 2026 verification pass, so a changelog diff remains an open verification task for the next upstream review cycle.
