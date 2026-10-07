# 08 - Anti-patterns, red flags, and verification

Scope: the 8 named anti-patterns, the red-flag checklist that detects them live, and the 7-point verification gate that closes the loop.

## The 8 anti-patterns

The source doc (yubi-OS/yubiOS skills/human-for-feasibility/SKILL.md, "Anti-patterns") names 8 failure modes:

1. Lazy asking. Asking a question whose answer is documented in working context, in a convention, or in a prior turn. Every such ask wastes the user's attention.
2. Lazy inference. Inferring a decision whose cost of being wrong is high AND no documented evidence exists. "This is overconfidence."
3. Batched questions. Asking 3 or more questions in a single message. "The user can't react to your hypotheses; you get skim answers."
4. Asking without a guess. "What do you want me to do?" is unanswerable without a hypothesis. Always attach your guess.
5. Asking and inferring the answer. If the user gives a vague response ("sure", "ok", "fine"), don't pretend it's confirmation. Re-ask with 2 concrete options.
6. Silent high-cost inferences. Inferring a decision that costs a lot to undo without flagging it in the audit. The audit exists to surface these.
7. Infinite inference. Inferring the same decision twice when the first inference was corrected. The audit catches this if you re-read it before re-deciding.
8. Defaulting to interview-me. Interview-me is a specific tool for a specific situation. Most decisions don't need it; this skill is the default.

The anti-patterns are not symmetric: 1, 3, 4, 5, and 8 are asking failures; 2, 6, and 7 are inference failures. The skill's thesis is that both directions fail, and the discipline (documented-anywhere ladder plus cost tiers) is what keeps the agent on the correct side of each decision.

## What the external literature says

Two findings sharpen the asking failures. An ACM paper on clarification timing found that AI-initiated clarification questions can improve output quality but that "little is known about how they reshape user experience across task applications", making timing and count the open variables (https://dl.acm.org/doi/10.1145/3803784.3816856, weight 0.60, high backing). That is the empirical neighborhood of the source doc's rule that questions be earned, single, and concrete: the quality gain from a clarification is real, but it is paid for in user experience, which is exactly the currency the skill budgets. On the inference side, the sycophancy literature documents the opposite failure of over-asking: assistants that tailor responses to what users want to hear rather than what is accurate (https://en.wikipedia.org/wiki/Sycophancy_(artificial_intelligence), weight 0.23, weak backing, sub-0.5; a technical whitepaper on the same tendency at https://jinaldesai.com/wp-content/uploads/2026/02/AI_Sycophancy_Whitepaper_JinalDesai.pdf, weight 0.25, weak backing, sub-0.5). A practitioner piece on assistant error loops notes chat assistants "are prone to error loops" and don't know they've made a mistake (https://www.livemint.com/opinion/columns/ai-assistant-problems-solutions-productivity-tips-error-loops-11770294229843.html, weight 0.19, weak backing, sub-0.5). Weak-backed, but together they frame the pair of failure directions this skill's anti-pattern list is built to prevent.

## Red flags: the live detector

The source doc's "Red Flags" section is a 10-item checklist for detecting the anti-patterns while they happen:

- Asking a question whose answer is in the user's most recent message.
- Asking a question whose answer is in a convention.
- Asking a question without attaching a guess.
- Asking 3 or more questions in a single message.
- Inferring a high-cost irreversible decision without flagging it in the audit.
- Inferring a value-laden decision (taste, politics, strategy) without asking.
- Producing an artifact without an Inference Audit at the end.
- Re-asking the same question after the user gave a vague answer (the inference is: they delegated; pick the best option and proceed).
- Inferring twice in the same task the same decision (you forgot the audit; re-read it).
- Using interview-me when this skill's discipline is satisfied (most of the time).

Note the 2 items that look like contradictions and are not: "inferring a high-cost irreversible decision without flagging" (a failure to flag, not to ask) and "re-asking after a vague answer" (a failure of the delegation inference). Both resolve through the Inference Audit, which is the shared state that makes the other checks cheap.

## Verification: the closing gate

The source doc's "Verification" section is a 7-item post-task gate:

1. Every clarification question was checked against Steps 1 to 5 of the discipline before being asked.
2. Every inferred decision with a non-trivial cost was flagged in the Inference Audit.
3. Every ask was single-question, with a guess attached, and concrete options framed as a choice.
4. No silent inferences on irreversible, high-cost, or value-laden decisions.
5. Inference Audit included at the end of the artifact (or referenced in chat).
6. No double-asking: the same decision wasn't asked twice in the same task.
7. No lazy inference: high-cost decisions with no documented evidence were surfaced, not silently inferred.

Items 1 and 3 check the asking path; items 2, 4, and 7 check the inference path; items 5 and 6 check the audit's presence and its use as memory. Together they make the skill self-auditing: a task run under this discipline can be graded from its own transcript using the checklist alone.

## Takeaway

The failure modes run in both directions, the red flags catch them mid-flight, and the verification gate closes the task. The audit is the common dependency: it is where silent inferences surface, where double-asks are caught, and where the user's corrections get recorded so the same decision is not re-derived.
