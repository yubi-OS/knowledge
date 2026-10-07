# 04. Internal Prior Art First

**Scope.** Step 3 of the source doc: the project's own ADRs, PRs, Linear issues, and refs/ docs are the highest-signal prior art, and they are checked before any external scan.

**Ground spine.** yubi-OS/yubiOS skills/novelty-indication/SKILL.md (source doc).

## Why internal first

The source doc's anti-pattern list leads with this: skipping internal prior art is listed first because "a non-trivial fraction of 'novel' ideas in yubiOS are already covered by an existing ADR". Internal artifacts are higher-signal than external search results for one specific question: what has this project already decided. An external scan cannot tell you that a decision was already made internally; it can only tell you the general landscape.

The decision rule that follows (source doc, Step 3): if internal prior art covers the mechanism layer, the new contribution must be in the trigger or policy layer to be worth pursuing.

## What to search

The source doc enumerates the internal surfaces, in order:

- `refs/*.md` on the yubiOS repo, especially anything matching the topic. The refs/ archive is the project's deep-research record; a topic covered there has usually been through analysis already.
- `docs/ADR.md` for Architecture Decision Records. An ADR is the canonical record of a decided architectural choice; the ADR project itself defines them as short text documents capturing an important architectural decision (https://github.com/architecture-decision-record/architecture-decision-record, jev weight 0.60; the ADR site at https://adr.github.io/ carries the same index, jev weight 0.47, weak).
- `docs/FUTURE.md` for planned-but-not-decided work. Planned work is not prior art for novelty, but it is a collision signal: someone is already headed there.
- Linear team OMNI-AGENT issues matching the topic.
- PRs in `yubi-OS/yubiOS` with relevant keywords.

## How to record what you find

The output template's "Internal prior art (cited)" section requires entries in the form `[ADR-NNN / PR #NN / refs/<file>.md / OMN-NNN] plus what it covers`. Two rules from the source doc apply:

1. **Cite or do not claim.** "It's novel" without a citation is not a verdict. Symmetrically, "it's already covered" without a citation is also not a verdict. Both directions need the specific artifact.
2. **Explain conflicts.** A verdict that conflicts with an existing ADR and does not explain the conflict is on the red-flags list. If your analysis says the mechanism is new but ADR-031 covers it, the verdict document must reconcile that.

## The duplicate-detection pattern

The workflow is the same pattern GitHub codifies for issues: marking an issue or pull request as a duplicate requires an explicit cross-reference to the duplicate (https://docs.github.com/en/issues/tracking-your-work-with-issues/administering-issues/marking-issues-or-pull-requests-as-a-duplicate, jev weight 0.95). The source doc's NOT-NOVEL action follows the same shape: "file under existing work; reference the covering ADR/PR/issue". A duplicate verdict without the reference is incomplete.

## Why this saves the most time

The source doc states the ordering as a cost argument: internal-first "saves the most time". The mechanism is cheap. Searching the repo and the issue tracker is minutes, while an external prior-art scan is a separate skill invocation (`prior-art-search`). When internal coverage answers the question, the external scan never runs. When it does not, the internal citations still sharpen the external query set: you now know which layers are already decided locally and only need external coverage for the rest.

## What internal prior art is not

Internal decisions are engineering authority, not patent prior art in the legal sense, and the skill does not pretend otherwise (source doc: this is engineering judgment, not legal opinion). The internal check answers "is this worth expanding in this project", which is the question the skill exists for. Patentability questions are out of scope entirely.

## Checklist tie-in

The source doc's verification checklist requires "Internal prior art checked first (ADRs, PRs, Linear issues, refs/)", and the red flags list opens with "a verdict with no internal-prior-art check". Both exist because the check is the highest-signal step and the easiest one to skip when the idea feels obviously new.
