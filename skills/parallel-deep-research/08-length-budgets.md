# 08. Length Budgets

Scope: the source doc's output sizing discipline: per-subagent, synthesis, and refs/ note budgets, and why they exist. This is an internal-record subtopic, no dig: every claim here is grounded in the source doc, yubi-OS/yubiOS skills/parallel-deep-research/SKILL.md.

## The three budgets

The source doc's Length budgets section fixes three numbers (source doc):

1. Per subagent: about 1500 to 2500 words.
2. Synthesis: about 2000 to 3000 words consolidated, and it can be longer if the run is multi-stream.
3. Refs/ note, for discovery findings: about 500 to 1500 words.

The prompt contract in step 3 carries the first budget inside every subagent prompt (source doc, step 3): each subagent is told up front what size report to return. The synthesis budget in step 4 applies to the consolidated report. The refs/ budget applies to what actually lands in the repository.

## Why the budgets are shaped this way

The three numbers encode a compression funnel. N streams each return 1500 to 2500 words; the synthesis compresses all of them into 2000 to 3000 words, not N times that; the refs/ note compresses further into 500 to 1500 words. Each stage is smaller or roughly flat relative to the sum of its inputs, which forces selection rather than concatenation. The synthesis cannot just stitch the streams together, and the refs/ note cannot just be a shortened synthesis: both must decide what survives.

The synthesis budget's escape hatch, "can be longer if multi-stream" (source doc), is the one place the doc allows growth, and it is tied to stream count rather than topic size. More streams means more independent findings that need their sections preserved; a bigger topic does not.

## How the budgets interact with the rest of the workflow

The budgets are not standalone numbers; they are the sizing half of the structured-return contract (doc 04). A subagent told to return structured markdown with citations at 1500 to 2500 words cannot satisfy the contract with an unstructured wall of text: the budget and the format constrain each other. Likewise the refs/ note budget pairs with the push mechanics (doc 06): a 500 to 1500 word note is a single Contents API PUT, not a multi-file change.

The budgets also serve the model-preset choice. Bounded research with a fast model preset is only cheap if the outputs are bounded (source doc, step 3, per token-efficiency); an uncapped report length would erode the cost savings of the cheaper model.

## Enforcement discipline

The source doc does not define an automated enforcer for the budgets; they are stated as targets in the workflow (source doc, Length budgets). The practical enforcement points are the two places text is produced: the subagent prompt (where the budget is stated as an instruction) and the synthesis (where the orchestrator edits the consolidated report down to 2000 to 3000 words before pushing anything). The session-first save in step 4 (doc 05) is the editing workspace: the report is trimmed there, before the refs/ push, so the canonical note that lands is the compressed distillation, not the working copy.

Source doc: `yubi-OS/yubiOS skills/parallel-deep-research/SKILL.md` (Length budgets; workflow steps 3 and 4).
