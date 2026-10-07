# 03 - Keep a Changelog and Conventional Commits as lifecycle projections

Scope: the two reader-facing and automation-facing projections of lifecycle state: Keep a Changelog 1.1.0 categories and entry quality, plus Conventional Commits 1.0.0 type-to-increment mapping and Release Drafter automation.

Grounding spine: the source doc `yubi-OS/yubiOS skills/nss-lifecycle/SKILL.md`, standards 2 and 3.

## What a changelog is, and is not

Keep a Changelog defines a changelog as a file which contains a curated, chronologically ordered list of notable changes for each version of a project, maintained so that users and contributors can see precisely what notable changes were made between releases (https://keepachangelog.com/en/1.0.0/, jev 0.72). The current 2.0.0 guidance draws a sharp line against a common failure: do not use a list of commits as a changelog. A commit log is full of noise (merge commits, unclear messages, internal changes); a commit records a step in the source code, while a changelog entry records a notable difference, often across several commits, written for the people who use the software (https://keepachangelog.com/en/2.0.0/, jev 0.73). The project's repository states the principle plainly: if you build software, keep a changelog (https://github.com/olivierlacan/keep-a-changelog, jev 0.66).

Two mechanics from the current guidance map directly onto the Lifecycle axis: keep an Unreleased section at the top to track upcoming changes, and if you do nothing else, list deprecations, removals, and any breaking changes in your changelog (https://keepachangelog.com/, jev 0.70).

## The categories and the good deprecation entry

Keep a Changelog 1.1.0 defines the categories Added, Changed, Deprecated, Removed, Fixed, and Security, with an Unreleased section and chronological releases; it explicitly recommends announcing a deprecation before removal and naming the version in which removal will occur (source doc). The source doc turns that recommendation into an entry-quality test: a good entry identifies the affected surface, user-visible effect, reason, replacement, first affected version, planned removal version or date, and migration path. "Deprecated old API" is not a good entry because it does not enable planning or action (source doc). The yubiOS guideline restates it: keep-a-changelog entries name the affected surface, the symbol, endpoint, or flag, plus reason, replacement, and removal-in-version (source doc).

`Security` is used when the change addresses a vulnerability, even if technically it is also a Fixed or Changed item, because its urgency and audience differ (source doc).

## Conventional Commits as automation signals

Conventional Commits 1.0.0 is a lightweight convention on top of commit messages that provides an easy set of rules for creating an explicit commit history, which makes it easier to write automated tools on top of; the convention dovetails with SemVer by describing the features, fixes, and breaking changes made in commit messages (https://www.conventionalcommits.org/en/v1.0.0/, jev 0.73). The mapping: fix maps to PATCH, feat maps to MINOR, and BREAKING CHANGE or ! maps to MAJOR; the types chore, refactor, perf, test, and docs are permitted but do not inherently imply a SemVer increment (source doc).

The yubiOS practice table adds lifecycle meaning per type: feat means added capability or new API (MINOR); fix means corrected behavior (PATCH); chore means maintenance or tooling and warrants a lifecycle review despite signalling no release effect; refactor means internal restructuring and warrants a public-compatibility check; perf means a performance behavior change (PATCH or MINOR); test is test-only (none); docs is documentation including migration and deprecation notices, which is none in release effect but may be lifecycle-critical (source doc).

Two cross-checks the source doc demands: the conventional-commit type must align with the changelog category (feat to Added, fix to Fixed, BREAKING CHANGE to Changed or Removed depending on what changed), and a conventional commit without a changelog entry breaks the audit trail. A `docs:` commit can be the event that makes a deprecation discoverable while the lifecycle state remains deprecated until removal, and a `chore:` can delete an old flag or API and therefore require a lifecycle review despite its low-information commit type (source doc).

## Release Drafter: automation should consume, not infer

Release Drafter can classify changes by labels, paths, and conventional-commit predicates, and separately resolve a SemVer increment. That is useful automation, but it should consume explicit lifecycle metadata rather than infer every lifecycle fact from a title (source doc). In the yubiOS GitHub Actions pattern, `.github/release-drafter.yml` maps feat to MINOR, fix to PATCH, and BREAKING CHANGE or ! to MAJOR; a workflow's deprecation lands as a Deprecated changelog category with an ADR link (source doc).

## Sources

- Source doc: `yubi-OS/yubiOS skills/nss-lifecycle/SKILL.md`, standards 2 and 3, Guidelines 3 and 4, Anti-patterns (conventional-commit without a changelog entry; chore that quietly removes a public API), Red flags table.
- https://keepachangelog.com/en/2.0.0/ (jev 0.73)
- https://keepachangelog.com/en/1.0.0/ (jev 0.72)
- https://keepachangelog.com/ (jev 0.70)
- https://github.com/olivierlacan/keep-a-changelog (jev 0.66)
- https://www.conventionalcommits.org/en/v1.0.0/ (jev 0.73)
- https://www.conventionalcommits.org/ (jev 0.72)
