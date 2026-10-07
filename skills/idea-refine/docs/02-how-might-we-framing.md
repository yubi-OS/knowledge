# 02 How Might We Framing and Sharpening Questions

Scope: Restating a raw idea as a How Might We problem statement, the 3 to 5 sharpening questions that open Phase 1, and why the skill refuses to proceed until who and success are pinned down.

Grounding spine: yubi-OS/yubiOS skills/idea-refine/SKILL.md (source doc).

## The restatement step

Phase 1 of the skill begins by restating the user's raw idea "as a crisp 'How Might We' problem statement." The source doc gives the reason: "This forces clarity on what's actually being solved." The restatement is not ceremony. It converts a vague pitch into a testable frame before any variation is generated, so every later lens expands from the same center.

The How Might We form is the stanard ideation opener in design practice. The Stanford d.school ships a dedicated How Might We tool whose stated goal is "to create questions that provoke meaningful and relevant ideas" by keeping them "insightful and nuanced" (https://dschool.stanford.edu/tools/how-might-we-questions, jev weight 0.90). Its companion ideation tool teaches that reframing questions is itself a generative act: amp up the good, explore the opposite, take it to an extreme (https://dschool.stanford.edu/innovate/tools/come-up-with-ideas, jev weight 0.81). The skill's restatement step operationalizes exactly that: one well-shaped question precedes any brainstorm.

## The five sharpening questions

After restating, the skill asks 3 to 5 sharpening questions, "no more", focused on:

- **Who is this for, specifically?**
- **What does success look like?**
- **What are the real constraints (time, tech, resources)?**
- **What's been tried before?**
- **Why now?**

Two of the five are gating. The source doc says: "Do NOT proceed until you understand who this is for and what success looks like." Who and success are the load-bearing pair; the other three (constraints, prior attempts, timing) sharpen the frame but do not block progress.

The questions are gathered through the AskUserQuestion tool, making the skill an interactive dialogue rather than a batch transformation. This is a design choice, not an implementation detail: the answers reshape which lenses get applied in the next step.

## Why framing comes before ideation

The dig material gives the failure mode the skill is guarding against. Problem framing is "the process of defining, exploring and interpreting a challenge before generating solutions," and "innovation often fails for a surprisingly simple reason: People solve the wrong problem" (https://www.stephanhitchins.com/knowledge-hub/complete-guide-to-problem-framing, jev weight 0.51). A solution generated against the wrong frame is polished waste.

The same source family warns that assumptions are the weak point of any frame: "Assumptions are often the Achilles' heel of problem framing. It is vital to continuously question and validate these assumptions, ensuring that the framing is anchored in verifiable insights and evidence" (https://voltagecontrol.com/articles/problem-framing-in-design-thinking-best-practices/, jev weight 0.52). This connects forward to Phase 2: the assumptions surfaced there are assumptions about the frame established here.

A practical guide to question-first ideation makes the same point in process terms: the prep stage exists to "clarify our goals, gather relevant information, and identify potential roadblocks" before idea generation starts (https://theideasguy.io/blog/forming-framing-ideas-by-asking-better-questions, jev weight 0.36, weak backing).

## The skill's own verification

The skill's post-session checklist requires that "a clear 'How Might We' problem statement exists" and that "the target user and success criteria are defined." A session that skipped the restatement or never pinned who and success fails verification even if it produced an artifact. The red flag list is explicit: "Skipping the 'who is this for' question" is a named failure, with the rationale that "every good idea starts with a person and their problem."
