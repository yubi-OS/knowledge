# 09. The verification checklist

Scope: the seven pre-DONE gates a follower confirms before sending its terminal report.

## The checklist

The source doc's Verification section is a literal checklist of seven items, all of which must hold before a follower reports DONE (source doc: https://github.com/yubi-OS/yubiOS/blob/main/skills/the-follower/SKILL.md):

- [ ] **Worklock held and released.** `bash <cult.sh> worklock "$N"` returned `OK` at task start, and `bash <cult.sh> workunlock "$N"` ran after reporting.
- [ ] **Inbox checkbox flipped.** The `- [ ]` task under `## Inbox` in `FOLLOWER_${N}.md` is now `- [x]`, or marked done by the leader.
- [ ] **Evidence in the message.** A PR link, issue link, branch name, digest, or command output appears in the DONE report, not just a status word.
- [ ] **Doctrine observed.** Rate limits respected, no `.github/workflows/` edits unless explicitly authorized by the PULPIT for this task, no merges, no decimal-repo writes.
- [ ] **Outbox written.** The corresponding `DONE:` (or `BLOCKED:`) line exists in `## Outbox` of `FOLLOWER_${N}.md`.
- [ ] **Heartbeat sent within the last 5 minutes** before the DONE report.
- [ ] **Skill load order honored.** The relevant yubiOS skill (github-api, github-actions, mkosi-image-builder, systemd-hardening, bcvk-virtualization, and similar) was loaded before invoking it.

## What each gate is protecting

The seven gates decompose into three protection targets. Gates 1 and 5 protect slot integrity: the worklock lifecycle proves the follower held exclusive write access for the whole task and released it so the next fire can proceed, and the Outbox line makes the terminal state readable by the leader. Gate 2 and gate 3 protect report integrity: the flipped checkbox closes the order loop on the leader's side, and the evidence requirement makes a DONE report falsifiable, since "done" without a link, digest, or output is a claim the leader cannot check. Gates 4, 6, and 7 protect the org's rules: doctrine observance covers the repo-surface restrictions (no workflow edits without assignment, no merges, no decimal repos), the heartbeat-recency gate proves the report is backed by a live process rather than a stale one, and the skill-load gate ensures the specialized yubiOS skill was actually loaded before it was invoked, so the work follows the skill's own contracts.

## The gate that is easiest to skip

The evidence gate is the one most likely to be quietly downgraded, because a follower that genuinely finished the work can be tempted to report DONE first and attach details later. The skill forecloses that ordering: evidence in the message is a checklist item, not a follow-up. The same discipline appears in the honesty vow, where "BLOCKED with the real reason beats a fake DONE", and in the anti-pattern "don't invent facts", where a fabricated PR number or digest is the canonical example. All three provisions encode the same rule: the report is the artifact the leader audits, so it must be complete and checkable at the moment it is sent.

## How the checklist interacts with BLOCKED

The checklist is written for the DONE path, but a BLOCKED report has its own obligations drawn from the same gates: the Outbox line must still be written (with `BLOCKED:` instead of `DONE:`), the worklock must still be released, the heartbeat must still be recent, and the doctrine gates still apply. The only gate that meaningfully changes is evidence: for a BLOCKED report, the evidence is the reason itself, stated concretely enough that the leader can act on it. The source doc's failure-mode section reinforces this by requiring the underlying error text in the BLOCKED message rather than a summary judgment like "the script failed".

After reporting DONE, the source doc notes the follower is free to poll for the next order. The checklist therefore marks not the end of the follower's participation but the end of one loop iteration: every subsequent order starts a fresh pass through the same seven gates.

Internal-record subtopic, no dig: the seven gates are quoted and structured from the ground source itself; no external research is needed to state them.
