# 06 - nftables redirect and attribution

Scope: nftables and firewall4 redirect/DNAT with logging: preserving the original destination for decoy attribution on OpenWrt.

## The NAT primitives

Nftables provides 2 primitives that matter for a decoy service. Redirect is a special case of destination NAT that redirects packets to the local machine, depending on the chain hook (source: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/7/html/security_guide/sec-configuring_nat_using_nftables, jev weight 0.8930). DNAT rewrites the destination address and optionally port to another host or port. NAT chains in nftables are consulted according to their priorities, and the first matching rule that adds a NAT mapping (dnat, snat, masquerade) terminates evaluation of that chain type (source: https://wiki.nftables.org/wiki-nftables/index.php/Performing_Network_Address_Translation_%28NAT%29, jev weight 0.8595).

The critical ordering fact: DNAT changes the destination address of incoming packets (weak backing, https://oneuptime.com/blog/post/2026-03-20-destination-nat-dnat-nftables/view, jev weight 0.1240). Once the DNAT or redirect has been applied, a program behind it sees the rewritten destination. If the router needs to know which decoy address was probed, that information must be captured before the rewrite: either by a log statement in the same chain placed before the dnat rule, or by mapping decoys to distinct local backend ports so the destination port itself carries the attribution.

A working DNAT rule shape in nftables syntax is a prerouting chain rule matching the destination and port with a dnat target, for example matching tcp dport and rewriting to a local port (source: https://jensd.be/1086/linux/forward-a-tcp-port-to-another-ip-or-port-using-nat-with-nftables, jev weight 0.6151).

## OpenWrt firewall4

Since OpenWrt 22.03 the default firewall is firewall4 (fw4), which uses nftables as its backend and accepts the same UCI configuration syntax as the previous fw3 system; include mechanisms are available for extra functionality (source: https://openwrt.org/docs/guide-user/firewall/firewall_configuration, jev weight 0.8938). The system runs in userspace, parsing the configuration into nftables rules and sending each to the kernel (source: https://openwrt.org/docs/guide-user/firewall/overview, jev weight 0.9283).

Firewall4's NAT and redirection implementation covers how packet address translation is managed, including DNAT and redirect behavior (weak-to-moderate backing, https://deepwiki.com/openwrt/firewall4/7.2-nat-and-redirection, jev weight 0.7428). OpenWrt's UCI firewall config supports redirect sections, and for rules beyond what UCI expresses, fw4 provides nftables include slots such as ruleset-post directories where a package can install additional rule fragments (source: https://openwrt.org/docs/guide-user/firewall/misc/nftables, jev weight 0.7691; include mechanics also at https://openwrt.org/docs/guide-user/firewall/firewall_configuration, jev weight 0.8938).

## The attribution pattern for a decoy pool

Putting the primitives together for a WireGuard-only decoy pool:

1. Match scan traffic to the decoy address set with an nftables set, so the match is data driven rather than hard coded.
2. Log source, destination, port, and interface in the same prerouting chain before the redirect rule. Because the first NAT mapping terminates NAT evaluation, the log rule must sit before the dnat/redirect rule in rule order (source: https://wiki.nftables.org/wiki-nftables/index.php/Performing_Network_Address_Translation_%28NAT%29, jev weight 0.8595).
3. Redirect or DNAT the SSH probes to a local tarpit port. Redirect sends the packet to the local machine (source: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/7/html/security_guide/sec-configuring_nat_using_nftables, jev weight 0.8930).
4. Use the router's log, not the tarpit's log, for per-decoy attribution, because the tarpit sees only the post-rewrite destination.

The single-instance variant redirects all decoy probes to 1 local port and recovers the original destination from the pre-redirect log line. The multi-instance variant maps decoy groups to distinct local ports, which makes the destination port itself the attribution key and allows different tarpit profiles per group.

## What nftables alone cannot fix

The tarpit binds wildcard on its selected port and family; it has no bind-address option and no awareness of the original destination after a redirect. This is confirmed by the upstream configuration surface, which offers port and family knobs but no address binding choice (source: https://github.com/skeeto/endlessh, jev weight 0.9127). So per-decoy-IP behavior must come entirely from the firewall layer: log-before-redirect, per-decoy local ports, or separate network namespaces. That constraint is the single most important integration fact for the wrapper design.

## Packaging hooks

The natural package shape is a fw4 include: a ruleset-post fragment installing the decoy set, the log rule, and the redirect rule, managed by the package so operator UCI state drives rule generation. Ubuntu's security documentation describes nftables as the modern netfilter classification framework and successor to earlier tooling (source: https://documentation.ubuntu.com/security/security-features/network/firewall/nftables/, jev weight 0.7867), and OpenWrt's firewall overview confirms the same architecture locally: userspace rule generation, kernel enforcement (source: https://openwrt.org/docs/guide-user/firewall/overview, jev weight 0.9283).
