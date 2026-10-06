# docs/spec knowledge corpus

Explicates the yubiOS specification document: `yubi-OS/yubiOS docs/SPEC.md` (ground source, 15626 B). Each doc explicates one of the spec's own sections: what it specifies, its contracts, and how the specification structure works.

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | [scope-and-normative-framing](01-scope-and-normative-framing.md) | In/out-of-scope surfaces, RFC 2119 keyword contract, versioning conventions |
| 02 | [design-principles-and-trust-model](02-design-principles-and-trust-model.md) | The 6 design principles and the 2 complementary roots of trust (YubiKey 5, fTPM), with the 5-interface YubiKey map |
| 03 | [boot-trust-chains](03-boot-trust-chains.md) | ARM64 TF-A chain (ROTPK Path A / U-Boot Path B) and x86-64 UEFI chain, converging on systemd-boot + UKI + composefs/dm-verity + LUKS2 |
| 04 | [system-composition-and-image](04-system-composition-and-image.md) | bootc OCI + mkosi delivery, digest-pinned base, OPA/Rego build policy, DPS partitions, A/B updates, hardening floors |
| 05 | [enrollment-and-modularity](05-enrollment-and-modularity.md) | First-boot enrollment gate and 4 steps, recovery-key rule, and the 4-rung modularity ladder |
| 06 | [use-cases-non-goals-conformance](06-use-cases-non-goals-conformance.md) | The 7 use cases, 4 non-goals, and 7-point conformance checklist (internal-record subtopic, no dig) |

## Research summary

- Results collected: 60 (top 6 per query, 10 queries over 5 web-shaped subtopics; doc 06 is an internal-record subtopic with no dig per brief).
- Weight split: 7 results at weight >= 0.5, 53 at < 0.5.
- Jev requests: 6 (1 outline score + 5 noul weighting batches), usage 7862 input / 1314 output tokens.
- Endpoint used: DefAPI direct (https://api.defapi.org/api/v1/decisions); the steady-orbit worker relay was not needed (no fallback triggered).
- Redo counts: 0 (no dig was thin enough to require redo).
- Skipped docs: none.
- Gaps: doc 06 has no dig material by design (internal record). Docs 03, 04, and 05 returned zero results at weight >= 0.5; their bodies are grounded in the source doc, and all dig-backed claims there are labeled weak (< 0.5).

Preflight 2026-10-06: searXNG healthy (campaign preflight run orchestrator-side); DefAPI direct decisions endpoint 200, zero 429.

## Verification

VERIFIED: files 16, research-db 9 parse, weights 60/60
