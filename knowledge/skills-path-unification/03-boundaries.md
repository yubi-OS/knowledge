# 03. Boundaries

**Scope:** Boundaries: detailed analysis grounded in yubi-OS/yubiOS refs/skills-path-unification-2026-10-07.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/skills-path-unification-2026-10-07.md, no external web dig

## The four boundaries

The spec constrains every lane with four boundaries. They exist because a path-fix sweep touches dozens of files written by different authors over months, and the cheapest way to break a skill corpus is to "improve" it while fixing something else.

| # | Boundary | What it forbids |
|---|---|---|
| B1 | Edit ONLY the assigned skill dirs. No prose rewrites beyond what a rule requires | Cross-lane edits and opportunistic cleanup |
| B2 | Never alter frontmatter `name:` or `description:` semantics; YAML must still parse | Changes to skill discovery and triggering |
| B3 | Never change dates, SHAs, numbers, or verdicts; path strings only, plus the exact clause wording a rule prescribes | Rewriting history |
| B4 | `session/subagent/...` paths are sanctioned; do not "fix" them | False-positive repairs of a valid form |

## B1: assigned dirs only, rule-required prose only

Lanes are disjoint by construction (doc 04), so B1 is what keeps them disjoint in practice. If a lane edits a file outside its assignment, two lanes can produce conflicting edits that the orchestrator must reconcile by hand, and the single-commit ship step loses its clean diff. The second half of B1 matters as much: a rule like R2 prescribes appending "(repo retired 2026-09-24; historical)". It does not license rewording the surrounding sentence. Any extra prose change is an over-edit that the advisor checks are designed to catch.

## B2: frontmatter semantics are off limits

A skill's `name:` and `description:` are how the agent discovers and triggers it. The description in particular carries trigger phrases. A path fix that alters meaning there changes when the skill loads, which is a behavioral change outside the spec's scope. The rule allows touching a path string inside frontmatter if one exists there, but not the meaning, and requires that the YAML still parse afterward. The advisor check runs `js-yaml` or python yaml to confirm.

## B3: history is immutable

Skills in this corpus carry changelogs with dated RSI cycles, SHAs, measured deltas, and verdicts. These are evidence. A path fix that "tidies" a date or a count corrupts the audit trail the changelog exists to preserve. B3 limits edits to path strings and the exact clause wording a rule prescribes, such as "(session artifact, not repo-truth)" or "(reference checklist not shipped with this skill)". This is also why R2 and R4 have a "keep and annotate" branch rather than a "delete" branch: historical citations remain, marked so no future agent treats them as live targets.

## B4: the sanctioned session form

The invariant allows `session/subagent/...` as a subagent write path. A naive sweep for `session/` would flag these and "repair" them, breaking every skill that tells a subagent where to write. B4 names the form explicitly as sanctioned so no lane touches it. The enforcement lint's `session_citation` class is built the same way: it flags concrete `session/<file>` citations only outside changelog or evidence sections and without a runtime-capture marker.

## Exclusions as a boundary

Although listed under R4, the vendor-doc exclusions function as a fifth boundary. `cloudflare/**`, `sandbox-*/**`, `agents-sdk/**`, `workers-best-practices/**`, `brag/slim.md` (`work/`), and docker `cache/attestations` contain strings like "session", "work", and "cache" that are product concepts (a Cloudflare sandbox session, a docker build cache), not Sauna paths. Editing them would introduce errors into upstream reference material.

## How the boundaries are verified

The advisor checks (doc 06) map almost one to one onto the boundaries:

| Boundary | Advisor check |
|---|---|
| B1 | No over-edits; rule compliance |
| B2 | YAML still parses |
| B3 | Rule compliance (path strings only) |
| B4 | `session/subagent/` preserved |
| Exclusions | No vendor-doc false positives |

## Why boundaries come before lanes

The spec states boundaries before the lane partition for a reason: lanes run in parallel, without seeing each other's work, so the only coordination available is what every lane reads first. Boundaries are the shared contract that makes parallel edits mergeable. Without them, five independent lanes would each make locally reasonable judgment calls that conflict globally.

## Scope note

The outline scored this subtopic 0.6827, the lowest in the corpus, rating it marginal relative to the vocabulary and rules. That reflects its role: boundaries add no new path knowledge, but they are what make the sweep safe to run.
