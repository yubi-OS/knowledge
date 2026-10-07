# Audience signal inventory: one evidence-backed row per file

**Scope:** before any scoring, the Audience axis produces an inventory: 1 row per file with explicit_audience, inferred_roles, primary_role, experience, interaction, mode, jobs, evidence, and confidence. The row is the audit trail; the matrix is the output.

## The inventory is mandatory and comes first

The skill's first guideline is always inventory before scoring (source doc: yubi-OS/yubiOS skills/nss-audience/SKILL.md). Each row records:

- `path` and `source_type` (prose, code-adjacent, schema, workflow).
- `explicit_audience`: what the file itself declares.
- `inferred_roles`: what the evidence says it actually serves.
- `primary_role`: the single role the file is chiefly for, or `unknown`.
- `experience`, `interaction`, `mode`, `jobs` from the controlled vocabulary.
- `evidence`: a list of concrete signals, quoted.
- `confidence`: how strongly the signals support the assignment.

The verification checklist enforces the same shape: every file in scope gets 1 row, every primary_role assignment cites at least 1 signal, and files that genuinely cannot be classified use `unknown`, not a guess (source doc).

## What counts as evidence, in order

The skill fixes an evidence hierarchy (source doc), strongest first:

1. Explicit metadata: YAML front matter `audience:` fields or a `## Audience` block.
2. Stated goal plus prerequisites: "before you start you need a booted image with a YubiKey attached" implies an operator reader.
3. Executable artifacts plus vocabulary: exit codes, env vars, and assertions imply a machine reader.
4. Inbound links from a persona landing page.
5. Filename plus directory.
6. Author convention.

Explicit evidence beats inference, and inference beats naming conventions. A file named `deployment.md` may still target developers if it explains a deploy library (source doc). The red-flag table calls a file with no audience signal anywhere (no front matter, no `## Audience`, no executable artifact, no inbound link) an audience-axis gap to classify as `unknown` and flag for Extend (source doc).

## Worked rows from the source doc

The source doc carries 3 worked examples that show the row shape in practice:

- `docs/CONTRIBUTING.md`: explicit_audience `[maintainer]`, inferred_roles `[maintainer, developer]`, primary_role maintainer, experience general, interaction human, mode how_to, jobs `[develop, test, extend]`, evidence such as "PRs welcome, run tests before pushing" and "lint rules in section 5", confidence high.
- `tests/vm/test-luks-fido2.sh`: explicit_audience empty, inferred_roles `[ci_automation, maintainer]`, primary_role ci_automation, experience expert, interaction machine, mode runbook, jobs `[test]`, evidence "executable assertions with set -e" and "exit codes used by ci_test-vm.yml dispatch", confidence high.
- `docs/ARCHITECTURE.md`: inferred_roles `[architect, developer, maintainer]`, primary_role architect, mode explanation, jobs `[evaluate, extend]`, evidence "decision rationale and trade-offs" and "no executable commands", confidence medium.

The third row shows why confidence is a field: an inferred audience for a high-risk role should become a validation question, not be silently discarded (source doc). Confidence stays separate from severity.

## Explicit versus inferred audiences

Audience analysis distinguishes audiences that receive a communication directly from secondary and hidden ones (https://writingcommons.org/article/audience-analysis-primary-secondary-and-hidden-audiences/, weight 0.16, weak). The inventory operationalizes that distinction: `explicit_audience` is what the file says, `inferred_roles` is what the evidence supports, and a mismatch between the 2 fields is itself a finding. Purdue OWL's guidance that user-centered communication requires gathering information about the actual readers (https://owl.purdue.edu/owl/subject_specific_writing/professional_technical_writing/audience_analysis/index.html, weight 0.17, weak) is the same discipline applied to files: read the file, do not assume its readers.

## Front matter as the primary signal

Because explicit metadata ranks first, the inventory depends on docs-as-code front matter conventions. YAML front matter is the Jekyll-popularized block of key-value content at the top of a page that adds metadata (https://docs.github.com/en/contributing/writing-for-github-docs/using-yaml-frontmatter, weight 0.52), and GitHub's own docs repo stores that convention in-repo as a contributing guide (https://github.com/github/docs/blob/main/content/contributing/writing-for-github-docs/using-yaml-frontmatter.md, weight 0.57). Documentation platforms expose the same pattern for content types and custom fields (https://frontmatter.codes/docs/content-creation/fields/, weight 0.81). A file that declares `audience: [operator]` in parseable front matter therefore carries stronger evidence than one that buries its reader in prose.

## Persona practice behind the inference step

When explicit metadata is absent, inference needs a persona model to infer against. GitBook's persona documentation workflow lists, for each persona, the jobs they are trying to accomplish (https://gitbook.com/docs/guides/docs-workflow-optimization/documentation-personas, weight 0.28, weak) and builds docs around user needs (https://docs.gitbook.com/, weight 0.65). Academic treatments of audience personas treat them as composite documentation instruments for technical communicators (https://programmaticperspectives.cptsc.org/index.php/jpp/article/view/81, weight 0.18, weak). The skill's stance is stricter than marketing personas: an inferred role with no citation is not allowed to become a primary_role, and the evidence list is what makes the inventory an audit trail rather than an opinion (source doc).
