# UEFI Secure Boot owner enrollment: PK, KEK, db, dbx

Scope: the UEFI PK/KEK/db/dbx key hierarchy and the mechanics of enrolling an owner-controlled signing key in firmware with efitools KeyTool, efi-updatevar, or mokutil.

## The four variables

Secure Boot has four key variables that are accessible through the efivarfs filesystem: PK, KEK, db, and dbx. PK sits at the root of the hierarchy and authorizes updates to KEK. KEK is an intermediate part of the hierarchy and authorizes updates to db and dbx (weight 0.25, https://www.glasklarteknik.se/post/so-you-want-to-dabble-with-custom-secure-boot-keys/).

The same structure is described by Microsoft's own tooling pages: the KEK database contains certificates used to verify the signature of updates to the db and dbx, which allows the platform owner, typically Microsoft or the OEM, to securely update the list of allowed or forbidden software (weight 0.33, https://deepwiki.com/microsoft/secureboot_objects/2-uefi-secure-boot-key-hierarchy).

Microsoft's Secure Boot key creation and management guidance addresses creation, storage and retrieval of Platform Keys (PKs), secure firmware update keys, and third-party Key Exchange Keys for OEMs and ODMs in a manufacturing environment (weight 0.94, https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/windows-secure-boot-key-creation-and-management-guidance?view=windows-11).

## What the OEM lock looks like

Azure's firmware secure boot documentation describes the default posture: after the OEM adds the db, dbx, and KEK databases and completes final firmware validation and testing, the OEM locks the firmware from editing and generates a platform key (PK). The OEM can use the PK to sign updates to the KEK or to turn off Secure Boot (weight 0.91, https://docs.azure.cn/en-us/security/fundamentals/secure-boot).

That locked default is exactly what owner enrollment has to reverse: the machine ships with the vendor as the platform owner, and the yubiOS decision is to re-take the PK rather than to live under it.

## Enrollment paths

Several concrete enrollment tools exist.

efitools: if you encountered the wrong filesystem permissions issue when trying to use efi-updatevar and cannot add keys with your BIOS, there is another solution: the KeyTool EFI application that comes with efitools (weight 0.60, https://wiki.gentoo.org/wiki/User:Sakaki/Sakaki%27s_EFI_Install_Guide/Configuring_Secure_Boot/Using_KeyTool).

mokutil: on bare metal servers you can add new keys for use with Secure Boot using the Machine Owner Keys (MOK) utility, run as the root user (weight 0.86, https://docs.oracle.com/en/engineered-systems/exadata-database-machine/dbmsq/adding-keys-using-mokutil.html). Note that MOK keys live in the shim-managed MokList, one level below the firmware db, which matters for the trust-anchor question this corpus tracks.

A helper-script project shows the full personal hierarchy flow: generate a personal UEFI Secure Boot key hierarchy (PK, KEK, db) and produce .esl and .auth signature list files ready to enroll into the motherboard's BIOS/UEFI firmware, while preserving the existing Microsoft/OEM db and dbx entries (weight 0.43, https://github.com/fsvm88/uefi-secureboot-dualboot-windows).

Alpaquita Linux documents the components from the distro side: a platform key (PK) and several SB databases including the signature database (db), revoked signatures database (dbx), and Key Enrollment Key database (KEK), with shim as the first stage bootloader and root of trust for the other booted components (weight 0.67, https://docs.bell-sw.com/alpaquita-linux/latest/how-to/use-own-keys-in-secureboot/).

## Setup mode and the ownership boundary

The PK is what moves firmware between setup mode and user mode: the PK establishes platform owner control and moves the firmware from setup mode into user mode (weight 0.05, https://windowsforum.com/news/microsoft-secure-boot-key-guidance-kek-ca-rollover-and-oem-best-practices.378419/). Clearing the PK puts the machine in setup mode, which is the precondition for enrolling a fresh owner hierarchy.

Custom-key guides describe the end state as being able to enroll your own signing key, sign modules, and maintain a verified boot path when the firmware would otherwise reject an unsigned binary at load time (weight 0.34, https://www.commandinline.com/linux-secure-boot-uefi-mokutil-key-management/).

A deep-dive guide covers inspecting DB/DBX, enrolling custom keys, and removing the Microsoft CA (weight 0.50, https://www.systemshardening.com/articles/linux/linux-uefi-secure-boot-db/).

Microsoft also publishes recommended PK, KEK, DB and DBX binaries in an open-source repository formatted to the expected EDKII format for firmware integration (weight 0.94, https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/windows-secure-boot-key-creation-and-management-guidance?view=windows-11), and cloud platforms now expose the same customization: on Azure Trusted Launch VMs the UEFI keys PK, KEK, DB, DBX can be fully replaced or appended in the image (weight 0.96, https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-secure-boot-custom-uefi). Both show that full key replacement, not just MOK append, is a supported operating mode of the platform.

## What yubiOS takes from this

The enrollment step is where ownership is physically established. A chain whose every later link is signed is only as owner-controlled as the hierarchy enrolled here. The yubiOS choice is to clear the vendor PK, enroll an owner-generated PK/KEK/db, and keep the private signing key on the YubiKey, so that the root of the firmware hierarchy and the key that signs the UKI are the same party: the owner.
