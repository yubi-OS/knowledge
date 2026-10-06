# 09 Cross-references map

Scope: the document graph around the recipe: where the authoritative records live, which runs and PRs matter, and which sibling playbooks bound the recipe's use.

This is an internal-record subtopic: every item below is cited from the source doc yubi-OS/yubiOS `playbooks/fido2-vm-e2e-recipe.md` (2026-08-01), Cross-references section. No external dig was run, and none is needed: the graph is the project's own.

## The authoritative chain description

`docs/BLOCKERS.md` in yubi-OS/yubiOS holds two entries the playbook points at (source doc):

- "Not Current Blockers" / `B-VM-CTAP2` RESOLVED: the authoritative description of the proven chain (doc 07).
- `B-REAL-FIDO2`: the open hardware-lane blocker that owns the 12 scenarios (doc 08).

`docs/BLOCKERS.md` also holds the Permanent CI-Evidence Patterns section the recipe references (source doc), which is where the skip-reading discipline of doc 04 is anchored.

## Runs

Three GitHub Actions runs are cited (source doc):

- 30139433902, job 89629762908: the anchor run proving the chain with no skips (doc 07).
- 29872832727: the run that retired `B-VM-SSH` and `B-VM-BOOTLOADER-UPDATE`.
- 29525332901: superseded ARM64 evidence, retained for history.

## PRs and Linear items

The fix history lives in PRs #125, #102, #144, and #137 (source doc). The two that the recipe's frozen decisions rest on are #102 (the `homectl` password-policy fix, plus a packaging attempt in the wrong build path) and #125 (the correct packaging fix in the production `Containerfile`), detailed in doc 06. Linear items: OMN-48 (Done, the `B-VM-CTAP2` resolution), OMN-42 and OMN-63 (the `B-REAL-FIDO2` scenarios) (source doc).

## refs/ archive documents

Six `refs/` documents in yubi-OS/yubiOS are cited as the archival layer behind the recipe (source doc):

- `refs/luks-fido2-e2e-test-2026-07-23.md`
- `refs/fido2-ci-emulator-status-2026-07-23.md`
- `refs/bcvk-swtpm-ci-2026-07-23.md`
- `refs/vm-e2e-run-29525332901.md`
- `refs/yubikey-hw-validation-scenarios-2026-07-25.md`: the 12 scenarios of doc 08
- `refs/zboot-workaround-runner-qemu-audit-2026-07-25.md`: the B-QEMU-ZBOOT workaround, still required at the time of the source doc

## ADRs

Three ADRs are cited: ADR-003, ADR-026, and ADR-002 (source doc). These are the architecture-decision records that govern the decisions the recipe depends on; they are not re-litigated by the recipe, and changes touching them should consult them first.

## Sibling playbooks

Two sibling playbooks in `playbooks/` bound this recipe's use (source doc):

- `hw-device-and-allow-real-u2f.md`: the real-key interaction guard referenced by frozen decision 6 in doc 02 and implemented as the symptom row in doc 06.
- `dispatch-chain-verification.md`: the dispatch and verification pattern that doc 04 applies to the VM workflow.

## What each pointer is for

Each pointer in the graph has a distinct role, and the roles do not overlap:

- `docs/BLOCKERS.md` is the status authority: whether the chain is resolved and which blockers remain open. The playbook cites it rather than duplicating it, so a drift between the two would be a bug in the playbook, not in the blocker record.
- The three runs are evidence artifacts: the anchor (30139433902), the retiree (29872832727), and the superseded history (29525332901). Only the anchor should be cited as the current proof of the chain.
- PRs #102, #125, #144, #137 are the change history behind the frozen decisions; #144 and #137 are cited without further detail in the source doc and are best read directly when the context of the fix window matters.
- The six refs/ documents are the deep narrative: why each leg took the shape it has, including the 12 hardware scenarios and the B-QEMU-ZBOOT workaround status.
- The two sibling playbooks are operational constraints: the real-key guard and the dispatch verification pattern.

## Reading order for a newcomer

A newcomer debugging a red lane should read, in order: this recipe (the frozen state), the `B-VM-CTAP2` entry in `docs/BLOCKERS.md` (the authoritative chain description), then the triage doc (06) and the dispatch doc (04). A newcomer assessing security claims should read the tradeoffs doc (08) and the `B-REAL-FIDO2` entry before repeating any software-lane result as a hardware guarantee. The refs/ documents are the deep history behind each decision and are consulted when the why behind a frozen line matters.
