# 02 The known-working configuration

Scope: the frozen decision list that any change to the software FIDO2 VM lane must preserve.

Grounding spine: source doc yubi-OS/yubiOS `playbooks/fido2-vm-e2e-recipe.md` (2026-08-01), Decision section.

## The six frozen decisions

The source doc lists the known-working configuration as a set of facts any change must preserve. Each is a decision that was once a bug or a design choice, and each was settled by evidence.

### 1. Host launches the guest with bcvk --swu2f plus swtpm

The host side of the recipe is `bcvk --swu2f` (the uhid software authenticator) plus `swtpm` (source doc). Two external mechanisms make this work.

swtpm is the libtpms-based TPM emulator with socket interface; QEMU supports the software TPM emulator included in the swtpm package, and compared to a hardware TPM device the emulator has no limit on the number of guests that can access it (weak backing, 0.36: https://doc.opensuse.org/documentation/leap/virtualization/html/book-virtualization/tpm.html). In this recipe it plays the role a real TPM would play in the desktop path, so the guest image's LUKS2/homed stack sees a complete environment.

The `--swu2f` side uses the kernel's UHID interface: UHID provides user-space I/O driver support for the HID subsystem, letting a user-space program create HID devices (weak backing, 0.28: https://docs.kernel.org/hid/uhid.html). This is an established pattern: Chromium OS's U2Fd daemon likewise creates a new HID device from user space using the UHID kernel interface and gets U2F HID reports from there (weak backing, 0.44: https://chromium.googlesource.com/chromiumos/platform2/+/master/u2fd/README.md). The recipe's software authenticator is the same trick: a user-space CTAP2 device appears to the guest as a real HID device at `/dev/hidraw0`.

### 2. passless pinned to an immutable commit

In-guest, `passless` is pinned to an immutable commit and exposes `/dev/hidraw0` with CTAP2 `hmac-secret` (source doc). The pin is deliberate: when CTAP2 `hmac-secret` support disappears, the first suspect is a moved `passless` pin, and the pin exists precisely so that cannot happen silently (source doc).

### 3. pamu2fcfg must be in the built image, via the production Containerfile

`pamu2fcfg` must be present in the built image. On Fedora Rawhide it is a separate subpackage from `pam-u2f`, and it must be added in the production `Containerfile`, not `mkosi.conf` (source doc). The Fedora packaging fact is independently confirmable: pamu2fcfg is a subpackage of pam-u2f that provides a command line tool for configuring PAM authentication over U2F (weak backing, 0.39: https://packages.fedoraproject.org/pkgs/pam-u2f/pamu2fcfg/). The build-path rule matters because the first fix went to the wrong place: PR #102 changed `mkosi.conf`, but that build path does not ship the image, so the fix had no effect; the effective fix was PR #125 in the production `Containerfile` (source doc, detailed in doc 06).

### 4. homectl create needs --enforce-password-policy=no

Creating a FIDO2 home with `homectl create` must pass `--enforce-password-policy=no`; with an empty `NEWPASSWORD=` the command otherwise hangs about 5 minutes instead of failing fast (source doc). This was the second real bug, fixed in PR #102 (source doc).

### 5. pam-u2f wired required, not sufficient, with a 1.3.1 floor

`pam-u2f` is wired `required` (not `sufficient`) with a 1.3.1 version floor (source doc). The choice of control flag and the version floor are both asserted by unit tests, not just convention; doc 05 covers the bats assertions that lock this in.

### 6. Real-key interaction is guarded

Real-key interaction is guarded and documented in the sibling playbook `hw-device-and-allow-real-u2f` (source doc). The guard is why a physical key attached to the CI host makes passless tests skip rather than run; the refusal is correct behavior, not a failure to work around (source doc, see doc 06).

## Why "any change must preserve" is the right frame

The configuration is a coupled system: the uhid device must enumerate, the pinned passless must expose hmac-secret, the image must carry the right subpackage, homectl must not hang, and PAM must be wired with the right control flag. A change to any single element can break the chain while every individual component still looks healthy. That is why the playbook freezes the whole list rather than documenting each knob separately, and why doc 03's chain view is the acceptance test for the whole set.
