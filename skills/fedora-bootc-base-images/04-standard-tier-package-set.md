# 04 - The standard tier package set

Scope: what the Fedora standard tier already ships, what yubiOS should consider removing, and what yubiOS must add in its own layer, with the network behavior implied by the package set.

Ground source: `yubi-OS/yubiOS skills/fedora-bootc-base-images/SKILL.md`. This doc explicates the source doc's "What the standard tier includes (relevant to yubiOS)" section.

## Already included, no need to add

The source doc lists 3 groups that the standard tier carries and yubiOS therefore inherits for free (source doc):

- `bootc`, which provides in-place upgrades.
- LUKS, LVM, and RAID filesystem tools.
- `systemd` and `NetworkManager`.

The bootc inheritance point is structural: a bootc base image is defined by transactional, in-place operating system updates shipped as OCI/Docker container images (https://docs.fedoraproject.org/en-US/bootc/getting-started/, jev weight 0.94), so an image built FROM the standard tier gets the upgrade machinery without adding a package.

NetworkManager inclusion is corroborated by Fedora's own network documentation, which states that "the default 'full' images include NetworkManager" and that unless otherwise configured, Fedora/CentOS bootc will attempt DHCP on every interface with a cable plugged in (https://docs.fedoraproject.org/en-US/bootc/sysconfig-network-configuration/, jev weight 0.88). That sentence has 2 consequences for yubiOS: the full (standard) tier naming aligns with the tier table in doc 02, and the DHCP-by-default behavior is part of what a derived image inherits, so a headless appliance build needs explicit network configuration or it will DHCP every wired interface.

## Consider removing: podman

The source doc names exactly 1 candidate for removal: `podman`, to be avoided "if not running containers inside yubiOS", with the rationale of reducing attack surface (source doc). The standard tier's package set includes podman (source doc, tier table in doc 02), so it arrives by default and a derived image must actively strip it if the OS will not run nested containers. Removing it shrinks the CVE surface and the dependency closure without touching the boot path.

## Not included: what yubiOS must add

The source doc enumerates the additions the yubiOS layer must make (source doc):

- `ykman`, `pcscd`, `opensc`, the YubiKey tooling trio: the CLI manager, the PC/SC daemon that mediates smartcard access, and the PKCS#11/OpenSC stack.
- `pam-u2f`, the FIDO2 PAM module, which is what turns a YubiKey touch into a PAM authentication factor.
- `yubikey-manager` for enrollment scripts.
- Cloud agents such as `cloud-init`, added only for cloud deployments.

This split defines the boundary of the skill's job: the base image owns the generic bootable OS, and the derived layer owns everything identity- and deployment-specific. That boundary is also the source doc's stated rule for the skill itself, that every use stays inside the frontmatter description's scope and anything beyond it is a different skill's job (source doc).

## Why the add list is small

The reason the yubiOS layer stays small is the tier choice from doc 02: standard already carries the storage (LUKS, LVM, RAID), init (systemd), and network (NetworkManager) stack. The dig corroborates that the default full images include NetworkManager (jev weight 0.88, above). What the tier does not carry is anything YubiKey related, which is expected: those packages are niche security tooling that a generic Fedora base image has no reason to ship.

## Weak-backing caveats

The package lists in this doc rest on the source doc, which is the primary source of record. The dig corroborated the NetworkManager and bootc claims with 0.94 and 0.88 weight sources but did not surface an independent page enumerating ykman/pcscd/opensc/pam-u2f as absent from the standard tier; treat the exact add list as the source doc's record and verify current package availability in the pinned digest when building.
