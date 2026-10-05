# The verification recipe for signed UKI artifacts

Scope: verifying a signed UKI or PE artifact after the signing step: sbverify against the embedded signature, osslsigncode verify with a CAfile, exit-code semantics, and the trap that rebuilding invalidates a signature.

## The two-tool corroboration pattern

yubiOS's validation shape uses signing as the primary gate and verification as the corroborator: after `systemd-sbsign sign` produces the signed artifact, `osslsigncode verify -in yubiOS.signed.efi -CAfile /etc/yubico/sb-cert.pem` confirms the PE signature against the certificate (source: https://github.com/yubi-OS/yubiOS/blob/main/refs/sbsign-pkcs11-validate-2026-07-23.md, jev weight 0.5970). The two tools verify different things about the same artifact: sbverify checks the UEFI Secure Boot image signature, osslsigncode checks the Authenticode signature structure. Running both is deliberate redundancy; either alone can pass while the artifact would be rejected in a different trust context.

## sbverify

sbverify is the UEFI secure boot verification tool: `sbverify [options] --cert <certfile> <efi-boot-image>` verifies a UEFI secure boot image against an X.509 certificate (source: https://man.archlinux.org/man/extra/sbsigntools/sbverify.1.en, jev weight 0.8842; same manpage in the openSUSE packaging at https://manpages.opensuse.org/Tumbleweed/sbsigntools/sbverify.1.en.html, jev weight 0.6370). Its option set covers the cases a validation script needs: `--cert <certfile>` to supply the certificate, `--list` to list signatures, `--no-verify` to skip certificate verification, and `--detached <file>` to read a signature from a file instead of looking for an embedded one (weak backing; source: https://www.mankier.com/1/sbverify, jev weight 0.2992; the same option set appears at https://manpages.org/sbverify, jev weight 0.2207).

For UKIs specifically, a unified kernel image is a single executable booted directly from UEFI firmware or sourced by bootloaders with little or no configuration (source: https://wiki.archlinux.org/title/Unified_kernel_image, jev weight 0.5451), so the artifact sbverify sees is the signed UKI PE binary itself.

## osslsigncode

osslsigncode signs and verifies Microsoft Authenticode signatures on supported file formats, and can also extract data for detached signing, attach an externally produced signature, add timestamps, or add unauthenticated blobs (weak backing; source: https://github.com/mtrojnar/osslsigncode/blob/master/osslsigncode.md, jev weight 0.3780; project README at https://github.com/mtrojnar/osslsigncode, jev weight 0.2540). Third-party documentation describes it as a command-line tool used to code sign, timestamp, and verify signatures on executable files, leveraging the OpenSSL library (weak backing; source: https://docs.digicert.com/zf/software-trust-manager/code-signing/sign-with-third-party-signing-tools/windows-applications/sign-authenticode-files-with-osslsigncode-using-openssl-pkcs11-engine.html, jev weight 0.2907).

Two operational details come from weakly-backed sources and are labeled as such. First, `osslsigncode verify -in <file>` reads Authenticode signatures on PE, MSI, CAB, CAT and APPX files without needing Windows, and exits 0 when the signature verifies and 1 when it does not, which is what makes it scriptable as a gate (weak backing; source: https://my-ssl.com/learn/how-to-verify-a-code-signature, jev weight 0.0695). Second, verify fails even when the root CA is present on the system unless the trusted certificates are supplied explicitly with the `-CAfile` parameter (weak backing; source: https://stackoverflow.com/questions/77899291/osslsigncode-verify-fails-even-though-rootca-certificate-is-added-to-the-trust-s, jev weight 0.0435). The yubiOS command carries `-CAfile /etc/yubico/sb-cert.pem` for exactly this reason: an unset trust source is a verify failure that looks like a signature problem but is not.

## The rebuild trap

The failure mode that wastes the most time: rebuilding after signing changes the image and invalidates the signature, so the correct practice is to use sbverify or the distribution's supported verification tool to inspect the embedded signature, then verify on a test machine with the same firmware (weak backing; source: https://danielcosenza.com/posts/lx-howto-unified-kernel-image/, jev weight 0.1328). In a CI context this means the verification step must run against the exact artifact the signing step emitted, never against a re-linked or re-packed copy, or a green verify result is meaningless.

## Why corroborate rather than trust one tool

The Authenticode hash computation itself has known edge cases: the documented steps for computing the Authenticode hash are not correct when sections overlap with the PE header or with one another (weak backing; source: https://docs.clamav.net/appendix/Authenticode.html, jev weight 0.0562). That is not a claim that osslsigncode is wrong; it is a reason the validation recipe treats the signing gate and the corroboration gate as independent checks rather than one authority, and it is the same reasoning behind the yubiOS rule that the signing step is the primary gate while osslsigncode corroborates (source: https://github.com/yubi-OS/yubiOS/blob/main/refs/sbsign-pkcs11-validate-2026-07-23.md, jev weight 0.5970).
