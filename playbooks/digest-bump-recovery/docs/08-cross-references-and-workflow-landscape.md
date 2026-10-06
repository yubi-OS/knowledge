# 08 - Cross-references and workflow landscape

Scope: the documents, issues, commits, and workflows the playbook anchors itself to, and where the digest-bump recovery sits in yubiOS's CI tooling.

Grounding spine: source doc yubi-OS/yubiOS playbooks/digest-bump-recovery.md. This is an internal-record subtopic (repo-internal references); it required no searXNG dig, and no dig was run.

## Documents

The source doc's "See also" line points at two targets in the yubiOS repo (source doc):

- `docs/BLOCKERS.md`, entry B-PINS: the blocker-class record for pin-related failures. A stale digest pin is the kind of recurring issue that lands in the blocker ledger; this playbook is the resolution procedure for it.
- `docs/BLOCKERS.md`, Permanent CI-Evidence Patterns: the collection of recurring CI evidence patterns the repo treats as standing knowledge, of which the digest-bump cycle is one instance.

Two refs documents are named as background (source doc):

- `refs/digest-bump-checklist-2026-07-25.md`: the checklist form of the bump procedure, dated 6 days before the playbook's verified window. It is the procedural ancestor of this playbook.
- `refs/fedora-bootc-base-images-status-2026-07-23.md`: the status record for the fedora-bootc base images whose pins the recovery re-resolves.

## Issue and commits

The playbook anchors the verified window to one Linear issue and three commits (source doc):

- Linear OMN-139: the original arm64 stream-truncation incident (ledger row 1, doc 06).
- `8ccffa71`: the 2026-07-29 bump commit.
- `d2646452`: the 2026-07-30 bump commit.
- `95565a0e`: the 2026-07-30 dev-tag fix, "ci(workflows): also push dev-<short-sha> tag in merge-manifest (fixes OMN-149 verify pull)" (doc 05).

## The workflow landscape

Five workflows carry the playbook's recovery (source doc):

| Workflow | Role |
|---|---|
| `fetch-fedora-bootc-manifest.yml` | the recovery tool: re-resolves the quay.io manifest and bumps `Containerfile` + `PINNED.md` in one commit |
| `fetch-dhi-manifest.yml` | the sibling fetch for dhi.io base images (the org's digest-pinned hardened-image registry) |
| `fetch-released-tag-ref.yml` | the sibling fetch for released-tag refs |
| `ci_dev_image.yml` | the builder that usually fails on a stale pin and is re-dispatched at the new head |
| `ci_test-fedora-bootc-arm64-pull.yml` | the arm64 pull test covering the stream-truncation failure class |

(source doc, roles per the source doc's context and cross-reference sections)

The reading: the repo keeps a fetch workflow per pinned upstream source (fedora-bootc on quay.io, dhi.io images, released tags), all dispatched through the `ci.yml` orchestrator's `group=fetches` (doc 02). The digest-bump recovery is the fedora-bootc instance of a general pattern, and `ci_dev_image.yml` plus the arm64 pull test are the consumers most exposed to pin staleness.

## Sibling playbook

The source doc cross-references one sibling playbook with a pointed instruction: dispatch-chain-verification, where "step 3 is not optional" (source doc). Step 3 of the recovery mechanism is the verify-the-inner-runs step (doc 03). The cross-reference makes the dependency explicit: the recovery's correctness depends on verifying the inner workflow runs, and the sibling playbook carries the fuller verification discipline.

## How the anchors fit the recovery flow

Each anchor family serves a different phase of recovery:

- During diagnosis: `docs/BLOCKERS.md` B-PINS tells the agent this failure class is known and pre-documented.
- During recovery: the workflow landscape says which workflow is the tool (`fetch-fedora-bootc-manifest.yml`) and which is the usual casualty (`ci_dev_image.yml`).
- During verification: dispatch-chain-verification supplies the run-verification discipline that step 3 depends on.
- After recovery: the commits and Linear issue let any later audit trace the bump commits and the incidents they resolved, feeding the evidence patterns in `docs/BLOCKERS.md`.

## What this doc adds beyond the source doc

Nothing external was needed: every cross-reference here is an internal record of the source doc. The corpus adds only the phase-mapping above, organizing the anchor list by when in the recovery flow each reference earns its keep.
