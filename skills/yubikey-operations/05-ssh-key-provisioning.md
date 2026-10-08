# 05 - SSH Key Provisioning

Scope: generating and wiring SSH keys backed by the YubiKey, from PIV slot 9a via PKCS#11 and from FIDO2 sk keys (ed25519-sk, ecdsa-sk, resident), plus the yubiOS keyfile naming convention.

## Two paths to an SSH key

The source doc (`yubi-OS/yubiOS skills/yubikey-operations/SKILL.md`) gives two provisioning paths. The first generates the key inside the PIV applet on slot 9a and exposes it to SSH through the OpenSC PKCS#11 provider. The second uses OpenSSH's native FIDO2 sk key types, where the key material stays inside the FIDO2 application.

### Path 1: PIV slot 9a via PKCS#11

The source doc commands:

```bash
# Generate key on YubiKey
yubico-piv-tool -a generate -s 9a -A RSA2048 -o pubkey.pem
# Or with ed25519 (YubiKey 5 firmware >= 5.3)
yubico-piv-tool -a generate -s 9a -A ED25519 -o pubkey.pem

# Add to authorized_keys
ssh-keygen -D /usr/lib/x86_64-linux-gnu/opensc-pkcs11.so >> ~/.ssh/authorized_keys

# ssh-agent integration
ssh-add -s /usr/lib/x86_64-linux-gnu/opensc-pkcs11.so
```

Slot 9a is the user-auth root in the yubiOS convention, which is why SSH auth goes here and not to slot 9c (source doc; see doc 02 for the full slot map). The OpenSC PKCS#11 provider is the bridge; Yubico maintains the PIV documentation covering the slot semantics behind it (https://developers.yubico.com/PIV/Introduction/Certificate_slots.html, weight 0.92).

### Path 2: FIDO2 sk keys

The source doc commands:

```bash
# ed25519-sk (non-resident; user presence required, PIN optional)
ssh-keygen -t ed25519-sk -f ~/.ssh/id_yubico_ed25519_sk
# ecdsa-sk with PIN
ssh-keygen -t ecdsa-sk -O verify-required -O resident -f ~/.ssh/id_yubico_ecdsa_sk_resident
```

Yubico's own SSH documentation grounds the details: `ssh-keygen -t ed25519-sk` is a modern EdDSA key backed by the security key, and it requires YubiKey firmware 5.2.3 or newer; on older firmware, use ecdsa-sk instead. The `-O resident` option stores the credential on the YubiKey itself, so you can recover it on another machine with `ssh-keygen -K` instead of copying files, and it requires a YubiKey with FIDO2 support (https://developers.yubico.com/SSH/Securing_SSH_with_FIDO2.html, weight 0.90).

The same Yubico SSH section notes that OpenSSH 8.2 added support for FIDO-backed keys, that the Security Key Series, YubiKey 5 Series, and YubiKey Bio Series all support SSH authentication with FIDO2, and that resident key files can be downloaded from the key (https://developers.yubico.com/SSH/, weight 0.88). A community resident-key guide, at weak weight 0.19, walks the recovery flow: `ssh-keygen -K` retrieves the key from the YubiKey and writes the keypair, still protected by the YubiKey, into the working directory (https://gist.github.com/Kranzes/be4fffba5da3799ee93134dc68a4c67b, weight 0.19, weak backing).

## The naming convention

The yubiOS convention: name the SSH key file `id_yubico_<algo>_<resident?>` so any reader knows it is YubiKey-backed and whether it requires touch (source doc). So `id_yubico_ed25519_sk` and `id_yubico_ecdsa_sk_resident`. The name encodes two facts a responder needs in an incident: which hardware backs the key, and whether presenting it requires physical touch.

## Choosing between the paths

The decision is about where the key lives and who attests it:

- PIV slot 9a via PKCS#11 suits environments already managing PIV certificates, and offers the attestation chain documented in doc 08. It needs the OpenSC provider present on every machine that authenticates.
- FIDO2 sk keys need no PIV certificate at all; ssh-keygen talks to the FIDO2 application directly. ed25519-sk on firmware 5.2.3 or newer is the modern choice (https://developers.yubico.com/SSH/Securing_SSH_with_FIDO2.html, weight 0.90). Resident keys trade slot capacity for portability: the credential lives on the key and can be re-materialized on any machine with `ssh-keygen -K`.

## Verification

Whatever the path, verify before declaring the key provisioned. For the PKCS#11 path, `ssh-keygen -D <provider>` listing the public key confirms the provider can talk to slot 9a. For FIDO2, `ssh-keygen -K` (for resident keys) or a test `ssh -i` connection confirms touch enforcement. Yubico's Git-signing documentation, at weight 0.85, notes the debug pattern for FIDO-backed signing failures: ensure the correct key is added and the YubiKey is accessible, and sometimes `ssh-add -D` followed by re-adding the specific key helps (https://developers.yubico.com/SSH/Securing_git_with_SSH_and_FIDO2.html, weight 0.85). The same accessibility discipline applies to SSH auth.

## Takeaway

Slot 9a through PKCS#11 for certificate-managed environments, ed25519-sk (or ecdsa-sk on older firmware) for everything else, resident keys when portability matters more than slot budget, and names that carry the hardware facts. The key never leaves the token on either path; what lands in authorized_keys is a public key backed by hardware that cannot be copied.
