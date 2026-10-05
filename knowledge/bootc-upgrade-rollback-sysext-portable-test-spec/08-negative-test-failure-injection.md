# 08: negative path tests: failure injection and rejection assertions

Scope: negative-path test design for image-based OS lifecycle: deliberately corrupt upgrade images, assert signature verification rejection, and verify sandbox deny rules.

## Why negative paths are the high value assertions

A lifecycle test suite that only proves the happy path proves little: any test framework can confirm a correct image boots. The properties worth testing are the ones that must fail closed: a corrupted or unsigned image must be rejected, a failed boot must fall back, and a sandboxed service must actually be denied. For an image based OS the failure surfaces concentrate in three places: image integrity verification at mount or merge time, boot assessment on a failing deployment, and sandbox policy on attached services.

## Signature verification: the sysext failure mode

The signed sysext path has a documented, non obvious failure mode. A systemd issue from June 2024 reports: boot is blocked because systemd-sysext is expecting a password for the verity+signed extension [1]. That is a case where a signed extension image is present but the verification material (the key or password for the verity signature) is not available: instead of a clean rejection the system hangs at boot waiting for input.

For test design this cuts both ways:

1. The intended negative path: a mutated or unsigned extension image must be rejected with a signature mismatch, not merged. A test can corrupt one byte of the signed image and assert the refresh fails.
2. The hang hazard: the systemd issue shows that when a signed extension is present but the key material is missing, the failure mode was a blocked boot rather than a clean skip [1]. A test suite for signed overlays should cover both the reject case and the missing-key case, because upstream behavior for the second was a real bug.

The configuration surface relevant to such tests includes the environment variables systemd documents for sysext: `$SYSTEMD_SYSEXT_MUTABLE_MODE` may be used to override the default mutability mode for hierarchies managed by systemd-sysext [2].

## Building signed extensions in practice

The Kairos project documents the full build-and-sign flow that a test environment must reproduce: after building the chosen Dockerfile, run osbuilder with the sysext command and the key and certificate, like you would do with systemd-repart [3]. Kairos also documents deploying kernel firmware via sysext on Trusted Boot, which shows signed sysexts carrying real boot critical content [4] (w=0.74). These are the patterns a CI system needs to build a legitimately signed fixture image before it can test rejection of a corrupted one.

## Failure injection on the upgrade path

For the upgrade axis, the negative test is a deliberately bad target image: switch to it, reboot, and let the boot assessment machinery do its work. The mechanism is documented by systemd: boot loader entries carry a counter of boot attempts [5], systemd-boot decrements it on each attempt and deprioritizes entries that reached zero [6], and `systemd-bless-boot.service` marks a successful boot as good, turning off counting [7]. A test that injects a failing deployment asserts that the counter exhausts and the previous deployment wins, which is the same automatic revert systemd documents as its purpose: automatically reverting to the previous version of the OS or kernel when the system consistently fails to boot [5].

Analogous vendor documentation on corrupt image recovery exists for other classes of network equipment (Cisco's Catalyst recovery procedure for corrupt images, which requires console access and xmodem transfers in the worst case) [8]. That is worth citing only as contrast: the bootc model's rollback path is designed to make that class of manual recovery unnecessary, which is exactly what the negative test is meant to prove. The cite is directional context, not a mechanism source (w=0.73 but off domain).

## Sandbox denial assertions

The third negative surface is the sandbox: an attached portable service runs with a `RootImage=` drop-in that confines it to the image filesystem [9] (see doc 04). The negative assertion is that a privileged operation forbidden by the service's sandboxing profile is actually denied from inside the service. A test writes a probe file to a path the profile forbids from inside the service's root and asserts the write fails, rather than trusting the profile declaration.

## Test design implications

1. Corrupt the signed artifact, assert rejection: mutate the sysext (or portable DDI) and assert the merge or attach fails non zero [1] [3].
2. Missing key material, assert no boot hang: the documented regression was boot blocked waiting for a password; the test asserts a bounded failure instead [1].
3. Bad deployment injection: switch to a broken image, reboot until the boot counter exhausts, assert fallback to the previous deployment [5] [6] [7].
4. Sandbox probe: from inside the attached service, attempt a forbidden write and assert denial [9].

## Sources

1. https://github.com/systemd/systemd/issues/33239 (w=0.84)
2. https://systemd.io/ENVIRONMENT/ (w=0.97)
3. https://kairos.io/docs/advanced/sys-extensions/ (w=0.87)
4. https://kairos.io/docs/examples/trusted-boot-firmware-sysext/ (w=0.74)
5. https://github.com/systemd/systemd/blob/main/docs/AUTOMATIC_BOOT_ASSESSMENT.md (w=0.79)
6. https://chromium.googlesource.com/chromiumos/third_party/systemd/+/refs/heads/chromeos-v247/docs/AUTOMATIC_BOOT_ASSESSMENT.md (w=0.71)
7. https://systemd.io/AUTOMATIC_BOOT_ASSESSMENT/ (w=0.60)
8. https://www.cisco.com/c/en/us/support/docs/switches/catalyst-2950-series-switches/41845-192.html (w=0.73, off domain contrast)
9. https://www.man7.org/linux/man-pages/man1/portablectl.1.html (w=0.72)
