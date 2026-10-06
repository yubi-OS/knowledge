# Doctrine, related records, and the unbuilt CI gate

Scope: how the lex-sort rule is recorded in yubiOS doctrine after OMN-149, the Linear items and commits that anchor it, the tests that caught the failure, and the proactive CI gate that remains unbuilt. Internal-record subtopic, no dig; every claim in this doc comes from the source doc.

## Doctrine placement

The rule is codified in `docs/BLOCKERS.md` under Permanent CI-Evidence Patterns as "Systemd drop-in lex-sort rule (est. 2026-07-30, source: OMN-149)" (source doc: yubi-OS/yubiOS playbooks/drop-in-override-naming.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/playbooks/drop-in-override-naming.md). The playbook is the recipe; the BLOCKERS.md entry is the doctrine. The playbook's Cross-references section states this pairing explicitly: "See also: docs/BLOCKERS.md, Permanent CI-Evidence Patterns, Systemd drop-in lex-sort rule (doctrine; this playbook is the recipe)" (source doc).

The codification happened the same day as the fix: the playbook's Verified working section records that on 2026-07-30 the rename fix landed and the rule was written into BLOCKERS.md (source doc).

## The incident record in dates and commits

The playbook pins the incident to specific commits (source doc):

- Broken ship: commit `59f4332` on 2026-07-26 added `usr/lib/tmpfiles.d/53-yubiOS-no-static-vfio.conf`. `/dev/vfio` stayed present in every guest for 4 days.
- Fix: commit `f92c6010` on 2026-07-30 renamed the file to `vfio-yubiOS-no-static-vfio.conf`, moving the first byte from `'5'` (0x35) to `'v'` (0x76) so the file lex-sorts after upstream's `static-nodes-permissions.conf` (`'s'` = 0x73).
- Codified: 2026-07-30, same day, in `docs/BLOCKERS.md`.

The failing signal was not a diff review but a CI test: the `ci_test-vgpu-vm.yml` arm64 step 21 (`tests/vm/test-vgpu-virtio-ci.sh`) failed with `FAIL: /dev/vfio exists in a default yubiOS guest; rule 1 says images ship virtio-gpu only` (source doc).

## Linear and test cross-references

The playbook's cross-references name the related Linear items OMN-149, OMN-141, and OMN-146, and 2 test scripts: `tests/vm/test-vgpu-virtio-ci.sh` and `tests/vm/test-vfio-user-host-ci.sh` (source doc). It also cross-references the sibling playbook `playbooks/dispatch-chain-verification.md`, noting the same incident is why "the test says FAIL" outranks "the file is shipped": shipping a file is not evidence the change took effect, and the CI test result is the evidence that counts (source doc).

## The unbuilt CI gate

A proactive CI gate for the lex-sort rule is unbuilt; the playbook records it as Gap 8 in `refs/testing-production-gaps-2026-08-01.md` (source doc). Until that gate exists, enforcement is the human author-time discipline the playbook prescribes: run the 4-step verification recipe before shipping any new or renamed drop-in (source doc). The gap doc reference means the automation backlog itself is tracked in the testing-production-gaps reference, so anyone picking up the gap should start there.

## Why the record matters

The doctrine trail (incident, commit, codification, test, gap) is the difference between a rule that lives in one person's memory and one that survives team turnover and base-image churn. The playbook is deliberately the executable form: the doctrine entry states the rule, the playbook gives the recipe that makes the rule checkable, and the gap record states what automation is still missing.
