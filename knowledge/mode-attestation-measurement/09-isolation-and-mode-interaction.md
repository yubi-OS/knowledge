# Isolation and mode interaction: running the attestation agent rootless

Scope: how the privilege mode composes with the execution mode for the remote-attestation agent: udev-granted device access, systemd sandboxing directives, and why neither boundary alone is the answer.

## The setup

The remote-attestation agent has to talk to the TPM, and the TPM device nodes are root-owned by default. Access is granted to a non-root service through a udev rule rather than by running the agent as root. The two TPM device nodes matter here: /dev/tpm0 is raw access to the TPM driver, and /dev/tpmrm0 is access through the in-kernel TPM resource manager, which is the recommended path (Super User answer on TPM access without root, weight 0.04, weak backing: https://superuser.com/questions/1463364/accessing-trusted-platform-moduletpm-without-root-permission). Non-root users need explicit permissions on /dev/tpmrm0 to use the TPM (Teleport device trust docs, weight 0.61: https://goteleport.com/docs/zero-trust-access/device-trust/guide/), and services that need TPM access get it by adding a udev rule for tpm0 and tpmrm0 rather than by overriding the service to run as root (Microsoft Learn, provisioning with a virtual TPM, weight 0.86: https://learn.microsoft.com/en-us/azure/iot-edge/how-to-provision-devices-at-scale-linux-tpm).

The established convention for TPM userland is ownership by the tss account and group: /dev/tpm0 owned by tss:root and /dev/tpmrm0 by tss:tss (tpm2-abrmd issue on service start, weight 0.57: https://github.com/tpm2-software/tpm2-abrmd/issues/737). Practical guides agree: add the service's user to the tss group to get access to /dev/tpmrm0 (tpm-fido README, weight 0.52: https://github.com/psanford/tpm-fido).

## The systemd hardening layer

The agent's unit applies the standard sandboxing directives on top of the device grant. ProtectSystem=strict mounts the entire filesystem hierarchy read-only except for the API filesystem subtrees /dev/, /proc/ and /sys/ (RogueSecurity systemd hardening writeup, weight 0.55: https://roguesecurity.dev/blog/systemd-hardening). CapabilityBoundingSet removes or retains specific capabilities, for example removing CAP_SETUID and CAP_SETPCAP from the bounding set (same source, weight 0.55).

The composition rule is that a seccomp filter and a privilege boundary are two different walls. A SystemCallFilter allowlist and CapabilityBoundingSet work together when applied to a root service, and sandboxing is especially valuable there (Linux Junkies systemd sandboxing guide, weight 0.19, weak backing: https://linuxjunkies.org/guides/lock-down-systemd-services). A common hardened profile combines NoNewPrivileges, PrivateTmp, ProtectSystem=strict, RestrictAddressFamilies, RestrictNamespaces, and MemoryDenyWriteExecute in one unit (hardened systemd options gist, weight 0.16, weak backing: https://gist.github.com/ageis/f5595e59b1cddb1513d1b425a323db04).

## Why the composition matters for attestation specifically

The attestation agent is exactly the process you do not want to trust with broad privilege, because it is the process that reports on everything else. If it is compromised, its reports are compromised. Running it rootless with an explicit device grant shrinks the blast radius: compromise of the agent yields access to the TPM character device, not to the system.

But the execution mode is what makes the privilege mode meaningful. Consider the modes from the rest of the corpus:

1. One-shot verifiers run as ordinary CI processes with no device access at all; there is nothing to isolate because there is nothing to grant.
2. The measurement TA lives in the secure world (doc 02), where the privilege boundary is the secure/non-secure split, not systemd.
3. The quote path (doc 04) is the one that needs /dev/tpmrm0 in the normal world, and it runs on demand, so its sandbox applies to short-lived request handling rather than a long-lived daemon.

The isolation configuration is per mode, not per machine. A single global "the agent runs hardened" statement hides that the one-shots need no sandbox, the daemon needs liveness supervision plus a sandbox, and the on-demand path needs a sandbox that permits TPM access only during the quote.

## What the boundary proves and what it cannot

The sandboxing directives prove a negative property: the agent cannot write to the filesystem it observes, cannot gain new privileges, and cannot make arbitrary syscalls. They do not prove the agent is honest, only that a compromised agent is weak. The positive property, that the agent's reports reflect real platform state, still comes from the modes: the quote's signature (doc 04) and the event log's replayability (doc 02). Isolation protects the reporter; attestation proves the report. A mode table that documented the systemd directives without the device grant, or the device grant without the syscall filter, would describe half a boundary in both cases.
