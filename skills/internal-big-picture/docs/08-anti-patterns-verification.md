# 08 - Anti-patterns, red flags, and the verification checklist

Scope: the 8 anti-patterns, the 6 red flags, and the 14-point verification checklist that gate a completed application of the lens.

Ground source: yubi-OS/yubiOS skills/internal-big-picture/SKILL.md (source doc). This is an internal-record subtopic, no dig.

## The 8 anti-patterns

1. **10-primitive cargo cult.** Invoking the primitives without source grounding. The model is a lens; the citation is the truth. Every "how would each source react?" answer must cite a URL.
2. **Treating the model as normative.** The 10 primitives are observed co-occurrence patterns, not a spec. Naming an 11th primitive is fine; treating the 10 as canonical so the new one becomes "off-model" is not.
3. **Using the mapping table as a substitute for reading the skill.** The table is a cache telling you which skills touch which primitives; it is not the skill content.
4. **Skipping the operator-experience gap.** The gap is the most load-bearing finding from the deep research; do not optimize it out of the lens.
5. **Over-splitting into per-primitive sub-skills.** One skill, all 10 primitives. Split only if a primitive grows beyond about 30 lines of content.
6. **Auto-classifying new commits and PRs.** The mapping is hand-maintained for auditability; auto-generation invites drift. Automate only after 3 cycles prove the model is stable.
7. **Replacing source-driven-development.** Citation is still the discipline; the lens is how to read sources, not the source itself.
8. **Loading the 4-source lens for a single-domain question.** The calibration gate exists to catch this; loading all four sources for a one-domain question produces 3 redundant POVs and dilutes the answer.

## The 6 red flags

1. A "how would each source react?" answer that lacks a URL citation.
2. A mapping-table row with no source. Drop the row; do not invent a mapping.
3. A primitive referenced by a different skill that does not match the definition here (for example another skill says "attestation = measurement + signature" while this skill says "attestation = cryptographic evidence of state"). Surface the disagreement; do not silently relabel.
4. An ADR or ref doc that cites one of the four primary sources but does not engage the 10-primitive lens for the decision it documents. The lens is the audit check.
5. An answer that cites all four sources for a one-domain question: the calibration gate was bypassed. Drop the off-domain POVs; the answer becomes a domain-skill answer.
6. A new "11th primitive" introduced without updating the spine and the mapping table together. The model is one artifact; partial updates invite drift.

## The 14-point verification checklist

After applying the skill, the source doc requires all 14 checks to pass (source doc):

1. The calibration gate returned YES on at least one question, otherwise back out and use the domain skill.
2. The design decision was stated in one sentence before the four POVs.
3. Each of the four POVs was answered in that source's own vocabulary, per the per-source vocabulary glossary.
4. Every claim in every POV cites a URL (source-driven-development discipline).
5. The source version cited matches the version in the Source versions used block; if not, the version block is stale: re-pin per source-specific cadence before continuing.
6. The Synthesis section named which primitives are load-bearing for the decision.
7. Sources that disagree were named with the disagreement explicit, not blended.
8. Evidence yubiOS already cites was surfaced (from refs/, docs/, ADR.md).
9. Missing evidence was named explicitly, not glossed over.
10. The operator-experience gap was considered, even if it does not apply to the specific decision.
11. The mapping table was consulted to identify which existing skills touch the same primitives, avoiding duplication; cells used were validated per the 3-check protocol.
12. No 10-primitive cargo cult: every primitive invocation has a citation behind it.
13. No vocabulary leakage: POVs use the source's own term, not a borrowed term from another source.
14. No frontmatter corruption: js-yaml validates name (regex ^[a-z0-9-]{1,64}$), description (1 to 1024 chars, no literal angle brackets), and the closing --- intact.

## How the three layers interlock

The anti-patterns define the wrong ways to use the lens, the red flags are the observable symptoms in produced artifacts, and the checklist is the per-application gate. In practice the checklist is the enforcement mechanism for the other two: checklist items 1, 11, and 12 close the cargo-cult and calibration anti-patterns; items 3 and 13 close the vocabulary-leakage red flag; items 6 through 9 close the synthesis-discipline red flags. If an artifact fails an anti-pattern check, it will almost always also fail the corresponding checklist item, which is why the checklist is run last and in full (source doc).
