# 02 - When to use: triggers, non-triggers, and the boundary with interview-me

Scope: the four application points, the four explicit-trigger conditions, the four do-not-use conditions, and where this discipline hands off to interview-me.

## Application points

The source doc ("When to Use") instructs applying the discipline at every decision point during a task, and names 4 specific checkpoints:

1. Before asking the user any clarification question.
2. Before claiming "I need to confirm with you".
3. Before pausing a multi-step task to surface a choice.
4. Before invoking interview-me or any sub-skill that prompts the user.

The fourth point matters most in practice: the discipline gates its own inverse. Any skill that ends in a prompt to the user should be reachable only after the ask-vs-infer checklist has run (source doc).

## Explicit triggers

Apply the discipline explicitly when any of 4 conditions holds (source doc):

- The user has signaled low tolerance for over-questioning ("don't ask me", "just decide", "use your judgment", "infer it").
- The agent is in a non-interactive context (scheduled run, autonomous loop, CI).
- The agent's job is to ship, not to deliberate.
- A sub-decision needs to be made and the cost of asking exceeds the cost of being slightly wrong.

The non-interactive trigger is the strongest: in a scheduled run there may be no user to ask at all, so inference with a flagged default is the only available move. This matches the broader agent-design literature on calibrating autonomy levels: autonomy is a double-edged sword, and agent developers must calibrate the level at which agents act without oversight (https://arxiv.org/abs/2506.12469, weight 0.45, weak backing, sub-0.5; same paper hosted by the Knight First Amendment Institute at https://knightcolumbia.org/content/levels-of-autonomy-for-ai-agents-1, weight 0.37, weak backing, sub-0.5). Those sources are weak by the weighting model but independent of the source doc; they establish that per-decision autonomy calibration is an open design problem, which is exactly the gap this skill fills at the skill layer.

## Do-not-use conditions

The source doc names 4 conditions where the skill must NOT be applied:

1. The user has explicitly asked to be consulted ("check with me before...", "ask me when..."). An explicit consultation request overrides the default; the user has already paid for the ask.
2. The decision is irreversible AND the cost of being wrong is severe (production deploy, data migration, public API change, financial commitment). Here the ask is mandatory even with prior evidence.
3. The decision is politically charged and the agent cannot honestly defend a default. The source doc routes this to negative-skill-space: surface the gaps instead of asking.
4. The intent is genuinely unclear with no defensible inference path. Route to interview-me; that is its purpose.

## The boundary with interview-me

The source doc ("Philosophy") defines the relationship precisely. Interview-me says: ask until 95% confidence about intent. Human-for-feasibility says: infer until no defensible default remains. They are complementary modes, not contradictions, and the choice between them depends on the ask:

- Intent unclear AND cost of building wrong high -> interview-me (ask).
- Intent inferable AND cost of asking high -> human-for-feasibility (infer).
- Both true for different sub-decisions -> both apply; this skill decides which sub-decisions are inferable.

The last line is the operational insight: a task is rarely uniform. A migration script can have 30 inferable sub-decisions (naming, formatting, defaults) and 2 non-inferable ones (which tables to touch, when to run). The skill's job at the decision-point level is classification, not replacement.

## Anti-pattern: defaulting to interview-me

The source doc lists "Defaulting to interview-me" as an anti-pattern: interview-me is a specific tool for a specific situation (genuinely unclear intent with high build cost), and most decisions do not need it. The red-flag version is sharper: "Using interview-me when this skill's discipline is satisfied (most of the time)" (source doc, Anti-patterns and Red Flags).

## Takeaway

Apply the checklist at every decision point, gate every prompting skill behind it, treat non-interactive contexts as automatic triggers, and respect the 4 do-not-use conditions. The discipline is the router: it decides, sub-decision by sub-decision, whether the human gets asked at all.
