# Integrity versus isolation versus privilege minimisation

Scope: separating the three adjacent properties an immutable host is usually conflated on: integrity (what protects the image from the process), isolation (what protects processes from each other), and privilege minimisation (what a process may do).

## The three axes

The confusion is structural because all three get called "security". On an immutable host they answer different questions.

Integrity answers "can a running process alter the bits the system boots and runs". dm-verity provides runtime integrity verification for read-only root filesystems, and combined with secure boot creates a complete chain of trust from power-on to application execution [https://proteanos.com/doc/rootfs-integrity-dm-verity-immutable-images/, weight: high]. Composefs extends the mechanism: it combines several underlying Linux features to provide read-only mountable filesystem trees stacked on an underlying lower filesystem [https://github.com/composefs/composefs, weight: high], and supports using fs-verity for both the image file and all the backing files; fs-verity is a checksum mechanism similar to dm-verity but working on file contents instead of partition content, and enabling it on a file makes it immutable and computes a hash tree over it [https://blogs.gnome.org/alexl/, weight: low]. Image sealing goes further: composefs achieves whole-filesystem integrity verification through a single cryptographic digest that authenticates the entire filesystem, covering file contents and metadata (directory structure, permissions, ownership, symlinks, and xattrs) [https://scrivano.org/posts/2026-06-05-sealing-with-composefs/, weight: low].

Isolation answers "can a process see or interfere with another process". It is the namespace/cgroup/seccomp family: namespaces what a process can see, cgroups what it can consume, seccomp what it can ask the kernel to do [https://chkrishnatej.dev/posts/isolation-for-containers/, weight: high].

Privilege minimisation answers "is this process running with more authority than it needs". Rootless builds are the clearest instance: remapping root inside the container through user namespaces reduces the risk of privilege escalation [https://www.geeksforgeeks.org/devops/rootless-podman/, weight: low].

The direction of protection is the discriminator. Integrity protects the image from the process; isolation protects the process from other processes; privilege minimisation bounds what the process itself can do. An immutable OS is designed so that its core system files cannot be modified directly by users, running processes, or traditional package managers during runtime [https://salivity.github.io/linux/article/immutable-linux-os-why-architecture-matters, weight: low], which is the integrity axis stated as a design goal.

## Why the boundaries compose instead of compete

None of the three substitutes for another. A perfectly isolated container still runs a compromised image if integrity failed upstream; a perfectly verified image still runs processes that attack each other if isolation is absent; and a privileged process needs neither, because it can simply write through the boundary. The yubiOS dm-verity-and-integrity skill sits in a domain that benefits from explicit immutability coverage: sysext, read-only mounts, fs-verity, OSTree, hermetic /usr, verity [https://github.com/yubi-OS/yubiOS/blob/main/skills/dm-verity-and-integrity/SKILL.md, weight: high], and that coverage is deliberately complementary to the isolation skills, not an alternative to them.

Concretely on the four uses: the build boundary leans on privilege minimisation (rootless remap), the nspawn dev boundary on isolation plus integrity (the image it boots is the verified artifact, mounted read-only), the VM test boundary on isolation at the hypervisor layer, and unit sandboxing on the full namespace/cgroup/seccomp triple. Each use names one axis as primary, and the others stay in force underneath.

## The immutable-OS ecosystem context

Ubuntu Core's architecture write-up frames the same design choices at ecosystem scale, reviewing the properties of an immutable Linux OS and the design decisions made across the ecosystem [https://ubuntu.com/blog/ubuntu-core-an-immutable-linux-desktop, weight: high]. The distinction matters for the corpus's matrix because immutable distributions are often marketed on integrity alone [https://linuxblog.io/immutable-linux-distros-are-they-right-for-you-take-the-test/, weight: low]; on yubiOS the integrity layer is assumed and the interesting engineering is in picking the right isolation boundary per use, which is the subject of the matrix doc.

## Where the conflation bites

Three failure modes come from merging the axes. First, treating a signed read-only /usr as if it isolated services from each other: it does not, every service still shares the kernel and the namespace defaults. Second, treating a seccomp filter as if it verified the image: it constrains what a process may request, not what bits it executes. Third, treating privilege minimisation as if it were isolation: a rootless process with full visibility of the host is unprivileged but not confined. Keeping the three axes separate is what makes the per-use boundary choices in this corpus defensible: each "why not this alternative" argument names the axis it optimizes and the axis it abandons.
