# 09 dm-verity, Measured Boot, and Remote Attestation

Scope: the cryptographic measurement layer of the vision: dm-verity on immutable filesystems, measured boot into TPM PCRs, and how measurements become remotely attestable evidence.

## The measurement goal

The vision demands cryptographic measurement everywhere: every stage of the boot measures the next, so a running system carries a verifiable record of exactly what booted (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). This is goal 4 of the essay and the precondition for goal 2's trust chain: validation and measurement are two halves of the same mechanism, one proves the code is trusted, the other proves which code ran.

## dm-verity as the measurement substrate

dm-verity provides tamper-evident block-level integrity: a Merkle hash tree covers every block of a read-only filesystem, and verification against the signed root hash happens at access time (source: https://www.systemshardening.com/articles/linux/dm-verity/, jev 0.54, low weight). A complete dm-verity root setup consists of the root filesystem image or partition, the verity hash tree file, the root hash of the verity tree, and the systemd-veritysetup integration that activates verification (source: https://wiki.archlinux.org/title/Dm-verity, jev 0.72). The boot-side plumbing is the systemd-veritysetup-generator, which translates kernel command line options configuring verity protected block devices into native systemd units early at boot (source: https://www.man7.org/linux/man-pages/man8/systemd-veritysetup-generator.8.html, jev 0.73).

In the vision, the usrhash= kernel parameter carries the dm-verity root hash inside the signed UKI command line, closing the loop: the expected root hash is delivered by a signature-protected channel, and any modification of /usr breaks the Merkle verification (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95).

## Measured boot into PCRs

Poettering's "Brave New Trusted Boot World" essay is the detailed treatment of the boot measurement chain. It assumes reader familiarity with TPM 2.0 security chips and their capabilities, including PCRs, measurements, and the SRK, plus boot loaders, the shim binary, Linux, and the initrd (source: https://0pointer.net/blog/brave-new-trusted-boot-world.html, jev 0.92). LWN's summary identifies the UKI as central to the proposed design: because the kernel, initrd, and cmdline are one signed binary, what gets measured is exactly what was signed (source: https://lwn.net/Articles/912370/, jev 0.50).

PCR partitioning is a design decision the essay makes explicit. PCR 7 is the machine-owner PCR for SecureBoot state, and it only contains data that can be pre-calculated, including the certificate shim uses to verify the payload, so a distribution can pre-compute PCR 7 expectations (source: https://lwn.net/Articles/946361/, jev 0.55). The practical pairing with disk unlock follows: systemd-stub extends PCRs predictably via the UKI .pcrsig section, and systemd-cryptenroll can bind a LUKS key to the specific measured kernel (source: https://botmonster.com/self-hosting/unified-kernel-images-systemd-boot-signed-linux/, jev 0.26, low weight; mechanism docs: https://www.man7.org/linux/man-pages/man8/systemd-veritysetup-generator.8.html, jev 0.73).

Independent commentary at the time framed the proposal as moving the Linux boot process into a world where building your own initial RAM disk is insecure by definition, because the initrd must be measured and signed (source: https://linuxsecurity.com/news/cryptography/microsoft-s-lennart-poettering-proposes-tightening-up-linux-boot-process, jev 0.52).

## From measurements to remote attestation

Measurements become attestation when a remote party verifies them. The production pattern is documented by Microsoft for Azure confidential computing: measure a read-only workload image with dm-verity and Linux IMA, then use confidential VM attestation to verify the measurements (source: https://learn.microsoft.com/en-us/azure/confidential-computing/how-to-attest-linux-workload, jev 0.91). Microsoft's security documentation supplies the platform framing: the TPM is a tamper-proof, cryptographically secure auditing component with firmware supplied by a trusted third party, and measured boot records the boot configuration into it (source: https://learn.microsoft.com/en-us/azure/security/fundamentals/measured-boot-host-attestation, jev 0.71).

An applied security analysis of the post-attestation world describes the composition the vision enables: a single /usr/local/bin that combines binaries from many different signed, dm-verity images, managed by systemd, each image individually attested (source: https://www.liamcvw.com/p/security-after-remote-attestation, jev 0.28, low weight).

## The integrity tool family

The vision sits inside a broader integrity tool family: dm-verity for read-only images, dm-integrity for writable partitions that need journaled integrity-on-write, and IMA for kernel-measured runtime integrity of individual files (source: https://www.systemshardening.com/articles/linux/dm-verity/, jev 0.54, low weight). The essay assigns them by layer: verity protects the immutable vendor code, and the writable halves (/etc, /var) rely on other mechanisms because they are not immutable (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95).

## Relevance to image-based immutable Linux

For an image-based OS, this layer is what turns "immutable" from a mount flag into a cryptographic property. The image ships with a verity tree and root hash; the UKI carries the hash in its signed cmdline; systemd-stub measures what it loads into PCRs; a remote verifier compares the PCR state against expected values from the release. Every link is covered by the sources above: UKI measurement (https://lwn.net/Articles/912370/, jev 0.50), verity activation (https://www.man7.org/linux/man-pages/man8/systemd-veritysetup-generator.8.html, jev 0.73), and workload attestation (https://learn.microsoft.com/en-us/azure/confidential-computing/how-to-attest-linux-workload, jev 0.91).
