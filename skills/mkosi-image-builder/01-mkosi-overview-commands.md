# 01 mkosi Overview and Key Commands

Scope: what mkosi is, where it sits in the yubiOS build pipeline, and the verbs and validation commands this skill drives day to day.

## What mkosi is

mkosi is a wrapper around `dnf`, `apt`, `pacman`, and `zypper` that generates customized disk images, container images, and unified kernel images (jev weight 0.90, https://mkosi.systemd.io/; weight 0.93, https://github.com/systemd/mkosi). The project describes itself as "a fancy wrapper around dnf --installroot, apt, pacman and zypper that generates customized disk images with a number of bells and whistles" (weight 0.91, https://mkosi.systemd.io/). Output formats span raw GPT disk images, plain directories, tar, cpio, and USI/UKI, and the project is actively maintained with a man page covering customization across distributions (weight 0.53, https://wiki.archlinux.org/title/Mkosi; weak backing, below the 0.5 threshold).

The tool combines nicely with casync-style workflows and has been maintained by the systemd ecosystem for years (weight 0.71, http://0pointer.net/blog/mkosi-a-tool-for-generating-os-images.html).

## Position in the yubiOS pipeline

The source doc (`yubi-OS/yubiOS skills/mkosi-image-builder/SKILL.md`) states the yubiOS pipeline directly: "mkosi builds OCI images, bootc installs/upgrades, bcvk tests". That means mkosi is the first stage: it turns package sets and configuration into bootable OCI artifacts, bootc handles installing and atomically upgrading those artifacts onto target systems, and bcvk runs the result as ephemeral VMs for testing. This doc explains the mkosi stage; downstream stages are owned by the bootc-images and bcvk-virtualization skills.

## Key commands

The source doc lists these commands, each operating on the `mkosi.conf` in the current working directory:

| Command | Purpose (source doc) |
|---|---|
| `mkosi build` | Build the image |
| `mkosi -i yubiOS build` | Build a specific image in a multi-image setup |
| `mkosi boot` | Boot the built image in QEMU |
| `mkosi shell` | Run the image in systemd-nspawn |
| `mkosi summary` | Generate a summary of the effective configuration |
| `mkosi clean` | Clean build artifacts |

The upstream man page confirms `build` is the default verb when no verb is specified, and that build arguments can be passed to build scripts (weight 0.91, https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md). The man page also documents `mkosi boot` and `mkosi shell` as the standard verbs for launching the built image under QEMU or systemd-nspawn respectively (weight 0.91, same source).

Two workflow notes from the dig:

1. mkosi can create a temporary development image that includes headers and tooling, compile the project inside it, run tests, then discard that image before building the final output (weight 0.54, https://wiki.archlinux.org/title/Mkosi; this sits above the 0.5 threshold but is the weakest claim in this doc, treat as corroborating detail only).
2. For deployable images, systemd's own guidance is to remove `/etc/machine-id` from the image so each deployed instance acquires its own identity on first boot (weight 0.79, https://systemd.io/BUILDING_IMAGES/). The yubiOS FinalizeScripts doc (06 in this corpus) is where such pre-seal cleanup belongs.

## Validation commands

The source doc carries the validation block from mkosi's own AGENTS.md, used when working on mkosi itself:

```bash
mypy mkosi tests kernel-install/*.install
ruff format mkosi tests kernel-install/*.install
ruff check --fix mkosi tests kernel-install/*.install
python3 -m pytest
```

The AGENTS.md in the upstream repo adds the runner form: `bin/mkosi box -- pytest` runs all unit tests including linters and type checkers, and standard pytest selectors like `-k test_mypy` can be appended (weight 0.81, https://github.com/systemd/mkosi/blob/main/AGENTS.md). Doc 08 covers this workflow in depth.

## Operating guidance

- Run `mkosi summary` before a long build to verify the effective configuration; the man page documents `summary` as the verb for inspecting what will be built (weight 0.91, https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md).
- Use `mkosi clean` between iterations when switching output formats, since stale artifacts in the output directory can shadow a fresh build (source doc, `yubi-OS/yubiOS skills/mkosi-image-builder/SKILL.md`).
- The official documentation groups tutorials including "Building a custom initrd", "Building system extensions", and "Building RPMs from source with mkosi" under its docs site, useful when extending the yubiOS pipeline with sysexts or initrds (weight 0.90, https://mkosi.systemd.io/).

## Sources

- Source doc: `yubi-OS/yubiOS skills/mkosi-image-builder/SKILL.md` (grounding spine for the command table and pipeline position)
- https://mkosi.systemd.io/ (weight 0.91, 0.90)
- https://github.com/systemd/mkosi (weight 0.93)
- https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md (weight 0.91)
- https://github.com/systemd/mkosi/blob/main/AGENTS.md (weight 0.81)
- https://systemd.io/BUILDING_IMAGES/ (weight 0.79)
- http://0pointer.net/blog/mkosi-a-tool-for-generating-os-images.html (weight 0.71)
- https://wiki.archlinux.org/title/Mkosi (weight 0.54)
