# 07 Lifecycle and Drift: Keeping a Gap Map Honest Over Time

Scope: Lifecycle of a gap map: staleness, re-mapping cadence, drift detection, where gap maps live across runs, and versioning of gap records.

## The gap map goes stale, silently

A gap map is a snapshot of an artifact's negative space at the moment it was taken. As the artifact changes, the map does not; as the world changes, the map does not; as adjacent skills appear, the map does not. The framework treats this as a first-class lifecycle gap: "no concept of the gap map is now stale," and no mechanism to detect that staleness without re-mapping (source doc origin: yubiOS refs/negative-skill-space-2026-07-28.md).

Documentation engineering has measured this failure for documents in general. Documentation drift is defined as the growing gap between what docs say and what the system does (https://datadef.io/guides/en/documentation-drift, weight 0.39, weak backing). Its texture matters: the drift is gradual and invisible, and its cost is trust, because users believe stale documentation is true and erode confidence in the documentation set over time (https://document360.com/blog/documentation-drift/, weight 0.26, weak backing). Metadata-platform practice reports that active automation of documentation updates reduces manual maintenance burden substantially compared with passive approaches, using schema-change detection and freshness SLAs to catch drift at the source (https://atlan.com/know/documentation-drift-prevention-strategies/, weight 0.31, weak backing). Gap maps inherit every one of these properties: they are documentation about an artifact, they drift as the artifact evolves, and a stale map is worse than no map because it manufactures confidence.

## What drifts specifically

The framework names 3 drift vectors for a gap map (source doc origin):

1. **The artifact changed.** An extension closed a mapped gap, or a new feature opened an unmapped one. The map now has both false positives (gaps that no longer exist) and false negatives (gaps that did not exist when it was drawn).
2. **The context changed.** The same artifact has different effective negative spaces in different deployment contexts: a skill used by a solo agent has different gaps than the same skill used by a team with reviewers. A single map cannot represent both, and the framework does not yet model context-dependent negative space.
3. **The neighborhood changed.** New adjacent skills appear. A gap that was "accept, no pair exists" can flip to "pair, a skill now exists," with no signal to the map.

## Re-mapping cadence is an open question

The framework's honest position: it does not know the right cadence for re-mapping, whether drift is fast (months) or slow (years) for typical artifacts, or how to detect drift without re-mapping (source doc origin, unknown unknowns 3 and 4). Until measured, the default is event-driven re-mapping rather than calendar-driven: re-map when the artifact ships a meaningful change, when a paired skill changes, or when a real-world failure implicates a region the map called safe.

## Where accumulated gap maps live

The source doc explicitly defers the storage question: if gaps accumulate across runs, where do they live? A per-artifact directory, a single global registry, a versioned changelog? (source doc origin, unknown unknown 9). The adjacent practice of technical-debt tracking supplies 3 concrete patterns worth borrowing:

- **The register pattern.** A technical debt register is a backlog of all known debt; it does not need to be a separate tracker, it is a deliberate, reviewable list rather than scattered mentions (https://blog.logrocket.com/product-management/how-to-use-a-technical-debt-register/, weight 0.40, weak backing). A gap register is the same shape: one list per artifact, each gap with its score, disposition, and date.
- **The tracking-and-aging pattern.** Engineering-leadership guidance treats debt tracking as an ongoing remediation process with risk reduction and velocity as its outcomes, not a one-time audit (https://blog.codacy.com/complete-guide-to-technical-debt-tracking-for-engineering-leaders, weight 0.25, weak backing). Gap maps age the same way; a map older than the artifact's last meaningful change should be marked suspect.
- **The prioritization pattern.** Practitioner guidance on managing technical debt emphasizes explicit prioritization over attempting to fix everything, with the tradeoff made visible rather than implicit (http://jacobian.org/2023/dec/20/tech-debt/, weight 0.59). This matches the framework's score-and-rank discipline (doc 04) and is the one borrowing here with strong backing.

Tooling platforms formalize the same loop with quantification and planning of future investment (https://www.ardoq.com/solutions/technical-debt-management, weight 0.43, weak backing); for gap maps the equivalent would be a dashboard of open gaps per artifact with age and score.

## Versioning gap records

A gap map that cannot be diffed against its predecessor is a one-shot document. The framework's recursive pass flagged exactly this: running the skill twice on the same artifact produces two gap maps with no diff between them (source doc origin). The minimal viable versioning, consistent with the register pattern above: each map is a dated, append-only record; a re-map produces a new record plus an explicit diff (closed gaps, new gaps, rescored gaps). The diff is the artifact that makes drift visible; without it, re-mapping is indistinguishable from remapping by memory.

CI-based documentation-drift detection offers the structural idea to imitate: compare live state against recorded state on every merge and flag the divergence (https://moxiedocs.com/documentation-drift, weight 0.21, weak backing). For gap maps the live state is the artifact's current text and the recorded state is the map's claims; an automated pre-check that re-verifies each still-open gap's evidence would convert drift detection from a manual re-sweep into a CI step. That tooling does not exist yet in the framework and is recorded as future work, not as a shipped capability.
