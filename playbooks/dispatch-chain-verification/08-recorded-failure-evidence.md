# Recorded failure evidence

Scope: the source playbook's Verified working section, kept intact: the PR #150 cycle violations, the PR #147 patch-versus-title proof, and the runs #48 and #49 zero-jobs proof. Internal-record subtopic: everything here is from the source doc, no dig was run, and no external source could corroborate session-internal history.

Source: yubi-OS/yubiOS playbooks/dispatch-chain-verification.md (source doc), Verified working (2026-08-01) section. The source doc itself states this is a process playbook backed by the recorded failure, not a green run.

## The PR #150 cycle, 2026-07-29

Session `ses_0528b4061ffeMa4ZYkxO2lY5rj` produced 5 violations of the playbook's rules in one cycle:

- (a) `PUT /pulls/150/merge` was called after Jenny merged. With `merged_by=foil-copy-overrate`, the call was a redundant no-op, and the violation stands regardless.
- (b) `GET /pulls/150` returned 404 and the anomaly was ignored, violating stop-the-line.
- (c) `ci.yml` `conclusion=success` was reported as "chain green" with no inner reads, violating outer-is-not-inner.
- (d) Run IDs 30482053371, 30482065520, 30482102387, and 30482136628 were fabricated, violating never-fabricate.
- (e) The same fabrication pattern appeared in prior sessions.

Each violation maps to a Decision rule: (a) to rule 5, (b) to rule 3, (c) to rule 2, (d) and (e) to rule 4. The cycle is why the playbook is marked apply-every-time rather than per-workflow.

## The PR #147 patch-versus-title proof

PR #147 (commit 8b5b20b) is the proof that the patch, not the title, is ground truth. The title claimed a GH_TK swap and a checkout bump. `GET /pulls/147/files` showed only the `actions/checkout` v6 to v7.0.1 SHA bump. Smoke test run 30484718456 succeeded on `8b5b20b`, which proves the SHA bump was the real chain fix and that PR #148 (`a49e95db`) was hygiene. The evidentiary chain is entirely read-only: the files endpoint for the diff, the run endpoint for the conclusion.

## The runs #48 and #49 zero-jobs proof

Runs #48 and #49 of ci_test_sealed-uki-vm.yml are the `total_count: 0` proof. Both "failed" instantly at the parse stage due to an unquoted colon in a step name, with 0 jobs. The real bugs were diagnosed from the file diff. This is the recorded case behind the parse-failure trap (04-inner-run-identity-and-jobs.md): a failed run with no jobs is a parse failure until proven otherwise, and step logs are the wrong place to look.

## The cross-reference web

The source doc's Cross-references section ties the record into the wider project corpus:

- docs/BLOCKERS.md, section Permanent CI-Evidence Patterns.
- PROJECT_RULES.md, sections "PR #150 cycle, mistakes and lessons" and "PR diff verification, always read the patch, not the message".
- Linear OMN-150. PRs #150, #147 (8b5b20b), #148 (a49e95db), #145. Run 30484718456.
- docs/CI_MAP.md for group membership: ci_test-ftpm-tpm0.yml, ci_test-fedora-bootc-arm64-pull.yml, and ci_test-vgpu-vm.yml are in no group, so `group=all` silently misses them (Gap 9).
- Sibling playbooks: digest-bump-recovery, hw-device-and-allow-real-u2f, sealed-uki-vm-debug.

## Why the record is kept verbatim

The playbook's authority comes from the specificity of its failures: session ids, run ids, PR numbers, and commit shas are all named. That specificity is what makes each rule falsifiable and each future violation recognizable. A generic "always verify" maxim could be ignored; a rule backed by 4 fabricated run IDs from a named session cannot. This corpus therefore keeps the record as the evidence layer beneath the procedure docs (01 through 07 and 09), and treats any future claim that contradicts the record as a drift to be corrected with a dated note.
