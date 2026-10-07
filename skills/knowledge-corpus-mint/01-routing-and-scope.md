# Routing and scope: when to mint, when not to

Scope: when the knowledge-corpus-mint skill is the right tool, when it is not, and how it routes to its sibling skills. This is an internal-record subtopic: it is grounded in the source skill document, yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md (source doc). It describes a decision surface defined inside the yubiOS skill corpus, so no external dig was run and none was needed.

## Use it for greenfield corpora

The source doc gives 3 positive triggers.

1. The user hands over a topic or domain request and asks for a knowledge base, corpus, or doc set that does not exist yet, for example "make a corpus on RK3588 secure boot" or "build me a knowledge repo on n8n automation" (source doc).
2. A domain deserves its own durable, cited doc set rather than scattered session notes (source doc).
3. The user wants the same jev-weighted, searXNG-backed rigor as refs-refresh-sweep but applied to greenfield authoring instead of refreshing existing docs (source doc).

The skill's identity is a variant of refs-refresh-sweep: that skill refreshes docs that already exist, this one creates docs that do not (source doc). Its v1 shipped from the 2026-09-29 refs-refresh-sweep run, which triaged 234 docs, weighted 144 results, and merged 14 subagent PRs, so the mint reuses proven phases rather than inventing new ones (source doc).

## Do not use it when

The source doc names 4 exclusions, each with a better route.

1. The docs already exist somewhere in the org: use refs-refresh-sweep to refresh them or repo-refs-skill to audit the archive (source doc).
2. The corpus is a code corpus, meaning a skills corpus: route to the curve-guided-rsi family instead (source doc).
3. The request is one narrow question: parallel-deep-research alone is enough (source doc).
4. The topic needs paywalled or vendor-credentialed sources: the dig layer is anonymous HTTP only through searXNG, and primary-source fallback covers upstream public artifacts but not vendor portals (source doc).

## Red flags that override a yes

Three red flags in the source doc stop a mint even when the routing rules above look satisfied.

- If the outline collapses below 4 load-bearing docs, the request is probably a single research question, not a corpus, and belongs to parallel-deep-research (source doc).
- If the repo that will host the corpus exists but with unexpected contents, stop and surface to the user; never clobber an existing corpus dir (source doc).
- If a doc's research-db digs file shows zero results, the doc either carries the direct-verification story or the doc does not ship (source doc).

## Interaction with other skills

The source doc records 5 neighbors:

- refs-refresh-sweep: the parent process (signals, jev, dig, weight, DB, fan-out, merge); the mint swaps "refresh existing docs" for "author new docs into a fresh corpus".
- defapi-jev: the decision-model layer, read before writing questions.
- ideate-solo: use when the request itself is vague, for example "a corpus on modern storage"; decompose via solo lenses before Phase 1.
- parallel-deep-research: the subagent protocol this skill specializes for greenfield authoring.
- repo-refs-skill: a sibling that audits an existing refs/ archive; run it on a minted corpus later to check its coverage shape (source doc).

## Sources

- yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md (source doc, fetched 2026-10-07). Internal-record subtopic, no dig.
