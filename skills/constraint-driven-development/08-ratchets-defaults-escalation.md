# Ratchets, sane defaults, and the escalation path

Scope: Step 7, the Sane Defaults table, and the Escalation Path section. Primary source: the skill's Step 7, Sane Defaults, and Escalation Path sections.

## Ratchets: when you do not have a number

The source doc's setup: set 80 percent coverage on a codebase at 62 percent and you get a red build forever, then a team that learns to ignore red builds. The alternative asks for no decision: record where you are, then refuse to get worse. Put it in the measured-not-enforced table with today's value and a direction; every check compares against the recorded value, not an aspiration. When a number improves, update it; when it drops, that is the finding (source doc).

The doc also answers the training objection with this mechanism: models are rewarded for passing tests, which you can evaluate in seconds; architectural rot shows up over months and never reaches the weights. A ratchet is the missing penalty, written down where the build can see it (source doc).

The ratchet pattern has independent practice history: TestDouble's write-up describes ratcheting lint and complexity constraints down to zero incrementally, one number at a time, so the build never goes red on day one (https://testdouble.com/insights/ratcheting-to-zero-how-incremental-constraints-eliminate-technical-debt, jev weight 0.43, weakly backed), and an open-source rules engine documents a ratchet predicate that compares a metric against a stored baseline and fails only on regression (https://github.com/kazi-org/kazi/blob/main/docs/ratchet-predicate.md, jev weight 0.36, weakly backed). For the performance numbers that feed the defaults table, the Core Web Vitals thresholds the source doc adopts (LCP at most 2500 ms, CLS at most 0.1) are the standard 2026 good thresholds (https://www.corewebvitals.io/core-web-vitals, jev weight 0.21, weakly backed).

## Sane defaults

The source doc's table, chosen to be met by most codebases on day 1, with the why-this-number rationale inline (source doc): coverage of changed lines at 80 percent or more (high enough to force a test, low enough to allow a config line); project coverage at today's value, must not fall (no argument needed to adopt); mutation score at 60 percent or more to start if used (typical for a suite never mutated before; 80 percent is mature); no dependency vulnerabilities at high or above (below that is mostly noise); LCP at most 2500 ms and CLS at most 0.1 (Core Web Vitals good threshold); zero critical or serious axe violations (moderate and minor are often debatable); exception lifetime of 90 days (long enough to plan the fix, short enough to remember); ratchet tolerance of 0.5 percent (absorbs drift when an unrelated file moves the number). The closing rule: state the number and the reason together; a threshold without a rationale gets deleted by the next person who hits it (source doc).

## Escalation path

Constraints work at 3 levels of teeth; start at the first (source doc):

1. Written only. `CONSTRAINTS.md` exists and agents read it. Costs nothing, catches honest mistakes, relies on the agent complying.
2. Scripted. An `npm run check` (or `make check`) that runs the fast checks, wired into the agent's post-edit hook and CI. Deterministic, no new dependency.
3. Tool-backed. A dedicated runner that handles diff scoping, budgets, ratchets, and the guard checks, used when the config outgrows a shell script. The floor-guard reference from 07 is the starting point for the guard-checks half.

Most projects should stop at level 2; move to level 3 past about 30 lines of check-running shell (source doc). Two operational notes close the section: a first run can be floor-only, because the floor guard is diff-only and needs no installs, so the floor is enforceable on day 1 with numbered dimensions added as each tool lands; and security tools that install machine-wide (gitleaks, osv-scanner) can run CI-only to keep laptops clean, with the `Runs at` column declaring where each dimension fires (source doc).
