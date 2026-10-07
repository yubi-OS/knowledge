# 01 - Routing: when to mint a corpus and when to route elsewhere

Scope: when to mint versus route to refs-refresh-sweep, repo-refs-skill, curve-guided-rsi, or parallel-deep-research; the four NOT-to-use cases and their replacements.

This doc is grounded in the source doc yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md only. Internal-record subtopic, no dig.

## The mint trigger

The source doc names three conditions that trigger a mint:

1. The user hands over a topic or domain request and asks for a knowledge base, corpus, or doc set that does not exist yet, for example "make a corpus on RK3588 secure boot" or "build me a knowledge repo on n8n automation" (source doc).
2. A domain deserves its own durable, cited doc set rather than scattered session notes (source doc).
3. The requester wants the same jev-weighted, searXNG-backed rigor as refs-refresh-sweep but for greenfield authoring instead of refresh (source doc).

The common thread is absence plus scale: no corpus exists, and the topic is broad enough to decompose into multiple durable docs. If either half is missing, mint is the wrong entry point.

## The four NOT-to-use cases (source doc)

1. The docs already exist somewhere in the org. Route to refs-refresh-sweep (refresh existing docs) or repo-refs-skill (archive audit of a refs/ directory). Minting a second copy of existing coverage is the failure this case exists to prevent.
2. The corpus is a code corpus (a skills/ directory). Route to the curve-guided-rsi family, which runs bounded recursive self-improvement loops on skill files instead of authoring prose corpora.
3. The request is one narrow question. Route to parallel-deep-research alone. A single research question does not support a 6 to 14 doc outline; the source doc's red flags section reinforces this (an outline that collapses below 4 load-bearing docs means the request is probably a single research question, not a corpus).
4. The topic needs paywalled or vendor-credentialed sources. The dig layer is anonymous HTTP only (searXNG); the primary-source fallback covers upstream public artifacts but not vendor portals (source doc). A topic whose ground truth lives behind credentials will thin out during the dig and fail the honest-authoring test.

## Interaction with other skills (source doc)

The source doc enumerates five explicit relationships:

- refs-refresh-sweep is the parent process (signals, jev, dig, weight, DB, fan-out, merge). This variant swaps "refresh existing docs" for "author new docs into a fresh corpus repo."
- defapi-jev is the decision-model layer; read it before writing questions.
- ideate-solo applies when the request itself is vague, for example "a corpus on modern storage"; decompose via solo lenses before Phase 1.
- parallel-deep-research is the subagent protocol this skill specializes for greenfield authoring.
- repo-refs-skill is a sibling that audits an existing refs/ archive; run it on the minted corpus later to check its coverage shape.

## Maturity caveat

The source doc states: "Validated shape, not yet validated end-to-end: v1 ships from the 2026-09-29 refs-refresh-sweep run (234 docs triaged, 144 results weighted, 14 subagent PRs merged), reusing its proven phases and operational rules." The pipeline mechanics are inherited from a validated live run, but the mint-specific phases (outline decomposition, repo bootstrap, orchestrator-owned commit) were specified but not yet live-validated at v1. The v2 changelog entry (2026-10-05, source doc) records that the first live multi-wave run happened on yubi-OS/knowledge PRs #12 through #21 and formalized the metric mapping and research-db schema v2 in response to what those runs exposed.

## Router's summary

| Situation | Route |
| --- | --- |
| No corpus exists, topic supports 4+ distinct docs | mint (this skill) |
| Corpus or docs already exist | refs-refresh-sweep |
| refs/ archive needs a coverage audit | repo-refs-skill |
| Target is a skills/ code corpus | curve-guided-rsi family |
| One narrow question | parallel-deep-research |
| Vague request ("a corpus on modern storage") | ideate-solo first, then mint |
| Ground truth behind paywalls or vendor portals | decline or negotiate source access before minting |

## Sources considered

No dig results for this subtopic (internal-record subtopic, no dig). Grounding: yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md (source doc, fetched 2026-10-07).
