# 01. Canonical path vocabulary (the invariant)

**Scope:** Canonical path vocabulary (the invariant): detailed analysis grounded in yubi-OS/yubiOS refs/skills-path-unification-2026-10-07.md.

Ground source: `yubi-OS/yubiOS refs/skills-path-unification-2026-10-07.md`. Dig queries: `static analysis linter markdown dead link path validation`; `YAML frontmatter schema validation python`.

## Why a vocabulary was needed

The spec opens with its scope: `yubi-OS/yubiOS/skills/` on main, audited from a fresh tarball of main containing 131 skills and 741 companion files. The directive (Jenny, 2026-10-07) was to fix five dead or wrong path classes via parallel build lanes, run an advisor review, push to main, then sync local space copies and regenerate the registry. Before any rule can say what a path should become, the spec fixes what a valid path is. That definition is the invariant.

## The three path kinds

| Kind | Form | When it is valid |
|---|---|---|
| 1. Repo-truth paths | `yubi-OS/<repo>/<path>` or repo-relative (`refs/...`, `tools/...`, `papers/...`) | Default for anything durable |
| 2. Ephemeral session paths | `session/...` | ONLY as "capture at run time" language or as subagent write paths (`session/subagent/...`); never cited as a durable input |
| 3. Declared references | Host paths, connection ids, operator identity files, referred to by role or label | Concrete ids live only in the `-connection` skills, which document ids by design; those stay staleness-corrected, not variable-ized |

The invariant can be stated as one sentence: a durable instruction may only point at something that durably exists, named in a form that survives the session that wrote it.

## Reading the invariant

**Repo-truth is the default.** If an artifact was pushed to a repo, the skill should cite the repo path. A session path that happened to hold the same file during authoring is not durable: the session ends and the path dangles.

**Session paths are allowed, but only in two grammatical roles.** As an instruction about where a future run should write ("write to `session/` during the run") or as a subagent write path. Citing `session/foo.md` as an input a future agent should read is the failure the invariant forbids.

**Declared references are named by role.** Host paths, connection ids, and identity files change. Rather than scattering concrete ids through every skill, the spec confines them to the `-connection` skills whose job is to document ids. Those ids are kept correct ("staleness-corrected") rather than replaced with variables, because a variable would hide the live value the connection skill exists to record.

## Mechanizing the invariant: dead-link and frontmatter tooling

The spec enforces the invariant with a custom lint (doc 06 and the README), but the dig surveyed general-purpose tools that solve adjacent problems. All are weak backing; none is the tool the spec uses.

