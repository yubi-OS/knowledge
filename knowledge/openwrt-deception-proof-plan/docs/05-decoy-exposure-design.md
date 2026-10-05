# 05: Decoy exposure design

Scope: Decoy-only exposure design: WireGuard zone segregation, binding decoy listeners away from WAN, real SSH behind VPN, and owner break-glass path.

## The exposure model

The yubiOS proof plan's defining choice is that the real SSH endpoint lives behind WireGuard and the only thing exposed to potential observers is a set of deliberate decoys. Default exposure must be lab-safe:

1. Listen only on a WireGuard-only decoy address or decoy pool.
2. Do not bind WAN by default.
3. Do not redirect the real owner SSH endpoint.
4. Place decoy firewall rules in the WireGuard zone only.
5. Keep a separate owner break-glass path outside the deception service.

These are the plan's own normative defaults, and each one maps to a firewall4 mechanism documented in doc 03: zone-scoped rules, absence of WAN-facing rules, and an independent owner path that the decoy package cannot affect.

## WireGuard zone mechanics on OpenWrt

The OpenWrt wiki's WireGuard server guide establishes the zone model: treat the VPN network as private and assign the VPN interface to a firewall zone (commonly LAN) to minimize firewall setup (https://openwrt.org/docs/guide-user/services/vpn/wireguard/server, weight 0.92). The client-side guide covers the peer and interface configuration that puts a remote host inside such a zone (https://openwrt.org/docs/guide-user/services/vpn/wireguard/client, weight 0.86). For all-traffic scenarios the wiki documents routing everything through the tunnel with `allowed_ips` set to `0.0.0.0/0` and `route_allowed_ips` enabled (https://openwrt.org/docs/guide-user/services/vpn/wireguard/all-traffic-through-wireguard, weight 0.92).

The plan needs something slightly different from the standard single-zone recipe: a decoy pool reachable only from WireGuard-zone clients, so that a peer inside the zone sees decoy ports first when scanning, while the real SSH address stays invisible to that same scan. Splitting WireGuard peers into separate firewall zones with tailored forwarding rules is possible; a solved forum thread describes putting different WireGuard clients into separate zones and wiring per-zone forwards, which is the mechanism the decoy zone would use (https://forum.openwrt.org/t/solved-different-firewall-zones-for-different-wireguard-clients/222048, weight 0.11, weak backing). Community threads about WireGuard zone setup generally confirm the zone-plus-forwarding mental model but add nothing normative (https://forum.openwrt.org/t/solved-wireguard-zone-firewall-i-dont-understand/142385, weight 0.13, weak backing).

## Decoy-first visibility

The decoy pool is the observable surface. Commercial honeypot documentation describes the same arrangement from the defensive side: a honeypot SSH agent runs an SSH decoy inside your infrastructure to detect attackers, including those who have already crossed the perimeter (https://docs.webdecoy.com/protection-setup/honeypot-ssh-agents/, weight 0.54). The value proposition holds for a VPN-scoped decoy: an attacker who obtained a WireGuard peer credential becomes visible the moment they scan for SSH targets, because they hit decoys instead of the real endpoint. General honeypot literature makes the same case for fake SSH services that log every login attempt, probe, and payload from automated scanners (https://embargo.splunk.com/en_us/blog/learn/cybersecurity-honeypots.html, weight 0.54, aggregator source, treat as secondary).

Honeypot deployment guides echo the low-vs-high interaction split and the need to secure decoy systems themselves (https://scansearch.net/en/articles/honeypot-setup-deployment-guide/, weight 0.43, weak backing). Individual builds of SSH honeypots demonstrate the decoy-attracts-attacker pattern at small scale (https://www.wilck.io/posts/ssh-honeypot/, weight 0.35, weak backing).

## Break-glass and failure posture

Because the decoy service touches the firewall zone where the owner's own access lives, the plan requires a break-glass path independent of the deception package: a way to reach the real SSH endpoint (or recover the router) that does not route through yubios-endlessh or its firewall include. The ADR should record:

1. The trust boundary: the WireGuard zone is trusted enough to reach decoys and the owner path; the WAN is trusted for nothing by default.
2. Failure behavior: if the package crashes or its firewall include fails to load, the default posture must revert to no decoy exposure rather than accidental WAN exposure.
3. Recovery: documented rollback (package removal, firewall include removal) that restores the pre-install ruleset exactly, verified in the VM proof.

## Proof requirements for the exposure stage

The exposure proof passes when:

1. A WireGuard-zone client's port scan enumerates decoy ports and never reveals the real SSH endpoint.
2. The UCI and nftables dump shows zero decoy-related rules outside the WireGuard zone.
3. An external scan of the WAN interface finds no decoy ports and no change in the WAN attack surface after package install.
4. The break-glass path works with the decoy service stopped, crashed, and uninstalled.
