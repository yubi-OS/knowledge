# 07 - Calibration gate, when to use, and loading order

Scope: the 3-question calibration gate that decides whether the 4-source lens applies, the when-to-use and when-not-to-use lists, the loading order, and the value-add table that separates this skill from 0pointer-mastery.

Ground source: yubi-OS/yubiOS skills/internal-big-picture/SKILL.md (source doc). This is an internal-record subtopic, no dig.

## The calibration gate: 3 questions in order

The lens is overhead. Invoking it for a single-domain question adds noise without value. Ask these 3 questions in order; if any returns YES, the lens is right; if all return NO, fall back to a domain-specific skill (source doc):

1. **Two-or-more-source check.** Does the question explicitly touch 2 or more of the four big-picture domains? If only one domain is in play, use the domain skill (0pointer-mastery, security-and-hardening, source-driven-development for citation work). The 4-source lens adds noise without value there.
2. **Would removing a POV change the answer?** If yes, the answer depends on the cross-domain view and this is the right lens. If no, meaning all four sources would agree, the question is a single-domain question with cross-domain appearance: pick the most-specific domain skill and use it.
3. **Is the user asking for synthesis or for a verdict?** If synthesis ("what would each source say about X?"), invoke the lens. If a verdict ("is this design decision good?"), use idea-kill for the verdict and only invoke the lens to justify the verdict against the four sources.

## When to use

Per the source doc, use the skill when:

- A yubiOS question touches 2 or more of {security, compliance, doctrine, OS architecture}.
- The agent needs the full picture before deciding, that is before writing an ADR, a ref doc, or a major code change.
- A new skill, ADR, or feature needs placement in the existing landscape, for example "does this duplicate what 0pointer-mastery already covers?".
- A design decision needs sanity-checking against all four sources' vocabulary before committing.
- A ref doc or docs/ page needs to cite the right primary source for a claim.

## When NOT to use

- The question is purely within one domain; use that domain's skill.
- The agent is about to write framework-specific code; use source-driven-development, where citation is the discipline.
- The question is "what is novel about this?"; use novelty-indication.
- The question is "what hasn't been tried?"; use prior-art-search.
- A small bug fix or one-line change; the lens is overhead for atomic scope.
- The user explicitly wants speed over verification.

## Loading order

When the skill is needed, load in this order (source doc):

0. **recursive-self-improvement** first if you are upgrading or auditing this skill: it owns the 3-cycle fixpoint loop, js-yaml frontmatter validation, and the per-cycle changelog format. Loading it before editing is mandatory for self-mode, because cycle 2+ re-introduces author bias if skipped.
1. This skill (canonical model plus mapping table).
2. 0pointer-mastery, the dominant source for yubiOS design vocabulary.
3. The source-grounded primary URL(s) for the question at hand, per source-driven-development.
4. negative-skill-space, if the question is "what does this NOT cover?".
5. prior-art-search, if the question is "what has been tried?".

Step 3 must not be skipped: the 10-primitive model is a lens, not a citation; every claim still cites the primary source (source doc).

## Value-add versus 0pointer-mastery

Both are big-picture skills but they answer different questions; loading both is correct for the question types below, loading either alone is insufficient (source doc):

| Question type | 0pointer-mastery | internal-big-picture | Both? |
|---|---|---|---|
| "Why does yubiOS use dm-verity on /usr?" (systemd-architecture deep dive) | primary | passive | No: 0pointer-mastery alone suffices |
| "How would CISA ZTMM v2.0 react to yubiOS's boot chain design?" (cross-domain sanity check) | background | primary | No: internal-big-picture alone suffices |
| "Does this new design decision duplicate any existing yubiOS pattern?" | for the systemd-domain placement | for the cross-domain placement | Yes: both required |
| "Where in the existing skill/ADR landscape does this belong?" (multi-domain placement) | background | primary (the mapping table is the lookup) | No: internal-big-picture alone suffices |
| "Audit whether a yubiOS design goal is met" | primary | out of scope | No: never load internal-big-picture for this |

What internal-big-picture adds over 0pointer-mastery: the cross-domain vocabulary layer (what Chronicle, HITRUST, CISA, and systemd each call the same concept, where they diverge), the source-version pinning that 0pointer-mastery does not track, and the how-would-each-source-react template. It does not re-derive 0pointer content; it points at 0pointer-mastery for any systemd-deep dive. The corresponding anti-pattern is using internal-big-picture as a 0pointer-mastery substitute when the question is systemd-internal: "should I use sysext or portable service?" belongs to 0pointer-mastery, not here (source doc).
