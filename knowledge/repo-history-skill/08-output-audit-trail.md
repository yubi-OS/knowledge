# Output shape and the audit trail

Scope: output shape for a refreshable history archive: session JSON snapshots, fit metrics, gap-map documents, changelog audit trails, and canonical human-readable summaries with tracker status comments.

## Why output shape is load bearing

An archive that only a script can read is an archive no one audits. The output set has to serve 3 readers at once: the script that refreshes and re-fits (structured JSON), the human reviewing what changed and why (markdown summaries), and the tracker where status is reported (short comments). Auditing practice defines the baseline: an audit is an examination of a process or quality system to verify it meets requirements (https://asq.org/quality-resources/auditing, noul 0.4989, weak backing). A refreshable archive is exactly that kind of system, so its outputs must be examination-ready by construction.

## The file set

A single refresh run produces 5 artifacts, named by repo and date:

1. `repo-history-archive-<repo>-<date>.json`: the corpus itself. Every item (pull request, issue, commit, tracker item) with its primitive coverage vector, per-section breakdown, PCA coordinates, sphere point, and pre-fit distance to the ideal pole. This file is the refresh target: the next run reads it, fetches deltas, and merges.
2. `repo-history-fit-<repo>-<date>.json`: the curve fit results: explained variance of the top 2 components, holdout R-squared, sparse-cell count, and the ranked list of most isolated items.
3. `repo-history-gap-map-<repo>-<date>.md`: the axis sweep over the archive, formatted as one verdict per axis (extend, pair, or accept), so a reviewer can see not just what is missing but what the sweep recommends about each gap.
4. `repo-history-changelog-<repo>-<date>.md`: the RSI cycle audit trail: one entry per cycle recording hypothesis, edit, and measured result.
5. A canonical human-readable summary pushed to a docs directory, so the narrative version of the archive lives with the repository it describes.

## Changelog discipline

The changelog artifact should follow the established convention rather than invent one. Keep a Changelog defines a changelog as a curated, chronologically ordered list of notable changes for each version of a project, written to make it easier for users and contributors to see what changed (https://keepachangelog.com/en/1.1.0/, noul 0.9394). Its older canonical line applies directly to archives: do not let your friends dump git logs into changelogs (https://keepachangelog.com/en/1.0.0/, noul 0.5232). A cycle audit trail that lists every command and every fetch is a dumped git log; the curated form records only notable changes: which cycle ran, what its hypothesis was, what changed, what the measured delta was. A stricter style guide adapts Keep a Changelog and holds that clean changelogs start with clean histories (https://common-changelog.org/, noul 0.4604, weak backing), which for an archive means the audit trail inherits its quality from disciplined per-cycle records.

## Provenance for the artifacts

Every number in the summary traces back to a record. Provenance research for ML pipelines makes the design point explicit: pipelines that collect artifact integrity and end-to-end lineage metadata enable verification of what was produced and from what inputs (https://arxiv.org/html/2502.19567v1, noul 0.7989; https://arxiv.org/html/2502.19567v2, noul 0.6315). Applied here, each fit metric in the summary file should name the run that produced it (date, item count, primitive basis version), and each corpus item should carry its collection timestamp and source query. Academic work on capturing end-to-end provenance for ML pipelines makes the same argument at scale: artifact management systems that join data, model, metadata, and software artifacts are what make later analysis possible (https://www.sciencedirect.com/science/article/pii/S0306437924001534, noul 0.8719). Practitioner treatments frame provenance metadata collection at pipeline scale as the substrate for audit trails and forensic analysis (https://inferensys.com/services/digital-provenance-and-disinformation-security/provenance-data-pipeline-engineering, noul 0.394, weak backing; https://www.securityscientist.net/blog/12-questions-and-answers-about-artifact-provenance/, noul 0.4692, weak backing).

## Status reporting to the tracker

The last output is social: a short status comment on the tracker item that owns the archive work, carrying the cycle summary (what ran, key metrics, what changed). Two rules keep it useful. First, it links to the artifacts rather than pasting them, because the tracker is a pointer layer, not a data store. Second, it is written per cycle, not per refresh: a delta-only refresh with no fit change is recorded in the changelog file but does not need a comment.

## Naming and retention

Dates in filenames (ISO format, YYYY-MM-DD) make the artifact series sortable and make the 7-day staleness check of the refresh logic a filename parse. Session-scoped files are the working set; the canonical summary in the repository's docs directory is the durable copy that survives context resets. The split matters: session files are cheap to regenerate from the cache, while the canonical summary is the one a future session reads first when cold-starting.

## Design summary

1. Emit structured JSON (archive, fit) and curated markdown (gap map, changelog, canonical summary) from the same run (https://keepachangelog.com/en/1.1.0/, noul 0.9394).
2. Curate the changelog: notable changes only, never a raw event dump (https://keepachangelog.com/en/1.0.0/, noul 0.5232).
3. Carry provenance on every artifact: run date, item count, basis version, collection timestamps (https://arxiv.org/html/2502.19567v1, noul 0.7989).
4. Report status to the tracker per cycle with links, not pastes (https://www.sciencedirect.com/science/article/pii/S0306437924001534, noul 0.8719).
