# 03 - Action SHA Pinning Discipline

Scope: The full-length SHA pinning discipline across the 24 yubiOS workflow files, the PINNED.md allowlist as source of truth, and the 8 stale checkout references that drift from it.

## The discipline

Across the 24 workflow files there are 65 total `uses:` lines. Every one carries either a 40-character hex commit SHA or a `sha256:` digest. Floating refs (`@v4`, `@main`, `@latest`): 0. Unpinned refs: 0.

GitHub's own security guidance is the anchor for why this matters: pinning dependency versions to a specific commit SHA prevents malicious code added to a new or updated branch or tag from entering the workflow (source: https://github.blog/changelog/2025-08-15-github-actions-policy-now-supports-blocking-and-sha-pinning-actions, weight 0.89). GitHub has since shipped organization-level policy support that blocks and requires SHA pinning, and any workflow using an unpinned action fails under the policy (source: https://github.blog/changelog/2025-08-15-github-actions-policy-now-supports-blocking-and-sha-pinning-actions, weight 0.89). The official secure-use reference states that pinning to a commit SHA is the most secure option, with tag pinning only acceptable where the creator is trusted (source: https://docs.github.com/en/actions/reference/security/secure-use, weight 0.97). Community tooling exists to enforce the same rule mechanically, failing workflows that reference third-party actions at tags or branches (source: https://github.com/zgosalvez/github-actions-ensure-sha-pinned-actions, weight 0.62; source: https://github.com/marketplace/actions/enforce-full-sha-commit-pinning-in-github-actions, weight 0.75).

## The allowlist

The authoritative pin list is `/PINNED.md` in the repo (blob `2581269d96d2c1a83549de61754028fcdc568b2c`, 10937 bytes). Two of its entries lead the live workflows:

- `actions/checkout` at `3d3c42e5aac5ba805825da76410c181273ba90b1` (v7.0.1).
- `dhi.io/debian-base` at the multi-arch OCI index digest `sha256:9d293dad...`.

The upstream action is the standard checkout action that places the repository under `$GITHUB_WORKSPACE`, fetching a single commit by default (source: https://github.com/actions/checkout, weight 0.95); its releases page tracks the tagged versions behind those SHAs (source: https://github.com/actions/checkout/releases, weight 0.91).

## The drift

Against the allowlist, the audit found:

- Superseded SHAs: 8, all `actions/checkout@de0fac2e4500...` (v6.0.2).
- Workflows containing them: 5, namely `ci_fork_bcvk.yml` (2 occurrences), `ci_fork_edk2.yml` (1), `ci_fork_mkosi.yml` (3), `ci_fork_optee-os.yml` (1), and `ci_test_sealed-uki-vm.yml` (1).
- 30 of the 38 in-repo checkout uses already sit at the v7.0.1 SHA, so the drift is a tail, not a pattern.

The stale workflows are the fork-CI set plus the sealed-UKI-VM stub. Nothing in the audit indicates the v6.0.2 references are wrong builds; the problem is consistency: the allowlist says v7.0.1 is the approved pin, and 8 call sites still resolve to the previous release. Practitioner notes describe the same hazard in reverse: when pinning is enforced late, organizations discover some major tags were several versions behind the pinned SHA (weak backing: https://dev.to/jjoyneriv/i-pinned-31-github-actions-to-commit-shas-one-major-tag-was-two-versions-st, weight 0.11).

## Why full length matters

Full-length SHA pinning makes an action reference an immutable release; pinning to a particular SHA means an attacker would need to generate a SHA-1 collision for a valid Git object to backdoor the action (weak backing: https://stackoverflow.com/questions/78903499/how-do-i-pin-an-action-to-a-specific-sha, weight 0.09). A dedicated maintainer write-up documents how GitHub's organization policy suddenly blocks users who pinned to short forms, which is why full length is the portable choice (source: https://www.romainlespinasse.dev/posts/github-actions-commit-sha-pinning/, weight 0.77).

## Enforcement direction

The org-level trajectory matches where the platform is going. GitHub's policy feature now checks for a full commit SHA and fails any workflow that uses an unpinned action, which turns the discipline from convention into gate (source: https://github.blog/changelog/2025-08-15-github-actions-policy-now-supports-blocking-and-sha-pinning-actions, weight 0.89). A maintainer of a widely used action documents what that policy looks like from the other side: organizations enabled it and users of short or tag pins were suddenly blocked, so full-length pinning is the only portable form under enforcement (source: https://www.romainlespinasse.dev/posts/github-actions-commit-sha-pinning/, weight 0.77). yubiOS gets ahead of that by pinning at full length everywhere, with the only remaining work being the tail of 8 superseded SHAs rather than any structural gap.

## Takeaway

The yubiOS fleet is already at the strongest pinning posture: zero floating refs, every uses pinned, a single authoritative allowlist. The remaining work is mechanical: roll the 8 stale v6.0.2 SHAs in 5 workflows to the v7.0.1 SHA, which is exactly the fix the deep dive recommends. The allowlist discipline works; the tail of stale references shows that allowlist compliance needs a periodic re-scan, not one-time enforcement.
