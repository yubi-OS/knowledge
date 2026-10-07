# Doc-as-code enforcement: CI checks for the audience vocabulary

**Scope:** the audience tag is data, not decoration: CI validates the controlled vocabulary, requires a primary audience and job per public task page, executes referenced examples where feasible, and demands owner and review_after on high-risk cells.

## The tag must be validated or it decays

Guideline 7 of the skill is treat the audience tag as data, not decoration (source doc: yubi-OS/yubiOS skills/nss-audience/SKILL.md). CI must validate the controlled vocabulary; otherwise the tag degrades into documentation-by-section with extra steps. The verification checklist repeats the mechanism: the audience vocabulary is enforced with no free-form role names in front matter or in the matrix, and front matter must be YAML-parseable via js-yaml, with `audience` values matching the vocabulary and `description` 1 to 1024 chars with no literal `<` or `>` (source doc).

## What the CI checks look like

The source doc's example 5 pairs the front-matter schema with the checks CI runs over it (source doc):

- `audience` values come from the controlled vocabulary.
- Every public task page names a primary audience and a job.
- Referenced commands and examples execute where feasible.
- High-risk cells have an `owner` and a `review_after` date.

These are ordinary docs-as-code checks. The docs-as-code philosophy treats documentation like code: version-controlled, reviewed, and shipped with the same tooling (https://www.writethedocs.org/guide/docs-as-code/, weight 0.17, weak), and testing documentation keeps it in a consistent state (https://www.writethedocs.org/guide/tools/testing/, weight 0.16, weak). GitLab runs documentation tests in CI, including translated content (https://docs.gitlab.com/development/documentation/testing/, weight 0.52).

## The linter layer

Prose linters enforce house rules in CI, and the de facto standard is Vale, a markup-aware linter that turns a team's writing guidelines into checks that run in the editor, in CI, and alongside code (https://github.com/vale-cli/vale, weight 0.57). Mintlify's CI checks documentation with Vale across Markdown and MDX (https://www.mintlify.com/docs/deploy/ci, weight 0.54). Vale's own docs target a heading, a comment, or a description while leaving the code around it alone (https://vale.sh/, weight 0.30, weak).

Structural checks need a different tool: front-matter schema validation. remark-lint-frontmatter-schema validates markdown front matter against a JSON schema, with the schema association declared inside the front matter via a `$schema` key (https://github.com/JulianCataldo/remark-lint-frontmatter-schema, weight 0.30, weak). A schema-driven front-matter validation system catches missing required fields and invalid date formats (https://zer0-mistakes.com/docs/development/frontmatter-validation/, weight 0.10, weak). An audience vocabulary check is exactly this class of check: assert that `audience` is an array whose members are members of the fixed role list, that `mode` is a member of the mode list, and that `jobs` members come from the jobs list.

Docs CI guides group the available checks as link checkers, prose linters, and freshness gates (https://datadef.io/guides/en/docs-checks-in-ci, weight 0.15, weak). The audience sweep adds a 4th: vocabulary gates on front-matter semantics.

## Why vocabulary gates and not free text

A free-text `audience:` field cannot be cross-checked against the matrix, cannot be aggregated, and cannot fail a build. The controlled vocabulary is what makes an audience tag queryable and enforceable, which is the same reason DITA specifies the `<audience>` element's `@type` values rather than free-form strings (https://www.oxygenxml.com/dita/1.3/specs/langRef/base/audience.html, weight 0.76). The skill's constraint that new values require a vocabulary revision, not a one-off addition, is the governance version of the same rule (source doc).

## Stale tags are worse than no tags

Guideline 9 makes tag maintenance a CI-adjacent duty: when a file's audience changes, the front matter and the inbound links must move with it (source doc). A `review_after: release` field gives CI a hook to reopen the question on schedule, and the owner field gives the reopened question a destination. This is the freshness-gate pattern from docs CI applied to audience metadata rather than content (https://datadef.io/guides/en/docs-checks-in-ci, weight 0.15, weak).
