# public-security-funding-targets knowledge corpus

Minted 2026-10-05 from yubi-OS/yubiOS `refs/public-security-funding-targets-2026-07-25.md`. Topic: public security funding programs for open-source security projects, including grant targets (SBIR, NSF, foundations, government programs), eligibility, and the rationale for prioritization without drafting applications prematurely. This corpus is a target list and screening rationale; no application to any program is drafted or submitted by this corpus.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-sbir-sttr-security-funding.md | SBIR/STTR as the US government small-business route for security R&D; three-phase structure and the for-profit US entity eligibility gate |
| 02 | 02-nsf-open-source-security-programs.md | NSF SaTC 2.0 and Transition to Practice; TTP-Translate explicitly names community-driven open-source development as fundable |
| 03 | 03-openssf-alpha-omega.md | OpenSSF Alpha-Omega: audit and maintainer-engagement funding, the March 2026 $12.5M expansion, and its criticality-driven selection model |
| 04 | 04-github-secure-open-source-fund.md | GitHub Secure Open Source Fund: rolling cohort funding for maintainers; grant amount and duration flagged as unverified against the primary page |
| 05 | 05-nlnet-ngi-zero-grants.md | NLnet and NGI Zero: open-licence and European-dimension eligibility, themed funds, the November 3rd 2026 call window |
| 06 | 06-sovereign-tech-fund-eligibility.md | Sovereign Tech Fund/Agency: maintenance-first funding thesis and why prototype-stage projects are excluded by design |
| 07 | 07-otf-foss-sustainability-fund.md | Open Technology Fund FOSS Sustainability Fund: internet-freedom mission framing, sustainability criteria, and the conditional fit test |
| 08 | 08-funding-screening-prioritization.md | Screening criteria (roadmap distortion, confidentiality, governance capture, deliverable path), backlog sequencing, and re-verification discipline |

## Research summary

- Results collected: 96 raw results across 18 searXNG queries (top 6 per query), 90 unique result entries after cross-query dedupe, all carried into archive.json.
- Weight split: 49 entries at weight >= 0.5 (primary/official backing), 41 entries at weight < 0.5 (weak backing, labeled in text where cited).
- Jev requests: 24 total via /api/decide (clef): 1 preflight probe, 1 outline validation (8 score questions), 22 weighting batches (84 + 12 results in batches of up to 5), including 2 failed attempts (HTTP 429 and HTTP 502) that were retried after 30s backoff per the redo rule. Usage: 15825 input tokens, 0 output tokens.
- Redos: 1 dig redo (doc 08, funding-screening-prioritization), re-run with 2 different queries after the first pass returned mostly off-topic or low-authority results. No doc was skipped; no dig fell back to direct primary-source fetching.
- Skipped docs: none.

## Per-doc sources

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01 | 9 | 8 |
| 02 | 11 | 10 |
| 03 | 9 | 5 |
| 04 | 8 | 3 |
| 05 | 12 | 9 |
| 06 | 11 | 5 |
| 07 | 10 | 4 |
| 08 | 20 | 5 |

## Redo log

- 08-funding-screening-prioritization: 1 redo. First-pass queries returned dictionary entries, unrelated wikis, and social threads. Redo queries: "corporate funding open source project conflict of interest governance influence" and "accepting sponsorship open source maintainer guidelines independence neutrality". See research-db/digs/08-funding-screening-prioritization.json.

## Gaps / skips

- None skipped. Two specific data points could not be confirmed from primary sources in this dig and are labeled unverified in the docs: the GitHub Secure Open Source Fund grant amount and cohort duration (doc 04), and NLnet per-grant euro amounts (doc 05). Both docs instruct re-verification on the program's own site.

## Preflight

Preflight 2026-10-05: searXNG 193 results healthy; /api/decide (clef) 200.
