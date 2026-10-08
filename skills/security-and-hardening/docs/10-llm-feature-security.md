# 10: Securing AI and LLM Features

Scope: the new attack surface an app inherits when it calls an LLM (chatbots, summarizers, agents, RAG), mapped to the OWASP Top 10 for LLM Applications and grounded in the source doc's 6 rules and code patterns. Ground source: `yubi-OS/yubiOS skills/security-and-hardening/SKILL.md` (source doc).

## The reference framework

The source doc maps LLM feature security to the OWASP Top 10 for LLM Applications (2025), published at the OWASP GenAI Security Project (https://genai.owasp.org/llm-top-10/, weight 0.79, the 2025 Top 10 risk and mitigation set for LLMs and generative AI apps; resource page at https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025/, weight 0.81). OWASP's project index confirms the LLM Top 10 as a standing component of its work (weight 0.87, https://owasp.org/projects/top-10-for-large-language-model-applications), and the OWASP Foundation page anchors the org (weight 0.91, https://owasp.org/).

## The 6 rules

1. **Treat all model output as untrusted input (LLM05: Improper Output Handling).** Never pass LLM output straight into `eval`, SQL, a shell, `innerHTML`, or a file path. Validate and encode it exactly as raw user input. The rationalization the source doc debunks: "it's just LLM output, it's only text" fails because that text can be a SQL statement, a script tag, or a shell command.
2. **Assume prompts can be hijacked (LLM01: Prompt Injection).** Untrusted text in the context window, a user message, a fetched web page, a PDF, can carry instructions. The system prompt is not a security boundary; enforce permissions in code, not in the prompt.
3. **Keep secrets and other users' data out of prompts (LLM02 / LLM07).** Anything in the context can be echoed back. Do not put API keys, cross-tenant data, or the full system prompt where the model can repeat it.
4. **Constrain tool and agent permissions (LLM06: Excessive Agency).** Scope tools to the minimum, require confirmation for destructive or irreversible actions, and validate every tool argument. A weakly sourced industry writeup (0.32, https://mindgard.ai/blog/generative-ai-security) reports excessive agency as a rising risk category because agents increasingly hold credentials and tools, citing a Cloud Security Alliance finding that 53% of surveyed organizations had seen an AI security incident; directional only.
5. **Bound consumption (LLM10: Unbounded Consumption).** Cap tokens, request rate, and loop or recursion depth so a crafted input cannot run up cost or hang the system.
6. **Isolate retrieval data (LLM08: Vector and Embedding Weaknesses).** In RAG, treat the vector store as a trust boundary: partition embeddings per tenant so one user cannot retrieve another's data, and validate documents before indexing so poisoned content cannot steer answers. Weakly backed writeups on RAG and memory poisoning (0.19 to 0.25: hermes-codex, promptguardrails.com, copilot-autogent) describe the same threat model; corroboration only.

## The code pattern: parse, validate, allowlist, encode

The source doc's bad pattern runs model output as a command or markup: generating SQL from a user question and executing it directly (arbitrary query execution), or assigning a model reply into `container.innerHTML` (stored XSS via the model). The good pattern treats model output as data:

```typescript
let intent;
try {
  intent = CommandSchema.parse(JSON.parse(await llm.replyJson(userMessage)));
} catch {
  throw new ValidationError('unexpected model output');
}
await runAllowlistedAction(intent.action, intent.params);
container.textContent = await llm.reply(userMessage);
```

Three properties make this safe: the output must parse as JSON and satisfy a schema or the request fails; the parsed action runs through an allowlisted dispatcher (`runAllowlistedAction`), not arbitrary dispatch; and rendering uses `textContent` (encoded), not `innerHTML`.

## Where this sits in the skill's tiers

LLM feature security is wired through the whole skill: the trust-boundary list in doc 01 includes LLM output as a boundary; the never-do tier's `eval`/`innerHTML` rule applies to model output; the red flags list carries 3 LLM-specific signals (model output passed into a query, the DOM, a shell, or `eval`; secrets, PII, or the full system prompt inside a context window); and the verification checklist adds an AI/LLM section (output treated as untrusted, secrets out of prompts, tool permissions scoped, destructive actions requiring confirmation).

## Provenance

Source doc claims: the 6 rules and their LLM Top 10 mappings, the bad and good code patterns, the tier and checklist wiring, and the rationalization rebuttals. Dig-backed claims: the OWASP LLM Top 10 2025 publication and framing (0.79, 0.81, 0.87, 0.91). Weakly backed corroboration (labeled): the excessive-agency trend and CSA 53% statistic (0.32, mindgard.ai), RAG and memory-poisoning threat models (0.19 to 0.25), and LLM security glossaries (0.17 to 0.27).
