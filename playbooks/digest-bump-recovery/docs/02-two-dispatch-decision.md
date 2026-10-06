# 02 - Decision: two dispatches, never a hand-edited digest

Scope: the playbook's core decision, that recovery is two workflow dispatches (the fetches-group bump, then a builder re-dispatch at the new head), and why hand-editing the digest is forbidden.

Grounding spine: source doc yubi-OS/yubiOS playbooks/digest-bump-recovery.md. This is an internal-record subtopic (a CI group assignment and repo convention recorded in the playbook itself); it required no searXNG dig, and no dig was run.

## The decision

Two dispatches, never a hand-edited digest (source doc):

1. Dispatch `ci.yml` with `group=fetches`. The `fetch-fedora-bootc-manifest.yml` workflow re-resolves the pin against quay.io and bumps `Containerfile` + `PINNED.md` in one commit on `main` (source doc).
2. Re-dispatch the failed workflow (usually `ci_dev_image.yml`) at the new head (source doc).

That is the whole recovery. The playbook's verified ledger shows both halves in action: the fetch workflow rebuilt the image after incidents 1 and 2 (source doc, see doc 06), and the builder workflow was re-dispatched at the new head to consume it.

## Why the hand edit is forbidden

The source doc states the invariant directly: hand-swapping the digest breaks the `Containerfile`/`PINNED.md` invariant; the fetch workflow is the only thing that guarantees it (source doc). The repo carries the same pin in two places, the `Containerfile` FROM line and `PINNED.md`; a manual edit to one file leaves the other stale, and the next audit or verification pass reads the disagreement as an integrity problem. The fetch workflow's bump commit updates both in one commit, which is what makes the pair auditable (source doc, see doc 07 for the cost side of this tradeoff).

The invariant is also what makes the recovery self-verifying. Step 4 of the mechanism (doc 03) confirms the bump landed by listing the latest commit touching `Containerfile`; because the bump is a single commit that touches both files, that one check covers the whole invariant.

## The dispatch structure

The recovery rides the repo's CI orchestrator rather than a bespoke script. `ci.yml` is the orchestrator workflow, and `group=fetches` selects the fetch group inside it (source doc). The playbook's dispatch-discipline rules (doc 04) govern how these POSTs are issued: one dispatch per POST, and verification of the inner runs, not just the orchestrator run.

The second dispatch re-runs the workflow that originally failed. In the recorded incidents that workflow was `ci_dev_image.yml`, dispatched with `Docker_push=false` (source doc). Running at the new head means the build picks up the freshly bumped `Containerfile` from the bump commit rather than the dead pin.

## The standing directive behind the decision

The source doc records Jenny's standing directive: "stale image? just re-run the fetch group ci" (source doc). That directive is what elevates the two-dispatch procedure from "a fix that worked once" to a policy: any agent operating in self-mode should resolve a stale pin by dispatching the fetch group, without asking, and without improvising a manual edit that would be faster but would break the pin invariant.

Incident 3 of the verified ledger was recovered entirely in self-mode under that directive (source doc), which is the playbook's own evidence that the decision scales to unattended operation.

## What this doc adds beyond the source doc

Nothing external was needed here: the decision, the invariant it protects, and the standing directive are all internal records of the playbook and the repo it operates on. The only judgment this corpus adds is structural: the two dispatches are ordered (bump, then build at the new head), the bump is atomic across both pin files, and the atomicity is the reason the procedure is dispatch-only. Related external context on digest pinning workflows appears in doc 07, where the tradeoffs are grounded.
