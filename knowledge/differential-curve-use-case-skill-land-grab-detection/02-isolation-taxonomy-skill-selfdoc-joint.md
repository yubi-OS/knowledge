# The Isolation Taxonomy: Skill-Only, Selfdoc-Only, and Jointly-Occupied Cells

**Scope:** The three occupancy buckets: skill-only cells, selfdoc-only cells, and jointly-occupied anchor cells, and what structural silence in each direction means.

## Why three buckets, not two

The differential curve's taxonomy comes from counting corpus membership per cell in the shared (u, v) plane. An item can be a yubiOS skill, a self-doc item, or (if a cell is jointly occupied) both kinds can sit in the same neighborhood. That yields exactly three buckets, and each one carries a different diagnosis [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`].

## Skill-only cells: capabilities the agent does not document

A skill-only cell holds yubiOS skills whose primitive coverage matches no self-doc item. The agent-being structurally silent about a capability the agent has. In the 2026-08-04 baseline there were 25 such cells at r = 0.05 [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`].

The top 5, ranked by structural uniqueness (lowest v), illustrate the range of what isolation means:

| Skill | (u, v) | Why it is isolated |
|---|---|---|
| `internal-big-picture` | (-2.121, 0.569) | Defines the 10-primitive basis itself |
| `curve-guided-rsi-self` | (-2.121, 0.569) | The offshoot that produced the self-doc corpus fit |
| `dm-verity-and-integrity` | (-2.121, 0.569) | No self-doc counterpart in the differential |
| `audit-evidence-packaging` | (-2.052, 0.519) | Bundles attestation evidence; isolated from self-doc |
| `novelty-indication` | (-2.052, 0.519) | No self-doc item discusses novelty |

[source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, MVP table]

The general pattern here matches the capability-gap literature: a capability gap is the difference between what a system currently does and what its documentation or business context requires, and it is identified by a systematic gap analysis [weight 0.50, https://www.sciencedirect.com/topics/computer-science/capability-gap]. What the differential adds is a geometric, corpus-level way to enumerate those gaps instead of interviewing owners one by one.

Research on design-implementation-documentation drift models entities in two domains (design artifacts and source code) and measures how their representations drift apart, creating a gap [weight 0.47, weak backing, https://www.inf.usi.ch/phd/raglianti/publications/Romeo2024a.pdf]. Skill-only cells are the same drift phenomenon measured at corpus scale: the implementation corpus (skills) and the description corpus (self-doc) have grown apart cell by cell.

## Selfdoc-only cells: states without skill backing

A selfdoc-only cell holds self-doc items (audit trail entries, memory sections, self-mode entries) that describe capabilities or states without a corresponding yubiOS skill. The baseline counted 50 of them, twice the skill-only count [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`].

This bucket is not a defect list. It is the reverse-facing signal: the agent documents intentions, habits, or states it has not yet crystallized into a reusable skill. In enterprise skills-management terms this is the standard skills-inventory finding, where a structured assessment documents skills and proficiency levels across an organization and then compares them to what is actually exercised [weight 0.11, weak backing, https://www.performyard.com/articles/skills-inventory-assessment]. The differential automates the comparison step.

## Jointly-occupied cells: alignment anchors

A jointly-occupied cell holds at least one item from each corpus, meaning both corpora cover the same structural primitive combination there. These cells are alignment anchors: points where the agent's capabilities and the agent's self-model already agree. The baseline found 0 at r = 0.05, which the source doc flags as an open question; relaxing to r = 0.10 would yield more anchors at the cost of precision [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`].

Zero anchors means the two corpora currently share no cell at the chosen granularity, which is consistent with the measured Jaccard overlap of 0.074 between the corpora's coverage sets (see doc 08).

## Set operations under the taxonomy

The three buckets are exactly the difference and intersection operations over two cell-occupancy sets. Set difference A \ B gives skill-only, B \ A gives selfdoc-only, and the intersection gives the anchors [weight 0.29, weak backing, https://www.geeksforgeeks.org/python/python-set-operations-union-intersection-difference-symmetric-d; weight 0.38, weak backing, https://docs.datajet.app/docs/overlap-analysis]. The value of the differential is that "membership" here is not literal name matching but structural similarity within a tolerance radius, so the intersection finds counterparts even when wording differs completely.

## Operational meaning

Each bucket routes to a different action:

- Skill-only cells route to documentation dispatch (self-archaeology producing a SELF-CHANGELOG entry or memory-file section, doc 05).
- Selfdoc-only cells route to skill acquisition prioritization (the V2 relationship, doc 09).
- Joint anchors route to verification only: they confirm alignment rather than generate work (doc 01 notes V4 scored 12/20 for exactly this reason).
