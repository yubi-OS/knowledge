# 01 When to use rsi-phi-skill

Scope: when the Fibonacci-sphere variant of recursive self-improvement is the right tool, which sibling skill owns each neighboring job, and how to route between them.

## The four use triggers

The source doc (yubi-OS/yubiOS skills/rsi-phi-skill/SKILL.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/rsi-phi-skill/SKILL.md) names exactly four triggers:

1. The corpus items have a natural azimuthal ordering (time-stamped docs, ordered refs/, versioned SKILL.md files) and the flat [0,1]^2 parameter line is the wrong shape. The Fibonacci sphere replaces the line with the 2-sphere S2 sampled by Vogel's golden angle.
2. You want the basis itself to expose azimuthal structure (3-fold, 384-fold) so the sparse-cell detection picks up phase coherence, not just scalar saturation.
3. You want to compare two parameterizations, (l=128, m=256) versus (l=256, m=128), on the same corpus, to learn which direction of the spherical-harmonic degree-order trade-off wins for that corpus.
4. You want deep research per cycle as the cycle's hypothesis-proposal step: the cycle is gap-map, then deep-research subagent, then edit, not just gap-map then edit.

All four are source-doc claims; the corpus adds external grounding below.

## The four exclusions

The source doc is equally explicit about when NOT to use it (source doc):

- The corpus is 1-D (a time series, a version sequence) and t has no azimuthal structure: use recursive-self-improvement, the flat-line default.
- One file, one edit, one geodesic delta: use single-action-curve-rsi, the atomic variant.
- No recursive loop wanted, just an NSS sweep: use negative-skill-space.
- The corpus has non-orientable topology or a non-trivial fundamental group: the skill hard-codes S2, which is orientable and simply connected.

The frontmatter repeats the same list as a NOT-for block: flat-[0,1]^2 RSI routes to recursive-self-improvement, single-file atom RSI to single-action-curve-rsi, non-recursive audits to negative-skill-space (source doc).

## Corpus scope inheritance

The corpus scope matches recursive-self-improvement exactly: any SKILL.md treated as one corpus item per skill, or a refs/*.md corpus with one item per deep-research file. The bounded cycle cap is 3 cycles by default, and self-mode requires a fresh-context subagent per cycle (source doc). The skill was moved out of its own frontmatter on 2026-09-17 so the description fits the 1,024-character skill-format limit, with wording unchanged (source doc).

## External grounding for the RSI framing

Recursive self-improvement as a general concept is described on Wikipedia as a hypothesized process in which AI systems rewrite their own code (https://en.wikipedia.org/wiki/Recursive_self-improvement, weak, w=0.28). A 2026 arXiv survey frames RSI as a continuum of increasing AI autonomy in the AI-improvement loop, from humans writing all code upward (https://arxiv.org/html/2607.07663v1, weak, w=0.29). Lilian Weng's harness-engineering post traces the phrase to Yudkowsky (2008), where it names a feedback loop in which an AI improves the cognitive machinery that produces it (https://lilianweng.github.io/posts/2026-07-04-harness/, weak, w=0.17). DataScienceDojo's 2026 guide distinguishes loops where one AI system improves something else (a codebase, a training run) from loops where it improves itself (https://datasciencedojo.com/blog/recursive-self-improvement-agentic-ai/, weak, w=0.10).

These sources are all weak-weighted (below 0.5) by the corpus decision model, so they back the framing but not any specific design decision. The design decisions in this skill come from the source doc and its two y33 refs papers, not from the web literature: no external source describes a Fibonacci-sphere-indexed RSI loop. That absence is itself informative: the skill's contribution is the parameterization, not the RSI loop, which it inherits wholesale from its parent skill (source doc).

## Routing summary

| Situation | Skill |
|---|---|
| Azimuthally ordered corpus, recursive loop | rsi-phi-skill |
| Flat 1-D corpus, recursive loop | recursive-self-improvement |
| Single file, single edit | single-action-curve-rsi |
| One-shot 12-axis sweep, no loop | negative-skill-space |

The boundary rule from the source doc applies to every use: anything beyond the frontmatter description's scope is a different skill's job.
