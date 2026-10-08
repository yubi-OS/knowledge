# 04 Bounded search and fetch budget

Scope: the bounded execution protocol, 3 to 5 searches, 2 to 3 fetches, one pass, no recursion, plus domain diversity and result logging, and the token-budget reasoning behind the caps.

Source doc: `yubi-OS/yubiOS skills/prior-art-search/SKILL.md`.

## The protocol

The source doc's Loading Constraints section fixes four constraints:

1. **Bounded.** 3 to 5 searches. 2 to 3 fetches. One pass. No recursion.
2. **Read-only.** The skill produces a document; it does not modify external systems.
3. **Cite every claim.** Every assertion in the report has a URL behind it.
4. **Honest about gaps.** An empty query angle is reported as "no prior art found for this angle", never filled with fabricated results.

The process steps operationalize the budget. Step 3 runs the queries with the `@tool/websearch` tool and logs, for each query, the query text, the top 3 to 5 result titles, and the URLs. It also requires domain diversity: prefer results from diverse domains, explicitly to avoid returning only one company's blog. Step 4 fetches 2 to 3 of the top hits in depth with `@tool/webfetch`, choosing the hits that look most relevant (a competitor's product page, a "why we shut down" postmortem, an academic survey, a Wikipedia-style overview) and extracting what it does, why it exists, why it succeeded or failed, and key dates.

## Why the caps exist

The anti-patterns section names the failure the caps prevent: "Recursion without bound. Running 10+ searches or 10+ fetches burns tokens without improving the report. 3 to 5 searches, 2 to 3 fetches is the budget." The red-flag list makes 10+ queries and 5+ fetches explicit over-budget signals. The cap converts the skill from an open-ended research loop into a bounded pass whose cost is predictable.

Agent-cost guidance converges on the same structure. MIT researchers characterize agentic AI as systems that plan, use tools, and adapt until a task is done (https://mitsloan.mit.edu/ideas-made-to-matter/agentic-ai-explained, jev noul 0.53), and that loop-without-stopping shape is exactly what a budget must terminate. Agent token-budgeting guides recommend setting predefined limits on tokens consumed per task or session (https://compresr.ai/blog/ai-agent-token-budgeting-cost-control-guide, jev noul 0.08, weak backing). One practitioner writeup treats an agent's context window as a budget and search as a sub-budget of it, proposing a rule that search consume on the order of 15% of the available context (https://ceaksan.com/en/token-budget-arithmetic-for-agent-search, jev noul 0.10, weak backing). The skill's fixed caps are a declarative version of the same arithmetic: instead of metering tokens, it meters the number of tool calls.

Production-agent engineering adds a second reason for one-pass discipline: unbounded loops multiply rate-limit and quota pressure, and rate-limit handling is a first-class concern in agent systems (https://niteagent.com/blog/2026-07-03-agent-rate-limit-quota-management-guide/, jev noul 0.14, weak backing).

## The agentic-search contrast

The dig also shows what the skill deliberately is not. Agentic search is described as a retrieval method where the agent plans queries, reads live results, and refines its search in a loop until the task is answered (https://www.tinyfish.ai/blog/agentic-search, jev noul 0.12, weak backing). Open-source tooling implements exactly that loop: an agentic web search CLI takes a natural-language question, generates search keywords autonomously, researches, and compiles a structured report (https://github.com/nlink-jp/agentic-web-search, jev noul 0.17, weak backing). Commercial research APIs market "wide and deep" research tasks on the web (http://yutori.com/research, jev noul 0.09, weak backing). prior-art-search takes the useful shape of those systems (query generation, structured report) but freezes the loop at one pass. The budget is what keeps the report reproducible and the cost legible.

## Logging and diversity as budget enforcement

Logging each query's text and top hits (step 3) is not just hygiene: it is the evidence the report's Sources section and the verification checklist draw on. The checklist requires "Searches run, results logged" and a selection-bias check that results span multiple domains. The single-domain failure mode has research backing: Microsoft Research documented "domain bias", a user's propensity to believe a page is more relevant because it comes from a particular domain (https://www.microsoft.com/en-us/research/publication/domain-bias-in-web-search/, jev noul 0.86). Requiring domain diversity in results is the skill's direct countermeasure against that bias entering the report.

## Sources

- Source doc: `yubi-OS/yubiOS skills/prior-art-search/SKILL.md`
- https://mitsloan.mit.edu/ideas-made-to-matter/agentic-ai-explained (weight 0.53)
- https://ceaksan.com/en/token-budget-arithmetic-for-agent-search (weight 0.10)
- https://compresr.ai/blog/ai-agent-token-budgeting-cost-control-guide (weight 0.08)
- https://niteagent.com/blog/2026-07-03-agent-rate-limit-quota-management-guide/ (weight 0.14)
- https://www.tinyfish.ai/blog/agentic-search (weight 0.12)
- https://github.com/nlink-jp/agentic-web-search (weight 0.17)
- http://yutori.com/research (weight 0.09)
- https://www.microsoft.com/en-us/research/publication/domain-bias-in-web-search/ (weight 0.86)
