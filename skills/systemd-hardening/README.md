# systemd-hardening knowledge corpus

Minted 2026-10-08 from the ground source yubi-OS/yubiOS skills/systemd-hardening/SKILL.md (13899 B). Topic: writing hardened systemd service units for yubiOS, systemd-analyze security scores, sandbox directives, FIDO2/PAM auth, drop-in overrides.

## Docs

| NN | file | scope |
|---|---|---|
| 01 | 01-security-audit-workflow.md | systemd-analyze security scoring, thresholds (7.0 / 4.0), audit-first workflow |
| 02 | 02-hardened-unit-template.md | The full hardened unit template: Type=notify, watchdog, DynamicUser, directory trio |
| 03 | 03-filesystem-isolation.md | PrivateTmp, ProtectSystem=strict, ProtectHome, ReadWritePaths allowlist |
| 04 | 04-privilege-capability-control.md | NoNewPrivileges, capability bounding, DynamicUser, RemoveIPC, PrivateDevices |
| 05 | 05-kernel-syscall-filtering.md | ProtectKernel* directives, seccomp SystemCallFilter groups, MDWE, family/namespace limits |
| 06 | 06-incremental-hardening-dropins.md | Phased hardening order and drop-in override workflow |
| 09 | 09-yubios-boot-filesystem-directives.md | ConditionSecurity=measured-os (v261), RestrictFileSystems= (v250), BPF LSM |
| 10 | 10-primitive-placement.md | Internal-record: 10-primitive placement and RSI cycle 4 to 7 audit trail |

## Research summary

- Results collected: 88 (75 first dig + 13 redo dig), across 7 dug subtopics, 2 queries each plus 1 redo pass on subtopics 03 and 06.
- Weight split: 26 high (>= 0.5), 62 low (< 0.5). Doc 01 carries mostly weak backing and says so; doc 10 is internal-record with no dig and no weights.
- jev requests: 9 (1 outline score, 7 weighting batches of 12, 2 redo weighting batches). Usage: 9026 input tokens, 1620 output tokens.
- Model: typesafe/jev-1.13 via DefAPI direct (api.defapi.org/api/v1/decisions). Endpoint used per request is recorded in research-db/jev-log.json.
- Redos: 2 (subtopics 03 and 06, one redo pass each with different queries).
- Skipped docs: 0 from digs; 2 subtopics dropped at outline validation (07 fido2-pam-u2f score 0.38, 08 systemd-homed-fido2 score 0.34, both judged padding by the score metric despite being named in the task topic; their content remains available in the ground source).

## Preflight

Preflight 2026-10-06: searXNG healthy (campaign preflight run orchestrator-side); decide (typesafe/jev-1.13) 200 via DefAPI direct.

## Ground rule

The ground source is the primary source of record. Every doc cites it for its grounding spine and carries dig sources with jev weights; weak sources (< 0.5) are labeled weak in text. The source doc's own correction about the fabricated directive name RestrictFileSystemAccess= is preserved verbatim in doc 09.
