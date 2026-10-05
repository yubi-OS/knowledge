# 04 - OpenWrt packaging status

Scope: the OpenWrt packaging landscape for endlessh: absence of official packages, what the official feed looks like, and the realistic packaging paths for an edge router.

## What the official feed contains

OpenWrt ships several thousand packages through its community maintained feeds, browsable through the official package index (source: https://openwrt.org/packages/start, jev weight 0.8073). The package feed itself is the openwrt/packages repository, which contains build scripts, options, and patches for community maintained applications rather than upstream sources (source: https://github.com/openwrt/packages, jev weight 0.7316).

Endlessh is not in that set. A code search scoped to the openwrt/packages repository for "endlessh" returns 0 results as of the 2026-09-29 check recorded in the source research note (primary upstream check, https://api.github.com/search/code?q=endlessh%20repo%3Aopenwrt%2Fpackages, not jev-scored). The 2026-07-17 pass reached the same conclusion, and the web dig for this corpus likewise surfaced no OpenWrt feed proposal or third-party OpenWrt package for endlessh. The highest-weighted search hits were the upstream repository itself (jev weight 0.9127), the OpenWrt wiki package index (jev weight 0.8073), and the OpenWrt project portal (jev weight 0.8983 at https://openwrt.org/), none of which list an endlessh package.

## What exists outside OpenWrt

Packaging for endlessh exists on other platforms, which is useful evidence that the software packages cleanly, but none of it transfers directly:

- Debian carries it as a source package, 1.1-5, including a packaged README (source: https://sources.debian.org/src/endlessh/1.1-5/README.md/, jev weight 0.8279). A Debian packaging lineage shows the build is simple and license-clean.
- Docker images wrap it for server use, for example the linuxserver image on Docker Hub (weak backing, jev weight 0.2106, https://hub.docker.com/r/linuxserver/endlessh) and jkeuper's image documenting the signal interface (jev weight 0.5292, https://github.com/jkeuper/endlessh-docker).
- Upstream itself remains dormant: the latest commit dates to 2021-04-30 with tags 1.1, 1.0, and 0.1, per the upstream git history recorded in the source note (primary upstream check, https://api.github.com/repos/skeeto/endlessh/commits, not jev-scored).

## The realistic packaging paths

Given no official package, an OpenWrt integration has 2 realistic shapes:

1. A small custom feed package that builds endlessh from the pinned upstream release tarball, with the package Makefile carrying the source hash, license metadata (UNLICENSE, public domain), and conffiles.
2. A wrapper package that embeds the pinned endlessh build plus the WireGuard and firewall glue, so the tarpit and its integration ship as one unit.

The second shape matches the actual integration need: the value for a router is not the bare binary but the surrounding procd/UCI wiring, firewall redirects, and notification helper, none of which exist upstream.

## Community caution as a design input

An OpenWrt forum thread discussing endlessh on routers closed with explicit caution: unless you really know what you are doing on dedicated and closely monitored gear, do not run it, since it opens another barely audited potential security issue, and ports are closed by default on OpenWrt (weak backing, https://forum.openwrt.org/t/closed-endlessh-is-an-ssh-tarpit/116332, jev weight 0.0372). Weak weight, but the underlying point is sound and matches router practice: a deception service must be disabled by default and scoped to a controlled network zone.

That caution has a concrete supply chain dimension. Router firmware with embedded implants is a documented real-world pattern: Zbtlink firmware shipped an embedded remote-control implant derived from an open source tool across its product line (jev weight 0.5358, https://cyberinsider.com/chinese-zbtlink-wifi-routers-ship-with-endlessdoors-malware/, and jev weight 0.5638, https://www.dugganusa.com/post/a-root-shell-shipped-from-the-factory-in-21-firmware-images-across-two-years-endlessdoors-was-never). Any package that vendors a third-party binary rather than building from pinned source inherits exactly this risk class.

## Bottom line

Assume the OpenWrt package does not exist and must be authored. Build from pinned upstream source, treat the UNLICENSE public domain grant as the licensing basis, and scope the package so the tarpit is inert until an operator explicitly configures the network zone it serves. The packaging gap is also the opportunity: the wrapper layer is where the actual defense lives.
