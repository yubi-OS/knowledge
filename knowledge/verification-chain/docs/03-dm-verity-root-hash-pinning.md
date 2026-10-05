# dm-verity root hash pinning: the kernel refuses a mismatched /usr

Scope: how the dm-verity root hash travels in the UKI's signed kernel command line and what the kernel does when the /usr Merkle tree does not match.

## dm-verity's contract is explicit about its anchor

The kernel's own documentation states the requirement twice, in almost the same words. dm-verity is meant to be set up as part of a verified boot path, ranging from a boot using tboot or trustedgrub to just booting from a known-good device like a USB drive or CD (weight 0.96, https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/verity.html). And: when a dm-verity device is configured, it is expected that the caller has been authenticated in some way, such as cryptographic signatures; after instantiation, all hashes are verified on-demand during disk access, and if they cannot be verified up to the root node of the tree, the root hash, then the I/O fails (weight 0.96, https://docs.kernel.org/admin-guide/device-mapper/verity.html).

That second sentence is the whole design: the kernel verifies every block against a root hash it was handed, and the security of the scheme is entirely a question of who handed it over.

## Where the root hash lives

A dm-verity root setup consists of a root filesystem image or partition, a verity hash tree verity.bin, the root hash of the verity tree in roothash.txt, systemd-veritysetup-generator, systemd-veritysetup@.service, verity kernel command line options, and veritysetup from cryptsetup (weight 0.85, https://wiki.archlinux.org/title/Dm-verity).

systemd-veritysetup-generator translates kernel command line options configuring verity protected block devices into native systemd units early at boot and when the system manager configuration is reloaded, creating systemd-veritysetup@.service units (weight 0.95, https://www.freedesktop.org/software/systemd/man/systemd-veritysetup-generator.html). The generator's settings systemd.verity_root_data= and systemd.verity_root_hash= take block device paths as arguments to configure the data partition and hash partition for the root file system (weight 0.87, https://www.man7.org/linux/man-pages/man8/systemd-veritysetup-generator.8.html).

On the disk format: the verity kernel code does not read the verity metadata on-disk header; it only reads the hash blocks which directly follow the header. It is expected that a user-space tool will verify the integrity of the verity header, or the header can be omitted entirely (weight 0.95, https://www.kernel.org/doc/html/v5.4/admin-guide/device-mapper/verity.html). In other words, the on-disk header is not a trust anchor; the root hash delivered through the boot path is.

## The root hash is only as trustworthy as its channel

Implementation guidance for immutable images makes the channel explicit: the implementation involves generating a hash tree, passing the root hash through a verified channel such as a signed kernel command line or initramfs, and handling corruption gracefully (weight 0.25, https://proteanos.com/doc/rootfs-integrity-dm-verity-immutable-images/).

A third-party explainer states the failure mode directly: the security of the whole scheme depends on one thing, the root hash must be delivered to the kernel by a source you already trust, such as a signed kernel command line or an in-kernel signature; without that anchor, dm-verity checks data against a root hash an attacker could have supplied (weight 0.11, https://www.techveda.live/2026/08/03/dm-verity-read-only-rootfs/).

On kernels without in-kernel DM-Verity root-hash signature verification, an initramfs may be necessary if Linux needs to verify the root hash during boot; the tradeoff is boot-time and storage overhead (weight 0.40, https://www.lynx.com/blog/dm-verity-without-an-initramfs/).

## How yubiOS closes the loop

In the yubiOS chain, the UKI is signed by the owner's YubiKey and the cmdline is a section of that signed PE binary. The cmdline carries the dm-verity root hash. The generator converts those cmdline options into early-boot units, the kernel verifies every /usr block against the pinned hash, and mismatched I/O fails. An attacker who modifies /usr must also produce a UKI whose cmdline carries the matching new hash, which means re-signing with the owner's key, which means holding the YubiKey.

For immutable root deployments, operational guidance notes that dm-verity and immutable root filesystem patterns have become standard practice across modern Linux distributions, and that writable state has to be planned around the read-only constraint from the start (weight 0.43, https://proteanos.com/doc/rootfs-integrity-dm-verity-immutable-images/). Related tooling separates the writable case: dm-integrity covers tamper-evident block-level roots for writable partitions alongside dm-verity for read-only ones (weight 0.41, https://www.systemshardening.com/articles/linux/dm-verity/).
