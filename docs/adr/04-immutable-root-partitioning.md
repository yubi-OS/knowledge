# 04 - Immutable root and partitioning (ADR-006, ADR-007, ADR-010, ADR-012)

Scope: the dual mkosi and bootc build paths, composefs over a dm-verity checked erofs root, the Discoverable Partitions Specification replacing /etc/fstab, and systemd-repart first-boot partitioning with on-device key generation.

## Two build paths, one runtime (ADR-006)

The source doc (yubi-OS/yubiOS docs/ADR.md, ADR-006, status Accepted) records that yubiOS maintains both a `mkosi.conf` path in the particleos ethos and a `Containerfile` path in the bootc design. The mkosi path produces a UKI with embedded verity, signed at build time, in a particleos style offline build; the bootc path produces an OCI image with day 2 upgrades via `bootc upgrade` and a registry pull workflow. Both consume the same `usr/` overlay tree and deliver identical runtime behavior, so maintainers choose based on deployment model. The recorded artifact split: mkosi produces signed UKI `.efi`, dm-verity root, and composefs image; bootc produces an OCI image deployable via `bootc install to-filesystem`. (source doc)

## composefs over dm-verity erofs (ADR-007)

ADR-007 (source doc, status Accepted) decides that the read only root filesystem is composefs over a dm-verity checked erofs partition, following the particleos pattern. The rationale: composefs provides a cryptographically verified directory tree via fs-verity; the erofs backing store is signed by systemd-repart's verity support; the roothash is embedded in the UKI kernel cmdline at build time, so tampering is detected before any userspace runs; and the design is compatible with bootc day 2 upgrades because each new OCI layer produces a new erofs plus verity pair and old layers are garbage collected. Implementation pointers recorded: dracut module line `add_dracutmodules+=" composefs dm-verity"` in 51-yubiOS-composefs.conf, repart definitions `Type=root` with `Verity=data` plus a matching `Type=root-verity` partition in 50-yubiOS-root.conf, and `Verity=signed` already set in mkosi.conf. (source doc; upstream project cited at https://github.com/containers/composefs)

The dig corroborates the mechanics at weak weights: the composefs upstream repository describes stacking read only mountable filesystem trees on an underlying store (https://github.com/composefs/composefs, weight 0.20, weak); containerd's erofs differ documentation describes appending a Merkle hash tree to an EROFS blob and generating a root hash when dm-verity is enabled (https://containerd.io/docs/main/snapshotters/erofs/, weight 0.35, weak); and Alpine's wiki explains the erofs plus dm-verity pairing used in image based distributions (https://wiki.alpinelinux.org/wiki/DM-verity, weight 0.45, weak). A community essay on image sealing through a single cryptographic digest scored 0.18 (weak) and a ProTENOS design pattern note 0.19 (weak), both recorded as corroboration only.

## No /etc/fstab: the Discoverable Partitions Specification (ADR-010)

ADR-010 (source doc, status Accepted) removes /etc/fstab entirely. The recorded context: fstab lives inside the root filesystem, creating a circular dependency where you need the root fs to know where the root fs is, and boot loader configs duplicate the information, creating drift. The decision is to partition all yubiOS disks using GPT partition type UUIDs from the Discoverable Partitions Specification and let systemd-gpt-auto-generator handle mount discovery at boot. The source doc cites https://systemd.io/DISCOVERABLE_PARTITIONS and https://0pointer.net/blog/the-wondrous-world-of-discoverable-gpt-disk-images.html.

The dig independently confirms the specification: the UAPI Group's DPS document describes using GPT UUIDs to enable automatic discovery of partitions and their intended mountpoints (https://uapi-group.org/specifications/specs/discoverable_partitions_specification/, weight 0.53, authoritative), and the systemd man page for systemd-gpt-auto-generator describes discovering and mounting root, /home, and /srv partitions based on GPT type UUIDs (https://www.linux.org/docs/man8/systemd-gpt-auto-generator.html, weight 0.41, weak). A chromiumos mirror of the specification text scored 0.33 (weak).

The recorded partition layout (source doc): the shipped image carries 4 partitions (ESP with systemd-boot plus UKI, /usr A as immutable verity protected erofs, its verity Merkle tree, and the PKCS#7 signature of the verity root hash). systemd-repart creates 6 more on first boot: the /usr B slot plus its verity and signature partitions (initially empty, filled on first update), the root filesystem as LUKS2 btrfs with YubiKey FIDO2 enrolled, the integrity protected home filesystem for systemd-homed per-user LUKS2, and encrypted swap. A/B versioning is encoded in GPT partition labels like `yubiOS_0.8`, and strverscmp() picks the newest automatically in every tool that dissects the image.

## First-boot partitioning with on-device keys (ADR-012)

ADR-012 (source doc, status Accepted) closes the installer question: yubiOS ships a minimal disk image (ESP plus /usr A only), and systemd-repart running from the initrd creates and encrypts all remaining partitions on first boot. The recorded rationale is trust critical: the LUKS2 root fs key is generated on the target device by systemd-repart and never exists on the build host or in transit, because keys generated outside the device create leakage opportunities during manufacturing or distribution. The live image is the installer image: writing the shipped image to a USB stick with `dd` makes it the installer, with no separate installer artifact. systemd-repart also reads the physical disk size and sizes the root fs partition to fill available space. Factory reset is the inverse: repart erases partitions 8 to 10 and recreates them with fresh keys, triggered via EFI variable or kernel argument. Implementation: `usr/lib/repart/` holds the partition definitions, the bootc install config passes `--repart-offline`, and YubiKey FIDO2 enrollment runs from `yubiOS-enroll.service` on first console login after repart creates the LUKS2 volume. (source doc; cited at https://www.freedesktop.org/software/systemd/man/latest/systemd-repart.html and https://0pointer.net/blog/fitting-everything-together.html)

## Sources considered

| Source | Weight | Role |
|---|---|---|
| https://uapi-group.org/specifications/specs/discoverable_partitions_specification/ | 0.53 | DPS primary specification |
| https://wiki.alpinelinux.org/wiki/DM-verity | 0.45 (weak) | erofs plus verity pairing |
| https://www.linux.org/docs/man8/systemd-gpt-auto-generator.html | 0.41 (weak) | gpt-auto-generator behavior |
| https://containerd.io/docs/main/snapshotters/erofs/ | 0.35 (weak) | EROFS Merkle tree mechanics |
| https://chromium.googlesource.com/chromiumos/third_party/systemd/+/refs/tags/upstream/v248/docs/DISCOVERABLE_PARTITIONS.md | 0.33 (weak) | DPS mirror text |
| https://github.com/composefs/composefs | 0.20 (weak) | composefs upstream |
| https://proteanos.com/doc/rootfs-integrity-dm-verity-immutable-images/ | 0.19 (weak) | design pattern corroboration |
| https://scrivano.org/posts/2026-06-05-sealing-with-composefs/ | 0.18 (weak) | sealing essay |
| https://third-party-mirror.googlesource.com/systemd/+/2398d87694e8af48e92ff8fb5f9cf273f706fb00/docs/DISCOVERABLE_PARTITIONS.md | 0.18 (weak) | DPS mirror |
| yubi-OS/yubiOS docs/ADR.md (source doc) | n/a | ADR-006, ADR-007, ADR-010, ADR-012 text |
