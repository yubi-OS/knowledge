# 08. Changelog maintenance

Scope: the skill's changelog discipline for shipped features: version-headed entries with Added, Fixed, and Changed sections, dated entries, and issue references.

## The skill's format (source doc)

The source doc (yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md) prescribes a changelog for shipped features. Its example is headed `# Changelog` with a version-and-date section `## [1.2.0] - 2025-01-20` and 3 subsections:

1. Added: 2 entries, each a user-visible feature with its issue reference: "Task sharing: users can share tasks with team members (#123)" and "Email notifications for task assignments (#124)".
2. Fixed: "Duplicate tasks appearing when rapidly clicking create button (#125)", a user-observable defect with its issue number.
3. Changed: "Task list now loads 50 items per page (was 20) for better UX (#126)", stating the new value, the old value, and the reason.

The format has 4 load-bearing properties: every entry belongs to a version; every version entry carries its date; every entry names the behavior change from the user's point of view rather than the implementation; every entry cites the issue number that carries the full context.

## The standard behind the format

The Keep a Changelog project defines a changelog as "a file which contains a curated, chronologically ordered list of notable changes for each version of a project" and gives the rationale: "To make it easier for users and contributors to see precisely what notable changes have been made between each release" (https://keepachangelog.com/en/1.0.0/, jev 0.77 and 0.78 across 2 queries). The word "curated" is the operative one: a changelog is a human-selected list of notable changes, not a diff dump.

Keep a Changelog 2.0.0 (jev 0.79) extends the guidance the skill's example embodies: marking breaking changes and where upgrade steps belong; choosing between the Changed, Fixed, and Security categories; and leading Security entries with their CVE (https://keepachangelog.com/en/2.0.0/). The canonical category set is 6 types: Added, Changed, Deprecated, Removed, Fixed, Security. The skill's example uses 3 of them, which is the honest set for a release that shipped features, fixes, and behavior changes; the full 6 are available when deprecations or removals occur.

A weak-backed practitioner guide covers the standards, automation tooling, and publishing workflows that keep changelogs maintained over time (https://unmarkdown.com/blog/changelog-best-practices, jev 0.20, weak backing), and a weak-backed article distinguishes changelogs from marketing-facing release notes (https://blog.releasenotes.io/changelog-vs-release-notes/, jev 0.15, weak backing). The skill's format sits on the changelog side of that distinction: factual, issue-linked, user-visible behavior.

## Why issue references matter

The skill's example never states a change without its issue number. The reason is the same rationale the skill gives for ADRs: context lives somewhere durable. The changelog line says what changed; the issue (#123 through #126 in the example) holds the bug report, the debate, and the decision. A changelog entry without a reference is a dead end; with one, it is an index into the record. This mirrors the ADR cross-reference pattern in the gotcha comments (doc 05) and the README architecture links (doc 07): every documentation surface points at its deeper record.

## Practice notes

1. Add the entry when the feature ships, not before and not weeks later; the date in the heading is the anchor.
2. Write entries in user-visible behavior terms ("Task list now loads 50 items per page (was 20)"), including the old value for Changed entries.
3. Attach the issue or PR number to every entry.
4. Use the full 6-category vocabulary when a release includes deprecations, removals, or security fixes; lead security entries with the CVE per Keep a Changelog 2.0.0.
5. Keep the changelog curated: notable changes only. Internal refactors with no user-visible effect do not belong, which is what "curated" means in the standard.
