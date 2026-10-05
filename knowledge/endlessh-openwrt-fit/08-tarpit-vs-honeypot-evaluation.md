# 08 - Tarpit versus honeypot: evaluation for edge devices

Scope: evaluation criteria for SSH deception on edge devices: where a tarpit sits relative to low and medium interaction honeypots, and what to adopt or avoid on a router.

## The interaction-level taxonomy

Honeypots are conventionally characterized by the level of interaction they offer an adversary, ranging from low to medium to high (weak backing, https://www.sciencedirect.com/topics/computer-science/low-interaction-honeypot, jev weight 0.4545). A low interaction honeypot gives the attacker very limited access to the operating system; the adversary cannot interact with the decoy in any depth (source: https://www.akamai.com/blog/security/high-interaction-honeypot-versus-low-interaction-honeypot-comparison, jev weight 0.6682). Low interaction honeypots simulate the services attackers most commonly probe, which makes them less risky and easier to maintain (source: https://www.techtarget.com/cybersecurity/definition/What-is-a-honeypot-How-it-protects-against-cyberattacks, jev weight 0.7423).

A tarpit sits at the extreme low end of this spectrum: it offers no interaction at all beyond protocol bytes, and its goal is not observation of attacker behavior but attrition of attacker time and connection state.

## What a real honeypot costs

Cowrie is the reference point for SSH deception beyond a tarpit: it is a medium to high interaction SSH and Telnet honeypot designed to log brute force attacks and the shell interaction performed by the attacker, with a medium interaction mode emulating a UNIX system in Python (source: https://github.com/cowrie/cowrie, jev weight 0.9263). The project's own site describes the same scope: logging brute force attacks and shell interaction for threat intelligence and attack analysis (weak backing, https://cowrie.org/, jev weight 0.1702).

That capability has a resource and risk profile that a router does not want: a Python runtime, emulation logic that must be kept current, stored attacker input, and a service whose whole purpose is to let an adversary push deeper. 2026 comparisons of self-hosted honeypot stacks position Cowrie as the deep SSH/Telnet option within larger multi-container platforms (weak backing, https://netguardia.com/security-operations/software-tools/building-a-honeypot-t-pot-vs-cowrie-vs-dshield-in-2026/, jev weight 0.3227, and https://www.pistack.xyz/posts/self-hosted-honeypot-deception-cowrie-tpot-opencanary-guide-2026/, jev weight 0.2623). Another comparison contrasts the deep SSH focus of Cowrie with breadth across protocols and payload collection in other tools (weak backing, https://www.bigiron.cc/guides/self-hosted-honeypot-cowrie-vs-dionaea-vs-t-pot, jev weight 0.1808).

## Evaluation criteria for a router-class deception service

For an edge device, the evaluation is not "which honeypot is best" but "which deception layer is worth its footprint and risk":

1. Interaction depth versus risk. Higher interaction buys better telemetry but increases the chance the decoy becomes the breach point. Low interaction and tarpits are less risky and easier to maintain (source: https://www.techtarget.com/cybersecurity/definition/What-is-a-honeypot-How-it-protects-against-cyberattacks, jev weight 0.7423).
2. Credential handling. A tarpit that never authenticates captures no credentials by design. A shell-emulating honeypot records attacker input, which is both its value and its liability.
3. Resource profile. A single-threaded C binary with bounded state (source: https://github.com/skeeto/endlessh, jev weight 0.9127) fits a router; a Python emulation stack does not fit the same budget class.
4. Attribution path. A tarpit produces almost no useful data on its own, so attribution must come from the surrounding firewall and logging layer, which is infrastructure the router already has.
5. Purpose fit. For slowing enumeration and generating scan signals, a tarpit is sufficient. For threat intelligence on attacker tradecraft, a honeypot is required, and that workload belongs off the router.

## What this resolves for the OpenWrt design

The tarpit and the honeypot are complements, not competitors, and the router is the wrong place for the honeypot half. The defensible edge posture is: an SSH tarpit bound to decoy addresses inside a controlled WireGuard zone, with firewall-layer logging for attribution, rate-bounded notification, and no credential capture. Everything that requires higher interaction, credential collection, or per-attack forensics moves to a more capable host outside the router's resource envelope.

This split also matches the risk guidance from the OpenWrt community itself: a deception service on a router should be treated as an additional, closely monitored surface that is disabled until deliberately configured (weak backing, https://forum.openwrt.org/t/closed-endlessh-is-an-ssh-tarpit/116332, jev weight 0.0372), while the SSH service it protects remains reachable only through controlled identity paths (source: https://www.openssh.org/, jev weight 0.5386).

The resulting criteria list, in priority order for an edge deployment: minimal attack surface, configuration-bounded worst-case resources, no credential or payload retention, attribution derived from existing firewall logging, and a clear promotion path: start with the tarpit, and only escalate to a higher-interaction decoy on infrastructure that can afford the risk and the footprint.
