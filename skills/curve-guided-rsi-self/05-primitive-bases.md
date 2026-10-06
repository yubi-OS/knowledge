# 05 Primitive Bases

Scope: the three per-corpus 9-D binary primitive bases (A for SELF.md rows, B for SELF-CHANGELOG entries, C unified for the expanded memory-file corpus), why the parent's single basis does not transfer, and how near-constant column drops apply per corpus.

## Why per-corpus bases

The parent skill's 10-primitive basis, taken from the internal-big-picture skill (attestation, trust chain, least privilege, declarative policy, continuous and adaptive, immutability, audit and evidence, cryptographic identity, segmentation, self-describing, minus self-describing at 94 percent coverage), does not transfer directly to self-doc corpora (source doc: yubi-OS/yubiOS skills/curve-guided-rsi-self/SKILL.md). Self-doc corpora have three structural lenses: SELF.md rows are substrate claims about the agent; SELF-CHANGELOG entries are audit-trail records; memory-file sections are operational context for the user (source doc). Using one basis across all three flattens the structural signal. Per-corpus bases preserve each corpus's signal, and the unified memory-file basis preserves signal when the corpus is expanded (source doc).

Reducing binary coverage matrices to a few components is a known pattern; logistic PCA is the canonical variant of PCA adapted to binary data (weak backing, jev weight 0.15: https://arxiv.org/abs/1510.06112). The skill uses plain PCA on the seeded-QR lift instead, but the underlying problem, extracting low-rank structure from a binary matrix, is the same.

## Basis A: SELF.md row primitives (9-D)

Each row in Strengths, Biases, Anti-patterns, Modes, Energies, and Growth-edges is scored on 9 binary indicators (all source doc):

- p0 soul_cited: the row cites yubiOS docs (MISSION, THREAT_MODEL, and so on).
- p1 strength_evidence: the row claims a capability and cites evidence (commit, run, pattern).
- p2 bias_corrective: the row names a bias and names a corrective.
- p3 anti_pattern_bad: the row names an anti-pattern and marks it as bad.
- p4 mode_named: the row names a mode (working-self, creative-self, restful-self, adversarial-self).
- p5 energy_named: the row names an energy (speed, rigor, concision, care).
- p6 growth_edge: the row names a growth edge with the "future sessions can recognize" framing.
- p7 whole_self_output: the row is itself a whole-self output (register-shift example).
- p8 source_cited: the row cites a source (commit, session, pattern, file path).

This basis captures what makes a SELF.md row load-bearing. Near-constant columns (coverage above 0.90) are dropped per corpus state at fit time (source doc).

## Basis B: SELF-CHANGELOG entry primitives (9-D)

Each dated versioned entry is scored on 9 binary indicators (all source doc):

- p0 has_date_version: the entry has both date and version label.
- p1 has_what_changed: the entry describes what changed with an action verb.
- p2 has_why: the entry describes motivation (intent).
- p3 has_evidence: the entry cites commits, runs, or patterns (audit anchors).
- p4 has_test: the entry names a forward-looking test (verifiability).
- p5 has_pushback: the entry acknowledges its own failures or lessons (honest qualification).
- p6 has_whole_self_note: the entry includes a "Self-mode reflection" or whole-self note.
- p7 has_pending_at_exit: the entry honestly qualifies what is incomplete.
- p8 has_cadence_trigger: the entry names which cadence fired.

This basis captures the audit-trail discipline, with the same near-constant drop rule (source doc).

## Basis C: unified memory-file primitives (9-D)

When the corpus expands to the 10 memory files plus PROJECT_RULES, one unified 9-D basis works across all sections, entries, and rules (all source doc):

- p0 has_purpose: a clear purpose statement (contract, intent, or what it covers).
- p1 has_source: a citation of where the information comes from (commits, sessions, patterns, URLs, or named skills).
- p2 has_evidence: concrete examples or anchors (sha256, PASS, verified, numbers).
- p3 has_correction: explicit correction or codification history (Updated dates, Added, Fixed, Resolved).
- p4 has_constraint: a hard constraint or anti-pattern (Must, Never, Always, Don't, ban).
- p5 has_pushback: acknowledged limits or failures (Pushback, Lessons, honest qualification, verified, fail).
- p6 has_whole_self_note: a register-shift reflection (Self-mode reflection, Whole-self, Bias #N).
- p7 has_test: a verification rule or Test section (Test:, Verified, verify, PASS).
- p8 has_cadence: a statement of when and how to update (Cadence, weekly, Sunday, per-directive).

Basis C merges the audit-trail and substrate lenses into one coverage basis for the expanded scope (source doc).

## Selection rule

Per-file fits pick the basis by file type: basis A for SELF.md alone, basis B for SELF-CHANGELOG.md alone, basis C for memory-file sections and for the combined expanded corpus. Mixing SELF-CHANGELOG entries with SELF.md rows in one corpus, or SELF.md rows with memory-file sections in the same basis, is an anti-pattern because the lenses differ (source doc). At validation time the dropped and kept columns per corpus were recorded in the per-corpus coverage report, which Stage 1 persists with the cache (source doc; see doc 03 for the drop rule and doc 06 for the recorded columns).
