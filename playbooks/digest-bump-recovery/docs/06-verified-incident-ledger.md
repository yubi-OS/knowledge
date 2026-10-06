# 06 - Verified incident ledger

Scope: the three verified recoveries the playbook records for the 2026-07-26 to 2026-07-30 window, their digests, commits, and what each exercised, plus the self-mode directive the third incident proved.

Grounding spine: source doc yubi-OS/yubiOS playbooks/digest-bump-recovery.md. This is an internal-record subtopic (a ledger of repo incidents and commits); it required no searXNG dig, and no dig was run.

## The ledger

The source doc marks the procedure "Verified working (2026-08-01)" and records three recoveries (source doc):

| # | Date | From then to | Commit |
|---|---|---|---|
| 1 (OMN-139) | 2026-07-26 | `sha256:f6b5b775…` (arm64 stream truncation at layer 16,045,778) then re-resolved | rebuilt via `fetch-fedora-bootc-manifest.yml` |
| 2 | 2026-07-29 | `f6b5b775…` to `sha256:1dcca7ac54b243bef0cf65bfca165fb4a514d7891854db216a4ab6cbc10215ff` | `8ccffa71` |
| 3 | 2026-07-30 | `1dcca7ac…` (404) to `sha256:c7e6b35744792c2fc22c6e345d8a820ca83e08b94819f6c06fad4048810c96be` | `d2646452` |

(source doc)

## What each incident exercised

Incident 1 (OMN-139, 2026-07-26) is the arm64 failure-class entry: the pin `sha256:f6b5b775…` failed not with a 404 but with an arm64 layer pull dying mid-stream, a stream truncation at layer 16,045,778 (source doc, see doc 01). The recovery path recorded is the fetch workflow itself: re-resolved, rebuilt via `fetch-fedora-bootc-manifest.yml` (source doc). This incident is the origin of the playbook's grouping rule that stream truncation belongs in the same playbook as the dead-digest 404, because the remedy is the same re-resolution.

Incident 2 (2026-07-29) is a clean bump: from `f6b5b775…` to `sha256:1dcca7ac54b243bef0cf65bfca165fb4a514d7891854db216a4ab6cbc10215ff`, landed in commit `8ccffa71` (source doc). This is the two-dispatch decision working as designed: the fetch workflow produced the bump commit, and the builder was re-dispatched at the new head.

Incident 3 (2026-07-30) is the dead-digest entry: `1dcca7ac…` returned 404, recovered to `sha256:c7e6b35744792c2fc22c6e345d8a820ca83e08b94819f6c06fad4048810c96be` in commit `d2646452` (source doc). Note that incident 2's target digest is incident 3's dead digest three days later, which is the concrete data behind the "good for days, not weeks" cadence rule (doc 01).

## The self-mode proof

The source doc records one operational fact about incident 3: it was recovered entirely in self-mode under Jenny's standing directive "stale image? just re-run the fetch group ci" (source doc). This is the ledger's most load-bearing row: it demonstrates that the full procedure (confirm dead pin, dispatch fetches, verify inner runs, confirm bump, re-dispatch builder) runs unattended without surfacing a blocker to the human operator, which is exactly what the source doc's context section demands (source doc, see doc 01).

## Anchors the ledger fixes in place

The ledger pins the identifier trail an auditor needs (source doc):

- Linear issue OMN-139 for the original arm64 truncation incident.
- Commit `8ccffa71` for the 2026-07-29 bump.
- Commit `d2646452` for the 2026-07-30 bump.
- Commit `95565a0e` for the dev-tag fix of the same window (doc 05).

Together with the workflow names (`fetch-fedora-bootc-manifest.yml` as the recovery tool, `ci_dev_image.yml` as the usual re-dispatched builder), these anchors make the ledger reproducible: each row can be traced to its Linear item, its commit, and the workflow that executed it.

## Why a ledger belongs in a playbook

A recovery playbook that cannot show past successes is a hypothesis. The "Verified working (2026-08-01)" heading is the source doc's own claim marker (source doc), and the three rows are its evidence. The ledger also serves the maintenance loop: when the next stale pin fires, the agent compares the new incident against these rows to confirm it matches the known failure classes before running the procedure, and appends the new row when the recovery verifies.

## What this doc adds beyond the source doc

Nothing external was needed: the ledger, its dates, digests, commits, and the self-mode directive are all internal records of the source doc. The corpus adds only the cross-row reading above: the three rows are not independent anecdotes but a 7-day sequence that (a) established both failure classes, (b) produced two bump commits, and (c) proved the procedure in self-mode.
