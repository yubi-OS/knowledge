# 07 - FIDO2 End-to-End Unlock (B-REAL-FIDO2 and the resolved B-VM-CTAP2)

Scope: SoftHSM and swu2f as software substitutes for the unlock chain, the physical-YubiKey production-confidence gate, and the two root-caused bugs that closed B-VM-CTAP2.

Grounding spine: source doc `yubi-OS/yubiOS docs/BLOCKERS.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/BLOCKERS.md), row B-REAL-FIDO2 and the Not Current Blockers entries for B-VM-CTAP2.

## The blocker as stated

The register states that SoftHSM and swu2f exercise the interfaces, but production confidence still needs a physical YubiKey to validate FIDO2 unlock, homed, resident SSH keys, PAM presence, PIV signing, recovery, and failure handling (source doc). The prescribed order is explicit: first close B-VM-CTAP2 for deterministic software coverage, then retain a real-hardware evidence run as the production-confidence gate (source doc). The root-cause class is substitutability: software authenticators prove the code paths, but they cannot prove the hardware behaviors (timing, presence, failure handling) that a real token exhibits.

## The software stack the blocker validates

The unlock chain the register enumerates maps onto documented upstream components:

1. FIDO2/CTAP2 is the standard the chain uses for unlock: CTAP2 enables passkeys and richer flows with user verification (PIN or biometric) happening on the authenticator itself (source: https://www.yubico.com/authentication-standards/fido2/, jev weight 0.74). FIDO2 keeps private authentication keys on the user's device, which is what makes the unlock phishing-resistant (source: https://www.microsoft.com/en-us/security/business/security-101/what-is-fido2, jev weight 0.65).
2. LUKS2 unlock through a FIDO2 token depends on libfido2 being present at the right stage: practical guides note that dracut includes systemd-cryptsetup by default, that systemd-cryptsetup loads libfido2 dynamically rather than linking it, and that this can leave libfido2.so out of the initramfs (source: https://www.guyrutenberg.com/2022/02/17/unlock-luks-volume-with-a-yubikey/, jev weight 0.51, weak-to-moderate backing). That dynamic-load behavior is exactly the class of packaging detail B-VM-CTAP2's first bug exposed in the yubiOS image.
3. PAM presence is covered by pam-u2f: the module implements PAM over U2F and FIDO2 for YubiKeys and other compliant authenticators (source: https://github.com/Yubico/pam-u2f, jev weight 0.86). Fedora's documentation confirms the choice set on PAM-based systems is pam_yubico and pam_u2f, with FIDO2/U2F support depending on the key's firmware and hardware model (source: https://docs.fedoraproject.org/en-US/quick-docs/using-yubikeys/, jev weight 0.86).
4. Resident SSH keys are covered by the sk key types: supported key types are ecdsa-sk and ed25519-sk, and passphrase-protected credentials are not supported (source: https://developers.yubico.com/pam-u2f/, jev weight 0.79, cited for the key-type surface the register's "resident SSH keys" refers to).

## How B-VM-CTAP2 closed: 2 root-caused bugs

The register records the resolution in detail (source doc). Two real bugs were root-caused and fixed:

1. `pamu2fcfg` was missing from the built image because Fedora Rawhide splits it into its own subpackage from `pam-u2f`. It was fixed in the production `Containerfile` (PR #125) after an earlier fix to the wrong build path (`mkosi.conf`, PR #102) did not take effect.
2. `test-luks-fido2-ci.sh`'s `homectl create` FIDO2 home-create leg hung 5 minutes on an empty `NEWPASSWORD=` instead of failing fast. It was fixed with `--enforce-password-policy=no` (PR #102).

The proof run is run 30139433902 / job 89629762908 (https://github.com/yubi-OS/yubiOS/actions/runs/30139433902/job/89629762908), which proves the full chain end-to-end with no skips: host `bcvk --swu2f` uhid load, in-guest `passless`, `/dev/hidraw0` CTAP2 hmac-secret enumeration, LUKS2 FIDO2 enroll and unlock PASS, systemd-homed FIDO2 home create PASS, `pamu2fcfg` FIDO2 registration OK, and `ssh-keygen -t ed25519-sk` OK (source doc). Tracked in Linear OMN-48 (Done).

A second-pass arm64 proof followed on 2026-08-01: run 30697269619 / job 91362188919 on rock1 (self-hosted ARM64 KVM, commit b7f9d467 on main) ran both `tests/vm/test-luks-fido2-ci.sh` and `tests/vm/test-fido2-enrollment.sh` end-to-end against the ARM64 bcvk guest and got PASS on swtpm + swu2f CTAP2 + LUKS2 FIDO2 + homed FIDO2 and on enrollment surface + CTAP2 registration + OpenSSH ed25519-sk (source doc). This is the first arm64-only end-to-end proof with the in-guest passless CTAP2 authenticator actually enumerated, confirming OMN-48 / yubiOS#25 closure on the production ARM64 guest. The hardware leg (`tests/vm/test-luks-fido2.sh` against `/dev/sda`) also passes, with the FIDO2 token enrolled as slot 2 via `systemd-cryptenroll`. Tracked in Linear OMN-89 (Done) comment c74cec44 (source doc).

## The unblock path

B-REAL-FIDO2's next step is unchanged by those closures: deterministic software coverage first (now proven on both the dev image path and the production ARM64 guest), then a real-hardware evidence run as the production-confidence gate (source doc). The physical YubiKey validates the items software cannot: PIV signing, recovery, and failure handling under real device behavior (source doc).

## The dependency-management lesson

This pair of rows teaches how a hardware-coupled project sequences its dependencies: software substitutes are legitimate for closing code-path bugs (B-VM-CTAP2, closed with run numbers and PRs), but the final dependency, the physical token, is deliberately retained as an open blocker with a narrower scope than the original. The register does not delete B-REAL-FIDO2 just because B-VM-CTAP2 closed; it narrows the claim: interfaces exercised, production confidence pending hardware. The 5-minute-hang bug also shows why the register values fail-fast fixes: a dependency that fails slowly blocks evidence collection as surely as one that fails loudly.
