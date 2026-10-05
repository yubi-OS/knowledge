# The Land-Grab Dispatch Loop: From Isolated Cell to Self-ChangeLog Entry

**Scope:** The dispatch loop that converts each skill-only cell into a self-archaeology task returning a candidate SELF-CHANGELOG entry or memory-file section.

## The core conversion

"Land grab" names the asymmetry the differential exposes: the agent has taken territory (capabilities in its skill corpus) that its self-documentation has not settled. The use case converts each skill-only cell into a prioritized action item, and the action is always the same shape: dispatch self-archaeology focused on that skill, which returns a candidate SELF-CHANGELOG entry or memory-file section documenting the capability [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, TL;DR].

The loop per cell is:

1. Take one skill-only cell from the differential baseline, with its (u, v) coordinate and rank.
2. Dispatch a self-archaeology task scoped to the skill.
3. The task asks what the skill covers, which primitives are 0 or 1 in its coverage vector, and what self-doc item would close the gap.
4. Land the result as a structural-uniqueness SELF-CHANGELOG entry or a memory-file section.
5. Re-fit the differential and check whether the cell became anchored or moved.

## What each dispatch must produce

The MVP spec is concrete about entry contents. Each structural-uniqueness entry notes [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, MVP section]:

- The (u, v) coordinate at which the skill sits.
- The reason the skill is structurally unique: which primitives are 0 or 1 and what that means.
- A reference to the differential baseline as the audit substrate (`refs/curve-guided-rsi-and-self-differential-2026-08-04.md`).
- The implicit question: what self-doc item would close this gap?

The third item is what makes the loop auditable. An entry that cites the baseline can be traced back to the cell that spawned it, so a later re-fit can verify the entry actually moved the corpus rather than just adding text.

## Why dispatch works at this granularity

Agent platforms already treat audit trails as first-class: AWS's DevOps Agent documentation describes recording what the agent did and how to understand its impact as the two questions every operation and security review asks [weight 0.73, https://aws.amazon.com/blogs/devops/audit-trails-for-autonomous-agents-with-aws-devops-agent/]. Microsoft's Copilot Analyst frames the same idea as an agent whose data analysis steps must be inspectable [weight 0.79, https://support.microsoft.com/en-us/microsoft-365-copilot/get-started-with-analyst-in-microsoft-365-copilot]. The land-grab loop applies this to the agent's own documentation: the SELF-CHANGELOG is the audit trail, and each dispatch is one append to it.

The dispatch structure also matches standard agent-orchestration practice: decompose work into well-scoped tasks, hand each to an executor, and terminate reliably [weight 0.21, weak backing, https://antigravitylab.net/en/articles/agents/ai-agent-orchestration-design-patterns]. The reliability concern named there, loop termination, is handled here by the re-fit: a cell stays on the list until the geometry says it is closed.

## Rank order and pacing

The MVP did not dispatch all 25 skill-only cells. It took the top 5 by structural uniqueness (lowest v): `internal-big-picture`, `curve-guided-rsi-self`, `dm-verity-and-integrity`, `audit-evidence-packaging`, `novelty-indication` [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, MVP table]. Lowest v means most structurally unique: these skills sit far from anything in the self-doc corpus, so documenting them buys the largest alignment gain per entry.

This is a capability-inventory move: identify and document what exists, ordered by where the gap is widest, before spending effort elsewhere. Enterprise skills-inventory practice describes the same ordering logic, starting from a structured census and then prioritizing by gap severity [weight 0.11, weak backing, https://www.performyard.com/articles/skills-inventory-assessment].

## The loop's verification hook

Each dispatch is falsifiable. If a fresh-context check finds a self-doc item that already references the skill (the fit-artifact test, doc 07), the cell was never a real gap and the entry should not be written. If the entry is written, the next re-fit either anchors the cell (joint occupancy appears) or shows the coverage migrated to a lower-frequency region. The MVP's acceptance criterion was gap-list shrinkage of at least 30 percent in one RSI cycle [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, verification].

## Failure modes to watch

- Entries that name the skill but do not state its primitive coverage are padding; the re-fit cannot detect them.
- Dispatches written by the same context that authored the skill tend to echo its README; the fresh-context test exists to catch this.
- A re-fit that moves items between buckets without the gap list shrinking means the entries described the skill but did not overlap its coverage pattern, which is a writing problem, not a detection problem [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, changelog].
