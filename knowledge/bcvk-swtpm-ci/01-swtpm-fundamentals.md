# 01 swtpm fundamentals

Scope: what the swtpm emulator is, the front-end interfaces it exposes over libtpms, and the companion tooling that prepares a TPM 2.0 instance for use.

## What swtpm is

swtpm is the software TPM emulator built on libtpms. The project describes itself as a package that "provides TPM emulators with different front-end interfaces to libtpms" [1] (weight 0.946). The emulator is built on libtpms and exposes access to TPM functionality over a TCP/IP socket, a Unix socket, and a character device [2] (weight 0.349, weak backing). The same three interfaces are confirmed by the upstream README, which adds the Linux CUSE interface as a fourth front-end used "for the creation of multiple native /dev/vtpm* devices" [3] (weight 0.799).

The libtpms core is what makes swtpm interesting for CI: libtpms implements the TPM 2.0 command surface in software, so a guest interacts with swtpm the same way it would interact with a discrete TPM chip, while the state lives in plain files on the host [1] (weight 0.946).

## The socket interface

The primary front-end for virtualization work is the socket interface. QEMU's TPM emulator device speaks to a running swtpm process over this socket, which is why the swtpm process must be started before QEMU tries to access it [4] (weight 0.723). The socket is split into a command channel (TPM commands and responses) and a control channel (swtpm-specific control messages such as state operations) [1] (weight 0.946).

For yubiOS CI this socket interface is the load-bearing detail: the bcvk fork's --swtpm flag ultimately has to orchestrate "start swtpm on the host, then hand its socket to QEMU" (yubiOS ref premise; see doc 05).

## Companion tooling

The swtpm package ships several tools for using the emulator, creating certificates for a TPM, and simulating the manufacturing of a TPM by creating its endorsement key (EK) and platform certificates [1] (weight 0.936).

The most important of these for reproducible CI is swtpm_setup. It is documented as "a tool that prepares the initial state for a libtpms-based TPM" and it simulates the manufacturing of a TPM 1.2 or 2.0 [5] (weight 0.902). Without swtpm_setup the emulator starts with an unprovisioned state blob, and flows that depend on an EK, an SRK, or NV indices will not behave the way they do on real hardware. One nuance worth carrying into test design: when re-creating the EK, the TPM 2 tools have to use the EK Template that is written at an NV index corresponding to the created EK [6] (weight 0.154, weak backing).

## Why this matters for hardware-free CI

A software TPM gives CI three properties a physical TPM cannot:

1. Zero hardware dependency. Any CI runner that can run QEMU can run swtpm; no TPM-carrying hardware pool is needed [1] (weight 0.946).
2. Resettable state. Because the TPM state is a directory of files, a CI job can start from a fresh manufacturing state on every run by re-running swtpm_setup against a new state directory [5] (weight 0.902).
3. Certificates on demand. The swtpm tooling can create the certificates a real TPM would be provisioned with at the factory, so UEFI firmware and guest stacks that expect a factory-provisioned TPM behave realistically [1] (weight 0.936).

## Sources

1. https://github.com/stefanberger/swtpm (weights 0.946, 0.936)
2. https://man.uex.se/8/swtpm (weight 0.349, weak)
3. https://github.com/RyzinRiley/swTPM (weight 0.799)
4. https://github.com/OpenCDP/QEMU-CDP/blob/master/docs/specs/tpm.rst (weight 0.723)
5. https://man.archlinux.org/man/swtpm_setup.8.en (weight 0.902)
6. https://www.mankier.com/8/swtpm_setup (weight 0.154, weak)
