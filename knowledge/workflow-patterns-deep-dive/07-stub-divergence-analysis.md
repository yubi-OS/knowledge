# 07 - Stub Divergence Analysis

Scope: The 8 concrete divergences between `ci_test_sealed-uki-vm.yml` and the canonical signing lane, why each one breaks, and the upstream tooling facts that settle which variant is correct.

## The divergences

The sealed-UKI-VM stub (and its design-doc sketch) diverges from the canonical `ci_mkosi-installer.yml` lane in 8 ways:

1. `--free` slot allocator versus `--slot 0`: the stub hard-codes the token slot.
2. `SOFTHSM2_CONF` is not set: the stub relies on the `~/.config/softhsm2/softhsm2.conf` default.
3. No private-key import: the stub cannot sign anything.
4. No cert generation: there is no `mkosi.secure-boot.pem` to feed sbverify.
5. `engine:pkcs11` in the design-doc sketch: violates ADR-008, which mandates `provider:pkcs11`.
6. `libsofthsm2.so` path: the design doc says `/usr/lib64/libsofthsm2.so` (Fedora path), which is wrong for the dhi container that is Debian-based; the correct Debian path is `/usr/lib/softhsm/libsofthsm2.so`.
7. No OVMF_CODE.fd / OVMF_VARS.fd provisioning (no workflow does this).
8. No ROTPK enrollment into OVMF `db` (no workflow does this).

## Why the config variable diverges

SoftHSM reads its configuration from a default location that can be relocated with the `SOFTHSM2_CONF` environment variable (source: https://manpages.debian.org/testing/softhsm2/softhsm2.conf.5.en.html, weight 0.90; source: https://github.com/softhsm/SoftHSMv2, weight 0.97). Inside a mkosi sandbox the home directory default is not the workflow's home, so the unqualified default resolves to nothing usable, and the stub hits `C_Initialize error 5` when the token layer cannot initialize. The canonical lane sidesteps the whole class of failure by writing its own config to `/run/yubios-hsm/softhsm2.conf` and passing the variable on every call. Community reports of non-root token-creation failures trace to exactly this config-location trap (weak backing: https://stackoverflow.com/questions/53230852/error-creating-token-via-softhsm2-as-non-root-user-coul, weight 0.03).

The `softhsm2-util` utility handles token initialization and object import, the two operations the stub needs to work (weak backing: https://deepwiki.com/softhsm/SoftHSMv2/9.1-softhsm2-util, weight 0.67). Without the import step (divergence 3) there is no key material in the token, so no later signing step can succeed regardless of the config fix.

## Why engine:pkcs11 is wrong

The OpenSSL engine API is the pre-3.0 integration path; OpenSSL 3.0 deprecated it and migration documentation warns that engine API use can bypass provider selection and configuration with unintended consequences (source: https://docs.openssl.org/3.2/man7/ossl-guide-migration/, weight 0.88). The pkcs11-provider project is the connector that lets OpenSSL make proper use of PKCS#11 drivers and targets PKCS#11 3.2 with backwards compatibility to 2.40 (source: https://github.com/openssl-projects/pkcs11-provider, weight 0.73). The provider module is documented as an OpenSSL provider interfacing directly with pkcs11 drivers, introduced with the 3.0 modular system (weak backing: https://www.mankier.com/7/provider-pkcs11, weight 0.12). ADR-008 encodes this as policy: yubiOS signs with `provider:pkcs11`, so a design sketch that says `engine:pkcs11` is not a style difference, it is a spec violation. Even practical setup guides for OpenSSL plus PKCS#11 signing now route through provider configuration (source: https://docs.digicert.com/en/software-trust-manager/client-tools/signing-tools/third-party-signing-t, weight 0.83), and working through the provider CLI is the path active OpenSSL discussions recommend (weak backing: https://github.com/openssl/openssl/discussions/24472, weight 0.56).

## Why the path diverges

The design doc's `/usr/lib64/libsofthsm2.so` is the Fedora multilib path. The canonical container is dhi.io/debian-base, a Debian image, where the module installs at `/usr/lib/softhsm/libsofthsm2.so`. A wrong module path fails the provider initialization before any signing starts. This is a container-boundary assumption error: the doc assumed the host distribution's layout rather than the pinned image's.

## Why the slot diverges

`softhsm2-util --init-token --free` allocates the first free slot, which is robust when the token store is ephemeral and rebuilt every run. `--slot 0` hard-codes a slot index that only exists if the store was populated in a specific order. Combined with divergence 2 (no explicit config), the stub's bootstrap would target a slot in a store it never wrote.

## Takeaway

The stub is not one bug but a chain: no config, no token, no key, no cert, and a provider-policy violation in the sketch. Each link fails independently, which is why the earlier failed runs look confusing. The fix series restores the canonical block wholesale rather than patching the stub one divergence at a time, and the sbverify gate (doc 06) converts whatever remains into a signing-stage error instead of a downstream OVMF rejection.
