# 04. YubiKey Setup Checklist

Scope: the 6-step YubiKey bring-up checklist the onboarding doc prescribes: enabling FIDO and CCID interfaces, setting and recording a FIDO2 PIN, primary enrollment for LUKS2 and homed, backup-key enrollment, the offline recovery key, and keeping PIV slot 9c material separate from everyday SSH operations.

Grounding spine: yubi-OS/yubiOS docs/ONBOARDING.md (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/ONBOARDING.md), last reviewed 2026-07-11.

## Step 1: enable the FIDO and CCID interfaces

The first checklist item is `ykman config usb --enable FIDO --enable CCID` (source doc). Yubico's own documentation for the ykman config command describes exactly this operation: the config usb subcommand enables or disables which USB applications (interfaces) a YubiKey exposes, and FIDO and CCID are two of those applications (https://docs.yubico.com/software/yubikey/tools/ykman/Config_Commands.html, weight 0.69). Yubico's developer-side config reference documents the same interface toggling semantics, including that enabled/disabled state controls what the key presents over USB (https://developers.yubico.com/yubikey-manager/Config_Reference.html, weight 0.65). The checklist enables both because the rest of the flow needs both: FIDO2 for the disk-unlock and homed enrollment paths, CCID (the smart-card interface) for the PIV material used later in the checklist. A real-world support thread shows the practical failure mode when the interface is not enabled: ykman operations that need an application return a message about enabling it first (https://github.com/Yubico/yubikey-manager/issues/488, weight 0.60). The ykman CLI guide covers the overall command family (https://docs.yubico.com/software/yubikey/tools/ykman/, weight 0.59).

## Step 2: set and record a FIDO2 PIN

The checklist requires setting a FIDO2 PIN and recording it (source doc). The PIN is the user-verification factor FIDO2 relies on when a key is enrolled for user presence plus verification, so every later step that uses the key (LUKS2 unlock, homed login) assumes it exists. The doc's emphasis on recording it, not just setting it, is a recovery posture: a set-but-forgotten PIN is an avoidable lockout.

## Step 3: enroll a primary YubiKey for LUKS2 and homed

The third item enrolls the primary key for both disk unlock (LUKS2) and home-directory handling (homed) (source doc). The mechanisms behind this are standard Linux tooling: systemd-cryptenroll supports enrolling FIDO2 tokens to unlock LUKS2 volumes (https://www.golinuxcloud.com/systemd-cryptenroll-luks2-tpm2-fido2-linux/, weight 0.16, weak backing), and community write-ups document the same pairing of a YubiKey with LUKS for encrypted-disk unlock (https://piotrnowicki.com/posts/2024-06-17/configuring-luks-to-work-with-yubikey/, weight 0.18, weak backing; https://mhdez.com/posts/unlocking-encrypted-linux-with-a-yubikey/, weight 0.17, weak backing). The source doc does not name the enrollment command; the corpus records the mechanism class (LUKS2 FIDO2 enrollment plus systemd-homed) and treats the concrete command as a property of the yubiOS installation flow, not of the checklist.

## Step 4: enroll a backup YubiKey where supported

The fourth item enrolls a backup key "where supported" (source doc). The qualifier is doing work: not every lockout surface accepts a second credential, so the doc scopes backup enrollment to the paths that support it rather than promising a universal second key. This pairs with step 5.

## Step 5: generate and print the recovery key offline

The fifth item is an offline recovery key, generated and printed (source doc). This is the fail-safe layer: if the primary and backup keys are both unavailable, the printed key is the remaining unlock path for encrypted state. The word "offline" carries the security property; a recovery key that only exists on the machine it protects does not survive that machine's failure, and one stored in a synced file is exposed to whatever can read that file. The doc's discipline is: generate it, print it, keep the physical copy.

## Step 6: keep PIV slot 9c separate from SSH

The final item separates key material: PIV slot 9c material, used for Secure Boot signing, must be kept separate from everyday SSH operations (source doc). This is a key-separation rule. Slot 9c is the PIV slot for digital signatures, and Secure Boot signing keys are the highest-value identity in the trust chain: a key that signs boot artifacts must never share custody with a key used routinely for remote login. Separation limits blast radius: a compromise or mistake in daily SSH use cannot reach the boot-signing identity.

## Why the checklist is ordered this way

The 6 steps run from interface enablement to key custody, and each step is a precondition for the ones after it: the interfaces must be on before enrollment, the PIN before any FIDO2 operation, the backup and recovery key before the system is relied upon. As a set, the checklist is the onboarding doc's concrete answer to "how does a contributor get a real enrollment environment standing", and it connects directly to the doc's recovery-expectations rule: every one of these items exists to make sure a lockout has a documented way back.
