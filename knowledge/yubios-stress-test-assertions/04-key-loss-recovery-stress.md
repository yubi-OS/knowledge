# 04 Key loss and recovery stress

Scope: stress of credential-loss paths: hardware token removed, disk unlock, SSH, PAM, backup-key recovery, and the rule that a single unrecoverable token is a fail.

## Why key loss is the first adversary to test, not the last

Most boot-security testing exercises the happy path: token present, PIN correct, disk opens. The adversarial test inverts it: the token is gone, and everything downstream of that fact must still behave per specification. The pass rule from the assertion corpus applies directly: every path either refuses to proceed without a token and offers a documented recovery path requiring no vendor call, or succeeds cleanly with a pre-enrolled backup. A single unrecoverable token is a fail, because it means one physical object holds the user's entire digital life hostage.

FIDO2's design makes this testable rather than merely hopeful. FIDO2 keeps "private authentication keys on a user's device" so that authentication material never leaves the hardware (https://www.microsoft.com/en-us/security/business/security-101/what-is-fido2, jev weight 0.84, authoritative). That same hardware binding is what makes loss dangerous: the security property and the loss hazard are the same property. Yubico's FIDO2 material describes the YubiKey 5 series as multi-protocol keys supporting "FIDO2/WebAuthn, FIDO U2F, PIV Smart Card, and other protocols" (https://www.yubico.com/authentication-standards/fido2/, jev weight 0.75, authoritative), which means a lost key simultaneously disables disk unlock, PAM login, and SSH in one event. The stress test therefore cannot treat those as independent failures; they are one failure with 3 symptoms.

## The 4 loss paths and their pass criteria

The test removes the YubiKey after a clean first-boot enrollment and exercises each consuming subsystem:

1. Disk unlock. Without the token, cryptsetup open must refuse the FIDO2 slot. The relevant question is whether another slot survives. LUKS supports multiple keyslots, and practitioner guides for YubiKey-LUKS setups consistently document keeping a passphrase slot: a setup guide for configuring LUKS with a YubiKey (https://piotrnowicki.com/posts/2024-06-17/configuring-luks-to-work-with-yubikey/, jev weight 0.63, authoritative) and a walkthrough of unlocking LUKS with a YubiKey that warns "you would need a backup of your LUKS header. Remember to save your backup to some external storage, so you can actually access it if anything goes sideways" (https://www.guyrutenberg.com/2022/02/17/unlock-luks-volume-with-a-yubikey/, jev weight 0.78, authoritative). Pass: a documented, tested passphrase or header-backup path exists and works without the token.
2. SSH. ed25519-sk resident keys live in the token; without it, SSH fails closed. Pass: either a second enrolled key exists or the failure is graceful, with the account still administrable through another channel.
3. PAM login and sudo. pam-u2f without the token must not lock the user out silently. Community Q&A on YubiKey-LUKS two-factor setups notes the fallback explicitly: "if you lose your Yubikey you can still enter your original (hopefully very long) passphrase to decrypt the hard drive, and then you can follow this procedure again to register a new Yubikey" (https://askubuntu.com/questions/599825/yubikey-two-factor-authentication-full-disk-encryption-via-luks, jev weight 0.06, weak backing; the mechanism is standard LUKS behavior but this specific source is a forum answer, so label accordingly). Pass: a fallback factor or a documented re-enrollment procedure.
4. Recovery enrollment. With a spare key, the user must be able to re-enroll from a working path without vendor intervention. Pass: the re-enrollment flow is documented, runs from the installed system or rescue media, and produces a system whose trust state is equivalent to the original.

## What the FIDO2 spec contributes to lockout behavior

The stress test also probes rate-limit and lockout semantics. FIDO2 authenticators enforce attempt limits on user verification, and the expected behavior is that lockout is temporary or resettable, never a permanent brick without a factory-reset path. The property to assert: lockout behavior matches the FIDO2 spec, meaning the token's own protections never combine with the OS's enrollments to produce a state from which the documented recovery cannot escape. A cold-boot case completes the set: boot state after suspend/resume cycles and after token removal mid-session must equal fresh-boot state, with no cached unlock material surviving the transition.

## Failure modes the test must distinguish

- Token missing, recovery path works (pass).
- Token missing, no recovery path, data recoverable only by destructive re-install (fail; the documented recovery path is the product).
- Token missing, system silently re-locks but the user believed a backup was enrolled (fail; enrollment state lying to the user is the partial-enrollment hazard, doc 05).
- Backup key present but never tested since enrollment (conditional fail; an untested recovery path is a claim, not a property, per doc 01).

That last case is the one that bites real deployments. A backup key enrolled at install time and never exercised is exactly the shape of an unverified design claim. The assertion set should require a periodic re-run of the loss path with the primary token physically absent, so the backup's continued validity is a demonstrated property with a date.

## The yubiOS application

The repo cross-check (GET https://api.github.com/repos/yubi-OS/yubiOS/contents/tests?ref=main) found unit-level coverage of the enrollment flows: tests/unit/test-enroll-luks.bats (1,238 bytes), test-enroll-ssh.bats, and test-enroll-pam.bats, all exercising enrollment with the token present. The gap the source analysis recorded is exact: no tests/vm/test-key-loss-recovery.sh exists in the tests/vm/ listing. In assertion-set terms, the repo has demonstrated the enrollment property and has not demonstrated the loss property; the second is the one a red team tests first, because it requires no exploit at all, only the loss of one small physical object.

## What a red team does with this

The red team's cheapest attack against a FIDO2-based OS is not defeating the cryptography; it is asking what happens when the key is in a washing machine. The assertion set encodes that question as 4 rows with binary verdicts and named evidence artifacts. Any row whose answer is "undefined behavior" or "undocumented" is a finding, regardless of how strong the cryptographic design is.
