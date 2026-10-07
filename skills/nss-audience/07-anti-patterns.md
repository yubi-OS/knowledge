# Anti-patterns: the traps that corrupt an audience sweep

**Scope:** the skill names 9 anti-patterns that make an audience analysis wrong in predictable ways, from folder-name classification to evidence-free matrices. Each has a concrete counter-rule grounded in the source doc.

## Classification traps

**Folder name is weak evidence.** `docs/deployment/` tells you nothing decisive: the file inside may target developers, operators, or CI (source doc: yubi-OS/yubiOS skills/nss-audience/SKILL.md). The evidence hierarchy (doc 02) ranks filename and directory second to last, above only author convention.

**Inferring audience from author.** The author is the maintainer; the audience is whoever the file is for, which may be operators or end users. Author bias is the most common Audience-axis error (source doc). Google's technical writing guidance frames the same rule positively: documentation provides the knowledge and skills the audience needs to perform a task, given the audience's existing knowledge and skills, so the reader's situation defines the classification (https://developers.google.com/tech-writing/one/audience, weight 0.70).

**Collapsing multi-role files to one role.** An ADR is read by maintainers, architects, and developers simultaneously. Saying `audience: maintainer` is wrong; `audience: [maintainer, architect, developer]` with a per-section note is right (source doc). DITA supports the multi-audience form natively: a topic can carry multiple `<audience>` elements, one per reader group (https://www.oxygenxml.com/dita/1.3/specs/langRef/base/audience.html, weight 0.76). Mixed is allowed; lying is not.

**Treating CI/automation as developers.** A CI workflow is read by GitHub Actions, not by humans browsing docs. Its audience is `ci_automation` with `interaction: machine`, not `developer` with `interaction: human` (source doc). Microsoft's style guide separates developer content into reference documentation and code examples as distinct content types (https://learn.microsoft.com/en-us/style-guide/developer-content/, weight 0.43, weak), which is the same separation instinct: content type follows reader, not convention.

## Evidence traps

**Reading "for users" in a header as audience analysis.** A header that says "for users" without role plus proximity plus job is documentation theatre (source doc). Either the file backs the claim with an explicit `## Audience` block or it is treated as `unknown`.

**No audience labels without evidence.** Every primary_role assignment must cite at least 1 signal: front matter, heading, executable artifact, inbound link, or directory convention. No signal means `unknown`, not a guess (source doc).

**Shipping a matrix without evidence.** Every cell needs at least 1 cited file path or front-matter tag; a matrix without evidence is opinion, not analysis (source doc).

## Scoring traps

**Counting partial pages as served.** A page that names a role but lacks the job's prerequisites, expected result, or failure path is `partial`. A page that names the role and provides all 3 is `served` (source doc). The distinction matters because scoring drives priority: an operator/recover gap outranks an end_user/evaluate gap, and a single served page beats 5 partial ones (source doc).

**Scoring by file count.** Coverage is "does the reader reach a complete, current path?", not "are there N files?" (source doc). Common documentation mistakes include mixing content types and unclear audience targeting (https://www.mintlify.com/blog/breaking-down-common-documentation-mistakes, weight 0.10, weak), and treating user docs and developer docs as the same type of content breaks both (https://gitdoc.ai/blog/user-docs-vs-developer-docs, weight 0.08, weak). The anti-pattern behind all of these is aggregation: averaging away the specific reader whose path is broken.

**Skipping the negative-space pass.** Counting missing files is half the work; the other half is asking what failure mode the corpus does not yet support for each role and job (source doc).

## The self-check

The red-flag table doubles as a post-sweep audit: if the matrix shows `served` everywhere with no `partial` or `gap`, the sweep is under-counting and must be re-run with stricter criteria (source doc). If every CI workflow file is tagged `audience: developer`, the tags are wrong, not the workflows (source doc). And if a file's inbound links land on a different audience's landing page, the page is unreachable for its stated audience: a routing bug, not a content bug (source doc).
