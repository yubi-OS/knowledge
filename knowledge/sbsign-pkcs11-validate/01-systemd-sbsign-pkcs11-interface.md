# systemd-sbsign as the PKCS#11 signing interface

Scope: systemd-sbsign as the modern signing interface for PE and UKI artifacts: the `--private-key-source` engine and provider forms, the `--private-key` PKCS#11 URI, and where this fits a UKI build.

## What systemd-sbsign is

`systemd-sbsign` signs PE binaries for EFI Secure Boot (source: https://www.freedesktop.org/software/systemd/man/latest/systemd-sbsign.html, jev weight 0.9566). It is the tool that carries the signing step of a UKI (Unified Kernel Image) build: a UKI is a single PE binary that can boot directly from UEFI firmware or be sourced by bootloaders with little or no configuration (source: https://wiki.archlinux.org/title/Unified_kernel_image, jev weight 0.7182). `ukify` is the companion whose primary purpose is to combine components, usually a kernel, an initrd, and the systemd-stub UEFI stub, into that single PE binary (source: https://www.freedesktop.org/software/systemd/man/ukify.html, jev weight 0.8874).

## The key-source selection mechanism

The central interface detail: `--private-key=` takes a path or a URI that will be passed to the OpenSSL engine or provider, as specified by `--private-key-source=` as a "type:name" tuple, such as "engine:pkcs11" (source: https://www.man7.org/linux/man-pages/man1/systemd-sbsign.1.html, jev weight 0.9397; corroborated at https://man.archlinux.org/man/systemd-sbsign.1, jev weight 0.9364, and https://manpages.debian.org/trixie/systemd-repart/systemd-sbsign.1.en.html, jev weight 0.7348). The same tuple shape supports the provider form: the Arch manual pages show "provider:pkcs11" as the alternative value alongside "engine:pkcs11" (source: https://man.archlinux.org/man/systemd-sbsign.1.en, jev weight 0.8022). The engine form routes the key reference through OpenSSL's legacy engine layer; the provider form routes it through OpenSSL 3's provider layer. Both accept a PKCS#11 URI in the `--private-key=` argument.

The certificate side has its own selector: the `--certificate-source` option takes one of "file" or "provider", with the latter followed by a specific provider identifier (source: https://manpages.ubuntu.com/manpages/questing/man1/systemd-sbsign.1.html, jev weight 0.9074). A PKCS#11 signing flow therefore has two independent knobs: where the private key comes from (engine or provider) and where the certificate comes from (file or provider). A YubiKey PIV flow typically pins the certificate to a file (the exported Secure Boot certificate) while the private key stays on the token.

## The yubiOS signing shape

yubiOS's validation recipe exercises exactly this interface with a YubiKey PIV key:

```
systemd-sbsign sign \
  --private-key "pkcs11:manufacturer=piv_II;id=%9c;type=private" \
  --private-key-source engine:pkcs11 \
  --certificate /etc/yubico/sb-cert.pem \
  --output yubiOS.signed.efi \
  yubiOS.efi
```

(source: https://github.com/yubi-OS/yubiOS/blob/main/refs/sbsign-pkcs11-validate-2026-07-23.md, jev weight 0.5970.)

Three properties of that command are worth pinning down. First, the key is referenced by PKCS#11 URI rather than by module path plus object ID: `manufacturer=piv_II` selects the PIV application, `id=%9c` selects slot 9c with URL percent-encoding, and `type=private` restricts the match to private key objects. Second, the engine form (`engine:pkcs11`) is the documented yubiOS value even though the provider form exists; the source doc's cross-check against mkosi upstream confirmed the validation shape matches current upstream capability (source: https://github.com/yubi-OS/yubiOS/blob/main/refs/sbsign-pkcs11-validate-2026-07-23.md, jev weight 0.5970). Third, the output is a separate signed artifact (`yubiOS.signed.efi`) rather than an in-place rewrite, which keeps the unsigned input available for repeat signing attempts during validation.

## Why this interface matters for a corpus

Everything downstream in this corpus hangs off this command shape. The YubiKey PIV module that must answer the URI is the subject of doc 02. The SoftHSM2 software token that can stand in for the YubiKey during dry runs builds the same URI against a different module (doc 03). The engine versus provider split is itself the largest cross-version trap in this area, because the legacy engine path has shipped real regressions (doc 04). The verification half of the loop, `osslsigncode verify` against the signed output, closes the loop (doc 05). And mkosi wires this same `engine:pkcs11` / `provider:pkcs11` selection into image builds (doc 06).

A claim with no direct source behind it in this corpus: do not assume the `type=private` URI component is optional. Every URI in this corpus that works carries it, and dropping URI components changes which token object the module selects.
