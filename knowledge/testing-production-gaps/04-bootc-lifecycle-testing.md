# 04 - bootc lifecycle testing

## Scope

bootc upgrade/rollback, A/B boot-counter behavior, sysext activation against immutable /usr, and portable-service lifecycle: the missing CI assertions.

## The upgrade and rollback model

bootc is designed to do a few things well: transactionally fetch new operating system updates from a registry and boot into them while retaining the previous state for rollback (source: https://jmarrero.github.io/bootc/upgrades.html, jev weight 0.52). The underlying mechanism is an A/B deployment pattern that enables atomic updates and reverts (source: https://deepwiki.com/bootc-dev/bootc/3.2-upgrade-and-rollback, jev weight 0.13, weak backing). The Red Hat image-mode documentation is explicit that bootc upgrade is an alias for bootc update, and that rolling back to a previous boot entry reverts system changes via the boot loader's rollback support (source: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/managing-rhel-bootc-images, jev weight 0.92). Fedora's getting-started guide covers the same surface plus podman-bootc for local testing and the bootc-rollback command (source: https://docs.fedoraproject.org/en-US/bootc/getting-started/, jev weight 0.91).

The A/B model has an under-tested edge: the boot counter. systemd-boot and bootc both use a boot counter to decide whether the current deployment is healthy and whether to fall back. A counter that saturates (reaches its maximum value) has undefined behavior across bootloader versions. This is a pure CI assertion, cheap to write, and yubiOS has no test for it (yubiOS source: refs/testing-production-gaps-2026-08-01).

## What yubiOS covers and what it lacks

The yubiOS CI runs bootc upgrade legs in the main VM test workflow, so the positive upgrade path is exercised. The audit lists four unproven behaviors (yubiOS source: refs/testing-production-gaps-2026-08-01):

1. A/B boot-counter saturation: what happens when the counter hits its ceiling, and whether the system falls back correctly.
2. bootc switch --transport=oci rollback: switching to a different image reference by OCI transport and rolling back from it. This path differs from upgrade because the target image is not the same repository channel.
3. bootc container lint --fatal-warnings: a static gate on image structure that should be wired into the build pipeline as a blocking check.
4. bootc container lint as an upgrade precheck on the target.

The proposed fixes are three new VM test scripts: test-bootc-upgrade-rollback.sh covering the upgrade and switch-rollback legs, plus sysext and portable-service scripts (yubiOS source: refs/testing-production-gaps-2026-08-01).

## sysext against an immutable /usr

systemd-sysext exists precisely for immutable system images: it extends the /usr/ and/or /opt/ hierarchies of a read-only root at runtime without persistent modification, using OverlayFS under the hood with compatibility checks (merging only when the extension's os-release matches the base) (source: https://manpages.debian.org/testing/systemd/systemd-sysext.8.en.html, jev weight 0.87). The sysext services are guaranteed to complete before basic.target, so regular services see the merged tree (source: https://man7.org/linux/man-pages/man8/systemd-sysext.8.html, jev weight 0.76). Practitioner coverage confirms the design intent: sysext was built to solve the immutable-base-plus-extra-packages problem with systemd integration and a standardized format (source: https://itsfoss.com/systemd-sysext/, jev weight 0.38, weak backing).

A proper lifecycle test must assert the failure mode, not just the merge:

- Activate a sysext image built for the matching base os-release: merged tree visible, service starts.
- Activate an image built for a mismatched os-release: the merge must be refused, not half-applied.
- Deactivate: the merged tree must disappear completely and a running service bound to extension files must be restartable without stale paths.
- Verify the merge survives across bootc upgrade: the extension directory state (/var/lib/extensions) persists across the transactional update.

## Portable services

Portable services are images attached to a running systemd host with portablectl, managed by systemd-portabled, with stricter default sandboxing policies as a primary feature (source: https://systemd.io/PORTABLE_SERVICES/, jev weight 0.84). The lifecycle test surface yubiOS lacks is attach, enable, start, stop, detach, and re-attach on a booted system, plus the interaction with an immutable /usr: a portable service image must not need to write into /usr to operate. A minimal test script sequence:

1. portablectl attach an image built from the same image family.
2. Start the service, verify its sandbox (systemd-analyze security on the attached unit).
3. Stop and detach, verify no residue in the host's unit directories.
4. Re-attach after a bootc upgrade transaction, proving the profile re-associates with the new /usr.

## Why these belong in CI rather than docs

All four gaps are automatable VM assertions, which puts them in the cheapest tier of the yubiOS gap list: the audit prices the whole set at 2 weeks (yubiOS source: refs/testing-production-gaps-2026-08-01). Every script should assert both positive and negative outcomes (upgrade succeeds and rollback succeeds; mismatched sysext is refused) so a green run means fail-closed behavior, not just happy paths.

## Sources

- https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/managing-rhel-bootc-images (weight 0.92)
- https://docs.fedoraproject.org/en-US/bootc/getting-started/ (weight 0.91)
- https://manpages.debian.org/testing/systemd/systemd-sysext.8.en.html (weight 0.87)
- https://systemd.io/PORTABLE_SERVICES/ (weight 0.84)
- https://man7.org/linux/man-pages/man8/systemd-sysext.8.html (weight 0.76)
- https://jmarrero.github.io/bootc/upgrades.html (weight 0.52)
- https://itsfoss.com/systemd-sysext/ (weight 0.38, weak backing)
- https://deepwiki.com/bootc-dev/bootc/3.2-upgrade-and-rollback (weight 0.13, weak backing)
- yubiOS refs/testing-production-gaps-2026-08-01 (internal source doc for all repo-internal claims)
