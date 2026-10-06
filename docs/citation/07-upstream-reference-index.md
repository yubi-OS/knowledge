# 07 - Upstream reference index

Scope: the citation doc's internal maintenance section, "Citations And Primary Sources": its stated preference for primary upstream documentation, its per-domain reference index, and its yubiOS internal reference links. Internal-record subtopic, no dig; every claim here is sourced to the source doc.

## The doc's own maintenance rule

The second half of the source doc is titled "Citations And Primary Sources" and carries a last-reviewed stamp of July 11, 2026. Its rule is one sentence: prefer primary upstream documentation, release notes, standards, and source repositories when updating architectural claims. [source doc: yubi-OS/yubiOS docs/CITATION.md]

That rule is the discipline the whole document enforces on itself. Every entry below it is a pointer to a primary source: an upstream man page, a release note, a specification page, or a source repository. The doc does not cite aggregators anywhere in this section.

## The per-domain index

The section is organized into 6 external domains plus one internal block. All entries below are quoted from the source doc; URLs are reproduced as the doc lists them.

### systemd

- systemd v261 release: https://github.com/systemd/systemd/releases/tag/v261
- `systemd.exec(5)` sandboxing directives: https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html
- `systemd-cryptenroll(1)`: https://www.freedesktop.org/software/systemd/man/latest/systemd-cryptenroll.html
- `systemd-repart(8)`: https://www.freedesktop.org/software/systemd/man/latest/systemd-repart.html
- `systemd-sbsign(1)`: https://www.freedesktop.org/software/systemd/man/latest/systemd-sbsign.html
- Discoverable Partitions Specification: https://systemd.io/DISCOVERABLE_PARTITIONS
- Automatic Boot Assessment: https://systemd.io/AUTOMATIC_BOOT_ASSESSMENT

### FIDO2, YubiKey, and local auth

- Yubico PIV tool documentation: https://developers.yubico.com/yubico-piv-tool/
- Yubico pam-u2f security advisory YSA-2025-01: https://www.yubico.com/support/security-advisories/ysa-2025-01/ (the same advisory doc 06 of this corpus explicates)
- OpenSSH 8.2 FIDO2 release notes: https://www.openssh.com/txt/release-8.2
- libfido2 project: https://github.com/Yubico/libfido2

### bootc, OCI, and build tooling

- bootc install documentation: https://bootc.dev/bootc/bootc-install.html
- bootc upstream repository: https://github.com/containers/bootc
- fedora-bootc registry source: https://quay.io/repository/fedora/fedora-bootc
- composefs upstream: https://github.com/containers/composefs
- Docker Buildx build policies: https://docs.docker.com/build/policies/intro/
- Docker attestations: https://docs.docker.com/build/attestations/

### TLS and post-quantum defaults

- OpenSSL 3.5 release notes: https://openssl-library.org/news/openssl-3.5-notes/
- OpenSSL 3.5 group configuration documentation: https://docs.openssl.org/3.5/man3/SSL_CONF_cmd/
- Go 1.24 release notes: https://go.dev/doc/go1.24
- Go issue for default hybrid TLS group: https://github.com/golang/go/issues/69985

### Firmware, ARM64, and TPM work

- ARM Trusted Firmware-A: https://trustedfirmware-a.readthedocs.io/
- OP-TEE documentation: https://optee.readthedocs.io/
- OP-TEE fTPM project: https://github.com/OP-TEE/optee_ftpm
- Microsoft TPM 2.0 reference implementation: https://github.com/microsoft/ms-tpm-20-ref
- U-Boot documentation: https://docs.u-boot.org/
- U-Boot EFI documentation: https://docs.u-boot.org/en/latest/develop/uefi/index.html
- U-Boot measured boot documentation: https://docs.u-boot.org/en/latest/develop/measured_boot.html

### Virtualization and zstd EFI zboot

- QEMU zstd EFI zboot patch discussion: https://lists.nongnu.org/archive/html/qemu-devel/2026-01/msg04080.html
- QEMU project: https://www.qemu.org/docs/master/
- swtpm project: https://github.com/stefanberger/swtpm

## The yubiOS internal references

The section closes with 7 links into yubiOS's own `refs/` planning corpus, each tied to a specific planning or research artifact [source doc: yubi-OS/yubiOS docs/CITATION.md]:

1. Planning cycle for this refresh: refs/planning-cycle-2026-07-11.md
2. v261 base-image research: refs/v261-base-image-bump-2026-07-23.md
3. ARM64 fTPM planning: refs/arm64-ftpm-phase-f0-2026-07-23.md
4. zstd EFI zboot planning: refs/arm64-zstd-efi-zboot-bcvk-2026-07-23.md
5. swtpm CI planning: refs/bcvk-swtpm-ci-2026-07-23.md
6. LUKS FIDO2 E2E planning: refs/luks-fido2-e2e-test-2026-07-23.md
7. PKCS#11 signing validation: refs/sbsign-pkcs11-validate-2026-07-23.md

These internal refs are the working papers behind the upstream citations: the v261 release link pairs with the base-image research, the PKCS#11 domain pairs with the sbsign signing validation, and the firmware domain pairs with the ARM64 fTPM planning.

## Related internal design docs

Elsewhere the source doc points at 3 more internal documents: internal design rationale lives in ADR.md, the firmware-supply-chain threat model the project closes is in MITIGATE.md, and the post-launch ARM64 secure-world plan is in FUTURE.md, all in the same yubiOS docs/ directory. [source doc: yubi-OS/yubiOS docs/CITATION.md]

## Reading order

For a reader updating architectural claims in yubiOS, the doc's own implied workflow is: find the domain in the index above, follow the primary upstream link, and check the paired internal ref for the planning context of that claim. The first half of the source doc (docs 01 through 06 of this corpus) covers what to cite in external academic or technical work; this section covers what to cite inside the project's own docs. [source doc: yubi-OS/yubiOS docs/CITATION.md]
