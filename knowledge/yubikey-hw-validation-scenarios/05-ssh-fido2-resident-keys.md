# SSH authentication with FIDO2 resident keys on real hardware

Scope: scenario H7, proving that an `ed25519-sk` key generated on the physical YubiKey authenticates over SSH while the key is present, and is rejected once it is removed.

## What H7 proves

SSH is one of the five trust boundaries a YubiKey anchors in yubiOS. The software story (`swu2f`) can exercise the OpenSSH sk plumbing, but it cannot prove the hardware property that matters: the private key material never leaves the device, and authentication is a function of the physical token being present and touched. H7 runs the full cycle on metal: generate on the key, enroll in `authorized_keys`, authenticate, then unplug and confirm rejection.

## Generating the key

Yubico's own guidance covers the exact invocation yubiOS uses: `ssh-keygen -t ed25519-sk` produces a modern EdDSA key backed by the security key, and requires YubiKey firmware 5.2.3 or newer; on older firmware, `ecdsa-sk` is the documented alternative [1] (weight 0.84). The `-O resident` option stores the credential on the YubiKey itself, so it can be recovered from the device later [1] (weight 0.84).

Residency is the property that makes the hardware test meaningful for the recovery story: a resident credential lives on the key, and guides covering the flow document how to pull the key material back off the device onto a new machine if the disk-side key file is lost [2] (weight 0.58). The same guides show the retrieval command putting the private (still key-protected) and public halves into the working directory for renaming and placement [3] (weight 0.41, weak backing).

Resident versus non-resident is the axis H7 straddles: support channels for other sk vendors describe both credential kinds and note that a second authenticator can generate a second FIDO2 SSH token and both can sit in `authorized_keys` [4] (weight 0.66). That multi-key overlap is exercised separately in H11; H7 uses one key and proves the present/absent boundary.

## The run

1. Generate the resident key on the physical YubiKey: `ssh-keygen -t ed25519-sk -O resident`.
2. Add the public half to `authorized_keys` on the target host.
3. SSH in with the key present and touched. Capture the successful session log.
4. Unplug the key and attempt SSH again. Capture the rejected connection.

The pass criteria are the pair of transcripts: an authenticated session with the key present, and a rejected connection with it removed. Anything in between (a cached agent holding the key after unplugging) must be noted: the scenario should run with a fresh agent or a cleared cache so the rejection reflects hardware absence, not agent caching.

## Server-side posture

Production-oriented guides for sk keys emphasize that the server can be configured to require hardware-backed keys and describe multi-token enrollment patterns [5] (weight 0.48, weak backing). For yubiOS the relevant point is that H7 should run against a server configuration that actually honors the sk requirement, since a server that silently accepts any key would make the rejection leg meaningless.

## Why the absent-key rejection matters

The accept leg proves the key works. The reject leg proves the security model: possession of the public half and a compromised agent must not grant access. With a software authenticator the "remove the key" step is meaningless, because the credential is a file that stays present. On metal, removal is a physical event the kernel HID layer observes, and OpenSSH's sk provider fails to reach the device. The rejection transcript is therefore the evidence that the trust boundary actually tracks the physical token.

## Relationship to other scenarios

H7 shares the presence-without-touch theme with H6 but in a different stack: H6 is PAM asking for touch, H7 is sshd proving device presence. They are separable deliberately: a machine can pass one and fail the other, because the PAM and sshd paths wire the token differently. The generation step of H7 is also a prerequisite for H11's second-key enrollment patterns on the SSH side.

## Sources

- [1] https://developers.yubico.com/SSH/Securing_SSH_with_FIDO2.html (jev weight 0.84)
- [2] https://www.emtec.com/kb/en/2010/ssh-keygen-resident-option-with-yubikey-fido-sk-key (jev weight 0.58)
- [3] https://gist.github.com/Kranzes/be4fffba5da3799ee93134dc68a4c67b (jev weight 0.41, weak backing)
- [4] https://support.nitrokey.com/t/using-fido2-ssh-with-nitrokey-3/5810 (jev weight 0.66)
- [5] https://www.systemshardening.com/articles/linux/fido2-ssh/ (jev weight 0.48, weak backing)
