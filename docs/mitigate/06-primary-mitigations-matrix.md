# 06. Primary Mitigations Matrix

Scope: the mitigation matrix half of the source doc (yubi-OS/yubiOS docs/MITIGATE.md, sections "Threat Model Summary" and "Primary Mitigations"): the trust model assumptions and the threat by threat table with residual risks.

## Threat model assumptions

The source doc fixes the model in four rows:

- Owner: controls the YubiKey, the recovery key, Secure Boot enrollment, and the installation target.
- Attacker: may control the network, a registry mirror, the disk at rest, or a stolen powered-off device.
- Strong attacker: may have temporary physical access, malicious firmware supply chain influence, or compromised CI inputs.
- Out of scope: defeating a malicious CPU or SoC, closed source ROM behaviour, or an owner who enrolls malicious keys.

## The threat by threat table

All rows are source doc claims:

- Disk theft: LUKS2 root and swap with FIDO2 hmac-secret, PIN, touch, and an offline recovery key. Residual risk: an attacker with both the YubiKey and the PIN can unlock. systemd's direct support for unlocking LUKS2 volumes with FIDO2 hmac-secret arrived in systemd v248 (https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware/, jev weight 0.64), and the hmac-secret extension plus PIN is the documented systemd-homed pattern (https://wiki.archlinux.org/title/Systemd-homed, jev weight 0.53).
- Silent disk decryption: FIDO2 physical presence and PIN. Residual risk: malware running after unlock can access mounted plaintext while the session is active.
- Mutable /usr tampering: composefs over erofs with dm-verity and the signed UKI command line. Residual risk: firmware or kernel compromise can subvert the checks below Linux.
- Malicious base image drift: digest pins in PINNED.md, build policy, provenance and SBOM. Residual risk: pins require active refresh for security fixes.
- Secure Boot key substitution: owner enrolled db key, PIV backed signing, sbverify in CI. Residual risk: OEM firmware behaviour is still trusted on x86-64.
- TPM-bound update lockout: FIDO2 hmac-secret avoids the PCR hash bound LUKS unlock. Residual risk: FIDO2 does not prove which OS asked for the secret.
- Weak local auth: pam-u2f at 1.3.1 or later with the required PAM flow. Residual risk: emergency recovery paths must stay guarded and documented.
- Per-user data exposure: systemd-homed LUKS2 homes with per user FIDO2 credentials. Residual risk: an active logged-in session remains plaintext to that user's processes.
- Registry TLS downgrade: OpenSSL 3.5+ and Go 1.24+ defaults for X25519MLKEM768. Residual risk: server side support and future library defaults must keep being checked. External corroboration: OpenSSL 3.5 changed the default TLS supported groups to prefer hybrid post quantum groups including X25519MLKEM768 (https://quantakrypto.com/guides/enabling-post-quantum-tls, jev weight 0.17, weak backing), and since Go 1.24 a default tls.Config negotiates X25519MLKEM768 (https://sslboard.com/blog/go-post-quantum-tls-mlkem.md/, jev weight 0.18, weak backing). A standardisation tracker records the hybrid as the default post quantum key exchange in major browsers and OpenSSL 3 (https://pqaudit.org/algorithms/hybrid-tls-x25519mlkem768/, jev weight 0.34, weak backing).

## The residual risk discipline

Every row in the source doc's table carries a residual risk column, and the residuals are concrete rather than rhetorical: the FIDO2 unlock does not bind to a specific OS request, the digest pins decay without active refresh, and the unlocked session is plaintext by definition. The doc's post quantum TLS row is the newest: it names the exact library versions whose defaults carry the protection and flags that server side support is a moving target.

## Relationship to the Faux Phy half

The primary mitigations table is the steady state counterpart to the Faux Phy chain docs: the chain docs cover an attacker who arrives through the firmware supply chain, this table covers an attacker who arrives with the network, a mirror, a stolen disk, or temporary physical access. The two share the same spine, YubiKey FIDO2 as the trust anchor and signed, measured, hash-pinned artefacts everywhere else, which is why the doc can state the residual risks so briefly: each one is the cost of a deliberate design choice, not an oversight.
