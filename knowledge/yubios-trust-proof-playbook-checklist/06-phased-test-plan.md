# Phased adversarial test plans

## Scope

Structured adversarial test plans: baseline verification, intentional failures, recovery, and upgrade/rollback phases, with a final pass condition.

## The 4-phase shape

The yubiOS trust-proof playbook includes a 24-hour test plan with 4 phases, each with a defined end state (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source):

- Phase 1, baseline: verify the image digest, verify the pin, boot the system, record logs. The baseline is the reference state every later phase is measured against.
- Phase 2, intentional failures: boot a wrong image, remove the key, modify the UKI, reboot after each change. The system is attacked one variable at a time.
- Phase 3, recovery: restore the correct image, re-enroll or recover using the documented method, confirm the system returns to the trusted state.
- Phase 4, upgrade and rollback: upgrade, verify, roll back, verify again. Trust state must survive or explicitly change.

The final pass condition is a list of 5 verified artifacts: one verified image, one verified boot chain, one verified enrollment set, one verified recovery path, one verified rollback path (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source).

## Why the phases are ordered this way

Phase 1 before Phase 2 is the load-bearing ordering: intentional failures are only informative if the baseline is verified first. A boot refusal in Phase 2 proves tamper detection only if the same machine booted the correct image in Phase 1. Failure injection tooling makes the same demand: deterministic failure injection exists to produce "recovery validation" evidence, which presupposes a known-good reference (source: https://github.com/summonlabs/Chaos-Lab, weight 0.501, authoritative backing).

Phase 2 varies one variable per test. Wrong image tests provenance enforcement, missing key tests key ownership, modified UKI tests boot verification. Bundling the failures would make any observed failure unattributable.

Phase 3 closes the loop the failures opened: recovery must return the system to the Phase 1 state, using the documented method, which is what turns "recovery is documented" into "recovery works".

Phase 4 tests the property most upgrades silently break: that trust state (enrollment, pin, boot chain) survives an upgrade and a rollback without drift. Bootloader rollback practice mirrors the shape: dual-image setups with automatic rollback, manual rollback, and explicit verification that the alternate boot works, plus documented failure modes where rollback does not fire (source: https://runbook.academy/courses/vyos/lessons/vyos-lvi-05-upgrade-rollback/, weight 0.390, weak backing). An upgrade playbook that runs safe upgrades, rollback, and migration testing as separate verified steps follows the same structure (source: https://ashimov.com/posts/vyos-upgrade/, weight 0.290, weak backing).

## Expected results written before the test

Adversarial test discipline requires the expected result to exist before the test runs: test suites defined with "an expected result written before the test" (source: https://www.void-agency.com/insights/adversarial-testing-plan-for-ai-workflows, weight 0.160, weak backing). On the checklist this is already enforced by design: each failure-behavior checkbox says "failed closed", so the pass condition is pre-committed and the operator cannot redefine success mid-test.

## The disposable-hardware precondition

The whole plan runs on a disposable VM, spare disk, or spare machine (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source). Phase 2 deliberately destroys trust state, and Phase 4 deliberately boots previous images. Running either on production hardware converts a verification exercise into an outage. The precondition is not boilerplate: it is what makes the destructive tests honest.
