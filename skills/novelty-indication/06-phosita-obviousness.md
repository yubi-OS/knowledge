# 06. Level of Ordinary Skill (PHOSITA)

**Scope.** The third Graham inquiry: the person having ordinary skill in the art, whether a skilled practitioner could combine the known elements, and the obvious-to-try standard.

**Ground spine.** yubi-OS/yubiOS skills/novelty-indication/SKILL.md (source doc), Step 5 factor 3.

## The construct

The level of ordinary skill in the pertinent art is one of the factual Graham factors (doc 01, factor 3). The MPEP's prima facie obviousness guidance sets out how the determination is made in MPEP 2143 (https://www.uspto.gov/web/offices/pac/mpep/s2143.html, jev weight 0.95): the level of skill is resolved with evidence such as the type of problems encountered in the art, prior solutions to those problems, the speed of innovation, the sophistication of the technology, and the education and experience of workers in the field.

For an engineering audience the translation is direct. The question the source doc asks is: "Could a skilled practitioner combine the known elements?" In a project context, the skilled practitioner is roughly "a competent engineer already working in this codebase and its ecosystem", not an imaginary expert. If a senior teammate could assemble the combination from existing pieces in an afternoon, the combination is obvious at that skill level, and a NOVEL verdict must say what prevents the assembly.

## Why the construct matters to verdicts

The PHOSITA question is the hinge between the prior-art scan and the verdict:

- If the scan finds all the elements (mechanism, trigger, policy) in the prior art, the verdict turns on whether combining them was predictable at ordinary skill. That is rationale (A) territory in the KSR catalog (doc 02), and predictable combination means NOT-NOVEL.
- If the scan finds the elements but the combination is not predictable, the idea is genuinely in NOVEL or BORDERLINE territory, and the verdict document must articulate why the combination is not obvious at the skill level of the team.

The output template's "Level of ordinary skill" section asks exactly one thing: could a PHOSITA in this area combine the known elements? A yes answer that is not rebutted by unexpected results pushes the verdict toward NOT-NOVEL.

## The obvious-to-try standard

The obvious-to-try doctrine asks whether a person of ordinary skill would have tried the claimed combination with a reasonable expectation of success, choosing among a finite set of predictable options. This is rationale (E) in the source doc's KSR catalog, and the source doc's own note is the practical takeaway: (E) is "the weakest and easiest to overcome". Weak because it requires showing the option space was small and predictable, which real engineering almost never is; easy to overcome because the rebuttal is evidence of an unpredictably large or unknown option space.

A weak-weight tertiary source on the standard exists in the dig (https://www.linkedin.com/pulse/obvious-try-standard-nisha-wadhwa-m3caf, jev weight 0.09); it is recorded in the research archive and cited here only as an example of the low-quality material that fills this topic. The operative text remains MPEP 2143 and the rationale catalog in MPEP 2141 III.

## Calibration traps

Two calibration traps are worth naming:

1. **Skill-level inflation.** Assuming the "ordinary" practitioner is a world expert makes everything look obvious; the MPEP factors (problem types, prior solutions, education level of the field) are the corrective (https://www.uspto.gov/web/offices/pac/mpep/s2143.html, jev weight 0.95).
2. **Skill-level deflation.** Assuming the practitioner is a novice makes everything look novel. The source doc's bias toward skepticism exists partly to offset this: the default is "probably not novel", and the verdict must earn the NOVEL case against the skill level that actually exists on the team.

## Where this sits in the output

The source doc's verification checklist requires "Graham factors A, B, C addressed". Factor C is this construct. The verdict template's "Level of ordinary skill" section is where the answer lives, and like every other section, it must cite what was checked.
