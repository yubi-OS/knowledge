# 01: OpenWrt package structure

Scope: OpenWrt in-tree/feed package Makefile layout, PKG_* variables, Package/<name> sections, conffiles, dependencies, and install rules for a new service package.

## Package Makefile anatomy

An OpenWrt package is defined by a Makefile at the package root that carries two distinct parts: the build metadata block (PKG_NAME, PKG_VERSION, PKG_SOURCE, PKG_MAINTAINER and friends) and one or more `Package/<name>` sections that define install behavior. The official OpenWrt wiki packages guide documents this structure and warns that package names should avoid underscores, because the underscore is a separator in the package name space and can cause build failures (https://openwrt.org/docs/guide-developer/packages, weight 0.92). That naming rule matters directly for the yubiOS plan: the proposed package name `yubios-endlessh` uses a hyphen, which conforms.

The in-tree package model is anchored in the top-level `package/Makefile` of the openwrt/openwrt tree, which drives recursive package builds under `package/` (https://github.com/openwrt/openwrt/blob/main/package/Makefile, weight 0.85). The source plan places the new package at `package/network/services/yubios-endlessh/`, alongside existing services like dropbear, so it inherits exactly this in-tree path.

## Feed layout and feeds.conf

If the package ships outside the tree instead, it becomes a feed. The OpenWrt build system reads `feeds.conf` to decide which package feeds are made available during the firmware configuration stage, and a custom feed is registered there before `menuconfig` can select its packages (https://openwrt.org/docs/guide-developer/helloworld/chapter4, weight 0.91). A feed directory itself should contain no Makefiles at its top level, only subdirectories each with their own Makefile; this convention appears in an OpenWrt forum thread and should be treated as weakly backed community guidance until verified against the helloworld example tree (https://forum.openwrt.org/t/building-a-package-what-am-i-doing-wrong/192701, weight 0.06, weak backing).

For a proof plan, either route works. The in-tree placement is simpler for a one-off test build; the feed route is what upstreaming would require. The plan should pick in-tree first and record the feed migration as a later step.

## Conffiles and the files/ directory

A package that installs configuration must declare it so sysupgrade preserves it. The plan requires `/etc/config/yubios-endlessh` to be installed as a conffile, plus three support files: an init script, the UCI config default, and a firewall include. The mwarning/openwrt-examples repository demonstrates the standard install idiom: `$(CP) ./files/* $(1)/` in the Makefile's install section copies everything under the package's `files/` directory into the image root filesystem, and the repository bills itself as a reference for creating OpenWrt programs and packages (https://github.com/mwarning/openwrt-examples, weight 0.80). A concrete example Makefile from that repository shows the section structure in a minimal form (https://github.com/mwarning/openwrt-examples/blob/master/example1/Makefile, weight 0.55).

The build system itself is Makefile-based and provides the consistent framework that compiles and packages software for installation on OpenWrt systems; a third-party generated wiki describes this in more narrative depth but is an aggregator rather than a primary source, so any structural claim taken from it needs primary verification (https://deepwiki.com/openwrt/packages/1.2-build-system-fundamentals, weight 0.12, weak backing).

## Existing package inventory

Before writing a new Endlessh package, the plan should check whether the target feed already provides one. The OpenWrt wiki keeps browsable package lists showing packages available in the latest release, and that is the first place to look for an existing endlessh entry (https://openwrt.org/packages/start, weight 0.92). The plan already accounts for this: depend on the existing Endlessh package if the feed provides it, or build a local copy installed as `/usr/sbin/yubios-endlessh`.

## Proof requirements for the package stage

The package proof passes when:

1. The package builds against a pinned OpenWrt tree (24.10.x or 25.12.x) without warnings that indicate a missing dependency.
2. `opkg install` places the binary at `/usr/sbin/yubios-endlessh`, the conffile at `/etc/config/yubios-endlessh`, the init script at `/etc/init.d/yubios-endlessh`, and the firewall include in the right location.
3. A sysupgrade dry run confirms the conffile is preserved.
4. The `Package/<name>` section declares dependencies accurately so the image integrates the package with `IMAGE_INSTALL` style inclusion if desired.

General OpenWrt background (device support breadth, build system lineage) is widely documented on Wikipedia but is background only; it should not be cited for package-structure claims (https://en.wikipedia.org/wiki/OpenWrt, weight 0.09, weak backing). A third-party tutorial restates the package creation flow with an example Makefile and patch handling, usable as orientation but not as a citation anchor (https://hanez.org/document/openwrt-building-software-packages/, weight 0.34, weak backing).
