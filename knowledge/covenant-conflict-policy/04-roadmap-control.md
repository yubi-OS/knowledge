# 04 - Roadmap control: ADRs, public direction, and community input

Scope: who controls project direction, how roadmap decisions are recorded and gated, and where community input enters.

## ADRs as the roadmap's control plane

The ADR (architecture decision record) canon is the backbone of roadmap control. The ADR hub describes the practice as "open and transparent decision history" and notes that AWS prescriptive guidance recommends ADRs for streamlining technical decision-making (weight 0.38, weak backing: https://adr.github.io/). AWS's own engineering blog, written from experience with hundreds of ADRs, positions them as the mechanism for recording context and consequences at decision time, which is exactly the property a covenant needs: roadmap decisions that touch trust commitments are made in writing, with rationale, before code lands (weight 0.21, weak backing: https://aws.amazon.com/blogs/architecture/master-architecture-decision-records-adrs-best-practices-for-effective-decision-making/). A newer pattern extends this with enforcement: an ADR-governance repository shows a schema-governed approach where a meta-ADR documents the adoption of the governed process itself, and tooling can fail a pull request when watched code paths diverge from a recorded decision (weight 0.38, weak backing: https://github.com/ivanstambuk/adr-governance). The ADR hub's tooling page catalogs the surrounding ecosystem, from adr-log to IDE integrations, that keeps decision logs maintainable (weight 0.37, weak backing: https://adr.github.io/adr-tooling/).

For covenant design, the load-bearing idea is that specific classes of roadmap change, above all anything touching the trust chain, require a recorded decision before implementation, and skipping the record is itself a process conflict.

## RFC processes: how the public steers

React's RFC process is the canonical example of formal community input on direction. Coverage of the adoption notes that the RFC process "stands" for transparency in technical decision-making, with proposals argued and recorded publicly before acceptance (weight 0.25, weak backing: https://ecweb.ecer.com/topic/en/detail-334064-react_adopts_rfc_process_for_open_governance_in_development.html). A community-governance template makes the general rule: "major decisions involve community feedback" and "transparent governance: decision process documented," with scope creep handled through roadmap and maintainer discretion within published rules (weight 0.26, weak backing: https://github.com/hyperpolymath/eclexia-playground/blob/main/TPCF.md).

## Institutional precedent

The European Commission's open-source strategy history shows roadmap control exercised at institutional scale: programmatic decisions (Linux as server OS, Apache for europa.eu) were made and recorded as strategy, demonstrating that public roadmap direction can be governed by published process rather than individual preference (weight 0.60: https://commission.europa.eu/about/departments-and-executive-agencies/digital-services/open-source-strategy-history_en).

## What a roadmap-control clause should say

Synthesis: the covenant should (1) require an ADR before any roadmap change touching covenant-protected areas, (2) define which decision classes need community input via RFC and which are maintainer-discretionary, and (3) treat an unrecorded decision in a protected area as a conflict that blocks merge, matching the pattern in doc 08 on recording.
