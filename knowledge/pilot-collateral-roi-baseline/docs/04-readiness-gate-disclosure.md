# 04. Readiness-gate disclosure in commercial collateral

**Scope:** readiness-gate disclosure: stating known blockers, gates, and product limitations honestly in commercial collateral without overstating readiness.

## The conversion risk is operational, not just reputational

Post-pilot failure analysis identifies the gap between a successful pilot and a production deployment as organizational and operational rather than primarily technical: data quality, latency and scale, monitoring and observability, governance and compliance, organizational ownership, and user trust are the failure categories between pilot and production (weight 0.35, weak backing: heyclarity.dev, https://heyclarity.dev/blog/from-pilot-to-production-6-gaps-that-kill-enterprise-ai/). A parallel scaling playbook describes the same stall: the pilot worked, the demo impressed stakeholders, and then the deployment failed to deliver sustained value because of organizational and operational gaps (weight 0.30, weak backing: corporateaiconsultants.com, https://corporateaiconsultants.com/insights/ai-pilot-to-production-scaling-playbook).

The relevance to disclosure is direct: if a pilot's real failure modes are operational and trust-based, then overstating readiness does not convert a marginal pilot into a good one. It converts a pilot that could have produced honest evidence into one that produces a broken deployment instead.

## Stated limitations and buyer evidence demands

Enterprise readiness checklist practice converges on a specific fact: a large buyer's security team requires the set of controls plus the documented evidence for each one before approving a purchase, and most stalled deals fail on missing evidence rather than missing controls (weight 0.08, weak backing: shantiinfosoft.com, https://shantiinfosoft.com/blog/enterprise-software-security-readiness-checklist/). A readiness checklist structured around ownership, information boundaries, resilience, assurance, operations, and handover gives the evidence categories a buyer audits (weight 0.35, weak backing: lumoxtech.com.au, https://lumoxtech.com.au/resources/enterprise-software-readiness-checklist/).

This means a readiness-gate disclosure is not a concession the vendor makes grudgingly. It is pre-answering the buyer's evidence request. A pilot SOW that states "these gates must close before enrollment work begins, and here is the tracker where that status lives" hands the buyer the evidence trail before they ask for it.

## A public model for live limitation disclosure

The release-health pattern from a large platform vendor shows the operational form: a continuously maintained public page of known issues and rollout status for a shipped product, with a documented API for programmatic consumption, so administrators can poll status rather than read prose (weight 0.24, weak backing: learn.microsoft.com, https://learn.microsoft.com/en-us/windows/release-health/status-windows-11-25h2). The transferable properties are: single canonical location, continuous update, programmatic access. A small project's equivalent is its blocker tracker, and the data sheet's known-limitations section should reference that tracker as the source of truth with a freshness timestamp, not paraphrase from a cached copy.

## Honesty as positioning

Practitioner guidance frames acknowledging what the product does not do, and why, as a trust mechanism with investors, customers, and partners, and treats overselling as a credibility cost (weight 0.11, weak backing: opag.io, https://opag.io/intangibles/faq/honest-product-limitations-credibility). The commercial logic behind the untested assumption ("do honest readiness disclosures kill pilot interest?") can be read in both directions from this evidence: limitations disclosed plainly reduce the surprise gap at evaluation time, which is when stalled deals are actually lost.

## Template rules for readiness-gate disclosure

1. Each gate gets: a name, a definition of what evidence closes it, and the current status as of a stated date, sourced from the blocker tracker.
2. The disclosure distinguishes between a gate with a defined scenario list and a gate with actual execution evidence. The first is not readiness.
3. The SOW states which gate status applies at signature time and commits to re-disclosure if status changes before kickoff.
4. No gate is described as "nearly closed" in customer-facing collateral; statuses are binary with evidence, or explicitly not yet evidenced.
5. The commercial cost of disclosure is logged as an open assumption and validated in the pilot's own discovery conversation, not resolved by choosing optimism.

The doctrine being enforced is asymmetry: overstating readiness is ruled out categorically because it manufactures evidence that does not exist; understating readiness is recoverable and is simply priced as an honest open question.
