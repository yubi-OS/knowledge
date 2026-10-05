# 06 mkosi: Building the Images the Vision Runs On

Scope: mkosi as the image-generation tool of the 0pointer ecosystem: what it builds, how it integrates with systemd-repart, and how it is used for local and CI workflows.

## What mkosi is

mkosi stands for Make Operating System Image. The systemd project describes it as a fancy wrapper around dnf --installroot, apt, pacman and zypper that generates customized disk images with a number of bells and whistles (source: https://github.com/systemd/mkosi, jev 0.94 and 0.91 for the duplicate row; official site: https://mkosi.systemd.io/, jev 0.91). ArchWiki confirms the name expansion and the tool's role as a Python wrapper around the distro package managers that generates disk images (source: https://wiki.archlinux.org/title/Mkosi, jev 0.73 from the redo dig).

## The 0pointer re-introduction

Poettering's own re-introduction post explains the tool's purpose: mkosi generates OS images that can be used for a variety of purposes, with a video version of the walkthrough available for those who prefer watching over reading (source: https://0pointer.net/blog/a-re-introduction-to-mkosi-a-tool-for-generating-os-images.html, jev 0.91). An earlier post introduced the tool as one that had been around for a while but deserved to be better known, combining nicely with casync (source: http://0pointer.net/blog/mkosi-a-tool-for-generating-os-images.html, jev 0.85). Together the two posts document the tool's progression from a packaging helper to the image factory of the systemd ecosystem.

## Output formats and repart integration

mkosi builds raw GPT disk images through direct systemd-repart integration, including partition configuration, filesystem setup, and integrity protection features (source: https://deepwiki.com/systemd/mkosi/6.1-disk-images-and-partitioning, jev 0.15, low weight, secondary source). The man page documents the declarative hook: RepartDirectories= and --repart-directory= are paths to directories containing systemd-repart partition definition files used when mkosi invokes systemd-repart while building a disk image (source: https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md, jev 0.87). Beyond disk images, mkosi also builds the initrds used on its bootable images, a capability that grew out of the core image builder (source: https://en.opensuse.org/Mkosi-initrd, jev 0.53).

## Configuration model

The systemd.io document on safely building images covers the image-provisioning settings that mkosi drives, noting that while much work has gone into ensuring systemd systems boot safely with unpopulated /etc/ trees, it is sometimes desirable to set a couple of basic settings after deployment (source: https://systemd.io/BUILDING_IMAGES/, jev 0.90). That document is the guidance mkosi's provisioning settings implement: the builder populates only what the first-boot machinery (repart, sysusers, homed) cannot derive, leaving the rest to boot time.

## Typical workflow

The canonical mkosi workflow centers on a mkosi.conf file driving the build, with build, boot, and force-rebuild as the core verbs. Poettering's re-introduction walks through generating an image and booting it locally, which is the loop an image-based OS developer lives in (source: https://0pointer.net/blog/a-re-introduction-to-mkosi-a-tool-for-generating-os-images.html, jev 0.91). ArchWiki documents the practical usage surface for standalone image building without the systemd context (source: https://wiki.archlinux.org/title/Mkosi, jev 0.73).

## mkosi in the vision

mkosi is the build-side counterpart to the runtime stack the essay describes: repart definitions written once are used at build time by mkosi and at boot time by systemd-repart, so the image on disk and the first-boot partition layout follow the same declarative source (source: https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md, jev 0.87; https://www.freedesktop.org/software/systemd/man/latest/systemd-repart.html, jev 0.91). The project is maintained under the systemd GitHub organization, with Daan De Meyer as the mkosi maintainer (source: https://github.com/DaanDeMeyer, jev 0.13, low weight; project repo: https://github.com/systemd/mkosi, jev 0.94).

## Relevance to immutable Linux

For any image-based OS project, mkosi is the direct implementation of the no-installer goal: build one reproducible image, dd it, and let first-boot repart adapt it (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95; https://0pointer.net/blog/a-re-introduction-to-mkosi-a-tool-for-generating-os-images.html, jev 0.91). Its distro-wrapper design (dnf, apt, pacman, zypper) is also why the vision stays distro-neutral: the image contents come from whatever base distro the builder selects, while the integrity and boot machinery comes from systemd (source: https://github.com/systemd/mkosi, jev 0.94).
