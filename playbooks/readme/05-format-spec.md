# 05. Format Spec: the Five Required Sections and the Hard Rules

## Scope

This doc explicates the "Format spec" section of the yubiOS playbooks/README.md: the required section skeleton, the optional sections, the filename convention, and the 2 hard rules that gate what may be cited. Grounding spine: the source doc (https://github.com/yubi-OS/yubiOS/blob/main/playbooks/README.md). Dig corroboration is labeled weak.

## The required skeleton

The source doc specifies a fixed 5-section skeleton with a date in the title:

```text
# <Title> (<date>)
## Context                     when this applies
## Decision                    the chosen approach
## Mechanism                   copy-pasteable commands
## Verified working (<date>)   the commit / run / PR that proved it
## Cross-references            Linear, commits, PRs, refs/, other playbooks
```

Each section has a distinct job:

- Context: "when this applies". This is the section the usage protocol reads first (03-usage-protocol.md, step 2). If it does not describe the operator's situation, the playbook is not used.
- Decision: "the chosen approach". One approach, recorded; rationale belongs in `docs/ADR.md` (04-coverage-boundaries.md).
- Mechanism: "copy-pasteable commands". Executed verbatim (03-usage-protocol.md, step 3). Runbook-template guidance outside yubiOS reaches the same conclusion, that procedure lines should be executable steps with expected results rather than explanatory prose (https://checkflow.io/blog/it-runbook-template, jev weight 0.14, weak).
- Verified working: "the commit / run / PR that proved it", dated. Runbook templates in general practice include a purpose-plus-verification block; yubiOS makes the proof a hard requirement (see hard rules below).
- Cross-references: "Linear, commits, PRs, refs/, other playbooks". This is what lets playbooks compose as a body rather than isolated files.

## Optional sections

The source doc allows 3 sections "where they earn it": `Alternatives Considered`, `Tradeoffs`, `Operational`. Optional means opt-in per playbook, not omitted globally; a playbook earns them only when the comparison or the operational notes change how the Mechanism should be run.

## Filename convention

Filenames are `lowercase-hyphenated.md` with **no date suffix**, "unlike `refs/`", because "playbooks are revised in place". The dated artifact in the format spec is the title and the Verified working date, not the filename. This is the mechanism that keeps the index (02-playbook-index.md) stable: a playbook keeps its name and its index row as it is revised.

## The 2 hard rules

1. "never cite a run ID, SHA, or PR you have not fetched this session". Citation in a playbook is a claim of inspection, not a citation of memory. This is the citation-side face of the verify-before-claim doctrine.
2. "Every playbook must name >= 1 commit/run/PR under `Verified working`. If you can't, it's research, put it in `refs/`." The rule gives the refs/ vs playbooks/ split (01-purpose-and-scope.md) an operational test: no verifiable proof means the document is research, whatever it looks like.

## How the spec compares to external runbook templates

The dig surfaced general-purpose runbook templates with overlapping section sets: purpose, access, pre-checks, procedure, verification, rollback, contacts (https://www.docsie.io/solutions/templates/process/operational-runbook/, jev weight 0.10, weak), and guidance to include task context and desired outcome alongside steps (https://firehydrant.com/blog/runbook-template-devops/, jev weight 0.20, weak). The yubiOS spec is narrower and evidence-centric: it drops access/pre-check/rollback boilerplate and keeps exactly the sections needed to match a failure mode, run a proven mechanism, and cite the proof. Docs-as-code practice, writing docs with the same tools and review workflows as code (https://www.writethedocs.org/guide/docs-as-code.html, jev weight 0.29, weak), matches how the spec lives in-repo and gets revised by PR.

## Sources

- Source doc: https://github.com/yubi-OS/yubiOS/blob/main/playbooks/README.md
- https://checkflow.io/blog/it-runbook-template (jev weight 0.14, weak)
- https://www.docsie.io/solutions/templates/process/operational-runbook/ (jev weight 0.10, weak)
- https://firehydrant.com/blog/runbook-template-devops/ (jev weight 0.20, weak)
- https://www.writethedocs.org/guide/docs-as-code.html (jev weight 0.29, weak)
