# 06. Advisor checks

**Scope:** Advisor checks: detailed analysis grounded in yubi-OS/yubiOS refs/skills-path-unification-2026-10-07.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/skills-path-unification-2026-10-07.md, no external web dig

## Role of the advisor

After all lanes report and before the orchestrator pushes, an advisor performs a full-diff review. The advisor sees the combined change set, not each lane's reasoning, which gives it the fresh-context vantage that catches errors lanes would rationalize. Its checks are the last gate before a single commit lands on main.

## The seven checks

| # | Check | What it catches |
|---|---|---|
| 1 | Rule compliance | Edits that do not follow R1 to R5 as written |
| 2 | No over-edits | Prose changes beyond what a rule requires |
| 3 | YAML still parses (`js-yaml` or python yaml) | Broken frontmatter after edits |
| 4 | No fabricated repo paths | A repointed path that names no real repo artifact |
| 5 | No vendor-doc false positives | Edits inside excluded upstream reference docs |
| 6 | `session/subagent/` preserved | "Fixes" to the sanctioned subagent write form |
| 7 | Banned-phrase hygiene | New text that violates the project's banned-phrase rules |

### Check 1: rule compliance

Each diff hunk should correspond to a REPORT.md row naming a rule, and the new string should match what that rule prescribes. For R1, the replacement id must be the one the rule names. For R2, operative push targets must collapse to `yubi-OS/yubiOS` on main. For R5, a link is either fixed to a shipped `references/<file>.md` or replaced with the exact phrase "(reference checklist not shipped with this skill)".

### Check 2: no over-edits

The boundaries limit edits to path strings and prescribed clause wording. The advisor looks for rewording, reformatting, or "while I was here" cleanups. Dates, SHAs, numbers, and verdicts must be untouched.

### Check 3: YAML parses

Every edited SKILL.md must still have valid frontmatter. Because `name:` and `description:` drive discovery, a parse failure would silently drop a skill from the registry.

### Check 4: no fabricated repo paths

This is the highest-stakes check. R2 and R4 option (a) both repoint citations to repo-truth paths. A lane that guesses a plausible path that does not exist has replaced a dead session path with a dead repo path, which is worse because it looks durable. The spec's rule is explicit: a repointed path must name a real repo artifact or stay annotated.

### Check 5: vendor-doc exclusions

`cloudflare/**`, `sandbox-*/**`, `agents-sdk/**`, `workers-best-practices/**`, `brag/slim.md`, and docker `cache/attestations` must show no edits.

### Check 6: sanctioned form preserved

Any change to a `session/subagent/...` string is a defect by definition.

### Check 7: banned-phrase hygiene

New text introduced by rules (annotations, role wording) must not violate the project's banned-phrase list.

## Enforcement after the advisor: the shipped lint

The spec records that enforcement shipped on 2026-10-07 inside `generate_skill_registry.py`, a local space tool not pushed to the repo per the standing directive. Every registry generation now lints every top-level SKILL.md against four dead-path classes:

| Class | Detects |
|---|---|
| `conn_id` | Any `conn_*` id not on the live allowlist in `lint_allowlist.json`, which is updated alongside connection churn; ids are never hardcoded in the generator |
| `agent_skills_repo` | Any `yubi-OS/agent-skills` reference outside a line carrying a historical or retired marker, with 1-line lookahead for wrapped annotations |
| `personal_dirname` | Hardcoded `skills/personal-*` or `memory/personal-*` dirNames outside historical lines |
| `session_citation` | A concrete `session/<file>` path cited outside a changelog or evidence section, without a runtime-capture marker ("capture to session/", "e.g." placeholders) or the "(session artifact" annotation |

Usage: `generate_skill_registry.py` runs registry plus lint; `--lint-only` skips the registry; `--strict` exits 1 on findings; an optional positional root lints another tree for testing. Findings print to stdout and land in `skill_lint_report.json` next to the registry.

## Validation numbers

The lint was validated on both ends: 52 findings on the pre-fix corpus (the pristine main tarball) and 0 on the post-fix corpus. That pair is the empirical result of the whole effort. It shows the lint detects the classes (non-zero on the broken tree) and that the lanes plus advisor fixed them (zero on the repaired tree).

## Advisor versus lint

The advisor and the lint are complementary. The lint is cheap, mechanical, and permanent, running on every registry regeneration so that new dead paths are caught as they are introduced. The advisor is a one-time, judgment-heavy review that catches what the lint cannot: over-edits, fabricated-but-well-formed repo paths, and prose that changes meaning. R5 is not covered by a lint class, so broken `references/` links remain an advisor-only check.
