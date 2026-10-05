# Untrusted prompt intake: propose, validate, gate

Scope: `POST /api/jev/tasks` accepts a natural-language prompt (up to 8000 chars) as `payload.prompt`; one 70B call proposes actions over the policy tool list; every proposal passes the same validation and the same deterministic gate as caller-supplied actions; the prompt is stored verbatim, delimited in the model prompt, and never interpolated into URLs; decisions are stamped `decided_via: llama_prompt`.

## The trust question

Prompt intake is the highest-risk surface of an automation engine: free-form text enters, and the output of the model that reads it is executable intent. The design treats the prompt as untrusted input at every layer. OWASP's prompt injection cheat sheet is explicit that separating trusted instructions from untrusted data helps, but that text labels or prompt wording must not be treated as an enforcement boundary; enforcement belongs at the tool boundary (https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html, weight 0.95). The intake flow implements exactly that split: delimiting is a containment aid, the gate is the enforcement.

## The flow

1. The prompt arrives at `POST /api/jev/tasks` with `payload.prompt`, capped at 8000 characters. The cap bounds both cost and attack surface: no prompt can balloon into an unbounded context.
2. One Llama 3.3 70B call proposes actions over the policy tool list. The model is constrained to the tools the policy already allows; it cannot introduce new capabilities, only compose existing ones.
3. Every proposal passes the same validation as caller-supplied actions: schema checks, tool-name checks, predicate checks.
4. Every proposal then passes the same deterministic gate. There is no LLM-fast-lane; the model cannot authorize its own output.
5. The task is stamped `decided_via: llama_prompt` so prompt-originated decisions are distinguishable in the audit trail.

## Verbatim storage and delimiting

The prompt is stored verbatim (what the operator typed is what the record keeps) and is delimited inside the model prompt, so the model can tell operator text apart from engine instructions. Delimiting is a usability control, not a security control; OWASP warns that delimiter-based separation alone does not establish injection resistance, which is why the load-bearing defenses are the validation and the gate, not the delimiters (https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html, weight 0.95). The never-interpolate-into-URLs rule closes a second injection path: prompt text never becomes part of a fetched URL, so a prompt cannot steer a tool stage to an attacker-chosen endpoint. Research on computer-use style attacks demonstrates why URL and action steering matter: a page's content can trick an agent into taking harmful actions (https://www.sciencedirect.com/org/science/article/pii/S1546221826001384, weight 0.86).

## What the gate catches in practice

The live verification run showed the flow working as designed: the prompt "Fetch the latest release of yubi-OS/yubiOS" produced a 70B proposal of an `http.fetch` GET on the exact repo URL, the gate allowed it, the action dispatched, and the verdict came back as an honest `unknown` because the model proposed a non-standard `expected` predicate; undecidable predicates verify as `unknown`, never as success. Neuron usage for the run: 372. The open item is predicate quality: the model sometimes proposes non-standard predicates, and the cheap fixes are a stricter prompt contract or an expected-schema lint.

## Why same-gate matters

The security property the flow buys is symmetry: an operator typing JSON by hand and a model proposing actions have exactly one difference, `decided_via`. Everything downstream is identical code. That means every hardening applied to the gate (allowlists, predicate checks, credential scoping) applies to prompt intake automatically, and a new attack via prompts cannot bypass controls that the API path already enforces.
