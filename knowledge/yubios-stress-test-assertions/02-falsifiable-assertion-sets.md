# 02 Falsifiable assertion sets

Scope: how to write a red-team-grade assertion set: falsifiable pass criteria, a fail-closed or clean-recovery pass rule, and one row per test so an external party can re-run the verdict.

## What makes an assertion red-team-grade

An assertion set is red-team-grade when each entry has 3 properties: it is falsifiable (a specific action can make it fail), it names its evidence (the run that proves the verdict), and it is re-runnable by an adversary or auditor who does not trust the author. The general testing literature defines assertion-based testing as validating "the expected behavior of a program" through specific statements (https://testsigma.com/blog/assertion-testing/, jev weight 0.31, weak backing). The operational reference is the Gatling assertions model: assertions "define acceptance criteria and have your test pass or fail based on response time or request status statistics" (https://docs.gatling.io/concepts/assertions/, jev weight 0.93, authoritative). Gatling's shape is worth copying for security work: a named criterion, a measured statistic, and a threshold. A security assertion set differs only in what it measures: instead of response-time percentiles, it measures whether a tampered link refuses to boot, whether a lost key leaves a recovery path, whether a prod image contains test-only layers.

## Pass rules: fail closed or recover cleanly

The strongest single rule for a security assertion set is a universal disjunction: every test must end in (a) a fail-closed state or (b) a clean, documented recovery. Anything else, a state that is neither closed nor recoverable, is a fail. This mirrors the fail-secure principle in security practice: on failure, systems should deny access and preserve a safe state rather than degrade into permissiveness (https://www.ituonline.com/comptia-securityx/comptia-securityx-4/mitigations-implementing-fail-secure-and-fail-safe-strategies-for-robust-security/, jev weight 0.45, weak backing). The pass rule matters more than any individual test because it removes the judgment call: an ambiguous recovery behavior is already a fail, before any exploit is written.

A related rule targets silent green results. A security test that "needs a live application response, and returns PASS against a server that is not there, has not tested anything" (https://dev.to/mspro3210/your-security-gate-always-passes-can-it-actually-block-a-release-522n, jev weight 0.12, weak backing). The author of that piece proposes declaring such tests exceptions, each tied to the specific assertion it satisfies. Translated to OS security testing: a test that skips its tamper step because the fixture failed to build is not a pass, and an assertion set must make that outcome expressible as anything other than green.

## Why chained attacks, not single controls

Red team practice exists because controls pass individually and fail jointly. Vendor material on red team testing states the point plainly: "Controls may look strong individually, but realistic attack simulation reveals whether they operate together effectively when attackers chain techniques" (https://redbotsecurity.com/red-team-testing/, jev weight 0.15, weak backing). The same framing appears in practitioner guides: red team operations "simulate real-world adversary tactics to test an organization's security posture" following "industry best practices" (https://github.com/gotr00t0day/RedTeam-Ops-Guide, jev weight 0.68, authoritative). For an OS project, the chained property is the whole game: the interesting test is never "does UKI verification work" but "does UKI verification still hold when the attacker first corrupts the digest pin file and then reboots twice".

The practical consequence for assertion writing: each assertion should specify the attack chain prefix it assumes, not just the single tamper. An assertion that passes in isolation but has no statement about its preconditions will be defeated by an ordering the author never considered. Invariant-testing material makes the same point from the defender side: invariant tests "verify critical system properties" continuously rather than at a single moment (https://dev.to/ajtech0001/fuzz-and-invariant-testing-a-security-researchers-guide-to-uncovering-hidden-vulnerabilities-5d69, jev weight 0.09, weak backing).

## The structure of one assertion row

Synthesizing the sources above, one assertion row in a red-team set should carry 6 fields:

1. ID and claim under test (the README sentence being challenged).
2. Action (the tamper, removal, or adversarial input).
3. Expected terminal state (fail-closed or clean recovery, named exactly).
4. Evidence artifact (the log, screenshot, or digest that proves the terminal state).
5. Preconditions and chain prefix (what state the machine is in before the action).
6. Verdict and date (pass/fail plus when the check last ran).

A set with these 6 fields is auditable: an external party can pick any row, execute the action, and independently decide the verdict. A set without fields 3 and 4 is a wish list; without field 5 it is silently non-reproducible.

## The yubiOS application

The source analysis of yubiOS (GET https://api.github.com/repos/yubi-OS/yubiOS/contents/tests?ref=main) found a tests/vm/ directory with 15 scripts and 5 unit-level enrollment test files (tests/unit/test-enroll-*.bats), which is the raw material of an assertion set. What the repo lacks, per the same analysis, is the assertion layer on top: no 1-page pass/fail matrix linking each of the 8 stress tests to a reproducer script and a last-run date, and no partial-enrollment or key-loss-recovery test scripts in tests/vm/. The repo therefore has assertion raw material (scripts) but not the assertion set (rows with expected terminal states and evidence artifacts).

## The one-page template

The deliverable this doc argues for is deliberately small: 8 rows, one per stress test, each row carrying the 6 fields above, with a pointer to the reproducer script for each. Its value is not the document but the property it forces: no claim in the README is allowed to stand without a row, and no row is allowed to stand without a last-run date. A row whose date goes stale downgrades its claim from demonstrated property back to design claim, which is exactly the downgrade the rest of this corpus is designed to detect.
