# 06 Credential handling hardening: SRK pinning, MITM defenses, and the null key

Scope: the v262 credential-handling hardening, the primary-confirmed SRK pinning change that defends against MITM interposer attacks, the credential encryption key model, and the compatibility consequence for image-based OS provisioning.

## The primary-confirmed change

The systemd-creds manual page carries the key v262 change in plain text: systemd v262 and later additionally pin the encrypted credential to the TPM2's SRK (Storage Root Key) to defend against MITM interposer attacks when decrypting credentials, and this makes the resulting credentials incompatible with earlier systemd versions (source: https://www.freedesktop.org/software/systemd/man/latest/systemd-creds.html, jev weight 0.92).

This is the authoritative confirmation of the MITM-protection direction the source doc recorded ("credential-handling hardening continues: MITM protections around decrypted credentials"). The compatibility sentence is the part an image-based OS must act on: credentials encrypted by a v262-or-later systemd cannot be decrypted by earlier systemd versions.

## The credential model underneath

The systemd credentials concept is documented as the service manager's mechanism for securely acquiring and passing credential data to systems and services, intended for potentially security-sensitive cryptographic keys, certificates, and similar material (source: https://systemd.io/CREDENTIALS/, jev weight 0.94; earlier pass of the same doc at jev weight 0.95).

System and Service Credentials are data objects passed into booted systems or system services as they are invoked, acquired from various external sources and propagated into the system and from there into services; they may optionally be encrypted with a machine-specific key and/or locked to other machine state (source: https://www.freedesktop.org/software/systemd/man/latest/systemd.system-credentials.html, jev weight 0.95; man7 mirror at https://www.man7.org/linux//man-pages/man7/systemd.system-credentials.7.html, jev weight 0.79).

The systemd-creds tool itself is documented as the tool for listing, showing, encrypting, and decrypting unit credentials; credentials are limited-size binary or textual objects passed to unit processes, primarily used for passing cryptographic keys or certificates (source: https://www.freedesktop.org/software/systemd/man/latest/systemd-creds.html, jev weight 0.83 and 0.92 across passes; man7 mirror at https://man7.org/linux/man-pages/man1/systemd-creds.1.html, jev weight 0.77). The docs/CREDENTIALS.md source in the repo carries the same conceptual text (source: https://github.com/systemd/systemd/blob/main/docs/CREDENTIALS.md, jev weights 0.89 and 0.91).

## The null key, weakly backed

The source doc records new controls for boot credentials encrypted with the "null" key. The dig's only mention of null keys is weak-backed: a DeepWiki page notes that credential encryption keys are derived from host machine IDs, fixed null keys, or sealed TPM2 hardware policies (source: https://deepwiki.com/systemd/systemd/8.3-credentials-and-secrets-management, jev weight 0.13, weak backing). This confirms null-key encryption exists as a mode but carries no v262-specific control detail; treat the source doc's claim about new null-key controls as asserted-but-not-primary-confirmed in this dig.

## Weakly backed secondary coverage of v262

Three secondary articles describe v262's security posture and are recorded with weak backing: a linuxcompatible story describing binding of TPM credentials and hardening of boot PIN entry with Argon2id (source: https://www.linuxcompatible.org/story/systemd-262-release-hardwarerooted-security-and-live-updates/, jev weight 0.27, weak backing); an independent analysis noting the same hardware-trust direction with Argon2id chosen as a memory-hard hash to resist brute-force attacks at boot time (source: https://www.abdallaelmorsi.net/systemd-262-restartrandomizeddelaysec-deeper-kexec-live-updates-and-what-actually-breaks/, jev weight 0.29, weak backing); and a brief overview piece on containers, security, and virtualization in 262 (source: https://informatecdigital.com/en/New-features-and-improvements-of-systemd-262-for-Linux/, jev weight 0.15, weak backing). These corroborate direction, not specifics.

Practical hardening context for the tool itself, from the ArchWiki page: systemd-creds is designed to securely store and retrieve credentials used by systemd units, covering usernames, passwords, API keys, and other authentication data (source: https://wiki.archlinux.org/title/Systemd-creds, jev weight 0.86).

## Impact for an image-based OS consumer

Two consequences matter. First, the compatibility cliff is primary-confirmed: any image or provisioning flow that encrypts credentials with a v262-or-later systemd produces blobs that earlier systemd versions cannot decrypt, so a golden image and its runtime stack must cross the v262 boundary together. Second, for yubiOS specifically, the source doc marks this as relevant to the credential-ingest patterns used for provisioning secrets; the audit verdict remains that this is hardening to adopt deliberately at the next image refresh, not a breakage, since yubiOS does not depend on cross-version credential portability in its current flows.
