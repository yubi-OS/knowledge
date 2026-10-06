# 05 - Containerfile patterns for bootc images

Scope: writing Containerfiles that produce bootc-compatible images: base image selection, package layering, composefs config, drop-in config, and the yubiOS minimal pattern.

## The yubiOS minimal Containerfile

The source doc (yubi-OS/yubiOS skills/bootc-images/SKILL.md) ships this as the reference pattern:

```dockerfile
FROM dhi.io/debian-base@sha256:9415967aa0ed8adea8b5c048994259d1982026dca143d0303c7bbe0e11ed67d3
LABEL containers.bootc 1
RUN apt-get update && apt-get install -y systemd systemd-boot systemd-cryptsetup linux-image-amd64 dracut pam-u2f yubikey-manager libfido2-dev opensc && apt-get clean
RUN mkdir -p /usr/lib/ostree && cat > /usr/lib/ostree/prepare-root.conf << 'EOF'
[composefs]
enabled = true
[etc]
transient = true
EOF
RUN mkdir -p /etc/security && echo "auth required pam_u2f.so authfile=/etc/security/u2f_keys" >> /etc/pam.d/sshd
```

Its load-bearing choices (source doc):

1. Digest-pinned FROM, per the org's supply-chain policy: every base image reference is a digest, vetted by the docker buildx build policy gate before any layer executes.
2. LABEL containers.bootc 1 first (doc 02).
3. systemd, systemd-boot, and systemd-cryptsetup installed so systemd boots the system and PAM FIDO2 auth works (systemd-homed skill).
4. composefs enabled plus transient /etc in one prepare-root.conf (docs 03, 04).
5. dracut present to generate the initramfs that lands in /usr/lib/modules.

## Derived-image guidance

bootc expects images to be built by layering: pick a minimal base and add packages and config. Fedora documents the derived-image flow as the standard path for custom bootc images, including the artifact pattern for referencing reusable container components (docs.fedoraproject.org/en-US/bootc/building-containers/, w=0.94). Red Hat's getting-started guide describes the same model: "you can use the same container technology for building and managing immutable" OS images (developers.redhat.com/articles/2024/09/24/bootc-getting-started-bootable-containers, w=0.81). The CNCF profile positions bootc as the standard container-native OS-image pipeline (cncf.io/projects/bootc/, w=0.69).

yubiOS derives from dhi.io images (the hardened Docker official images registry) rather than building from scratch; from-scratch builds are documented upstream for Fedora/CentOS via bootc-base-imagectl but are not needed here (docs.fedoraproject.org/en-US/bootc/building-from-scratch/, w=0.93).

## Drop-in config over edited config

The upgrade-merge behavior of /etc (doc 04) makes Containerfile authoring style a reliability decision (source doc). The good pattern writes a drop-in with `install -Dm644 /dev/stdin /etc/sudoers.d/yubiOS-admins` containing `%yubiOS-admins ALL=(ALL) ALL`. The anti-pattern appends to the main file: `echo "%admin ALL=(ALL) ALL" >> /etc/sudoers`, which "creates a diff on every upgrade" (source doc).

Every main-file edit the image makes becomes a merge participant forever. Drop-ins never merge-conflict because the main file is untouched. The same rule applies to systemd units (use /usr/lib/systemd/system and drop-ins under /etc/systemd/system only for machine-local overrides) and PAM stacks.

## /var structure belongs in tmpfiles.d

Because /var content is not updated after initial install (doc 04), the image should pre-create directory structure via /usr/lib/tmpfiles.d rules or StateDirectory= in units, never by RUN mkdir /var/... (source doc). A RUN mkdir in the image creates content that only first-boot machines get, and lint warns about the missing tmpfiles entry as of 1.1.6 (bootc.dev/bootc/filesystem.html, w=0.86).

## Packages and their landing zones

The yubiOS package set maps directly to filesystem semantics (source doc):

- Kernel and initramfs: linux-image-amd64 plus dracut land in /usr/lib/modules/$kver/ (doc 02).
- FIDO2 stack: pam-u2f, yubikey-manager, libfido2-dev, opensc support the yubiOS unlock and PIV flows (yubikey-operations skill).
- systemd-boot: the bootloader the install step enrolls (doc 06).

A community best-practices repository collects the same patterns (3-way merge discipline, explicit SELinux file contexts, FIPS-mode notes) for derived images (github.com/andrew-weida/bootc-container-image-best-practices, w=0.20, weak backing: community repo, not official docs), useful as a cross-check but not as a normative source.

## What NOT to do

From the source doc and lint checks (docs 02, 08): no /boot content, no manual /ostree, no files written to /usr/etc (undefined behavior; the tree is managed by the merge machinery), no chcon in builds (doc 09), and no writable-path assumptions outside /var and /etc.
