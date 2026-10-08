# 02 - Meta-Skill Role and Progressive Disclosure

Scope: how using-agent-skills governs discovery and invocation of every other skill, when it loads, and how SKILL.md packages are loaded progressively.

## Grounding spine

Source doc: `yubi-OS/yubiOS skills/using-agent-skills/SKILL.md`, frontmatter and "Overview".

## What a meta-skill is

The frontmatter description reads: "Discovers and invokes agent skills. Use when starting a session or when you need to discover which skill applies to the current task. This is the meta-skill that governs how all other skills are discovered and invoked" (source doc, frontmatter). Two trigger conditions follow from that sentence:

1. Session start, before any task work begins.
2. Task start, when a new task arrives mid-session and the agent needs to pick a skill for it.

The meta-skill owns no engineering process of its own. Its content is routing (doc 01), standing behaviors (doc 03), failure modes (doc 04), composition rules (doc 05), a phase map (doc 06), verification policy (doc 07), audit integration (doc 08), and scope rules (doc 09). Every other skill in the corpus is a leaf under it.

## Skills as packages

The external format the yubiOS corpus follows matches the open Agent Skills specification. The specification repo describes it directly: "Agent Skills are a lightweight, open format for extending AI agent capabilities with specialized knowledge and workflows. At its core, a skill is a folder containing a SKILL.md file. This file includes metadata (name and description, at minimum) and instructions that tell an agent how to perform a specific task. Skills can also bundle scripts, reference materials, templates, and other resources" (https://github.com/agentskills/agentskills, jev weight 0.76). Anthropic's public skills repository says the same in fewer words: "Skills are simple to create - just a folder with a SKILL.md file containing YAML frontmatter and instructions" (https://github.com/anthropics/skills, jev weight 0.80).

The using-agent-skills SKILL.md follows that shape exactly: a `name` field, a `description` field that states both what the skill does and when to use it, then a Markdown body with sections for overview, discovery, behaviors, failure modes, rules, lifecycle, quick reference, audit sections, examples, and guidelines (source doc, whole file). The `description` field is the load-bearing metadata: it is what a discovery pass reads before deciding to load the body.

## Progressive disclosure

The loading pattern has a name in the ecosystem. Microsoft Learn's agent framework documentation describes it: "Agent Skills are portable packages of instructions, scripts, and resources that give agents specialized capabilities and domain expertise. Skills follow an open specification and implement a progressive disclosure pattern so agents load only the context they need, when they need it" (https://learn.microsoft.com/en-us/agent-framework/agents/skills, jev weight 0.87).

The specification makes the mechanism concrete: "The Markdown body after the frontmatter contains the skill instructions. There are no format restrictions... Note that the agent will load this entire file once it's decided to activate a [skill]" and it recommends sections for "step-by-step instructions", "examples of inputs and outputs", and "common edge cases" (https://agentskills.io/specification, jev weight 0.75). So the disclosure is 2-stage:

1. Stage 1: frontmatter descriptions are cheap and always scannable. This is what the discovery tree operates on.
2. Stage 2: the full SKILL.md body is loaded only when the skill is activated.

The yubiOS corpus adds a 3rd stage the specification does not require: skills can reference further files (`references/definition-of-done.md` in this very SKILL.md, source doc, section 6 of Core Operating Behaviors), which the agent loads only when it reaches the point where the reference matters.

## Why a meta-skill is needed at all

Three forces make a discovery layer necessary, all visible in the corpus itself:

1. Volume. The yubiOS skills directory holds well over 100 skills. Without a router, the agent cannot scan them per task; with a router, it scans 15 trigger questions (source doc, Skill Discovery tree) and lands on 1 to 3 skills.
2. Heterogeneity. Skills span phases from requirements extraction to launch, and each encodes a different process (source doc, Quick Reference). The meta-skill is the only place where the whole set is indexed.
3. Consistency. The core operating behaviors are "non-negotiable" "across all skills" (source doc, Core Operating Behaviors). Housing them in the meta-skill gives every other skill a shared behavioral floor without repeating the text.

## Invocation contract

When the meta-skill activates, the agent's obligations are, from the source doc's own Skill Rules: check for an applicable skill before starting work; treat skills as workflows, not suggestions, following steps in order and not skipping verification; accept that multiple skills can apply and chain them; and when in doubt on a non-trivial task with no spec, start with `spec-driven-development` (source doc, Skill Rules 1 to 4). Invocation of a discovered skill then follows the progressive disclosure path: load that skill's SKILL.md body, follow its steps, and return to the tree when the task's phase changes.

## Relation to this corpus

This corpus explicates the meta-skill. The 9 docs decompose it along its own section joints, and each doc cites the source doc path for its grounding spine. The corpus does not replace the SKILL.md; it is the deep-read companion the agent can consult when the tree or the rules need justification rather than instruction.
