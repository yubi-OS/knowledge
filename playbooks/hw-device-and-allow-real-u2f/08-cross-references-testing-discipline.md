# 08 - Cross-references and real-hardware testing discipline

Scope: the artifacts the playbook binds itself to, and the testing discipline those bindings encode.

This is an internal-record subtopic: every fact below comes from the source doc (yubi-OS/yubiOS `playbooks/hw-device-and-allow-real-u2f.md`, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/playbooks/hw-device-and-allow-real-u2f.md). No dig was run for this subtopic (internal-record subtopic, no dig, per the mint brief).

Cross-references recorded by the source doc:

- `docs/BLOCKERS.md`, entries `B-REAL-FIDO2` and Permanent CI-Evidence Patterns.
- `PROJECT_RULES.md`, entry "ALLOW_REAL_U2F workflow fix (2026-07-30)".
- PRs #144 (the guard), #137 (vgpu lane, ADR-031 rule 5), #145.
- Commits `5200f0b`, `5342867`, `6dad3733`; vm-e2e run `30523246025`.
- Linear: OMN-42 (physical-key parent), OMN-63 (12 scenarios), OMN-149.
- Tests: `tests/vm/lib/real-u2f-guard.sh`, `test-luks-fido2-ci.sh`, `test-luks-fido2.sh` (HIL), `test-fido2-enrollment.sh`.
- Playbooks: `fido2-vm-e2e-recipe`, `dispatch-chain-verification`.

The testing discipline these bindings encode, per the source doc:

1. Real hardware is a lane, not an accident. The physical-key parent (OMN-42) and its 12 scenarios (OMN-63) exist as tracked work items, and the guard plus flag make running on real hardware a deliberate dispatch choice. The recorded correct behavior when a real key is present and the flag is unset is a refusal, and the playbook instructs operators to re-dispatch rather than unplug the key or patch the guard.
2. Evidence is run-anchored. The playbook anchors its "verified working" claim to a specific run id (`30523246025`) at a specific commit (`5342867`), and the BLOCKERS entry names a Permanent CI-Evidence Patterns section, which is the same discipline at repo level: claims about CI behavior point at runs, not at intentions.
3. Coverage claims are honest about what did not run. The tradeoffs section (07) directs operators to read the skip lines before claiming hardware coverage, and the HIL test (`test-luks-fido2.sh`) is distinguished from the CI test (`test-luks-fido2-ci.sh`) in the cross-references, keeping the hardware-in-the-loop leg and the passless CI leg visibly separate.
4. The mechanism has a paper trail. 3 commits with descriptive messages, the guard PR, and the vgpu-lane PR (with its ADR-031 rule 5 binding) are all named, so a future reader can reconstruct the two-flag system from git history alone.

For a corpus reader, the practical use of this document is as a map: to understand the guard, start at 03 and PR #144; to understand the env plumbing, 04 and commits `5200f0b` and `5342867`; to see the recorded green run, 06; to find the parent work item and scenario list, OMN-42 and OMN-63. All pointers are as the source doc records them; the corpus does not independently verify the referenced artifacts' current state.
