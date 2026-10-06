# 02 - Image requirements: the label, the kernel, the layout

Scope: the hard requirements a container image must satisfy to be bootc-compatible: the containers.bootc label, kernel and initramfs placement, the /boot rule, and the /ostree directory.

## The mandatory label

Every bootc image must carry:

```dockerfile
LABEL containers.bootc 1
```

The label "signals the image is bootc-compatible" and is required for tooling recognition: bootc container lint, bcvk, and bootc-image-builder all key off it (source doc: yubi-OS/yubiOS skills/bootc-images/SKILL.md). The upstream bootc-compatible-images man page confirms the label is the compatibility contract for the image format (github.com/bootc-dev/bootc/blob/main/docs/src/bootc-compatible-images.7.md, w=0.89). The bootc image-layout documentation adds that lint will verify it: "The bootc container lint command will check this" (bootc.dev/bootc/bootc-images.html, w=0.87).

The label is the cheapest possible failure point: a missing label means downstream tooling either refuses the image or misclassifies it, so it belongs at the top of every Containerfile, before any RUN layers.

## Kernel and initramfs location

bootc requires the kernel and initramfs inside the image at fixed paths:

```
/usr/lib/modules/$kver/vmlinuz      (kernel)
/usr/lib/modules/$kver/initramfs.img (initramfs)
```

The canonical layout is documented upstream: "The Linux kernel (and optionally initramfs) is embedded in the container image; the canonical location is /usr/lib/modules" (github.com/bootc-dev/bootc/blob/main/docs/src/bootc-compatible-images.7.md, w=0.89; bootc.dev/bootc/bootc-images.html, w=0.87). Package managers that install kernel packages into this tree (Debian's linux-image-amd64, Fedora's kernel) land in the right place automatically.

## No /boot content in the image

The source doc is emphatic: "Do NOT put anything in /boot in your image." bootc copies the kernel and initramfs from the image into /boot at install time, and any file the image already ships in /boot conflicts with that copy (source doc). This is a lint-enforced rule: bootc container lint checks for /boot content in the image and flags it (bootc.dev/bootc/bootc-images.html, w=0.87; source doc).

The failure mode is subtle because nothing breaks at build time. The image builds, lints maybe pass if the check list ordering differs, and then install or upgrade produces a mismatched bootloader entry. The rule exists because /boot on the installed system is machine-managed state, while /usr/lib/modules is image-managed content; mixing the two breaks the boundary the whole model depends on.

## /ostree is not yours to create

The /ostree directory is bootc's internal staging area. Since bootc 1.1.3 it is not required to exist in the image, and the source doc directs: "Don't create it manually" (source doc). Older guides predate this change; any Containerfile still carrying `RUN mkdir /ostree` cargo-cult is wrong for current bootc and should be deleted.

## Where these rules come from in a yubiOS build

yubiOS derives from a digest-pinned minimal base (dhi.io/debian-base@sha256:...), so the base already provides a Debian userspace with standard layout. The image-level requirements the yubiOS Containerfile must satisfy are (source doc):

1. LABEL containers.bootc 1 present.
2. Kernel packages installed normally so vmlinuz and initramfs land in /usr/lib/modules/$kver/.
3. No /boot content, no manual /ostree.
4. Package selection includes systemd as PID 1 plus the FIDO2 tooling stack (pam-u2f, yubikey-manager, libfido2-dev, opensc).

Building from scratch instead of deriving is also documented upstream for Fedora/CentOS, using bootc-base-imagectl to generate root filesystems that satisfy the same layout contract (docs.fedoraproject.org/en-US/bootc/building-from-scratch/, w=0.93). yubiOS does not need that path, but it documents what "bootc-compatible" means at the layer below the label.

## Verification

All four requirements are machine-checkable: lint checks the label, the /boot rule, and (as of 1.1.6, see doc 08) missing tmpfiles.d entries. The kernel path is checked by lint as well (source doc). Treat lint as the gate, not a manual checklist; doc 08 covers wiring it into CI.
