# Rejected alternative: unsigned UKI with dm-verity only

Scope: why a dm-verity-only chain with an unsigned UKI is integrity without authorization: anyone can produce a matching Merkle tree for their own image.

## dm-verity verifies data against a hash, not a decision

The kernel documentation defines what dm-verity does and what it assumes: when a dm-verity device is configured, it is expected that the caller has been authenticated in some way, such as cryptographic signatures; after instantiation, all hashes are verified on-demand during disk access, and if they cannot be verified up to the root node of the tree, the I/O fails (weight 0.96, https://docs.kernel.org/6.14/admin-guide/device-mapper/verity.html).

The assumption clause is the whole argument. dm-verity authenticates a block device against one root hash. It has no opinion about who computed that hash or who was allowed to sign anything.

## The failure mode without a signed anchor

A read-only-rootfs explainer states it plainly: the security of the whole scheme depends on one thing, the root hash must be delivered to the kernel by a source you already trust, such as a signed kernel command line or an in-kernel signature; without that anchor, dm-verity checks data against a root hash an attacker could have supplied (weight 0.11, https://www.techveda.live/2026/08/03/dm-verity-read-only-rootfs/).

The attack is mechanical. The dm-verity setup components are public: a root filesystem image or partition, a verity hash tree verity.bin, the root hash in roothash.txt, systemd-veritysetup-generator, and verity kernel command line options (weight 0.75, https://wiki.archlinux.org/title/Dm-verity). An attacker who controls the boot path can run the same veritysetup tooling over their own modified image, obtain a valid hash tree for it, and hand the kernel the matching root hash. Every subsequent block check passes, because the tree genuinely matches the data. Integrity held; authorization did not.

This is why the unsigned-UKI option is classified as an abstraction in the source decision record: it drops the first link of the chain. dm-verity without a signed root hash is integrity without authorization; anyone can produce a matching tree for their own image.

## Real-world bypasses confirm the shape

The attack class is not hypothetical. Reporting on vulnerable UEFI shims describes an attack that needs no memory corruption or reverse engineering: it is enough for an attacker to build an unsigned kernel image, copy it alongside the old shim and GRUB 2, and load it with a single command at boot (weight 0.55, https://www.infosecurity-magazine.com/news/uefi-shims-secure-boot-bypass/). A broader vulnerability report covers a bypass of Secure Boot protections on modern Linux distributions requiring only brief physical access (weight 0.20, https://cybersecuritynews.com/linux-boot-vulnerability-allows-bypass-of-secure-boot-protections/).

The general lesson from embedded secure-boot reviews applies equally: a board can reject obvious unsigned kernel boot attempts and still be bypassed through a less obvious residual command path, which is why a secure boot review cannot stop at the nominal boot path (weight 0.33, https://www.lynx.com/blog/securing-u-boot-a-guide-to-mitigating-common-attack-vectors). In the unsigned-UKI design, the residual path is not obscure at all: the entire command line, root hash included, is unauthenticated.

## In-kernel signature checking narrows but does not close the gap

Kernel-side dm-verity root hash signature verification exists as an option; documentation of the approach notes that this option allows the kernel to verify a signed DM-Verity root hash when the verity mapping is created, with a certificate that can be generated from the build system, and frames moving this check out of the initramfs as a trust-boundary shift rather than merely an optimization (weight 0.41, https://www.lynx.com/blog/dm-verity-without-an-initramfs/).

That closes the cmdline gap but relocates the question: the verifying certificate is now embedded in the kernel, and the kernel itself is the object that must be authorized. If the UKI is unsigned, nothing establishes that the kernel doing the verifying is the owner's kernel. The chain still needs its first link. That is precisely the role the owner-signed UKI plays in the accepted design: sign the object that carries the root hash, and the kernel's on-demand verification inherits an authorized anchor.
