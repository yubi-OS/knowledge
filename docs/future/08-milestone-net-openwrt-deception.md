# 08. Milestone Net: OpenWrt WireGuard Deception LAN

Scope: Milestone Net researches an OpenWrt project or package that turns a WireGuard-protected LAN into a deliberate decoy environment for SSH discovery attempts: many low-risk decoy endpoints, slow enumeration, and owner notification when the real host is probed.

## The goal and its reference analysis

The goal statement is concrete: expose "many low-risk decoy SSH endpoints, slow enumeration with tarpits where safe, and notify the owner when an agent or attacker probes for the real host" (source doc, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md). The current fit analysis is recorded in `refs/endlessh-openwrt-fit-2026-07-17.md` (source doc), which evaluates the endlessh tarpit approach against the OpenWrt environment.

## The research shape

Six directions are recorded (source doc):

- Package the work as an OpenWrt feed/package with UCI configuration, procd services, firewall/nftables integration, and optional LuCI only after the CLI path is stable (source doc).
- Bind to the WireGuard zone by default. Do not expose the deception surface on WAN unless an operator explicitly enables a lab mode (source doc).
- Support multi-host deception through loopback aliases, WireGuard-only decoy address pools, or nftables DNAT to lightweight responders (source doc).
- Evaluate an `endlessh`-style banner tarpit for delay, plus a higher-interaction honeypot mode only when storage, CPU, and legal/logging policy are explicit (source doc).
- Notify through syslog/ubus plus owner-selected channels such as ntfy, Gotify, Matrix, email, or a webhook, with rate limits and deduplication (source doc).
- Keep real host discovery dependent on known WireGuard peer identity, SSH host-key verification, and yubiOS/YubiKey controls. "Deception is detection and delay, not primary authentication" (source doc).

## Safety constraints

The doc sets four safety constraints (source doc):

- Do not store attempted passwords, private keys, or sensitive payloads by default; hash or redact evidence when retention is needed.
- Keep strict CPU, memory, connection, and log-size ceilings so a tarpit cannot become a self-DoS.
- Separate protected-LAN mode from internet-facing lab mode in package defaults and documentation.
- Document privacy, legal, recovery, and false-positive handling before recommending deployment.

The self-DoS ceiling is the notable one: a tarpit that holds attacker connections unboundedly consumes the router's own connection table and memory, turning a defense into an outage.

## What the dig adds

The tarpit mechanism is directly documented. The endlessh repository describes itself as an "SSH tarpit that slowly sends an endless banner" (weight 0.38, https://github.com/skeeto/endlessh; labeled weak by jev, though it is the primary project named in the doc's fit analysis). A setup guide for endlessh SSH honeypots is weak (weight 0.28, https://joshuarosato.com/posts/ssh-honeypot-endlessh-setup-guide/), and the OpenWrt forum thread on endlessh is weak and closed (weight 0.07, https://forum.openwrt.org/t/closed-endlessh-is-an-ssh-tarpit/116332). The Go x/crypto/ssh package documents the SSH wire protocol level that decoy endpoints must speak (weight 0.74, https://pkg.go.dev/golang.org/x/crypto/ssh).

On the OpenWrt firewall side, the OpenWrt wiki's nftables guide is the primary reference for the nftables DNAT integration the doc proposes (weight 0.66, https://openwrt.org/docs/guide-user/firewall/misc/nftables), with a second copy of the same guide at equal weight (weight 0.66, https://openwrt.org/docs/guide-user/firewall/misc/nftables?s%5B%5D=command). The OpenWrt wiki front page is weak (weight 0.43, https://openwrt.org/). Community material on nftables and WireGuard routing is weak: a forum help thread (weight 0.06, https://forum.openwrt.org/t/policy-routes-on-nftables-wireguard-help-needed/245242), a port-forwarding plus WireGuard gist (weight 0.13, https://gist.github.com/legeana/c79c62e2117efaa8bf0ba0ea272f7290), and a WireGuard domain-bypass repository (weight 0.20, https://github.com/blazeonmy/openwrt-wg-domain-bypass). A YouTube overview of endlessh is weak (weight 0.18, https://www.youtube.com/watch?v=ITRlqkYxWtw), and a bare google.com result is off-topic noise (weight 0.06, https://www.google.com/).

## Evidence needed before promotion

Four artifacts are required (source doc):

- An OpenWrt VM or spare-router proof with a decoy address pool and owner notification path.
- Packet-level test evidence showing scans hit decoys before the real SSH endpoint is discoverable.
- A reproducible package build recipe, config lint, and firewall rule tests.
- ADR coverage for the trust boundary, notification model, evidence retention, and failure behavior.

The packet-level requirement is the distinctive one: the promotion evidence must show the decoy-first ordering empirically, not argue it from configuration.

## Sources for this doc

Ground spine: yubi-OS/yubiOS `docs/FUTURE.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md), fetched 2026-10-06. Dig results weighted by jev noul as cited inline; 12 results kept, 3 with weight 0.5 or higher.
