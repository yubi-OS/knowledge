# 01 - The eight-channel assumption taxonomy

Scope: what the Assumption set axis covers for every file, script, skill, container, workflow, unit, or API operation: the eight channels, the 12-field record, and the extract-classify-trace-validate pipeline that turns them into gap findings.

## The claim the axis makes

The Assumption set axis (5 of 12 in negative-skill-space) asks one question of every artifact: what must already be true for this file to work as presented? An assumption is a load-bearing proposition the file does not establish itself. If the proposition is false, the file's promised behavior is not available, even if the file compiles, the test passes, and the doc reads well (source doc: yubi-OS/yubiOS skills/nss-assumption-set/SKILL.md).

A gap exists when an assumption is unstated, unowned, unverifiable, contradicted, stale, transitive, or not connected to the artifact that depends on it (source doc). The design by contract tradition this axis draws on was coined by Bertrand Meyer around the Eiffel language, with preconditions as client obligations and postconditions as supplier guarantees (https://archive.eiffel.com/doc/manuals/technology/contract/, jev weight 0.55).

## The eight channels

The source doc fixes the taxonomy at eight channels and forbids inventing new channel names inside a file's Assumption set section:

1. Caller and preconditions: what the user, operator, CI, or caller must establish before invocation. Tool versions, installed binaries, credentials, prior steps.
2. Runtime invariants: properties that must hold across the file's lifetime. Monotonic clocks, entropy sources, immutable paths, idempotency keys.
3. Environment and platform: OS distribution and version, kernel features (capabilities, namespaces, cgroups v2, IOMMU, TPM, fTPM), CPU arch, GPU presence, firmware, secure-boot state.
4. Transitive dependencies: manifest entries, lockfile pins, package indices, BuildKit secrets, systemd EnvironmentFile keys, container base image digests.
5. System and trust: PCR values, key custodians, certificate chains, attestation availability, network reachability, mount-namespace privacy, root-of-trust.
6. Configuration prerequisites: defaults, prior configuration state, schema-version compatibility, lex-merged drop-in order, env-var precedence, mode flags.
7. Domain assumptions: the model's truth claims. Clock skew bounds, "the Internet is reachable", "a physical user is present at the terminal".
8. Toolchain assumptions: compiler versions, linkers, language runtimes, `set -e` semantics, `errexit` and `pipefail`, parser dialect versions.

Channel discipline is the core guideline: if you cannot say which channel a proposition arrives through, it is implicit, and implicit assumptions are the most common source of "works on my machine" failures (source doc). Field research into reproducibility failures makes the same observation: implicit assumptions about the development environment, such as unreferenced locally installed dependencies and undocumented configuration, are a documented failure class (https://arxiv.org/pdf/2607.08348, jev weight 0.06, weak backing).

## The 12-field record

Each assumption is recorded with twelve fields: name, channel, kind (precondition, invariant, rely, guarantee, dependency, domain, toolchain, or trust), scope, required, default, evidence, verification method, owner, impact if false, stale indicator, and status (verified, unverified, inferred, contradicted, stale, or missing) (source doc). The fields force three distinctions the source doc calls out as non-optional:

- Required and default are not the same. A required-true row with a default is internally contradictory.
- Every row has a stale indicator, even if the indicator is "never", because "never" is itself a testable proposition.
- Caller obligation and artifact guarantee are different burdens of proof; conflating them moves the burden the wrong way.

## The pipeline

The source doc prescribes a six-step pipeline: extract explicit assumptions, infer hidden assumptions, atomicise (one row per testable proposition), classify by channel and kind, trace each row to evidence, then validate by test, proof, inspection, or runtime monitor. The gap-finding output is found by relation failure: a row with missing evidence, a wrong owner, a scope mismatch, a stale version, or an undocumented transitive dependency (source doc).

## Weak-backed context from the dig

The dig for this subtopic found the canonical DbC sources (the Eiffel contract page above at 0.55) but thin results on the "implicit assumptions" angle. One practitioner source describes a hidden dependency as one that "exists operationally but not explicitly", which matches the source doc's implicit-assumption failure mode (https://smartitstack.com/hidden-dependencies-the-real-enemy-of-safe-automation/, jev weight 0.17, weak backing). Treat the taxonomy itself as grounded in the source doc; the dig supplements the external vocabulary, not the structure.
