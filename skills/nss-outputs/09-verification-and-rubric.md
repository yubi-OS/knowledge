# Anti-patterns, red flags, and verification of an Outputs patch

**Source doc:** yubi-OS/yubiOS `skills/nss-outputs/SKILL.md` (ground source, fetched 2026-10-06). **Subtopic:** how a cycle-10 Outputs patch is judged: the anti-pattern list, the red-flag table, and the 9-point verification checklist. This is an internal-record subtopic: the rubric lives entirely in the source doc, so no web dig was run, and all claims here are attributed to it.

## Scope

The Outputs skill is the closure skill for the outputs axis of the NSS 12-axis sweep: "NSS proposes the gap, nss-outputs closes it" (source doc, Composition table). The closure artifact is ONE `## Outputs` section per file, and the verdict on that closure is decided by the checklist below. "One section, one file, one cycle" (source doc, guideline 11).

## The anti-patterns

The source doc lists 10 anti-patterns (source doc):

1. Outputs without a channel: "the script writes X" without naming stdout, stderr, exit code, file, or side effect. Worse than no section, because it pretends to be a declaration.
2. Mixed stdout/stderr: result on stderr and diagnostics on stdout, unusable from `cmd >file 2>&1`.
3. Exit 0 with partial output: a non-atomic write that exits 0 after committing a half-written file is the worst-case contract. Use tmp + rename and declare `partial_output_on_failure: forbidden`.
4. Generic exit 1 for every failure: the consumer cannot route validation errors, transient failures, and internal defects to different recovery paths.
5. Logs spanning multiple lines: invalid JSONL; one JSON value per line with escaped newlines is the only framing streaming consumers survive.
6. Interpolation of secrets into log messages: a secret-leak audit finding; declare `redaction: secrets_and_sensitive_values_removed` and use a redaction library at the producer.
7. Idempotency claims without proof: state the effect boundary (file, record, deployment); if not idempotent, declare `not_supported` and why a duplicate would be unsafe.
8. Determinism claims without canonicalization: state the procedure (key sort, locale, line endings, hash over canonical bytes); verify with two clean builds.
9. `--check` is not `--dry-run`: a check validates drift without constructing an execution plan; a dry-run previews side effects. State which is which.
10. An Outputs section that does not name the file's own outputs: a patch that adds `## Outputs` to a Containerfile without listing the image label, the digest, and the exit codes is a placeholder and counts as a NO verdict.

## The red-flag table

The source doc's table pairs observations with meanings (source doc):

| Observation | Meaning |
|---|---|
| `## Outputs` lists zero concrete channels | the section is a placeholder |
| Script exits 0 after committing partial output | policy is forbidden but the implementation violates it |
| Same exit code for validation and transient failures | sysexits.h not used; consumer cannot route |
| Pretty-printed log lines spanning multiple lines | invalid JSONL; streaming consumers break |
| A log message contains a secret value | redaction policy missing or violated |
| Two runs produce different bytes | determinism claim is hand-waving |
| HTTP API claims "idempotent" without an Idempotency-Key header | the claim is wrong for non-PUT/DELETE methods |
| A reusable workflow's `outputs:` field is empty when consumers depend on it | the contract is implicit |
| An Outputs patch lands but the next NSS sweep still flags outputs as the top gap | the patch did not close the gap |
| The Outputs section is identical across 100+ files | templated, not inspected; likely wrong for at least one |

The last two rows are process-level: they catch patches that went through the motions and templated sections that never actually inspected the file.

## The verification checklist

For each cycle-10 patch that closes an NSS-outputs gap, the source doc requires all 9 checks (source doc):

1. The patch adds ONE `## Outputs` section, in file-type-aware comment syntax (`# Outputs` for Containerfile/Makefile, Python docstring for `.py`, `#` comments for shell, `<!-- Outputs -->` for markdown, `<!-- Outputs (workflow_call outputs:) -->` for Actions YAML).
2. The section names at least one concrete channel with `on_success`, `on_failure`, `idempotency`, and `determinism`. Zero concrete channels is a NO verdict.
3. Exit codes follow sysexits.h vocabulary, or document the deviation explicitly. Generic exit 1 for everything is a NO verdict.
4. stdout/stderr ownership is stated; "stdout = result; stderr = logs" is the default and deviations are documented.
5. Partial-output policy is stated as `forbidden`, `valid_and_marked`, or `resumable`, with implementation evidence (atomic write, marker convention, checkpoint location).
6. Idempotency is stated as `inherently_idempotent`, `key_required`, or `not_supported`, with the effect boundary named.
7. Determinism is stated as `logical`, `byte_identical`, or `reproducible_build`, with the canonicalization procedure named for any non-logical claim.
8. Side effects are listed: every network call, file write, state mutation, and process spawn.
9. The next NSS sweep on the same file does NOT re-flag outputs as the top Extend gap. If it does, the patch did not close the gap and the cycle-10 lens is a NO verdict.

## How the checklist is used

The checklist is pass/fail per patch, and item 9 makes it closed-loop: the closure is verified by the same instrument that detected the gap, on the next sweep. When the same gap keeps reappearing after a cycle-10 patch, the source doc's Composition table routes to `recursive-self-improvement`: "RSI's self-mode should re-isolate the editor before the next attempt, same-author bias on Outputs sections is the most common cycle-10 failure mode" (source doc).

## Constraint-level gotchas

- Do not stack multiple `## Outputs` blocks in one file, and do not nest Outputs inside another section heading (source doc, Constraints).
- Channel names are fixed: exit, stdout, stderr, log, file, side-effect, response. Novel channels need a new skill, not a new channel name (source doc, Constraints).
- The section is for humans first, before any parser; clarity beats strict YAML (source doc, Constraints).
- No silent partial outputs: the contract must say the policy, and `forbidden` must be implemented with atomic writes (source doc, Constraints).
- Pre-register the output surface before implementing the producer: schema-first (source doc, guideline 12).

## Common failure shapes when reviewing a patch

The anti-pattern list, red-flag table, and checklist converge on a short set of failure shapes a reviewer should look for first: a placeholder section with no channels, an undeclared or violated partial-output policy, an undifferentiated exit 1, a determinism or idempotency claim with no stated boundary or procedure, and templated sections that are identical across many files. Each maps to a specific checklist item, so a reviewer can cite the item number rather than arguing taste.
