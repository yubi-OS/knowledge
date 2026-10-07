# Changelog Maintenance

Scope: the changelog format the source doc prescribes for shipped features, the Keep a Changelog convention behind it, and what each section must carry.

## The format

Per the source doc (yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md, "Changelog Maintenance"), shipped features get a changelog entry with 3 structural elements:

1. A version header with a date: `## [1.2.0] - 2025-01-20`.
2. Categorized entries under Added, Fixed, and Changed headings.
3. A per-entry issue reference, like (#123), linking the entry to the work item that produced it.

The source doc's example for version 1.2.0 dated 2025-01-20 carries 3 categories:

- **Added**: task sharing (users can share tasks with team members, #123) and email notifications for task assignments (#124). New user-facing capabilities land under Added.
- **Fixed**: duplicate tasks appearing when rapidly clicking the create button (#125). Bug fixes land under Fixed.
- **Changed**: the task list now loads 50 items per page instead of 20, noted as "was 20" for better UX (#126). Behavior changes land under Changed, and behavior deltas state both the new and the old value.

Each entry is one line, written for a user of the software rather than for the developers: "users can share tasks with team members", not "implement ShareTaskService". The #126 entry demonstrates the both-values convention: 50 per page (was 20).

## The convention behind the format

The 3-category shape is the Keep a Changelog convention. Keep a Changelog (https://keepachangelog.com/en/1.0.0/, weight 0.79) prescribes exactly these categories (Added, Changed, Deprecated, Removed, Fixed, Security) under version headers and the discipline of maintaining a changelog file per project, written for humans rather than as a git log dump. The source doc's example is a subset of that category set: Added, Fixed, Changed cover the ordinary shipped-feature cases, and the remaining Keep a Changelog categories (Deprecated, Removed, Security) apply when those events occur.

Weak-backed corroboration: the Common Changelog specification (https://common-changelog.org/, weight 0.31) proposes a refinement of the same convention; a practitioner guide on changelog format and examples (https://announcekit.app/blog/keep-a-changelog/, weight 0.22) restates the Keep a Changelog rules for a general audience. Both are below the 0.5 threshold; cite as echoes.

## Why changelogs belong in this skill

The changelog is the user-facing record of the decisions documented elsewhere in the skill. The trigger list (doc 01) includes "shipping a feature that changes user-facing behavior"; the changelog entry is where that trigger lands. The division of labor is:

- The ADR (doc 03) records why an internal decision was made.
- The changelog records that a change shipped, what it does for the user, and which work item to trace it to.
- The README (doc 06) orients new users; the changelog orients returning users upgrading across versions.

## Writing discipline

Three rules are derivable from the source doc's example plus the verification mindset of the skill:

1. **One version, one date.** The version header carries its release date (2025-01-20 for 1.2.0 in the example), so the file is a timeline, not a heap.
2. **Every entry cites its work item.** The (#123)-style references make each changelog line auditable back to the issue, PR, or Linear item that produced it, which is the same auditability the ADR alternatives section provides for decisions.
3. **State the before and after for behavior changes.** The 50-per-page (was 20) pattern prevents the most common changelog failure: a Changed entry that says the system changed without saying from what.

## Gaps and drift notes

The source doc does not mention Semantic Versioning explicitly, so this corpus records no claim about bump rules. The dig surfaced a weak-backed release-management guide covering versioning and changelogs together (https://khimananda.com/blog/release-management-versioning-and-changelogs, weight 0.17) and a weak-backed engineering-practices piece on semantic versioning (https://www.tiny.cloud/blog/improving-our-engineering-best-practices-with-semantic-versioning/, weight 0.14); both are below threshold and neither contradicts the source doc. If a team wants version-bump discipline on top of the source doc's format, Keep a Changelog's own guidance (weight 0.79) is the grounded extension point.
