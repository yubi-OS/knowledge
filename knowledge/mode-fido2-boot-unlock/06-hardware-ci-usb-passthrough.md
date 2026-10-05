# 06. The hardware CI leg: a real key passed through USB, touch requirements managed

Scope: the hardware CI leg: a real YubiKey passed through USB to a CI box with touch policy set off for automation.

## QEMU gives two sanctioned ways to put a key in a VM

QEMU documents support for both halves of the problem: pass-through of a host U2F key device to a guest, and software emulation of a U2F key (source: https://www.qemu.org/docs/master/system/devices/usb-u2f.html, jev weight 0.77). The u2f-passthru device connects a real hardware U2F key on the host to a guest (source: https://www.qemu.org/docs/master/system/devices/usb-u2f.html, jev weight 0.77), and the same documentation is mirrored in the versioned docs for QEMU 9.1.3 (source: https://qemu.readthedocs.io/en/v9.1.3/system/devices/usb-u2f.html, jev weight 0.55). A U2F security key is a USB HID device that implements the U2F protocol, and FIDO2 CTAP2 devices speak the same HID transport, which is why the passthru device is the mechanism a hardware CI leg uses: the guest sees a real token with a real firmware, a real PIN check, and a real user-presence implementation.

For the general USB layer, QEMU notes that by default devices are plugged into the next available port on the specified USB bus, and that a specific physical port can be designated for the device in the guest (source: https://www.qemu.org/docs/master/system/devices/usb.html, jev weight 0.41, weak backing). Pinning the port is the small operational detail that keeps a headless CI leg stable across reboots.

## Touch policy is the automation knob

Yubico documents that the YubiKey can be set to require a physical touch to confirm any cryptographic operation, as an optional feature to increase security and ensure authentication operations are carried out in person (source: https://docs.yubico.com/software/yubikey/tools/minidriver/md_set_touch_policy.html, jev weight 0.69). Touch, PIN, and biometric policies determine when those verifications are required to perform an operation with a private key (source: https://docs.yubico.com/yesdk/users-manual/application-piv/pin-touch-policies.html, jev weight 0.72). The documented policy surface is per application, so the automation story differs by application: where a policy can be set to not require touch, the key can answer without a human, and where user presence is mandated by the protocol layer, it cannot be switched off from the host side. That asymmetry is why the hardware leg in CI is described as non-interactive with the touch requirement managed for CI, while a user-facing boot unlock (doc 01) is fully interactive: the difference is which policies and protocol requirements are in force, not which device is plugged in.

## What the hardware leg adds over the software leg

The software leg (doc 05) proves the mechanics. The hardware leg proves what only real silicon shows:

1. The device's actual CTAP2 behavior under the initrd's libfido2 client, including timing.
2. PIN and touch interactions as the real firmware implements them.
3. The USB path itself: enumeration in the guest, HID transport, and power management quirks that a virtual device never exercises.

The cost is test flakiness of a different kind than the software leg: a real device has state, and reports exist of token exchanges failing intermittently across reboots with specific authenticators (source: https://github.com/Yubico/libfido2/issues/852, jev weight 0.59). A hardware CI leg therefore needs the same retry and reset discipline any physical-fixture test needs, while the software leg needs none.

## Mode summary

1. Interactive: no, in CI, because the touch requirement is managed for automation.
2. Timeout: bounded by the real device's user-presence timeout behavior (doc 09).
3. Fallback: none; a failing hardware leg is a test failure.
4. Repeatability: high but not perfect; physical device state can produce intermittent results that the software leg cannot.
