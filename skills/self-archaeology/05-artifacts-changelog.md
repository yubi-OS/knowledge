# 05 The three artifacts: SELF.md, SELF-CHANGELOG.md, and the verdict

Scope: what a self-archaeology cycle produces, the append-only discipline of the changelog, and the first-run v0.1 behavior.

## The three outputs

Per the source doc (yubi-OS/yubiOS skills/self-archaeology/SKILL.md), a cycle produces 3 artifacts:

1. Edited SELF.md, the real change, if any.
2. A SELF-CHANGELOG.md entry, the audit trail.
3. A fixpoint or "continue" verdict, explicit, not implied.

The verdict is a first-class output, not a footnote: the cycle must state whether the gap map reached fixpoint or whether another cycle is warranted, and that statement is itself recorded. If SELF.md does not exist yet, the first run produces both SELF.md and SELF-CHANGELOG.md as v0.1.

## The changelog entry contract

Each SELF-CHANGELOG entry carries 4 fields: date, what changed, why, and evidence. The evidence requirement is enforced in 3 places in the source doc: the guidelines ("Append-only SELF-CHANGELOG. Never rewrite old entries. Each entry: date, what changed, why, evidence"), the anti-patterns ("Treating SELF-CHANGELOG as decorative. If entries don't cite evidence, the audit trail is fake"), and the red flags ("SELF-CHANGELOG.md without evidence (every entry: date, what, why, evidence)"). Evidence means a commit, a session, or an observed pattern, never an assertion.

## Append-only as an audit-trail principle

The append-only requirement matches established audit-log practice. A glossary on append-only audit logging (https://nhimg.org/glossary/append-only-audit-logging/, jev weight 0.08, weak) defines the model as events written forward only, with no ordinary path for silent rewrite, truncation, or deletion after creation, and notes that an audit trail is only useful if it can still be trusted after an incident. A design writeup on append-only audit trails (https://nabhpatodi.com/blog/your-audit-log-is-not-an-audit-trail/, jev weight 0.23, weak) argues an audit trail should record the command that succeeded, not only the column that changed, which is the same shape as recording why a SELF.md edit happened and what evidence backs it, not just which section was edited.

## The changelog convention in software

The changelog half of the contract has a direct analogue. Keep a Changelog (https://keepachangelog.com/en/1.0.0/, jev weight 0.63, the only primary-weighted source in this corpus) defines a changelog as a curated, chronologically ordered list of notable changes for each version of a project, kept so that users and contributors can see precisely what notable changes have been made. Common Changelog (https://common-changelog.org/, jev weight 0.15, weak) is a stricter style guide adapted from Keep a Changelog and insists changelogs are written by humans, for humans, with a clean history underneath. A release-notes vendor overview (https://www.launchnotes.com/release-notes/changelog, jev weight 0.18, weak) describes the changelog as the technical, chronological record of product changes.

SELF-CHANGELOG.md applies that shape to a self-model: chronological entries, one per meaningful shift, never rewritten. The difference is the subject. A software changelog records releases; a self-changelog records identity shifts with their evidence.

## Why the artifact set is small

Three artifacts, one file each, and a fixed entry format. That economy is deliberate. The source doc's anti-patterns warn against the discipline becoming journaling (SELF.md is structural) and against the changelog becoming decorative (entries without evidence are fake). A large or freeform artifact set would give both anti-patterns more room to grow. The verification checklist (doc 08) tests exactly these 3 artifacts after every run.

## Provenance

- Source doc: yubi-OS/yubiOS skills/self-archaeology/SKILL.md, sections "The output" and "Guidelines", plus the SELF-CHANGELOG entries in "Anti-patterns" and "Red flags".
- Web-shaped dig for append-only audit logging and changelog conventions, weighted as labeled above.
- Substrate paths per the source doc's "Source / evidence" section: memory/<personal-dirname>/SELF.md and memory/<personal-dirname>/SELF-CHANGELOG.md.
