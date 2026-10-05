# Decision authority: who decides, and one deciding frame

Scope: how engineering organizations assign decision rights, why unclear authority is the failure mode that undermines registers, and how a register records its own deciding frame so decisions do not accumulate competing authorities.

## Unclear decision rights are the core failure

Analysis of architecture ownership in complex organizations states the risk plainly: architecture ownership is not a ceremonial title, it decides who can resolve conflicts between speed, resilience, security, cost, and compliance before those conflicts become production defects, and the real risk is not a lack of ideas but unclear decision rights that leave teams without a resolver (https://nhimg.org/faq/who-should-own-architecture-decisions-in-a-complex-organisation/, jev weight 0.17, weak backing). A related practitioner piece on governance frames the same point: architecture is shaped not only by systems and structures, but by how decision authority, accountability, and escalation are distributed (https://pettersson.dev/governance/decision-rights/, jev weight 0.31, weak backing).

The mechanism connecting authority to registers: a decision row’s authority field (or its implied single author) is what makes the row a decision rather than an opinion. When two entries claim different authorities for the same decision, the register has a governance contradiction before it has a technical one.

## Frameworks: RACI and decision-rights models

The standard vocabulary is RACI (responsible, accountable, consulted, informed) applied to architecture decisions: who decides what, ownership models, and common gaps in decision authority (https://capstera.com/knowledge-hub/articles/decision-rights-framework-architecture, jev weight 0.21, weak backing). The McKinsey decision-rights and accountability framework offers an end-to-end method for making decisions better and faster, starting by identifying the few decisions that matter most for value (https://umbrex.com/resources/frameworks/organization-frameworks/mckinsey-decision-rights-and-accountability-framework/, jev weight 0.24, weak backing). Both frameworks answer the register question indirectly: the register’s authority column should resolve to exactly one accountable party per decision.

## Structured governance in engineering projects

Engineering-governance practice formalizes authority into levels: structuring decision governance using authority levels, committees, tolerances, stage-gates, assurance, exceptions, and traceable decisions (https://a3aengenharia.com/en-us/content/technical-articles/authority-levels-committees-stage-gates-engineering-projects-decision-governance/, jev weight 0.33, weak backing). Broader engineering governance definitions cover the same ground: a system of policies, processes, and standards that guides everything from product or project design to production (https://www.jamasoftware.com/blog/engineering-governance-is-a-critical-business-strategy-for-product-project-and-system-development-excellence/, jev weight 0.35, weak backing).

These sources are moderate-to-weak and practitioner-flavored; the load-bearing observation they converge on is that authority is tiered by decision size, and the register should reflect the tier, not flatten every decision to the same weight.

## One deciding frame, not competing frames

The specific contradiction class a register must avoid: two documents proposing competing governance structures for the same decisions. The prevention pattern is referencing, not duplicating: when one document addresses who decides, it should point at the existing authority framing rather than propose a second one. This is the same discipline as the supersession link (one operative record, others pointing at it) applied to authority itself. A register where the who-decides framing is itself consistent inherits that consistency from having exactly one authority definition, stated once and referenced everywhere.

For small organizations and single-decision-maker contexts, the tiering collapses but the discipline does not: the authority should still be stated explicitly (who the single deciding voice is), because the register will outlive the informal arrangement, and a future reader must be able to tell whether a row was decided by the authority or merely written by it.

## Source quality note

All sources in this doc are practitioner and framework-marketing content with low jev weights (0.17 to 0.35), explicitly labeled weak. The doc’s claims about tiered authority and RACI are standard management practice; the sources evidence the vocabulary, and no source here is treated as primary research.
