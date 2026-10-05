# 06 - Secure Boot Signing Pattern

Scope: The canonical Secure Boot signing lane in yubiOS CI: SoftHSM token bootstrap, mkosi signing through `provider:pkcs11` with systemd-sbsign per ADR-008, the sbverify gate, and the mkosi.conf Validation block.

## Why systemd-sbsign and provider:pkcs11

ADR-008 selects `systemd-sbsign` over the legacy `sbsigntools` for UKI signing. The systemd-sbsign tool takes its private key and certificate from a PEM file or from a URI passed to the OpenSSL provider configured with `--certificate-source`, which accepts `file` or `provider` followed by a provider identifier such as `provider:pkcs11` (source: https://www.man7.org/linux/man-pages/man1/systemd-sbsign.1.html, weight 0.79; source: https://www.freedesktop.org/software/systemd/man/latest/systemd-sbsign.html, weight 0.93). This is the provider-era interface: OpenSSL 3.0 deprecated the engine API in favor of the provider API, and migration guides flag that continued engine use can bypass provider selection with unintended consequences (source: https://docs.openssl.org/3.2/man7/ossl-guide-migration/, weight 0.88). Other projects document the same forced migration, citing the engine-to-provider move as urgent for PKCS#11 HSM access (source: https://gitlab.isc.org/isc-projects/bind9/-/issues/2996, weight 0.81). The upstream pkcs11-provider project is the connector that lets OpenSSL make proper use of PKCS#11 drivers (source: https://github.com/openssl-projects/pkcs11-provider, weight 0.73).

## The canonical SoftHSM bootstrap

The canonical bootstrap, verbatim from `ci_mkosi-installer.yml` lines 277-295, generates a non-production test key, wraps it as PKCS#8, initializes a SoftHSM token, imports the key, and records the PKCS#11 URI:

```bash
mkdir -p /run/yubios-hsm/tokens
openssl req -x509 -newkey rsa:3072 -sha256 -days 365 -nodes \
  -subj "/CN=yubiOS reproducibility test Secure Boot (non-production)/" \
  -keyout sb.key -out mkosi.secure-boot.pem
openssl pkcs8 -topk8 -nocrypt -in sb.key -out sb.p8
printf 'directories.tokendir = /run/yubios-hsm/tokens\nobjectstore.backend = file\n' \
  | tee /run/yubios-hsm/softhsm2.conf
SOFTHSM2_CONF=/run/yubios-hsm/softhsm2.conf \
  softhsm2-util --init-token --free --label yubios-9c --pin 123456 --so-pin 123456
SOFTHSM2_CONF=/run/yubios-hsm/softhsm2.conf \
  softhsm2-util --import sb.p8 --token yubios-9c --label piv-9c --id 9c --pin 123456
printf 'pkcs11:token=yubios-9c;object=piv-9c;type=private?pin-value=123456' \
  > mkosi.secure-boot.pkcs11-uri
```

Two details are load-bearing. First, `SOFTHSM2_CONF` is set on every softhsm2-util invocation pointing at an explicitly written config; the SoftHSM docs state the config location can be relocated via the `SOFTHSM2_CONF` environment variable (source: https://manpages.debian.org/testing/softhsm2/softhsm2.conf.5.en.html, weight 0.90; source: https://github.com/softhsm/SoftHSMv2, weight 0.97). Second, the token directory lives under `/run`, an ephemeral path, so each run starts from a clean token store.

## The canonical signing invocation

mkosi is invoked with the signing configuration inline: tools-tree packages for softhsm2 and pkcs11-provider, environment variables pointing at the SoftHSM config and provider module, `--secure-boot-key-source provider:pkcs11`, the PKCS#11 URI as the key, the generated PEM as the certificate, `--secure-boot-sign-tool systemd-sbsign`, and the same provider wiring for the expected-PCR signing key. This is the ADR-008 pattern: the private key never leaves the PKCS#11 token, mkosi hands the URI to systemd-sbsign, and systemd-sbsign does the signing through the OpenSSL provider layer.

## The sbverify gate

After signing and before QEMU boot, the canonical lane verifies the UKI against the signing certificate:

```bash
uki=$(find mkosi.output -name '*.efi' -type f -print -quit)
test -n "$uki"
sbverify --cert mkosi.secure-boot.pem "$uki"
```

sbverify is the UEFI secure boot verification tool that checks an EFI image against a supplied X.509 certificate (source: https://man.archlinux.org/man/extra/sbsigntools/sbverify.1.en, weight 0.87; source: https://manpages.opensuse.org/Tumbleweed/sbsigntools/sbverify.1.en.html, weight 0.85). A UKI is a single executable combining the kernel, initrd, and other boot resources, bootable directly from UEFI firmware (source: https://wiki.archlinux.org/title/Unified_kernel_image, weight 0.83). The gate matters operationally: it converts a signing failure into a signing-stage error instead of an OVMF rejection downstream that looks like a Secure Boot violation (doc 07 covers the stub that skips this gate).

## The Validation block

The repo-root `mkosi.conf` carries the matching build-time policy:

```ini
[Validation]
# SecureBoot=yes: UKIs signed at build time via systemd-sbsign (ADR-008).
# YubiKey PIV (slot 9c, PKCS#11) signing: run yubiOS-enroll-sb post-install.
SecureBoot=yes
SignExpectedPcr=no
```

`MinimumVersion=26~devel` at line 8 is the version gate that makes `--secure-boot-key-source provider:pkcs11` available in mkosi. The comment also records the production path: YubiKey PIV slot 9c signing via the `yubiOS-enroll-sb` post-install flow, with the SoftHSM lane standing in for reproducibility CI.

## Takeaway

The canonical lane is 4 moving parts aligned: a token-backed key (SoftHSM), a provider-based key source (`provider:pkcs11`), a provider-era signing tool (systemd-sbsign), and a verification gate (sbverify) before the firmware ever sees the image. Any workflow signing UKIs in this org should copy the lane wholesale, and the mkosi ecosystem documentation describes the same end-to-end signing workflow from development environments through production keys (weak backing: https://deepwiki.com/systemd/mkosi/5.5-secure-boot-and-signing, weight 0.67).
