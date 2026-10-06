# Operational dispatch discipline

Scope: the source playbook's Operational section: dispatch hygiene, the group=all ban, the fetch-workflow commit hazard, and the connection discipline. Internal-record subtopic: these are yubiOS operating rules from the source doc, no dig was run.

Source: yubi-OS/yubiOS playbooks/dispatch-chain-verification.md (source doc), Operational section. Every claim below is from the source doc.

## One dispatch per intent

One dispatch per intent; list; cancel duplicates (`202`). This is the operational restatement of the mechanism steps 1 and 2 (03-dispatch-and-duplicate-detection.md). The unit of intent is the dispatch: if a second dispatch for the same intent exists in the listing, it is a duplicate to be cancelled, not a second attempt to be tolerated.

## Never dispatch group=all in self-mode

The source doc bans `group=all` dispatches in self-mode: 25 child dispatches in one burst risks the Actions API rate limit. The prescribed form is 1 group per dispatch. The group model is yubiOS's own: ci.yml routes dispatches to workflow groups, and the group assignments are documented in docs/CI_MAP.md (source doc cross-reference). The count 25 is the recorded size of the all-group burst, which is the concrete number behind the rate-limit risk.

The ban has a verification corollary recorded in the cross-references: ci_test-ftpm-tpm0.yml, ci_test-fedora-bootc-arm64-pull.yml, and ci_test-vgpu-vm.yml are in no group, so a `group=all` dispatch silently misses them (Gap 9). A dispatch policy that assumes the group set is complete will under-verify without any error to catch it.

## Fetch workflows commit to main on every success

The fetch-*.yml workflows hold `contents: write` and commit to `main` on every success. Therefore an idle "let me just check" dispatch is an unintended commit. This is the hazard that makes dispatch discipline a correctness issue rather than a cost issue: every dispatch of a fetch workflow is a potential write to the main branch, so dispatching without intent is mutating the repo. It also tightens the duplicate rule: a duplicate fetch dispatch is not just wasted runner time, it is a second potential commit racing the first.

## Connection discipline

All GitHub calls go through `conn_1KXnkOHGgyE4` ("MASTER GIT SU"). No fallback. The rule removes improvisation from the auth path: one connection, one credential source, and no silent fallback to a different token that might have different scopes or a different audit trail.

## How the operational rules serve the verification rules

The Decision rules (02-verify-before-claiming-rules.md) govern claims; the Operational rules govern actions. The two meet in the middle at the dispatch: a dispatch is the only routine write in the playbook's normal flow, and the operational rules exist to keep that write intentional. One dispatch per intent keeps the runs listing interpretable; the group=all ban keeps the burst within rate limits and the group set explicit; the fetch-workflow hazard rule makes every dispatch a potential main-branch mutation; and the connection rule makes every call attributable. Under those constraints, the read-only verification pipeline (03 through 07) has a clean input: a known, single, intended dispatch whose descendants can be verified without ambiguity.
