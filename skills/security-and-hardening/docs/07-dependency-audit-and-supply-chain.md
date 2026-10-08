# 07: Dependency Audit Triage and Supply-Chain Hygiene

Scope: the decision tree for triaging `npm audit` findings by severity and reachability, and the supply-chain hygiene layer that audits do not cover: lockfiles, dependency review, typosquats, install scripts, and signature and provenance verification. Ground source: `yubi-OS/yubiOS skills/security-and-hardening/SKILL.md` (source doc).

## Triage by severity, then by reachability

The source doc's decision tree sorts audit findings in 2 passes. First by severity: critical and high findings require checking whether the vulnerable code is reachable in your app; if yes, fix immediately (update, patch, or replace the dependency); if the code is unreachable (dev-only dep, unused code path), fix soon but do not block the release. If no fix is available, check for workarounds, consider replacing the dependency, or add it to an allowlist with a review date. Moderate findings are fixed in the next release cycle if reachable in production, or tracked in the backlog if dev-only. Low findings ride along with regular dependency updates.

The 3 key questions the tree rests on: is the vulnerable function actually called in your code path; is the dependency a runtime dependency or dev-only; and is the vulnerability exploitable given your deployment context (a server-side vulnerability in a client-only app is not exploitable there). When a fix is deferred, the source doc requires documenting the reason and setting a review date.

The advisory database layer behind `npm audit` is public: the GitHub Advisory Database documents reviewed npm advisories and, separately, malware advisories (weight 0.81, https://github.com/advisories?query=type%3Areviewed+ecosystem%3Anpm and weight 0.79, https://github.com/advisories?query=type%3Amalware+ecosystem%3Anpm), and npm publishes its advisory listing at https://www.npmjs.com/advisories (weight 0.82). GitHub's documentation describes the advisory database as the vulnerability-reporting layer for GitHub's security features (weight 0.81, https://docs.github.com/en/code-security/concepts/vulnerability-reporting-and-management/github). GitHub's blog post on extending malware advisories beyond npm (weight 0.88, https://github.blog/security/supply-chain-security/how-we-took-malware-advisories-beyond-npm/) shows the ecosystem treating malicious packages as a distinct advisory class from CVEs, which matches the source doc's distinction between known-vulnerability audits and malicious-package detection.

## What audits cannot catch

The source doc is explicit: `npm audit` catches known CVEs; it will not catch a malicious or typosquatted package. Audits match known advisories and do not detect a newly malicious package or make unreviewed install scripts safe to execute. The typosquat examples are `cross-env` versus `crossenv` and `react-dom` versus `reactdom`. This maps to OWASP A06 (Vulnerable and Outdated Components) and, for the LLM-era packaging surface, LLM03 (Supply Chain).

## Hygiene rules

The source doc's hygiene rules, with the primary dig sources backing their external mechanisms:

1. **Commit the lockfile and install with `npm ci` in CI.** Reproducible builds, no silent version drift.
2. **Review new dependencies before adding them.** Maintenance, download counts, and whether they truly earn their place. Every dependency is attack surface.
3. **Be wary of `postinstall` scripts in unfamiliar packages.** They run arbitrary code at install time.
4. **Block dependency scripts before first execution.** Find the installation boundary and manager (the workspace root that owns the lockfile), corroborate `packageManager`, the lockfile, and CI, pin the manager version, then bootstrap with scripts disabled or a documented fail-closed policy, inspect pending script source, approve only the minimum required packages, commit the policy, and verify with a clean frozen or immutable install. Never blanket-approve scripts.
5. **Never apply forced audit remediation automatically.** `npm audit fix --force` can cross declared dependency ranges; preview the remediation, read changelogs, and test each upgrade.
6. **Verify registry signatures and provenance where supported.** The npm documentation covers generating provenance statements (weight 0.93, https://docs.npmjs.com/generating-provenance-statements/), verifying ECDSA registry signatures (weight 0.94, https://docs.npmjs.com/verifying-registry-signatures/), and attestations (weight 0.82, https://github.com/npm/documentation/attestations). The source doc adds the caveat: treat absence of signatures as a signal to investigate, not automatic proof of compromise. GitHub's npm package provenance announcement (weight 0.91, https://github.blog/security/supply-chain-security/introducing-npm-package-provenance/) explains the build provenance model behind these attestations.
7. **Anchor the whole chain in a supply-chain framework.** SLSA (Supply-chain Levels for Software Artifacts) is the reference framework for build integrity (weight 0.90, https://slsa.dev/ and weight 0.86, https://github.com/slsa-framework/slsa).

Weakly backed writeups (0.11 to 0.19: dev.to, toolsmint.com, safeguard.sh, apidog.com) converge on the same control stack, lockfiles, script blocking, provenance, and typosquat awareness; they corroborate but do not anchor any claim here.

## Where this sits in the skill's tiers

The checklist carries it: lockfile committed and CI installs with `npm ci`; new dependencies reviewed for maintenance, downloads, and postinstall scripts. The red flags list adds dependencies with known critical vulnerabilities as a review signal. The verification section requires `npm audit` to show no critical or high vulnerabilities before shipping.

## Provenance

Source doc claims: the full decision tree, the 3 key questions, the audit-versus-malicious-package distinction, the typosquat examples, and hygiene rules 1 through 7. Dig-backed claims: the advisory database surfaces (0.79 to 0.88), npm provenance and signature documentation (0.82 to 0.94), and the SLSA framework (0.90). Weakly backed corroboration (labeled): ecosystem blog walkthroughs at 0.11 to 0.22.
