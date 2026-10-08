# 01 - Search Before You Read

Scope: find the right file and the right line with grep or glob before any full-file read, and why the inverse habit is the single largest structural token sink in agent sessions.

## The practice

The source doc (yubi-OS/yubiOS `skills/token-efficiency/SKILL.md`, Core practices 1) states the rule plainly: use grep/glob to find the right file and the right line before reading anything, because reading a whole file to find one function wastes every line that is not that function. The skill's own anti-pattern list repeats it as the first named failure: reading an entire multi-thousand-line file to find one function or config value (source doc, Anti-patterns).

## The evidence that exploration dominates token budgets

The strongest dig result backs this with measurement. A 2026 arXiv paper on retrieval agents for coding agents (CodeGrep, https://arxiv.org/abs/2608.05886v1, jev weight 0.55) reports that modern LLM coding agents such as Claude Code and OpenHands share a common inefficiency: they spend much of their token budget finding the file to patch rather than patching it. On SWE-Bench Verified, a 30B OpenHands agent averages 23 rounds and 631K tokens per resolved issue, with many calls spent on grep, glob, and view_file during repository exploration (jev weight 0.55). The paper proposes an RL-trained retrieval agent as a fix, which is a dated extension beyond the source doc: where the skill counsels disciplined manual search, the 2026 research frontier is training dedicated retrieval models so the agent's exploration calls themselves get cheaper. Read the paper as drift-correction context, not as a contradiction of the source doc.

Tooling-side, a Claude Code community plugin (https://github.com/egorfedorov/claude-context-optimizer, jev weight 0.63) tracks token usage, identifies wasted context, and claims 30-50% savings on API costs through heatmaps and git-aware suggestions. The 30-50% figure is the project's own claim, not an independent measurement, and the backing weight (0.63) applies to the tool's existence and purpose, not to the savings number. Cite the savings only as a vendor claim.

## Scoping the search

The source doc adds the second-order rule in its Red Flags section: a grep that returns 200 lines costs less than reading the whole file only when the grep's pattern is well-scoped, and three serial greps with overlapping results cost the same as one full read (source doc, Red Flags). Search is not free; it is the cheaper of two failures only when the pattern is narrow.

The dig's strongest topical result on the search tool itself is weak: a blog post on ripgrep for coding agents (https://www.learnwithparam.com/blog/ripgrep-coding-agents-fast-code-search, jev weight 0.28) describes ripgrep as a fast code search tool for agents. Weak backing; treat it as direction only. The GNU grep manual (https://www.gnu.org/software/grep/, jev weight 0.04 in the final balanced pass) and the man7.org grep man page (https://www.man7.org/linux/man-pages/man1/grep.1.html, jev weight 0.04) are authoritative documents about grep but scored near zero on topical relevance to token efficiency; they ground the tool's behavior, not the efficiency claim.

## Operational checklist

1. Grep or glob with a specific pattern before any read (source doc, Verification item 1).
2. If the grep returns more lines than the target construct needs, tighten the pattern rather than reading the results wholesale (source doc, Red Flags).
3. Never issue a full-file read as a first attempt on an unknown large file (source doc, Anti-patterns).
4. Expect exploration to be the bulk of your budget on repository-scale tasks; the 23-round, 631K-token SWE-Bench figure (https://arxiv.org/abs/2608.05886v1, jev weight 0.55) is the order of magnitude to beat.

## Sources

- Source doc: yubi-OS/yubiOS `skills/token-efficiency/SKILL.md` (Core practices 1, Anti-patterns, Red Flags, Verification).
- https://arxiv.org/abs/2608.05886v1 (jev weight 0.55).
- https://github.com/egorfedorov/claude-context-optimizer (jev weight 0.63).
- https://www.learnwithparam.com/blog/ripgrep-coding-agents-fast-code-search (jev weight 0.28, weak).
- https://www.gnu.org/software/grep/ (jev weight 0.04, weak relevance).
- https://www.man7.org/linux/man-pages/man1/grep.1.html (jev weight 0.04, weak relevance).
