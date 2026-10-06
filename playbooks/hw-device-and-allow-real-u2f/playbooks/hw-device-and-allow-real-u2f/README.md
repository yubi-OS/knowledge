# hw-device-and-allow-real-u2f

Knowledge corpus explicating the yubiOS playbook `playbooks/hw-device-and-allow-real-u2f.md` ("hw_device + allow_real_u2f - the two-flag opt-in", 2026-08-01) in yubi-OS/yubiOS. Ground source: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/playbooks/hw-device-and-allow-real-u2f.md

The playbook's own sections dictated the outline: Context, Decision, Mechanism (2 subtopics), pre-flight and dispatch shapes, Verified working, Tradeoffs, Cross-references.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-context-two-destructive-workflows.md](01-context-two-destructive-workflows.md) | the 2 destructive-capable workflows and why the flags exist |
| 02 | [02-decision-two-independent-flags.md](02-decision-two-independent-flags.md) | two flags opted into independently, never inferred; 422 on undeclared forwarding |
| 03 | [03-mechanism-real-u2f-guard-hidraw-race.md](03-mechanism-real-u2f-guard-hidraw-race.md) | assert_passless_only and the /dev/hidraw enumeration race |
| 04 | [04-mechanism-env-sudo-forwarding.md](04-mechanism-env-sudo-forwarding.md) | ALLOW_REAL_U2F step env + explicit sudo env forwarding |
| 05 | [05-runner-preflight-and-dispatch-shapes.md](05-runner-preflight-and-dispatch-shapes.md) | runner pre-flight commands and the 3 dispatch shapes |
| 06 | [06-verified-working-record.md](06-verified-working-record.md) | PRs #144/#137/#145, commits 5200f0b, 5342867, 6dad3733, vm-e2e run 30523246025 |
| 07 | [07-tradeoffs-fail-safe-defaults.md](07-tradeoffs-fail-safe-defaults.md) | fail-safe default false, silent-green risk, missing dispatch-step fail-fast |
| 08 | [08-cross-references-testing-discipline.md](08-cross-references-testing-discipline.md) | BLOCKERS.md B-REAL-FIDO2, Linear OMN-42/OMN-63/OMN-149, related tests and playbooks |

## Per-doc dig results

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01 | context-two-destructive-workflows | 12 | 2 |
| 02 | decision-two-independent-flags | 12 | 5 |
| 03 | mechanism-real-u2f-guard-hidraw-race | 12 | 8 |
| 04 | mechanism-env-sudo-forwarding | 18 | 3 |
| 05 | runner-preflight-and-dispatch-shapes | 12 | 4 |
| 06 | verified-working-record | 0 | 0 |
| 07 | tradeoffs-fail-safe-defaults | 12 | 3 |
| 08 | cross-references-testing-discipline | 0 | 0 |
| 06 | 0 (internal-record, no dig) | 0 |
| 08 | 0 (internal-record, no dig) | 0 |

## Research summary

- Results collected: 84, weighted high (>= 0.5) 25 / low (< 0.5) 59
- jev requests: 8, usage 8947 input / 1676 output tokens (typesafe/jev-1.13 via https://api.defapi.org/api/v1/decisions direct, per mint brief SPEED OPTIMIZATION 1)
- Redos: 1 (subtopic 04 first dig had no result at weight >= 0.5; redo with different queries produced the sudo.ws manual at 0.89 and man7.org sudoers at 0.80)
- Skipped docs: none. Subtopics 06 and 08 are internal-record subtopics, no dig (per mint brief SPEED OPTIMIZATION 4); their claims cite the source doc only.
- Caveat: in subtopic 07 the 2 highest-weighted results (Citi.com banking pages, 0.78 and 0.80) are off-topic and were deliberately not cited; the doc's external sources are weak and labeled weak.
- Internal-record docs 06 and 08 carry only source-doc claims; no external facts added.

Preflight 2026-10-06: searXNG healthy (campaign preflight, orchestrator); weighting via https://api.defapi.org/api/v1/decisions (typesafe/jev-1.13), 0 retries needed; no 429s.

## Ground source

- yubi-OS/yubiOS `playbooks/hw-device-and-allow-real-u2f.md` (5587 B fetched 2026-10-06). The corpus explicates the playbook; it does not replace it.
