# 03. Step 3 Mitigations: Runtime Control

Scope: the three Step 3 vectors of the Faux Phy chain, faux ACPI tables with TEE man in the middle and Absolute Persistence, radio persistence with framebuffer password exfiltration, and runtime dmesg and proc scrubbing with fd hijacking, and the yubiOS controls against each (source doc: yubi-OS/yubiOS docs/MITIGATE.md, sections 3-A, 3-B, 3-C).

## 3-A: faux ACPI tables, TEE MitM, Absolute Persistence

The attack, per the source doc: fake ACPI tables loaded from hidden media at (hd1,gpt42)/acpi/ACPI.lzma, a modified tz.uefisecapp that man in the middles the TrustZone TEE, and PCR 4 showing Fv()\ComputraceAgent, the Absolute Persistence firmware.

Three controls apply:

- Signed cmdline blocks ACPI override. ACPI table overrides via boot parameters require modifying the signed UKI command line, which breaks the Secure Boot signature (source doc).
- No TEE dependency. yubiOS uses YubiKey FIDO2 as the trust anchor instead of TrustZone or a TEE, so there is no tz.uefisecapp equivalent to compromise and compromising the TEE does not unlock the LUKS2 root filesystem. The source doc classifies this as architectural immunity.
- Computrace detection. Fv()\ComputraceAgent in the PCR event log is detectable via chipsec, and ConditionSecurity=measured-os fails if the PCR state does not match a clean boot (source doc).

The detection claim deserves the nuance the source doc itself records later: chipsec does not provide a reliable automated Absolute/Computrace verdict. Community evidence points the same way: a chipsec issue reports that the scan_image module detected 450 EFI binaries while at least 5 further Computrace related binaries went undetected (https://github.com/chipsec/chipsec/issues/2197, jev weight 0.59). ESET's support note on UEFI detections states that the detection remains inside the firmware until the vendor ships a firmware update (https://support.eset.com/en/kb6567-you-receive-an-eset-uefi-detection, jev weight 0.80), which matches the source doc's residual risk line: Computrace in UEFI ROM is installed below the OS and cannot be removed without reflashing firmware.

## 3-B: radio persistence and password exfiltration via framebuffer

The attack: hci_uart plus btqcom creates a persistent Ethernet emulator over a radio that cannot be powered off, and secure console output, including visible passwords, is routed to a secondary framebuffer and sent over the radio TX/RX path through ttyHS devices.

The controls (all source doc unless noted):

- No passphrase to capture. The LUKS2 disk unlock uses YubiKey FIDO2 hmac-secret, so no typed passphrase ever exists for the framebuffer and ttyHS path to capture. The source doc classifies this as architectural immunity.
- systemd-homed with FIDO2. User login uses FIDO2 touch plus PIN through pam-u2f, which requires physical YubiKey presence, so a captured PIN without the physical token is useless.
- PrivateNetwork=yes and BindNetworkInterface=. Security critical services run in private network namespaces and cannot reach hidden radio interfaces.
- dm-verity on drivers. Modified hci_uart or btqcom drivers under /usr are rejected by dm-verity, and unsigned drivers are rejected by kernel lockdown, which blocks the new driver path rather than the hardware itself.

## 3-C: dmesg and proc scrubbing, fd hijacking, magic number services

The attack: generated systemd services block dmesg, kmesg, journalctl, /sys and /proc, monitor dmesg for magic numbers from Cpuidle:PM, and reuse open file descriptors from the controlled parent PID.

The controls (all source doc):

- dm-verity on service units. Every unit in /usr/lib/systemd/system/ is dm-verity protected, so a foreign service cannot be injected without breaking the Merkle tree.
- DynamicUser= plus ProtectProc=invisible. Service processes cannot see other PIDs' /proc entries, so the scrubbing service cannot enumerate or attach to other processes.
- RestrictFileSystems=. The BPF LSM restricts which filesystem types each service can access, so rogue services cannot open arbitrary /proc or /sys paths.
- NoNewPrivileges=. Enrollment and auth services cannot escalate to inject code into the systemd parent PID.
- Journal forward secure sealing. HMAC based sealing detects journal tampering through journalctl --verify. The FSS mechanism seals binary logs at regular intervals so any tampering before the seal is detected (https://esf.eurotech.com/docs/journald-fss-verification, jev weight 0.50; background at https://lwn.net/Articles/512895/, jev weight 0.29, weak backing).

## The immunity pattern

Step 3 is where the source doc's two architectural immunities land: no TEE dependency removes the tz.uefisecapp man in the middle surface entirely, and no typed passphrase removes the framebuffer exfiltration target entirely. Everything else in Step 3 is detection (chipsec, PCR state, journal sealing) or containment (namespaces, per service filesystem restriction, privilege drop), and the doc's coverage chart in doc 04 marks the difference explicitly.
