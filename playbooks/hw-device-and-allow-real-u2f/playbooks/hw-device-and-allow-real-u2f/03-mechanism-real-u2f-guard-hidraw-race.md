# 03 - Mechanism: the real-U2F guard and the hidraw enumeration race

Scope: why the guard exists, what the in-guest software authenticator competes with, and how `assert_passless_only` enforces passless-only testing.

The source doc gives the reason the guard exists in one sentence: with a real key on the host, the in-guest software authenticator (`swu2f`) can lose the `/dev/hidraw*` enumeration race to the real key. The passless tests would then exercise the physical key, and a passless regression would pass unnoticed (source doc: yubi-OS/yubiOS `playbooks/hw-device-and-allow-real-u2f.md`, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/playbooks/hw-device-and-allow-real-u2f.md).

The enforcement point is `assert_passless_only` in `tests/vm/lib/real-u2f-guard.sh`, shipped by PR #144. It detects the device and refuses (source doc). The refusal is not a failure of the harness; the source doc explicitly records that a guard refusal on rock1 with a real key is the recorded correct behavior.

What is racing: `/dev/hidraw*` is the kernel's raw-access interface for HID devices, including USB HID. The kernel's hidraw documentation describes hidraw as a raw access path to USB and Bluetooth HID devices, one device node per HID device (https://docs.kernel.org/hid/hidraw.html, jev weight 0.89). The HID subsystem documentation covers how HID devices are enumerated by the kernel (https://docs.kernel.org/hid/index.html, jev weight 0.89). Enumeration order of multiple HID devices is an artifact of bus and driver timing, not a stable contract, which is exactly why a software authenticator emulating a FIDO device and a physical YubiKey attached to the same host can claim the expected device node in either order depending on the run.

The yubiOS test stack uses libfido2, Yubico's client library for FIDO2/U2F (https://developers.yubico.com/libfido2/, jev weight 0.81). The race is therefore a property of the device layer the library sits on: whichever HID device wins enumeration is the one the authenticator calls land on.

The same class of race is documented outside yubiOS. The krytis project's issue "Fix FIDO2 boot unlock race" records a FIDO2 unlock flow where device ordering between the authenticator path and another claimant produced a boot-time race (https://github.com/starlit-os/krytis/issues/250, jev weight 0.66). Weaker backing: the softfido project is a software FIDO2/U2F authenticator implemented against HID interfaces (https://github.com/ellerh/softfido, jev weight 0.27, weak), which illustrates the software-authenticator class that `swu2f` belongs to.

Why passless matters: the passless tests are defined to exercise the software authenticator path only. If a physical key wins the enumeration race, the test still passes, but it has tested the wrong device. That failure mode is silent: green CI with no hardware signal at all. The guard converts it into a loud refusal before the test body runs, and the `allow_real_u2f` flag (02, 04) is the operator's explicit acknowledgment that a real key is present and the test is allowed to see it.

The source doc's operational rule for the refusal: re-dispatch with `allow_real_u2f: true`. Do not unplug the key mid-run and do not patch the guard (source doc).
