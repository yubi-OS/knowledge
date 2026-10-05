# Signing validation in CI with a YubiKey

Scope: how a validation gate for hardware-key signing is structured: when to run it, what it proves, the software-token stand-in, and the test-fixture-before-release discipline.

## The gate shape

yubiOS's validation gate has an explicit placement and an explicit order: run `tests/validate-pkcs11-uri.sh` after `yubiOS-enroll-sb` on a host with a configured YubiKey; the signing step is the primary gate, and `osslsigncode` corroborates the PE signature (source: https://github.com/yubi-OS/yubiOS/blob/main/refs/sbsign-pkcs11-validate-2026-07-23.md, jev weight 0.5970). Decomposed, that ordering encodes three decisions. First, the gate runs after enrollment, because the certificate chain it verifies against depends on enrollment having produced it. Second, the gate is host-conditional: it exists only where a configured YubiKey is present, which makes the hardware run a distinct lane rather than something every build runs. Third, the corroboration step is separate from the signing gate, so a signing failure and a verification failure are distinguishable signals.

The source doc is also explicit about what remains open: a physical YubiKey remains required for final production signing validation, meaning the hardware lane is not yet satisfied by any software substitute (source: https://github.com/yubi-OS/yubiOS/blob/main/refs/sbsign-pkcs11-validate-2026-07-23.md, jev weight 0.5970).

## What the hardware lane proves

PIV is the application layer that makes this possible: it enables RSA or ECC sign and encrypt operations using a private key stored on a smart card, through common interfaces such as PKCS#11, and the YubiKey 4 and YubiKey 5 support not only RSA keys but also Elliptic Curve Digital Signature (source: https://developers.yubico.com/PIV/Guides/PIV_Walk-Through.html, jev weight 0.6602; user guide at https://docs.yubico.com/software/yubikey/tools/pivtool/index.html, jev weight 0.7767). The general security argument for the pattern comes from Red Hat's hardening documentation: separating parts of your secret information into dedicated cryptographic devices, such as smart cards and cryptographic tokens (source: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/security_hardening/configuring-applications-to-use-cryptographic-hardware-through-pkcs-11_security-hardening, jev weight 0.7947). A CI gate that signs with the real YubiKey PIV slot 9c proves the full chain: module, URI, PIN policy, and the actual hardware key that production artifacts will carry.

## The fixture-before-release discipline

The sharpest CI-specific practice in the dig comes from a hardware-token signing setup for Apple CI, and generalizes: before enabling a release workflow, test signing a non-release fixture on the actual runner, and verify that the signing tool uses the hardware-token identity rather than a file-based key (weak backing; source: https://www.eidola.ai/docs/contributing/release-apple-signing-yubikey/, jev weight 0.2577). Two properties make this worth copying despite the weak source. It is a smoke test on the exact runner class, catching environment drift (missing pcscd, missing module registration, wrong udev rules) before it can touch a release. And it verifies identity, not just success: a signing step that succeeds through a fallback file key is the dangerous failure, because the artifact is signed but not with the hardware identity the gate exists to guarantee.

## The software-token lane and its honest limits

The SoftHSM2 pattern (doc 03) gives CI a lane that runs the full sign-then-verify loop without a token: a runner with no USB path can still validate URI grammar, module loading, and the verification recipe. The boundary is equally explicit: SoftHSM2 is for testing only, not production-eligible, and production signing paths fail closed against software-only HSM providers (source: https://stella-ops.org/docs/operations/softhsm2-test-environment/, jev weight 0.7163). The two lanes therefore have different meanings and both are needed: the SoftHSM lane guards toolchain plumbing on every build, the hardware lane guards provenance, and neither substitutes for the other.

## Precedents for hardware-token signing containers

The pattern of running hardware-token signing inside a controlled environment has working precedents: a Docker-based code-signing setup for Secure Boot binaries using hardware token keys, with YubiKey and SafeNet eTokens verified to work (weak backing; source: https://github.com/JETtech-Labs/code-sign, jev weight 0.1357). In the wider signing-tool ecosystem, cosign optionally supports PKCS11 tokens for signing, enabled through the crypto11 and pkcs11 libraries (weak backing; source: https://docs.sigstore.dev/cosign/signing/pkcs11/, jev weight 0.3297), which shows the token-backed signing interface is a cross-ecosystem pattern rather than a systemd-specific one.

## What the gate must not do

Two anti-patterns follow from the evidence above. A gate that treats "signature verifies" as equivalent to "signed by the hardware key" conflates the two lanes and would let a file-key or software-token signature pass; the Eidola fixture practice exists precisely to catch identity drift (weak backing; source: https://www.eidola.ai/docs/contributing/release-apple-signing-yubikey/, jev weight 0.2577). And a gate that skips the corroboration step loses the ability to distinguish signing-tool failure from verification-tool failure, which the two-step yubiOS ordering preserves (source: https://github.com/yubi-OS/yubiOS/blob/main/refs/sbsign-pkcs11-validate-2026-07-23.md, jev weight 0.5970).
