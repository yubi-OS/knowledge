# 01 Context and the regression guard

Scope: when this recipe applies, what it freezes, and the hard boundary between the proven software lane and the unproven hardware lane.

Grounding spine: source doc yubi-OS/yubiOS `playbooks/fido2-vm-e2e-recipe.md` (2026-08-01). All claims below marked "source doc" come from that file.

## Why the recipe exists

The playbook is written for one situation: the software FIDO2 / LUKS2 / systemd-homed VM lane regresses, or you are about to change anything it depends on (source doc). The dependency list is explicit: `passless`, the host `swu2f` helper, `pam-u2f`, `homectl`, `ssh-keygen -t ed25519-sk`, and the image's PAM and enrollment units (source doc). Before touching any of those surfaces, the recipe is the reference state a change must not silently break.

The document's stated purpose is unusual and important: it freezes a known-working recipe so that a regression is recognized as a regression, instead of reopening ground that was already settled (source doc). In other words, the recipe is not a tutorial for getting the lane working the first time; it is the record of the configuration that already works, written after the fact so future agents and engineers do not re-litigate it.

## What was proven, and when

The blocker that motivated the work, `B-VM-CTAP2`, is RESOLVED as of 2026-07-25 (source doc). The chain was proven end to end with no skips, and the playbook records the exact evidence: GitHub Actions run 30139433902, job 89629762908 (source doc). That run is the anchor; the recipe freezes the configuration that run exercised.

## The scope boundary

The playbook is explicit that this is the software lane (source doc). It proves the code path: that the guest image, PAM stack, homed, and enrollment tooling behave correctly when a software authenticator is presented over a virtual HID device. It does not prove:

- physical-presence semantics
- firmware ownership
- RPMB freshness

Those belong to `B-REAL-FIDO2`, which is open (source doc). The practical consequence is a reporting rule the playbook states bluntly: never describe a green run of this lane as production confidence (source doc). A green software-lane run is evidence about interface behavior, not about how a physical YubiKey behaves in front of a human.

## The external mechanisms the lane sits on

The lane's subject matter is the systemd FIDO2 unlock stack. systemd v248 added direct support in systemd-cryptsetup for unlocking LUKS2 volumes with FIDO2 security hardware; systemd-cryptsetup reads the FIDO2 metadata embedded in the LUKS2 header and waits for the token at boot via systemd-udevd (weak backing, 0.45: https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html). That is the mechanism the in-guest enrollment legs exercise.

On the authentication side, pam-u2f is the Yubico PAM module that implements PAM over U2F and FIDO2 and integrates a YubiKey or other compliant authenticator into an existing infrastructure, packaged for a number of systems (weak backing, 0.37: https://developers.yubico.com/pam-u2f/). The recipe pins a specific behavior floor for this module (see doc 02).

## How to use this corpus

Each later doc covers one joint of the recipe: the frozen configuration (02), the mechanism chain leg by leg (03), the CI dispatch and verification protocol (04), the test scripts and unit assertions (05), failure triage and the two real bugs (06), the recorded evidence (07), the hardware-lane boundary (08), and the document graph around the recipe (09). When a change touches the lane, the workflow is: read the frozen config, keep the chain green with no skips, and never claim more than the software lane proves.
