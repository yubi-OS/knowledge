# deprecation-and-migration knowledge corpus

Explicates the yubiOS skill `skills/deprecation-and-migration` (ground source: yubi-OS/yubiOS skills/deprecation-and-migration/SKILL.md, 15210 bytes): managing deprecation and migration of systems, APIs, and features; migrating users; zero-downtime database schema migration (expand/contract); and the sunset discipline the skill teaches.

## Documents

- **01-core-principles.md** (826 words; 8 dig sources cited, 0 above the 0.5 weight bar): the three load-bearing principles behind the deprecation-and-migration skill (ground source: yubi-OS/yubiOS skills/deprecation-and-migration/SKILL.md): every line of code is an ongoing cost, user dependencies on observable behavior make removal hard, and deprecation must be planned when a system is designed, not when it dies.
- **02-deprecation-decision.md** (753 words; 6 dig sources cited, 0 above the 0.5 weight bar): the skill's 5-question decision framework that gates every deprecation, plus the external evidence on what maintaining a legacy system actually costs when you choose not to deprecate (ground source: yubi-OS/yubiOS skills/deprecation-and-migration/SKILL.md, section "The Deprecation Decision").
- **03-advisory-vs-compulsory.md** (738 words; 5 dig sources cited, 0 above the 0.5 weight bar): the skill's two-mode classification of deprecation programs, when to use each, and the HTTP-standard machinery (Deprecation and Sunset headers) the industry has standardized for the compulsory case (ground source: yubi-OS/yubiOS skills/deprecation-and-migration/SKILL.md, section "Compulsory vs Advisory Deprecation").
- **04-migration-process.md** (776 words; 4 dig sources cited, 0 above the 0.5 weight bar): the skill's operational sequence for every deprecation: build the replacement, announce and document, migrate incrementally, remove the old system, plus the Churn Rule that binds the deprecating owner to the migration work (ground source: yubi-OS/yubiOS skills/deprecation-and-migration/SKILL.md, section "The Migration Process").
- **05-migration-patterns.md** (696 words; 5 dig sources cited, 3 above the 0.5 weight bar): the 3 migration patterns the skill teaches for moving consumers from an old system to a new one without a cutover event, with the strongest external grounding in the corpus (ground source: yubi-OS/yubiOS skills/deprecation-and-migration/SKILL.md, section "Migration Patterns").
- **06-schema-migration.md** (671 words; 5 dig sources cited, 0 above the 0.5 weight bar): the production schema-migration discipline the skill's frontmatter names ("migrating a database schema in production, such as renaming or dropping a column without downtime"), expressed through the industry's expand/contract (parallel change) pattern (ground source: yubi-OS/yubiOS skills/deprecation-and-migration/SKILL.md frontmatter description).
- **07-zombie-code.md** (700 words; 4 dig sources cited, 1 above the 0.5 weight bar): the skill's zombie-code category: how to detect code that is unmaintained but still consumed, why it is dangerous, and the skill's invest-or-remove rule (ground source: yubi-OS/yubiOS skills/deprecation-and-migration/SKILL.md, section "Zombie Code").
- **08-rationalizations-flags.md** (764 words; 5 dig sources cited, 1 above the 0.5 weight bar): the skill's defenses against self-deception: the 6 common rationalizations for not deprecating, the 7 red flags of a broken deprecation program, and the 6-item post-deprecation verification checklist (ground source: yubi-OS/yubiOS skills/deprecation-and-migration/SKILL.md, sections "Common Rationalizations", "Red Flags", "Verification").

## Research summary

- Results collected and weighted: 128 (high >= 0.5: 29, low < 0.5: 99)
- jev requests: 13 (1 outline validation + 11 noul weighting batches + 1 failed attempt missing the model field), usage 13631 input / 2487 output tokens
- Redos: 3 (one redo each for 01-core-principles, 02-deprecation-decision, 08-rationalizations-flags; primary dig results were dictionary spam and consumer sites)
- Skipped docs: none. Subtopic 09 (primitive-coverage) was dropped at outline validation with score 0.39.
- Known gap: dig depth is weak for docs 01, 02, 03, 04, 06, and 08 (most external sources score below the 0.5 noul bar). The source doc is the authoritative spine; weak-backed claims are labeled in text. Docs 05 and 07 carry sources above the bar.

Preflight 2026-10-06: searXNG healthy (campaign preflight run orchestrator-side, agent-side probe skipped per speed optimization); DefAPI /api/v1/decisions (typesafe/jev-1.13) 200.
