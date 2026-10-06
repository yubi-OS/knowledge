# Tooling per dimension

Scope: Step 4, the install-what-each-dimension-needs table, the five gotchas, and the check:fast / check:task / check:full script mapping. Primary source: the skill's Step 4 section.

## De facto tools, not invented checkers

The source doc's rule: picking a dimension means installing something; do not leave the user with a number and no mechanism, and do not invent your own checker when a de facto one exists. The listed tools are the ones whose rule formats and thresholds the ecosystem targets, so the team's existing config keeps working (source doc). The mapping: tsc for TypeScript types, mypy for Python types, the existing linter config for lint, the test runner for coverage (vitest or jest on JS, pytest-cov on Python), Semgrep for code security, gitleaks for secrets, osv-scanner for dependencies, Lighthouse for page performance, size-limit for bundle budgets, axe-core for accessibility, dependency-cruiser for architecture boundaries, and Stryker for mutation-based assertion quality (source doc).

The dig corpus confirms the centrality of the security tools: Semgrep's own documentation introduces it as lightweight static analysis for finding bugs and enforcing code standards (https://docs.semgrep.dev/introduction, jev weight 0.39, weakly backed), and community security-pipeline curricula put gitleaks and osv-scanner in the same gate layer (https://github.com/rezmoss/awesome-security-pipeline, jev weight 0.09, weakly backed). On the web side, Chrome's Lighthouse documentation positions it as the standard automated page-quality tool for performance, accessibility, and SEO audits (https://developer.chrome.com/docs/lighthouse/, jev weight 0.29 from the attempt-1 dig, weakly backed), and a 2026 comparison of axe-core and Lighthouse treats them as complementary accessibility instruments rather than competitors (https://inferensys.com/comparisons/ai-powered-media-and-document-accessibility/axe-core-vs-lighthouse, jev weight 0.13, weakly backed).

## The five gotchas

From the source doc, verbatim in substance (source doc):

1. `--redact` on gitleaks is not optional. Without it the matched secret lands in the agent's transcript, which is how a leaked key ends up in a log, a summary, or a commit message. Report the rule and the location, never the value.
2. Lighthouse and axe need a URL. They only work against a running app, so they belong in the runtime stage against a preview deploy or a local server. If the project has no URL to hit, say so and drop the dimension rather than inventing a check that cannot run.
3. Scope the expensive ones to the diff. `stryker run --mutate` on the whole repo takes hours and gets turned off; on the files a change touched it takes under a minute. Semgrep also takes a path list.
4. Coverage needs no second test run. Read the lcov the suite already writes and intersect it with `git diff`. Running the suite twice is the fastest way to make people hate this.
5. Semgrep's registry rules are free to run, but check the licence before redistributing them. `opengrep` is a drop-in fork with the same rule format and JSON output if that matters to a legal team.

## The script mapping

The source doc wires everything into 3 npm scripts (source doc): `check:fast` runs `tsc --noEmit && eslint . && gitleaks detect --redact --no-banner` and is what runs after an edit; `check:task` adds `vitest run --coverage` and is what runs when the agent thinks it is done; `check:full` adds `semgrep scan --config p/default && osv-scanner scan source -r .` and is what runs in CI. The doc's summary: that mapping matters more than the tools (source doc). The escalation section (08) turns the same progression into written-only, scripted, and tool-backed levels of teeth.
