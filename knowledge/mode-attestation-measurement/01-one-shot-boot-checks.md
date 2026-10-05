# One-shot boot checks: UKI signature and dm-verity root hash

Scope: the two one-shot verification steps in a yubiOS-style boot chain, the UKI signature check at UEFI boot and the dm-verity root hash check at mount, with their trigger points, refusal semantics, and what each proves exactly once.

## What one-shot means here

A one-shot check runs once at a fixed trigger point, produces a binary verdict, and keeps no mutable state of its own. The verdict is a pure function of the bytes being checked: run it twice on unchanged input and it returns the same answer. That property is what makes the CI mirror of a boot-time check meaningful, because the CI run and the boot run exercise the same pure function on the same artifact.

## UKI signature check (UEFI firmware, at boot)

Trigger: UEFI firmware, before any OS code runs. The firmware verifies the signature on the unified kernel image against the keys in its signature database as part of the Secure Boot chain of trust, which continues through the bootloader into the kernel (ArchWiki Secure Boot, weight 0.77: https://wiki.archlinux.org/title/Unified_Extensible_Firmware_Interface/Secure_Boot).

The verification logic itself is small and byte-oriented. sbverify verifies a UEFI secure boot image against an X.509 certificate with `sbverify --cert <certfile> <efi-boot-image>` (Arch sbverify man page, weight 0.83: https://man.archlinux.org/man/extra/sbsigntools/sbverify.1.en). It reports "Signature verification OK" on success (Gentoo Wiki, weight 0.73: https://wiki.gentoo.org/wiki/Secure_Boot) and exits non-zero when verification fails (ManKier sbverify page, weight 0.50: https://www.mankier.com/1/sbverify).

Because the check runs inside firmware, the OS never observes an exit code: there is no OS yet to observe one. The observable contract at boot is boot or refuse. Failure means the machine does not run the image; there is no log line, no return code, and no retry loop.

What this one-shot proves: the exact bytes of the image were signed by the holder of the key matching the certificate. What it cannot prove: anything about the state of the system after boot begins. It is a point-in-time verdict on a byte string.

Idempotency: yes. Signature verification reads the image and the certificate and computes a verdict; it mutates nothing. Re-running it on the same image yields the same verdict, which is why the same command doubles as the CI gate (ArchWiki shows `sbverify --cert` used inside kernel-install scripts as exactly this gate, weight 0.77: https://wiki.archlinux.org/title/Unified_Extensible_Firmware_Interface/Secure_Boot).

## dm-verity root hash check (kernel, at mount)

Trigger: the kernel, when the verity-mapped device is instantiated. The caller supplies the root hash, and the kernel checks block reads against the Merkle tree rooted at that hash. Per the kernel documentation, after instantiation "all hashes will be verified on-demand during disk access" and I/O "will fail" when a block cannot be verified up to the root hash (kernel.org dm-verity admin guide, weight 0.97: https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/verity.html). In practice a tampered block causes reads to return an I/O error, or a panic if the system is configured for it (kernel-internals.org dm-verity writeup, weight 0.65: https://kernel-internals.org/block/dm-verity/).

Mode: one-shot then passive. The decision that the root hash is the trusted one happens once, at mount. After that, dm-verity keeps verifying on every read, but passively, inside the I/O path, not as a separate scheduled step. This is the important difference from the UKI check: dm-verity continues to prove integrity at runtime, but it never becomes a daemon, has no lifecycle, and produces no event stream. Its entire output surface is the success or failure of reads.

Refusal semantics: there is no exit code here either. The kernel path fails with an I/O error on the affected read. A wrong root hash means the mapping is built against the wrong tree and reads fail (a real-world case of verify-passing-but-mount-failing after a kernel change is documented on Stack Exchange, weight 0.07, weak backing: https://unix.stackexchange.com/questions/419570/veritysetup-verify-successful-but-mount-fails-after-upgrade-to-new-kernel).

Idempotency: yes. `veritysetup verify` verifies the hash tree against a root hash and creates no device; it is a pure function of the two devices plus the hash (Ubuntu veritysetup man page, weight 0.89: https://manpages.ubuntu.com/manpages/xenial/man8/veritysetup.8.html). The kernel-side mount is effectively idempotent too, because mapping the same devices with the same root hash produces the same verified view.

## What the mode buys and what it costs

The one-shot mode is cheap to reason about: one trigger, one verdict, no state. Its cost is coverage. It proves integrity at the moment of the trigger and is silent afterwards. Any property that must hold continuously, such as which code is loaded into the kernel or which processes are running, needs a different mode: passive re-verification inside the I/O path, a daemon-resident measurement, or a runtime detection daemon. Those modes are covered in the following docs in this corpus.
