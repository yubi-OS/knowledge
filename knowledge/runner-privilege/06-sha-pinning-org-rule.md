# SHA pinning as the org rule for GitHub Actions references

Scope: why every GitHub Actions reference is pinned to a full 40 character commit SHA rather than a tag or branch, what mutable references enable, and how the rule is enforced and maintained.

## The threat: mutable references

A workflow's `uses:` field names the code that will execute on your runner. When that reference is a tag or branch, it is mutable: the identifier a workflow references is decoupled from the code that actually executes, because a tag can be moved to any commit (https://nhimg.org/faq/why-do-mutable-github-action-tags-create-so-much-risk-in-a-supply-chain-attack/, w 0.33). An attacker who can move the tag (by compromising the upstream repository or by publishing a hijacked version under the same tag) changes what every dependent workflow runs, without touching a single workflow file. AppSec writeups of real incidents describe exactly this shape: a step referencing its action by a mutable tag or branch name rather than a SHA is the vulnerability (https://orbisappsec.com/blog/how-mutable-action-tag-vulnerabilities-happen-in-github-actions, w 0.24).

Commentary sources attribute the 2025 tj-actions incident to mutable tags and note that implicit trust in the actions/ namespace extended to third-party namespaces (https://www.softwareseni.com/hardening-github-actions-workflows-from-mutable-tags-to-runtime-monitoring/, w 0.16). The weight is low; the structural claim is independently supported by the higher-weight sources above.

## The control: full-length SHA pinning

GitHub's official guidance is to proactively limit the impact of a compromised dependency by pinning dependency versions to a specific commit SHA, and its Actions policy service now supports blocking and SHA pinning actions at the organization level (https://github.blog/changelog/2025-08-15-github-actions-policy-now-supports-blocking-and-sha-pinning-actions/, w 0.95). The recommendation is specifically for full-length commit SHAs on third-party actions, paired with automated updates via Dependabot so that pinning does not freeze the dependency forever (https://zkamvar.github.io/pinsha/, w 0.73).

An organizational policy can make this mandatory rather than customary: GitHub's organization-level policy supports making SHA pinning a requirement for workflows (https://www.romainlespinasse.dev/posts/github-actions-commit-sha-pinning/, w 0.74). Enforcement tooling exists at the workflow level as well: the Enforce Full SHA Commit Pinning action fails any workflow that references a third-party action by tag or branch instead of a full SHA (https://github.com/marketplace/actions/enforce-full-sha-commit-pinning-in-github-actions, w 0.68). Platform-level automation such as Minder can pin third-party actions automatically across a fleet of repositories (https://stacklok.com/blog/automating-security-for-github-actions-in-minder, w 0.44).

## Why 40 characters

A full-length commit SHA is content addressing: it names exactly one immutable object in the upstream repository's history. Short SHAs preserve the property in practice but leave a (small) collision surface; branch and tag names preserve none, since their mapping to commits is under the upstream author's control. The 40 character form also survives tag deletion and repository restructuring: the commit remains resolvable even after mutable references rot. This immutability is what makes the pin auditable: a workflow diff that changes a SHA is a reviewable supply-chain event, while a diff that changes a tag name may or may not change the executed code at all.

## Maintenance discipline

Pinning without updating is a tradeoff: it freezes the code at a known-good commit but accumulates drift from upstream fixes. The documented pattern resolves this by pairing the pin with Dependabot, which opens pull requests that bump the SHA when upstream advances, keeping every bump a reviewable diff (https://zkamvar.github.io/pinsha/, w 0.73). A practical guide to the combination walks through converting uses: from mutable tags to commit SHAs and keeping them updated with Dependabot as supply-chain hardening practice (https://tomodahinata.com/en/blog/dependabot-github-actions-sha-pinning-supply-chain-security-guide, w 0.23).

## As an org rule

As an organization-wide rule, SHA pinning serves the runner privilege stack directly: every action referenced by a SHA is code whose identity was reviewed once and cannot silently change. On self-hosted runners this matters more than on hosted ones, because the code executes on persistent infrastructure you own. The rule converts an ongoing, undetectable risk (tag moves) into a visible, reviewable one (SHA bumps in PRs), which is the correct shape for a control on a trust boundary.

## Summary

Mutable action references decouple the workflow's identifier from the executed code (w 0.33, w 0.24). GitHub recommends pinning to full commit SHAs and ships org-level policy support for blocking and SHA pinning (w 0.95); full-length SHA plus Dependabot keeps pins current (w 0.73); enforcement tooling exists at workflow (w 0.68) and platform (w 0.44) levels. The org rule turns silent supply-chain drift into reviewable diffs.
