# 08 - Notification aggregation across hosts

**Scope:** Aggregating probe notifications across decoy hosts at the owner's existing notification point without adding new cross-host attack surface.

## The design rule

The prototype aggregates probe notifications at the point the owner already receives notifications, not by adding a new cross-host notification relay. The event tuple surfaced is event count, source, and decoy, extended across hosts so the owner can see which host and which decoy a probe hit without checking multiple separate notification streams. The rule is explicit: reuse the existing notification design rather than adding new attack surface for a marginal UX gain.

This is deliberately the boring option, and the alerting literature supports the boring option for exactly this reason. Honeypot alert-stream research emphasizes accuracy with low false positive rates: HoneyStat uses modified honeypots to generate a highly accurate alert stream with low false positives, contrasting with the noise of traditional highly-interactive honeypots (source: https://www.academia.edu/9602275/HoneyStat_Local_Worm_Detection_Using_Honeypots, jev weight 1.0). Training material on honeypots notes that log aggregation platforms provide live monitoring and alerts, which is particularly beneficial when honeypots are deployed with the intent to respond to attacks (source: https://tryhackme.com/room/introductiontohoneypots, jev weight 1.0). Aggregation is valuable; the prototype only constrains where it happens.

## Why not a cross-host relay

A new cross-host notification relay would violate 3 prototype invariants at once:

1. It adds a runtime network path between decoy hosts, which the coordination model (doc 05) forbids.
2. It adds a new component an attacker inside the mesh could probe, poison, or use to map the decoy topology.
3. It creates shared runtime state, turning one compromised router into a lever on the whole mesh's alerting.

Multi-layered deception deployments in the literature integrate diverse honeypot technologies with a local alert system, keeping the alert path as part of the deception design rather than as an independent distributed service (source: https://www.techrxiv.org/doi/pdf/10.36227/techrxiv.175339530.08463202/v1, jev weight 1.0). Honeypot and IDS integration work similarly treats the alerting pipeline as a component of the controlled environment rather than as new exposed infrastructure (source: https://link.springer.com/chapter/10.1007/978-3-032-28097-8_59, jev weight 1.0).

## What aggregation must surface

The prototype's minimum observable is the tuple: count of probe events, source address or mesh peer, and the decoy (host plus pool address) that received the probe. Practical honeypot monitoring projects define the same observables: capturing malicious login attempts per honeypot instance and monitoring them (source: https://github.com/dishachavann/Honeypot-attack-detection-system, jev weight 1.0). Adaptive honeynet research extends the idea to detection systems whose scope is explicitly network-based threat detection (source: https://arxiv.org/pdf/2512.07827, jev weight 1.0), and medium-interaction honeypot-plus-IDS designs place the honeypot inside an intrusion detection structure for exactly this observability (source: https://link.springer.com/chapter/10.1007/978-3-031-81213-2_6, jev weight 1.0).

Two properties matter for the tuple's design:

- **No payload content.** Logging defaults are metadata only: no passwords, keys, or payloads. Aggregation inherits that constraint; it summarizes, it never forwards captured content.
- **Per-host attribution.** The value of multi-host aggregation is knowing which host and decoy was probed. An aggregate that loses attribution is worse than per-host streams, because it hides the cross-host pattern that distinguishes opportunistic scanning from deliberate mesh mapping.

## Design conclusion

Aggregation is the one part of the deception LAN that faces the owner rather than the attacker, and the design keeps it that way: no new surfaces, no new protocols, no new state. The evidence plan's notification-aggregation check (doc 07, item on surfacing host plus decoy) is what verifies the tuple actually reaches the owner's existing notification point across all hosts.
