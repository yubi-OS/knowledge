# 07 - Composition with the NSS skill family and the verification checklist

Scope: how the skill composes with the other NSS-axis skills and adjacent skills, and the 8-point verification checklist a cycle-12 patch must pass. Internal-record subtopic grounded entirely in the source doc (yubi-OS/yubiOS skills/nss-assumption-set/SKILL.md), no dig.

## The composition map

The source doc fixes the direction of each pairing:

- negative-skill-space runs the 12-axis sweep and flags assumption_set as a candidate Extend gap; nss-assumption-set is the closure skill for that one axis. Pair the two in every cycle. Direction: negative-skill-space to nss-assumption-set.
- curve-compass-skill uses nss-assumption-set as the assumption_set-axis lens payload for cycle-12 lens-format patches: the lens records hypothesis, method, parameters, delta, verdict, score, and caveat for the Assumption set section this skill defines. Direction: nss-assumption-set to curve-compass-skill.
- curved-corpus-create: the corpus the cycle-12 sweep operates over is the same lens --corpus JSON, and the corpus's assumption_set column maps to this skill's eight-channel taxonomy. Direction: bidirectional.
- nss-inputs: the Inputs surface a cycle-9 patch declares is the caller-side contract; the Assumption set a cycle-12 patch declares is the broader environment, transitive, trust, and domain claim that the Inputs surface rests on. Pair for every file with both gaps. Direction: nss-inputs to nss-assumption-set.
- nss-outputs: the Outputs surface a cycle-10 patch declares is the downstream contract; the Assumption set is the upstream contract that must hold for the Outputs surface to be reliable. Pair for every file with both gaps. Direction: nss-outputs to nss-assumption-set.
- nss-mode: the Mode axis a cycle-11 patch declares (interactive versus batch, daemon versus one-shot, TTY versus pipe) is the lifecycle and interaction assumption; the Assumption set names that assumption explicitly. Direction: nss-mode to nss-assumption-set.
- nss-audience: the Audience a cycle-8 patch declares determines which channels matter: CI cares about caller, toolchain, and dependency; operators care about environment, system-trust, and domain; developers care about invariant, configuration, and toolchain. Direction: nss-audience to nss-assumption-set.
- api-and-interface-design: the API contract is the artifact-side equivalent of the precondition and postcondition; the assumption set is the environment-side. Bidirectional, pair for every API.
- source-driven-development: each documented prior work frame (Eiffel, SPARK Ada, rely/guarantee, NASA SWE, ISO/IEC/IEEE 29148) was verified against official docs in the deep-research phase that produced this skill. Direction: source-driven-development to nss-assumption-set.
- security-and-hardening: the system-trust channel (PCR values, key custodians, certificate chains, attestation, mount-namespace privacy, root-of-trust) is the yubiOS security boundary at the assumption-set layer; the security skill owns the deeper threat model. Bidirectional.
- recursive-self-improvement: when the same NSS-assumption_set Extend gap keeps reappearing after a cycle-12 patch, RSI self-mode should re-isolate the editor before the next attempt, because same-author bias on Assumption set sections is the most common cycle-12 failure mode. Direction: recursive-self-improvement to nss-assumption-set.

The audience pairing is the practical selector: given a file, decide which of the eight channels each audience depends on before writing the section, so the section prioritizes the rows each reader will actually use.

## The verification checklist

For each cycle-12 patch that closes an NSS-assumption_set gap, the source doc requires 8 checks:

1. The patch adds ONE `## Assumption set -- cycle 12` section, or the file-type-aware equivalent: `# Assumption set` for Containerfile and Makefile, a triple-quoted docstring for Python, `# Assumption set` shell comments, an HTML comment for markdown files where a section is not appropriate, and a YAML comment for GitHub Actions.
2. The section names at least one concrete assumption with channel, kind, scope, owner, evidence, verification method, and stale indicator. A placeholder section with zero concrete assumptions counts as a NO verdict.
3. Secrets are absent from ENV, ARG, and log lines. Where a secret is documented, the declaration references BuildKit --mount=type=secret, systemd EnvironmentFile=, or Kubernetes Secret, never a raw ENV or ARG.
4. Prerequisites are listed in caller:, not in a footer.
5. Precedence is stated when more than one channel can supply the same assumption, for example CLI > env > config > default for Python scripts.
6. A stale indicator is present on every version, digest, pin, or kernel-feature assumption. Valid forms include "any 422/404 from quay.io on this exact digest" for a digest pin, "kernel < 6.7 means no composefs" for a kernel feature, and "the upstream package's signature expired" for a signature pin.
7. Domain claims are separated from environment claims. Both are valid; both must be present when the file depends on both.
8. The next NSS sweep on the same file does NOT re-flag assumption_set as the top Extend gap. If it does, the patch did not close the gap and the cycle-12 lens is a NO verdict.

Check 8 is the closed-loop criterion: the section is not done when it reads well, it is done when the sweep that dispatched it stops flagging the axis. This makes the skill part of an RSI loop rather than a one-shot documentation edit, and it is why the composition table routes failed patches through recursive-self-improvement for editor re-isolation before the retry.
