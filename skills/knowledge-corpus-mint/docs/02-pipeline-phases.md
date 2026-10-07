# 02 - The 8-phase pipeline end to end

Scope: the 8-phase pipeline from preflight gate to final report, and the dependencies between phases.

Grounded in the source doc yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md only. Internal-record subtopic, no dig.

## Phase map (source doc)

1. Phase 0, endpoint preflight: both backing endpoints (searXNG and the decide model) MUST be verified healthy before any later phase runs. This is a REQUIRED gate, not a nicety. If either fails, stop and surface to the user; do not silently degrade into a weakened mint.
2. Phase 1, parse the request into a ref and outline: derive a lowercase-hyphenated ref slug, decompose the request into 6 to 14 subtopic docs each with a one-line scope and 2 seed dig queries, then jev-validate the outline with one score request and drop score 0 subtopics.
3. Phase 2, dig and weight per subtopic: 2 searXNG queries per doc, keep top 6 results each, jev-weight every result as it lands, batched 5 results per request in the source doc's phrasing.
4. Phase 3, repo bootstrap (idempotent): ensure the knowledge repo exists; seed a fresh empty repo with a Contents-API commit before touching the Git Data API, which returns 409 on an empty repo.
5. Phase 4, author fan-out: one task subagent per doc, all dispatched in one turn, returning markdown; the orchestrator assembles the repo tree.
6. Phase 5, land the corpus: one Git Data API chain (blobs, tree, commit, refs, draft PR) in one bash call, then post-push verification.
7. Phase 6, merge via POST /repos/{owner}/{repo}/merges, not the PR merge endpoint.
8. Phase 7, one report at the end with repo and ref path, doc list with sizes, research DB stats, PR number, and merge SHA.

## Dependency structure

The phases are strictly ordered, with three load-bearing couplings (source doc):

- Preflight gates everything. The source doc records the 2026-09-29 lesson: the first yubios corpus mint ran while searXNG engines were suspended for 5 of 6 docs, shipped research-db entries with zero dig results, and had to be re-minted. Skipping the gate is how a whole corpus gets thrown away.
- Weighting gates authoring. Phase 4 subagents may write only from jev-weighted dig results, so Phase 2 must fully complete (including redos) before fan-out. The red-flags section adds: on a jev 429 storm after fan-out, serialize the weighting phase instead of parallelizing it, because weighting is the cheap phase and authoring is where parallelism pays.
- The orchestrator owns all repo writes. Subagents return markdown only; the orchestrator commits everything in one chain to keep the tree atomic and avoid N agents racing one branch (source doc, Phase 4).

## Branch and landing conventions

The corpus lands at knowledge/<ref>/ on branch mint/<ref>-<date>, and branch names must NOT start with refs/ because GitHub rejects that form (source doc, Phase 5 and anti-patterns).

## Rate-limit drift between doc body and changelog

The prerequisites section of the source doc still carries "15 requests/min/IP" for the decide endpoint, but the v2 changelog (2026-10-05) explicitly records that the 15/min/IP rate limit was hallucinated and removed, with pacing lowered to at least 1s as courtesy-only. Treat the changelog as authoritative: there is no published rate limit; pacing is courtesy. This is a dated correction from the source doc's own changelog, cited here so future mints do not cargo-cult the stale number in the body text.

## Verification checklist (source doc)

The source doc closes the pipeline with a verification checklist: preflight passed and recorded before any dig ran; the corpus directory contains README plus N docs plus research-db/; every doc's factual claims carry source URLs (spot-check 3); every result carries a jev weight and task_id lineage; the PR merged via /merges with merged=true verified; total jev spend logged; and no network state changed (the searxng port stays internal-only).

## Sources considered

No dig results for this subtopic (internal-record subtopic, no dig). Grounding: yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md (source doc, fetched 2026-10-07).
