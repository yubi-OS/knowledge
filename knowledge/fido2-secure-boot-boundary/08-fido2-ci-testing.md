# 08: FIDO2 end-to-end testing in CI

Scope: how a boot-time FIDO2 unlock boundary can be tested automatically, with libfido2's software tooling, QEMU's U2F device models, and real key USB passthrough into VMs.

## libfido2 as the toolkit

libfido2 provides library functionality and command-line tools to communicate with a FIDO device over USB or NFC, and to verify attestation and assertion signatures, supporting both FIDO U2F (CTAP 1) and FIDO2 (CTAP 2) protocols (source: https://developers.yubico.com/libfido2/ , jev noul 0.92). The GitHub project is the canonical home of that library functionality for FIDO2 communication over USB or NFC (source: https://github.com/Yubico/libfido2 , jev noul 0.91).

The command-line surface is what makes scripted CI possible. `fido2-cred` makes credentials and documents its automation behavior: when making a credential the authenticator may require a PIN, and if the `-q` option is not specified the tool prompts for the PIN, using a tty when available and stdin otherwise (source: https://developers.yubico.com/libfido2/Manuals/fido2-cred.html , jev noul 0.64). Debian's libfido2-doc pages document the programmatic side: FIDO2 credentials are abstracted by the `fido_cred_t` type with functions to allocate, deallocate, and inspect them (source: https://manpages.debian.org/testing/libfido2-doc/fido_cred_free.3.en.html , jev noul 0.76). A CI leg can therefore drive credential creation and assertion without a human, modulo the token's own interaction requirements.

## QEMU's U2F device models

QEMU supports both pass-through of a host U2F key device to a VM and software emulation of a U2F key; the `u2f-passthru` device allows connecting a real hardware U2F key on the host to the guest (source: https://www.qemu.org/docs/master/system/devices/usb-u2f.html , jev noul 0.93). The versioned docs restate the model: U2F is a USB HID device implementing the U2F protocol, with passthru and emulation as the two device types (source: https://qemu.readthedocs.io/en/v10.0.3/system/devices/usb-u2f.html , jev noul 0.73).

The broader QEMU USB emulation page goes further and lists canokey, an open-source secure key implementing FIDO2, OpenPGP, PIV and more, as an emulable USB device, with reference to the CanoKey QEMU project (source: https://www.qemu.org/docs/master/system/devices/usb.html , jev noul 0.80). That matters for this boundary specifically: canokey emulates FIDO2 including the hmac-secret family of behaviors, which is closer to what a LUKS2 FIDO2 credential exercises than a bare U2F emulation.

## The CI shape for a boot-unlock boundary

The source problem family records the yubiOS arrangement: the FIDO2 end-to-end test runs in a VM with either a software authenticator or a real key passed through USB. The documented components map onto that arrangement in two tiers:

1. Software tier: QEMU's emulated U2F or canokey device plus libfido2's CLI tools exercise the CTAP protocol paths and the enrollment plumbing, in CI where no physical hardware exists.
2. Hardware tier: `u2f-passthru` gives a real YubiKey to a VM, so the exact hmac-secret firmware behavior the disk unlock depends on is exercised end to end, with the touch interaction being the one part that must remain physical.

The boundary this testing protects is the composition: the FIDO2 unlock runs inside an initrd whose signature the PIV slot 9c key already vouched for, so a CI leg that only tests cryptenroll outside a booted UKI misses the actual boundary. The VM-based tiers are the practical way to close that gap, and the tooling above is what makes them automatable.
