# Audience gap patches: Audience blocks and machine-readable front matter

**Scope:** when the matrix exposes a gap, the fix is a targeted patch: an `## Audience` block in prose or an `audience:` front-matter field declaring role, job, prerequisites, and out-of-scope boundaries.

## The patch shape

The source doc's example 3 (yubi-OS/yubiOS skills/nss-audience/SKILL.md) shows the canonical patch, a markdown block that declares 4 things:

1. Primary audience with experience level: "operators (general experience) running yubiOS in production".
2. Secondary audience with the mechanism that ties it in: "CI/automation, the workflow that dispatches ci_test-vm.yml consumes the same exit codes".
3. Job: "monitor and troubleshoot the LUKS2 + FIDO2 unlock path".
4. Prerequisites assumed and out-of-scope boundaries, with pointers to the files that cover them (`docs/ENROLL.md` for end-user enrollment, `CONTRIBUTING.md` for maintainers).

The out-of-scope list is what makes the patch a routing fix rather than a label: it tells the wrong-audience reader where to go next, which closes the arrival-path gap the matrix flagged.

## Front matter is the enforceable form

Constraints in the skill require that every audience label be carried either by YAML front matter or by an explicit `## Audience` / `## Purpose` block; free-floating "intended reader" prose is not enough (source doc). This mirrors the docs-as-code mainstream: YAML front matter is the Jekyll-popularized key-value block used to attach metadata to markdown pages (https://docs.github.com/en/contributing/writing-for-github-docs/using-yaml-frontmatter, weight 0.58), and GitHub's docs repo implements that convention in its own contributing guide (https://github.com/github/docs/blob/main/content/contributing/writing-for-github-docs/using-yaml-frontmatter.md, weight 0.57).

The source doc's example 5 front-matter block extends the convention with audit-relevant fields:

```yaml
audience: [operator]
jobs: [deploy, monitor, recover]
experience: general
interaction: human
mode: runbook
source_of_truth: deployment-manifests
owner: platform-team
review_after: release
```

The extra fields (`source_of_truth`, `owner`, `review_after`) tie the audience declaration to lifecycle accountability: high-risk cells have an owner and a review_after date (source doc). That keeps a tag from going stale: if a file moves from developer-targeted to maintainer-targeted, the front matter and the inbound links must move with it, and stale tags are worse than no tags (source doc).

## Platform support for the same pattern

The front-matter shape is not exotic tooling. Docusaurus content plugins provide front matter options like description, keywords, and image, each with its own front matter schema that enriches default metadata (https://docusaurus.io/docs/markdown-features/head-metadata, weight 0.68). The same mechanism applies the description in more places than the rendered head, including generated category index pages (https://docusaurus.io/docs/markdown-features/head-metadata, weight 0.60). Front matter is optional in Docusaurus but is the standard hook for custom metadata (https://docusaurus.io/docs/create-doc, weight 0.50), and its markdown features treat front matter as the way to add metadata to a file at all (https://docusaurus.io/docs/markdown-features, weight 0.66). A yubiOS-style `audience:` field rides the same rails; nothing about the patch requires bespoke infrastructure.

## Multi-role declarations with per-section notes

The mixed-file rule shapes what a patch may say. A file that genuinely serves 3 roles should declare `audience: [operator, developer, ci_automation]` with a note explaining which section serves which role, not collapse to 1 role for tidiness (source doc). Collapsing is the anti-pattern; the patch grammar has room for it. The DITA precedent supports the same structure: a topic can carry multiple `<audience>` elements, one per reader group, each with a task and experience level (https://www.oxygenxml.com/dita/1.3/specs/langRef/base/audience.html, weight 0.76; https://docs.oasis-open.org/dita/v1.2/os/spec/langref/audience.html, weight 0.77).

## When to patch versus when to split

A patch adds an audience block to an existing file. It does not fix a mode mismatch. If a file mixes tutorial prose with a reference lookup table and a runbook procedure, the fix is to split it into 3 files or pick 1 mode (source doc). The patch is for the common case: the content is right for its reader but the reader was never declared, so the corpus cannot route or verify the match.
