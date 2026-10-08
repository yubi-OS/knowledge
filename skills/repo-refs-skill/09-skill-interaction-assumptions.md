# 09 Skill Interactions, Key Assumptions, and Lifecycle

Scope: how repo-refs-skill composes with the other skills in the curve-rsi family, the 10 numbered assumptions whose violation breaks correctness, and the lifecycle from initial run to fixpoint. This is an internal-record subtopic, no dig: yubi-OS/yubiOS skills/repo-refs-skill/SKILL.md is the sole source.

## Interaction map (source doc, "Interaction with Other Skills")

Upstream dependencies whose stages inherit verbatim:

- hyperspherical-harmonic-curve: the Stage-1 lift (PCA top-2, stereographic projection, Mobius) and the Stage-2 equal-area partition plus sparse-cell detector, the Stage-3 dispatch via single-action-curve-rsi, and the Stage-5 fit-quality gate (PC1+PC2 at least 0.40) all inherit verbatim.
- negative-skill-space: the cycle-1 NSS 12-axis sweep on the archive produces the per-corpus primitive basis derivation.
- github-api: the refs/ listing fetch via the Contents API uses this skill's REST patterns.
- parallel-deep-research: upstream intake; Mode C dispatches 3 to N parallel subagents per its protocol.

The edit protocol and family:

- single-action-curve-rsi: the atom. Mode D is one atom cycle. The composition rule (Lemma 1 to Theorem 1) applies: every cycle's edit is one atomic action, and cumulative corpus delta is monotone non-decreasing (Corollary 1).
- recursive-self-improvement: the bounded loop on the archive, cycle cap 3 as soft preference. Self-mode requires a fresh-context subagent every cycle, because cycle 2 and beyond re-introduces author bias.
- curve-guided-rsi: the parent meta-skill; the 5-stage pipeline applies verbatim to the refs/ corpus.
- curve-guided-rsi-self: sibling under the same parent, different substrate (memory files vs refs/ docs). The per-corpus primitive basis principle carries forward.

Siblings and orthogonal lenses:

- repo-history-skill: sibling, different substrate (git plus Linear event stream). The two skills cover complementary views: events versus durable knowledge, composing at the cross-substrate drift detector.
- self-archaeology: audits the agent-being; this skill audits the refs/ corpus. Pairs with curve-guided-rsi-self for cross-substrate drift detection.
- doubt-driven-development: orthogonal, applied to each RSI edit hypothesis before the edit; a per-hypothesis supplement, never a substitute for the fresh-context subagent requirement.
- context-isolation: orthogonal, enforces the fresh-context requirement in self-mode.
- token-efficiency: always-on; the refresh plus fit can be expensive on large corpora.
- internal-big-picture: orthogonal; its 10-primitive spine (attestation, trust chain, least privilege, declarative policy, continuous/adaptive, immutability, audit/evidence, segmentation, cryptographic identity, self-describing) is the natural axes for has_priority_signal ordering, for example ADR-031 to trust chain, OMN-144 misbehavior-cutoff to segmentation.

## The 10 key assumptions (source doc)

1. Target repo is yubi-OS/yubiOS, the single target; the agent-skills mirror retired 2026-09-24. Validation: count refs/*.md via the Contents API; if N < 20 on the chosen repo, fall back to repo-history-skill instead.
2. GitHub credential is conn_3h7rj41VF6hs (MASTER GIT SU, fine-grained PAT, verified live 2026-07-24, expires 2027-07-25), the sole credential per PROJECT_RULES.md line 33. Without Contents: Write or Metadata: Read the cycle fails before Stage 1; surface it, do not work around it.
3. N_files at least 20 skips the decomposition rule. Below that, PCA degenerates and the skill falls back to the NSS 12-axis sweep, Mode A only.
4. Cycle cap 3, soft-preference default, overridable per recursive-self-improvement cycle-4's explicit user-override protocol: record the override in the cycle-1 changelog, the fixpoint rule remains the stopping signal, escalate at cycle 5 and beyond. Never loop past cycle 3 without a recorded override.
5. The per-corpus 9-D basis is replaceable, not canonical. After the cycle-1 NSS re-map, near-constant primitives drop and new ones can be added if a real Extend gap demands it.
6. The ideal pole is the all-ones vector (1,1,...,1) in {0,1}^9, the fully-archetyped doc. It stays fixed rather than becoming the Frechet mean because the corpus is small (129 files) and a data-dependent mean would shift cycle to cycle.
7. The sparse-cell detector chordal radius is about 0.095 on the equal-area S2 partition. r = 0.05 would fake a pre/post improvement (cell-count change without delta change).
8. Deep-research subagent outputs are write-through to yubi-OS/yubiOS refs/<topic>-YYYY-MM-DD.md; subagent prompts must end with the "final artifact" directive.
9. Naming convention is lowercase-hyphenated-topic-name-YYYY-MM-DD.md, refs/-specific; the reverse documents/ pattern does not apply and wrong-pattern names get renamed before push.
10. agent-skills refs/ was sparse by design (3 files) and is retired; do not run the fit on any other repo's refs/ because it would degenerate.

## Lifecycle

Initial run: Mode A, cold-start refresh; cycle 1 is the gap-mapping cycle with no prior archive to RSI. Subsequent runs: Mode B, incremental; cycles 2 and beyond run the bounded RSI loop on the augmented archive. Deep-research cycles: Mode C. Single-file RSI: Mode D. Re-fit cadence: corpus growth of at least 25% or explicit user request. Cache TTL: 7 days. Push cadence: per cycle, documented in session/repo-refs-changelog-<repo>-<date>.md.

The changelog shows the full arc: cycle 0 (initial derivation on 5 representative docs), cycle 1 (v1 shipped, live fit pending), cycle 2 (7-D re-derivation after dropping 2 near-constant primitives; 45-file Mode D batch merged as PR 197), cycle 3 (post-merge re-fit; 25-file batch as PR 198; all 3 fixpoint conditions pass and the loop terminates at the cap).

## Output shape across surfaces

Local per-cycle artifacts under session/: the archive JSON (about 50 to 200 KB), the fit JSON (about 5 KB), the gap-map markdown (about 3 to 10 KB), the changelog markdown (about 2 to 5 KB), the deep-research synthesis (about 5 to 15 KB), and the per-cycle metrics JSON (about 10 KB). Pushed artifacts: the coverage map at refs/repo-refs-coverage-map-<repo>-<date>.md and the skill itself. Linear artifact: a status comment on the parent OMN issue per cycle per project.
