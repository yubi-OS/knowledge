# 05 - Coordination without a central controller

**Scope:** Coordinating decoy configuration across hosts without a central controller: a static owner-authored planning worksheet instead of a runtime sync protocol.

## The design choice

The prototype rejects a central controller or synced database for decoy coordination. The reason is stated in the source design and holds up against the literature: a central coordination service would itself become a new trust boundary and a new single point of compromise, and would contradict the mission's stance against adding authority hubs. Coordination instead is a static, owner-authored config convention: the same decoy_pool UCI field the yubios-endlessh package already validates, populated from a shared address-planning worksheet the owner fills in once. No runtime protocol runs between routers.

Architecture principle guides put the underlying rule plainly: layered security mechanisms are preferred, and single points of failure are to be avoided in security architecture (source: https://www.linkedin.com/pulse/5-cybersecurity-principles-follow-one-avoid-3hhbf, jev weight 1.0). In a deception LAN, the coordinator is not just a single point of failure but a single point of discovery: compromising it reveals the full decoy map and, by omission, the real host.

## What the literature automates, and why the prototype does not

Published honeypot management systems automate exactly the thing the prototype declines to build, and their tradeoffs are instructive. An adaptive honeypot configuration, deployment and maintenance strategy notes that state-of-the-art deployment is a manual process in which the honeypot needs to be configured and maintained by a network administrator, and proposes dynamic configuration to improve on it (source: https://arxiv.org/pdf/2111.03884, jev weight 1.0). HoneyChart automates honeypot management over Kubernetes, treating deployment as a container-orchestration problem (source: https://link.springer.com/chapter/10.1007/978-3-031-25460-4_18, jev weight 1.0), with the same architecture described in its author preprint (source: https://www.ntousakis.com/honeychart-cps4cip-2022.pdf, jev weight 1.0). Lightweight management frameworks for home and small-office users exist too, such as HoneyManager, an open-source honeypot management framework aimed at home users and small organizations (source: https://github.com/hosafxd/HoneyManager, jev weight 1.0).

The prototype's small mesh makes the manual path the honest choice: 2 to a handful of routers with hand-filled pool assignments do not need a controller, and a controller bought at this scale would be pure attack surface. The survey literature supports scoping automation to need: the cyber deception survey treats automation and management as open engineering challenges whose solutions must be justified by the deployment, not assumed (source: https://arxiv.org/html/2409.07194v1, jev weight 1.0).

## What the static convention preserves

The static worksheet convention preserves 4 properties the prototype depends on:

1. No new network protocol between routers, so no new attack surface for an attacker inside the mesh.
2. No shared runtime state, so compromising one router reveals only that router's pool, not the mesh-wide plan in executable form.
3. Human auditability: the owner can read the whole decoy plan in one document.
4. Failure isolation: a router that loses its config still runs its own pool from local UCI state, per doc 09's fail-to-no-decoy-service rule.

These are the same properties that make the aggregate notification path (doc 08) safe to keep dumb: because hosts do not trust or talk to each other at runtime, aggregation can happen at the owner's existing notification point without hosts needing to relay for each other.

## Design conclusion

Coordination without a controller is not a limitation of the prototype, it is a deliberate prototype-stage decision with a named re-entry path: if the mesh grows past hand-planning scale, the worksheet is the spec that any future tooling would have to honor, and the yubios-endlessh UCI contract is the interface that tooling would populate. Until then, the survey consensus that honeypot configuration is a manual admin process describes the prototype's actual operating model (source: https://arxiv.org/pdf/2111.03884, jev weight 1.0).
