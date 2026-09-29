# mkosi, casync, and the Ammutable direction: the build-to-boot pipeline of the 0pointer canon

**Abstract.** Three 0pointer essays and two upstream projects describe one continuous pipeline: mkosi builds the image, casync delivers it, and the 2022 "Fitting Everything Together" essay specifies what that image must contain and how it must boot. mkosi is the factory: it turns distribution packages into a hermetic, cryptographically protected OS image with dm-verity, LUKS, and signed UKIs ([mkosi essay](https://0pointer.net/blog/mkosi-a-tool-for-generating-os-images.html); [re-introduction](https://0pointer.net/blog/a-re-introduction-to-mkosi-a-tool-for-generating-os-images.html)). casync is the logistics layer: git-style content-addressed chunking makes image delivery cheap over high-frequency update cycles, with reproducibility guaranteed at every link of the chain ([casync essay](https://0pointer.net/blog/casync-a-tool-for-distributing-file-system-images.html)). "Fitting Everything Together" then demands exactly this shape at OS scale: image-based, immutable, verity-protected /usr, and it names mkosi as the tool Poettering would personally use to build those images ([fitting essay](https://0pointer.net/blog/fitting-everything-together.html)). Ammutable, announced January 27, 2026 by Poettering and nine collaborators, is the commercial continuation of that same vision: determinism and verifiable integrity for Linux systems, spanning build, boot, and runtime integrity ([announcement post](https://0pointer.net/blog/introducing-amutable.html); [company post](https://amutable.com/blog/introducing-amutable)).

## mkosi: the image factory (2017)

Poettering introduced mkosi on June 28, 2017 as "Make Operating System Image", a tool for generating an OS tree or image that can be booted ([mkosi essay](https://0pointer.net/blog/mkosi-a-tool-for-generating-os-images.html)). Its stated focus is developer workflow: add a `mkosi.default` file to a project, build a development image with headers and tools, compile, run the test suite, throw that image away, rebuild without development tooling, and install the build artifacts into a minimal "production-ready" image. The essay closes the loop with delivery explicitly: such an image "could then be deployed with casync ... to be delivered to your set of servers, or IoT devices" ([mkosi essay](https://0pointer.net/blog/mkosi-a-tool-for-generating-os-images.html)).

The 2017 feature set is a checklist of the later OS vision ([mkosi essay](https://0pointer.net/blog/mkosi-a-tool-for-generating-os-images.html)):

- Legacy-free output: GPT partition tables, not MBR; EFI boot, not legacy BIOS; images follow the Discoverable Partitions Specification so `/etc/fstab` stays empty and systemd-nspawn can dissect and boot them.
- Output formats: raw GPT images with ext4, btrfs, or read-only squashfs roots; plain directories; btrfs subvolumes; tarballs.
- Cryptographic options: LUKS-encrypted root, `/home`, and `/srv`; dm-verity protection of the root partition with the verity root hash automatically added to the kernel command line; the kernel, initrd, and command line optionally signed as one unit for UEFI SecureBoot.
- Portability: one GPT image bootable on bare metal, in a VM, in a systemd-nspawn container, or run directly via systemd's `RootImage=` setting, with dm-verity verified automatically in the nspawn and `RootImage=` cases.
- Distribution support: Fedora, Debian, Ubuntu, ArchLinux, openSUSE, built through dnf `--installroot`, debootstrap, pacstrap, and zypper.

The mkosi documentation site summarizes the tool in one line: "A fancy wrapper around dnf --installroot, apt, pacman and zypper that generates customized disk images with a number of bells and whistles" ([mkosi.systemd.io](https://mkosi.systemd.io/)).

## mkosi re-introduced: the systemd-integrated builder (2024)

On January 10, 2024 Daan De Meyer, systemd and mkosi maintainer, published a guest post re-introducing the tool after taking over development ([re-introduction](https://0pointer.net/blog/a-re-introduction-to-mkosi-a-tool-for-generating-os-images.html)). The workflow is now three steps: generate an OS tree by installing packages; package it into an output format; optionally boot it in qemu or systemd-nspawn. Distribution support widened to Fedora, Ubuntu, OpenSUSE, Debian, Arch, CentOS Stream, RHEL, Rocky, and Alma. Output formats now include GPT disk images built with systemd-repart, tar and CPIO archives, USIs (full OS images packed into a UKI), sysext, confext, and portable service images, and plain directory trees.

The 2024 essay is version-sensitive in ways that matter for anyone comparing it against the 2017 one ([re-introduction](https://0pointer.net/blog/a-re-introduction-to-mkosi-a-tool-for-generating-os-images.html)):

- Configuration moved from `mkosi.default` to INI-style `mkosi.conf` with dropins in `mkosi.conf.d`, conditionalized with `[Match]` sections.
- Build hooks replaced ad-hoc customization: `mkosi.postinst` runs in a sandbox on the host, `mkosi.postinst.chroot` runs inside the image.
- mkosi always builds UKIs (except for BIOS-only images), generates the initramfs itself from installed packages rather than delegating to dracut, mkinitcpio, or initramfs-tools, and assembles it with ukify.
- Partitioning is delegated to systemd-repart definition files in `mkosi.repart/`, which can encrypt the root, apply signed dm-verity, ship only a `/usr` partition without a root, or add XBOOTLDR and swap partitions.

The mkosi repo itself is built with mkosi, and the same is true of casync: the casync repository carries a `mkosi.build` script, meaning casync's own development images are produced by the tool its sibling ecosystem promotes ([casync/mkosi.build, 0.36](https://github.com/systemd/casync/blob/master/mkosi.build)).

## casync: content addressing for image delivery (2017)

Eight days before the mkosi post, on June 20, 2017, Poettering published the casync essay: casync "combines the idea of the rsync algorithm with the idea of git-style content-addressable file systems" for efficiently storing and delivering file system images, optimized for high-frequency update cycles over the Internet, with a focus on IoT, container, VM, application, portable service, and OS images ([casync essay](https://0pointer.net/blog/casync-a-tool-for-distributing-file-system-images.html)).

The design is precise ([casync essay](https://0pointer.net/blog/casync-a-tool-for-distributing-file-system-images.html)):

- Encoding: a linear data stream is split into variable-sized, content-defined chunks using the buzhash rolling hash; each compressed chunk (xz) is stored in a chunk store named by its SHA256 digest; a chunk index file lists the hashes and sizes in order.
- Chunking removes file boundaries before splitting, so similarities are recognized across files and directories, which distinguishes it from rsync and OSTree.
- Two layers of operation: block layer (`.caibx` indexes over raw block data, natural for VM and IoT images) and file system layer (`.caidx` indexes over a reproducible, random-access serialization format called `.catar`, described as a more modern tar, natural for containers). Chunk stores carry the `.castr` suffix.
- `--seed=`: local data is processed with the same chunking logic and used as a preferred source, with no history relationship required, so even an unrelated Ubuntu-based local image can seed a container download.
- Delivery model: chunk indexes and one shared chunk store on plain HTTP, shared across all versions, which keeps server disk bounded and CDN-friendly.

The essay is also a critique of the alternatives ([casync essay](https://0pointer.net/blog/casync-a-tool-for-distributing-file-system-images.html)): Docker's layered tarballs push delta management onto image creators and make fresh deployments download full history; OSTree serving individual files explodes into many small HTTP GET requests and leaks revision management into clients; raw squashfs over HTTP means full downloads per update, which zsync only partly fixes. The upstream repo describes the project simply as a "Content-Addressable Data Synchronization Tool" ([systemd/casync, 0.06](https://github.com/systemd/casync)).

## Reproducibility as the connecting thread

The casync essay's security section states the principle that later unifies the whole canon: "the tarball format is famously nondeterministic: the very same file tree can result in any number of different valid serializations", and "any good update system must guarantee on every single link of the chain that there's only one valid representation of the data to deliver, that can easily be verified". Emphasis is placed on making all casync invocations reproducible ([casync essay](https://0pointer.net/blog/casync-a-tool-for-distributing-file-system-images.html)).

"Fitting Everything Together" (May 3, 2022) picks this up as an OS design requirement: the focus "must be on an image-based design rather than a package-based one", operating with "reproducible, immutable images", where packages are for building the objects to deploy rather than deploying code, with "a maximum of bit-exact reuse" across "cattle, not pets" fleets ([fitting essay](https://0pointer.net/blog/fitting-everything-together.html)). That essay's concrete image design (verity-protected signed /usr, A/B updates, unified kernel images with the verity root hash in the command line, systemd-repart first-boot instantiation) is precisely what mkosi's 2024 feature list can produce. And the essay names the builder: Poettering writes that he personally would use mkosi, and suggests a distribution "write a set of mkosi descriptions plus some" supporting build scripts ([fitting essay](https://0pointer.net/blog/fitting-everything-together.html)). This is the explicit bridge from blog vision to build pipeline.

## Ammutable: the direction as of 2026

On January 27, 2026, Poettering announced Ammutable on 0pointer: "we ... are building the next generation of Linux systems, with integrity, determinism, and verification, every step of the way", pointing to the company site for details ([announcement post](https://0pointer.net/blog/introducing-amutable.html)). The company post names the founding team: Chris Kühl (CEO), Christian Brauner (CTO), Lennart Poettering (Chief Engineer), David Strauss (CPO), and founding engineers Rodrigo Campos Catelin, Zbyszek Jędrzejewski-Szmek, Kai Lüke, Daan De Meyer, Joaquim Rocha, Aleksa Sarai, and Michael Vogt, describing itself as maintainers of systemd, Linux, Kubernetes, runc, LXC, Incus, and containerd with experience in Debian, Fedora/CentOS, SUSE, Ubuntu, and the image-based distributions Flatcar, ParticleOS, and Ubuntu Core; the company is based in Berlin ([company post](https://amutable.com/blog/introducing-amutable)).

What Ammutable has committed to publicly so far is mission, not product: "deliver determinism and verifiable integrity to Linux systems", with the site framing three pillars: build integrity, boot integrity, and runtime integrity, and the claim that "Every system starts in a verified state and stays trusted over time" ([Ammutable site](https://amutable.com/)). The site lists upcoming systemd-centered talks at All Systems Go! in Berlin on September 30, 2026, including Poettering on "Provisioning and Deployment Mechanisms in systemd" ([Ammutable site](https://amutable.com/)). Notably, mkosi's current maintainer (De Meyer) and the mkosi-adjacent Zbyszek Jędrzejewski-Szmek are founding engineers ([company post](https://amutable.com/blog/introducing-amutable)), so the build tooling lineage in this doc runs directly into the company. Third-party coverage reports Poettering left Microsoft to co-found the company (0.86), with a second outlet at low confidence (0.05); the blog itself does not state this. No product, repository, or release under the Ammutable name was verifiable at authoring time; version-sensitive: treat all Ammutable claims as of January 2026.

The through-line is easy to state: mkosi makes the verified image, casync moves it with content-addressed determinism, the 2022 essay defines the OS those images boot into, and Ammutable is the attempt to industrialize that chain end to end.

## Sources considered

Used:

- https://0pointer.net/blog/mkosi-a-tool-for-generating-os-images.html (primary, fetched)
- https://0pointer.net/blog/a-re-introduction-to-mkosi-a-tool-for-generating-os-images.html (primary, fetched)
- https://0pointer.net/blog/casync-a-tool-for-distributing-file-system-images.html (primary, fetched)
- https://0pointer.net/blog/fitting-everything-together.html (primary, fetched)
- https://0pointer.net/blog/introducing-amutable.html (primary, fetched)
- https://amutable.com/blog/introducing-amutable (primary, fetched)
- https://amutable.com/ (primary, fetched)
- https://mkosi.systemd.io/ (primary, fetched)
- https://github.com/systemd/casync (dig, 0.06)
- https://github.com/systemd/casync/blob/master/mkosi.build (dig, 0.36)

Rejected:

- http://0pointer.net/blog/casync-introducing.html (404, superseded by the real casync URL)
- https://0pointer.net/blog/casync-video.html (not fetched)
- https://lwn.net/Articles/894396/ (secondary coverage)
- https://villpress.com/systemd-creator-lennart-poettering-leaves-microsoft-to-co-found-linux-integrity-startup-amutable/ (secondary, cited with weight only)
- https://linuxiac.com/systemd-creator-lennart-poettering-joins-new-linux-integrity-startup/ (secondary, low weight)
- https://www.reddit.com/r/linux/comments/1qokdbi/ (discussion thread)
- https://man.archlinux.org/man/mkosi.1.en (secondary man mirror)
- https://wiki.archlinux.org/title/Mkosi (secondary wiki)
- https://deepwiki.com/systemd/casync/2.1-content-addressable-storage-model (tertiary, generated)
