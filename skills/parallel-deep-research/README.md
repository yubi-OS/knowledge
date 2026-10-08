# skills/parallel-deep-research — knowledge corpus

Ground source: `yubi-OS/yubiOS skills/parallel-deep-research/SKILL.md` (fetched from main, 4171 bytes). The corpus explicates the skill: what it does, how to use it, its primitives and patterns, its examples and guidelines, and the domain knowledge it encodes. The SKILL.md remains the primary source of record.

Minted 2026-10-06 campaign, skills variant. Branch: `mint/skills-parallel-deep-research-2026-10-06`.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-trigger-and-scope.md](01-trigger-and-scope.md) | When the skill fires: "deep research X" as the established default, and the frontmatter scope boundary. Internal-record subtopic, no dig. |
| 02 | [02-skill-load-prelude.md](02-skill-load-prelude.md) | Step 1: reading using-agent-skills, token-efficiency, context-isolation, then the domain skill, in that order, before any dispatch. |
| 03 | [03-parallel-stream-design.md](03-parallel-stream-design.md) | Step 2: designing 3-5 parallel streams and the three canonical angles (deep-dive, prior art, relevance/comparative). |
| 04 | [04-subagent-prompt-contract.md](04-subagent-prompt-contract.md) | Step 3: the mandatory subagent prompt shape: skill-load directive, self-containment, structured returns, fast model preset, explicit connection IDs. |
| 05 | [05-synthesis-and-conflict-resolution.md](05-synthesis-and-conflict-resolution.md) | Step 4: consolidating streams, resolving conflicts by ground truth, the fixed report shape, session-first save. |
| 06 | [06-canonical-push-mechanics.md](06-canonical-push-mechanics.md) | Step 5: pushing the note to refs/ via the GitHub Contents API and the JSON shell-quoting pitfalls. |
| 07 | [07-borrow-intent-verification.md](07-borrow-intent-verification.md) | Step 6: verifying borrow intent against actual repo state, the mkosi SOURCE_DATE_EPOCH worked example, the redirect rule. |
| 08 | [08-length-budgets.md](08-length-budgets.md) | The output sizing discipline: 1500-2500 per subagent, 2000-3000 synthesis, 500-1500 refs note. Internal-record subtopic, no dig. |

## Research summary

- Results collected: 72 (6 web-shaped subtopics, 2 queries each, top 6 kept per query; 2 internal-record subtopics skipped searXNG entirely and are grounded in the source doc only).
- Weight split: 25 high (>= 0.5) / 47 low (< 0.5).
- Jev requests: 7 (1 outline score validation + 6 noul weighting batches) via https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13.
- Redo counts: 0 (no dig thin enough to require a redo).
- Skipped docs: none.
- Outline validation: all 8 subtopics kept, scores 1.53-1.92, none dropped.

## Preflight

2026-10-06: campaign preflight healthy (orchestrator); agent-side probes skipped for speed per the mint brief. Observed during the run: searXNG 12/12 dig queries returned 200 with 42-51 raw results each; DefAPI /api/decisions 7/7 requests returned 200.

## Verification

Post-push verification performed per the mint brief: PR files list contains all corpus files and research-db; every research-db .json re-fetched via the Git blobs API by sha and parsed; every archive.json entry carries a non-null weight. See the PR body for the verification line.
