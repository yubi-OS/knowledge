# 02 Granularity Rule

Scope: the canonical rule that each version is one corpus item, the per-file item-unit table for all 11 files, the decomposition rule that satisfies the 20-item gate for small corpora, and the 3-level bound that stops granularity drift.

## Why granularity is the defining constraint

The granularity rule is what makes this skill different from its parent. The parent's corpus is a flat list of skills; this skill's corpus is a hierarchical document structure (sections, rows, sub-events), and the granularity choice changes the curve fit's stability (source doc: yubi-OS/yubiOS skills/curve-guided-rsi-self/SKILL.md). Each version is one corpus item: one SELF-CHANGELOG versioned entry is one item, and one SELF.md row (a single strength, bias, anti-pattern, mode, energy, or growth edge) is one item (source doc). Choosing the item unit is not bookkeeping; it determines how much variance the PCA stage sees and whether the 20-item gate passes at all.

## The item-unit table

The source doc fixes the item unit per file, with the typical counts observed at validation time (all source doc):

| File | Item unit | Typical count |
|---|---|---|
| SELF.md | One row | 51 rows |
| SELF-CHANGELOG.md | One entry (each YYYY-MM-DD, v0.X header) | 18 entries (v0.1 to v0.18) |
| USER_PREFERENCES.md | One section | 11 sections |
| COMPANY.md | One section | 8 sections |
| RULES.md | One section | 9 sections |
| SAUNA_IDENTITY.md | One section | 5 sections |
| SAUNA_TOOLS.md | One section | 5 sections |
| USER_PROFILE.md | One section | 13 sections |
| USER_RELATIONSHIPS.md | One section | 5 sections |
| RECENT_ACTIVITY.md | One entry (each YYYY-MM-DD day header) | 4 entries |
| PROJECT_RULES.md | One section | 24 sections |
| Combined | Top-level union, de-duplicated by anchor | 154 or more items |

The versioned-changelog entry as an atomic unit matches the broader changelog discipline of one logical change per entry; style guides such as Common Changelog argue for entry-level structure with dates and change summaries (weak backing, jev weight 0.15: https://common-changelog.org/), and automated release tooling such as semantic-release treats each release as one versioned, immutable unit derived from commit history (jev weight 0.57, the only dig result in this corpus at or above 0.5: https://github.com/semantic-release/semantic-release). The skill's own rule is stricter than either: it pins the item to the version header itself, not to a diff or a commit range.

## The decomposition rule for N under 20

If a corpus has fewer than 20 items at the canonical granularity, for example a fresh SELF-CHANGELOG with fewer than 20 entries, the skill decomposes each top-level item into its sub-events (source doc):

- A SELF-CHANGELOG entry becomes sub-events: each fix, each pushback, each lesson, each test, each evidence anchor, typically 5 to 15 sub-events per entry.
- A SELF.md row becomes sub-rows: each sub-clause, each evidence citation, each example, typically 1 to 3 sub-rows per row.
- A memory-file section becomes sub-sections: each bullet and sub-bullet, typically 3 to 10 sub-sections per section.

Decomposition produces a finer-grained corpus where the curve fit sees more variance. It is the binding workaround for the 20-item gate. For memory files, decomposition splits each section into sub-events rather than splitting rows (source doc).

The rule carries a hard bound: at most 3 sub-event levels. This prevents infinite granularity drift, the failure mode where an entry is decomposed into 100 sub-events and the corpus becomes sparse-fit noise where the curve is meaningless (source doc).

## How the rule interacts with the gates

Three checks in the skill's verification sections depend directly on this rule (source doc). First, the entry check: N must be at least 20 at canonical granularity, or the decomposition rule must be applied with the bound respected. Second, the red-flag check: if decomposition inflates N above 20 but drives PC1 plus PC2 below 0.40, the decomposition killed the variance and canonical granularity must be used instead. Third, the red-flag check for all-constant columns: if a decomposed corpus produces a primitive matrix with all-constant columns, the basis is wrong for that granularity and must be re-derived from scratch. In every case the fallback for a corpus that cannot pass the gate honestly is plain self-archaeology whole-corpus dispatch, not a forced curve fit (source doc).
