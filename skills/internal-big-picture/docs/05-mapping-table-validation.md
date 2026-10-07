# 05 - The mapping table and cell validation

Scope: the skills/docs/refs to primitives mapping table, what it is for, and the 3-check cell validation protocol that keeps it from drifting into mythology.

Ground source: yubi-OS/yubiOS skills/internal-big-picture/SKILL.md (source doc). This is an internal-record subtopic, no dig: the table and its validation protocol are the source doc's own artifacts.

## What the table is

The mapping table is hand-maintained. It records which yubiOS skills, docs/ files, and representative refs/ documents are load-bearing for each of the 10 primitives. The source doc is explicit about its purpose: it is a cache, it tells you which skills touch which primitives, and using it as a substitute for reading the skill content is an anti-pattern (source doc). In the source doc the table covers roughly 50 skill rows, 9 docs/ rows, and 8 representative refs/ rows, each marked with a bullet per primitive it is load-bearing for.

A few structural facts from the table are worth stating because they anchor the lens:

1. `0pointer-mastery` is the only skill marked on all 10 primitives, which is expected because 0pointer is the OS-architecture primitive source itself.
2. `security-and-hardening` anchors least privilege, audit, and cryptographic identity.
3. `slsa-provenance` and `dm-verity-and-integrity`-family skills anchor the attestation, trust chain, immutability, and provenance cluster.
4. Several skills have entirely empty rows (for example `planning-and-task-breakdown`, `code-review-and-quality`, `interview-me`). Empty cells are honest: those skills are process skills, not security-primitive skills.
5. Among docs/, THREAT_MODEL.md is the widest row (8 of 10 primitives), while FUTURE.md is empty.
6. Among refs/, the Poettering vision doc maps to all 10 primitives, mirroring `0pointer-mastery`.

## The 3-check validation protocol

Every bullet in the table must pass three checks before it lands. The check is cheap, under a minute per cell, and is the discipline that keeps the table honest (source doc):

1. **Definition match.** Does the skill or artifact actually do what the primitive's one-paragraph definition says? For Primitive 6 (Immutability): does the skill establish or defend a unit of integrity verified at rest? If yes, mark it. If the skill merely uses an immutable thing, for example reads from a dm-verity-protected /usr, it is not load-bearing for that primitive. Using is not defending.
2. **Body match.** Does the skill's own SKILL.md or the artifact's docs page explicitly cover the primitive, or does the artifact's role in the workflow require it? Cite the artifact's own text or a specific workflow step. If you cannot cite it, the cell is unverified: mark it as such or move it to the noted-but-unverified list.
3. **One-line justification.** Write one sentence per marked cell in a comment, ADR, or ref doc explaining why the skill is load-bearing for the primitive. If the sentence needs more than one sentence, the cell probably wants marking on multiple primitives; split it.

## Drop-on-fail rule

When a cell fails any check, drop it from the table. Do not soften a strong mark to a weak one to keep the row visible. Empty cells are honest; mis-marked cells surface as drift in every future re-map, which makes them a 12-axes-wide problem rather than a local one (source doc).

## Validation cadence

Re-validate every cell every 3 months, or when a primitive is added or changed, or when a new skill or ADR joins the corpus, whichever comes first. For the next major yubiOS release, or after any of the four sources ships a new version (systemd major, HITRUST CSF minor, CISA ZTMM update, Chronicle UDM bump), run the full re-validation (source doc). The cadence inherits the per-source discipline from doc 03: release-event-triggered, not calendar-triggered, with the 3-month ceiling as the drift backstop.

## The anti-pattern to avoid

Auto-generating the mapping table from a script that pattern-matches skill names to primitive keywords is an explicit anti-pattern in the source doc. The check is meaning, not form; script-generated tables drift immediately because keyword co-occurrence does not encode the definition-match step. The mapping stays hand-maintained for auditability, with the source doc noting automation is acceptable only after 3 cycles prove the model is stable (source doc).
