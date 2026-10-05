# 05. The CI leg with a software authenticator: FIDO2 without a human

Scope: the non-interactive CI leg: a software FIDO2 authenticator answers instantly inside a bcvk VM, failure is a test failure.

## Why a software authenticator closes the mode gap

The boot-unlock mode problem is the touch (docs 01, 04). A CI leg has no human, so the only way to exercise the FIDO2 unlock path end to end is to replace the hardware authenticator with a software one that answers the assertion request without any presence signal. The components for that exist and are documented.

libfido2 provides library functionality and command line tools to communicate with a FIDO device over USB or NFC, and to verify attestation and assertion signatures; it supports FIDO U2F (CTAP 1) and FIDO2 (CTAP 2) protocols (source: https://developers.yubico.com/libfido2/, jev weight 0.90). The library is deliberately device-agnostic about what sits behind the HID transport, which is exactly the seam a software authenticator plugs into. libfido2 is BSD 2-clause licensed and runs on Linux, macOS, Windows, OpenBSD, and FreeBSD, with external projects building bindings for .NET, Go, Perl, and Rust on top of it (source: https://lwn.net/Articles/923656/, jev weight 0.82).

## The unlock path itself is library-mediated

For disk encryption, the FIDO2 exchange is the hmac-secret extension of CTAP, where the operating system and the authenticator exchange information and the authenticator releases a secret derived from the request (source: https://kudelskisecurity.com/research/luks-disk-encryption-with-fido2, jev weight 0.87). Community tooling demonstrates that this exchange runs against any conforming authenticator: fido2luks decrypts a LUKS partition using a FIDO2 compatible authenticator (source: https://github.com/shimunn/fido2luks, jev weight 0.86). Nothing in the exchange is specific to a hardware token.

## Software authenticators that stand in for hardware

Several implementations present a virtual FIDO2 device to a host:

1. virtual-fido implements the FIDO2 and U2F protocols as a virtual USB device, like a YubiKey, to support 2FA and WebAuthN, in beta with APIs subject to change (source: https://github.com/bulwarkid/virtual-fido, jev weight 0.64).
2. softfido is a software implementation of a FIDO2 and U2F authenticator that implements a virtual USB device via USBIP so that browsers and tools can talk to it, with the cryptographic operations delegated elsewhere (source: https://github.com/ellerh/softfido, jev weight 0.55).
3. A FIDO software authenticator that runs on a Linux host and provisions a virtual HID token through /dev/uhid, so web browsers and tools like libfido2 interact with it as if it were a physical hardware security key, with no custom kernel modules required (source: https://proxg.dev/feitian/FidoSoftwareAuthenticator, jev weight 0.46, weak backing).

The /dev/uhid approach is the one that fits an automated boot test best: the guest kernel sees a normal HID FIDO device, the unlock code path is byte-identical to the hardware path, and the virtual device answers immediately. In this mode the CI leg is fully non-interactive: no touch is possible, none is needed, and the assertion arrives in the same call stack as the unlock request. A test failure is therefore a hard failure of the unlock chain, not a waiting condition; there is no fallback prompt to catch it, because the test harness asserts the FIDO2 path itself succeeds.

## What the software leg proves and what it cannot

The software leg proves the mechanics: enrollment metadata is read from the LUKS2 header, the CTAP2 assertion request is issued, the hmac-secret response is processed, and the volume key unlocks the volume. It cannot prove the hardware properties: presence, PIN, and the touch latency of a real token. That is what the hardware leg (doc 06) is for. The two legs together cover the mode axis: the software leg covers idempotent mechanics under automation, the hardware leg covers the human-facing interactive properties.

## Mode summary

1. Interactive: no. The software authenticator answers instantly, with no presence step.
2. Timeout: none in the happy path; the virtual device responds within the call.
3. Fallback: none. Failure is a test failure.
4. Repeatability: fully deterministic per test run, which is the point of using a software device.
