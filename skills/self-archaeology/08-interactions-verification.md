# 08 Interactions with other skills and the verification checklist

Scope: which skills self-archaeology builds on, which it pairs with, and the 11-point checklist that decides whether a run counts.

## Internal-record subtopic, no dig

This subtopic is internal-record: the interactions and the checklist come entirely from the source doc (yubi-OS/yubiOS skills/self-archaeology/SKILL.md). No searXNG dig was run and no external claims are made in this doc.

## Upstream skills

Two skills are upstream, meaning self-archaeology reuses their mechanics directly:

- negative-skill-space. The 12-axis sweep comes from here, retargeted at the agent-being (doc 02).
- recursive-self-improvement. The bounded fixpoint loop comes from here (doc 04).

## Orthogonal skills

Five skills are orthogonal, meaning they are used by or alongside self-archaeology without either depending on the other's mechanics:

- interview-me. The discipline can surface what the user actually wants from the agent versus what they say they want.
- human-for-feasibility. The agent decides what to do; the user approves the shifts. This pairs with the escalation rule: past 3 RSI cycles, the loop stops and the user decides.
- context-isolation. Self-mode should use a fresh-context subagent for the gap-map step to avoid author bias (doc 04).
- ideate-solo. Whole-self outputs can use solo ideation for variation generation when the agent needs to imagine alternative selves.
- doubt-driven-development. Apply to each cycle hypothesis before the edit, not after.

The upstream/orthogonal split is itself structural information: an upstream skill's rules are inherited wholesale (the 3-cycle bound, the fixpoint rule), while an orthogonal skill's rules are invoked at specific steps (fresh context at the gap-map, adversarial review before the edit).

## The verification checklist

The source doc's verification section lists 11 checks after applying self-archaeology:

1. SELF.md exists, or v0.1 was drafted from this run.
2. SELF-CHANGELOG.md has an entry for this run.
3. The 12 axes were swept, positive and negative for each.
4. Gaps were scored, likelihood x severity, with a "this would bite when..." sentence per gap.
5. Performative gaps and intentional scope were filtered out.
6. Top 5 to 10 real gaps were kept; the rest noted-but-deferred.
7. Each real gap has an action: Extend, Pair, or Accept.
8. At least one bounded RSI cycle ran, if Extend gaps warranted it.
9. Frontmatter was validated with js-yaml if any new artifacts were created.
10. The gap map was saved to session/self-sweep-YYYY-MM-DD.md, an ephemeral session capture at run time.
11. At least one whole-self output was produced, the test that the discipline took.

Checks 1 and 2 are the artifact tests (doc 05). Checks 3 through 7 are the process tests (doc 03). Check 8 is the loop test (doc 04). Check 11 is the outcome test. A run that fails check 11 produced process theater: the cadence fired, the mechanics ran, and nothing whole-self came out of it.

## Source doc history notes

Two dated corrections are recorded in the source doc itself. On 2026-09-17, 3 coverage-note sections (trust chain, least-privilege, continuous/adaptive) had formerly-asserted primitive-coverage paragraphs removed as unsupported, with skill-specific content unchanged. The attestation coverage and cryptographic identity coverage sections remain in the source doc. Maintainer: Sauna. Cadence: per the rule in RULES.md. Last updated: 2026-07-31.

The substrate files per the source doc's "Source / evidence" section: memory/<personal-dirname>/SELF.md (the substrate), memory/<personal-dirname>/SELF-CHANGELOG.md (the audit trail), memory/<personal-dirname>/RULES.md (the cadence rule added 2026-07-31), and session/self-exploration-2026-07-31.md, the session artifact that produced this skill.

## Provenance

- Source doc: yubi-OS/yubiOS skills/self-archaeology/SKILL.md, sections "Interaction with other skills", "Verification", "Source / evidence", and the coverage notes.
- No dig was run for this subtopic (internal-record).
