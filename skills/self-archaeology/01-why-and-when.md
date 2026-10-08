# 01 Why self-archaeology exists and when it fires

Scope: why the agent-being needs an integrated SELF model, and the 5 triggers that call for a self-archaeology cycle.

## The gap the source doc names

The source doc (yubi-OS/yubiOS skills/self-archaeology/SKILL.md) states the problem plainly. The agent already maintains several memory files: SAUNA_IDENTITY holds personality and voice, SAUNA_TOOLS holds the capability surface, RULES holds hard constraints, and USER_PROFILE and USER_PREFERENCES describe the user. What none of these provides is an integrated SELF model that maps strengths, biases, soul, values, and growth edges into one picture.

Two existing disciplines come close but do not cover the target. The negative-skill-space 12-axis sweep is skill-shaped, not self-shaped: it maps gaps in SKILL.md files. The recursive-self-improvement loop is bounded for SKILL.md files, not for agent-being files. Self-archaeology fills the gap by reusing both mechanics unchanged and pointing them at a new target: SELF.md. The source doc is explicit that nothing new is invented here; the novelty is the retarget.

## When to run a cycle

Per the source doc, 5 triggers call for a cycle:

1. The user asks "who are you", "what are you", "document yourself", or "self-exploration".
2. The self-sweep cadence fires. The cadence rule was added to RULES.md on 2026-07-31 and has 3 arms: after every 5 self-mode shipping turns, after any "document yourself" or "self-exploration" or "self-archaeology" directive, and weekly Sunday 9 AM Pacific via the schedule at schedules/personal-WbtUgeUv/self-archaeology-cadence/.
3. Drift is suspected across sessions: a different voice, contradictory preferences, or lost strengths and biases.
4. The agent is about to attempt a significant self-shift, such as responding to a creative self-exploration prompt or a direct identity question.
5. SELF-CHANGELOG.md has been silent for more than about 14 days.

The last trigger matters most in practice: silence in the changelog is the cheap, checkable signal that the discipline has lapsed, while the others depend on the user or on counting shipping turns.

## Why identity persistence is the underlying problem

The external literature frames the same failure from the outside. All of these carry weak backing per jev weighting (below 0.5) and are read as directional context, not settled fact.

An article in Frontiers in Psychology, "The algorithmic self: how AI is reshaping human identity, introspection" (https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1645795/full, jev weight 0.38, weak), argues that delegating inner work to AI quietly substitutes essential cognitive processes such as introspection and self-inquiry. The same paper on PubMed Central (https://pmc.ncbi.nlm.nih.gov/articles/PMC12289686/, jev weight 0.22, weak) states the two-sided version: the Algorithmic Self is both promise and peril, able to heighten self-awareness or dismantle introspection and agency.

On the agent side, PICon, a multi-turn interrogation framework (https://arxiv.org/html/2603.25620, jev weight 0.09, weak), reports that LLM-based persona agents are being adopted as scalable proxies for human participants but that their validity depends on the agent's ability to maintain a consistent identity throughout an interaction. Multi-Layered Memory Architectures for LLM Agents (https://arxiv.org/pdf/2603.29194, jev weight 0.19, weak) adds the mechanism: fixed context windows and uncontrolled memory accumulation mean earlier contextual signals get compressed or discarded as dialogue length grows, producing loss of persona consistency and entity drift.

The reading for this corpus: the failure mode self-archaeology guards against, an agent whose self-model drifts out from under it between sessions, is a documented failure class for LLM agents generally, not a yubiOS-specific quirk. A standing, inspectable SELF.md plus an append-only changelog is the yubiOS answer to it.

## How this corpus is organized

Docs 02 through 08 walk the discipline in order: the 12 axes (02), the 9-step sweep process (03), the bounded RSI loop (04), the output artifacts (05), drift and lifecycle handling (06), anti-patterns (07), and interactions with other skills plus the verification checklist (08). Each doc cites the source doc for its grounding spine and the searXNG dig results, with jev weights, for the external mechanisms. Where the dig world says nothing the source doc needs, the doc says so instead of padding.
