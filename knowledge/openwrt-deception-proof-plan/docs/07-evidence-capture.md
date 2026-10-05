# 07: Packet and scan evidence

Scope: Packet-level and scan evidence requirements: nmap scan behavior against decoys, tcpdump capture on the WireGuard interface, proving no WAN exposure.

## Scan behavior as evidence

The proof run's scan evidence is a port scan from a client inside the WireGuard zone: nmap or an equivalent scanner must enumerate the decoy ports before, and without revealing, the real SSH endpoint. Research on Cowrie honeypots demonstrates exactly what this evidence looks like: an NMAP scan of a Cowrie honeypot revealed it listening on SSH port 22 presenting an OpenSSH 7.6p1 Ubuntu banner and on port 2222 presenting an OpenSSH 6.0p1 Debian banner, showing how a scan enumerates decoy services and their decoy version fingerprints (https://inria.hal.science/hal-03746028/document, weight 0.92). An academic project report on honeypot-based defense against NMAP and SSH attacks on web servers describes the same evidence class: honeypot systems that handle scan requests and SSH connection attempts (https://www.bilal-qudah.com/grad_proj/Honeypot-Based_Approach_Against_NMAP_and_SSH_Attacks_on_Web_Servers.pdf, weight 0.78).

A student vulnerability-management lab documents the concrete command shape: an `nmap -sS` SYN scan from an attacker box against a honeypot enumerated open decoy ports (ftp, http, msrpc, netbios-ssn, microsoft-ds), confirming the decoy is discoverable during scanning (https://github.com/aahme05/vulnerability-management-honeypot-lab, weight 0.32, weak backing, but the command form is standard). The nmap scanner itself is officially distributed at nmap.org for Linux, macOS, and Windows (https://nmap.org/download, weight 0.86).

The decoy evidence must be positive and negative at once: decoy ports visible inside the zone, real SSH port invisible, and no decoy ports visible from the WAN side.

## Packet capture on the WireGuard interface

The packet-capture evidence is tcpdump on the WireGuard interface showing SYNs to decoys and no accidental WAN exposure. The BPF filter syntax for capturing only TCP SYN packets is standard: `tcp[tcpflags] & (tcp-syn) != 0`, usable in tcpdump and identical in Wireshark capture filters (https://serverfault.com/questions/217605/how-to-capture-ack-or-syn-packets-by-tcpdump, weight 0.21, weak backing; https://oneuptime.com/blog/post/2026-03-20-tcpdump-capture-tcp-syn-packets/view, weight 0.17, weak backing). A longer treatment of tcpdump capture filters, snap length, rotation, and the limits of TCP connection evidence is useful for designing the capture run (https://prachub.com/resources/tcpdump-interview-exercises-capture-filters-missing-packets-and-the-connection-evidence, weight 0.25, weak backing).

WireGuard-specific capture technique matters because the WireGuard interface carries encrypted transport on the WAN side and decrypted traffic on the tunnel interface. Troubleshooting guidance for WireGuard with tcpdump distinguishes the four usual failure classes (configuration, firewall, routing, keys) and shows capturing on both the physical and tunnel interfaces to separate them (https://www.procustodibus.com/blog/2023/05/troubleshooting-wireguard-with-tcpdump/, weight 0.47, treat as mid-strength practitioner guidance). A general Linux tcpdump tutorial covers installation and common usage (https://linuxconfig.org/how-to-use-tcpdump-command-on-linux, weight 0.61). A focused blog example shows viewing WireGuard traffic with tcpdump in a real deployment (https://nickb.dev/blog/viewing-wireguard-traffic-with-tcpdump/, weight 0.25, weak backing).

The firewall documentation hub on the OpenWrt wiki links the packet-capture guidance directly from the firewall pages, tying the firewall-state dump and the capture together in one evidence workflow (https://openwrt.org/docs/guide-user/firewall/start, weight 0.95).

## The six-item evidence run

The proof plan fixes the evidence run's contents. Each item is a distinct artifact in the run report:

1. Router config: OpenWrt release, target board or VM, WireGuard zone, decoy pool, real SSH address.
2. Firewall view: UCI config and the generated nftables rules for the decoy listener.
3. Scan behavior: from a client inside the WireGuard zone, nmap or equivalent sees decoy ports before the real SSH endpoint.
4. Packet capture: tcpdump on the WireGuard interface showing SYNs to decoys and no accidental WAN exposure.
5. Service logs: connection evidence without attempted passwords, private keys, or payload contents.
6. Notification: the owner-selected summary path receives event count, source, and decoy tuple, not sensitive payloads.

## Capture hygiene

Captures themselves can leak secrets. Rules for the run:

1. Snap length cap so captures stay header-only; full payload capture is unnecessary for SYN-level evidence.
2. Captures stored with the same short retention as service logs, and never shipped off the testbed unredacted.
3. The WAN-side capture is the negative-evidence artifact: it must show no decoy-directed traffic, so any presence there is a failed run.

## Proof requirements for the evidence stage

The evidence stage passes when a repeat observer can, from the run report alone, reproduce: the scan result (decoys visible, real endpoint invisible), the packet capture (SYNs to decoys on the WireGuard interface only), and the firewall dump (decoy rules confined to the WireGuard zone). Any item that cannot be reproduced from the recorded artifacts fails the run.
