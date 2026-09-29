# Fitting Everything Together: Poettering's Image-Based OS Vision

## Abstract

In May 2022, Lennart Poettering published "Fitting Everything Together," the first essay that states, end to end, how the systemd OS-construction components are meant to compose into a single coherent operating system (https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). The argument: build the OS image-based rather than package-based, make every byte of vendor code hermetic inside an immutable, dm-verity protected `/usr/`, cryptographically bind that tree into a unified kernel image signed under UEFI SecureBoot, and generate all local state and secrets on first boot rather than at install time (jev 0.95). Distribution packages remain, but only as a build-time input; deployment is GPT images per the Discoverable Partitions Specification. This essay underpins image-mode OS design as such: bootc, UKI-based SecureBoot chains, verity-protected `/usr`, and A/B atomic updates all trace back to the stack Poettering laid out here.

## The core inversion: packages become build-time, images become runtime

Poettering frames the focus as "an image-based design rather than a package-based one": reproducible, immutable images that describe the OS "in full," with RPM and dpkg demoted from deployment tools to tools "for building the objects to deploy" (https://0pointer.net/blog/fitting-everything-together.html). LWN's coverage of the essay quoted exactly this framing as the essay's headline position (https://lwn.net/Articles/894396/, jev 0.97). The design target is "cattle, not pets": many instances of the same cryptographically signed combination of software, with maximum bit-exact reuse and minimum local variance (https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). Notably, this is explicitly not a rejection of distributions: packages stay excellent for assembling images on a build host, and the essay leans on what distributions do well, security update cycles and integration (https://0pointer.net/blog/fitting-everything-together.html, jev 0.95).

## Hermetic /usr: the load-bearing idea

The foundational claim is that the OS should be hermetic in `/usr/`: the `/usr` tree carries everything needed to set up the minimal set of directories and files outside of `/usr`, is mounted read-only into a writable root, and the writable root carries only `/etc`, `/var`, and `/home` (https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). Combine the `/usr` tree with an empty root file system and the system boots, because `systemd-sysusers` and `systemd-tmpfiles` declaratively generate users and skeleton files, and Fedora had by then adopted the `/usr` merge plus both tools (https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). Monopolizing vendor resources in an immutable `/usr` buys three things the essay enumerates: whole-tree dm-verity integrity with one operation, A/B atomic updates that leave the rest of the system untouched, and factory reset by simply erasing the root file system and rebooting (https://0pointer.net/blog/fitting-everything-together.html, jev 0.95).

## The trust chain and the boot flow

The partition table is four conceptual entries at first: an ESP, two verity-protected signed `/usr` partitions (versions A and B), and one writable encrypted root, with partition type UUIDs from the Discoverable Partitions Specification so the image is self-descriptive and needs no `/etc/fstab` (https://0pointer.net/blog/fitting-everything-together.html, jev 0.95; the DPS itself was later formalized as UAPI.2 at https://uapi-group.org/specifications/specs/discoverable_partitions_specification/). Booting uses unified kernels ("Boot Loader Specification Type #2"): kernel, initrd, command line, and splash wrapped in one UEFI PE binary, signed as one piece for SecureBoot, and easy to update by dropping in one file (https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). Each kernel version is paired with exactly one `/usr` version; the `usrhash=` command-line option, processed by the veritysetup and fstab generators, pins the dm-verity root hash, which also locates the `/usr` partition in the GPT because partition UUIDs are derived from it (https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). systemd-boot version-sorts the kernels it finds and boots the newest; no explicit switch mechanism is required (https://0pointer.net/blog/fitting-everything-together.html, jev 0.95).

The essay is blunt about the status quo it fixes: on mainstream distributions, SecureBoot is "mostly security theater" because the initrd that unlocks full-disk encryption is unsigned and trivially modifiable offline, so an attacker can harvest the FDE passphrase (https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). Unified kernels close that gap by making the initrd part of the signed object. The encrypted root (LUKS2) is locked to the TPM2 chip, so data is unreadable unless the machine's own chip runs the validated OS; the essay's trust chain summary runs firmware (or shim) to systemd-boot to unified kernel to initrd-validated sysexts to TPM2-unlocked root (https://0pointer.net/blog/fitting-everything-together.html, jev 0.95).

## First boot, not install

Every image is a live image; installation is `dd`. Keys are generated locally on first boot via `systemd-repart`, which runs from the initrd, creates and formats the encrypted root, enrolls the TPM2-bound key, and sizes the root to the actual storage; the shipped image contains only the ESP and `/usr` version A (https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). Factory reset is `systemd-repart` erasing marked partitions from the initrd on the next boot, then rebuilding fresh keys (https://0pointer.net/blog/fitting-everything-together.html, jev 0.95).

## Modularity without mutability

The essay resolves the immutability versus extensibility tension with three tiers (https://0pointer.net/blog/fitting-everything-together.html, jev 0.95):

1. System extensions: `systemd-sysext` images merged into `/usr` via immutable overlayfs, same namespace, same privileges, meant to be built in lockstep with the host's update cycle, with no dependency language on purpose.
2. Portable services: system services running off their own verity-protected GPT images via `RootImage=`, sandboxing opt-out rather than opt-in.
3. Payload apps: Flatpak on the desktop, OCI containers on servers, which the essay admits lack measurement and per-app cryptographic protection, leaving the trust chain weakest exactly where third-party code lives.

The uniform image format is the point: host image, extension images, and portable service images are all GPT images with an immutable file system, verity data, and a PKCS#7 signature partition, so the kernel validates every layer on every I/O through IMA (https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). systemd-nspawn containers give a fourth escape hatch, a recursively validated secondary OS install that coexists with the immutable host (https://0pointer.net/blog/fitting-everything-together.html, jev 0.95).

## Updates, rollback, homed

Updates are four files downloaded by `systemd-sysupdate` (the `/usr` partition, its verity partition, its signature partition, and the new unified kernel into the ESP); the same tool updates extensions and portable images because the on-disk formats are identical (https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). Bad updates are caught by Automatic Boot Assessment: a boot counter embedded in the kernel's filename is decremented per boot and removed on success; at zero, systemd-boot reverts to an older known-good entry (https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). Users live in `systemd-homed` home directories: per-user encryption keyed by the user's own token (password, FIDO2, PKCS#11, recovery key), UID mapping at login, and, critically, key material flushed on suspend so an attacker who captures a suspended laptop cannot read user data (https://0pointer.net/blog/fitting-everything-together.html, jev 0.95).

## What changed since 2022: version-sensitive notes

Two items in the essay were explicit TODOs or informal, and both have moved:

- **PCR signature-based unlocking.** The essay states that TPM2 LUKS2 unlocking was bound to PCR hash values, "hard to work with when implementing updates," and asks for unlocking by signatures of PCR hashes, which systemd did not yet support (https://0pointer.net/blog/fitting-everything-together.html). This was subsequently implemented: `systemd-measure` pre-calculates and signs expected PCR 11 values for unified kernel images, enabling TPM2 policies unlockable by any of a set of signed kernels rather than one hash (https://www.freedesktop.org/software/systemd/man/latest/systemd-measure.html), and the UKI specification defines the `.pcrsig` section carrying those signatures (https://uapi-group.org/specifications/specs/unified_kernel_image/).
- **UKIs formalized.** The essay's "Boot Loader Specification Type #2" unified kernels were later standardized as UAPI.5 Unified Kernel Images, with systemd-stub as the reference implementation and PCR measurement coverage documented across PCRs 11 (kernel-boot), 12 (kernel-config), 13 (sysexts), and 15 (system-identity) (https://uapi-group.org/specifications/specs/unified_kernel_image/, https://systemd.io/TPM2_PCR_MEASUREMENTS).

Unchanged as of writing: the essay notes systemd has no explicit "developer mode," and proposes local developer sysexts plus locally enrolled validation keys as the model; no superseding mechanism has replaced that proposal (https://0pointer.net/blog/fitting-everything-together.html).

## Why this essay is the keystone

"Fitting Everything Together" is the only document in the 0pointer canon that names all the pieces and their assembly: DPS partitions, signed UKIs, verity `/usr`, TPM2-bound LUKS2, repart-driven first boot, sysupdate A/B, boot assessment, sysext and portable services as the modularity ladder, nspawn as the compatibility bridge, homed as the user-data perimeter. Every later image-mode design inherits at least one load-bearing decision from it.

## Sources considered

- https://0pointer.net/blog/fitting-everything-together.html: used, primary.
- https://lwn.net/Articles/894396/: used, secondary confirmation of framing.
- https://lwn.net/Articles/894429/: rejected, duplicate coverage of same essay.
- https://uapi-group.org/specifications/specs/unified_kernel_image/: used, superseding spec.
- https://www.freedesktop.org/software/systemd/man/latest/systemd-measure.html: used, superseding implementation.
- https://systemd.io/TPM2_PCR_MEASUREMENTS/: used, current measurement model.
- https://uapi-group.org/specifications/specs/discoverable_partitions_specification/: used, DPS formalization.
- https://0pointer.net/blog/revisiting-how-we-put-together-linux-systems.html: rejected, not fetched this pass.
- https://noise.getoto.net/2022/05/03/fitting-everything-together/: rejected, mirror.
- https://news.ycombinator.com/item?id=40960282: rejected, commentary.
- https://www.reddit.com/r/linux/comments/1qokdbi/: rejected, commentary.
- https://blog.desdelinux.net/en/lennart-poettering-lets-microsoft-case-changeable-security-linux/: rejected, off-scope company news.
- https://amutable.com/blog/introducing-amutable: rejected, off-scope company news.
- https://en.wikipedia.org/wiki/Lennart_Poettering: rejected, tertiary.
- https://xhamster.com/: rejected, spam result in dig.
