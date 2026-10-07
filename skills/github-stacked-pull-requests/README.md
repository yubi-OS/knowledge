# github-stacked-pull-requests knowledge corpus

Minted 2026-10-06 from the ground source `yubi-OS/yubiOS skills/github-stacked-pull-requests/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/github-stacked-pull-requests/SKILL.md, 15893 bytes). The corpus explicates that skill: the GitHub stacked pull requests public preview (2026-07-30) and the gh-stack CLI extension.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-what-it-is.md | What stacked PRs are: ordered PR chains where each layer targets the layer below, one-click landing, the stack map UI, and the preview to GA timeline |
| 02 | 02-when-to-use.md | When to use and when not to use stacked PRs: the five use criteria, five counter-cases, size thresholds, and the stacked-diffs practice behind the feature |
| 03 | 03-mechanics.md | Branch topology, the stack map, full and partial merge semantics with auto rebase and retarget, per-PR branch protections, and merge queue integration |
| 04 | 04-gh-stack-cli.md | The github/gh-stack CLI extension: install, create, branch, ls, log, status, submit, merge, sync, submit versus sync per GitHub Docs, and agent exposure |
| 05 | 05-yubios-mapping.md | The yubiOS mapping: fork repos and yubios branches, PINNED.md pinning, the cross-fork stacking pattern, and the github-api Git Data write path |
| 06 | 06-branch-hygiene.md | Branch hygiene inherited from git-workflow-and-versioning: atomic commits per layer, no long-lived stacks, per-layer CI, and the Jenny merges doctrine |
| 07 | 07-anti-patterns.md | The five anti-patterns: oversized stacks, broken bottom layers, forcing linear history, stacks as a scope workaround, skipped inner-layer review |
| 08 | 08-red-flags.md | The six red flags: non-descriptive names, scope slip, wrong base wiring, stale top PRs, missing context links, and stale-base merges |
| 09 | 09-verification.md | The three verification checklists: before opening a stack, before merging, and after merging |

Docs kept: 9. Docs skipped: 0.

## Research summary

- Results collected: 48 (searXNG, 8 queries across 4 web-shaped subtopics, top 6 per query; 5 subtopics were internal-record and skipped the dig per the mint brief)
- Weight split: 16 high (>= 0.5), 32 low (< 0.5), 0 unweighted
- Primary sources cited by the docs: github.blog changelog 2026-07-30 public preview (0.81, 0.78), github.blog changelog 2026-10-06 GA (0.75), docs.github.com about stacked PRs (0.97), docs.github.com stacked PRs CLI commands (0.96, 0.95)
- Weak sources (labeled as weak in the docs): betterstack.com guide (0.21), pragmaticengineer.com stacked diffs (0.32), agentpedia.codes agent guide (0.18)
- jev requests: 5 (1 outline validation score request, 4 noul weighting batches of 12), usage 5489 input / 1019 output tokens
- Redos: 0
- Gaps: none. No docs were skipped.

Preflight 2026-10-06: searXNG healthy (campaign preflight, orchestrator); decide via DefAPI direct (typesafe/jev-1.13), campaign preflight run orchestrator-side, agent-side probe skipped for speed.

## Research DB

Under `research-db/`: preflight.json, outline.json, archive.json (48 weighted result entries), digs/ (9 records, one per subtopic), jev-log.json (5 request records), db.ts (schema interfaces).
