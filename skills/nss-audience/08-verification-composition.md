# Verification checklist and composition with the other NSS axes

**Scope:** the skill closes with an 8-point verification checklist that makes an audience sweep falsifiable, and a composition table that places the Audience axis inside the negative-skill-space system.

## The 8 verification checks

The verification section of the source doc (yubi-OS/yubiOS skills/nss-audience/SKILL.md) lists what a completed sweep must satisfy:

1. Every file in scope has 1 inventory row with `path`, `primary_role`, `experience`, `interaction`, `mode`, `jobs`, `evidence`, `confidence`; files that genuinely cannot be classified use `unknown`, not a guess.
2. Every primary_role assignment cites at least 1 signal.
3. Every matrix cell is one of `served` / `partial` / `gap` / `n/a`, with at least 1 cited file path or front-matter tag.
4. CI/automation and incident_responder cells are explicitly scored, not folded into the developer cell.
5. Negative-space findings (missing prerequisites, missing recovery steps, missing exit codes) are listed as `partial` with the specific gap named.
6. The audience vocabulary is enforced: no free-form role names in front matter or in the matrix.
7. Any file tagged `mixed` carries a per-section note explaining which section serves which role.
8. Front matter is YAML-parseable via js-yaml; `audience` values match the vocabulary; `description` (if present) is 1 to 1024 chars with no literal `<` or `>`.

Checks 1 and 2 turn opinion into evidence, check 3 makes the matrix auditable, check 4 protects the machine-reader audience, and checks 6 to 8 make the output machine-checkable in CI (docs 06).

## The Google audience model as the grounding check

The sweep's role-plus-proximity decomposition traces to Google's technical writing course, which defines audience by roles and proximity to the subject matter (https://developers.google.com/tech-writing/one/audience, weight 0.69) and by existing knowledge and skills (https://developers.google.com/tech-writing/one/audience, weight 0.70). The course targets engineers writing documentation without requiring prior technical-writing training (https://developers.google.cn/tech-writing/one, weight 0.32, weak). A verification pass should be able to trace every dimension of the model back to such a source: role and proximity to Google, mode to Diataxis, interaction and the machine-reader split to DITA's audience metadata.

## MADR as the ADR audience convention

The composition table routes `documentation-and-adrs` as the supplier of the ADR and audience-tagged front-matter convention (source doc). MADR, the Markdown Architectural Decision Records format, captures each decision and its rationale in a lean markdown structure (https://adr.github.io/madr/, weight 0.36, weak; https://github.com/adr/madr, weight 0.42, weak), and structured MADR variants add an `audience` field to the template (source doc). The MADR template has been widely adopted since 2017 (https://www.ozimmer.ch/practices/2022/11/22/MADRTemplatePrimer.html, weight 0.14, weak), which matters for verification: an ADR's audience declaration should follow a template the corpus can parse, not ad-hoc prose.

## Composition: where the Audience axis sits

The source doc's composition table fixes 7 relationships (source doc):

| Skill or channel | Relationship | Direction |
|---|---|---|
| negative-skill-space | supplies the 12-axis framework and the Extend / Pair / Accept taxonomy; this skill specializes the Audience axis | negative-skill-space to nss-audience |
| documentation-and-adrs | supplies the ADR and audience-tagged front-matter convention; this skill drives its audience taxonomy | nss-audience to documentation-and-adrs |
| internal-big-picture | supplies the 10-primitive yubiOS framework; audience-tagged front matter is 1 primitive-coverage channel | bidirectional |
| single-action-curve-rsi | consumes the Extend-gap list this skill emits and applies 1 atomic primitive flip per file | nss-audience to single-action-curve-rsi |
| recursive-self-improvement | uses this skill to audit its own audience coverage (skill authors, maintainers, CI runs, integrators all read SKILL.md) | nss-audience to recursive-self-improvement |
| curve-compass-skill / curved-corpus-create | supply the lens-format patch generator; this skill feeds them audience-axis lenses | nss-audience to curve-compass-skill |
| github-api | the only network touchpoint: pushes the audit log and updated audience tags to the repo | nss-audience to github-api |

## Cross-checking the other axes

Guideline 8 orders the sweep: a file with no audience signal often also has no `Assumption set` (the audience assumes a reader but never says which one) and no `Mode` (tutorial mixed with reference mixed with runbook). Fix the Audience axis first; the other axes follow (source doc). That ordering is why the audience axis is first of the 12: it is the cheapest to fix and the most load-bearing for the rest.

## Provenance of this skill

The source doc's changelog dates v1.0.0 to 2026-08-12 and lists its synthesis sources: the Google Technical Writing audience model (role plus proximity plus required knowledge), DITA audience/experience/job profiling with machine-readable metadata and conditional processing, Diataxis (mode as a separate axis from audience), Doc Detective persona-driven strategy with primary persona and Critical User Journey, GitBook persona plus jobs-to-be-done patterns, Temporal's 2021 documentation information architecture redesign with per-persona landing pages, the Ductile audience matrix (human/agent x coder/operator x learner/expert, 8-cell coverage), and docs-as-code front-matter enforcement via Docusaurus tags, GitHub Docs YAML front matter, and structured MADR `audience` fields (source doc). It shipped as cycle 8 of rsi-compass with about 40 audience-aware incremental patches on PR #207, and was self-validated against its own checklist: js-yaml parseable front matter, name matching `^[a-z0-9-]+$`, description 1019 of 1024 chars, no literal `<` or `>`, and all expected sections present (source doc).
