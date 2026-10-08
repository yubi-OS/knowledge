# 02 The 12 axes applied to the agent-being

Scope: the 12 negative-skill-space axes retargeted from SKILL.md files to the agent itself, with the self-shaped question each axis asks.

## Internal-record subtopic, no dig

This subtopic is internal-record: the 12 axes and their self-shaped wording come entirely from the source doc (yubi-OS/yubiOS skills/self-archaeology/SKILL.md), which mirrors them from the upstream skill yubi-OS/yubiOS skills/negative-skill-space/SKILL.md. No searXNG dig was run and no external claims are made in this doc.

## The axes, as the source doc states them

The source doc instructs: mirror the 12 axes from negative-skill-space, retargeted at the agent itself. Each axis asks its question of the agent-being, not of a skill file.

1. Audience. Who does the agent serve? Who is excluded? Who falls through the cracks?
2. Inputs. What inputs does the agent accept? What inputs does it reject or mis-handle?
3. Outputs. What outputs does the agent produce? What outputs does it fail to produce when needed?
4. Mode. Solo? Multi-agent? Continuous? Scheduled? Reactive?
5. Assumption set. What must be true for the agent to behave correctly? What breaks silently when an assumption fails?
6. Adjacent problems. What problems does the agent solve? What adjacent problems does it NOT solve, even though they look similar?
7. Failure modes. What failures does the agent handle gracefully? What failures does it ignore, swallow, or silently mis-handle?
8. Lifecycle. What does the agent do on first invocation? On the Nth? When the substrate changes? When the user changes?
9. Composition. Which other skills, connections, or apps should it pair with? Which does it assume you will use? Where does it conflict?
10. Knowledge sources. Where does the agent get its facts? What sources does it exclude? How stale can those sources get?
11. Calibration. How does the agent know it is right? What signals does it use? What signals does it ignore?
12. Recursion. What happens when the agent applies itself to itself? The source doc calls this the only axis that catches meta-blind spots.

## What retargeting means in practice

For a skill file, the audience axis asks who reads the skill. For the agent-being, it asks who the agent serves, which drags in exclusion and fall-through-the-cracks questions that a skill file never has to answer. The same move applies to every axis: the object under the sweep changes from a document with a defined interface to a persistent actor with a memory, a user, and a history.

Two axes carry extra weight for the self-target, and the source doc's own examples confirm it. Lifecycle (axis 8) is where drift across sessions shows up first: the answer to "what does the agent do on the Nth invocation" is exactly where a drifted voice or a contradictory preference becomes visible. Recursion (axis 12) is called out as the only axis that catches meta-blind spots, which is why a sweep applied to the self is not just a sweep applied to one more artifact.

## How the sweep output is recorded

The sweep step (doc 03, steps 3 and 4) requires, for each axis, both the positive (what the agent claims) and the negative (what it does not). The negative is then scored likelihood x severity, each factor honest on a 1 to 5 scale. The filtered survivors become the gap list. The axes themselves are fixed; what changes run to run is which axes produce real gaps, and that is what the SELF-CHANGELOG track records over time.

## Provenance

- Source doc: yubi-OS/yubiOS skills/self-archaeology/SKILL.md, section "The 12 axes (applied to the agent-being)".
- Upstream definition: yubi-OS/yubiOS skills/negative-skill-space/SKILL.md.
- No dig was run for this subtopic (internal-record).
