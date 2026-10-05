# 09 - Failure, recovery, and promotion gates

**Scope:** Failure and recovery design plus promotion gates: respawn caps, fail to no-decoy-service behavior, and the evidence checklist needed before leaving design stage.

## The failure rule: fail to no decoy service

The prototype's recovery requirement is precise: if a router's yubios-endlessh misbehaves, for example if the respawn cap from the proof plan's package requirements does not hold, the host must fail to "no decoy service" rather than to any state that exposes the real SSH endpoint or destabilizes routing on that host. This is a fail-closed posture with a deception-specific target: the safe state is not "decoys keep running" but "nothing decoy is reachable and nothing real is exposed."

The general pattern is standard safety engineering. Fail-closed network isolation design contrasts deliberate failure behaviors, where the choice between fail-open and fail-closed is an analysis of security, safety, and availability tradeoffs (source: https://airgapnet.com/guides/fail-open-vs-fail-closed-network-isolation/, jev weight 1.0). Cisco's knowledge base defines the terms: fail-open means the system fails permissive, fail-close means it fails restrictive, and the designer must choose which failure mode the component exhibits (source: https://community.cisco.com/t5/security-knowledge-base/fail-open-amp-fail-close-explanation/ta-p/5012930, jev weight 1.0). Mission-critical design guidance frames the first question not as whether a service can remain available but as what its safe state is (source: https://github.com/DrHazemAli/enterprise-system-design/blob/main/principals/mission-critical-systems/01-safe-state-and-failure-containment.md, jev weight 1.0). For a deception LAN, the safe state answers both sub-questions at once: decoys off, real endpoint untouched, routing stable.

NIST SP 800-53 SA-8(24), Secure Failure and Recovery, states the principle the prototype encodes: a system must be capable of detecting actual and impending failure at any stage, and recovery must preserve security (source: https://csf.tools/reference/nist-sp-800-53/r5/sa/sa-8/sa-8-24/, jev weight 1.0). Applied here: the respawn cap is the detection mechanism, and the fail-to-no-decoy-service state is the recovery target.

## Rollback and recovery in practice

The owner's rollback path for a misbehaving host is package-level: disable the yubios-endlessh service on that router, leaving the host as an ordinary mesh peer with no decoy surface. Honeypot deployment-model research treats honeypots as components integrated into the security stack whose deployment model includes how they are removed or degraded, not only how they start (source: https://acta.uni-obuda.hu/Aradi_Bottyan_Kail_Rigo_Banati_164.pdf, jev weight 1.0). Because coordination is static (doc 05) and notifications aggregate at the owner's existing point (doc 08), a single host going decoy-free creates no cascading failure and reveals nothing to an attacker except one less decoy pool, which the pool worksheet can absorb by reassignment.

## Promotion gates out of design stage

The prototype inherits the roadmap's promotion-gate discipline: nothing is described as implemented without an owner, an evidence target, and a recovery plan named. The evidence checklist before this design leaves prototype stage:

1. At least 2 OpenWrt hosts (VM or spare router) running the existing yubios-endlessh package, each with a decoy pool from the shared worksheet.
2. A probe from within the WireGuard mesh against each host's decoy pool, confirming decoys look structurally consistent across hosts, using the same evidence categories as the single-host plan plus the cross-host comparison step (doc 07).
3. Confirmation that notification aggregation surfaces which host and decoy a probe hit, without requiring the owner to check multiple streams (doc 08).
4. Recovery/rollback verification: a deliberately misbehaving yubios-endlessh instance on one host fails to "no decoy service" without exposing the real SSH endpoint or destabilizing routing.

Deployment-readiness checklists in the honeypot ecosystem show the same structure at other scales: production readiness lists covering service files, security best practices, notification configuration, and logging (source: https://github.com/Madhavi0711/NextPot-Honeypot-RaspberryPi/blob/main/PROJECT_READINESS_CHECKLIST.md, jev weight 1.0), and deployment-readiness documents recording status, checklist, and evidence before production deployment (source: https://github.com/youseefhamdi/RAGIN-Retrieval-Augmented-Honeypot-Intelligence/blob/main/DEPLOYMENT_READINESS.md, jev weight 1.0). The prototype's 4-item list is the same discipline sized to a 2-host mesh.

## Design conclusion

Failure behavior is where a deception design proves it is defensive. The 3 coupled decisions, respawn cap, fail-to-no-decoy-service target, and the rollback that leaves an ordinary mesh peer, mean every failure mode of the decoy layer resolves toward the safe state, and the promotion gates ensure that claim is never made without the evidence to back it.
