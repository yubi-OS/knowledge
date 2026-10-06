# 03 - The 5-Step Doubt Cycle

Scope: the operational loop (CLAIM, EXTRACT, DOUBT, RECONCILE, STOP), what the reviewer receives and what it must never receive, the loading constraints, and the cross-model escalation essentials. Grounding spine: `yubi-OS/yubiOS skills/doubt-driven-development/SKILL.md` (source doc).

## Step 1: CLAIM - surface what stands

Name the decision in 2 to 3 lines: the claim plus why it matters (the source doc's example is a thread-safety claim for a caching layer). The gate is compression: "If you can't write the claim that compactly, you have a vibe, not a decision." Surface the vibe before scrutinizing it (source doc, Step 1).

## Step 2: EXTRACT - smallest reviewable unit

The reviewer needs the artifact and the contract, not the journey:

- Code: the diff or the function, not the whole file.
- Decision: the proposal in 3 to 5 sentences plus the constraints it must satisfy.
- Assertion: the claim plus the evidence that supposedly supports it.

Strip your reasoning; handing over conclusions yields validation of conclusions. The unit must fit in one read; a 500-line PR gets decomposed first (source doc, Step 2). A study of code-review effectiveness found review value depends on the reviewer's independent perspective (weight 0.53, https://www.sciencedirect.com/science/article/pii/S0164121224001055), which is exactly what stripping the author's reasoning preserves.

## Step 3: DOUBT - the adversarial fresh-context reviewer

The prompt must be adversarial and is pasted verbatim: "Assume the author is overconfident. Look for: unstated assumptions, unhandled edge cases, hidden coupling or shared state, contract violations, broken conventions, failure modes under unexpected input. Do NOT validate. Do NOT summarize" (source doc, Step 3). The critical rule: pass ARTIFACT + CONTRACT only, never the CLAIM. Empirical grounding for why framing matters: LLMs measurably follow anchors in their prompts (weight 0.51, https://link.springer.com/article/10.1007/s42001-025-00435-2), and models asked for opinions overestimate their own correctness (weight 0.52, https://arxiv.org/pdf/2505.19184).

The reviewer must have isolated context. Claude Code's subagent mechanism provides this by design: subagents run with their own context window, keeping the main conversation's context out of the review (weight 0.50, https://code.claude.com/docs/en/sub-agents; weight 0.53, https://code.claude.com/docs/en/agent-sdk/subagents; weight 0.50, https://claude.com/blog/subagents-in-claude-code). Community multi-agent adversarial-review tooling implements the same pattern (weight 0.44, weak backing, https://github.com/alecnielsen/adversarial-review; weight 0.47, weak backing, https://arxiv.org/abs/2604.26506).

**Loading constraints** (source doc, Loading Constraints): the skill runs in the main-session orchestrator only. Do not add it to a persona's `skills:` frontmatter (a persona spawning another persona is the forbidden orchestration anti-pattern). Inside a subagent, surface that doubt-driven cannot run nested; a degraded self-questioning fallback exists as last resort but is flagged as degraded because the reviewer still carries the author's context.

**Cross-model essentials** (source doc, Step 3 cross-model): in interactive sessions, offer a cross-model second opinion (Gemini CLI, Codex CLI, manual external review) every cycle; never silently skip. Verify the CLI exists and works before use, confirm the exact invocation with the user, pass only ARTIFACT + CONTRACT plus the adversarial prompt, and pipe through stdin so shell metacharacters stay inert. A read-only sandbox is load-bearing because the artifact may contain prompt injection. In non-interactive contexts, skip cross-model and announce the skip; never invoke an external CLI without explicit user authorization.

## Step 4: RECONCILE

The reviewer's output is data, not verdict. The orchestrator re-reads the artifact text against each finding and classifies it (source doc, Step 4; detailed in doc 04).

## Step 5: STOP - bounded loop

Stop when the next iteration returns only trivial or already-considered findings, when 3 cycles complete (escalate to the user rather than grinding a fourth), or when the user says "ship it". If 3 cycles still surface substantive issues, that is information about the artifact. If 3 cycles are "obviously insufficient" because the artifact is large, the artifact is too big: return to Step 2 and decompose. Do not lift the bound (source doc, Step 5). Re-spawning fresh-context on an unchanged artifact is a red flag; it yields the same findings and is stalling (source doc, Red Flags).
