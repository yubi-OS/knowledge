# frontend-ui-engineering knowledge corpus

Minted 2026-10-07 from the ground source `yubi-OS/yubiOS skills/frontend-ui-engineering/SKILL.md` (16143 B). The corpus explicates that skill: building production-quality UIs, creating components, implementing layouts, managing state, and the frontend engineering discipline the skill teaches. The SKILL.md's own sections dictated the outline.

## Docs

1. `01-skill-scope-and-when-to-use.md` - what the skill is for, its 5 trigger conditions, the 3 quality properties, and the anti-goal (internal-record subtopic, no dig)
2. `02-component-architecture.md` - colocation, composition over configuration, focused components, container/presentation split
3. `03-state-management.md` - the 6-rung state ladder and the 3-level prop drilling rule
4. `04-design-system-adherence.md` - the AI-aesthetic table, spacing scale, type hierarchy, semantic color tokens, contrast
5. `05-accessibility-wcag-aa.md` - keyboard navigation, ARIA labels, focus management, empty/error states under WCAG 2.1 AA
6. `06-responsive-design.md` - mobile-first CSS, Tailwind breakpoint strategy, the 320/768/1024/1440px test widths
7. `07-loading-and-transitions.md` - skeletons with aria-busy, optimistic updates with React Query rollback
8. `08-verification-and-rationalizations.md` - the 7-item checklist, red flags, the rationalizations table, axe-core

## Research summary

- Results collected: 84 (14 searXNG queries, 2 per web-shaped subtopic, top 6 kept per query; subtopic 01 was an internal-record subtopic with no dig)
- Weight split: 29 high (>= 0.5) / 55 low (< 0.5) of 84
- Jev requests: 7 (1 outline score request, 6 noul weighting batches of 14), usage 8724 input / 1660 output tokens
- Redo counts: 0
- Skipped docs: none; all 8 authored

## Notes on weak sources

Weakly-weighted (< 0.5) results are labeled as such wherever a doc cites them. Several dig results were off-topic despite moderate weights (a dictionary entry for "composition", the Aria Las Vegas resort, a Britannica human-skeleton article, a weather forecast); they are recorded in the archive with their weights but are cited by no doc.

## Preflight

2026-10-06: searXNG campaign preflight healthy (orchestrator-side probe); /api/decide via DefAPI direct (typesafe/jev-1.13) 200, agent-side probe skipped for speed per the mint brief.
