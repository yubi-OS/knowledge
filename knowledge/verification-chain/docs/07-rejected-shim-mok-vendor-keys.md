# Rejected alternatives: shim+MOK and the vendor-key chain

Scope: the shim+MOK chain rooted at the Microsoft UEFI CA and the vendor-key (OEM PK/KEK) chain; why enrolling a subordinate key or accepting a vendor root fails the ownership test.

## The shim chain as commonly deployed

A typical Linux dual-boot chain of trust runs: PK, then KEK, then db (Microsoft UEFI CA), then shim.efi, then the MOK database, then grubx64.efi, then the vmlinuz signature; a break at any single link halts the entire sequence (weight 0.31, https://www.kbytechnologies.com/tech-fundamentals/fixing-uefi-secure-boot-chain-of-trust-failures).

The shim itself is signed by the Microsoft UEFI CA and the distro vendor signs grub: firmware loads shim.efi, which chains to grubx64.efi shipped pre-signed by the distro (CentOS, Rocky, Fedora, RHEL); shim's embedded vendor cert already trusts that signature, so no MOK enrollment is needed for the boot binaries themselves (weight 0.30, https://kldload.com/learn/secure-boot-chain).

The MOK layer sits inside the shim rather than the firmware: MOK (Machine Owner Key) Secure Boot is based on UEFI Secure Boot, adding the shim bootloader to chainload the next stage bootloader with the integrity check using shim-managed certificates corresponding to another set of trusted keys, which may be different than the trusted keys used by UEFI Secure Boot itself (weight 0.62, https://github.com/jiazhang0/meta-efi-secure-boot/blob/master/README.md).

A guide covering the full chain describes its reach: from firmware key databases through shim and MOK to the kernel, including inspecting DB/DBX, enrolling custom keys, removing the Microsoft CA, and understanding BootGuard and firmware update signing (weight 0.61, https://www.systemshardening.com/articles/linux/linux-uefi-secure-boot-db/).

## Why MOK enrollment is a subordinate grant

The key structural fact is placement: a MOK key added with mokutil lands in the shim-managed MokList, one level below the firmware db. The root that ultimately authorizes code execution is still whatever CA signed shim itself. Enrolling a MOK key grants your key authority inside a chain whose root you did not choose; you enroll a subordinate, not a root.

The MOK mechanism also has its own enforcement history: MokList, the MOK-based allowlisting, has been supported by the upstream UEFI shim since almost the very beginning, version 0.3, while MOK revocations, MokListX, only started to be enforced in version 0.9, which is a problem for older shims (weight 0.91, https://www.welivesecurity.com/en/eset-research/forgotten-uefi-shims-undermining-secure-boot/). Revocation lag inside the delegation layer is a concrete cost of routing ownership through shim rather than the firmware db.

## The vendor-key chain

The alternative vendor-key chain keeps the OEM at the root: Microsoft's key guidance addresses creation, storage and retrieval of Platform Keys, secure firmware update keys, and third-party Key Exchange Keys for OEMs and ODMs (weight 0.91, https://support.microsoft.com/en-us/servicing/os/secure-boot/2025/08/windows-secure-boot-key-creation-and-management-guidance), and its repository publishes the Microsoft recommended PK, KEK, DB and DBX binaries in EDKII format for firmware integration (weight 0.94, https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/windows-secure-boot-key-creation-and-management-guidance?view=windows-11).

Under this chain the owner's key, if enrolled at all, enters the db as an entry authorized by the vendor KEK. The per-board key lists are maintained by the platform owner, which is the vendor. This is the same anchor problem as the TPM case restated at the firmware layer: the party that can authorize new trust is not the device owner.

## The flip condition

The source decision record states when this alternative would win: yubiOS would adopt the shim+MOK chain if a distribution requirement forced Microsoft-CA-rooted boot on shipped hardware. That is a distribution-compatibility condition, not a security argument; the shim path exists to interoperate with systems whose firmware db cannot be replaced. On hardware the owner controls, replacing the db directly through owner enrollment is strictly stronger than appending a MOK under a Microsoft CA root, because the root of authorization moves to the owner instead of delegating below a vendor CA.
