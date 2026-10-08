# 07 - Operating Modes, Incremental Refresh, and the Deep-Research Hook

**Scope.** The four operating modes (cold-start, incremental refresh, deep-research cycle, target-file RSI), the incremental refresh contract with its 7-day cache TTL, the deep-research hook that dispatches parallel subagents per cycle, and the output artifacts each run produces.

This is an internal-record subtopic: every substantive fact comes from the source doc, `yubi-OS/yubiOS skills/repo-history-skill/SKILL.md`. No searXNG dig was run; the modes and artifacts are records of this skill's own protocol. (Internal-record subtopic, no dig.)

## Mode A: cold-start refresh

A new session opens on a repo with no cached archive (source doc):

1. Pull everything: all PRs, all issues, all commits (no since filter), all releases.
2. Pull the Linear side (team OMN, first 200).
3. Compute the three join keys.
4. Compute 9-D coverage per item; aggregate.
5. Stage 1, Stage 2, Stage 3, Stage 5 (no Stage 4 because there is no prior archive to RSI).
6. Save to session/repo-history-archive-<repo>-<date>.json.
7. Push the human-readable summary to refs/.

## Mode B: incremental refresh

A subsequent run on the same repo (source doc):

1. Read the cached archive.
2. Pull deltas: pulls, issues, commits with since=last_run_timestamp.
3. Pull Linear items with updatedAt >= last_run_timestamp.
4. Merge deltas into the cached archive.
5. Re-fit (Stage 1 and 2).
6. Run Stage 4 RSI dispatch on the sparse-cell list.
7. Save and push.

The cache file tracks last_run_timestamp as a top-level key. If the cache is older than 7 days the skill warns and re-fetches everything, because events can fall outside the incremental window (squash merges that pre-date the timestamp are the named example). Cache invalidation is never silent: the warning is mandatory (source doc, Anti-patterns).

## Mode C: deep-research cycle

A cycle with a research topic (source doc):

1. Run Mode A or B first (refresh the archive).
2. Dispatch 3 or more parallel subagents per the parallel-deep-research protocol: Stream 1 is a subject deep-dive of the topic's mechanism in the repo context, Stream 2 is prior art on how others handle the topic, Stream 3 is a comparative survey of what the repo's neighbor repos do.
3. Augment the archive with a 5th sub-corpus, corpus_as_deep_research: the skill reads each subagent's output, computes its 9-D primitive coverage, and adds it as items.
4. Re-fit (Stage 1 and 2); sparse-cell detection finds deep-research items whose coverage is structurally unique.
5. Run Stage 4 RSI dispatch on the augmented sparse-cell list.
6. Save and push.

Every subagent prompt begins with the standard skill-load directive: read using-agent-skills, token-efficiency, context-isolation, then repo-history-skill, in that order (source doc). Subagent outputs land in session/subagent-<id>/<topic>-YYYY-MM-DD.md. The named use case is a "deep research: dm-verity-and-integrity's role in yubiOS" cycle, which refreshes the archive, dispatches the 3 streams, fits on the augmented corpus, and reports which findings sit in sparse cells as priority items for follow-up cycles (source doc).

## Mode D: target-file RSI

A single corpus item gets one atom cycle without the full fit; see doc 06 (source doc).

## Lifecycle and cadence

Initial run is Mode A and cycle 1 is the gap-mapping cycle; subsequent runs are Mode B with the bounded RSI loop from cycle 2; deep-research cycles are Mode C; single-item RSI is Mode D. Re-fit cadence: when the corpus grows by 25% or more, or on explicit user request. Cache TTL: 7 days as the refresh-warning threshold. Push cadence: per cycle, documented in the session changelog file (source doc).

## Output shape

Local artifacts (session only, not repo truth): the cached archive (50 to 200 KB JSON with coverage, coordinates, sphere points, d_pre, last_run_timestamp), the fit metrics (about 5 KB: PC1+PC2, holdout R^2, sparse-cell count, isolated items, primitive survival list), the gap-map markdown (3 to 10 KB), the changelog markdown (2 to 5 KB, hypothesis to edit to result per cycle), the deep-research synthesis (5 to 15 KB), and per-cycle metrics JSON (about 10 KB).

Pushed artifacts: the human-readable summary at refs/repo-history-archive-<repo>-<date>.md on the target repo, the SKILL.md itself, and the conceptualization doc at refs/repo-history-skill-2026-08-07.md (source doc). A Linear status comment on the parent OMN issue (or a new "Repo History Archive Refresh" item) carries the cycle summary.

## Trigger phrases

The source doc's When to Use list names the cold-start problem on yubi-OS/yubiOS, post-merge-batch refresh, deep-research directives needing cross-corpus context, the self-archaeology cadence comparing SELF-doc substrate against the repo event stream, and the plain-language triggers: "refresh the archive", "what's in the history", "deep research X with the full context", "audit the git + Linear join" (source doc). Explicit non-uses: single-PR understanding, single-issue triage, security audits, code review, and SELF.md self-archaeology all route elsewhere (source doc).
