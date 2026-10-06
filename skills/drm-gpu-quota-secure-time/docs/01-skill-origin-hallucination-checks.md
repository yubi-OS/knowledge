# 01. Why this skill exists: the hallucination-check discipline

Scope: why the drm-gpu-quota-secure-time skill exists, the failure mode that produced it, and the verify-against-source rule it enforces on every GPU lockout and secure-time implementation task.

Primary source: yubi-OS/yubiOS skills/drm-gpu-quota-secure-time/SKILL.md (the "source doc").

## The failure the skill corrects

The source doc states its origin plainly: the source material for this area came from two ChatGPT research threads, and that material mixed real kernel and OP-TEE APIs with plausible-sounding but non-existent ones (source doc, "Why this skill exists"). The skill is the corrected, source-checked version of that research.

The concrete casualties were API names that sound right but do not exist in any shipped kernel. The source doc names two of them explicitly: `drmcg_try_charge()` and `drmcg_uncharge()`. It also flags invented cgroup v2 internal calls: `task_cgroup(current, 0)` and a bare `get_cgroup(cg)` (source doc, section 3). None of these are the current cgroup v2 kernel API surface. A v0 implementation written against them would fail to compile, and worse, a partially plausible name might lull a reviewer into accepting a design that cannot work.

## The operating rule

The skill encodes one hard rule: do not copy function names straight out of an LLM chat transcript for this subsystem. Verify against `elixir.bootlin.com` or the actual repository first (source doc, "Why this skill exists"). The source doc repeats the rule in section 3 with a sharper form: confirm the exact symbol names for the target kernel major version before committing to a design, and check `include/linux/cgroup.h` in the tree you are actually building against. The rule applies to this skill's own text too: it says not to trust either the skill or an LLM chat log as the final source.

## What Elixir actually is

The verification surface the skill points at is the Bootlin Elixir Cross Referencer. Elixir is a source code cross-referencer inspired by LXR, written in Python, whose main purpose is to index every release of a C or C++ project such as the Linux kernel while keeping a minimal footprint; it uses Git as its source-code file store and Berkeley DB for cross-reference data (jev 0.28, weak backing, https://github.com/bootlin/elixir). Bootlin has operated a Linux source cross-referencing service since 2006 (jev 0.28, weak backing, https://bootlin.com/blog/elixir/). The live service browses the latest Linux kernel source tree in the browser at https://elixir.bootlin.com/linux/latest/source (jev 0.63, https://elixir.bootlin.com/linux/latest/source).

The per-version URL pattern matters for this skill: the source doc's own instruction is to resolve a symbol against a specific kernel version (`elixir.bootlin.com/linux/v<X>/A/ident/<symbol>`), not against "latest", because cgroup internals move between versions (source doc, section 3).

## Why hallucination is the expected failure here

AI hallucination, in the general sense, is when a large language model perceives patterns or objects that are nonexistent and produces nonsensical or inaccurate outputs (jev 0.41, weak backing, https://www.ibm.com/think/topics/ai-hallucinations). Large language models are trained on large text corpora and are the basis for many modern chatbots including ChatGPT, Claude, Gemini, Grok, and DeepSeek (jev 0.29, weak backing, https://en.wikipedia.org/wiki/Large_language_model). Kernel-adjacent research is a high-risk zone for this failure mode because the plausible-name space is dense: real kernel symbols follow predictable naming conventions (`<subsystem>_<verb>_<noun>`), so a fabricated name like `drmcg_try_charge()` sits one edit away from real names in the same family. The defense is not better prompting; it is checking every symbol against the indexed source tree before it enters a design.

## Primitive-coverage note

The source doc carries several corpus-audit sections (least privilege coverage from curve-guided-rsi cycle 4, immutability coverage from cycle 5, and the cycle 5 through 7 primitive-closure and audit-trail entries). These are internal-record subtopics: they describe how the yubiOS corpus audit placed this skill on the 10-primitive coverage map, and they cite in-repo artifacts such as `refs/cycle5-results-2026-08-06.md`. No web dig was run for them; they are attributed to the source doc alone.
