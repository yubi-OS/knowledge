# 05 - Offload Bulk Transforms to Scripts

Scope: push filtering, reformatting, and computation over large datasets into scripts that return the distilled result, and summarize large blobs instead of pasting them.

## The practice

The source doc (yubi-OS/yubiOS `skills/token-efficiency/SKILL.md`) dedicates two core practices to this:

- Practice 5: filtering, reformatting, or computing over a large dataset belongs in a script (bash or run_script) that returns the filtered or summarized result, not a raw dump streamed through the model to be manually filtered in the response.
- Practice 6: when reporting on a large fetched blob (logs, API responses, file contents), extract the fields that matter and summarize; paste verbatim only the specific lines that need to be quoted exactly.

The verification checklist bounds the threshold: bulk transforms such as filter, sort, or aggregate over roughly 100 rows went through run_script or bash, not streamed through the model (source doc, Verification). The anti-pattern counterpart is printing a full raw JSON API response when only two or three fields are relevant (source doc, Anti-patterns).

## The mechanism: sandboxed code execution

The dig's strongest result grounds the "where the transform runs" half. OpenAI's Code Interpreter documentation (https://developers.openai.com/api/docs/guides/tools-code-interpreter, jev weight 0.53) describes a tool that lets models write and run Python code in a sandboxed environment to solve problems in data analysis, coding, and math, with recommended uses including processing files with diverse data and formatting, generating files with data and images of graphs, and writing and running code iteratively (jev weight 0.53). The pattern is exactly the source doc's: the model writes a small program; the program touches the bulk data; only the distilled output returns to context.

An open-source counterpart, Open Interpreter (https://www.openinterpreter.com/, jev weight 0.27, weak backing), markets itself as a coding agent for open models running code locally. Weak backing; cite as existence of the pattern outside one vendor, not as a benchmark.

The summarization half of the dig returned mostly off-topic results (generic AI summarizer tools at weights 0.04 to 0.12), which is itself the finding the source doc predicts: the valuable move is not "summarize with a tool", it is "do the transform outside the model". The dig could not surface a strong primary source for the summarization practice specifically, so doc 04's framing and this doc's rest on the source doc for that half.

## Why the boundary is at the script, not the tool call

The economic argument in the source doc is that a token spent streaming raw data through the model pays model rates for work a script does at zero marginal model cost (source doc, Overview: tokens are latency, cost, and attention at once). Three consequences:

1. **Attention, not just cost.** A 10,000-row dump in context degrades the model's grip on the tokens that matter. The script returns 10 rows and the analysis gets sharper, not just cheaper.
2. **Determinism.** A jq or Python transform is reproducible; a model manually filtering a dump is not. Re-running the script costs a re-run, not a re-think.
3. **Verifiability.** The script's code is inspectable evidence of what transform was applied. A summarized paste is not.

## Operational rules

1. Any filter, sort, or aggregate over roughly 100 rows runs in a script (source doc, Verification).
2. The script returns the filtered or aggregated result, never the full input (source doc, Core practices 5).
3. Paste verbatim only the specific lines that need exact quotation, such as an error line or a config value under review (source doc, Core practices 6).
4. For iterative analysis (fit, group, chart), prefer a sandboxed interpreter loop over repeated model-side passes (adapted from https://developers.openai.com/api/docs/guides/tools-code-interpreter, jev weight 0.53).
5. If the transform needs the model's judgment (not just its mechanics), script the mechanics and let the model judge the small distilled result.

## Sources

- Source doc: yubi-OS/yubiOS `skills/token-efficiency/SKILL.md` (Overview, Core practices 5 and 6, Anti-patterns, Verification).
- https://developers.openai.com/api/docs/guides/tools-code-interpreter (jev weight 0.53).
- https://www.openinterpreter.com/ (jev weight 0.27, weak).
