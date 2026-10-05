# 05 - swtpm in QEMU for TPM test legs

Scope: running a software TPM under QEMU so guest VMs expose TPM devices for measured-boot and TPM-enrollment test legs in CI.

## The QEMU TPM emulator device

QEMU provides a TPM emulator device that uses an external TPM emulator called swtpm for sending TPM commands to and receiving responses from. The swtpm program must have been started before trying to access it through the TPM emulator with QEMU (QEMU documentation, https://qemu.readthedocs.io/en/v8.1.5/specs/tpm.html, weight 0.959; QEMU master docs, https://www.qemu.org/docs/master/specs/tpm.html, weight 0.545). The tpm2-software project documents the effect inside the guest: the virtualized TPM 2.0 device is made available to the guest OS, and with the appropriate versions of Linux it exposes the familiar /dev/tpm0 and /dev/tpmrm0 interfaces (tpm2-software community, https://tpm2-software.github.io/2020/10/19/TPM2-Device-Emulation-With-QEMU.html, weight 0.862). For a CI harness, those two device nodes are the observable preflight: a test leg that depends on measured boot should gate on their presence before anything else.

The setup pattern is documented for embedded workflows as well: run the swtpm emulator on the host, then launch QEMU with the TPM device option that passes it through to the guest (ejaaskel.dev, https://ejaaskel.dev/yocto-emulation-setting-up-qemu-with-tpm/, weight 0.477, weak backing).

## What the guest can observe

Once booted, the guest can read TPM measurements through securityfs when booted with OVMF firmware, which is the standard UEFI path for QEMU VMs (GitHub tompreston/qemu-ovmf-swtpm guide, https://github.com/tompreston/qemu-ovmf-swtpm, weight 0.557). Measured boot itself is the mechanism that leverages the TPM on a hardware platform to detect unwanted modifications of the platform configuration, which could degrade security and trust (GitHub anpep/qemu-tpm-measurement, https://github.com/anpep/qemu-tpm-measurement, weight 0.550). Measured boot extends trust in a booted system by recording cryptographic measurements of executed software and system state into the TPM, enabling subsequent verification through remote attestation (arXiv TPMSpy, https://arxiv.org/pdf/2609.05011, weight 0.644).

For test design, that means a swtpm-backed VM leg can assert not just that measurements exist but that the event log reaches the kernel. One practitioner report flags an exact version-sensitive failure: a specific GRUB version in a stable distro release did not manage to pass the TPM event log through to the guest kernel properly, a bug that cost significant debugging time (Noodles blog, https://www.earth.li/~noodles/blog/2024/07/qemu-uefi-testing.html, weight 0.355, weak backing). A CI harness that reads the event log from the guest turns that class of firmware bootchain regression into an automatic failure instead of a silent pass.

## The systemd side

systemd ships its own fallback: systemd-tpm2-swtpm.service provides fallback software TPM functionality, intended for use in environments where a discrete or firmware TPM is not available, and it is pulled into the boot process by systemd-tpm2-generator when no hardware TPM is found (freedesktop.org, https://www.freedesktop.org/software/systemd/man/devel/systemd-tpm2-swtpm.html, weight 0.799). This is relevant to test design in two directions: a CI VM without an explicitly attached swtpm may still acquire a software TPM through this generator path, which changes what TPM-dependent test legs observe, and a harness that wants deterministic behavior should either provide its own swtpm or explicitly account for the generator.

TPMSpy also describes an evaluation methodology applied to measured boot performed by a widely-used systemd-based Linux OS, validating measurement systems by low-level tracing of TPM command traffic (arXiv TPMSpy, https://arxiv.org/html/2609.05011, weight 0.731). That is the same layer a swtpm-based CI harness could instrument: swtpm sits between guest and emulator, so TPM command streams are observable on the host without kernel debugging.

## Test design summary

A swtpm leg in CI asserts: swtpm started before QEMU, /dev/tpm0 and /dev/tpmrm0 present in the guest, PCR state readable, the TPM event log present and complete for the boot chain, and, where the image uses TPM-backed secrets, enrollment succeeding against the emulated device. The authoritative sources here are QEMU's own device documentation, the tpm2-software project, and the systemd man page, all above 0.54; guest-visible event log behavior has additional weakly-backed practitioner evidence that is directionally consistent with the primary sources.
