# 08 - LUKS + TPM / FIDO2 Enrollment Gotcha

**Scope:** why `bootc install to-disk` with LUKS + TPM enrollment fails inside VMs, the two-stage workaround the source doc prescribes, and the CI-shaped variant of the same flow.

## The failure

The source doc states the gotcha in one line: "`bootc install to-disk` with LUKS + TPM enrollment **fails in VMs** due to PCR mismatches (virtual TPM PCR values don't match real hardware)." The mechanism behind the mismatch is measurable-boot state: systemd documents that it makes a defined set of TPM2 PCR measurements during boot (https://systemd.io/TPM2_PCR_MEASUREMENTS/, jev weight 0.85, high). A key sealed to PCR values measured on one environment will not unseal in another whose measurements differ, and a virtual TPM's measurements differ from the target hardware's.

The virtual TPM itself is a real component, not a placeholder: swtpm is the "libtpms-based TPM emulator" that QEMU-side stacks use (https://github.com/stefanberger/swtpm, jev weight 0.83, high). Because it emulates the platform, its PCR state reflects the VM's firmware and boot chain, not the physical machine's.

## The two-stage workaround

The source doc prescribes two steps:

1. Install with temporary passphrase.
2. Post-boot on real hardware: `systemd-cryptenroll --fido2-device=auto /dev/sda3`.

Step 2 uses the systemd enrollment tool, whose man page defines the operation: "systemd-cryptenroll is a tool for enrolling hardware security tokens and devices into a LUKS2 encrypted volume, which may then be used to unlock the volume during boot" (https://www.freedesktop.org/software/systemd/man/251/systemd-cryptenroll.html, jev weight 0.66, high). Enrolling after first boot on real hardware sidesteps the mismatch because the enrollment and the unseal happen in the same PCR environment.

Lennart Poettering's canonical writeup on the technique describes enrolling "LUKS2 volumes with TPM2, FIDO2, PKCS#11 security hardware" as the unlock mechanism for LUKS2 during boot (https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware, jev weight 0.62, high), which is the exact mechanism the workaround defers until the VM meets real hardware.

## The CI variant

The source doc's CI guidance: "For CI: skip TPM enrollment; test FIDO2 path with `virtual-fido` and `systemd-cryptenroll --fido2-device=auto /tmp/test.luks`." Two source-doc claims live here: the FIDO2 path is testable in CI through the virtual-fido emulator, and cryptenroll can be exercised against a plain file-backed LUKS2 image rather than a real partition.

The tool supports the token kinds the flow needs. The man page's description of enrollable credentials covers the token families (https://www.freedesktop.org/software/systemd/man/systemd-cryptenroll.html, jev weight 0.59, high), and the FIDO2-specific flag `--fido2-device=auto` appears in the source doc and in the tool's documentation.

## Weak-signal sources, labeled

An ArchWiki page on systemd-cryptenroll corroborates the usage patterns above but is community-maintained (https://wiki.archlinux.org/title/Systemd-cryptenroll, jev weight 0.43, weak); it is recorded here for traceability, not as load-bearing evidence. Microsoft Learn pages on PCR banks and measured boot provide background on the seal/unseal model but are Windows-centric (https://learn.microsoft.com/en-us/windows/security/hardware-security/tpm/switch-pcr-banks-, jev weight 0.27, weak).

## Relation to the rest of the corpus

Doc 03 and doc 04 both produce or flash yubiOS disks, and both can hit this gotcha the moment LUKS + TPM enrollment is requested at install time in a VM. Doc 06 provides the physical-key passthrough that the real-hardware enrollment step (stage 2) needs, and the CI test harness in doc 09 exercises the FIDO2 path with the emulator instead.
