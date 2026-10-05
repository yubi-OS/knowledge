# 04 - Mesh-wide decoy pool planning

**Scope:** Mesh-wide decoy pool address planning: allocating decoy addresses from a shared plan rather than per-router pools to avoid structural tells.

## The problem: per-router pools leak structure

In the prototype design, decoy pool addresses are allocated from a shared, mesh-wide plan rather than each router picking its own pool independently. The reason is structural leakage: an attacker who maps the mesh can infer the real host by noticing which router's decoy pool looks different, whether in size, allocation pattern, or timing. A shared plan removes the tell by construction, because every host's pool is drawn from one worksheet with one rationale.

Deception research treats this planning step as a first-class problem, not an afterthought. The MITRE D3FEND knowledge base catalogs decoy network resources as a defensive technique: decoy resources are deployed on servers and network services, and a honeypot may serve a variety of decoy network resources (source: https://d3fend.mitre.org/technique/d3f:DecoyNetworkResource/, jev weight 1.0). Decoy placement research goes further: before the community can engineer new deception technology or algorithmically optimize decoy placement, it must first map the operational deception surface, because the space where decoys can credibly exist is smaller than commonly assumed (source: https://arxiv.org/html/2606.27966v1, jev weight 1.0). An empirical scoring of decoy feasibility against ATT&CK v18.1 found exactly that: the deception surface is smaller than expected, so placement choices carry real weight (source: https://stratosphereips.github.io/cyber-deception-attack-surface/, jev weight 1.0).

## Planning for convincingness

Classical deception engineering makes the same point from the design side: with plenty of advance planning, deceptions can be analyzed carefully to ensure they are as convincing as possible before they are ever deployed (source: https://www.academia.edu/33688391/Introduction_to_Cyberdeception, jev weight 1.0). The prototype's decoy pool worksheet is the concrete form of that advance planning. The owner fills in, once, per-router decoy pool assignments drawn from a common address space, so that:

1. Every router's decoy pool comes from the same planned address range family.
2. Pool sizes are comparable across routers, so no pool stands out by size.
3. The pool layout does not correlate with which router holds the real SSH endpoint.

Practical honeypot guides frame the goal the same way: a honeypot is a decoy system or network resource designed to mimic legitimate targets, which is unlike production systems precisely in that it is configured to be attractive (source: https://tcm-sec.com/protecting-your-network-with-honeypots/, jev weight 1.0). Mimicry is only convincing if it is uniform; a pool plan is what makes uniform mimicry possible across hosts.

## Why a worksheet and not tooling

The worksheet is deliberately a static document, not a config-management tool. Adding tooling to keep decoy pools in sync across routers is explicitly out of scope for the prototype stage: a small mesh can be planned by hand, and hand planning keeps the coordination surface auditable by a human. Deployment-strategy guides for honeypots similarly separate the planning decision (where decoys go, how many, what they look like) from the operational machinery (source: https://scansearch.net/en/articles/honeypot-setup-deployment-guide/, jev weight 1.0), and CISA's decoy guidance frames decoys as low-complexity additions to existing defensive practice rather than a new platform to operate (source: https://www.cisa.gov/resources-tools/resources/using-cyber-decoys-strengthen-detection-and-response, jev weight 1.0).

The prototype's own package boundary enforces the split: the yubios-endlessh package validates a single decoy_pool UCI field per router, and the worksheet supplies the values. Nothing at runtime reads the worksheet, so there is no new protocol to attack and no new sync state to drift.

## Design conclusion

Mesh-wide pool planning is the cheapest high-value artifact in the prototype: one markdown worksheet converts a set of independently configured routers into a coordinated deception surface. Its measure of success is negative evidence: after deployment, no cross-host structural difference should be observable from inside the mesh, which doc 07's cross-host comparison step is designed to test.
