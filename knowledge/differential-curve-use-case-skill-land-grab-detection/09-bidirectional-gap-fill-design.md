# Bidirectional Gap-Fill Design: Closing Cells from Both Directions

**Scope:** The bidirectional design: skill-only cells drive documentation dispatch while selfdoc-only cells drive skill acquisition (the V2 relationship), turning one-sided detection into a two-way fill loop.

## The asymmetry problem

A one-sided land-grab detector only asks "what skills lack documentation." The differential's 50 selfdoc-only cells, against 25 skill-only cells, show why that is half a design: twice as many cells describe documented states with no skill backing as the reverse. The source doc's winning variation explicitly combines the parent's sparse-cell detection with the offshoot's per-corpus dispatch into a bidirectional gap-fill [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, "Why this use case wins"].

The two directions do different work:

- **Forward (skill-only to documentation):** dispatch self-archaeology per cell, land a SELF-CHANGELOG entry or memory-file section. The corpus gains descriptions of capabilities that already exist.
- **Reverse (selfdoc-only to skills):** use the isolated self-doc items as a prioritized candidate list for new skill authoring. The corpus gains capabilities the agent already describes wanting or doing.

V2 (Skill Acquisition Prioritization, scored 13/20 standalone) is exactly the reverse direction. It was dropped as a standalone use case because it is downstream of V3, but its logic survives inside V3 as the second half of the loop [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`].

## Why bidirectionality matters for the metric

The Jaccard overlap of 0.074 counts shared structural coverage between the corpora [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`]. Shared coverage can be produced from either side:

- A documentation entry that mirrors a skill's coverage raises the intersection from the skill side.
- A new skill that implements what a self-doc item already describes raises it from the self-doc side.

A one-sided loop can only move the metric halfway. The MVP targets a Jaccard of at least 0.20 in one cycle; if the reverse direction is ignored, the 50 selfdoc-only cells remain permanently unanchored and the union side of the metric stays inflated.

## The reverse dispatch, concretely

The source doc's assumption test defines the reverse operation: "dispatch 5 fresh-context subagents, each on one selfdoc-only cell, asking 'does any yubiOS skill cover this capability or state?'" [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, key assumptions]. The full reverse loop then is:

1. Take one selfdoc-only cell, ranked by structural uniqueness like the forward list.
2. Verify with a fresh-context check that no existing skill covers the capability.
3. If verified, the self-doc item becomes the seed spec for a candidate skill.
4. Author the skill, which enters the next differential fit and can anchor the cell.

This mirrors standard skill-gap practice in organizations: identify gaps from an inventory, then build development paths to close them, rather than training blindly [weight 0.09, weak backing, https://wagonslearning.com/skill-gap-analysis-organization/; weight 0.21, weak backing, https://www.cegid.com/ca/en/blog/skills-mapping/]. Every web source supporting this doc scored below 0.5 in the weighting step, so these claims are weakly backed: the reverse-loop mechanics rest primarily on the source document itself.

## Design constraints on the loop

Three constraints keep the bidirectional loop honest:

- **No cross-direction padding.** A reverse dispatch that authors a skill duplicating an existing one does not close the cell; it creates a new skill-only or duplicate region. The fresh-context verification step exists to prevent this.
- **Ranking stays geometric.** Both dispatch lists are ordered by structural uniqueness (lowest v first), not by recency or ease. This keeps effort proportional to the gap's isolation [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, MVP table].
- **Both directions feed the same re-fit.** The verification gates (30 percent shrinkage, Jaccard 0.20) are corpus-level, so contributions from either direction must be visible in the same v4 fit.

## Synchronization framing and its limits

Bidirectional synchronization between two systems is a recognized collaboration pattern: changes flow both ways so neither side drifts stale [weight 0.15, weak backing, https://readme.com/resources/bidirectional-sync]. Control-theory work studies bidirectional coupling, where two units establish generalized synchronization through mutual rather than one-way influence [weight 0.41, weak backing, https://link.aps.org/doi/10.1103/m4rr-td7r]. These framings map loosely but not exactly: the differential's two corpora are not state machines that must stay identical. The goal is bounded convergence, measured by Jaccard growth and gap-list shrinkage, not full synchronization. A skill corpus will always contain operational detail that self-doc need not mirror, and self-doc will always contain intentions that never become skills.

## What stays open

The source doc leaves the reverse direction at the test stage: the MVP validated the forward direction on 5 cells and defined the reverse test design, but the reverse dispatch loop itself (steps 1 through 4 above) had not been run when the doc was written. Its first execution is part of the full improvement run (RSI Cycle 3 across all memory files) named in the verification checklist [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, verification].
