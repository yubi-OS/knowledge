# 01 - Tools tree mechanism

**Scope.** What the mkosi tools tree is: how mkosi builds and uses a tools tree, the ToolsTree* configuration surface, what runs inside it, and how the default behavior has evolved.

## Definition

A tools tree is a separate, minimal OS image that mkosi builds and uses as the execution environment for building the main image. Instead of using tools from the host system, such as package managers, compilers, and other build utilities, mkosi uses the tools from this isolated environment by mounting its /usr over the build environment's /usr ([deepwiki.com/systemd/mkosi/3.5-tools-trees](https://deepwiki.com/systemd/mkosi/3.5-tools-trees), jev weight 0.74, authoritative).

This is the property that makes the tools tree interesting for pinning and tracking: the tool environment is not an ambient property of the build host, it is an artifact with its own contents, provenance, and lifetime.

## Default behavior

By default, mkosi will first build a tools tree and use it to build the image and provide the environment for mkosi box. To disable the tools tree and use binaries from the host instead, a project writes a setting to mkosi/mkosi.local.conf. Every time the mkosi target is built, a fresh image is built ([systemd.io/HACKING](https://systemd.io/HACKING/), jev weight 0.79, authoritative). Two consequences follow for a tracking discipline:

1. Because the default is on, a repo that does nothing still gets a tools tree, and its contents are whatever mkosi's default tools-tree distribution resolves to at build time.
2. Because a fresh image is built each time, an unpinned tools tree can change between two builds of an unchanged source tree. The pin is what makes two builds comparable.

## Configuration surface

Tools trees, including default tools trees, can be further customized via the different ToolsTree* variables as well as the mkosi.tools.conf configuration file or directory. The output format for tools trees cannot currently be changed via configuration files ([mkosi/resources/man/mkosi.1.md](https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md), jev weight 0.91, authoritative).

The mkosi issue tracker shows the concrete variable set in real use: a build of an openSUSE Leap 16.0 image configured [Build] ToolsTreeDistribution=fedora ToolsTreeRelease=42 ToolsTree=default, so that the tool environment is a Fedora 42 image while the target image is openSUSE ([github.com/systemd/mkosi/issues/3990](https://github.com/systemd/mkosi/issues/3990), jev weight 0.87, authoritative). This separates two versions that a tracker must keep distinct: the tools-tree version (Fedora 42 here) and the target-image version (openSUSE 16.0 here).

## Evolution of the mechanism

A weak-source observation worth tracking but not building on: mkosi v23 changed the default tools tree to be reused on incremental builds ([newreleases.io/project/github/systemd/mkosi/release/v23](https://newreleases.io/project/github/systemd/mkosi/release/v23), jev weight 0.13, weak source). If accurate, the mkosi version itself becomes part of what determines whether the tools tree is rebuilt or reused, which reinforces the need to track the mkosi version alongside the tools-tree source.

## Why this belongs in a pinning corpus

The yubiOS build plan treats the tools tree as effectively a second base image inside the build pipeline: it belongs in the same tracking discipline as the bootc base images recorded in the repository's PINNED.md ledger (yubiOS refs plan doc, source of this corpus). The mechanism above is what makes that classification honest: the tools tree is a built image with a resolvable distro source, a version, and a digest, not a host property. Everything else in this corpus builds on that fact.
