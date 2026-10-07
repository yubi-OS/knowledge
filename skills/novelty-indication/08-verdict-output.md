# 08. Verdicts, Output Document, and Verification

**Scope.** The verdict taxonomy (NOVEL / BORDERLINE / NOT-NOVEL), the output document template, the anti-patterns and red flags, and the verification checklist. This is the internal-record subtopic: grounded entirely in the source doc, no external dig.

**Ground spine.** yubi-OS/yubiOS skills/novelty-indication/SKILL.md (source doc). Internal-record subtopic, no dig.

## The three verdicts

The source doc's Step 6 defines exactly three verdicts, each with a meaning and a required action:

| Verdict | Meaning | Action |
|---|---|---|
| NOVEL | At least one layer is genuinely new, not obvious from prior art | Worth expanding; proceed to `idea-refine` or `ideate-solo` |
| BORDERLINE | Layers are present but a 103 rejection is buildable | Worth expanding ONLY if secondary considerations can be cited |
| NOT-NOVEL | All layers covered by prior art (internal or external) | File under existing work; reference the covering ADR/PR/issue |

Two structural rules govern the verdict:

1. **Always cite the specific prior art that drove the verdict.** The source doc is explicit: "It's novel" without a citation is not a verdict. This applies symmetrically to NOT-NOVEL, whose action is a reference to the covering artifact.
2. **Do not over-use BORDERLINE.** It exists for cases where both NOVEL and NOT-NOVEL are defensible. If it is clearly one or the other, say so. A BORDERLINE without evidence for secondary considerations routes to `idea-kill` instead of to expansion.

The engineering versus legal boundary is repeated at the verdict level: the verdict answers "is this worth expanding?", not "is this patentable?".

## The output document

The source doc's template fixes the structure of every novelty indication:

1. Header: idea name, date, verdict, and the source line ("novelty-indication skill (Graham v. John Deere adapted)").
2. Problem statement: the one sentence from Step 1.
3. Layers: three subsections (Mechanism, Trigger, Policy), each stating what the layer does and the prior art that covers it, internal first.
4. Internal prior art (cited): `[ADR-NNN / PR #NN / refs/<file>.md / OMN-NNN]` plus what it covers.
5. External prior art (cited): `[Source name + URL]` plus what it covers.
6. Graham factor analysis: four subsections (scope and content of prior art; differences from prior art, by layer; level of ordinary skill; secondary considerations).
7. Anticipated KSR rejection rationales: one line per rationale (A) through (F) with buildable or not.
8. Verdict: one of the three, with a one-sentence reason.
9. Recommended next step: a specific action naming which ADR to extend, which Linear issue to file, or which skill to invoke.

## Anti-patterns

The source doc lists seven; they are the failure modes of the whole skill, worth restating compactly:

- Skipping internal prior art (the highest-signal check).
- Confident verdict without citation.
- Treating mechanism novelty as application novelty.
- Inventing prior art when a search returns nothing.
- Over-using BORDERLINE.
- Skipping the trigger/policy decomposition.
- Conflating engineering novelty with patentability.

## Red flags

The red-flags list is the review checklist for someone reading someone else's novelty indication:

- A verdict with no internal-prior-art check.
- "NOVEL" without a single citation.
- Treating the user's framing as the layer decomposition.
- Inventing external prior art to support a desired verdict.
- Skipping the KSR rejection rationales.
- A verdict that conflicts with an existing ADR and does not explain the conflict.

## Loading constraints

The skill is read-only: it produces a verdict document and does not modify external systems. It is cited (every prior-art claim has a URL or file path behind it), honest (default to skepticism, surface the novel layer, do not invent novelty), and bounded (one pass, no recursion beyond Step 4).

## Verification checklist

After applying the skill, the source doc requires all of:

- [ ] Problem statement is one sentence
- [ ] Layers split into mechanism / trigger / policy
- [ ] Internal prior art checked first (ADRs, PRs, Linear issues, refs/)
- [ ] External prior art cited with URLs
- [ ] Graham factors A, B, C addressed (D only if evidence)
- [ ] KSR rejection rationales A through F assessed
- [ ] Verdict is one of NOVEL / BORDERLINE / NOT-NOVEL
- [ ] Verdict cites at least one specific prior-art source
- [ ] Recommended next step is concrete

The checklist is the contract between the analysis docs (01 through 07) and the shipped artifact: every line traces to a step of the framework, and an artifact that fails any line is not a novelty indication.
