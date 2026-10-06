# The operator playbook structure

## Scope

The 14-section operator playbook shape: purpose, scope, success criteria, then per-axis Goal/Checks/Pass-if/Fail-if blocks.

## Fixed section order

The yubiOS trust-proof playbook opens with three framing sections before any check appears:

- Purpose: one sentence, "prove, end to end, that the system you boot is the system you intended to trust" (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source).
- Scope: an explicit list of what the playbook checks, mirroring the 10 axes.
- Success criteria: a short list of what must be independently verified to pass: the exact image source and digest, the signed boot chain, the enrolled secrets and functions, a tested recovery path, and safe failure when trust is broken.

Only then do the numbered sections begin, one per axis, each with a fixed four-part block:

- Goal: what the section proves.
- Checks: the concrete actions, in order.
- Pass if: the binary condition.
- Fail if: the condition that fails the section.

This structure turns judgment into procedure. Runbook practice makes the same argument: runbooks "create structure under pressure, turning confusion into clear, repeatable" steps (source: https://rootly.com/incident-response/runbooks, weight 0.510, authoritative backing). A control-validation runbook template published as twelve sections including design intent, scenario, pass criteria, evidence, disposition, cadence, and governance follows the identical decomposition (source: https://secportal.io/tools/security-control-validation-runbook-template, weight 0.230, weak backing).

## The prep section carries the worksheet inputs

Section 1 of the yubiOS playbook is Prep, and it defines what must be recorded before any check runs: date, machine model, architecture (x86-64 or arm64), expected image digest, expected source ref or commit, expected attestation reference, YubiKey serial, and recovery method (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source). Recording expectations before testing is what makes later comparison possible: the pin check (axis 2) compares the running digest to the one recorded in prep, not to memory.

The playbook also constrains its own audience: it is for a human operator on disposable hardware, explicitly not for CI, because CI already runs the equivalent gates (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source). Stating who the artifact is for prevents the two failure modes of dual-purpose documents: checklists too vague for a human, too slow for a machine.

## Pass and fail sections close the loop

Section 13 is a pass/fail sheet with two explicit lists. Pass: image digest verified, source ref verified, attestation verified, pin matches, Secure Boot verified, signed UKI verified, root integrity verified, key ownership verified, enrollment audited, recovery tested, rollback tested, platform differences understood, failures handled safely. Fail: any unknown image, any unverified boot artifact, any hidden enrollment, any undocumented recovery, any silent trust drift (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source).

Section 14 is the final decision rule, expressed as one question that must be answerable with evidence: "What exact image booted, what signed it, what keys were enrolled, where are those keys held, and how do I recover if they disappear?" If any one answer is missing, the playbook says, do not trust it yet (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source). The closing rule restates the success criteria as a single interrogative, which is what an auditor quotes back.

## Verification playbook pattern

The same shape appears in verification-playbook material outside OS security: a personal verification playbook template that asks for name and role, a fixed set of checks, and one escalation rule written down before use (source: https://gennoor.com/ai-academy/evaluating-ai-output/chapter-07-playbook, weight 0.620, authoritative backing). The transferable idea is that the playbook is filled in, not just read: fields for context, checkboxes for execution, and an explicit decision at the end.
