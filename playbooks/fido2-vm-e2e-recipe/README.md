# playbooks/fido2-vm-e2e-recipe

Knowledge corpus explicating the yubiOS playbook `playbooks/fido2-vm-e2e-recipe.md` (source doc, 2026-08-01): the known-working software-lane recipe for FIDO2 / LUKS2 / systemd-homed VM end-to-end testing, frozen after `B-VM-CTAP2` was resolved.

## Docs

| NN | doc | one-line scope |
|---|---|---|
| 01 | [01-context-and-regression-guard.md](01-context-and-regression-guard.md) | when the recipe applies, what it freezes, and the software-lane versus hardware-lane scope boundary |
| 02 | [02-known-working-config.md](02-known-working-config.md) | the six frozen decisions any change to the lane must preserve |
| 03 | [03-mechanism-chain.md](03-mechanism-chain.md) | the end-to-end chain leg by leg, from host launch to ed25519-sk |
| 04 | [04-ci-dispatch-verification.md](04-ci-dispatch-verification.md) | dispatching `ci_test-vm.yml` and reading the inner run for skips before trusting a conclusion |
| 05 | [05-test-scripts-bats.md](05-test-scripts-bats.md) | the three VM scripts and the bats unit assertions locking the PAM config |
| 06 | [06-failure-triage.md](06-failure-triage.md) | the symptom-to-suspect table, guard refusals, and the two real bugs behind the green lane |
| 07 | [07-verified-evidence.md](07-verified-evidence.md) | the anchor run, the PRs, the blocker resolution, and the Linear records (internal record) |
| 08 | [08-tradeoffs-hw-lane-boundary.md](08-tradeoffs-hw-lane-boundary.md) | what the software lane cannot prove and the 12 scenarios behind `B-REAL-FIDO2` |
| 09 | [09-cross-references-map.md](09-cross-references-map.md) | the document graph around the recipe: blockers, runs, PRs, refs, ADRs, sibling playbooks (internal record) |

## Research summary

- Results collected: 84 (top 6 per query, URL-deduped within subtopic), from 14 searXNG queries across 7 web-shaped subtopics; subtopics 07 and 09 are internal-record and dug nothing by design.
- Weight split: 7 high (>= 0.5) / 77 low (< 0.5) of 84. Low-weight results are used sparingly and labeled as weak backing in the docs; the grounding spine for most claims is the source doc itself.
- jev: 7 requests (1 outline score validation + 6 noul weighting batches), usage 10899 input / 1675 output tokens. Weighting ran via DefAPI direct (zero failures, no fallback needed).
- Redos: 0. All digs returned results on the first attempt; no doc was skipped.
- Skipped docs: none.
- Ground source: yubi-OS/yubiOS `playbooks/fido2-vm-e2e-recipe.md`, fetched 2026-10-06 (6025 bytes, User-Agent: omni-agent/1.0).

Preflight 2026-10-06: campaign preflight run orchestrator-side (searXNG healthy; decide healthy); agent-side probe skipped for speed per brief. Outline validation: all 9 subtopics kept, scores 1.2 to 1.95, none dropped.
