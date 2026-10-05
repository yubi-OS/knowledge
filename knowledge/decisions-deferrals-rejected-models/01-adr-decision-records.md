# Decision records: the minimum viable format for recording an engineering decision

Scope: how engineering teams record a single decision with enough structure (context, decision, consequences, status) that the record stands on its own, covering the Nygard ADR format, MADR, and the fields a record must carry to be usable later.

## The Nygard baseline: 4 to 5 sections

The format that most decision registers descend from is Michael Nygard’s architecture decision record (https://github.com/architecture-decision-record/architecture-decision-record/blob/main/locales/en/templates/decision-record-template-by-michael-nygard/index.md, jev weight 0.90). In each ADR file the template asks for a small set of sections: the status (such as proposed, accepted, rejected, deprecated, superseded), the issue that is motivating the decision or change, the change being proposed or made, and what becomes easier or more difficult because of it (same source). The canonical rendering of that template lists these as Title, Status, Context, Decision, Consequences (https://architecture-decision-record.github.io/templates/decision-record-template-by-michael-nygard/, jev weight 0.84).

That structure is deliberately minimal. Martin Fowler’s definition of the ADR, published 2026-03-24, describes it as a short document that captures and explains a single decision relevant to a product or ecosystem, containing the decision, the context for making it, and significant ramifications, with documents kept to a couple of pages (https://martinfowler.com/bliki/ArchitectureDecisionRecord.html, jev weight 0.94). Microsoft’s well-architected guidance treats the ADR as one of the most important deliverables of a solution architect: the architecture is the accumulation of its decisions, so the ADR is effectively a record of how and why the system came to be its current shape (https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record, jev weight 0.94).

## MADR: structured context and considered options

MADR (Markdown Architectural Decision Records) extends the baseline with explicit sections for decision drivers and considered options. The project describes an Architectural Decision as a software design choice that addresses a functional or non-functional requirement that is architecturally significant, and documents a 2018-04-03 scientific publication on the format and its tool support (https://adr.github.io/madr/, jev weight 0.94). The MADR repository describes it as a lean template for recording architectural decisions in a structured, consistent format using Markdown, capturing context, decision drivers, considered options, and outcomes (https://github.com/adr/madr, jev weight 0.72).

The considered-options section is what makes MADR relevant to registers that must record rejected models: the options are written down with pros and cons before the outcome is chosen, so the rejected options exist in the record by construction rather than being retrofitted.

## What a record must carry

Across the formats, the recurring field set is: a short noun-phrase title, status, context (the forces at play), the decision stated in active voice, and consequences, including negative ones (https://insightful-data-lab.com/2026/02/04/architecture-decisions-rationale/, jev weight 0.32, weak backing). Microsoft’s guidance adds two fields that matter for later re-derivation: recording the options considered, and recording the confidence level of the decision, because an architecturally significant decision is sometimes made with relatively low confidence and documenting that status could prevent over-trusting it later (https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record, jev weight 0.94).

The status field deserves emphasis. Standard status values across templates are proposed, accepted, deprecated, superseded, and rejected (https://joshrotenberg.com/adrs/commands/status.html, jev weight 0.28, weak backing). A rejected status on a proposal is the single-decision version of the rejected-models table in a register: the record survives even though the decision did not.

## Consequences: the part most often cut

Nygard’s consequences section explicitly asks what becomes easier and what becomes more difficult (https://github.com/architecture-decision-record/architecture-decision-record/blob/main/locales/en/templates/decision-record-template-by-michael-nygard/index.md, jev weight 0.90). This is the field that makes a record re-derivable: a decision without its recorded costs cannot be re-evaluated when the context changes, because the reader cannot tell what trade the original author thought they were making.

## Source quality note

The claims in this doc rest primarily on the canonical ADR template repository, the MADR project site and repository, Martin Fowler’s bliki, and Microsoft Learn. Secondary practitioner blog content is labeled weak where used and is only used for status-value enumerations and framing, not for factual claims about the formats themselves.
