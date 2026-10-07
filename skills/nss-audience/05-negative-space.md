# Negative-space findings: what is missing matters more than what is present

**Scope:** the Audience axis counts missing files as half the work: the other half is finding partial cells where a page exists but the job still fails, such as missing prerequisites, missing exit codes, and missing rollback sections.

## The two halves of the audit

Guideline 6 of the skill says flag negative space, not just missing files (source doc: yubi-OS/yubiOS skills/nss-audience/SKILL.md). Counting missing files is half the work; the other half is asking, for each role and job, what failure mode the corpus does not yet support. The source doc's example 4 table pairs each observation with the audience gap it implies:

- `docs/RECOVERY.md` does not exist while operator and incident_responder both need it: a missing recovery arrival path for 2 high-risk roles.
- `tests/vm/test-luks-fido2.sh` lists no exit codes in its header: CI/automation cannot rely on a documented contract.
- `docs/ARCHITECTURE.md` opens with a tutorial heading: a mode mismatch, since architects need explanation.
- `README.md` mentions "for end users" but never links to UI or install docs: the end_user/evaluate cell is partial at best.
- `docs/DEPLOY.md` has no rollback section: the operator/recover cell is a gap even though deploy is served.

That last row is the sharpest lesson: a deploy page that exists can still leave the recover job uncovered. Coverage is "does the reader reach a complete, current path?", not "are there N files?" (source doc).

## Why runbooks carry the prerequisites requirement

The negative-space patterns concentrate in operational documents, and operational practice backs the skill's requirement that a runbook page carries prerequisites, expected results, and failure paths. AWS Incident Detection and Response builds runbooks for managing incidents from information captured during workload onboarding (https://docs.aws.amazon.com/IDR/latest/userguide/idr-workloads-dev-runbook.html, weight 0.60). The Linux kernel's admin-guide documentation enumerates kernel parameters so an administrator does not have to guess at boot configuration (https://www.kernel.org/doc/Documentation/admin-guide/kernel-parameters.txt, weight 0.55), which is the same completeness instinct: the reader's context must be in the file, not in the reader's head.

Practitioner guidance is concrete about the section structure that makes a runbook complete: each step should include the trigger, expected result, validation, and a safe way to stop or roll back (https://rootly.com/incident-response/runbooks, weight 0.11, weak). Runbook templates list trigger, scope and environment, prerequisites, role and authorization boundaries, and ordered safe actions (https://playcode.io/blog/runbook-template, weight 0.10, weak), and being explicit about when not to use a runbook prevents engineers from following the wrong procedure (https://oneuptime.com/blog/post/2026-01-26-effective-runbooks-guide/view, weight 0.10, weak). A runbook is a structured set of predefined steps for handling specific incidents or scenarios (https://betterstack.com/docs/uptime/runbooks/, weight 0.45, weak). Against that standard, an operator page that names the role but omits prerequisites or escalation lands at `partial`, exactly as the skill scores it (source doc).

## Missing exit codes: the machine-reader negative space

The `tests/vm/test-luks-fido2.sh` finding is not cosmetic. CI/automation files are read by machines, and a machine reader cannot recover from an undocumented exit contract. This is the same reason the checklist requires CI/automation cells to be scored explicitly (source doc). When an operator page omits a rollback section or a test script omits exit codes, the gap is invisible to a human skim, which is why the sweep looks for it structurally rather than editorially.

## Negative space and priority

Because cell priority is importance x task-risk x evidence-of-demand x (1 - coverage), a missing recovery path for operator and incident_responder outranks almost anything else: 2 high-risk roles, high task risk, and full missingness multiply together (source doc). The end_user/evaluate partial from the README example is real but lower priority, and the skill says so explicitly: an operator/recover gap is higher priority than an end_user/evaluate gap even when both files are missing (source doc).

## From finding to action

Negative-space findings feed the action taxonomy carried by the parent negative-skill-space skill: gaps flagged as Extend become audience patches (doc 04) when a file can absorb an `## Audience` block plus prerequisites and a rollback section, or new files when the arrival path simply does not exist. The sweep's output is a list, not a verdict: each finding names the role, the job, the specific missing piece, and the cell it degrades from `served` to `partial` or `gap`.
