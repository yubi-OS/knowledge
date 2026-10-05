# 03 - Multi-host decoy topology across the mesh

**Scope:** Multi-host decoy topology across a WireGuard mesh: a consistent coordinated decoy surface so a probe against one host does not reveal the real host by omission.

## The multi-host delta over a single-router design

The 2026-07-17 proof plan runs yubios-endlessh on one OpenWrt router with a decoy pool in its own WireGuard zone. A genuinely multi-host deception LAN needs one more layer: multiple decoy hosts across the WireGuard mesh presenting a consistent, coordinated decoy surface, so a probe against any single host does not reveal by omission which one is real. If only one router carries decoys, an attacker who maps the mesh can infer the real host from the structure itself: only one router looks interesting, or the decoy pool size or timing differs.

Research on honeypot architecture supports the multi-node framing. HoneyDOC identifies the essential components of an all-round honeypot design and implements a proof of concept on an SDN-enabled honeypot architecture, evaluating it experimentally (source: https://arxiv.org/abs/2402.06516, jev weight 1.0). Honeypot allocation research argues that deploying honeypots arbitrarily is not feasible and calls for allocation frameworks that are adaptive, scalable, stage-aware, and practical to deploy in real networks (source: https://www.sciencedirect.com/science/article/pii/S1389128625009478, jev weight 1.0). The prototype's answer to allocation is simpler than either: a shared address plan plus uniform per-host packages, sized for a small mesh.

## Consistency as the core requirement

Deception literature converges on the same requirement the prototype encodes. CISA's decoy guidance introduces decoy concepts including tripwires, breadcrumbs, and honeytokens, and maps them to MITRE Engage and ATT&CK for practical, low-complexity deception programs (source: https://www.cisa.gov/resources-tools/resources/using-cyber-decoys-strengthen-detection-and-response, jev weight 1.0). Deception-platform guides describe honeypots as a core component of broader deception technology that also uses decoy documents and fake network topologies to mislead attackers (source: https://www.startupdefense.io/blog/honeypots-a-comprehensive-guide-to-cybersecurity-decoys, jev weight 1.0). Defense-network treatments of deception technology emphasize decoy assets and breadcrumb design whose value is turning attacker interaction into high-fidelity alerts (source: https://corvusintell.com/blog/cybersecurity/deception-technology-defense-networks/, jev weight 1.0).

The survey literature makes the effectiveness claim explicit: a comprehensive survey of cyber deception across domains reports that the most effective deception requires careful design across the whole defended surface rather than isolated decoys (source: https://thesai.org/Downloads/Volume16No7/Paper_92-Cyber_Deception_Across_Domains.pdf, jev weight 1.0). For the prototype this means the decoy surface must look structurally the same no matter which mesh peer an attacker probes: same service types, same pool shapes, same timing behavior, same logging posture on every host.

## What the topology must not leak

Recent deception research sharpens the failure mode the prototype guards against. Work on mapping the deception surface argues the community must first map where decoys can plausibly exist before optimizing decoy placement, because the space where decoys are believable is smaller than commonly assumed (source: https://arxiv.org/html/2606.27966v1, jev weight 1.0). Work on network and device level deception for contested environments describes deception as deliberately manipulating what an attacker observes rather than merely detecting malicious activity (source: https://arxiv.org/pdf/2603.17272, jev weight 1.0). Both point at the same design rule: the multi-host mesh must be planned so the observation an attacker can make from any single vantage point is the same observation they would make from any other.

DecoyTrace applies the decoy concept in decentralized systems, using toxic decoys for active defense and attribution (source: https://arxiv.org/html/2609.36330v1, jev weight 1.0), reinforcing that decoy placement is an active design decision with attacker-modeling consequences, not a default deployment artifact.

## Design conclusion

The multi-host topology adds exactly one thing over the single-router design, coordinated consistency, and it must be bought without a central controller (doc 05) and without per-router pool improvisation (doc 04). The evidence plan in doc 07 includes the cross-host comparison step that tests whether consistency was actually achieved.
