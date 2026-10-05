# 01: Corpus Enumeration and Staleness Signals

Scope: how a refresh sweep enumerates every file in a documentation corpus and computes the cheap, per-file staleness signals that make decision-model triage possible.

## Why enumeration comes first

A jev-weighted refresh sweep begins with a mechanical pass, not a semantic one. Before any decision model sees a document, the sweep needs an inventory: every `refs/*.md` in the repository, each with a stable set of per-file facts. In the 2026-09-29 sweep that inventory covered all 234 docs on main, and each row recorded four signals: the file age taken from its dated filename, the file size, the title, and the presence of Verification and Recommendation sections. Those signals cost nothing to compute and they travel well: they are numbers and booleans, not judgments.

The point of this stage is to make triage auditable. A decision model can only rank what it is given, and a corpus-level sweep cannot afford to miss a file. Enumerating from the filesystem (a glob over the corpus directory) rather than from an index guarantees the input set is complete, and dated filenames give a uniform age measure without depending on git history lookups.

## The signal set

The four signals in the sweep spec each answer a different question:

1. **Filename age.** Every doc carries its date in the filename (for example `systemd-v262-audit-2026-07-14.md`), so age is a string parse, not a metadata fetch. In the 2026-09-29 run, ages ranged from 68 to 77 days for the top of the refresh queue.
2. **Size.** Tiny docs and huge docs fail differently, and size is the cheapest proxy for that.
3. **Title.** The title is what the decision model actually reads when it scores refresh need.
4. **Section presence.** A doc with a Verification section promises it was checked against reality at write time; a doc without one ages faster because nothing in it was verifiable in the first place.

External practice supports the same design. Atlan's freshness-scoring framework treats corpus-level staleness as a measurable quantity: its coverage-drift metric is "the percentage of the total document corpus that has quietly drifted past its defined staleness threshold," and it stresses that all freshness metrics require a defined threshold to mean anything (https://atlan.com/know/llm-knowledge-base-freshness-scoring/, weight 0.6074). The `staleness` linter project on GitHub takes the same deterministic stance: a one-import freshness and drift linter for RAG knowledge bases that "catches the silent decay bugs that turn a once-fresh corpus into a liability" (https://github.com/asmitdash/staleness, weight 0.8098). Both argue for exactly what the sweep does: compute staleness deterministically, before any model judgment.

## What the signals cannot see

Age is a proxy, not a truth. A doc that is 77 days old may describe a stable contract, while a 20-day-old doc may already be wrong because the code it documented changed last week. Practitioner writeups on documentation rot make the point sharply: AI-generated docs rot faster than human-written ones because the feedback mechanisms that catch errors (confused engineers, broken PRs) never fire for generated prose (https://www.codexical.com/posts/2026-06-30-ai-documentation-rot, weight 0.2273, weak backing). Tooling in the same space frames doc health as an observability problem: Docs-Drift is an "enterprise-grade observability platform that detects when your source code drifts away from" its documentation (https://github.com/driftszone/Docs-Drift, weight 0.6107), and docwatcher checks changed code against READMEs and docs to flag what is now wrong (https://github.com/ayush698800/docwatcher, weight 0.2964, weak backing).

A community-built detector drew the same lesson from practice: git commit metadata is a workable way to quantify documentation freshness, and symbol coverage (does the doc still name things that exist in the code?) is a surprisingly good heuristic (https://devpost.com/software/stale-documentation-detector, weight 0.1638, weak backing). The sweep spec skips symbol coverage because it requires code-aware parsing; filename age plus section presence is the cheap subset that still ranks.

## Where the signals feed

The inventory rows are the direct input to the triage stage (doc 02): the decision model receives title plus a refresh-need question, and the ranking stage (doc 03) blends the model's score with normalized age. Because the signals are numeric and complete, both downstream stages can be re-run or re-audited without re-reading a single document.

## What the sweep does not do at this stage

It does not fetch anything, does not score anything, and does not edit anything. Enumeration is read-only over one branch of one repository, which is what keeps the later research DB reviewable: every number in the triage stage can be traced back to a row computed here.
