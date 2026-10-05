# The canonical SoftHSM2 signing pattern

Scope: SoftHSM2 as the canonical software-token stand-in for exercising the PKCS#11 signing path without hardware, including token initialization, the boundary against production, and how the pattern maps onto the systemd-sbsign interface.

## What SoftHSM2 is

SoftHSMv2 implements a PKCS#11 token entirely in software. Because the keys are stored on the filesystem, this PKCS#11 provider trades the hardware trust boundary for convenience; that characterization comes from a consumer of the library and should be read as its position in the design space rather than a security endorsement (weak backing; source: https://azure.github.io/iot-identity-service/pkcs11/softhsm.html, jev weight 0.2181). The upstream project states that to install SoftHSM as a PKCS#11 module on the system you should install libp11-kit-dev, which is what registers the module with p11-kit (source: https://github.com/softhsm/SoftHSMv2, jev weight 0.6624).

## Token initialization

Token management goes through `softhsm2-util` or the PKCS#11 interface directly. The upstream README describes the two-PIN model: the SO PIN can be used to re-initialize the token, and the user PIN is handed out to the application so it can interact with the token (source: https://github.com/softhsm/softHSMv2, jev weight 0.8533; same project repository at https://github.com/softhsm/SoftHSMv2, jev weight 0.6624). At the API level, softhsm2-util performs token initialization via PKCS#11 C_InitToken and C_InitPIN (weak backing; source: https://deepwiki.com/softhsm/SoftHSMv2/9.1-softhsm2-util, jev weight 0.1971). The tooling split matters for scripting: token creation and import are softhsm2-util's job, while the signing application only ever needs the user PIN and the PKCS#11 URI.

Object inspection from the OpenSSL side is possible without signing anything: `openssl storeutl -engine pkcs11 'pkcs11:'` lists readable objects on the token, returning entries such as a public key and a certificate with their hex IDs (weak backing; source: https://www.saela.eu/openssl/, jev weight 0.2019). That makes storeutl a cheap pre-signing check that the URI actually resolves inside the module before invoking systemd-sbsign.

## The canonical pattern for a signing dry run

Mapped onto the yubiOS validation shape, the SoftHSM pattern substitutes the module and token while keeping the interface identical: the same `--private-key-source engine:pkcs11` and a PKCS#11 URI that now selects a SoftHSM token object instead of `manufacturer=piv_II;id=%9c` (interface source: https://github.com/yubi-OS/yubiOS/blob/main/refs/sbsign-pkcs11-validate-2026-07-23.md, jev weight 0.5970; systemd-sbsign interface source: https://www.man7.org/linux/man-pages/man1/systemd-sbsign.1.html, jev weight 0.9397). The dry run proves the URI grammar, the module loading, the PIN handling, and the downstream verification step, all without a YubiKey attached.

The pattern is also the bridge into CI: a runner with no USB path to a hardware token can still run the full sign-then-verify loop against SoftHSM, reserving the hardware-key run for a gate that has a real token (see doc 07).

## The boundary: testing only

The strongest statement in the dig on this point is direct: SoftHSM2 is for testing only, it is not production-eligible, and production signing paths fail closed against software-only HSM providers (source: https://stella-ops.org/docs/operations/softhsm2-test-environment/, jev weight 0.7163). That is the load-bearing sentence for the whole pattern: SoftHSM proves plumbing, never provenance. A signed artifact from a SoftHSM key validates the toolchain, the URI grammar, and the verification recipe; it carries no hardware-rooted meaning, and any gate that matters for release must fail closed rather than accept a software token as a substitute for the YubiKey.

## Fit with the rest of the corpus

Three constraints make SoftHSM the canonical stand-in rather than one option among many. First, it registers with p11-kit (via libp11-kit-dev), so the same `p11-kit list-modules` discovery step works for both tokens (source: https://github.com/softhsm/SoftHSMv2, jev weight 0.6624). Second, it exposes the standard PKCS#11 interface that both the OpenSSL engine path and the provider path consume, so the cross-version traps in doc 04 can be reproduced cheaply against it. Third, the fail-closed boundary above means its results are honest exactly as long as everyone agrees what they prove. The yubiOS rule that a physical YubiKey remains required for final production signing validation is this boundary applied (source: https://github.com/yubi-OS/yubiOS/blob/main/refs/sbsign-pkcs11-validate-2026-07-23.md, jev weight 0.5970).
