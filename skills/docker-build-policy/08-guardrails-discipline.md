# 08. Guardrails and the supply-chain discipline

Scope: the 3 yubiOS guardrails on the policy itself, the supply-chain reasoning behind them, and the pairing with the rootless build skills.

## The 3 guardrails

From the source doc (yubi-OS/yubiOS skills/docker-build-policy/SKILL.md):

1. Never weaken to default allow := true or drop strict=true to get a green build. That defeats the gate: default allow inverts the policy's semantics so every input passes unless denied, and dropping strict=true makes a missing decision non-fatal. Either change turns the gate from allowlist to decoration (source doc).
2. Every registry prefix in the policy must correspond to a digest pinned in PINNED.md (source doc). This couples the enforcement point (the rego allowlist) with the audit ledger (PINNED.md): an approved prefix without pinned digests is approval without vetting.
3. Keep deny reasons actionable: name the ref and the fix, so a failing build log tells the next agent exactly what to pin (source doc). The 2 deny messages in the pattern (doc 04) do this with sprintf-interpolated refs.

## Why the discipline is strict

The gate exists because image tags are mutable and have been exploited. A documented incident is the Trivy supply-chain attack, where a mutable tag was the vector (source: https://www.vmfarms.com/blog/trivy-supply-chain/, weight 0.15, weak backing). Container hardening guidance consistently recommends digest pinning over tags (source: https://docs.ozarksecuritylabs.com/supply-chain/tier-2-hardened/container-image-digests/, weight 0.4, weak backing; https://safeguard.sh/resources/blog/container-image-digests-vs-tags-why-pinning-matters, weight 0.19, weak backing). CI and pipeline hardening literature treats build-time input vetting as a core control (source: https://cloud.google.com/blog/topics/threat-intelligence/hardening-code-pipelines-and-ci-cd-infrastructure/, weight 0.38, weak backing). All of these are weakly weighted secondary sources: they contextualize the threat model but are not the yubiOS rule of record. The rule of record is the source doc.

The default-deny posture also generalizes: a gate that fails open is not a gate. The strict=true flag (doc 02) is the mechanical enforcement of fail-closed at the buildx level, and default allow := false is the same posture inside the rego (source doc).

## What a green build certifies

With the guardrails in place, a passing CI build (doc 06) certifies that every FROM image in the build came from an approved registry prefix and was digest pinned (source doc). It does not certify anything about build context files, runtime behavior, or the images' contents beyond what the digest identifies; those are other controls' jobs.

## Pairing

The skill pairs with docker-buildx-rootless and rootless-container-builds (source doc). The division: this skill decides what builds may pull (registry allowlist and digest pinning); the paired skills govern how the builder runs (rootless daemon, buildx configuration). A policy change should be reviewed against both sides, because a policy tightening can strand a build environment whose builder image is itself unapproved.

## Relationship to the yubiOS primitive model

Per the source doc's own annotations, this skill is the declarative-policy gate of the yubiOS stack: every build is policy-vetted before any layer executes, alongside mkosi declarative config and systemd unit hardening (source doc). It also feeds the least-privilege layer: build inputs that reach the builder are the smallest set the policy permits (source doc). The source doc's cycle-5 through cycle-7 RSI annotations record segmentation, cryptographic identity and trust chain coverage; the policy itself implements none of those mechanisms directly, it only declares its position for the corpus audit (source doc).
