# 02. Step 2 Mitigations: Pre-Init Hijack

Scope: the three Step 2 vectors of the Faux Phy chain, obfuscated kernel modules before systemd, modified LSM libraries with /usr bind mount poison, and poisoned systemd generators, and the yubiOS controls that stop each one (source doc: yubi-OS/yubiOS docs/MITIGATE.md, sections 2-A, 2-B, 2-C).

## 2-A: obfuscated kernel modules before systemd init

The attack, per the source doc: kernel modules with obfuscated names loaded before systemd inits, driven by device tree input manipulation, creating invisible nodes in /sys and /proc, and loading ARM CoreSight debug and trace infrastructure for exfiltration.

The controls stack four mechanisms plus one ARM64 specific block:

- Signed initrd embedded in the UKI. The initrd ships as the .initrd PE section of the signed UKI and is measured into PCR 11. There is no external initrd path, so module injection without invalidating the UKI signature is impossible (source doc).
- Kernel lockdown under Secure Boot. When UEFI Secure Boot is active, Linux enters lockdown mode and the kernel itself rejects unsigned modules. The upstream lockdown design prevents both direct and indirect modification of the running kernel image and is entered early enough in boot that the kernel cannot be tampered with mid flight (https://www.man7.org/linux/man-pages/man7/kernel_lockdown.7.html, jev weight 0.82). The kernel's Kconfig exposes LOCK_DOWN_KERNEL_FORCE_CONFIDENTIALITY as a build time default for the lockdown LSM (https://github.com/torvalds/linux/blob/master/security/lockdown/Kconfig, jev weight 0.78).
- IMA measurement: every kernel module is measured by IMA before loading (source doc).
- ConditionSecurity=measured-os: the PCR 11 state check; module injection that alters measurements breaks this condition and the enrollment wizard refuses to run (source doc).
- ARM64 CoreSight: on arm64 in development, lockdown with CONFIG_LOCK_DOWN_KERNEL_FORCE_CONFIDENTIALITY explicitly disables CoreSight trace interfaces, removing the exfiltration channel (source doc).

## 2-B: modified libselinux and libapparmor plus /usr bind mount poison

The source doc marks this as the centrepiece of the attack and the place where the core yubiOS defence applies. The qcom firmware sideload replaces libselinux.so.1, libapparmor.so.1, libacl and libmount, and the modified libmount bind mounts a poisoned /usr over the real /usr before systemd loads, nullifying all LSM enforcement.

The defence is dm-verity on /usr on every IO. Every dlopen() and every read from /usr, including libselinux.so.1, is validated against the Merkle tree; a modified library produces a hash mismatch and an IO error, so the poisoned library is never served to any process (source doc). /usr is mounted read-only through dm-verity and cannot be bind mounted over using modified libmount (source doc). On x86-64, the qcom,dload path does not exist, so the vector is not applicable; on arm64 in development, the same dm-verity check applies and the doc recommends preferring non Qualcomm ARM64 targets entirely (source doc).

The usrhash= mechanism backstops all of this: the dm-verity root hash of /usr is baked into the UKI command line at build time, and the kernel refuses to mount any /usr whose root hash does not match the signed cmdline (source doc). systemd-measure is the upstream tool that pre-calculates and signs the expected TPM2 PCR 11 values for a UKI, which is the same measurement surface the source doc relies on (https://www.freedesktop.org/software/systemd/man/latest/systemd-measure.html, jev weight 0.75).

## 2-C: poisoned generators, journal flushing, NVMe blocking

The attack: during root pivot, poisoned /usr causes systemd generators to run attacker code, the pre pivot journal is flushed, NVMe discovery and gpt-auto are blocked, and the command line is reinjected to start an attacker controlled systemd PID.

The controls (all source doc):

- dm-verity on generators: every file under /usr/lib/systemd/system-generators/ is dm-verity protected; a poisoned generator hash mismatches and is never executed.
- usrhash= integrity: the kernel refuses to run with a /usr whose root hash does not match, so the poisoned /usr never mounts.
- PCR boot phase measurements: initrd-enter and initrd-leave are measured into PCR 11, and the journal flush creates detectable gaps in the measurement log. Talos's Secure Boot documentation describes the same pattern of extending PCR 11 with boot phases to track operating system initialization (https://docs.siderolabs.com/talos/v1.14/platform-specific-installations/bare-metal-platform, jev weight 0.75), and systemd's own PCR measurement documentation covers the PCR 11 boot phase model (https://systemd.io/TPM2_PCR_MEASUREMENTS/, jev weight 0.74).
- DPS fallback discovery: systemd-gpt-auto-generator discovers partitions by Discoverable Partition Specification UUIDs, so discovery stays resilient when device node enumeration is blocked.

## Why the ordering matters

The Step 2 vectors all exploit the window before systemd runs, which is exactly the window the source doc's UKI signature, kernel lockdown, and dm-verity checks close: the initrd and kernel arrive as one signed binary, the kernel refuses unsigned modules and unsigned /usr, and the generators the attacker would poison live on the protected filesystem. The residual exposure is the firmware layer below, which doc 05 covers as an explicit gap rather than a control.
