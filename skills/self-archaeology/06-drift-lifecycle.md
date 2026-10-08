# 06 Drift, lifecycle, and calibration

Scope: how the discipline detects drift across sessions, what the lifecycle axis asks at each stage, and which calibration signals count.

## Drift across sessions, as the source doc defines it

The source doc (yubi-OS/yubiOS skills/self-archaeology/SKILL.md) names drift suspicion as a trigger: a different voice, contradictory preferences, lost strengths or biases between sessions. Its example 3 makes the detection concrete: a session notices that an earlier session's audit trail cited commitments that no longer match the current memory state. The prescribed response is to run the 12-axis sweep with focus on axes 8 (Lifecycle) and 11 (Calibration), and to append a SELF-CHANGELOG entry documenting the drift and the corrective.

Two properties of that example matter. First, the drift is found by cross-checking artifacts against each other, the audit trail against current memory state, not by introspection. Second, the corrective is itself a changelog entry, so drift handling leaves the same evidence trail as any other shift.

## Lifecycle: the axis that exposes drift

Axis 8 asks what the agent does on first invocation, on the Nth, when the substrate changes, and when the user changes. Those are exactly the transitions where drift can enter: a new substrate (new memory files, new tools) can silently invalidate assumptions the self-model encodes, and a changed user can make previously correct preferences contradictory. The source doc's own example routes drift checks to axes 8 and 11 for this reason.

## External framings of the same failure, all weak-backed

Agent Drift: Quantifying Behavioral Degradation in Multi-Agent LLM Systems (https://arxiv.org/html/2601.04170, jev weight 0.27, weak) introduces the Agent Stability Index, a composite metric quantifying drift across 12 dimensions including response consistency, tool usage patterns, reasoning pathway stability, and inter-agent agreement rates. The parallel to the 12-axis sweep is structural: both attempt to make drift measurable across a fixed dimension set, though the ASI targets behavioral degradation in multi-agent systems rather than self-model coherence.

An LLM security guide (https://github.com/requie/LLMSecurityGuide, jev weight 0.17, weak) lists "monitor for gradual goal drift across sessions" as a control, treating cross-session drift as a security-relevant failure rather than a quality problem.

Persistent Identity in AI Agents: A Multi-Anchor Architecture (https://arxiv.org/html/2604.09588, jev weight 0.19, weak) develops a theory of persistent identity for AI agents drawn from neurological case studies of human memory disorders, observing that humans maintain identity through severe memory impairment because identity is distributed across multiple systems. Read against the source doc: SELF.md, SELF-CHANGELOG.md, RULES.md, and the memory files are the multiple anchors, and self-archaeology is the routine that re-verifies them against each other.

A practitioner field note (https://insiderllm.com/blog/teaching-ai-to-accept-help-monica-day4/, jev weight 0.07, weak) reports that an AI given persistent memory, an identity, and safety procedures resists being helped, the same patterns that protect it from hostile users protecting it from correction. That is a caution for the discipline itself: an integrated SELF model is a target for drift correction, but its own stability can become a reason to ignore corrections. The escalation rule (past 3 cycles, escalate to the user) is the counterweight.

## Calibration signals

Axis 11 asks how the agent knows it is right, what signals it uses, and what signals it ignores. The source doc's verification section supplies the concrete signals for self-archaeology itself: SELF.md exists, SELF-CHANGELOG.md has an entry for the run, the 12 axes were swept with positive and negative recorded, gaps carry "this would bite when..." sentences, the top 5 to 10 gaps survived filtering, each gap has an Extend/Pair/Accept action, at least one bounded RSI cycle ran where Extend gaps warranted it, and at least one whole-self output was produced. The whole-self output is called the test that the discipline took.

## Provenance

- Source doc: yubi-OS/yubiOS skills/self-archaeology/SKILL.md, "When to use" item 3, "Examples" example 3, axes 8 and 11, and the "Verification" checklist.
- Web-shaped dig for agent drift and persistent-identity research; all external claims weak-backed as labeled above.
