# 08: NSS composition and the cycle-14 verification checklist

Scope: how nss-failure-modes pairs with the other NSS axes and specialist skills, and the 8-point checklist that decides whether a cycle-14 patch actually closed the gap.

Grounding: internal-record subtopic, no dig. Both the composition table and the verification checklist are defined in the source doc (yubi-OS/yubiOS skills/nss-failure-modes/SKILL.md).

## Where the axis sits in the 12-axis sweep

nss-failure-modes is the Failure-modes-axis specialist (axis 7 of 12). It is deliberately self-contained: it does not depend on negative-skill-space being loaded, and composes with NSS as a follow-up action. NSS proposes the gap; nss-failure-modes closes it [source doc, Constraints]. The parent NSS skill orchestrates the 12-axis sweep and the action taxonomy (Extend / Pair / Accept) [source doc, Composition].

## Composition with the neighboring axes

| Skill | How it composes | Direction |
|---|---|---|
| nss-inputs | Inputs declares what the caller supplies; Failure modes declares what can happen to those inputs (parse failure, missing input, wrong-version input) | nss-inputs -> nss-failure-modes |
| nss-outputs | Outputs declares exit codes, log records, files, side effects; Failure modes declares what those outputs look like when the operation fails | nss-outputs -> nss-failure-modes |
| nss-audience | CI cares about exit codes and structured logs; operators care about recovery commands and runbooks; incident responders care about blameless tone and tracked actions | nss-audience -> nss-failure-modes |
| nss-mode | Mode declares how the file is invoked (TTY vs non-TTY, dry-run vs apply); Failure modes declares what fails under each mode | nss-mode -> nss-failure-modes |

[source doc, Composition table]

The audience row is the one that changes the output: the same failure mode is documented differently for a CI consumer (exit code plus structured log) than for an operator (recovery commands plus runbook).

## Composition with the specialist skills

| Skill | How it composes |
|---|---|
| curve-compass-skill | Lens-format patches in cycle 14 use nss-failure-modes as the failure-modes-axis lens payload (hypothesis, method, parameters, delta, verdict, score, caveat) |
| curved-corpus-create | The lens corpus's failure_modes column maps to the 14-channel taxonomy |
| debugging-and-error-recovery | The recovery column consumes that skill's runbook conventions |
| observability-and-instrumentation | The detection column is the producer of the log, metric, and alert primitives |
| security-and-hardening | The security row (TOCTOU, secret leakage, privilege escalation) is flagged here but fixed there |
| audit-evidence-packaging | Blameless tone and evidence-cite-every-claim are shared with audit trails |
| recursive-self-improvement | If the same gap reappears after a cycle-14 patch, RSI self-mode re-isolates the editor; same-author bias is the most common cycle-14 failure mode |

[source doc, Composition table]

## The 8-point verification checklist

For each cycle-14 patch that closes an NSS-failure-modes gap, the source doc requires:

1. The patch adds ONE file-type-aware Failure modes section (markdown section, Python docstring block, shell comment block, Containerfile comment block, or HTML comment).
2. The section names at least one concrete row in the failure-mode table; a placeholder section with zero concrete rows counts as a NO verdict.
3. Each row pairs severity with probability; a single-sided row counts as PARTIAL at best.
4. Each row has a detection signal: a log line, metric, exit code, errno, exception, or invariant. The error will be visible is not a detection signal.
5. Each row has a recovery path with concrete commands, preconditions, and a stop or escalate condition; contact support is escalation, not recovery.
6. Each High or Critical row has a test entry; otherwise evidence_gap: untested is declared explicitly.
7. TOCTOU is flagged and atomic primitives are named; checks-then-opens without one is CWE-367 at CRITICAL severity and not_handled.
8. The next NSS sweep on the same file does NOT re-flag failure modes as the top Extend gap; if it does, the patch did not close the gap and the lens verdict is NO.

[source doc, Verification]

## The one-section-per-file constraint

The patch contract is one section, one file, one cycle: do not stack multiple Failure modes sections in one file, do not nest failure modes inside another section heading, and use the file-type-aware comment syntax for non-markdown files [source doc, Constraints]. A patch that adds a section but does not name the file's own concrete failure modes is a placeholder and counts as NO [source doc, Anti-patterns]; and if the identical section appears across 100 or more files, the red-flag table reads it as templated rather than inspected, and likely wrong for at least one of them [source doc, Red flags].
