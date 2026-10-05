# 01 Fork Pin Inventory: PINNED.md and the Upstream Map

Scope: maintaining the fork inventory and PINNED.md as the source of truth for pinned SHAs, plus the fork-to-upstream map file that drives the drift check.

## Why pins must be content addressed

A pin is only trustworthy if it identifies content, not a label. Once a commit exists in Git, its SHA cannot change without changing its content, so pinning to a SHA guarantees that the consuming workflow runs exactly the code the pinner expected (romainlespinasse.dev, weight 0.65). Tags and branch names are mutable: a tag can be deleted and re-pointed, a branch can be force pushed, and both silently change what a floating reference resolves to.

The security rationale is sharper for third party dependencies. Pinning to a particular SHA mitigates the risk of a bad actor adding a backdoor to a repository, because the attacker would need to generate a SHA-1 collision for the pin to keep resolving to malicious code (Stack Overflow, weight 0.06, weak backing). The same argument transfers to fork pins: a fork that tracks a branch name rather than a SHA can be manipulated by anyone with push access to that branch, and a drift check keyed on branch names cannot distinguish a legitimate upstream advance from a tampered one.

## Pin automation exists and is mature

Manual pin upkeep does not scale. mheap/pin-github-action is a tool that pins GitHub Actions dependencies to a specific SHA without requiring that every action be updated manually each time a newer version is wanted (github.com/mheap/pin-github-action, weight 0.76). gha-pinner takes an owner/repo@ref reference, tracks down where the ref points, and resolves it for pinning (github.com/sapasapasapa/gha-pinner, weight 0.47, weak backing).

These tools target action pins, but the underlying pattern, resolve a ref to a SHA and record the SHA, is exactly what a PINNED.md style inventory should automate for fork pins. The inventory update can be a script, and the daily drift check can flag pins that were recorded as floating refs instead of full SHAs.

## Inventory and policy are different files

The upstream-semantic-sync project demonstrates the split a fork drift system should copy. It keeps mappings.yaml, which maps upstream modules, symbols, and config keys to downstream equivalents, separate from decisions.yaml, which holds policy such as risk thresholds, skip lists, and PR settings, starting empty and growing as decisions accumulate (github.com/suanova/upstream-semantic-sync, weight 0.52).

Translated to fork drift, the split is three files, not two:

1. The upstream map lists one row per fork: fork name, upstream org/repo, upstream branch. Branches differ per upstream (main vs master), so the branch belongs in the map, not hardcoded in the script.
2. The pin file (PINNED.md) records the pinned SHA per fork. It is data, not policy.
3. The verdict policy (the commit-count threshold) is configuration, so it can be tightened over time without touching the map or the pins.

## What the pin must record

Commits save changes to files, track authorship, and organize project history on GitHub (docs.github.com commits reference, weight 0.62). Because the pin is a commit identity, the inventory should store the full 40 character SHA. Short SHAs work for humans and fail for machines: a 7 character prefix can become ambiguous as history grows, and the drift check compares equality between the pinned SHA and the upstream HEAD SHA, where a truncated SHA is a silent bug.

## Operational rules for the inventory

- One pinned SHA per fork, full SHA, in a single file the drift script parses. If the pin lives in a workflow env var in one repo and a markdown table in another, the check will read the stale one and report the wrong verdict.
- Keep the upstream map machine readable (YAML or JSON) so the script loops over it without parsing prose.
- Land pin changes through the same PR flow as code changes. The pin history then answers "when did this fork last sync" with no extra tooling.
- Treat a missing map row as a failed check, not a skipped fork. A fork present in the org but absent from the map is exactly the fork that drifts unnoticed.

## The concrete inventory shape

The schedule this corpus documents tracks 8 forks (arm-trusted-firmware, optee_os, optee_ftpm, u-boot, ms-tpm-20-ref, edk2-rk3588, bcvk, mkosi), each with its own upstream repo and upstream branch, pinned via PINNED.md (source schedule spec, OMN-160). At that scale the map file is 8 rows and one detection run is 8 upstream API calls, which is what makes a daily cron affordable. The inventory is the small, boring file that everything downstream (comparison, verdicts, issue filing) reads first.
