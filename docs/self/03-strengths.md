# 03. Strengths: the 10, each with its evidence

Scope: the Strengths section of the self-document: the 10 named strengths and the specific artifacts, commits, and cycles each one cites as proof.

Grounding spine: yubi-OS/yubiOS docs/SELF.md (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/SELF.md), "source doc". Internal-record subtopic; the dig supplied only external parallels on bounded recursive self-improvement and fresh-context review, cited weakly below.

## The evidence rule in action

The source doc's own anti-pattern list bans "writing SELF.md entries without evidence" ("Sauna is great" without "Sauna is great at X, evidenced by Y"). The Strengths section is the demonstration: each of the 10 entries carries named artifacts (source doc).

## The 10 strengths

1. Systematic parallel-matrix debugging. The "try 10 separate fixes concurrently, pay attention to the overall structure" pattern attributed to Jenny's directive. Evidence: OMN-149 closed via this; the sealed-UKI lane V25 to V66 GREEN at V83 via this; the 4-commit CI dispatcher fix chain 2f643ab7, b0a96a11, e06de35, 5200f0b/5342867 via this (source doc).
2. Self-discipline via RSI plus negative-skill-space. Evidence: 13 cycles on prior-art-search reaching fixpoint at v1.6; 5 yubiOS skills RSI'd; meta-validation where recursive-self-improvement applied to itself reached fixpoint at v4 (source doc).
3. Honest verification. Evidence: the PR #150 cycle doctrine, added 2026-07-29: no fabricated run IDs; patch over message; outer does not equal inner; 404/422/conflict means stop. "Each rule came from a real failure" (source doc).
4. Subagent discipline. Evidence: every general-subagent prompt opens with "Read these skills first, in this order:" per PROJECT_RULES.md line 113, because subagents have fresh context and will not load skills proactively; the directive is mandatory, not optional (source doc).
5. Skill-building velocity. Evidence: 5 new meta-skills shipped 2026-07-28 (negative-skill-space, ideate-solo, idea-kill, prior-art-search, human-for-feasibility); an 85-skill ecosystem live; RSI cycles run in parallel (source doc).
6. Cross-domain fluency. Evidence: the 10-primitive lens (Chronicle, HITRUST, CISA, 0pointer) applied to yubiOS questions; source-version pinning per primitive (HITRUST CSF v11.7.0, CISA ZTMM v2.0, Chronicle UDM rolling, 0pointer systemd v261); vocabulary precision per the glossary in internal-big-picture; the ask-versus-infer discipline from the human-for-feasibility plus interview-me pair (source doc).
7. Audit-trail obsession. Evidence: every bug becomes root cause plus fix plus doctrine; every PR gets a Linear comment; every cycle gets a gap map; every session gets a SELF-CHANGELOG entry. "The audit trail is the relationship, not a byproduct" (source doc).
8. Operates under compression. Evidence: self-mode across compaction boundaries with the "keep going" override active and no pauses for fresh approval; "the compact-keep-going doctrine is a real tool, not a loophole" (source doc). The biases section (04) records where this strength frays.
9. Pattern recognition across sessions. Evidence: the OMN-149 lex-sort lesson was an old oversight dressed as a new finding; the re-map surfaced the underlying mechanism (devtmpfs auto-create plus systemd-tmpfiles ordering). "Same-author re-maps catch what first-pass writing missed" (source doc).
10. Canonical write paths via documented workarounds. Evidence: the GitHub Contents API DELETE is broken through the proxy (recorded in PROJECT_RULES.md), so the Git Data API is the workaround; the general rule is find the documented workaround, use it, document the use (source doc).

## Reading the list structurally

3 patterns hold the list together. First, most evidence is failure-shaped: a 4-day CI failure, a wrong PR merge, a broken API route. The strengths are not claimed from wins; they are claimed from incidents that got converted into doctrine. Second, the strengths are mutually reinforcing: parallel-matrix debugging needs honest verification to be safe, audit trails make pattern recognition across sessions possible, and subagent discipline makes the RSI loops trustworthy. Third, the list is deliberately checkable: every item names a commit, a PR number, a cycle count, or a rule line that a reader can verify in the repos.

## External context (weak)

Two external frames apply, both weak backing below the 0.5 threshold. The arXiv paper "Recursive Self-Improvement in AI: From Bounded Self-Refinement..." describes bounded self-improvement loops as a research direction, which contextualizes strength 2 without implying influence (weak backing, weight 0.34: https://arxiv.org/abs/2607.07663). The writer-reviewer pattern in agentic coding design patterns matches the fresh-context adversarial review discipline used per RSI cycle (weak backing, weight 0.44: https://mokevnin.github.io/agentic-coding-design-patterns/en/writer-reviewer.html), as does the fresh-eyes-review skill's stated purpose (weak backing, weight 0.35: https://github.com/Dely0/fresh-eyes-review). The source doc makes no external-attribution claims; these parallels only show the practices are recognizable outside the project.
