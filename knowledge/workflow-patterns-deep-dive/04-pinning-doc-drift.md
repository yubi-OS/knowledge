# 04 - Pinning Documentation Drift

Scope: How AGENTS.md and the in-repo github-actions skill drifted from the PINNED.md allowlist, why stale pin documentation is a supply-chain risk, and which allowlist entries the skill is missing.

## The two stale documents

AGENTS.md and the `github-actions` skill still document two superseded references:

- `actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd` (v6.0.2), while 30 of 38 in-repo uses are already at `3d3c42e5aac5ba805825da76410c181273ba90b1` (v7.0.1) per PINNED.md.
- `dhi.io/debian-base@sha256:9415967...` (v2026.03.14, per-arch), while all 21 container jobs use `sha256:9d293dad...`, the multi-arch OCI index digest.

Any agent or developer copy-pasting from the skill today re-introduces the superseded refs. The drift is not hypothetical: the 8 stale checkout SHAs found in 5 workflows (doc 03) are consistent with an older allowlist era, and the skill is the most likely source a fresh workflow author would consult.

## Why stale pin docs are dangerous

The OWASP GitHub Actions security cheat sheet lists as core guidance: always pin all action and reusable workflow versions with a commit hash and check for impostor commits, and use automated dependency update tools (source: https://cheatsheetseries.owasp.org/cheatsheets/GitHub_Actions_Security_Cheat_Sheet.html, weight 0.92). Hardening guides make the same point: set permissions explicitly, pin actions to SHAs, and replace static secrets with OIDC (source: https://devopsil.com/articles/2026-03-22-github-actions-security-hardening, weight 0.70). A documented pin that is no longer the approved pin undermines the control: the reader follows the documentation and lands on the superseded build.

Version-pinning literature frames the broader point: pinning versus floating is a security decision about which artifact a build resolves to, and pin management needs an owner (weak backing: https://vulert.com/blog/dependency-pinning-vs-floating-versions/, weight 0.50). Supply-chain guides similarly treat version pinning plus allowlisting as paired defenses against dependency substitution (weak backing: https://www.ox.security/academy/supply-chain-pbom/preventing-future-supply-chain-attacks-the-ox-guid, weight 0.63).

## The missing allowlist entries

The skill's allowlist is incomplete relative to PINNED.md:

- `actions/download-artifact@37930b1c2abaa49b...` is in PINNED.md but absent from the skill body. It is used in the workflows.
- `docker/setup-buildx-action@d7f5e7f5...` is also in PINNED.md and used in workflows, also absent from the skill.

An agent consulting only the skill would either avoid these actions or pin them to whatever it finds first, neither of which is allowlist-compliant.

## The mechanism of drift

The drift happened in the ordinary way: the fleet moved (checkout rolled to v7.0.1, the container digest rotated to the multi-arch index), PINNED.md was updated as the source of truth, but the prose documents that describe the pins were not regenerated. Two facts make the gap recoverable:

- The fix is a two-line edit per stale reference: bump the SHA and version comment in the skill body to match PINNED.md.
- The allowlist additions are two more entries.

The deep dive's recommended fix order puts the skill update first (priority 2, after the sealed-UKI-VM container restore) precisely because documentation is a high-fan-out influence: one stale skill line can produce a new stale workflow, which then takes a full audit cycle to find again.

## The parallel in adjacent ecosystems

The same drift-control problem shows up in package ecosystems with allowlists. npm 12 disables install lifecycle scripts by default and replaces them with an explicit `allowScripts` allowlist, with the allowlist itself becoming the reviewed, versioned artifact that gates what runs (weak backing: https://appsecbrief.com/articles/npm-12-install-scripts-allowlist-supply-chain-defense-guide-2026/, weight 0.22). The lesson transfers: the allowlist is only as trustworthy as the documents that describe it, and an un-regenerated doc describing an old allowlist state is a stale control. yubiOS's PINNED.md plays exactly that role for actions and container images; AGENTS.md and the skill are its derived documentation and must be regenerated whenever the source rotates.

## Takeaway

Treat the skill and AGENTS.md as generated artifacts of PINNED.md, not independent documents. Whenever the allowlist rotates a digest or rolls an action SHA, the same change must land in the prose, or the prose becomes the attack surface: the honest-looking reference that steers the next workflow onto a superseded build.
