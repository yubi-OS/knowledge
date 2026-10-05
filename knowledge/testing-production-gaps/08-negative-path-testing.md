# 08 - Negative-path testing doctrine

## Scope

Negative-path test design for security-critical primitives: fail-closed tests, tamper rejection, policy rejection, and wrong-credential tests that green-only suites miss.

## What negative testing is

Negative testing feeds software invalid input and proves it fails safely: it focuses on uncovering bugs, errors, or security vulnerabilities that positive testing with valid inputs does not reach (source: https://www.browserstack.com/guide/negative-testing, jev weight 0.67). The purpose is to evaluate behavior under unexpected conditions, including invalid inputs, boundary conditions, and unexpected actions, and to confirm the system rejects them cleanly (source: https://www.geeksforgeeks.org/software-engineering/negative-testing-in-software-engineering/, jev weight 0.33, weak backing). Practitioner taxonomies converge on the same categories yubiOS needs: invalid input, authorization failures, state conflicts, and API or dependency failures (source: https://www.qaworkflow.net/blog/negative-test-cases, jev weight 0.20, weak backing). A worked framing: negative testing proves the software fails safely rather than silently doing something wrong (source: https://bug0.com/knowledge-base/negative-testing, jev weight 0.33, weak backing).

## Why green-only suites are a trust hole

yubiOS's test inventory at the audit date: 10 Bats unit tests, 2 shell validators, and 10 VM scripts, all proving positive paths (yubiOS source: refs/testing-production-gaps-2026-08-01). The audit names 5 missing negative scripts, each mapping to a security-critical primitive:

1. test-secure-boot-tamper.sh: boot a deliberately corrupted image and assert firmware rejection. Without it, the sealed-UKI lane only ever proves acceptance.
2. test-oci-tag-channel.sh: assert channel separation invariants (latest cannot resolve to the dev digest, immutable tags resolve to the recorded digest).
3. test-bcvk-passthrough.sh: assert YubiKey USB passthrough into the VM fails closed when the device is absent, rather than silently enrolling nothing.
4. test-policy-rejection.sh: assert the build policy rejects a non-approved registry and an unpinned digest, rather than warning.
5. A negative PKCS#11-URI test: a wrong PKCS#11 URI in the signing configuration must fail the build closed (a mistyped token serial silently falling back to a default slot would undermine the whole signing chain).

The common failure these prevent is the fail-open default: a library or CLI silently retries, falls back, or treats an error as a warning, and a positive-path suite stays green the whole time.

## Fail-closed test design

A negative test is only as good as its expected state. For each of the 5 scripts the assertion must check the closed state, not merely "the command failed":

- For tamper: the firmware rejected the image and the guest never reached userspace. A hang that times out looks identical to a rejection in naive scripts, so the test must assert on the log line or exit reason that distinguishes rejection from timeout.
- For channel checks: the digest comparison result, not just a nonzero exit.
- For policy rejection: the policy engine's decision line naming the violated rule (approved registry or digest pinning), so a rejection for the wrong reason is still a failure.
- For PKCS#11: the exact URI parse error, not an opaque sign failure.

The audit prices authoring all 4 named scripts (the PKCS#11 one rides with the signing work) at 1 to 2 weeks, each with a Bats existence assertion so the script cannot be deleted silently (yubiOS source: refs/testing-production-gaps-2026-08-01).

## How much negative coverage is enough

No mechanical threshold exists; commercial guidance documents suites that scaled to 550+ test cases including negative scenarios for invalid inputs, expired sessions, and malformed API calls (source: https://www.tricentis.com/learn/negative-testing, jev weight 0.54). The pragmatic rule for a security-focused OS project: every security boundary gets at least one negative test per direction. yubiOS's security boundaries are enumerable: the UKI signature check, the composefs roothash, the LUKS2 credential binding, the OCI channel, the build policy, and the PKCS#11 signing path. Six boundaries, five missing scripts, each asserting rejection. That is the enough line for this codebase, and it is auditable: the Bats existence test can enumerate the required scripts by name.

## Wiring negative tests into the evidence chain

A negative test only yields evidence if its green run is recorded the same way positive runs are: saved log, image digest, and firmware or policy version. The yubiOS audit pairs the missing scripts with their unit-level assertions in the same PRs as the positive lanes (for example the sealed-UKI negative tamper runs belong in the PR #154 lane) (yubiOS source: refs/testing-production-gaps-2026-08-01). The pattern generalizes: land the negative script in the same PR that lands or changes the primitive it guards, so a regression to the primitive and the loss of its negative coverage cannot happen independently.

## Sources

- https://www.browserstack.com/guide/negative-testing (weight 0.67)
- https://www.tricentis.com/learn/negative-testing (weight 0.54)
- https://www.testlodge.com/resources/learning_center/test_cases/negative_test_cases (weight 0.57)
- https://bug0.com/knowledge-base/negative-testing (weight 0.33, weak backing)
- https://www.geeksforgeeks.org/software-engineering/negative-testing-in-software-engineering/ (weight 0.33, weak backing)
- https://www.qaworkflow.net/blog/negative-test-cases (weight 0.20, weak backing)
- yubiOS refs/testing-production-gaps-2026-08-01 (internal source doc for all repo-internal claims)
