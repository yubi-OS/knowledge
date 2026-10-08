# 04 - Context Reuse and No Restatement

Scope: never re-fetch, recompute, or echo content that already sits in the session, and the provider-level caching layer that mechanizes the reuse half.

## The practice

Two of the source doc's core practices cover this subtopic (yubi-OS/yubiOS `skills/token-efficiency/SKILL.md`):

- Practice 4: content already surfaced to the user, or already sitting earlier in context, does not need to be echoed back before adding to it. Reference it; do not reproduce it.
- Practice 7: if something was already fetched or computed earlier in the session, reuse it instead of re-fetching or recomputing from scratch.

The skill's Red Flags section names why practice 7 is the dangerous one: the re-fetch habit is easy to violate (a fresh search "to be safe") and silent (the duplicate answer looks correct). If the same fact appears twice in context, suspect re-fetch (source doc, Red Flags). The anti-pattern list also covers the restatement side: copy-pasting a large file's contents into a message instead of referencing its path (source doc, Anti-patterns).

## Provider-side caching

The dig's strongest result on the mechanism (https://primeaxiom.ai/blog/prompt-caching-for-llm-cost, jev weight 0.47, weak backing) describes prompt caching as a provider- or application-supported way to reuse work for repeated context, which can reduce latency and eligible input-token cost, while noting that behavior, minimum size, lifetime, and pricing differ by official model documentation (jev weight 0.47, weak). Weak backing per the weighting pass, so verify specifics against the provider's own pricing docs before relying on any cached-token discount. What survives the weak label is the structural point: reuse is not only an agent-side habit, it is a priced platform feature, and repeating large stable context defeats it.

A context-window efficiency guide (https://dev.to/siddhantkcode/the-engineering-guide-to-context-window-efficiency-202b, jev weight 0.36, weak backing) treats context-window efficiency as an engineering discipline in its own right. Weak backing; direction only.

## The failure taxonomy

Restatement and re-fetch fail differently:

1. **Restatement is visible waste.** Echoing a tool result back before analyzing it doubles the token count of that content in the same context and adds no signal. The source doc's rule is reference, not reproduce (source doc, Core practices 4).
2. **Re-fetch is invisible waste.** The duplicate result arrives looking like fresh verification, so it survives review. The source doc flags this asymmetry explicitly: easy to violate, silent when violated (source doc, Red Flags).
3. **Cross-context duplication.** Content that lives in an earlier thread or a memory file does not need to be re-derived in-session; reference the file path or the prior decision instead. The source doc's Examples section makes in-repo touchpoints the reference mechanism (source doc, Examples).

## Operational rules

1. Before any fetch, check whether the value is already in this thread's context or a file already on disk (source doc, Core practices 7, Red Flags).
2. Reference file paths rather than re-pasting file bodies (source doc, Anti-patterns).
3. When a fact already appeared once, treat a second appearance as a re-fetch bug to fix, not as corroboration (source doc, Red Flags).
4. For long-lived stable context (system frames, large reference docs), prefer provider prompt caching where available, and verify pricing and lifetime against official docs (adapted from https://primeaxiom.ai/blog/prompt-caching-for-llm-cost, jev weight 0.47, weak).
5. State deltas, not reprises: when building on earlier content, write what changed and cite the earlier location.

## Sources

- Source doc: yubi-OS/yubiOS `skills/token-efficiency/SKILL.md` (Core practices 4 and 7, Anti-patterns, Red Flags, Examples).
- https://primeaxiom.ai/blog/prompt-caching-for-llm-cost (jev weight 0.47, weak).
- https://dev.to/siddhantkcode/the-engineering-guide-to-context-window-efficiency-202b (jev weight 0.36, weak).
- https://hai.stanford.edu/ai-definitions/what-is-a-llm (jev weight 0.12, weak relevance; grounding for the term LLM only).
