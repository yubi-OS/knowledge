# pr-launch knowledge corpus

Knowledge corpus minted from the yubiOS skill `skills/pr-launch/SKILL.md` (yubi-OS/yubiOS), ground source of record: "Plans and executes product launch PR for technical open-source projects. Covers bifurcated messaging, asset creation (press release, pitches, README, social), channel targeting, launch sequencing, and post-launch tracking."

## Docs

| NN | file | scope |
|---|---|---|
| 01 | 01-bifurcated-messaging.md | Two-audience message frameworks: separate technical and general stories for the same project |
| 02 | 02-launch-phases.md | The 4-phase launch timeline from pre-launch prep to week 2+ sustained momentum |
| 03 | 03-channel-targeting.md | Channel map (HN, Lobste.rs, Reddit subreddits, tech press) and the launch-day posting order |
| 04 | 04-asset-templates.md | Launch asset templates: Show HN post, subreddit seed posts, press pitch, social thread |
| 05 | 05-readme-audit.md | README audit: the 4 first-reader questions (what, why, try, trust) |
| 06 | 06-anti-patterns.md | Launch anti-patterns: cross-posting spam, feature-first framing, disappearing, hype language |
| 07 | 07-output-artifacts.md | The 7 output artifacts and the 9-item pre-launch verification checklist |
| 08 | 08-post-launch-tracking.md | Post-launch tracking: 24-hour engagement window, coverage capture, deep-dives, newsletters |

## Research summary

- Results collected: 14 searXNG queries, 84 raw results, 76 kept after cross-query dedupe (9 duplicate URLs dropped, counted once).
- Weight split: 14 results with weight >= 0.5 (high), 62 with weight < 0.5 (low, labeled weak in docs). 0 unweighted.
- Strongest results: the official Hacker News guidelines (showhn.html 0.74, newsguidelines.html 0.75), Reddit's selfpromotion wiki (0.53), Atlassian launch-timeline pages (0.62, 0.7), TODO Group marketing guide (0.55). Most practitioner-blog results scored low and are cited in docs only with explicit weak-backing labels.
- jev requests: 7 (1 outline score validation, 6 noul weighting batches of 14/14/14/14/14/6). Usage tokens: input 8206, output 1516 (outline 1020/124; weighting 7186/1392).
- Redo counts: 0 dig redos, 0 jev request redos. All 7 web-shaped subtopics dug; subtopic 07 is an internal-record subtopic (artifact contract and checklist live only in the source doc) and was not dug.
- Skipped docs: none. 8 of 8 outline subtopics kept after jev score validation (scores 1.72-1.95, no score-0 drops).

## Preflight

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator-side, no agent probe per speed optimization); DefAPI /api/v1/decisions (typesafe/jev-1.13) returned 200 on 7 of 7 requests.
