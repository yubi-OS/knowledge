# 03 - Secure Boot signing toolchain (ADR-002, ADR-008)

Scope: PIV slot 9c over CCID as the Secure Boot signing path, systemd-sbsign as the UKI signing tool replacing legacy sbsigntools, PCR 11 signature co-generation, the pcscd requirement, and the recorded FIDO2 signing future work.

## The interface decision: PIV over CCID, not FIDO2 over hidraw (ADR-002)

The source doc (yubi-OS/yubiOS docs/ADR.md, ADR-002, status Accepted) records why FIDO2 was rejected for signing even though ADR-001 makes the YubiKey the trust anchor: Secure Boot UKI signing requires an asymmetric signing operation with a certificate enrollable in the UEFI Secure Boot `db`. The decision is YubiKey PIV slot 9c (Digital Signature) via PKCS#11, over the CCID (USB smartcard) interface rather than hidraw. The recorded reasoning: FIDO2 HMAC-secret can wrap a signing key (key encrypted on disk, FIDO2 derives the AES key), but neither sbsign nor systemd-sbsign support that path natively; PIV/PKCS#11 is directly supported and battle tested in all signing tools. The consequence recorded is that users need `pcscd` running for PIV operations, with `ykman config usb --enable FIDO --enable CCID` as the enabling command. (source doc)

The Yubico PIV documentation corroborates the slot model: PIV certificate slots are a standards defined structure, with YubiKey 4 and 5 holding 24 slots per the PIV standard (https://developers.yubico.com/PIV/Introduction/Certificate_slots.html, weight 0.58, authoritative). The Yubico PIV Tool user guide documents on-device key generation and certificate management (https://docs.yubico.com/software/yubikey/tools/pivtool/index.html, weight 0.51, authoritative), and the upstream project page describes generating keys on the YubiKey itself (https://developers.yubico.com/yubico-piv-tool/, weight 0.37, weak). PIV certificate lifecycle details including PIN, PUK, and management key semantics are documented by Yubico (https://docs.yubico.com/software/yubikey/tools/authenticator/auth-guide/piv-certificates.html, weight 0.61, authoritative).

## The tool decision: systemd-sbsign (ADR-008)

ADR-008 (source doc, status Accepted) decides that systemd-sbsign, added in systemd v257 in December 2024, is the UKI signing tool going forward, replacing legacy sbsign from the sbsigntools project. Recorded rationale: it is maintained inside the systemd tree on the same release cycle with the same PKCS#11 integration and co-developed with ukify and the UKI pipeline; it supports `--key pkcs11:slot=0;id=02` for YubiKey PIV slot 9c natively; it generates and verifies PCR 11 signatures in one step alongside the Secure Boot signature via `--pcr-private-key` and `--pcr-public-key`, with no separate invocations; and upstream mkosi switched its signing backend to systemd-sbsign in v25. The migration instruction is to replace `sbsign --engine pkcs11 --key ...` invocations in FinalizeScripts and CI with `systemd-sbsign --key pkcs11:... --certificate cert.pem`. Consequence: systemd 257 or later is required, and yubiOS pins v261 per ADR-015 and ADR-016. (source doc; cited at https://www.freedesktop.org/software/systemd/man/latest/systemd-sbsign.html and https://0pointer.net/blog/announcing-systemd-v257.html)

The dig corroborates the tool's mechanics: the freedesktop man pages document that `--private-key=` takes a path or URI passed to the OpenSSL engine or provider via `--private-key-source=`, and that `--certificate=` takes a PEM encoded X.509 certificate or URI for the sign verb (https://www.freedesktop.org/software/systemd/man/257/systemd-sbsign.html, weight 0.44, weak; https://www.freedesktop.org/software/systemd/man/latest/systemd-sbsign.html, weight 0.42, weak). LWN's systemd 257 coverage records the release context including the new `--certificate-source` switch (https://lwn.net/Articles/1001657/, weight 0.24, weak). A DeepWiki summary of mkosi's Secure Boot workflow scored 0.16 and was not used (weak, aggregator).

## Amendment discipline visible in the record

ADR-002 carries a 2026-07-28 amendment (source doc) that reviewed the ADR against the day's BLOCKERS.md, confirmed the v257 floor for systemd-sbsign per ADR-008, noted the yubiOS base remains pinned to v261, and marked the ADR as completing the v257 to v261 doc-sync flagged in RECENT_ACTIVITY.md. This is the doc's own pattern for keeping decision records consistent as versions move.

## Future work and open path

The source doc tracks a fully hidraw only signing path (FIDO2 HMAC-secret wrapping a Secure Boot key) in TODO.md, with `age-plugin-fido2-hmac` named as a candidate. Until that lands, PIV slot 9c over CCID is the only sanctioned signing route, and ADR-032's kernel and rootfs split later builds on the signed UKI being a separately published artifact signed once through this path. (source doc)

## Sources considered

| Source | Weight | Role |
|---|---|---|
| https://docs.yubico.com/software/yubikey/tools/authenticator/auth-guide/piv-certificates.html | 0.61 | PIV certificate lifecycle |
| https://developers.yubico.com/PIV/Introduction/Certificate_slots.html | 0.58 | PIV slot model |
| https://docs.yubico.com/software/yubikey/tools/pivtool/index.html | 0.51 | PIV tooling |
| https://www.freedesktop.org/software/systemd/man/257/systemd-sbsign.html | 0.44 (weak) | sbsign option semantics |
| https://www.freedesktop.org/software/systemd/man/latest/systemd-sbsign.html | 0.42 (weak) | sbsign option semantics, latest |
| https://developers.yubico.com/yubico-piv-tool/ | 0.37 (weak) | PIV tool project page |
| https://www.yubico.com/support/download/ | 0.47 (weak) | tooling surface |
| https://lwn.net/Articles/1001657/ | 0.24 (weak) | systemd 257 release context |
| https://deepwiki.com/systemd/mkosi/5.5-secure-boot-and-signing | 0.16 (weak, unused) | aggregator |
| yubi-OS/yubiOS docs/ADR.md (source doc) | n/a | ADR-002, ADR-008 text |
