# 06 The One Pager Artifact

Scope: Phase 3's markdown one-pager, its fixed sections, why the Not Doing list is the most valuable part, and the skill's save-confirmation rule.

Grounding spine: yubi-OS/yubiOS skills/idea-refine/SKILL.md (source doc).

## The template

The final output is a markdown one-pager with a fixed skeleton:

- **Problem Statement:** a one-sentence "How Might We" framing, carried over from Phase 1.
- **Recommended Direction:** the chosen direction and why, capped at 2 to 3 paragraphs.
- **Key Assumptions to Validate:** checkbox items, each with a test strategy.
- **MVP Scope:** "The minimum version that tests the core assumption. What's in, what's out."
- **Not Doing (and Why):** items with reasons.
- **Open Questions:** what needs answering before building.

The cap on the recommended direction (2 to 3 paragraphs) is a compression test: if the direction cannot be argued in 3 paragraphs, it is not yet sharp.

## Why an artifact and not a conversation

The source doc calls the output "a concrete artifact, a markdown one-pager that moves work forward." The verification checklist makes this a pass/fail gate: "The output is a concrete artifact (markdown one-pager), not just conversation." Ideation sessions that end in vibes fail this gate.

The one-pager form has a strong external analogue. Amazon's working-backwards process has teams write the press release and FAQ before building the product: "Start with the customer and work backwards, harder than it sounds but a clear path to innovating and delighting customers, a useful working backwards tool: writing the press release and FAQ before you build the product," a process behind "most of Amazon's major products and initiatives" (https://workingbackwards.com/resources/working-backwards-pr-faq/, jev weight 0.80; https://workingbackwards.com/concepts/working-backwards-pr-faq-process/, jev weight 0.65). The kinship is exact: both force the team to write the finished story first, so the gaps show up before code does.

## The Not Doing list

The source doc is emphatic: "The 'Not Doing' list is arguably the most valuable part. Focus is about saying no to good ideas. Make the trade-offs explicit." Every entry must carry a reason ("[Thing 1], [reason]"), because a no without a why invites relitigating.

Strategy practice arrives at the same place from the organizational side: "organizations that build discipline and focus outperform by prioritizing what truly matters," and the strategic move is often "No, not now" rather than an absolute no (https://balancedscorecard.org/blog/the-strategic-power-of-no/, jev weight 0.26, weak backing). The Not Doing list is where the skill institutionalizes that discipline at project scale.

## One-page scoping discipline

The MVP scope section inherits the one-pager's compression. Practitioner MVP templates keep the whole scope on a single page with the same anatomy: "a one-page scope worksheet: one job statement, three must-have features, one success metric, and an explicit cut list" (https://capiller.com/blog/minimum-viable-product-template, jev weight 0.29, weak backing), or "problem statement, user stories, feature prioritization, and success metrics" (https://theordinarycompany.io/blog/mvp-scope-template/, jev weight 0.39, weak backing). The skill's "what's in, what's out" instruction is that cut list.

## Saving is user-gated

The skill does not write the file unilaterally. It asks: "Ask the user if they'd like to save this to docs/ideas/[idea-name].md (or a location of their choosing). Only save if they confirm." The verification checklist mirrors it: "The user confirmed the final direction before any implementation work." Two gates protect the user's ownership: confirmation of the direction, and confirmation of the save location. This also means the one-pager's default home (docs/ideas/) is a suggestion, not a mandate.

## Open Questions as the handoff

The final section records what remains unknown "before building." Combined with the assumptions checkboxes, it makes the one-pager a work order: assumptions to test, questions to answer, a scope boundary, and an explicit set of refusals. The next session or teammate can pick it up without re-deriving the reasoning.
