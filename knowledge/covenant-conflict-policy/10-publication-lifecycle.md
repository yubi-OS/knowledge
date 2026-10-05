# 10 - Publication lifecycle: staging governance docs and promotion to the root

Scope: how governance documents move from draft staging to permanent published status, including review dependencies and human sign-off.

## The published artifact set

The strongest evidence for what published governance looks like comes from foundation practice. The CNCF project template ships a GOVERNANCE.md as a standard artifact, with a companion maintainer-governance document "suppl[ying] rules for a simple self-selecting council of Maintainers as project governance" (weight 0.85: https://github.com/cncf/project-template/blob/main/GOVERNANCE.md). A guide to writing governance down catalogs the real documents projects publish: GOVERNANCE.md templates, contributor ladders, RFC processes, voting and veto rules, and what happens when the founder leaves (weight 0.74: https://openresource.dev/guide/maintaining/governance/).

## What the research says about documentation quality

A 2026 arXiv study, "Governance in Practice: How Open Source Projects Define and Document Roles," addresses the gap systematically: OSS sustainability depends on governance structures that define "who decides, who acts, and how responsibility is distributed," and the study finds projects lack systematic, empirical grounding in how to document roles (weight 0.72: https://arxiv.org/html/2603.24879v1). The same study is available as a PDF (unweighted duplicate, see archive: https://arxiv.org/pdf/2603.24879). The implication for lifecycle design: a governance doc that is published before its authority framing is reviewed tends to describe aspiration rather than practice, which is why staging exists.

## The staging pattern

A defensible lifecycle has three states. Draft: readable and citable in a staging location, consistent with how the repo already treats draft and spec documents before promotion. Published: promoted to permanent, top-level, permanently-linked locations such as COVENANT.md and GOVERNANCE.md at the repo root. Retired or superseded: explicitly marked when replaced. The empirical governance study supports gating promotion on review rather than drafting completeness, since documentation quality, not existence, is what the research links to sustainability.

## Review dependencies and human sign-off

The promotion gate should name its dependencies explicitly. Two recur in practice: (1) dependent decisions landing, for example a pricing or offer document, so that reconciliation sections in the governance doc can be written for real rather than left as open items, and (2) human sign-off on sections that describe governance affecting the role-holder directly, since an agent or automation should not unilaterally finalize a document that defines its own authority. This matches the CNCF template's premise that governance describes actual maintainers and their actual powers, which requires someone accountable to attest.

GraphQL's history is the scale-up precedent: governance published early in company form, then migrated to neutral foundation governance when the project outgrew it (weight 0.84: https://graphql.org/community/contribute/governance/). A lifecycle clause should therefore provide for revision and re-publication, not one-time promotion.
