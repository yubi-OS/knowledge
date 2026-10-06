# 05 Partial enrollment state safety

Scope: partial-enrollment hazard testing: skipped onboarding steps must auto-recover or block completion, never leave a silently weaker state that the user believes is fully protected.

## The hazard: a system that lies about its own state

The partial-enrollment hazard is not that the system breaks; it is that the system works while quietly missing a protection. When each enrollment step is independently skippable, a skipped step creates a state where the user believes FIDO2 protection is complete but one leg (for example pam-u2f registration) never happened. The danger is the mismatch between believed state and actual state. Enterprise material treats enrollment gaps as their own security problem: a mobile-device management guide calls the enrollment gap the place where "security policies go to die" and argues for closing it so every device is "fully enrolled, fully compliant" (https://admin365.blog/2026/02/18/force-complete-intune-enrollment-mobile-device-security-guide/, jev weight 0.25, weak backing). The mechanism that claim describes is directionally sound even though the source is weak: an enrollment flow that can end half-finished is a policy enforcement hole.

The general fail-safe principle gives the pass rule: on failure or incomplete state, the system should deny or defer rather than degrade into a weaker-but-operational mode (https://www.ituonline.com/comptia-securityx/comptia-securityx-4/mitigations-implementing-fail-secure-and-fail-safe-strategies-for-robust-security/, jev weight 0.45, weak backing). Applied to enrollment: after any skipped step, the system must either complete the step on next boot or refuse to mark enrollment complete. Never silently leave a partial-lockout state.

## The two acceptable terminal states

Exactly 2 terminal states are acceptable after a reboot with a skipped enrollment step:

1. Auto-recovery. The next boot detects the missing step and completes it, provided the token is present. The property to assert: recovery is attempted deterministically, its result is reported, and a failed auto-recovery does not mask itself as success. Identity-platform practice supports determinism over cleverness here: Microsoft's Entra documentation for hybrid FIDO2 security keys is organized around making the failure and remediation states explicit and debuggable (https://learn.microsoft.com/en-us/entra/identity/authentication/howto-authentication-passwordless-troubleshoot, jev weight 0.93, authoritative).
2. Blocked completion. The system reports enrollment as incomplete and surfaces which step is missing. Pass requires that the incomplete marker is visible at the level the user actually interacts with (login prompt, boot screen), not buried in a log file.

Everything else is a fail: usable-and-quiet (system fully usable, missing protection unreported), locked-out-and-quiet (user locked out with no indication why), or partial-lockout (some paths gated, others open, nothing reports the asymmetry).

## Lockout as the mirror hazard

The inverse failure is over-blocking: enrollment or a mid-session token event locks the user out with no recovery path. Vendor recovery docs show what the recovery surface must look like. A Windows FIDO2 logon product documents a concrete lockout-then-recover procedure "to regain access to a Windows workstation in the event of an accidental lockout caused by enabling uTrust Windows Logon without associating a uTrust FIDO2 key" (https://hirschsecure.atlassian.net/wiki/spaces/FIDO/pages/4643815425, jev weight 0.18, weak backing). The detail that matters for assertion writing is not this vendor's procedure but its existence: the product documents the lockout state and a named escape from it. An assertion row for lockout behavior passes only when the escape is documented and tested, not when the maintainers believe one exists.

PAM-integrated FIDO deployments add a second-order hazard: the authentication stack itself has state. CyberArk's FIDO authentication configuration doc describes replacing "password-only logins" with FIDO-based authentication inside PAM (https://docs.cyberark.com/pam-self-hosted/latest/en/content/pas%20inst/fido-authentication.htm, jev weight 0.89, authoritative). When PAM is mid-configuration, partially enrolled factors can interact: the PAM stack may accept password on one service and demand FIDO2 on another. The stress test must enumerate services (login, sudo, sshd, screensaver) and assert a consistent policy across all of them after any partial-enrollment state.

## The skip matrix

The stress test skips each enrollment step in turn and reboots. For yubiOS's named enrollment flow (PIV slot 9c signing, disk unlock, SSH ed25519-sk resident keys, pam-u2f registration, per GET https://api.github.com/repos/yubi-OS/yubiOS/contents/tests?ref=main), the matrix is:

1. Skip disk unlock enrollment: on reboot, either re-offer enrollment or fall back to a passphrase slot with the incomplete state reported. Fail if the disk boots unprotected with no marker.
2. Skip PIV signing setup: subsequent image signing or verification must fail loudly, and boot-time verification must not silently downgrade to trust-on-first-use.
3. Skip SSH resident-key enrollment: SSH access must not silently fall back to password authentication while the system reports FIDO2 protection as active.
4. Skip pam-u2f registration: login must keep its fallback factor and the enrollment state must report incomplete.

Each row's verdict is one of: auto-recovered, blocked-with-marker, or fail. Mixed states (recovered for one service, silent for another) count as fail for the row and must be recorded, because they are the state users actually live in.

## The yubiOS application

The repo cross-check found the gap directly: tests/unit/test-enroll-unit.bats (3,179 bytes) covers the enrollment happy path, and the source analysis records "no explicit partial-skip case in tests/vm/". The yubiOS README's claim that "each enrollment step is skippable and independently re-runnable" was flagged in the source analysis as operationally nice but a safety risk if users skip steps and reboot into a partially enrolled state. In assertion-set terms: the repo demonstrates enroll-when-present; it does not yet demonstrate behave-when-absent, and the second is the property this stress test asserts.

## What a red team does with this

A red team does not exploit the crypto; it exploits the state machine. The attack is simply: perform a legal action the flow permits (skip a step, remove the token mid-enrollment, power off during re-enrollment) and observe whether the system's reported trust level matches its actual trust level. Any divergence between reported and actual state is the finding, and it is usually cheaper to find than a cryptographic break.
