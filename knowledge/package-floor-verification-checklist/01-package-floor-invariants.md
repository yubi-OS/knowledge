# 01 - Package-Floor Invariants

Scope: the minimum-version invariant set (kernel, systemd, bootc, mkosi, podman, buildx build policy, SoftHSM, sbsign+libykcs11) that a digest-pinned base image must preserve across rotations, and why each floor exists.

## What the package floor is

A package floor is the set of minimum versions for kernel, systemd, bootc, and other load-bearing packages that yubiOS requires for its composefs, signed UKI, and LUKS2 FIDO2 flows to work. The floor is recorded in PINNED.md and enforced against whatever the pinned digest actually ships. When the base image digest rotates, the bytes behind the pin change, and every floor is silently re-tested against whatever the new image contains. This is why a digest bump is a non-trivial event and not a one-line diff: the new image can regress any invariant without a single code change on the yubiOS side.

The structural reason is inheritance. A container image includes the application, a language runtime, operating system packages, system libraries, certificates, and configuration files inherited from several base-image layers (source: https://medium.com/@cypanrisk/image-and-software-supply-chain-security-validating-scanning-and-signing-trusted-container-images-8838aa222fda, weak backing, jev weight 0.11). A base-image digest rotation therefore changes the OS package set wholesale, not just one component. A digest bump can silently regress composefs support, the signed UKI build (sbsign plus libykcs11), or any other invariant (source doc: yubi-OS/yubiOS refs/package-floor-verification-checklist-2026-08-04.md).

## Why a bump re-tests every floor

When the `FROM` line in the Containerfile changes to a new digest, the whole image is rebuilt from scratch against the new base (source: https://stackoverflow.com/questions/24520543/docker-base-image-how-to-upgrade, weak backing, jev weight 0.04). Registry-side, the same effect is organized differently: a base image update can be configured to trigger downstream rebuild tasks automatically, which is the pattern Azure Container Registry Tasks implements for base-image refreshes (source: https://learn.microsoft.com/en-us/azure/container-registry/container-registry-tasks-base-images, jev weight 0.85). yubiOS implements the equivalent trigger as the `fetch-fedora-bootc-manifest.yml` workflow plus the CI cascade, so the mechanical link between a rotation and a rebuild is expected; what the floors protect is the correctness of what the rebuild produces.

Compatibility is the risk that automation does not see. Automated upgrade recommendations describe vulnerability reduction, not application compatibility, because the recommending engine has no visibility into how the image is actually used (source: https://safeguard.sh/resources/blog/how-snyk-container-recommends-minor-major-and-alternative-base-image-upgrades, weak backing, jev weight 0.32). The package-floor checklist exists precisely to supply that visibility locally: compare the incoming digest's package versions against the recorded floors before the pin is committed, not after the build breaks.

## The invariant set

The floors yubiOS enforces, and the feature each floor protects (source doc: refs/package-floor-verification-checklist-2026-08-04.md, sections 2.1 through 2.4):

| Package | Floor | Protected feature |
|---|---|---|
| kernel | 6.5 / 6.6 / 6.12 per composefs mode | composefs mount modes (see doc 02) |
| systemd | v256 target (floor table spans v246 to v256) | BLS entries, DPS, LUKS2 unlock, portable services, sysext, confext (see doc 03) |
| bootc | v1.16.4 (target v1.16.6) | container split-kernel-and-rootfs, composefs backend (see doc 04) |
| mkosi | v25 (MinimumVersion=26~devel in mkosi.conf) | PIV slot 9c UKI signing pattern, systemd-sysext integration |
| podman | v4.5 | rootless container builds |
| docker buildx | v0.16 | the `--policy` flag for OPA/Rego Build Policies |
| SoftHSM | v2.6 | CI substitute for YubiKey PIV slot 9c; the v2.6 to v2.7 crossing is a documented cross-version trap |
| sbsign + libykcs11 | systemd v252-era stack | signed UKI build |

Two of these deserve emphasis because they are cross-version traps rather than simple minimums. SoftHSM's PKCS#11 signing pattern is canonical at v2.6 and changes at v2.7, so the floor is also a ceiling on the side that works. The buildx floor is a feature floor: the `--policy` flag that vets every build input against `yubiOS.rego` landed in buildx v0.16, so an older buildx silently skips the supply-chain gate rather than failing loudly.

## Enforcement shape

The floors are enforced at two checkpoints. Pre-bump, the incoming digest is pulled and inspected with `rpm -q` for kernel, systemd, and bootc, and the full `rpm -qa` package set is diffed against the outgoing digest; any regression aborts the bump before PINNED.md is touched. Post-bump, the CI cascade re-runs the verification script against the rebuilt dev image and fails the workflow on any floor miss. The general supply-chain principle is the same one third-party checklists codify: a per-release gate on the artifact itself, digest pinning, base freshness, and signature verification that is enforced rather than merely produced (source: https://runbook.academy/courses/docker/checklists/docker-checklist-supply-chain-verification/, jev weight 0.66).

## Failure evidence

The floor discipline is not theoretical. The base image `quay.io/fedora/fedora-bootc:45` rotated 3 times in 7 days between 2026-07-26 and 2026-07-30, and by 2026-09-18 the pin had gone stale again for roughly 44 days with the pinned manifest returning 404 on quay (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 9; refs/fedora-bootc-digest-drift-check-2026-09-18.md). Each rotation carried the full risk surface described above: kernel floor, systemd floor, bootc floor, and package-set diff all had to be re-verified before the new digest could stand in PINNED.md.
