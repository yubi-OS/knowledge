# 01 - Single-Agent Autonomous Ideation Loops

Scope: single-agent long-running ideation loops that iterate ideate-research-scrutinize-decide without human legwork, exemplified by Ralph Ideate and the Ralph loop ecosystem.

## The canonical shape: the Ralph loop

The clearest single-agent ideation loop in the wild is Ralph Ideate. Its own packaging describes "ralph-ideate" as an autonomous AI agent loop that "ideates, extends, researches, scrutinizes, and repeats", applying the loop pattern to business ideas, investment opportunities, and prediction markets (source: https://pypi.org/project/ralph-ideate/, weight 0.80). It is distributed both as a Python package on PyPI and as a GitHub repository under the same description (source: https://github.com/fabianboth/ralph-ideate, weight 0.77). The loop is built on the "Ralph loop" pattern from Claude Code: the agent reads its own past work to inform the next iteration, forming a feedback loop for autonomous problem-solving (source: https://claude.com/marketplace/plugins/ralph-loop, weight 0.73).

The generic Ralph loop has grown into its own mini-ecosystem. One implementation packages Geoffrey Huntley's technique for Claude Code as an autonomous development loop with intelligent exit detection and rate limiting (source: https://github.com/frankbria/ralph-claude-code, weight 0.57). Practitioner guides describe running Claude Code in an autonomous loop with fresh context each iteration, a prompt file, completion criteria, and safety guardrails (source: https://ralphloop.sh/blog/run-claude-code-in-a-loop/, weight 0.49, weak backing). A secondary commentary claims Claude Code later absorbed the pattern natively via a /goal command that "turned the Ralph loop from a hand-rolled bash script into a native feature" (source: https://ranjankumar.in/ralph-loop-claude-code-goal-autonomous-coding, weight 0.17, weak backing; treat with caution).

## What the loop automates, and what it does not

Three mechanics recur across these systems:

1. Iteration with memory of prior output. The Claude marketplace description of the Ralph loop is explicit that the agent reads its own past work to improve (source: https://claude.com/marketplace/plugins/ralph-loop, weight 0.73).
2. Bounded cycles. The loop tooling exposes iteration counts and completion criteria as first-class controls (source: https://ralphloop.sh/blog/run-claude-code-in-a-loop/, weight 0.49, weak backing; the Ralph Ideate project's loop verbs ideate-extend-research-scrutinize are documented at https://pypi.org/project/ralph-ideate/, weight 0.80).
3. Human steering at the edges. The loop does the legwork, but the operator supplies the initial prompt and decides when to stop, per the completion-criteria design described in the practitioner guide (source: https://ralphloop.sh/blog/run-claude-code-in-a-loop/, weight 0.49, weak backing).

## Local-first single-agent loops

A parallel thread runs entirely on local hardware. The Ollama runtime is the substrate: its repository describes running open models including Kimi, GLM, MiniMax, DeepSeek, gpt-oss, Qwen, and Gemma locally (source: https://github.com/ollama/ollama, weight 0.82). On top of it, community agents position themselves as general-purpose autonomous assistants that run "entirely on your hardware" (source: https://github.com/arrase/ollama-agent, weight 0.50, marginal). Experiment collections document agentic workflows built with open models via Ollama, aimed at privacy-preserving autonomous work (source: https://github.com/amirgholipour/AgenticAI-with-Ollama, weight 0.33, weak backing). Tutorials walking through building a local tool-calling agent exist as well, but are secondhand guides rather than primary sources (source: https://localaimaster.com/blog/build-local-ai-agent, weight 0.16, weak backing).

## Implications

For an autonomous ideation skill, the single-agent loop lineage establishes the baseline pattern: generate, extend, research, scrutinize, repeat, with bounded iterations and foldered state. What none of these loops publish is a structured verdict taxonomy; they output idea files, not kill decisions. They also do not treat "what the idea fails to cover" as a first-class object. Both gaps are visible in the source landscape rather than argued from theory: the loop descriptions on PyPI and the Claude marketplace enumerate verbs (ideate, extend, research, scrutinize, repeat) with no gap-mapping or verdict step (sources: https://pypi.org/project/ralph-ideate/, weight 0.80; https://claude.com/marketplace/plugins/ralph-loop, weight 0.73).
