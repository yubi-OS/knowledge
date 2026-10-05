# 07 - Evidence-run plan for the prototype

**Scope:** The evidence-run plan for the prototype: per-host router config, firewall view, scan behavior, packet capture, service logs, plus a cross-host comparison step.

## What must be produced, and by whom

The prototype plan is explicit that nothing here is implemented: section 5 of the source design records that no OpenWrt VM or spare router was built, no package code was written, and no packet capture or scan evidence was produced. The evidence-run plan below is the plan for producing that evidence, extending the single-host evidence-run plan to the multi-host case, and it must be executed as separate follow-up work before the design can be promoted.

Evaluation methodology research supports the shape of the plan: telemetry-based evaluation work derives reproducible metrics of deception directly from honeypot telemetry, grounding evaluation in observable attacker behavior rather than in configuration claims (source: https://aircconline.com/ijnsa/V18N1/18126ijnsa01.pdf, jev weight 1.0). Honeypot data-collection guides similarly organize evidence into collection, processing, analysis, and visualization stages (source: https://deepwiki.com/paralax/awesome-honeypots/8-honeypot-data-collection-and-analysis, jev weight 1.0).

## The 5 per-host evidence categories

For each OpenWrt host running yubios-endlessh with a worksheet-assigned decoy pool:

1. **Router config.** The host's UCI config as deployed, showing the decoy_pool assignment, firewall zones, and service enablement.
2. **Firewall view.** The effective firewall rules as seen from inside the WireGuard zone, confirming no WAN bind and no redirect of the real SSH endpoint (doc 06).
3. **Scan behavior.** Probe the host's decoy pool from within the mesh and record how the decoy surface responds to scanning.
4. **Packet capture.** Capture the probe traffic, including the slow SSH banner exchange that the tarpit produces.
5. **Service logs.** The yubios-endlessh service logs, metadata only per the logging defaults, showing connection counts and probe outcomes.

Lab-style honeypot work illustrates the packet and log categories in practice: containerized low-interaction honeypot labs analyze network scanning, packet-level TCP mechanics in Wireshark, and forensic log behavior together (source: https://github.com/Kingsley-soc/Low---interaction-Honeypot-Lab-/tree/main, jev weight 1.0). Projects that combine capture with alerting describe the honeypot's job as attracting, capturing, recording, and analyzing attacker behavior (source: https://medium.com/@23it113/from-packet-filtering-to-threat-intelligence-building-a-windows-firewall-and-soc-r, jev weight 1.0).

## The cross-host comparison step

The multi-host addition is one extra category: a cross-host comparison confirming that decoys look structurally consistent across hosts. This is the empirical test of docs 03 and 04: same evidence categories per host, then diff them. If one router's decoy pool is structurally distinguishable, the shared worksheet failed at its job and the pool plan needs revision before any attacker-facing claims are made.

Evaluation frameworks already exist for scoring individual deception components against a standard: the Universal Honeypot Benchmarking Standard publishes a scorecard for endlessh as an SSH tarpit, with a vendor-neutral evaluation framework and a 0 to 100 quality score (source: https://uhbs.github.io/uhbs-standard/mkdocs/scorecards/endlessh-ssh-tarpit/, jev weight 1.0). Such external scorecards are useful references for the scan-behavior category, though the prototype's own gate is its cross-host consistency check. Evaluation work on honeypot realism likewise ties deception quality to measurable attacker-facing properties rather than to deployment effort (source: https://www.emergentmind.com/topics/scheming-honeypot-evaluations, jev weight 1.0).

## The gate the evidence feeds

Per the roadmap promotion gates, nothing in this design should be described as implemented without an owner, an evidence target, and a recovery plan named. The evidence-run plan satisfies that gate structure: the owner is named in the source design, the evidence target is the 5 plus 1 categories above across at least 2 OpenWrt hosts, and the recovery plan is doc 09's rollback behavior. Until the evidence exists, the design stays in prototype stage, and the README records it as such.
