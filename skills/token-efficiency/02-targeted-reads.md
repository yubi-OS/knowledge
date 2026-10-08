# 02 - Read Narrow

Scope: targeted offset and limit reads of large files instead of whole-file reads, and the chunk-selection discipline that generalizes beyond file reads.

## The practice

The source doc (yubi-OS/yubiOS `skills/token-efficiency/SKILL.md`, Core practices 2) states: for large files, read a targeted offset/limit range instead of the whole thing, and re-read a different range later if needed. The skill's own rationale is that a targeted re-read is still cheaper than one giant read most of which goes unused (source doc). Its verification checklist turns this into a measurable rule: each read on a file over roughly 200 lines should have used offset or limit to target a range, not the whole file (source doc, Verification).

The corresponding anti-pattern pairs with doc 01: the whole-file read that finds one function among thousands (source doc, Anti-patterns). Targeted reads are the recovery move when the search pass locates the target; they are not a license to skip searching first.

## Chunking and selection in the wider literature

The dig results frame targeted reading as an instance of a broader pattern: split content into meaning-preserving units, then select only the units the current task needs.

A semantic chunking and reranking write-up (https://martinuke0.github.io/posts/2026-03-06-optimizing-llm-context-windows-with-advanced-reranking-and-semantic-chunking-for-high-performance-systems/, jev weight 0.52) argues the solution to wasted context lies in semantic chunking, defined as splitting text into meaning-preserving units, combined with advanced reranking, defined as selecting the most useful chunks for the current query, in order to maximize the utility of every token (jev weight 0.52). Translated to file reads: the offset/limit window is the chunk, and the agent's own plan is the reranker. A chunk that starts mid-function or cuts a config block in half fails the meaning-preserving test even if it is short.

A RAG chunking-strategies article (https://www.meilisearch.com/blog/rag-chunking-strategies, jev weight 0.61) covers chunking best practices and evaluating chunking performance (jev weight 0.61, per the snippet's section listing). Its value here is the evaluation habit: chunking choices should be measured, not assumed. The same applies to read ranges; if a targeted read misses, the second read is the evaluation signal.

A Claude Code tips site documents the platform behavior this practice relies on (https://claudecodetips.com/en/guide/pitfalls/38, jev weight 0.36, weak backing): Claude reads files partially by default in some flows, meaning the tool layer already enforces a form of targeted reading. Weak backing per the weighting pass, so treat the platform-behavior claim as unverified.

## Failure modes

1. **Off-by-context windows.** Reading lines 100-200 when the target sits at line 190-210 produces a second read plus a wasted first one. The source doc accepts the two-read cost explicitly (source doc, Core practices 2), but the cost is bounded only if the first window was chosen from a search hit, not guessed.
2. **Reading with no target.** An offset/limit read of a range you cannot name the purpose of is a whole-file read in slow motion.
3. **Summarizing past the target.** The source doc's Red Flags warn against over-efficiency that drops fields the downstream task needs (source doc, Red Flags). A targeted read of the wrong 100 lines loses correctness, not just tokens; verification skills catch this downstream.

## Operational rules

1. Files over roughly 200 lines: read with offset and limit only (source doc, Verification).
2. Derive the window from a prior grep or glob hit, never from a guess.
3. When a second read is needed, read a different range rather than widening the first read retroactively (source doc, Core practices 2).
4. Keep chunks meaning-preserving: align windows with function or block boundaries where the file structure allows (adapted from https://martinuke0.github.io/posts/2026-03-06-optimizing-llm-context-windows-with-advanced-reranking-and-semantic-chunking-for-high-performance-systems/, jev weight 0.52).

## Sources

- Source doc: yubi-OS/yubiOS `skills/token-efficiency/SKILL.md` (Core practices 2, Anti-patterns, Red Flags, Verification).
- https://martinuke0.github.io/posts/2026-03-06-optimizing-llm-context-windows-with-advanced-reranking-and-semantic-chunking-for-high-performance-systems/ (jev weight 0.52).
- https://www.meilisearch.com/blog/rag-chunking-strategies (jev weight 0.61).
- https://claudecodetips.com/en/guide/pitfalls/38 (jev weight 0.36, weak).
