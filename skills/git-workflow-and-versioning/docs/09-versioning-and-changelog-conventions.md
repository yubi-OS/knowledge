# 09 Versioning and Changelog Conventions

Scope: semantic versioning and how to choose a bump, the keep-a-changelog format, and the changelog discipline the skill's own corpus artifacts model.

## Semantic versioning

The versioning rules the skill's ecosystem standardizes on come from Semantic Versioning 2.0.0: given a version number MAJOR.MINOR.PATCH, increment the MAJOR version for incompatible API changes, the MINOR version for backward-compatible functionality additions, and the PATCH version for backward-compatible bug fixes (https://semver.org/, weight 0.96; https://semver.org/spec/v2.0.0.html, weight 0.97). The spec is explicit that MAJOR MUST be incremented if backward incompatible changes are introduced to the public API (https://semver.org/spec/v2.0.0.html, weight 0.97). Build-tooling that computes the next version mechanically from a bump type exists but adds nothing to the decision rules (https://roboculator.com/calculator/semantic-versioning-calculator, weight 0.08, weak backing).

For the git-workflow-and-versioning skill, the tie-in is the typed commit history: a history of `feat:`, `fix:`, and `refactor:` commits is exactly the input a semver bump decision needs. Features since the last tag argue MINOR, fixes argue PATCH, a breaking interface change argues MAJOR (semver.org, weight 0.97, with the commit-type mapping from the source doc and Conventional Commits at https://www.conventionalcommits.org/en/v1.0.0/, weight 0.87).

## Keep a Changelog

Keep a Changelog 1.1.0 defines a changelog as a file containing a curated, chronologically ordered list of notable changes for each version of a project (https://keepachangelog.com/en/1.1.0/, weight 0.68). The format's own CHANGELOG.md records that 2.0.0 kept the six change types, YYYY-MM-DD dates, and the Unreleased and [YANKED] markers (https://github.com/olivierlacan/keep-a-changelog/blob/main/CHANGELOG.md, weight 0.50). Earlier versions of the site already fixed the naming convention that the all-caps CHANGELOG is the name of the file itself, a historical convention many projects follow (https://keepachangelog.com/en/0.3.0/, weight 0.62). Third-party summaries of the format describe the standard categories and header structure (https://www.dev-toolbox.tech/tools/release-notes-generator/examples/keep-a-changelog-format, weight 0.15, weak backing), and real projects adopt the pairing explicitly: "The format is based on Keep a Changelog, and this project adheres to Semantic Versioning" (https://hexdocs.pm/rodar_python/changelog.html, weight 0.30, weak backing).

The changelog's raw material is the commit log. Typed, atomic commits (docs 02 and 03) map cleanly onto changelog categories; an "Add task feature, fix sidebar, update deps, refactor utils" mega-commit does not, because it cannot be sorted into one category honestly.

## The skill's own changelog discipline

The ground source models changelog practice in its own body. It carries a Changelog section with dated entries in the form "2026-08-06 cycle 5 RSI: closed `segmentation` primitive gap (corpus-wide count 22 to 23/70). See `refs/cycle5-results-2026-08-06.md`" (source doc). Each entry is dated, states what changed, and links to the artifact recording the measurement. Subsequent RSI cycles 6 and 7 append further dated entries (cryptographic identity, trust chain closures), and a 2026-09-17 coverage note records a removal: two template paragraphs that "asserted capabilities this skill does not itself implement" were removed as unsupported (source doc). That removal entry is the honest-changelog discipline in action: deletions and corrections are logged, not silently rewritten.

## Release-cutting guidance

- Choose the bump from the change content, not the calendar: breaking = MAJOR, features = MINOR, fixes = PATCH (https://semver.org/, weight 0.96).
- Write the changelog entry from the typed commits between tags, curated: notable changes only (https://keepachangelog.com/en/1.1.0/, weight 0.68).
- Tag the release commit and keep the changelog's Unreleased section accumulating until the cut (https://github.com/olivierlacan/keep-a-changelog/blob/main/CHANGELOG.md, weight 0.50).
- Log removals and behavior corrections in the changelog with the same care as additions (source doc, 2026-09-17 entry).
