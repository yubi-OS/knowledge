# 08 - ADR-driven decisions and the yubiOS per-file-type Lifecycle patterns

Scope: ADR-driven lifecycle decisions (Nygard format, immutable accepted ADRs, supersedes chains, back-links from affected files) plus the per-file-type Lifecycle block patterns across the yubiOS surface and the cycle-15 verification checklist.

Grounding spine: the source doc `yubi-OS/yubiOS skills/nss-lifecycle/SKILL.md`, standard 7, the "Lifecycle and the yubiOS surface" section, Examples 1 through 7, Verification, and Constraints. This doc has an internal-record component (the yubiOS file-type patterns), so the per-file-type section cites the source doc only and carries no dig.

## What an ADR must record for lifecycle decisions

Use an ADR for decisions that affect public interfaces, compatibility promises, deprecation windows, replacement selection, flag permanence, support policy, or supply-chain evidence (source doc). A good ADR records Context, Decision, Alternatives and trade-offs, Consequences, Owner, Status, Date, and Links to implementation and migration evidence (source doc). Accepted ADRs are immutable; a changed decision creates a new ADR that supersedes the old one (source doc).

The ADR pattern the yubiOS convention follows is Nygard's. The digs confirm the canonical artifacts:

- An architecture decision record is a document that captures an important architectural decision along with its context and consequences; the reference repository hosts every template and example as a browsable site at architecture-decision-record.github.io (https://github.com/architecture-decision-record/architecture-decision-record, jev 0.66).
- The arc42 worked example shows the record shape in practice: ADR 001 "Record architecture decisions", dated 2022-01-30 with the proposal to always use such a timestamp, status Accepted, and a Consequences section pointing back to Nygard's article (https://docs.arc42.org/examples/decision-use-adrs/, jev 0.55).
- The adr.github.io hub indexes ADR descriptions, templates, and examples but surfaced at weight 0.39 in this dig, so it is a weak-weight pointer only (https://adr.github.io/, jev 0.39).

## The linkage discipline

The file-level lifecycle block links to the ADR, while the ADR should explain why the transition exists; this prevents a changelog from becoming the only, usually too-short, record of a sunset decision (source doc). Guideline 10 makes back-links mandatory: ADRs are linked back from affected files, and a Deprecated changelog entry without an ADR is unauditable; an ADR without a back-link from the affected file is hidden (source doc).

On refs/notes the linkage is explicit both ways: every note carries an ADR-NNN ref when it drives a lifecycle decision, and the ADR carries the note back-link in its `## Note back-links` section (source doc). The refs frontmatter carries adr: ADR-031 and decision_status: accepted alongside supersedes and superseded_by (source doc).

## The yubiOS per-file-type patterns (internal-record)

These patterns are internal-record content from the source doc; no dig was run for them, and every claim below is a source-doc claim.

- Markdown, SKILL.md, and docs/*.md: a `## Changelog` section in keep-a-changelog 1.1.0 categories with an Unreleased block; frontmatter `stage: stable` or `beta` or `experimental` (unknown permitted with a since date); introduced_in and last_changed_in when meaningful; conventional-commit types in commit messages; ADR links for any breaking change.
- Containerfile, mkosi, and systemd units: image labels carry provenance (io.yubios.commit, io.yubios.build-ts, io.yubios.source-date-epoch); a reproducibility claim (reproducible_build, byte_identical, logical, none) declared in a `## Lifecycle` block; LABEL deprecation markers (io.yubios.stage, io.yubios.deprecated-since, io.yubios.removal-version); drop-in deprecation where a deprecated unit's ExecStart becomes an echo of DEPRECATED plus the old binary so the old path still works but logs the migration signal; SBOM generation phase, format, tool and version, and retention policy declared.
- Shell, Python, and Ruby scripts: a top-of-file `## Lifecycle` block with stage, introduced_in, last_changed_in, conventional-commit compatibility, and exit-code semantics on stage transitions (exit code 2 on Deprecated stage with a one-line migration message to stderr, exit code 3 on Cancelled stage with the replacement command).
- GitHub Actions workflows: workflow_call outputs declared when consumers depend on them (current_stage, last_changed_in, next_review); a permissions block declared at workflow level and never widened by a feat commit without an ADR; a concurrency group with cancel-in-progress true so a re-trigger cancels the prior lifecycle-stage transition; Release-drafter classification mapping feat to MINOR, fix to PATCH, breaking to MAJOR.
- refs/*.md: frontmatter stage, stage_since, introduced_in, last_changed_in, supersedes, superseded_by, owner, next_review; a trailing `## Changelog` block in keep-a-changelog 1.1.0 format; explicit ADR linkage.

## The cycle-15 verification checklist

Each cycle-15 patch that closes an NSS-lifecycle gap must pass 11 checks (source doc): one `## Lifecycle -- cycle 15` section in file-type-aware comment syntax; at least one concrete field with stage, versioning, introduced_in, last_changed_in, owner, next_review, and changelog_category (a placeholder with zero concrete fields is a NO); stage from the fixed vocabulary; a complete deprecation record when deprecated (deprecated_since, reason, replacement, removal_in_version, sunset_at, notice_period); removal_in_version named when deprecated or removed ("Someday" is not a removal_in_version); a migration guide named when deprecated; conventional-commit compatibility declared; changelog category declared; owner plus next_review named; ADR linkage named when the lifecycle drives a public decision; and the next NSS sweep on the same file does not re-flag lifecycle as the top Extend gap.

Two constraints shape the patch format: one section per file, never stacked or nested, and lens-format patches only, each a lens with hypothesis, method, parameters, delta, verdict, score, and caveat (source doc).

## Sources

- Source doc: `yubi-OS/yubiOS skills/nss-lifecycle/SKILL.md`, standard 7, "Lifecycle and the yubiOS surface", Examples 1 to 7, Guidelines 10 and 13, Constraints, Verification.
- https://github.com/architecture-decision-record/architecture-decision-record (jev 0.66)
- https://docs.arc42.org/examples/decision-use-adrs/ (jev 0.55)
- https://adr.github.io/ (jev 0.39, weak)
