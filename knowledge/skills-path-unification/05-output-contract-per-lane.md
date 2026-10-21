# 05. Output contract (per lane)

**Scope:** Output contract (per lane): detailed analysis grounded in yubi-OS/yubiOS refs/skills-path-unification-2026-10-07.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/skills-path-unification-2026-10-07.md, no external web dig

## The contract

Each lane must produce the same three things, in the same shape:

1. **A working copy.** Copy the assigned skill dirs into `session/subagent/<lane-id>/skills/` and edit there. The spec notes the reason: a sandbox write restriction. Subagents can write only under `session/subagent/`, so they cannot edit the live skill tree directly.
2. **A report.** Write `session/subagent/<lane-id>/REPORT.md` listing, per file, each hit with its line, old string, new string, rule applied (R1 to R5), and decision (a, b, or c).
3. **No side effects.** Do NOT push. Do NOT touch other lanes' files.

## Why each element exists

### Working copies under session/subagent

This is the sanctioned use of session paths from the canonical vocabulary: subagent write paths. It doubles as isolation. Each lane's edits live in its own directory, so the orchestrator can diff each lane's copy against main independently and reject one lane without discarding others. It also guarantees that a lane failing midway leaves the live tree untouched.

### The per-hit report schema

| Field | Purpose |
|---|---|
| file | Locates the change within the lane's assignment |
| line | Lets the advisor jump straight to the hit |
| old string | Proves what was there; enables reversal |
| new string | Shows exactly what changed |
| rule | Ties the change to R1 to R5, so any change without a rule is an over-edit |
| decision (a/b/c) | Records the R4 branch taken: repoint, runtime-capture rewrite, or annotate |

The rule column is the key control. Under the boundaries, every edit must be required by a rule. A report row with no rule, or a diff hunk with no report row, is by definition outside scope. The decision column makes R4 judgments auditable: a reviewer can check that every "(a) repoint" names a real repo artifact, which is the advisor's "no fabricated repo paths" check.

### No push, no cross-lane edits

Pushing is reserved for the orchestrator, which ships all changed files plus the spec to `yubi-OS/yubiOS@main` via the Git Data API as a single commit. Lanes pushing independently would create five commits, possible conflicts, and partial states where some lanes have landed and others have not. A single commit means the corpus moves from pre-fix to post-fix atomically.

## How the orchestrator consumes the outputs

The ship-and-sync sequence in the spec runs after all lanes report:

1. Collect each lane's working copy and REPORT.md.
2. Run the advisor review over the full diff (doc 06).
3. Push changed files plus the spec to `yubi-OS/yubiOS@main` via the Git Data API in one commit.
4. Sync the `skills/github-yubios-KS9n5GAT/` local copies from main.
5. Regenerate `skill_registry.json`.

Step 5 is where enforcement runs: registry generation also executes the path lint.

## Contract and the enforcement result

The spec records the outcome of the enforcement lint shipped 2026-10-07: 52 findings on the pre-fix corpus (the pristine main tarball) and 0 on the post-fix corpus. That number is the external check on the lane contract. If any lane had left a hit unfixed, or if the merged result had reintroduced a dead path, the post-fix lint would be non-zero. The contract (per-hit reports) and the lint (class-based detection) are independent instruments that agree.

## Failure handling implied by the contract

The contract structure makes common failure modes recoverable:

- **A lane over-edits.** The advisor finds diff hunks without report rows; the orchestrator rejects those hunks or the lane.
- **A lane fabricates a repo path.** The decision column flags it as (a); the advisor verifies the artifact exists and reverts to (c) annotation if not.
- **A lane breaks YAML.** The parse check fails on that lane's copy; nothing has been pushed, so main is unaffected.
- **A lane crashes.** Its working copy is incomplete but isolated; the orchestrator can rerun that lane alone.

## Relationship to the corpus mint convention

This corpus itself was minted under the same pattern: lanes write markdown into `session/subagent/...`, return their output, and an orchestrator owns all repository writes. The skills path-unification spec is one of the documents that established that division of labor for skill edits.
