# 04 - Software authenticators for CI

Scope: the software authenticator landscape usable in CI VMs, what each one covers of CTAP1 versus CTAP2 hmac-secret, and how a test harness maps its legs onto them.

## Why software authenticators exist for testing

A FIDO2 test matrix that requires a physical token on every run cannot scale in CI. Software authenticators fill the gap, and the testing literature frames the work as two layers: WebAuthn, the browser API, and CTAP2, the Client-to-Authenticator Protocol, with strategies needed for both the protocol layer and the platform layer (HelpMeTest blog, https://helpmetest.com/blog/fido2-authenticator-testing/, weight 0.337, weak backing). Disk unlock testing needs the lower layer: a CTAP2 endpoint that can answer hmac-secret requests.

## The CTAP reference surface

libfido2 provides library functionality and command-line tools to communicate with a FIDO device over USB or NFC, and to verify attestation and assertion signatures (Yubico libfido2, https://github.com/Yubico/libfido2, weight 0.922). Any software authenticator a CI harness adopts should present itself through the same HID surface libfido2 expects, because the host tooling used by the unlock path is built on it. The CTAP developer guide covers CTAP versions, implementation strategies, and practical integration examples (Yubico CTAP guide, https://developers.yubico.com/CTAP/index.html, weight 0.904), and the CTAP2.1 specification is the authoritative definition of the hmac-secret extension that disk unlock depends on (Yubico CTAP2.1 spec, https://developers.yubico.com/CTAP/CTAP2.1.html, weight 0.860).

## Available software authenticators

Several open implementations cover the required protocol surface with different completeness:

- A Rust software authenticator built on the Trussed framework provides classical ES256 signatures alongside post-quantum ML-DSA variants, with no C dependencies (FeitianTech FidoSoftwareAuthenticator, https://github.com/FeitianTech/FidoSoftwareAuthenticator/tree/main, weight 0.826).
- Fidolizer is a software FIDO2 authenticator that speaks CTAPHID, CTAP 2.1, and U2F, and keeps credential private keys in a local state file (GitHub fidolizer, https://github.com/19h/fidolizer, weight 0.578).
- Virtual FIDO is a virtual USB device implementing the FIDO2 and U2F protocols, similar to a YubiKey, explicitly marked beta and under active development (GitHub virtual-fido, https://github.com/bulwarkid/virtual-fido, weight 0.747).
- A GitHub topic index collects further software implementations, including a Linux software FIDO2/WebAuthn passkey authenticator and Java CLI simulators for WebAuthn flows (GitHub topics, https://github.com/topics/fido2-authenticator, weight 0.236, weak backing).

Client-side validation tooling also matters for harness assertions: a CTAP2 client library can enumerate HID authenticators, create credentials, run assertions, and read the hmac-secret extension directly, which is exactly the probe surface a CI check needs before attempting an unlock (GitHub ctap-fido2, https://github.com/amaanq/ctap-fido2, weight 0.523). The standalone fido2-hmac-secret utility generates password-protected secrets from an authenticator with the hmac-secret extension and is usable as an independent cross-check of the enrolled secret derivation (GitHub dido/fido2-hmac-secret, https://github.com/dido/fido2-hmac-secret, weight 0.591).

## Coverage mapping for a test design

The capability split that matters is CTAP1/U2F versus CTAP2 hmac-secret. A software authenticator that implements only U2F covers presence-assertion flows, for example pam-u2f style login checks, but cannot satisfy a LUKS2 enrollment or unlock. Only implementations advertising CTAP2.1, or at minimum CTAP2 with the hmac-secret extension, cover the disk-unlock legs (Yubico CTAP2.1 spec, https://developers.yubico.com/CTAP/CTAP2.1.html, weight 0.860; GitHub fidolizer, https://github.com/19h/fidolizer, weight 0.578). A harness should therefore assert, as a preflight step, that the selected softoken answers a real hmac-secret probe through the CTAP2 client surface before spending a boot cycle on it (GitHub ctap-fido2, https://github.com/amaanq/ctap-fido2, weight 0.523).

## Limits

Every listed software authenticator stores its credential material in host-side state: a local state file for Fidolizer, host software for the Rust authenticator, beta software for Virtual FIDO (GitHub fidolizer, https://github.com/19h/fidolizer, weight 0.578; GitHub virtual-fido, https://github.com/bulwarkid/virtual-fido, weight 0.747). That property is what makes them unsuitable as production unlock authorities, and it is the property a guardrail policy targets; the production-trust question is covered in doc 08.