- **Link checking.** markdown-link-check extracts every link from markdown text and reports whether each is alive or dead [GitHub - tcort/markdown-link-check: checks all of the ...](https://github.com/tcort/markdown-link-check) (clef weight: 0.0448) (weak backing, clef weight < 0.5); md-link-linter iterates every markdown file under a path checking link validity [GitHub - norberttech/md-link-linter: CLI tool that iterates ...](https://github.com/norberttech/md-link-linter) (clef weight: 0.0529) (weak backing, clef weight < 0.5). Both check reachability, which is necessary but not sufficient: a `session/` path can be reachable during authoring and still violate the invariant.
- **Markdown static analysis.** markdownlint-cli is an AST-based static analyzer for Markdown and CommonMark syntax anomalies [Overview: Markdown Static Analysis and Linting](https://thedocumentation.org/markdownlint-cli/) (clef weight: 0.0577) (weak backing, clef weight < 0.5), and a curated list catalogs static analysis tools across languages and config files [GitHub - analysis-tools-dev/static-analysis: ⚙️ A curated list of static analysis (SAST) tools for all programming languages, config files, build tools, and more. The focus is on tools which improve …](https://github.com/analysis-tools-dev/static-analysis) (clef weight: 0.0754) (weak backing, clef weight < 0.5).
- **Frontmatter validation.** The boundaries require that YAML frontmatter still parses after edits. python-frontmatter loads YAML, JSON, or TOML frontmatter from text documents [python-frontmatter · PyPI](https://pypi.org/project/python-frontmatter/) (clef weight: 0.1247) (weak backing, clef weight < 0.5); remark-lint-frontmatter-schema validates frontmatter against a JSON Schema [GitHub - JulianCataldo/remark-lint-frontmatter-schema: Validate your ...](https://github.com/JulianCataldo/remark-lint-frontmatter-schema) (clef weight: 0.0638) (weak backing, clef weight < 0.5); a blog post walks through validating YAML frontmatter with JSON Schema for automation [Validating YAML frontmatter with JSONSchema · Form and Function](https://ndumas.com/2023/06/validating-yaml-frontmatter-with-jsonschema/) (clef weight: 0.1157) (weak backing, clef weight < 0.5); a skills listing describes the same pattern [validate-md: Validate Markdown YAML frontmatter against JSON Schema ...](https://skills.rest/skill/validate-md) (clef weight: 0.1126) (weak backing, clef weight < 0.5); and a Stack Overflow answer shows JSON Schema validating a sizable subset of YAML [Validating a yaml document in python - Stack Overflow](https://stackoverflow.com/questions/3262569/validating-a-yaml-document-in-python) (clef weight: 0.0424) (weak backing, clef weight < 0.5).

What none of these tools capture is the semantic distinction the invariant draws. A link checker sees `session/r15/scorer_v2.py` and `refs/visco-falsification-2026-10-06.md` as two paths; the invariant sees one ephemeral citation and one repo-truth citation. That is why the spec's enforcement classifies paths into named classes rather than testing reachability.

## Consequences for authors

1. When citing a durable input, use `yubi-OS/<repo>/<path>` or a repo-relative path.
2. When describing where output lands, use runtime-capture language with `session/`.
3. When an artifact exists only as session history, annotate it `(session artifact, not repo-truth)`.
4. Never hardcode a connection id outside a `-connection` skill.
5. Never hardcode a space dirName such as `personal-<id>` in operative instructions; refer to the role.

A music video [Static ft. Hatsune Miku - YouTube](https://www.youtube.com/watch?v=KlTNKOnfXFk) (clef weight: 0.0141) (weak backing, clef weight < 0.5) in the dig was noise and supports nothing here.

## Sources Considered

All 10 Clef-weighted searXNG results from `dig_context_01.json`. Weight >= 0.5 is authoritative backing; < 0.5 is weak backing.

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | GitHub - tcort/markdown-link-check: checks all of the ... | https://github.com/tcort/markdown-link-check | 0.0448 | weak backing (< 0.5) |
| 2 | Overview: Markdown Static Analysis and Linting | https://thedocumentation.org/markdownlint-cli/ | 0.0577 | weak backing (< 0.5) |
| 3 | GitHub - norberttech/md-link-linter: CLI tool that iterates ... | https://github.com/norberttech/md-link-linter | 0.0529 | weak backing (< 0.5) |
| 4 | GitHub - analysis-tools-dev/static-analysis: ⚙️ A curated list of static analysis (SAST) tools for all programming languages, config files, build tools, and more. The focus is on tools which improve … | https://github.com/analysis-tools-dev/static-analysis | 0.0754 | weak backing (< 0.5) |
| 5 | Static ft. Hatsune Miku - YouTube | https://www.youtube.com/watch?v=KlTNKOnfXFk | 0.0141 | weak backing (< 0.5) |
| 6 | python-frontmatter · PyPI | https://pypi.org/project/python-frontmatter/ | 0.1247 | weak backing (< 0.5) |
| 7 | GitHub - JulianCataldo/remark-lint-frontmatter-schema: Validate your ... | https://github.com/JulianCataldo/remark-lint-frontmatter-schema | 0.0638 | weak backing (< 0.5) |
| 8 | validate-md: Validate Markdown YAML frontmatter against JSON Schema ... | https://skills.rest/skill/validate-md | 0.1126 | weak backing (< 0.5) |
| 9 | Validating YAML frontmatter with JSONSchema · Form and Function | https://ndumas.com/2023/06/validating-yaml-frontmatter-with-jsonschema/ | 0.1157 | weak backing (< 0.5) |
| 10 | Validating a yaml document in python - Stack Overflow | https://stackoverflow.com/questions/3262569/validating-a-yaml-document-in-python | 0.0424 | weak backing (< 0.5) |
