# README Structure and Changelog Maintenance

Scope: the source doc's README section (one-paragraph description, Quick Start, Commands table, Architecture with ADR links, Contributing) and changelog section (Keep a Changelog style entries for shipped features with issue references).

## The README sections (source doc)

The source doc says "Every project should have a README that covers" 5 things:

1. **Title plus one-paragraph description** of what the project does.
2. **Quick Start**: the numbered path from clone to running. The example is 4 steps: clone the repo, `npm install`, `cp .env.example .env`, `npm run dev`.
3. **Commands**: a table of command and description rows (the example covers dev server, tests, production build, lint).
4. **Architecture**: "Brief overview of the project structure and key design decisions. Link to ADRs for details."
5. **Contributing**: how to contribute, coding standards, PR process.

Two of these sections are load-bearing links in the skill's system. The Commands table is the operator interface: a newcomer (human or agent) should be able to run, test, build, and lint without reading source. The Architecture section is the README's hook into the ADR corpus (doc 03 and 04): the README summarizes what the architecture is and why at headline level, and delegates the decision rationale to the `docs/decisions/` ADRs.

The red flags list in the source doc makes the README's importance explicit: "README that doesn't explain how to run the project" is a flagged failure. So is "Documentation that restates the code instead of explaining intent" (the README's description and architecture sections are intent documents, not code mirrors).

## External README conventions

The dig for this subtopic came back mostly weak. A freeCodeCamp guide on README structure walks the same section set (https://www.freecodecamp.org/news/how-to-structure-your-readme-file/, jev weight 0.17, weak backing). A 2026-dated guide specifically on the README architecture section, what to include, aligns with the source doc's "brief overview plus ADR links" division (https://datadef.io/guides/en/readme-architecture-section, jev weight 0.21, weak backing). Two GitHub-hosted README guides scored 0.16 to 0.18 (https://github.com/krinj/simple-readme-guide, https://github.com/Amengclass/github-readme-guide, weak backing). The ReadMe.com result (jev weight 0.11) is a commercial product page, off-topic. None of the external sources contradict the source doc; none go beyond it in a way this corpus needs. The source doc carries the README standard here.

## The changelog (source doc)

For shipped features, the source doc shows a changelog with dated version headings and 3 subsections, each entry carrying an issue reference:

```markdown
## [1.2.0] - 2025-01-20
### Added
- Task sharing: users can share tasks with team members (#123)
- Email notifications for task assignments (#124)

### Fixed
- Duplicate tasks appearing when rapidly clicking create button (#125)

### Changed
- Task list now loads 50 items per page (was 20) for better UX (#126)
```

3 properties are worth naming. First, the version heading is a semantic-version-style number plus a date. Second, the Added / Fixed / Changed subsections are the Keep a Changelog category set. Third, every entry ends with an issue reference in parentheses, which links the user-visible change back to the work item that produced it.

Keep a Changelog is the authoritative anchor for this format: the canonical 1.0.0 guidance defines exactly these categories (Added, Changed, Deprecated, Removed, Fixed, Security) and the practice of keeping an Unreleased section at the top (https://keepachangelog.com/en/1.0.0/, jev weight 0.69, authoritative). The reference changelog maintained by the same project is a worked instance of the format (https://github.com/olivierlacan/keep-a-changelog/blob/main/CHANGELOG.md, jev weight 0.34, weak backing as a working example rather than the standard statement). The remaining changelog dig results scored 0.06 to 0.13 (weak backing) and add nothing beyond the standard.

## The relationship between changelog and code

The source doc's changelog entries are written in user-visible terms: "Task list now loads 50 items per page (was 20) for better UX" states the behavior change and the reason, not the implementation. This is the why-over-what discipline applied to release notes: the entry tells a user what changed in their experience and why, while the commit history tells an engineer what code moved. The issue references are the join between the 2 audiences.

## Changelog versus ADR as decision records

The changelog records shipped changes; the ADR records decisions, including rejected ones. They answer different questions: the changelog answers "what is different in 1.2.0", the ADR answers "why is the system shaped this way". A changelog entry like the example's page-size change would not be an ADR (not expensive to reverse); a database-engine choice would never appear in the changelog (not a user-visible change). The README's Architecture section is the piece that binds both: it points readers to ADRs for the decision layer, and the changelog's version headings give the timeline of what shipped on top.

## Verification

The source doc's verification item closest to this doc is "README covers quick start, commands, and architecture overview" (Verification section). A practical audit: every command in the Commands table should run as written from a fresh clone; every version heading in the changelog should have a date; the Architecture section should link at least one ADR when the project has significant architectural decisions at all.
