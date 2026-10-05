# 01: PIV slot 9c UKI signing and the Secure Boot verification chain

Scope: how a YubiKey's PIV slot 9c private key signs the UKI and boot manager that Secure Boot verifies, via sbsign and sbctl through the YKCS11 PKCS#11 module, and how the resulting keys are enrolled into UEFI.

## The signing key lives on the token

The owner-held root of trust starts with the Secure Boot signing key never leaving hardware. The System Transparency project documents generating Secure Boot keys directly on a YubiKey 5 and using them to sign EFI applications: the flow installs `sbsigntool`, Yubico's `ykcs11` PKCS#11 module, and openssl's PKCS#11 engine, then exports `PKCS11_MODULE_PATH` so sbsign can reach the token (source: https://docs.system-transparency.org/st-1.3.0/docs/how-to/secure-boot/sign-efi-applications/yubikey/ , jev noul 0.73).

YKCS11 is the bridge: it exposes the YubiKey's PIV applet as a standard PKCS#11 token. Yubico's documentation notes that with the default PIV installation, testing EC keys works only on slot 9C, because `pkcs11-tool --test-ec` assumes the same user can both generate a keypair and sign data. This is what pins the signing role to 9c in practice (source: https://docs.yubico.com/software/yubikey/tools/pivtool/piv-tool-ykcs11.html , jev noul 0.71). The module also carries the operational caveat that a default user PIN exists and must be changed, which keeps the signing key PIN-gated rather than open (source: https://developers.yubico.com/yubico-piv-tool/YKCS11/ , jev noul 0.86).

## sbsign and sbctl as the two signing paths

`sbsign` from sbsigntools is the low-level signer: given a private key and certificate it produces a signed EFI binary. The Gentoo unified kernel image wiki shows the wiring of `uefi_secureboot_cert` and `uefi_secureboot_key` pointing at the db key material, and stresses that when Secure Boot is enabled the boot loader itself must also be signed if one is used (source: https://wiki.gentoo.org/wiki/Unified_kernel_image , jev noul 0.77).

`sbctl` is the higher-level manager. It describes itself as a user-friendly secure boot key manager capable of setting up secure boot, offering key management, and keeping track of files that need to be signed in the boot chain (source: https://github.com/Foxboron/sbctl , jev noul 0.93). Its feature list covers live enrollment of keys into UEFI, a signing database that tracks files to sign, and verification of the ESP for files missing signatures (source: https://github.com/Foxboron/sbctl , jev noul 0.87). Release artifacts show the full ceremony in action: secure boot keys created, new keys enrolled into UEFI, and `systemd-bootx64.efi.signed` produced by a single flow (source: https://github.com/Foxboron/sbctl/releases , jev noul 0.89).

ArchWiki documents the per-file signing step with sbctl, for example `sbctl sign -s -o /usr/lib/systemd/boot/efi/systemd-bootx64.efi.signed /usr/lib/systemd/boot/efi/systemd-bootx64.efi`, and notes that most of the setup requires efitools plus private keys and certificates in various formats (source: https://wiki.archlinux.org/title/Unified_Extensible_Firmware_Interface/Secure_Boot , jev noul 0.85). CachyOS's wiki shows the enrollment step `sbctl enroll-keys --microsoft` and the check that vendor keys show up as builtin keys needing re-enrollment otherwise (source: https://wiki.cachyos.org/configuration/secure_boot_setup/ , jev noul 0.81).

## Why this is the boot-time boundary

The chain is: PIV 9c signs the UKI (kernel, initrd, cmdline in one signed blob) and the boot manager; sbctl enrolls the db key into UEFI firmware; firmware verifies the UKI before the FIDO2 unlock inside the initrd can ever run. Two properties matter for the anchor argument. First, the private key is PIN-gated hardware: every signing operation is a deliberate act on the token. Second, the signing database in sbctl exists precisely because the chain is only as strong as its weakest unsigned link, so a signing tool that tracks what needs re-signing after each kernel update is load-bearing, not cosmetic (source: https://github.com/Foxboron/sbctl , jev noul 0.93).

The trade-off inherited from PIV is explicit in the source problem family: PIV needs a PIN at each signing operation and an RSA or EC decrypt on-device. That cost is acceptable here because signing is infrequent (one event per kernel update) and the result covers the whole boot chain, which is why this boundary keeps PIV where the disk-unlock boundary rejected it.
