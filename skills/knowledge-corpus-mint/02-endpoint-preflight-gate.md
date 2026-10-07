# Endpoint preflight gate: Phase 0 of the mint

Scope: the REQUIRED Phase 0 health gate that must pass on both backing endpoints, searXNG and the jev decide endpoint, before any dig or weighting runs, and why a degraded preflight means STOP rather than a weakened mint.

## The gate itself

The source doc (yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md) makes Phase 0 a hard gate: both backing endpoints MUST be verified healthy before any later phase runs. If either fails, the operator stops and surfaces to the user; the skill must not silently degrade into a weakened mint. The doc grounds this in a dated incident: the first yubios corpus mint ran on 2026-09-29 while searXNG engines were suspended for 5 of 6 docs, shipped research-db entries with zero dig results, and had to be re-minted.

The searXNG probe is a GET against the proxy webhook with a query, and it must return HTTP 200 with at least 1 result and no `Suspended:` entries in `unresponsive_engines` (source doc). The jev probe is a POST to the decide endpoint with a one-question noul smoke probe, and it must return HTTP 200 with an `answers` object (source doc). Both probe results, with timestamp, result counts, and cost, are recorded in the corpus research DB under a `preflight` key (source doc).

## What the dig supports about the probe target

SearXNG is a free internet metasearch engine that aggregates results from multiple engines into a single response (https://github.com/searxng/searxng, weight 0.36). The official documentation describes the search API as the interface for issuing queries and receiving structured results, and the project keeps the API documented at a stable docs URL (https://docs.searxng.org/dev/search_api.html, weight 0.52; https://docs.searxng.org/, weight 0.54). A probe against this API therefore exercises the same surface the real digs will use, which is why the source doc checks result count rather than just connectivity (source doc).

The SearXNG documentation also defines an exception hierarchy for engines, including the exception types an engine can raise when it fails (https://docs.searxng.org/src/searx.exceptions.html, weight 0.47). That is the mechanism underneath the `unresponsive_engines` list the probe inspects (source doc; https://docs.searxng.org/src/searx.exceptions.html, weight 0.47).

## The after-close blind spot

The source doc records a known searXNG bug: engines whose errors land after the response closes are NOT reported in `unresponsive_engines` (add_unresponsive_engine after close). In practice this means a probe can look healthy, a short unresponsive list, while engines are actually failing; the documented response is to grep the Northflank service logs for `ERROR:searx.engines` before concluding anything about health (source doc). A third-party troubleshooting guide for public and API instances also warns that per-engine failures can hide behind a 200 response (https://perlod.com/tutorials/searxng-troubleshooting-guide/, weight 0.13, weak backing).

## Why STOP and not degrade

The rationale recorded in the source doc is that a weakened mint is worse than no mint: research-db entries with zero dig results made the 2026-09-29 run's evidence worthless and forced a re-mint (source doc). The mint's own red-flag list repeats the same discipline at the doc level: a digs file showing zero results means the doc either carries the direct-verification story or does not ship (source doc).

For this campaign variant, the orchestrator ran the campaign preflight, so the per-mint agent-side probe is skipped for speed and recorded in preflight.json as campaign preflight healthy (skills-variant brief, 2026-10-06). The record keeps the probe URLs and the note so the audit trail still shows where the health signal came from.

## Sources

- yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md (source doc, fetched 2026-10-07)
- https://docs.searxng.org/ (weight 0.54)
- https://docs.searxng.org/dev/search_api.html (weight 0.52)
- https://docs.searxng.org/src/searx.exceptions.html (weight 0.47)
- https://github.com/searxng/searxng (weight 0.36)
- https://perlod.com/tutorials/searxng-troubleshooting-guide/ (weight 0.13, weak backing)
