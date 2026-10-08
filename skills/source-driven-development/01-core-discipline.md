# 01 Core Discipline: Verify, Do Not Recall

Scope: the foundational rule that every framework-specific code decision must be backed by official documentation, and why training data staleness makes that rule non-negotiable.

## The rule

The ground skill states it plainly: "Every framework-specific code decision must be backed by official documentation. Don't implement from memory - verify, cite, and let the user see your sources" (source doc: yubi-OS/yubiOS skills/source-driven-development/SKILL.md). Training data goes stale, APIs get deprecated, and best practices evolve. The user should be able to trust the code because every pattern traces back to an authoritative source they can check (source doc).

## Why memory fails: the evidence

The failure mode has a name in the research literature: API hallucination. A 2024 arXiv study on mitigating code LLM hallucinations found that models "can generate incorrect API-related code, known as API hallucinations, especially when under-trained on certain under-represented APIs", and that the problem "is exacerbated by the constant evolution" of APIs (https://arxiv.org/html/2407.09726v1, jev weight 0.51, primary backing). The study's proposed fix is directionally the same as this skill's rule: ground generation in API documentation.

A broader empirical study of LLM hallucinations in practical, repository-level code generation examined the phenomena, mechanisms, and mitigation across realistic development contexts and confirmed the problem is not limited to toy prompts (https://dl.acm.org/doi/10.1145/3728894, jev weight 0.58, primary backing).

Staleness is distinct from fabrication. Model staleness is when a model "produces answers based on outdated knowledge that no longer reflects reality" and confidently recalls things that used to be true (https://tacnode.io/post/llm-model-staleness-what-it-is-why-it-happens-and-why-it-breaks-ai-systems, jev weight 0.17, weak backing, label as such). This matters because stale code does not look wrong: it is fluent, plausible, and broken against the current version. Practitioner write-ups describe the same dynamic, noting that AI-generated code can use APIs that "were deprecated or fundamentally changed after its training cutoff" (https://dev.to/pockit_tools/why-ai-generated-code-breaks-in-production-a-deep-debugging-guide-5cfk, jev weight 0.09, weak backing).

One widely cited ICSE 2025 evaluation of 7 major LLMs across 28,000 code completion prompts found deprecated API usage, outdated method signatures, and patterns from superseded versions across all of them; the models were "accurate to their training data", and the training data was just old (https://sirgary82.github.io/ai-dev-toolkit/context-management/llm-version-context/, jev weight 0.12, weak backing, secondary summary of the study).

## What the discipline buys

Verification converts an unverifiable output into an auditable one. The skill's own framing is that honesty about what could not be verified "is more valuable than false confidence" (source doc). The corollary is that a fetched, cited source is the unit of trust: a pattern backed by the framework's current documentation page is checkable by the user in seconds, while a pattern from memory can only be checked by debugging.

The discipline also protects against a subtle trap: an invented package or endpoint. When a model cannot find a plausible existing name to fill a gap in its training data, some portion of the time it invents one (https://tianpan.co/blog/2026/04/17/deprecated-api-trap-ai-coding-agents, jev weight 0.11, weak backing). A citation habit surfaces that class of error immediately, because a nonexistent API has no documentation page to cite.

## The one-line test

Before writing framework-specific code from memory, the skill asks one question: can I name the documentation page this pattern comes from? If the answer is no, fetch it first. If the answer is "the docs do not cover this", that is itself valuable information, because the pattern may not be officially recommended (source doc).
