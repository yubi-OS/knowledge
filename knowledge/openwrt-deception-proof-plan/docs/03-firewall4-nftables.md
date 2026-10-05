# 03: firewall4 and nftables

Scope: firewall4 and the nftables model on OpenWrt 22.03 and later: UCI firewall syntax preserved, zones, forwarding, and generated rules.

## The 22.03+ default

OpenWrt 22.03 and later ship with firewall4 by default, which uses nftables as its backend while accepting the same UCI configuration syntax as the older fw3. The firewall configuration page in the official guide states this directly, describing `/etc/config/firewall` as the configuration file that firewall4 consumes (https://openwrt.org/docs/guide-user/firewall/firewall_configuration, weight 0.96). This directly verifies the source plan's firewall claim, which had noted the page as a canonical target after an earlier fetch was blocked; the page is now confirmed to state the firewall4-plus-nftables default.

The practical consequence for the yubiOS decoy package: any firewall shipping logic should express itself in UCI (`/etc/config/firewall` sections, possibly via a firewall include file) and let firewall4 generate nftables rules, rather than hand-writing nft rulesets that the framework would fight.

## What firewall4 generates from UCI

The main configuration file `/etc/config/firewall` contains sections defining zones, rules, forwarding policies, and NAT settings; firewall4 translates these into nftables tables and chains at configuration load (https://deepwiki.com/openwrt/firewall4/5-configuration, weight 0.22, weak backing). Zone semantics matter for the decoy design: without explicit forwarding rules between zones, the default policy of most zones is to drop forwarded traffic, so a decoy listener bound only to a WireGuard-zone address is unreachable from other zones unless a forwarding is added (https://deepwiki.com/openwrt/firewall4/6.1-zone-configuration, weight 0.04, weak backing). Community threads confirm the same confusion and resolution around forwardings, firewall chains, and rules; treat them as corroboration only (https://forum.openwrt.org/t/firewall-zones-forwards-and-rules/25197, weight 0.17, weak backing).

## Mixing manual nftables with firewall4

The wiki's dedicated nftables guide explains how nftables works under the hood with a manual configuration, and explicitly warns that this guide is incompatible with fw4 because firewall4 also generates nftables rules (https://openwrt.org/docs/guide-user/firewall/misc/nftables, weight 0.81). For the proof plan this is a hard constraint: do not add raw nftables rules for the decoys alongside firewall4. Everything decoy-related belongs in UCI sections or an fw4-compatible include so the generated ruleset stays coherent.

## Evidence hooks in the firewall model

The firewall documentation hub links the packet-capture and inspection guidance ("how to capture, filter and inspect packets using tcpdump or wireshark tools") alongside the firewall pages, which is exactly the evidence path the proof run needs: dump the UCI config, dump the generated nftables ruleset, then capture packets on the decoy-facing interface (https://openwrt.org/docs/guide-user/firewall/start, weight 0.95).

## Proof requirements for the firewall stage

The firewall proof passes when:

1. The decoy firewall rules exist only in the WireGuard zone's UCI section, and the generated nftables ruleset shows the decoy listener reachable only from that zone.
2. `nft list ruleset` output shows no decoy-related rules in the WAN-facing chains, proving the no-WAN-by-default posture.
3. Removing the decoy firewall include removes the rules from the generated ruleset, demonstrating the UCI-to-nftables path is the only source of truth.
4. The real SSH endpoint's rules are untouched by package install and uninstall.

## Version context

OpenWrt is a Linux distribution targeting embedded devices with a wide configuration surface including firewall, NAT, and port forwarding (https://openwrt.org/, weight 0.98). The plan does not pin a release: firewall4 and nftables behavior described here holds across the 24.10 and 25.12 stable lines, and an evidence run should use the newest point release of whichever line it builds on (v24.10.8 was published 2026-07-26, per the source doc's 2026-09-29 refresh using the GitHub releases API, weight 0.93 in that pass). Background only, not a firewall claim source: the general feature surface listed on Wikipedia (https://en.wikipedia.org/wiki/OpenWrt, weight 0.69, weak backing).
