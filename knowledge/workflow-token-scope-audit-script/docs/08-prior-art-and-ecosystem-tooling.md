# 08 - Prior art: the Actions security tooling ecosystem

Scope: existing tooling for auditing GitHub Actions security and token scope (zizmor, actionlint, GHAS secret scanning, academic scanners) and how a purpose-built audit script complements them.

## zizmor: the closest general-purpose tool

zizmor is a static analysis tool for CI/CD systems that finds and fixes security issues in common CI/CD setups, including GitHub Actions, Dependabot, and pre-commit (https://github.com/zizmorcore/zizmor, weight 0.88). Its own documentation site opens with the same positioning: static analysis for your CI/CD, finding and fixing security issues (https://docs.zizmor.sh/, weight 0.92), with a quickstart that shows findings and an `--fix` mode for automatically fixing some of them (https://docs.zizmor.sh/quickstart/, weight 0.88). The project site describes scanning workflows and action definitions for potential vulnerabilities (https://zizmor.sh/, weight 0.73). Grafana Labs documents deploying zizmor at scale across their organization and sponsors the project's author William Woodruff (https://grafana.com/blog/how-to-detect-vulnerable-github-actions-at-scale-with-zizmor/, weight 0.63).

The category zizmor established is exactly the one a token-scope audit sits in: it flags excessive permissions among its findings, and it has become the reference example when the ecosystem discusses Actions security tooling (https://zizmor.sh/, weight 0.73).

## What the systematic comparison found

The academic landscape is mapped by a paper performing the first systematic comparison of 9 GitHub Actions Workflows security scanners, comparing them on scope (which security weaknesses they target), detection capabilities (how many weaknesses they detect), and engineering characteristics, across both academia and industry including GitGuardian's ggshield (https://arxiv.org/html/2601.14455v1, weight 0.86; v2 at https://arxiv.org/html/2601.14455v2, weight 0.76). The consolidated taxonomy from that work is the right lens for deciding what a purpose-built script should and should not do: scanners differ chiefly in scope and detection coverage, so a new tool earns its place by covering a gap, not by duplicating.

Practitioner comparisons reach similar conclusions from the buying side: the tooling splits into workflow scanning, runtime monitoring, and secrets detection, and evaluation should weigh supply-chain risk coverage (https://safeguard.sh/resources/blog/best-github-actions-security-scanning-tools, weight 0.13, weak backing, vendor buyer's guide). Community-maintained comparison lists exist but are frequently AI-generated and should be treated as leads rather than evidence (https://gist.github.com/johnbillion/bfd1bbe2527686894a4db2961037c664, weight 0.20, weak backing). A detailed independent comparison post covers the same ground (https://datosh.github.io/post/github_action_scanner/, weight 0.44, weak backing).

## Where the purpose-built script earns its keep

A general scanner answers "what security weaknesses does this workflow have?" A repo-specific token-scope audit answers a narrower question that general tools do not model: "given this repository's secret lifecycle decisions (which secrets are retired, which are allowlisted) and its permission doctrine (read-only default, per-job increases), is every workflow consistent with it?" The differences are concrete:

1. Policy-encoded secrets. zizmor-style tools have no knowledge that GH_TK was retired on 2026-07-29 by PR #148. The allowlist file is the mechanism that turns org-specific secret decisions into machine-checkable policy.
2. Repo-level permission doctrine. The JOB_LESS_PERMISSIVE_THAN_WORKFLOW check encodes a repo-wide rule (top-level grants should be the loosest used, never looser than jobs need) rather than a per-file heuristic.
3. Baseline diffing over time. The weekly scheduled run plus the summary block turn the audit into a drift tracker for this repository's 22+ workflows, a continuous property a point-in-time scanner run does not provide by itself.

Static analysis tooling for the adjacent concerns remains useful and complementary: scharf demonstrates automated fixing of mutable action tags to SHAs (https://github.com/cybrota/scharf, weight 0.71), OWASP's cheat sheet defines the manual review checklist the automation mirrors (https://cheatsheetseries.owasp.org/cheatsheets/GitHub_Actions_Security_Cheat_Sheet.html, weight 0.94), and GitHub's own platform features (secrets storage at repository, environment, or organization level) define the substrate all these tools inspect (https://github.com/features/actions, weight 0.81).

## Design lesson taken from the ecosystem

The comparison literature's core finding (scanners vary in scope and detection capability) implies the audit script should stay narrow and honest about its domain: parse, check declarations against policy, report findings with stable codes, exit by threshold. Anything broader (template injection detection, pinning enforcement, third-party action review) is already served by the ecosystem and duplicating it would add maintenance cost without coverage gain (https://arxiv.org/html/2601.14455v1, weight 0.86). The yubiOS script's scope (token scopes plus secrets references plus retired-secret catches) is chosen to occupy the gap between generic linting and org-specific policy.
