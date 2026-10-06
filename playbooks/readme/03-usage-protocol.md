# 03. Usage Protocol: the 4-Step How-to-Use Sequence

## Scope

This doc explicates the "How to use" section of the yubiOS playbooks/README.md: the 4 ordered steps an operator follows when a failure mode fires, and the doctrine each step encodes. Grounding spine: the source doc (https://github.com/yubi-OS/yubiOS/blob/main/playbooks/README.md). Dig corroboration is labeled weak throughout.

## The 4 steps (source doc)

1. "Match on failure mode, not workflow name."
2. "Read Context first. If it doesn't describe your situation, stop. File a Linear issue instead."
3. "Run Mechanism verbatim."
4. "Check Verified working. If its evidence predates the code you're touching, re-verify."

## What each step encodes

Step 1 is a routing rule. The index (02-playbook-index.md) is keyed on failure modes with symptom-string, task, and state triggers. Matching on workflow name instead would route a generic CI failure to the wrong playbook, because 5 of the 7 playbooks touch CI-adjacent ground.

Step 2 is a scope gate with an exit path. A playbook's Context section describes when it applies; if the operator's situation does not match, the protocol does not say "adapt it anyway", it says stop and file a Linear issue. That keeps an out-of-scope situation from being driven through a recipe that was never verified for it, and it is the same discipline the coverage boundaries (04-coverage-boundaries.md) protect.

Step 3 is a fidelity rule. Mechanism holds "copy-pasteable commands" (format spec, 05-format-spec.md). Running them verbatim means the operator executes exactly the sequence whose outcome is recorded under Verified working, rather than improvising a variant nobody has verified.

Step 4 is the freshness check. Verified working names the commit/run/PR that proved the playbook. If that evidence predates the code being touched, the proof no longer covers the current code, so the protocol demands re-verification before trusting the result.

## How external practice frames the same steps

The steps map onto runbook doctrine described in the wider literature, with weak backing throughout:

- Trigger conditions stated up front: incident-response runbook guidance says a runbook "should state its trigger conditions, impact radius, and ownership" so responders do not scramble at incident time (https://rootly.com/incident-response/runbooks, jev weight 0.23, weak). The read-when column and step 1 are yubiOS's version of this.
- Verification steps distinguish a guess from a fix: runbook-verification guidance argues a verification step is what separates executed steps from assumed outcomes (https://dawnops.io/blog/verification-steps-for-runbooks/, jev weight 0.17, weak). Step 4 is that principle applied to the playbook's own evidence.
- Documentation drift: operational docs decay when the systems they describe change without re-validation; one writeup defines drift as "the widening gap between what operational documentation says and reality" (https://neubird.ai/glossary/documentation-drift, jev weight 0.09, weak), and stale-docs guidance recommends checking whether documented steps still match the live system before trusting them (https://sync-o.io/blog/stale-documentation-engineering, jev weight 0.11, weak). Step 4's re-verify rule is the yubiOS mechanism against exactly this drift.
- Freshness discipline: incident-runbook guidance suggests including a last-verified date and treating runbooks unverified for a long period as potentially outdated before use (https://web-alert.io/blog/incident-runbook-template-response-guide, jev weight 0.15, weak). The Verified working date plus step 4 operationalize that.

## The protocol as a unit

The 4 steps are ordered so that a wrong match is caught at step 2 before any command runs, and a stale proof is caught at step 4 before any claim is made. Together with the format spec's hard rules (05-format-spec.md), the protocol makes "the playbook worked when last verified" the only claim a playbook is allowed to make.

## Sources

- Source doc: https://github.com/yubi-OS/yubiOS/blob/main/playbooks/README.md
- https://rootly.com/incident-response/runbooks (jev weight 0.23, weak)
- https://dawnops.io/blog/verification-steps-for-runbooks/ (jev weight 0.17, weak)
- https://neubird.ai/glossary/documentation-drift (jev weight 0.09, weak)
- https://sync-o.io/blog/stale-documentation-engineering (jev weight 0.11, weak)
- https://web-alert.io/blog/incident-runbook-template-response-guide (jev weight 0.15, weak)
