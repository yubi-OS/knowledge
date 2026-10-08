# 03 - Phase 1: Corpus Enumeration and Staleness Signals

Scope: how Phase 1 lists a corpus, fetches every body, computes per-doc staleness signals, and persists them so a container restart cannot destroy the work.

Grounding spine: `yubi-OS/yubiOS skills/refs-refresh-sweep/SKILL.md` (source doc), plus GitHub API documentation via dig.

## The 3 steps of Phase 1

Per the source doc:

1. List the corpus directory via the Contents API. One call returns everything, because `per_page` is IGNORED for directory listings.
2. Fetch every file body via `raw.githubusercontent.com`, which costs no API budget. Concurrency around 8 with retry.
3. Per file, compute: age in days (parsed from the filename date), size, title (the first `# ` line), and the presence of Verification and Recommendation sections. Persist all of it to `session/<run-slug>/refs-signals.json` INCREMENTALLY, because container restarts kill unflushed work.

The validating run of 2026-09-29 enumerated 234 refs in one call, fetched bodies concurrently, and measured a median age of 54 days with 136 docs at 45 days or more (source doc, Examples section).

## Dig grounding: how GitHub listing and raw fetches actually behave

The GitHub REST API documentation is the authoritative reference for the endpoints Phase 1 uses (https://docs.github.com/en/rest, weight 0.96). Its pagination guide explains that pagination is delivered through `link` response headers with the `per_page` parameter included in the header, and that scripts should page by following those headers (https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api, weight 0.97). Phase 1 exploits a deliberate exception: directory listings ignore `per_page` and return the full listing in one response, which is why one call suffices for a 234-file corpus (source doc). A result set backed by a weak-weight Stack Overflow thread on raw-file rate limiting (weight 0.08) should not be trusted over the official docs.

The raw-body fetch strategy is grounded in GitHub's own rate-limit announcements. GitHub's changelog entry of 2025-05-08 documents updated rate limits for unauthenticated requests, explicitly covering cloning over HTTPS, anonymous REST API interaction, and downloading files from raw.githubusercontent.com (https://github.blog/changelog/2025-05-08-updated-rate-limits-for-unauthenticated-requests/, weight 0.89). This is the mechanism behind two source-doc rules: fetch bodies via raw.githubusercontent.com to preserve the API budget for API calls, and retry fetches because unauthenticated raw traffic is rate limited.

## Why the signals are what they are

Phase 2's jev triage needs a compact, factual state object per doc, and Phase 3's ranking formula needs a numeric age. The 4 signals exist to feed those consumers:

- age in days feeds the ranking blend (doc 05: `0.7 * jev_noul + 0.3 * min(age_days/80, 1)`).
- title and the section flags (Verification, Recommendation) feed the triage state's `has_verification_section` style fields, which let the decision model judge whether a doc already has a refresh-hygiene structure.
- size gives a cheap content-complexity proxy.

The filename-date convention is load-bearing: age comes from the filename, not file mtime, so a corpus that renames files with dates on every material edit produces honest ages, and a corpus that does not produces garbage ages regardless of how well the rest of the sweep runs.

## Incremental persistence is the phase's real deliverable discipline

The source doc's anti-patterns list records a real loss: container restarts killed one full dig batch before it was saved, and non-incremental persistence is listed as an anti-pattern. The rule is to write after every batch or doc, not at the end. In Phase 1 that means appending each file's signal record to `refs-signals.json` as it is computed, not after the loop. The same discipline reappears in Phase 2 (persist scores after every batch) and in the research DB (doc 07).

## Operational notes

- The concurrency of roughly 8 for raw fetches is a source-doc operational value; the 2025-05-08 rate-limit changelog entry is the external reason not to raise it much higher unauthenticated.
- Listing is one call, but bodies are N fetches: the 234-doc run is the reference scale.
- Keep the signals file under the run slug (`session/<run-slug>/`), matching the research DB layout in doc 07.
