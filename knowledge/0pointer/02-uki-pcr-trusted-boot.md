# UKI, PCR, and the Trusted Boot Chain

**Abstract.** Lennart Poettering's October 2022 essay "Brave New Trusted Boot World" argues that a general purpose Linux system needs a boot path that is fully signed and fully measured from firmware to userspace (https://0pointer.net/blog/brave-new-trusted-boot-world.html). The essay's linchpin is the Unified Kernel Image (UKI): one UEFI PE file combining the kernel, initrd, command line, and signature material, which SecureBoot can validate as a unit and systemd-stub can measure into the TPM as a unit. Around it, TPM Platform Configuration Registers (PCRs) are split by the owner of what they hold, vendor software (PCR 11), administrator configuration (PCR 12), local identity (PCR 15), so that expected values are pre-computable at OS build time. That pre-computability is what makes sealing secrets to PCR state practical across OS updates, which the older GRUB-style chain could not do. This doc reconstructs the essay's argument from the primary text and marks where later systemd work extended or changed it.

## The status quo the essay attacks

The essay opens with a diagnosis of how distributions booted in 2022: firmware, shim, GRUB, kernel, then a locally generated, unsigned initrd that unlocks the encrypted root file system. Firmware SecureBoot protects shim, and shim's key management protects GRUB and the kernel, but nothing protects the initrd, which is "trivial to attack and modify offline" precisely because it handles the disk encryption key (https://0pointer.net/blog/brave-new-trusted-boot-world.html).

