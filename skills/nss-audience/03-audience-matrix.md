# The audience x job x artifact coverage matrix

**Scope:** the central NSS output is a matrix with role rows and job columns, each cell scored `served` / `partial` / `gap` / `n/a`, prioritized by importance x task-risk x evidence-of-demand x (1 - coverage).

## The cell is the unit, not the file

Guideline 4 of the skill is score the cell, not the file (source doc: yubi-OS/yubiOS skills/nss-audience/SKILL.md). A file can serve a role weakly: the file exists but the arrival path is missing, so the cell is `partial`, not `served`. A page that names a role but lacks the job's prerequisites, expected result, or failure path is `partial`. A page that names the role and provides all 3 is `served`. Anything else is a gap.

The matrix in the source doc crosses 8 roles (end_user, developer, operator, ci_automation, maintainer, incident_responder, architect, support) against 8 jobs (install, configure, deploy, monitor, troubleshoot, migrate, recover, maintain) with cells ranging from `served` to `gap` to `n/a`. Two structural rules stand out in the example: the incident_responder row is `n/a` for install and configure (an incident responder does not install the system), and ci_automation is scored separately from developer, never folded into it (source doc).

## Cell scoring needs evidence, not vibes

Guideline: don't ship a matrix without evidence. Every cell needs at least 1 cited file path or front-matter tag (source doc). A matrix without evidence is opinion, not analysis. This is why the inventory (doc 02) comes first: the matrix aggregates inventory rows, and a cell claim can be traced back to the rows that justify it.

The red-flag table turns this into a self-check: an audience matrix showing `served` everywhere with no `partial` or `gap` means the sweep is under-counting and must be re-run with stricter criteria (source doc). A fully green matrix is a sign of a broken audit, not a healthy corpus.

## Prioritization: risk x demand x (1 - coverage)

Each cell is scored by importance x task-risk x evidence-of-demand x (1 - coverage) (source doc). High-risk operator, incident, and CI cells get priority even when demand analytics are sparse. Guideline 5 says prioritize by risk x demand x (1 - coverage), not by missing-file count: an operator/recover gap is higher priority than an end_user/evaluate gap even when both files are missing, and a single served page beats 5 partial ones (source doc).

The formula's components map to standard analysis practice. Gap analysis in enterprise architecture highlights services and functions that were accidentally left out, deliberately eliminated, or are yet to be developed, and it is conducted against a baseline and target state (https://www.opengroup.org/architecture/togaf7-doc/arch/p2/ta/ta_gapan.htm, weight 0.63). The 1 - coverage term is that gap-analysis move applied per cell: coverage is "does the reader reach a complete, current path?", not "are there N files?" (source doc).

The demand side borrows from jobs-to-be-done: users hire a product to get a specific job done (https://www.nngroup.com/articles/personas-jobs-be-done/, weight 0.40, weak), so evidence-of-demand is evidence that a reader role actually attempts that job against the corpus. Commercial tooling crosses the same axes: Liferay's Content Coverage Matrix is literally a grid crossing project personas against funnel stages (https://learn.liferay.com/w/content-marketing-platform/content-coverage-matrix, weight 0.48, weak), and accessibility audit tooling builds a coverage matrix by crossing every component with every audit criterion (https://a11y-matrix.com/, weight 0.09, weak).

## What partial means in practice

Negative space (doc 05) is where `partial` cells come from, and the source doc's examples name them concretely: a recovery page that exists without prerequisites or escalation is a partial cell; a CI page that exists without exit codes is a partial cell; a README that mentions "for end users" but never links to UI or install docs leaves the end_user/evaluate cell partial at best (source doc).

## CI and incident_responder are first-class rows

The checklist requires that CI/automation and incident_responder cells are explicitly scored, never folded into the developer cell (source doc). A CI workflow is read by GitHub Actions, not by humans browsing docs, so its audience is `ci_automation` with `interaction: machine` (source doc). Because those 2 roles carry the highest task risk, the risk-weighted formula will surface their gaps first, which is the intended behavior: the matrix exists to make the expensive failures visible, not to produce a balanced-looking heatmap.
