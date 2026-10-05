# 01 - WireGuard-zone-segmented deception LAN on OpenWrt

**Scope:** Designing a WireGuard-zone-segmented deception LAN on OpenWrt: zone topology, addressing, and confining decoys inside the mesh only.

## Why the deception LAN lives inside a WireGuard zone

The prototype plan for the OpenWrt SSH deception LAN places every decoy service inside its own WireGuard zone and forbids WAN binds. This matches OpenWrt's own firewall guidance for WireGuard: the OpenWrt wiki server guide treats the VPN network as private and assigns the VPN interface to its own zone so firewall policy is explicit rather than accidental (source: https://openwrt.org/docs/guide-user/services/vpn/wireguard/server, jev weight 1.0). The wiki client guide shows the same discipline in the opposite direction, delisting the VPN interface from the WAN zone so tunnel traffic is not treated as internet traffic (source: https://openwrt.org/docs/guide-user/services/vpn/wireguard/client, jev weight 1.0).

OpenWrt's firewall supports giving different WireGuard peers or client groups different firewall zones, which is exactly the primitive a deception LAN needs: the decoy pool gets its own zone with its own policy, distinct from the owner's LAN zone (source: https://forum.openwrt.org/t/solved-different-firewall-zones-for-different-wireguard-clients/222048, jev weight 1.0). Practical 2026-era WireGuard-on-OpenWrt guides confirm the same pattern, recommending attaching wg0 to a dedicated vpn zone whose input and forward rules match the intended security posture instead of folding it into lan (source: https://meshwg.com/openwrt/wireguard/, jev weight 1.0).

## What WireGuard gives the deception design

WireGuard's core design is a small public-key exchange surface: a connection is established by exchanging simple public keys, similar to SSH keys, and the rest of the tunnel setup is handled transparently (source: https://www.wireguard.com/, jev weight 1.0). For a deception LAN this matters for 2 reasons. First, the decoy surface is reachable only through cryptographically authenticated peers, so the attacker population inside the mesh is enumerable by the owner. Second, adding a decoy host to the mesh does not require opening anything on the WAN side.

A mesh topology multiplies this. In a mesh VPN, multiple gateway nodes or endpoints establish direct, mutually authenticated encrypted tunnels with each other rather than hubbing through one device (source: https://meshwg.com/blog/manage-multiple-wireguard-tunnels-mesh-vpn-2026/, jev weight 1.0). Mesh setups can run without relying on a central server, with devices communicating over the VPN directly (source: https://www.zenarmor.com/docs/network-security-tutorials/how-to-configure-wireguard-mesh-vpn, jev weight 1.0). Mesh network topologies let nodes connect to each other dynamically, which improves how traffic flows between them (source: https://tailscale.com/learn/understanding-mesh-vpns, jev weight 1.0). The prototype design uses this property deliberately: each participating OpenWrt router is one mesh peer, and each carries a slice of the decoy surface.

Scaleway's mesh tutorial documents building exactly this shape, a private mesh VPN from WireGuard peers, as a standard deployment pattern rather than an exotic one (source: https://www.scaleway.com/en/docs/tutorials/wireguard-mesh-vpn/, jev weight 1.0).

## Segmentation discipline the prototype inherits

The deception design inherits segmentation defaults from the broader OpenWrt segmentation practice: separate the decoy zone from the owner's LAN the same way home networks separate guest and IoT devices, with firewall zone rules deciding what can talk to what (source: https://blog.lemaker.org/network-segmentation-home-vlans-guest-iot-vpn-openwrt-2026/, jev weight 1.0). Concretely, the prototype keeps:

1. Decoy listeners bound only inside the WireGuard zone, never to WAN.
2. The real SSH endpoint never redirected or exposed through the decoy zone.
3. A separate owner break-glass path so the owner can always reach real management even while decoys are live.

Per-host enforcement is a design requirement, not an optimization: in the multi-host extension, each OpenWrt router enforces these defaults independently, so no single host's firewall is trusted to protect the others.

## Design conclusion

The zone model is the structural foundation of the deception LAN: the WireGuard zone is simultaneously the attacker's playground and the owner's containment boundary. OpenWrt's firewall zone system provides the vocabulary (source: https://openwrt.org/docs/guide-user/services/vpn/wireguard/server, jev weight 1.0), and the mesh pattern provides the multi-host extension path (source: https://www.zenarmor.com/docs/network-security-tutorials/how-to-configure-wireguard-mesh-vpn, jev weight 1.0). What the zone model does not solve, decoy consistency and coordination across hosts, is covered in docs 03 through 05.
