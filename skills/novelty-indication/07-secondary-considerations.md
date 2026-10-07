# 07. Secondary Considerations

**Scope.** The fourth Graham inquiry: objective indicia of non-obviousness (long-felt need, failure of others, unexpected results), why they need evidence, and their role in the skill's BORDERLINE verdict.

**Ground spine.** yubi-OS/yubiOS skills/novelty-indication/SKILL.md (source doc), Step 5 factor 4.

## What they are

Secondary considerations, also called objective indicia, are factual evidence of non-obviousness that sits outside the primary prior-art comparison. The standard set is: commercial success, long-felt but unsolved need, failure of others, unexpected results, and expressions of admiration or copying by others in the field.

The primary-source grounding for the evidentiary side is MPEP 716, "Affidavits or Declarations Under 37 CFR 1.132 and Other Evidence of Patentability" (https://www.uspto.gov/web/offices/pac/mpep/s716.html, jev weight 0.94). That section governs how such evidence is actually submitted and what it must show, which is why the evidence requirement is not a formality: the indicia are a recognized category of proof, and proof has a format.

## Why the evidence requirement is strict in this skill

The source doc's Step 5 adds a constraint the patent framework allows but engineering practice needs: secondary considerations are applied "only if you have evidence". The output template's section is titled "Secondary considerations" and its instruction line is "Long-felt need, failure of others, etc., only if evidence exists".

The reason is that the indicia are the easiest place to fake a verdict. "People have wanted this for years" and "everyone else failed at it" are exactly the claims teams assert without checking. The verification checklist enforces this: factor D is addressed only when evidence exists, and an unevidenced long-felt-need claim should not appear in the report at all.

## The three indicia the skill names

1. **Long-felt need.** The problem has been recognized for a long time and remained unsolved. Evidence looks like dated documentation: a backlog of issues, forum threads spanning years, repeated feature requests, or the absence of any implementation in the ecosystem over a measurable period.
2. **Failure of others.** Others attempted the same thing and failed. Evidence looks like abandoned projects, postmortems, changelog entries for withdrawn features, or documented attempts with stated reasons for abandonment. In a project context, internal evidence counts first (doc 04): a reverted PR or a closed issue explaining why the attempt died is the strongest form.
3. **Unexpected results.** The combination produces results beyond what the known elements predict. Evidence looks like measurements: benchmarks, error rates, behavior that contradicts the expectation a skilled practitioner would hold.

Litigation practice treats these indicia as part of a totality-of-the-evidence assessment rather than standalone proof; a law review treatment is available at https://nyulawreview.org/wp-content/uploads/2018/08/NYULawReview-86-6-Thomas.pdf (jev weight 0.54) and a practitioner overview at https://www.finnegan.com/en/insights/articles/secondary-considerations-in-patent-validity-challenges-understanding-their-role-in-ipr-and-district-court-litigation.html (jev weight 0.68). Both are legal-practice sources used here only for the "totality" framing, not for any engineering claim. Weak-weight dig results in this area (https://www.jdsupra.com/legalnews/objective-indicia-of-nonobviousness-3965545/, jev weight 0.22; https://www.invention-protection.com/obviousness-and-secondary-considerations/, jev weight 0.13) are recorded in the research archive and cited here only as examples of what not to rely on.

## The role in BORDERLINE verdicts

The source doc's verdict table gives secondary considerations a specific job: BORDERLINE means "layers are present but a 103 rejection is buildable; worth expanding ONLY if secondary considerations (long-felt need, etc.) can be cited". This makes the indicia the deciding factor for the hardest verdict class.

The interaction is precise:

- A buildable rationale (A) rejection (doc 02) makes the primary analysis lean NOT-NOVEL.
- Evidence-backed indicia can rescue the idea into BORDERLINE-with-evidence, which routes downstream to `idea-refine` or `ideate-solo`.
- A BORDERLINE without evidence routes downstream to `idea-kill` instead (source doc, Interaction with Other Skills).

Over-using BORDERLINE is on the source doc's anti-pattern list for the same reason the evidence rule exists: BORDERLINE is for cases where both NOVEL and NOT-NOVEL are defensible, and without evidence on either side the defensible answer is usually NOT-NOVEL.

## Practical rule

If you cannot point at a dated artifact (issue, postmortem, benchmark, timeline) that demonstrates the indicium, the section stays empty and the verdict is decided on the primary factors alone. An empty "Secondary considerations" section is a complete answer; a padded one is a red flag.
