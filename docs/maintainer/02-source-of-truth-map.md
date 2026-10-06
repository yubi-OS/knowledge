# Source Of Truth Map

Scope: the authority hierarchy the maintainer playbook records for yubiOS, mapping every recurring question to one current file. Internal-record subtopic, no dig: the map and the override rule come from the source doc (yubi-OS/yubiOS docs/MAINTAINER.md).

## The map

The source doc fixes a single file as the source of truth for each topic:

| Topic | File |
|---|---|
| Current base and tool pins | `PINNED.md` |
| Accepted architecture decisions | `ADR.md` |
| Normative behavior | `SPEC.md` |
| Threat mitigations and residual risk | `MITIGATE.md` |
| Future work | `FUTURE.md` |
| Active blockers | `BLOCKERS.md` |
| Active tasks | `TODO.md` |
| Research-cycle evidence | `refs/` |

The design is one-to-one: no topic has two competing homes. Where a question touches pins, the answer is in `PINNED.md`; where it touches accepted architecture, the answer is in `ADR.md`. This matters because the most common documentation failure in a multi-agent project is not a missing fact but two stale copies of the same fact drifting apart.

## The override rule

The source doc states the rule directly: do not let historical run output, old PR notes, or stale TODO fragments override the current source-of-truth files. Three specific hazards are named:

1. Historical run output. CI logs, build transcripts, and tool output from a past run describe the state at that run's sha, not the state of `main` now.
2. Old PR notes. A PR conversation may assert a pin or a decision that a later change superseded; the note survives in the thread while the truth moved on.
3. Stale TODO fragments. Task text copied between files outlives its validity.

The rule is directional: current files beat historical fragments, always. It complements the consistency-flag discipline in the same doc, which keeps the flagged conflicts visible instead of allowing any fragment to silently win.

## Why the pins file is the load-bearing entry

`PINNED.md` is the only entry the source doc singles out for additional reinforcement elsewhere in the playbook: the consistency-flags section states that `PINNED.md` is the live digest source and that historical digests in ADRs and old workflow logs are not current pins (source doc). An ADR records a decision and its context at the time it was accepted; the digest that decision was validated against may have been bumped since. The playbook resolves the tension by assigning all current-pin authority to one file and explicitly demoting every other location that mentions digests.

## How the map disciplines agent work

The research cycle checklist (a separate subtopic of this corpus) leans on this map operationally: a maintainer or agent starting work reads the task-specific file first, then `AGENTS.md`, `PINNED.md`, and relevant ADRs and refs (source doc). The order is deliberate: the task file scopes the work, the map supplies the current ground truth, and refs supply the research evidence trail for the claims being touched.

The map also bounds what a landing must update. The release-hygiene rules require digest bumps to update `PINNED.md` itself, not a copy (source doc), and the research cycle requires updating docs that repeat an affected claim (source doc) so that no second source of truth is allowed to form.
