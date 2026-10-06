# 06. Relationship to BLOCKERS.md, Maintenance, and Escalation

## Scope

This doc explicates the last 3 sections of the yubiOS playbooks/README.md ("Relationship to BLOCKERS.md", "Maintenance", and the "Not here?" escalation paragraph): how playbooks compose with the failure-mode register, who maintains the collection, and what an agent does when no playbook covers the situation. Grounding spine: the source doc (https://github.com/yubi-OS/yubiOS/blob/main/playbooks/README.md). Dig corroboration is labeled weak.

## The register relationship

The source doc states: "`docs/BLOCKERS.md` > **Permanent CI-Evidence Patterns** is the authoritative register of recurring failure modes. Playbooks operationalize its entries; they do not replace them."

The division of labor:

- BLOCKERS.md holds the doctrine. It is the register: which failure modes are permanent patterns and what the standing rule is for each.
- playbooks/ holds the recipe. The worked example the source doc gives: "BLOCKERS.md holds the lex-sort doctrine, drop-in-override-naming holds the recipe." One entry in the register, one executable playbook.

The propagation rule is bidirectional and same-PR: "When a playbook uncovers a new permanent pattern, add it to BLOCKERS.md **and** cross-link both ways in the same PR." Neither half may be updated alone. This is what makes the playbooks compose as a body: the Cross-references section (05-format-spec.md) carries Linear items, commits, PRs, refs/ docs, and other playbooks, and the register link is one of its permanent edges.

## Maintenance workflow

The source doc's maintenance rules:

1. Jenny adds to `playbooks/` as new failure modes emerge.
2. "a mode qualifies once it has fired twice." The same >= 2 threshold that defines coverage (04-coverage-boundaries.md) is the admission gate.
3. "Agents draft; **Jenny merges**." Drafting is agent work; the merge decision stays human. This mirrors docs-as-code review practice, where documentation changes ride the same review-and-merge workflow as code (https://www.writethedocs.org/guide/docs-as-code.html, jev weight 0.29, weak).

The maintenance model keeps the collection small by construction: only twice-fired failure modes get in, and playbooks are revised in place rather than accumulating dated copies (05-format-spec.md).

## The not-here escalation path

The source doc: "**Not here?** Don't improvise a playbook mid-incident. Fix the incident, then file `playbook: <failure mode>` on team OMNI-AGENT with the run ID and root cause."

Three commitments in one sentence:

1. No mid-incident authorship. The usage protocol (03-usage-protocol.md) already stops you at step 2 if Context does not match; the escalation path extends that: do not paper over the gap by writing a new playbook under pressure.
2. Fix first, document second. Incident resolution takes priority over knowledge capture.
3. File with evidence. The ticket carries the run ID and root cause, which are exactly the inputs the format spec's hard rules (05-format-spec.md) will demand of the eventual playbook.

External runbook practice reaches the same shape: living-runbook guidance argues static runbooks fail under pressure and that incident knowledge should be captured into structured, queryable knowledge after the event (https://aiopscommunity.com/living-runbooks-structuring-incident-knowledge-for-aiops/, jev weight 0.17, weak), and escalation-aware runbook examples define explicit paths and roles for who handles what when the normal path does not cover it (https://www.well-architected-guide.com/documents/runbook-example-incident-management-with-escalation-paths/, jev weight 0.17, weak). Version-controlled runbook repos in the wild also structure runbooks as per-failure-mode markdown files with escalation entries (https://github.com/MHarper3/it-operations-runbooks/blob/main/operations/incident-escalation.md, jev weight 0.27, weak).

## Known uncovered ground

The source doc closes by pointing at `refs/testing-production-gaps-2026-08-01.md` as the record of known uncovered ground, keeping the gap list itself in refs/ rather than in the playbook directory.

## Sources

- Source doc: https://github.com/yubi-OS/yubiOS/blob/main/playbooks/README.md
- https://www.writethedocs.org/guide/docs-as-code.html (jev weight 0.29, weak)
- https://aiopscommunity.com/living-runbooks-structuring-incident-knowledge-for-aiops/ (jev weight 0.17, weak)
- https://www.well-architected-guide.com/documents/runbook-example-incident-management-with-escalation-paths/ (jev weight 0.17, weak)
- https://github.com/MHarper3/it-operations-runbooks/blob/main/operations/incident-escalation.md (jev weight 0.27, weak)