The deeper problem is PCR brittleness. GRUB measures its chosen control flow path, not just code images, so PCR values "vary wildly" and cannot be pre-calculated during the OS build. That kills the two things measured boot is for: binding secrets to an expected boot state (a sealed secret would break on every update unless manually re-enrolled) and clean remote attestation, since locally generated initrds differ on every system (https://0pointer.net/blog/brave-new-trusted-boot-world.html).

## What a UKI is

A UKI is a single PE file containing an UEFI boot stub plus the boot resources as PE sections: the kernel (.linux), the initrd (.initrd), the command line (.cmdline), and optionally .osrel, .uname, .splash, .dtb, .pcrpkey, and .pcrsig (https://0pointer.net/blog/brave-new-trusted-boot-world.html). The format was later formalized as UAPI.5, which adds that the recommended build tool is ukify rather than a raw objcopy invocation, and defines multi-profile UKIs, one image carrying several selectable configuration profiles (https://uapi-group.org/specifications/specs/unified_kernel_image/).

Because everything is in one file, an update is one atomic file placed on the ESP, a FAT volume with weak data-safety guarantees, and SecureBoot signs all components and their combination at once. The essay also notes the practical size ceiling this implies: FAT32 caps files at 4 GiB (https://0pointer.net/blog/brave-new-trusted-boot-world.html).

## The measurement scheme

systemd-stub measures every UKI PE section into PCR 11 before transitioning to the kernel, with one exception: .pcrsig is excluded because it carries the expected result of the measurement and cannot also be an input to it (https://0pointer.net/blog/brave-new-trusted-boot-world.html). The used command line is measured into PCR 12, and if SecureBoot is enabled a command line passed by the loader is discarded in favor of the one built into .cmdline (https://0pointer.net/blog/brave-new-trusted-boot-world.html).

The four PCRs the essay claims, each defined by the owner of what it holds (https://0pointer.net/blog/brave-new-trusted-boot-world.html):

| PCR | Holds | Owner | Pre-calculable |
|---|---|---|---|
| 11 | UKI components and boot phases | OS vendor | Yes, at UKI build time |
| 12 | Kernel command line, runtime configuration | Administrator | Yes, when configuration is assembled |
| 13 | Initrd extension images (sysexts) | (Administrator) | Yes |
| 15 | Root file system volume key, later also machine ID and file system identity | Local system | Yes, after first boot |

Owner separation is the design's key move: PCR 11 values are identical on every machine running the same UKI, so the vendor can pre-calculate and sign them once; PCR 12 varies only with configuration; PCR 15 captures local identity (https://0pointer.net/blog/brave-new-trusted-boot-world.html). These were largely unused by Linux distributions at the time, and the essay points to the Linux TPM PCR Registry, now UAPI.7, for the full assignment map (https://uapi-group.org/specifications/specs/unified_kernel_image/).

## Signing keys and sealing

Two key pairs matter. The SecureBoot key signs the UKI PE binary and controls which OSes and kernels may boot. A second, deliberately narrow key signs the expected PCR 11 values; its signature goes into .pcrsig and its public key into .pcrpkey (https://0pointer.net/blog/brave-new-trusted-boot-world.html).

The sealing scheme is the essay's most concrete contribution. At enrollment, the system seals the disk encryption key (DEK) to the TPM's Storage Root Key with a policy requiring a signature that matches the current PCR 11 state and the public key from .pcrpkey. At unlock, the signatures shipped in .pcrsig, delivered to userspace via a synthesized initrd cpio visible at /.extra/, are checked against the live PCR 11 state before the TPM unseals the DEK. The DEK is bound to a public key expected to sign PCR values, not to literal PCR hashes, which is why an OS update does not force re-enrollment (https://0pointer.net/blog/brave-new-trusted-boot-world.html). The essay recommends enrolling a recovery key alongside the TPM binding. systemd-cryptenroll and systemd-cryptsetup implement this scheme for LUKS2 volumes (https://0pointer.net/blog/brave-new-trusted-boot-world.html).

## Boot phases

PCR 11 also accumulates fixed "words" at security boundaries: when the initrd starts, when it hands off to the root file system, at sysinit completion, when unprivileged logins become possible, and at shutdown. This lets a policy restrict, for example, the root volume key to the initrd phase so it is unavailable after the host transitions into the root fs. The essay puts phases in PCR 11 rather than a new register because PCRs are scarce and phases are OS-specific like the UKI itself (https://0pointer.net/blog/brave-new-trusted-boot-world.html).

Version-sensitive: the essay's phase names ("initrd-enter", "initrd-leave", "complete") differ from what shipped. systemd-pcrphase today measures "enter-initrd", "leave-initrd", "sysinit", "ready", "shutdown", "final" (https://systemd.io/TPM2_PCR_MEASUREMENTS/).

## Rollback protection

Because signed-but-buggy old UKIs remain valid SecureBoot artifacts, the essay proposes TPM counters, persistent registers that only increase, to invalidate old versions: the signature covering expected PCR values also covers an allowed counter range, and a new UKI's release bumps the lower bound past superseded versions, with controlled fallback windows in between. Version-sensitive: at the time of writing this was a proposal, not implemented (https://0pointer.net/blog/brave-new-trusted-boot-world.html).

## What shipped since, and what changed

The essay's implementation inventory named systemd-stub, systemd-measure, systemd-cryptenroll/cryptsetup, systemd-pcrphase, and systemd-creds, noting that rollback protection was unimplemented and the PCR 15 volume-key measurement was not yet merged (https://0pointer.net/blog/brave-new-trusted-boot-world.html). The current systemd measurement documentation confirms the landed shape: PCRs 5, 11, 12, 13, 15 are now measured, by systemd-boot, systemd-stub, systemd-pcrextend, and systemd-cryptsetup, with userspace measurements tied to boots through systemd-stub (https://systemd.io/TPM2_PCR_MEASUREMENTS/).

Two extensions go beyond the essay. First, PCR space proved too small, so systemd now supports NvPCRs, extend-style registers allocated in TPM NV index space, including a hardware identity NvPCR and, per a third-party deep dive, a reworked NvPCR anchoring design in systemd v262 (jev 0.14) (https://katexochen.aro.bz/posts/systemd-v262-nvpcrs/), version-sensitive. Second, the coverage map grew beyond the essay's four PCRs: machine ID and file system identity measurements into PCR 15, credentials and add-ons into PCR 12, SMBIOS data into PCR 1 (https://systemd.io/TPM2_PCR_MEASUREMENTS/).

Hardening guides now present UKI plus systemd-boot plus TPM2 PCR policy binding as the replacement for legacy GRUB-based LUKS measured-boot flows (jev 0.18) (https://www.systemshardening.com/articles/linux/uki-secure-boot-hardening/).

## Sources considered

- https://0pointer.net/blog/brave-new-trusted-boot-world.html: primary essay, fetched and read in full.
- https://systemd.io/TPM2_PCR_MEASUREMENTS/: primary, fetched; current measurement map.
- https://uapi-group.org/specifications/specs/unified_kernel_image/: primary, fetched; UAPI.5 formalization.
- https://katexochen.aro.bz/posts/systemd-v262-nvpcrs/: used for v262 NvPCR rework note (jev 0.14), not independently verified.
- https://www.systemshardening.com/articles/linux/uki-secure-boot-hardening/: used for adoption trend note (jev 0.18), not independently verified.
- https://deepwiki.com/systemd/systemd/4.1-early-boot-uefi-and-measured-boot: rejected, secondary, unverified.
- https://deepwiki.com/systemd/systemd/8.1-tpm2-and-measured-boot: rejected, secondary, unverified.
- https://wiki.archlinux.org/title/Unified_kernel_image: rejected, distro wiki, superseded by UAPI.5.
- https://wiki.gentoo.org/wiki/Unified_kernel_image: rejected, distro wiki.
- https://security.stackexchange.com/questions/282109/does-a-signed-tpm2-pcr-policy-verify-the-efi-code-similarly-to-secure-boot: rejected, not needed once essay verified.
- https://athenaos.org/en/security/tpm/: rejected, tutorial-level.
- skills/github-yubios-KS9n5GAT/0pointer-mastery/SKILL.md: used as navigation map only, not cited.
