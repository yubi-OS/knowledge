# YubiKey PIV slot 9c through ykcs11

Scope: the YubiKey PIV application as a Secure Boot signing key through the ykcs11 PKCS#11 module, slot 9c semantics, and module discovery via p11-kit.

## ykcs11: the module that speaks for PIV

YKCS11 is a PKCS#11 module that allows external applications to communicate with the PIV application running on a YubiKey, and it is based on version 2.40 of the PKCS#11 (Cryptoki) specification (source: https://developers.yubico.com/yubico-piv-tool/YKCS11/, jev weight 0.9380). The module ships inside the yubico-piv-tool project; its user guide covers the module itself, key mapping, key generation, attestation certificates, user types, PINs and the management key (source: https://docs.yubico.com/software/yubikey/tools/pivtool/index.html, jev weight 0.8717; module-specific page at https://docs.yubico.com/software/yubikey/tools/pivtool/piv-tool-ykcs11.html, jev weight 0.8645).

This is the module that answers a PKCS#11 URI of the form `pkcs11:manufacturer=piv_II;id=%9c;type=private`: the `manufacturer=piv_II` component names the PIV token presented by ykcs11 (source: https://github.com/yubi-OS/yubiOS/blob/main/refs/sbsign-pkcs11-validate-2026-07-23.md, jev weight 0.5970).

## Why slot 9c is the signing slot

The slot choice is not arbitrary. With the default installation of the YubiKey's PIV, testing EC keys works only on slot 9C, because `pkcs11-tool --test-ec` assumes that the same user can both generate a keypair and sign data (source: https://docs.yubico.com/software/yubikey/tools/pivtool/piv-tool-ykcs11.html, jev weight 0.8645; same statement at https://developers.yubico.com/yubico-piv-tool/YKCS11/Supported_applications/pkcs11tool.html, jev weight 0.7069, and in the in-repo doc at https://github.com/Yubico/yubico-piv-tool/blob/master/doc/YKCS11/Supported_applications/pkcs11tool.adoc, jev weight 0.9208). Slot 9c is the PIV slot where generation and signing land under the same authorization, which is why the yubiOS signing URI pins `id=%9c` rather than a different PIV slot. The module source itself lives at https://github.com/Yubico/yubico-piv-tool/blob/master/ykcs11/ykcs11.c (jev weight 0.6257) for anyone debugging URI-to-object mapping behavior directly.

## Discovery: p11-kit and the missing .module file

The repo's validation shape starts with `p11-kit list-modules | grep ykcs11` (source: https://github.com/yubi-OS/yubiOS/blob/main/refs/sbsign-pkcs11-validate-2026-07-23.md, jev weight 0.5970). p11-kit exists to solve problems coordinating the use of PKCS#11 by different components or libraries living in the same process, by providing a way to load and enumerate PKCS#11 modules plus a standard proxy module (source: https://github.com/p11-glue/p11-kit, jev weight 0.6769). The command line tool performs operations on PKCS#11 modules configured on the system, with subcommands per operation (source: https://man.archlinux.org/man/p11-kit.8.en, jev weight 0.6321), including listing the modules and the tokens present in them (source: https://manpages.opensuse.org/Tumbleweed/p11-kit-tools/p11-kit.8.en.html, jev weight 0.5388).

The grep step matters because of a packaging gap: ykcs11 does not install a p11-kit module file, while the distribution package of OpenSC does install a `.module` file that ensures opensc-pkcs11.so is loaded into any well-behaved application automatically (source: https://github.com/Yubico/yubico-piv-tool/issues/92, jev weight 0.9333). Practical consequence: a system can have p11-kit wired to OpenSC's PKCS#11 module out of the box and still not surface ykcs11, even with yubico-piv-tool installed. `p11-kit list-modules` is the check that distinguishes "module present and registered" from "module merely installed", and the yubiOS validation gate uses it exactly that way before any signing attempt.

## Fit with the rest of the corpus

Slot 9c's generate-and-sign-under-one-user property (weakly analogous for other slots) is the reason the validation recipe and the CI gate both anchor on it. The p11-kit registration gap is the first thing to check when a URI that works interactively fails inside a build tool: the build tool resolves the URI through whatever module p11-kit enumerates, and an unregistered ykcs11 is invisible to it. SoftHSM2 (doc 03) sidesteps this by registering its own module, which is part of why the software-token pattern is the canonical dry run before hardware validation.
