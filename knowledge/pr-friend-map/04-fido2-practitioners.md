# 04 FIDO2 practitioners: the community that catches token-ceremony mistakes

Scope: engaging YubiKey and FIDO2 practitioner communities by publishing a precise enrollment and recovery flow and inviting correction, with every assumption traceable to vendor and standards documentation.

## What the documentation actually supports

The first contribution to FIDO2 practitioners is precision. The Yubico SDK documentation specifies that the hmac-secret and hmac-secret-mc extensions enable the creation of a symmetric secret value scoped to a credential, with support depending on YubiKey firmware version (https://docs.yubico.com/yesdk/users-manual/application-fido2/hmac-secret.html, jev weight 0.6553; the same text ships in the Yubico.NET.SDK repository at https://github.com/Yubico/Yubico.NET.SDK/blob/develop/docs/users-manual/application-fido2/hmac-secret.md/, jev weight 0.6637). Any campaign claim that leans on derived secrets for disk unlock should quote that scoping language, including its firmware-version dependency, rather than paraphrasing it into something stronger.

The recovery half of the flow is where practitioner review is most valuable. Yubico's FIDO2 reset documentation states that a reset removes any credentials present and sets the application to the "no PIN" state, and carries explicit caveats about what the token can no longer do afterwards (https://docs.yubico.com/yesdk/users-manual/application-fido2/fido2-reset.html, jev weight 0.9348). The support-channel version of the same procedure walks through the capacitive touch sensor reset and notes platform-specific differences, including NFC-based reset through Yubico Authenticator on iOS for NFC-capable models (https://support.yubico.com/s/article/Resetting-the-FIDO2-application-on-the-YubiKey, jev weight 0.8895).

For resident (discoverable) credentials, Yubico's developer guide documents the Credential Protection extension introduced to counterbalance the ability to enumerate FIDO2 discoverable credentials, applied on YubiKeys with firmware 5.2.3 and above (https://developers.yubico.com/WebAuthn/WebAuthn_Developer_Guide/Resident_Keys.html, jev weight 0.8068). An enrollment flow document should state which firmware floor its assumptions require.

## Framing the ask to practitioners

The wider FIDO2 context is well established: vendor material describes FIDO2 and passkeys as eliminating password vulnerabilities with phishing-resistant authentication (https://www.yubico.com/authentication-standards/fido2/, jev weight 0.5555), and Microsoft's security primer positions FIDO2 as strengthening security against phishing through cryptographic credentials (https://www.microsoft.com/en-us/security/business/security-101/what-is-fido2?msockid=34f3e76c56186a7207eaf085570a6b56, jev weight 0.7747). None of that is in question. The narrow, reviewable question is therefore not "is FIDO2 good" but "which part of this specific token ceremony is unsafe, too vague, or hard to recover from".

## Where communities are already arguing

Recovery is a live pain point, and community threads show it. The evidence is forum-grade and should be labeled as such. Users of one hardware token report that FIDO2 resident keys were not included in a backup restore between two keys (https://onlykey.discourse.group/t/fido2-resident-keys-not-included-in-backup/747, jev weight 0.3500, weak backing), and a feature request asks for selective export and import of FIDO2 resident credentials as a physical backup (https://onlykey.discourse.group/t/resident-credential-backup/1418, jev weight 0.0564, weak backing). A Reddit thread on resident SSH keys asks whether a passphrase is still necessary alongside the key, and shows the ssh-keygen invocation involved (https://www.reddit.com/r/yubikey/comments/xzstka/fido2_resident_keys_ssh_passphrase_necessary/, jev weight 0.0263, weak backing). A discussion on the age encryption project debates using the hmac-secret extension for encryption and compares it against keeping keys only on the YubiKey (https://github.com/FiloSottile/age/discussions/390, jev weight 0.2437, weak backing).

These threads are weak as citations but strong as signal: recovery and backup of resident credentials is contested territory, and a project that publishes its own recovery flow should expect exactly these questions first.

## The contribution and the ask

1. Publish the enrollment and recovery flow with the vendor documentation cited at every step, including firmware dependencies and reset caveats (sources above, weights 0.6553 to 0.9348).
2. Mark the flow non-production until a physical-token test plan has run.
3. Ask one question: "which part of this token ceremony is unsafe, too vague, or hard to recover from?"
4. Route the general curiosity to one canonical discussion home instead of scattering it across forums where the project does not control follow-up.

The success signal is specific corrections and missing failure modes, not praise. A practitioner who replies with "your reset path destroys the credential your recovery doc assumed" has delivered the exact value the ask was designed for.
