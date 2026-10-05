# 07. The base-images status cross-check

Scope: what the cross-check against the Fedora bootc base-images status established: which Fedora streams the project tracks, how the base-image repo operates, and what the bootc package version lag means for reasoning about seal timing.

## What the cross-check established

The source ref records a cross-check dated 2026-07-23 against `refs/fedora-bootc-base-images-status-2026-07-23.md` (source ref, no external weight for the internal cross-check event itself; the surrounding project facts below are dig-backed). It established three things: the Fedora bootc base-images repo tracks Fedora 42, 43, 44, and Rawhide; the published image name is `quay.io/fedora/fedora-bootc`; and rawhide's `bootc` package was at 1.16.3 while upstream bootc-dev had released 1.16.4 on 2026-07-15, a lag relevant to B-BOOTC-SEAL timing reasoning.

## How the base-images project operates

The cross-check's structure matches how the project actually describes itself. The GitLab project `gitlab.com/fedora/bootc/base-images` states its job plainly: "Create and maintain base bootable container images from Fedora packages" (https://gitlab.com/fedora/bootc/base-images, noul 0.92). The project closely tracks CentOS and Fedora and aims to integrate tightly with their release and test infrastructure; CentOS Stream versions are the upstream for the RHEL product (https://docs.fedoraproject.org/en-US/bootc/base-images/, noul 0.77). The consumer-facing documentation confirms that the Fedora and CentOS Stream base images are listed and continuously updated on the base images page, with RHEL bootc images separate in the Red Hat Ecosystem Catalog (https://docs.fedoraproject.org/en-US/bootc/getting-started/, noul 0.91). The default image content includes bootc for in-place upgrades, a kernel, systemd, NetworkManager, and podman (https://docs.stg.fedoraproject.org/en-US/bootc/base-images/, noul 0.88).

The repo's release page shows the project tags releases to track changes, with the first release tag noted in September 2024 and regular tags thereafter (https://gitlab.com/fedora/bootc/base-images/-/releases, noul 0.89), and an earlier release note records the "tier-x" refactoring intended for inclusion as a git submodule by projects such as Fedora CoreOS or IoT (https://gitlab.com/fedora/bootc/base-images/-/releases, noul 0.84). A layered-image consumer does not need to fork the repo; it builds on the published base container (https://gitlab.com/fedora/bootc/base-images, noul 0.92).

## The package-version lag pattern

The cross-check's most operationally useful finding was the lag between upstream bootc releases and Fedora package updates. The dig corroborates the shape of this pattern from both ends:

- Upstream: the bootc-dev/bootc releases page lists bootc 1.16.12 with its change list, showing the upstream release cadence (https://github.com/bootc-dev/bootc/releases, noul 0.88).
- Fedora packaged: the Fedora package announce list carries `bootc-1.16.13-1.fc44` as a Fedora 44 update dated 2026-09-25 (https://lists.fedoraproject.org/archives/list/package-announce@lists.fedoraproject.org/message/VCU3CHOUZK5NDPR5DGFAMWWO2JNJCTA7/, noul 0.89), and the Fedora packages site indexes the bootc package per release (https://packages.fedoraproject.org/pkgs/bootc/bootc/, noul 0.83).

These late-September versions are newer than the versions in the July cross-check, which is expected: both the upstream releases and the Fedora package updates kept moving after 2026-07-23. The durable lesson from the cross-check is not any specific version number but the check itself: when reasoning about timing-sensitive decisions such as B-BOOTC-SEAL, compare the upstream bootc release tag against the actual packaged version in the Fedora stream you pin, because the two move on different schedules.

## What "tracks Fedora 42/43/44/Rawhide" means for the pin

The cross-check statement that the base-images repo tracked 42, 43, 44, and Rawhide in July is consistent with the versioned-tag structure on quay described in doc 01: versioned tags per Fedora release plus a rawhide stream (https://docs.fedoraproject.org/en-US/bootc/, noul 0.93). For the yubiOS pin on `quay.io/fedora/fedora-bootc:45`, the cross-check functions as the upstream-facing half of the verification: it confirms the image name and stream set used by the pin are the ones the project actually publishes, so a stale pin (doc 08) is attributable to digest drift rather than to a wrong repo or tag name.
