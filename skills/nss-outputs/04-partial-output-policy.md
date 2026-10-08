# Partial-output policy on failure

**Source doc:** yubi-OS/yubiOS `skills/nss-outputs/SKILL.md` (ground source, fetched 2026-10-06). **Subtopic:** the partial-output policy: forbidden, valid_and_marked, resumable, and the atomic-write implementations each implies.

## Scope

When a run fails partway, the question is what the already-produced output means. The source doc requires the contract to answer explicitly: "Partial output on failure must be stated" (source doc, scripts surface), with exactly three legal values.

## The three policies

- `forbidden`: atomic. On failure, exit non-zero and clean up. The consumer sees the previous full file or a missing file, never a half-written one (source doc, scripts surface and example 1).
- `valid_and_marked`: commit the partial output with a `partial: true` marker so consumers can detect it programmatically (source doc, scripts surface).
- `resumable`: commit the partial output and let subsequent runs continue from it, which requires a durable checkpoint (source doc, scripts surface).

Guideline 2 makes the pairing with the exit channel explicit: "Exit 0 means declared success, nothing partial. A non-zero exit with a partial output on disk is the worst-case contract; pick one of forbidden (atomic via tmp+rename), valid_and_marked (commit with a partial: true marker), or resumable (commit and continue on next run)" (source doc).

The constraint section adds a hard rule in both directions: "No silent partial outputs. If the contract is partial output on failure, it must say so. If the contract is forbidden, the implementation must use atomic writes (tmp + rename)" (source doc).

## Atomic writes: the tmp + rename pattern

The implementation evidence for `forbidden` is the tmp + rename pattern: write to a temporary file in the same directory, then rename over the destination. On POSIX, rename within a filesystem is atomic. The pattern is standard practice; a Stack Overflow answer on atomic overwrite recommends writing "to a temporary file with a randomly generated large id to avoid conflict", then renaming, noting that on POSIX systems the rename is the atomic step (https://stackoverflow.com/questions/30385225/is-there-an-os-independent-way-to-atomically-overwrite-a-file, weight 0.05, weak backing).

A walkthrough of the shell variant describes the failure class it prevents as "rare, nearly impossible to reproduce in testing, and catastrophic in production: a crash or power failure mid-write" (https://www.commandinline.com/shell-script-atomic-file-write/, weight 0.15, weak backing).

The source doc's Python example shows the pattern as a file contract: `./output.json (mode 0640, atomic via tmp + rename)` and `./output.json.tmp (cleaned up on failure; never committed)`, with `partial_output_on_failure: forbidden` (source doc, example 2). The shell example phrases the guarantee as a failure mode: "any non-zero exit leaves no partial $OUTPUT_PATH; atomic rename guarantees the consumer sees the previous full file or a missing file, never a half-written one" (source doc, example 1).

## valid_and_marked in practice

The GitHub Actions example uses this policy: outputs.* fields "reflect the last completed step's state" on failure, which is the committed-partial case, and the workflow's outputs contract tells the consumer the fields are meaningful but possibly incomplete (source doc, example 4). External corroboration: the cli-agent-spec challenge suite requires that a deliberate mid-run failure produce "a response that must contain partial: true, list completed steps, and identify where to resume" (https://github.com/cli-agent-spec/cli-agent-spec/blob/master/challenges/02-critical-execution-and-reliability/13-critical-partial-failure.md, weight 0.46, weak backing; mirrored at https://cli-agent-spec.github.io/challenges/02-critical-execution-and-reliability/13-critical-partial-failure/, weight 0.27, weak backing). A related CLI principles page distinguishes partial failure from total failure in the exit code itself, "exit 2 for partial failure, exit 1 for" total failure (https://agentfirstcli.github.io/principles/partial-failure/, weight 0.24, weak backing). The marker convention is the same idea applied to the record instead of the exit code.

## resumable in practice

`resumable` requires the partial state to be a durable checkpoint that a later run can consume. The Agentic Contract Model runbook describes the operational shape: "Runtime detects failure or external pause signal. Operator inspects ledger entries and selects a checkpoint" before resuming (https://ddse-foundation.github.io/acm/docs/governance/resumable, weight 0.22, weak backing). The source doc's requirement is narrower: name the checkpoint location in the Outputs section, because the verification checklist demands "document the implementation evidence (atomic write, marker convention, checkpoint location)" for whichever policy is chosen (source doc, verification item 5).

## How the policy binds to other channels

The policy is declared per output, and it interacts with the rest of the record:

- With exit codes: `forbidden` pairs with non-zero exits that carry the failure class (doc 02); a success exit code with partial output on disk violates the contract (source doc, red flags).
- With files: the policy determines whether output files survive a failed run, which the file channel records alongside path, mode, and owner (source doc, channel table).
- With verification: a cycle-10 patch must state the policy and its evidence; a section that omits it fails the verdict (source doc, verification item 5).

## Choosing a policy

The decision reduces to what a consumer can safely do with the bytes already written:

1. If downstream consumers must never observe intermediate state, use `forbidden` and implement tmp + rename.
2. If partial results have value and can be detected, use `valid_and_marked` with an explicit `partial: true` marker and a declared marker location.
3. If the operation is long or expensive and retries should be cheap, use `resumable` and declare the checkpoint location and its format.

An undeclared policy is itself the anti-pattern: the red-flag table lists "a script exits 0 after committing partial output" as an observed contract violation, which is only detectable if the declared policy was `forbidden` in the first place (source doc).
