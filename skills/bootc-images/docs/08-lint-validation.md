# 08 - Lint and CI validation

Scope: bootc container lint, what it checks, and how yubiOS wires it into CI so bad images fail before they reach a registry ring.

## What lint checks

`bootc container lint` runs "relatively inexpensive static analysis checks as part of a container build" (source doc: yubi-OS/yubiOS skills/bootc-images/SKILL.md; the check list is confirmed in upstream docs). The source doc enumerates the checks:

1. /boot content in the image (should be absent) (doc 02).
2. Kernel at the correct path /usr/lib/modules/$kver/vmlinuz (doc 02).
3. /usr/etc files present in the image (undefined behavior; the merge machinery owns that tree) (doc 04).
4. Missing tmpfiles.d entries for /var directories, checked as of bootc 1.1.6 (docs 04, 05).

The 1.1.6 tmpfiles check is corroborated upstream: "As of bootc 1.1.6, the bootc container lint command will check for missing tmpfiles.d entries and warn" (bootc.dev/bootc/filesystem.html, w=0.86; same text at bootc.dev/bootc/bootc-filesystem.7.html, w=0.82). The check is a warning, not an error, in this release, so CI should treat lint output with `-Werror`-like strictness if the fleet depends on pre-created /var structure.

The lint man page describes the same scope: static, inexpensive checks designed to run inside the build (www.mankier.com/8/bootc-container-lint, w=0.18, weak backing: third-party man page mirror). Real-world breakage from skipping the checks is visible in downstream issues, e.g. bluefin-lts issue 382 where bootc 1.1.6 lints failed on missing systemd-sysusers entries (github.com/ublue-os/bluefin-lsts/issues/382, w=0.36, weak: downstream issue tracker, but a concrete instance of the lint surface).

## The CI gate

The source doc gives the exact CI step, run against the just-built image:

```yaml
- name: Lint bootc image
  run: |
    podman run --rm \
      --security-opt label=disable \
      dhi.io/yubi-OS/yubiOS:${{ github.sha }} \
      bootc container lint
```

(source doc). The `--security-opt label=disable` matters: lint inspects image content and the container runtime's SELinux labeling would otherwise interfere on SELinux hosts.

## Where lint sits in the yubiOS pipeline

The image checklist in the source doc makes lint the last line: `bootc container lint` passes in CI (source doc). The yubiOS ordering is (github-actions skill; docker-build-push-action skill):

1. Build with digest-pinned FROM under the buildx policy gate (docker-build-policy skill).
2. Push to the registry.
3. Run lint against the pushed digest in a podman step.
4. Only then dispatch downstream CI groups (ci-launchpad app) or publish ring tags.

A lint failure blocks the digest from entering any ring; because ring promotion is digest-based (doc 07), a blocked digest cannot leak into canaries by tag drift.

## Lint is not enough

Lint is static and cheap; it cannot catch what only appears at boot. The complementary checks are dynamic: a bcvk VM boot smoke test (bcvk-virtualization skill) exercising first boot, composefs mount, and PAM stack. Lint keeps bad images out of the registry; the VM path keeps bad boots out of hardware. Both are cheap enough to run on every build.

## Keeping the check list current

The lint surface grows with bootc releases (the tmpfiles.d check arrived in 1.1.6), so the CI gate should run the lint shipped in the image being validated, not a pinned old version. The source doc's checklist items map 1:1 onto lint checks, which keeps the checklist honest: an item that cannot be checked by lint or boot is a documentation item, not a gate.

The bluefin-lts issue referenced above shows the operational risk of drift between releases: a fleet pinned to an older bootc sees new lint warnings only after upgrade, so the CI image and the fleet image should move together (github.com/ublue-os/bluefin-lts/issues/382, w=0.36, weak).
