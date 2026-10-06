# 03 The mechanism chain, leg by leg

Scope: the end-to-end chain the recipe proves, from host launch to ed25519-sk key generation, and what each leg asserts.

Grounding spine: source doc yubi-OS/yubiOS `playbooks/fido2-vm-e2e-recipe.md` (2026-08-01), Mechanism section.

## The chain as recorded

The source doc records the chain as a strict sequence where each leg feeds the next:

```
host: bcvk --swu2f (uhid) + swtpm
  -> in-guest passless up
    -> /dev/hidraw0 enumerated, CTAP2 hmac-secret available
      -> LUKS2 FIDO2 enroll + unlock                PASS
        -> systemd-homed FIDO2 home create          PASS
          -> pamu2fcfg FIDO2 registration           OK
            -> ssh-keygen -t ed25519-sk             OK
```

The status markers matter. The two enrollment legs (LUKS2 and homed) are marked PASS, meaning the scripts assert success, not just absence of error. The last two legs are marked OK, meaning registration and key generation completed. The verified run (doc 07) confirms all legs with no skips.

## Leg 1: host launches the guest

The host runs `bcvk --swu2f` plus `swtpm` (source doc). The `--swu2f` flag loads a uhid-based software authenticator. UHID is the kernel interface that provides user-space I/O driver support for the HID subsystem, letting a user-space program synthesize HID devices (weak backing, 0.28: https://docs.kernel.org/hid/uhid.html). Chromium OS's U2Fd daemon uses the same approach: it creates a new HID device from user space using the UHID kernel interface and receives U2F HID reports there (weak backing, 0.44: https://chromium.googlesource.com/chromiumos/platform2/+/master/u2fd/README.md). swtpm supplies the software TPM: QEMU supports the swtpm package's TPM emulator, which can be switched between TPM versions 1.2 and 2.0 and, unlike a hardware TPM, has no limit on the number of guests sharing it (weak backing, 0.36: https://doc.opensuse.org/documentation/leap/virtualization/html/book-virtualization/tpm.html).

## Leg 2: the authenticator enumerates in the guest

Once `passless` is up in the guest, `/dev/hidraw0` is enumerated and CTAP2 `hmac-secret` becomes available (source doc). This leg is the hinge of the whole recipe: it is where the software authenticator becomes indistinguishable, at the interface level, from a plugged-in FIDO2 token.

The `hmac-secret` extension is defined by the FIDO Alliance's Client to Authenticator Protocol. The CTAP2 specification defines the hmac-secret extension in its section 9.1, and authenticator requests can carry `"hmac-secret": true` to advertise support (strong backing, 0.78: https://fidoalliance.org/specs/fido-v2.0-rd-20180702/fido-client-to-authenticator-protocol-v2.0-rd-20180702.html). CTAP2 messages are encoded in the CTAP2 canonical CBOR encoding, and authenticators implementing CTAP2 are referred to as CTAP2 authenticators, FIDO2 authenticators, or WebAuthn authenticators (strong backing, 0.67: https://fidoalliance.org/specs/fido-v2.2-ps-20250714/fido-client-to-authenticator-protocol-v2.2-ps-20250714.pdf). Yubico's deep dive is explicit that the power comes from the protocol level, specifically the hmac-secret extension, which enables system-level security features beyond web use (strong backing, 0.51: https://developers.yubico.com/WebAuthn/Concepts/PRF_Extension/CTAP2_HMAC_Secret_Deep_Dive.html). Yubico's integration review notes the HMAC secret extension is part of the FIDO CTAP2 specification and can be used for offline scenarios (weak backing, 0.47: https://developers.yubico.com/WebAuthn/WebAuthn_Developer_Guide/Integration_Review_Standard_FIDO.html), which is exactly the disk-unlock case.

## Legs 3 and 4: LUKS2 enroll and unlock, then homed

With the authenticator enumerable, the guest enrolls and unlocks a LUKS2 volume with FIDO2 (PASS) and then creates a systemd-homed FIDO2 home (PASS) (source doc). The systemd mechanism is documented upstream: from systemd v248, systemd-cryptsetup gained direct support for unlocking LUKS2 volumes with FIDO2 security hardware, reading FIDO2 metadata embedded in the LUKS2 header and waiting for the token at boot via systemd-udevd (weak backing, 0.44: https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html). The enrollment tool is systemd-cryptenroll, which enrolls hardware security tokens including FIDO2 tokens into a LUKS2 encrypted volume so the volume can be unlocked during boot (weak backing, 0.3: https://wiki.archlinux.org/title/Systemd-cryptenroll).

## Legs 5 and 6: PAM registration and an sk key

`pamu2fcfg` performs FIDO2 registration (OK) and `ssh-keygen -t ed25519-sk` generates a security-key SSH key (OK) (source doc). These two legs exercise the consumers of the same authenticator through different front ends: PAM configuration and OpenSSH's security-key key type. Their success proves the guest image ships everything needed for both, including the pamu2fcfg subpackage discussed in doc 02 and doc 06.

## Why the chain shape matters

The chain is linear with no parallel branches, so a failure at any leg blocks everything after it. That makes the chain a diagnostic map as much as a test record: the symptom table in doc 06 maps each observed failure mode back to a specific leg. It also makes the acceptance criterion crisp, which the CI doc (04) formalizes: a green lane means every leg passed with no skips, and reading only the final conclusion can hide a skipped leg.
