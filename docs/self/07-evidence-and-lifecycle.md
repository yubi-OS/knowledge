# 07. Evidence standard and lifecycle

Scope: how the self-document holds itself to evidence: the Source/evidence integration list, the no-unbacked-claims rule, the maintainer and cadence line, the differential-curve self-measurement, and the trust-chain and declarative-policy coverage sections.

Grounding spine: yubi-OS/yubiOS docs/SELF.md (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/SELF.md), "source doc". Internal-record subtopic, no searXNG dig.

## The integration list as an evidence contract

The Source/evidence section states "This file integrates:" and then enumerates 13 inputs with their roles: 8 memory files (SAUNA_IDENTITY.md personality, voice, boundaries; RULES.md hard constraints, banned phrases, file naming, writing rules; SAUNA_TOOLS.md connections, capabilities, accounts; USER_PROFILE.md the relationship layer; USER_PREFERENCES.md how to work with the user; RECENT_ACTIVITY.md the empirical record; COMPANY.md yubi-OS context; USER_RELATIONSHIPS.md the people), 4 skills (internal-big-picture for the operator-experience gap framing, negative-skill-space for the 12 axes, recursive-self-improvement for the bounded loop, self-archaeology as the discipline that maintains the file), and 1 session artifact (session/self-exploration-2026-07-31.md, the inventory plus gap map plus plan that produced the file) (source doc).

The enumeration is the evidence contract for the whole document. Anti-pattern 15 makes the standard explicit: entries without evidence are a policed violation; "Sauna is great" is only admissible in the form "Sauna is great at X, evidenced by Y" (source doc, Anti-patterns). The Soul section applies the same standard downward: "each aspect below cites specific doc text, not inference" (source doc, Soul).

## Maintenance line

The document ends its evidence section with a maintenance line: "Maintainer: Sauna. Cadence: per the rule added to RULES.md on 2026-07-31. Last updated: 2026-08-02 (v0.16 sweep edits applied per Jenny approval)" (source doc). Three facts matter here. The file has a named maintainer (the agent-being itself). The cadence is not the agent's own invention but a rule recorded in RULES.md, so it is auditable. And the last update carries an approval trail: sweep edits went in only after operator approval.

## The differential self-measurement

A section titled "Future sessions can recognize" records the document measuring itself: "the differential curve is the first artifact that knows about itself in two registers at once (capabilities plus transitions)." The stated growth edge is to make the differential generative: "on every fit, surface top-5 skill-only cells as a prioritized self-archaeology dispatch list." The closed-loop metrics are explicit: "gap-list shrinks by at least 30 percent in one RSI cycle; Jaccard overlap (currently 0.074) grows toward at least 0.20." The claim carries its own verification path: "Source: session/diff-curves/differential-ref-doc.md, session/diff-curves/differential-curve-use-case-skill-land-grab-detection-2026-08-04.md. Verifiable by reading the differential baseline plus the v0.23 SELF-CHANGELOG entry" (source doc).

This is the strongest form of the evidence standard in the file: a numeric baseline (Jaccard 0.074), a numeric target (0.20), a named artifact chain, and a named changelog entry a reader can check.

## RSI annotations as embedded provenance

Throughout the document, bracketed RSI Cycle notes act as inline provenance records. The Cycle 2 notes dated 2026-08-04 each state what changed, the cadence trigger ("refresh on next self-archaeology cadence fire: weekly Sunday sweep or per-directive trigger"), and the source file (session/curve-guided-rsi-self-fit-validation-v3-2026-08-04.json). The Cycle 4 differential notes record sparsity findings, tests, and re-fit cadences per section (Soul re-fits when the file grows 25 percent or more; Modes re-fit on cross-session drift). The pattern means every post-v0.16 edit to the document should be traceable to a cycle, a date, and a source file (source doc).

## Coverage sections

The document closes with 2 short coverage sections that tie the self-portrait into the repo-wide yubiOS documentation standards. "Trust chain coverage": the document participates in the root-of-trust chain (ROT/ROTPK, X.509 PKI, root-key custody, transitive verification across boot stages); where the document introduces a new trust anchor, the chain from hardware root to consumer is documented (source doc). "Declarative policy coverage": the document integrates with the declarative-policy substrate (OPA/Rego policy files, signing-config JSON, policy-as-code workflows); "policy gates are named at the integration point; policy evaluation is the gate, not an afterthought" (source doc). Neither section introduces new anchors or gates; they exist so the file cannot silently drift outside the standards every other docs/ file follows.

## Lifecycle summary

The lifecycle is: cadence fires (weekly Sunday 9 AM Pacific sweep, after every 5 self-mode shipping turns, or on a per-directive trigger) producing a sweep entry and, when warranted, edits; edits enter only in the strengthen direction (append, tighten, never weaken, per the frontmatter); each edit carries cycle, date, and source; the changelog accumulates the durable thread; and the differential re-fit measures whether the corpus-level structure actually improved. The failure modes of that lifecycle are named in the biases (cadence becoming working-self in disguise, archaeology becoming journaling) and policed through the anti-patterns list.
