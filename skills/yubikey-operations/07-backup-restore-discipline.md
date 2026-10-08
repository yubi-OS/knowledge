# 07 - Backup and Restore Discipline

Scope: treating YubiKey enrollment as a destructive operation, and the ordered ceremony that protects continuity of signing and decryption across a key rotation.

## Why enrollment is destructive

yubiOS treats YubiKey enrollment as a destructive operation: re-enrolling a slot 9c replaces the existing key (source doc: `yubi-OS/yubiOS skills/yubikey-operations/SKILL.md`). There is no undo at the device level. The private key that leaves slot 9c is gone unless a generation history was preserved somewhere first, which is exactly what the retired slots and the pre-enroll export are for.

## The five-step discipline

The source doc prescribes the ceremony in order:

1. Before enrollment: export the existing attestation certificate (`ykman piv export-cert 9c pre-enroll.pem`).
2. Before enrollment: if replacing an active key, ensure the consumer has the new key enrolled alongside the old (`ssh-add -s ...` with both PKCS#11 providers loaded).
3. After enrollment: verify the new slot 9c works (sign a test message, decrypt a test ciphertext).
4. After enrollment: re-sign any artifacts signed by the old key if signature continuity matters (UKIs, Git tags, age recipients).
5. Old key rotation: the old key moves to slot 82 (Retired Key 1). It can still sign, but yubiOS convention is to retire it from active use after 90 days.

## Tooling behind each step

Step 1 and step 5 run on ykman. The YubiKey Manager CLI guide documents the PIV certificate subcommands: `ykman piv certificates export [OPTIONS] SLOT CERTIFICATE`, plus generate, import, and request, alongside `ykman piv info` and `ykman piv keys` (https://docs.yubico.com/software/yubikey/tools/ykman/, weight 0.93). The PIV commands reference confirms export of an X.509 certificate from a PIV slot as a first-class operation (https://docs.yubico.com/software/yubikey/tools/ykman/PIV_Commands.html, weight 0.94). The ykman Python API at weight 0.88 exposes the same operations programmatically, including pivman management-key setting, PIN changes, and PIN/PUK retry-attempt configuration (https://developers.yubico.com/yubikey-manager/API_Documentation/autoapi/ykman/piv/index.html, weight 0.88).

Moving the old key into slot 82 is a first-class operation too: Yubico documents `yubico-piv-tool -a move-key -s 9c --t <target>`, which moves a key from one PIV slot to another and requires YubiKey 5.7 or higher (https://developers.yubico.com/yubico-piv-tool/Actions/key_move.html, weight 0.85). Note this is newer firmware than the hmac-secret and resident-key features need (5.2.3); a rotation plan should check the firmware floor for move-key before relying on it.

The attestation export in step 1 pairs with slot F9: the attestation key attests that keys in 9A, 9C, 9D, 9E, or the retired slots were generated on the YubiKey (https://docs.yubico.com/yesdk/users-manual/application-piv/slots.html, weight 0.93). Exporting the attestation certificate before overwrite preserves the provenance claim for the generation being retired.

## The dual-enrollment window

Step 2 is the discipline's heart: the new key is enrolled into every consumer while the old key is still active. For SSH that means both PKCS#11 providers loaded in ssh-agent (source doc). For age, both recipients present on new ciphertext. For LUKS2 and homed, both FIDO2 enrollments on the volume. Only after every consumer accepts the new key does the destructive regeneration proceed. Skipping the window is how a rotation becomes an outage: the old key is gone, the consumers still hold salts and recipients bound to it, and nothing decrypts.

## Verification before trust

Step 3 makes the ceremony evidence-based: sign a test message, decrypt a test ciphertext, and only then consider the new slot live. This mirrors the git-signing debug posture Yubico documents at weight 0.85: verify the correct key is added and the key is accessible, and re-add identities when the agent holds the wrong one (https://developers.yubico.com/SSH/Securing_git_with_SSH_and_FIDO2.html, weight 0.85).

## The 90-day retirement rule

After rotation, the old key lives in slot 82, can still sign, and is retired from active use after 90 days (source doc). The window exists so stragglers survive: an artifact signed by the old key last week can still be countersigned or renewed by the holder of slot 82 during the grace period. After 90 days the retired generation is history, not an active signing identity.

## The PIN discipline that backs restore

Rotation is only safe if the new enrollment can be driven by the operator, which makes PIN handling part of the discipline. The source doc's anti-pattern list forbids reusing the same PIN across multiple YubiKeys: if one key's PIN is compromised, all are compromised. The yubiOS convention is a per-device random PIN stored in a password manager with 2FA-protected access (source doc). It also forbids storing the recovery PIN in a password manager that requires the same YubiKey, the circular dependency where losing the key loses the manager, the PIN, and the key: the recovery PIN must be stored offline, paper in a safe, two halves in two physical locations (source doc).

## Takeaway

The discipline is five ordered steps: export attestation, dual-enroll consumers, regenerate, verify and re-sign, retire the old generation to slot 82 for 90 days. Every step exists because the operation underneath it cannot be undone. Enrollment is destructive; the ceremony is what makes it survivable.
