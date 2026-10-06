# 01 Philosophy and Scope

Scope: why the curve-guided-rsi-self skill exists, the philosophy it inherits from its parent, the expanded corpus scope, and the exact trigger and exclusion conditions that decide when to run it.

## What the skill is

The curve-guided-rsi-self skill is the offshoot of the curve-guided-rsi meta-skill retargeted at the agent's own self-documents: SELF.md, SELF-CHANGELOG.md, and optionally the full 10-file personal memory corpus plus PROJECT_RULES (source doc: yubi-OS/yubiOS skills/curve-guided-rsi-self/SKILL.md). The parent skill composed three components against the yubiOS skill corpus: learned-latent-curve as the curve fitter, negative-skill-space as the gap mapper, and recursive-self-improvement as the edit protocol. That composition was built against a corpus of 69 or more skills where the 20-item curve-fit gate is trivially satisfied. The offshoot makes the same composition executable against self-doc corpora, where the 20-item gate is the binding constraint (source doc).

The parent philosophy transfers unchanged: treat the curve as a prioritization lens. Sparse cells in the fitted 2-D curve become the candidate gap-list, and the curve's t coordinate becomes the audit trail's primary key (source doc). The idea of ordering work by where a low-dimensional projection is thin is the same logic that dimensionality reduction workflows use when they embed high-dimensional data into a few informative axes for downstream triage (weak backing, jev weight 0.18: https://www.sc-best-practices.org/preprocessing-visualization/dimensionality-reduction/). Ranking items by a measurable signal instead of enumerating them flatly is standard prioritization practice (weak backing, jev weight 0.05: https://en.wikipedia.org/wiki/Prioritization).

## The six philosophy commitments

The source doc's Philosophy section fixes six points (all source doc):

1. Two separate corpora, fit independently. SELF.md and SELF-CHANGELOG.md have different structure (rows versus entries) and different primitive bases. They are never treated as one corpus. Each gets its own Stage 1 fit, its own Stage 5 re-fit, and its own verification metric.
2. Expanded corpus scope (v1.1). When the audit widens to all 10 memory files (USER_PREFERENCES, COMPANY, RULES, SAUNA_IDENTITY, SAUNA_TOOLS, USER_PROFILE, USER_RELATIONSHIPS, RECENT_ACTIVITY) plus PROJECT_RULES, a unified 9-D memory-file basis replaces the per-file bases, merging the audit-trail and substrate lenses into one coverage basis.
3. Granularity is canonical: each version is one corpus item. A SELF-CHANGELOG entry (v0.1, v0.2, and so on) is one item; a SELF.md row (one strength, bias, anti-pattern, mode, energy, or growth edge) is one item.
4. The 20-item gate is the binding constraint. SELF-CHANGELOG carries 18 entries (v0.1 to v0.18) and SELF.md carries about 51 rows. The decomposition rule handles smaller corpora, and for memory files it splits sections into sub-events rather than splitting rows.
5. Whole-self output is required per RSI cycle. SELF.md Bias #11 (same-cadence drift, added v0.17) names the failure: running the sweep, appending an entry, and saving a gap map is shipping cadence with a creative-self label. Each cycle must produce at least one whole-self output that is not a working-self analysis.
6. Restful-self mode is the inverse protocol. Per the restful-self skill's anti-patterns, the mode that observes the shape without naming gaps is the inverse of this skill. The two are paired but never co-running: if restful-self triggers, this skill pauses.

The closed-loop claim the skill makes is verifiable: after RSI cycles, the curve's sparse cells become less sparse, or migrate to lower-frequency regions, as self-doc gaps close. This converts self-archaeology from a one-shot audit into a measurable improvement process (source doc).

## When to use

The source doc lists six conditions, and a run qualifies when they hold (source doc):

- The corpus has at least 20 items at the canonical each-version-is-one-item granularity, or the decomposition rule legitimately applies.
- A structured binary-coverage basis is available: per-corpus 9-D primitives for SELF.md rows versus SELF-CHANGELOG entries, or the unified memory-file basis for the expanded corpus.
- The user wants prioritized self-archaeology effort rather than a flat gap-list.
- The corpus is expected to evolve, so re-fits will show delta.
- The cadence is alive per the self-archaeology skill: after every 5 self-mode turns, after every self-exploration directive, weekly Sunday 9 AM Pacific, or when drift is suspected.
- The corpus has a measurable delta surface: per single-action-curve-rsi's Composition Rule, every atom action produces a per-file delta (d_pre minus d_post, a chordal proxy on S2, at least 0 by Lemma 1), and the Stage 5 metric is the sum of per-file atom deltas over the corpus.

## When NOT to use

The source doc's exclusion list is equally explicit (source doc). Do not run this skill when the corpus has fewer than 20 items and decomposition would violate the each-version-one-item rule, for example a single SELF-CHANGELOG entry with no sub-events; plain self-archaeology whole-corpus dispatch is the fallback. Do not run it in restful-self mode, because gap-naming contradicts that protocol. Do not run it when the user wants a one-shot gap-map, since self-archaeology alone is faster. Do not run it when an unconstrained action space is needed, because Stage 3 dispatch is atom-only by default (deletions and multi-flip edits are deferred to a single-action-curve-rsi extension not yet implemented in v1). Do not run it on a stable corpus that will not grow, because re-fits will not show delta and the closed-loop metric cannot fire. And do not run it if the whole-self output requirement would be performed rather than genuine: Bias #11 is live, and performative whole-self output is the failure mode this skill specifically guards against.
