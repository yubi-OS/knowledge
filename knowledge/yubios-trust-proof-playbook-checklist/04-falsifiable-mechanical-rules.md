# Falsifiable mechanical rules per checkbox

## Scope

Mapping each checkbox to a falsifiable rule (an exit code, a byte or string match, a log count) so the trust decision is mechanically decidable, not subjective.

## The rule: the command decides, not the operator

A checkbox is only as good as its decision procedure. The yubiOS trust-proof artifact's final section assigns each checkbox a rule that is a single shell command the operator pastes into the host terminal, with an explicit pass value and an explicit fail value. "The operator doesn't decide the box; the rule decides" (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source).

The rule table:

| Box | Rule | Pass | Fail |
|---|---|---|---|
| Digest recorded | echo "$DIGEST" piped to wc -c | 71 (sha256: + 64 hex) | other length |
| Source ref recorded | git rev-parse HEAD matches recorded 40-char SHA | byte-exact match | diff |
| PINNED.md reviewed | grep -c of pinned digest lines | >= 1 per pinned target | 0 |
| Signed UKI verified | sbverify --list on the live UKI | exit 0 | exit != 0 |
| Root immutable | findmnt options match ro,composefs | match | no match |
| Enrollment log reviewed | journalctl -u yubiOS-enroll.service grep -c 'enrollment success' | >= 4 (PIV, FIDO2, SSH, PAM) | < 4 |
| Recovery documented | ls -la on the enroll-backup script | exists + executable | missing |
| Platform story reviewed | file existence test on the platform-clarity doc | exists | missing |
| Wrong image fails closed | bootc install of a deadbeef digest on disposable hardware | boot refused | boot succeeds |

The operator rule that closes the table: the worksheet is PASS only when all 9 rule rows report PASS (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source).

## Why exit codes carry the trust decision

Exit codes are the one signal every Unix tool already produces. 0 means success and nonzero means failure, and scripts "customize the return code to the caller" (source: https://www.redhat.com/en/blog/linux-shell-command-exit-codes, weight 0.643, authoritative backing). Building the checklist on exit codes means each rule is a command whose success state is observable without interpretation, and the whole sheet can be re-run by anyone, including a script.

Length and count rules do the same work for non-exit-code evidence. The 71-character rule for a digest line (the literal prefix sha256: plus 64 hex characters) is a byte-level check that catches truncated or hand-typed digests. The enrollment count of at least 4 success lines is a log-level check that catches partial enrollment. Both fail closed: an ambiguous observation counts as fail, never as pass.

## The gate discipline

The falsifiable-verification pattern generalizes: a behavioral verification step that runs arbitrary code as part of a gate is not promoted automatically; it carries a human-approved timestamp, and the pipeline "refuses to compile" the verification until that field is set (source: https://edikt.dev/guides/falsifiable-verification, weight 0.310, weak backing). The same discipline appears in agent-development practice: verification matrices that "must provide terminal execution proof" before a task is declared done (source: https://gist.github.com/swegner/1b20f99e44ced0a5d33fee66571e6707, weight 0.140, weak backing).

The transferable rule set for any trust checklist:

1. Every box maps to exactly one command.
2. The pass condition is a specific value (a count, a length, exit 0), not a vibe.
3. Ambiguity fails.
4. A conjunction rule closes the sheet: all rules pass or the sheet fails.
5. The most dangerous box (does tampering actually fail?) is a destructive test on disposable hardware, never an inference from configuration.
