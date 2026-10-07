# 06 - Guidelines, constraints, anti-patterns, and red flags

Scope: the operational discipline of the skill, internal-record subtopic grounded entirely in the source doc (yubi-OS/yubiOS skills/nss-assumption-set/SKILL.md), no dig: guidelines 1 through 12, the six constraints, the named anti-patterns, and the red-flag observation table.

## The 12 guidelines

1. Every assumption has a channel. An assumption you cannot route to one of the eight channels is implicit, and implicit assumptions are the single most common source of works-on-my-machine failures.
2. Atomicise before scoring. Five requirements in one sentence are five rows.
3. Required and default are not the same. A required-true row with a default is internally contradictory; pick one.
4. Document the stale indicator explicitly. A manifest entry without one says "this is true forever", which is never true. Version, OS release, kernel feature bit, rotation event, certificate expiry, or a test that must keep passing.
5. Distinguish caller obligation from artifact guarantee. A precondition is what the caller establishes; a postcondition is what the artifact establishes.
6. Distinguish problem-domain assumptions from execution-environment assumptions from tool and language assumptions. They look the same in a flat list; they are not.
7. Validate the assumption, not just the artifact. A CI-green test does not prove a production assumption holds.
8. Prerequisites are assumptions. "Requires Python 3.12" belongs in the Assumption set section under caller:, not in a footer.
9. Pre-register the assumption set. Write the ledger entry before implementing the consumer. Schema-first.
10. Use the eight-channel taxonomy verbatim. New channels need a new skill, not a new channel name.
11. Close the NSS-assumption-set Extend gap with one section per file: one `## Assumption set -- cycle 12` section, file-type-aware comment syntax.
12. Link assumptions to evidence. A row citing none of manifest entry, test, contract, runtime monitor, ADR, or external specification is an opinion.

## The constraints

The source doc fixes six: self-contained (the skill composes with negative-skill-space but does not depend on it being loaded); no runtime (a documentation skill that reads no environment variables and parses no configuration at runtime); schema is for humans first (clarity over strict YAML); one section per file (no stacking, no nesting); channel names are fixed; no silent defaults (document the default or write default: none explicitly). A seventh wraps both guidelines 4 and the stale-indicator constraint: the stale indicator is mandatory on every row, even when the honest value is "never", because "never" is itself a testable proposition.

## The anti-patterns

The source doc names twelve. The pattern classes:

- Declaration failures: assumptions without a channel (worse than no section, because it pretends to declare); required with a default; an Assumption set section that does not name the file's own assumptions (a placeholder patch, counted as a NO verdict); a section identical across 40 or more files (templated, not inspected, likely wrong for at least one).
- Containerfile misuse: ENV that should be ARG (BASE_IMAGE_TAG persists into every shipped image); ARG that should be ENV (YUBIOS_RELEASE unavailable at runtime); secrets in ENV (persists in the image and in docker inspect output; use BuildKit --mount=type=secret, systemd EnvironmentFile= at mode 0600, or Kubernetes Secret and SealedSecret).
- Precedence failures: "compatible with X" instead of a verdict; cross-channel aliasing without precedence (two env vars setting the same config, two config files setting the same key, overlapping CLI flags, none saying which wins).
- Placement failures: prerequisites in a footer instead of in caller:.
- Staleness failures: assuming a stale-pinned digest keeps working (the quay.io fedora-bootc digest is described as the most-rotated pin in the yubiOS corpus; a row naming a digest without the stale indicator will become false within a week); assuming a numeric-prefixed systemd drop-in overrides an upstream file (the lex-sort rule silently inverts it; use a prefix lex-sorting after upstream, such as yubiOS-).
- Conflation failures: mixing domain and environment claims in one row, which hides that they need different verification methods.

## The red flags

The source doc's observation table maps ten observations to meanings: a section listing zero concrete channels means placeholder; required-true plus a default on one field means contradictory declaration; a secret in an ENV, an ARG, or a log line means leakage; two channels claiming one key with no precedence rule means cross-channel collision; "Requires Python 3.12" in a footer means the prerequisite is lost; a missing stale indicator on a digest, version, or pin means the assumption will silently become false; a drop-in named 50- or 53- expected to override upstream means the lex-sort rule will invert it; a patch that landed but the next NSS sweep still flags assumption_set as the top gap means the patch did not close the gap; identical sections across 40 or more files means templated rather than inspected; a digest, version, or pin named without an evidence link means the row is an opinion, not a documented fact (all source doc).

## Reading order with the verification checklist

Guidelines and red flags are complements of the verification checklist in doc 07: the checklist tells the author what a passing cycle-12 patch must contain; this doc tells the reviewer what a failing one looks like. The overlap point is deliberate: the checklist's placeholder-section criterion and the red-flag "zero concrete channels" row test the same defect from two directions.
