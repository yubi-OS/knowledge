# 04 Axis 3: Architecture

Scope: the third review axis, whether the change fits the system's design, plus the complexity-reduction tests the skill applies.

Grounding spine: `yubi-OS/yubiOS skills/code-review-and-quality/SKILL.md` (source doc). External mechanisms are cited with their jev weight.

## What the axis asks

The source doc opens with a single question: does the change fit the system's design? (source doc). It then lists 6 checks (source doc):

1. Does it follow existing patterns or introduce a new one? If new, is it justified?
2. Does it maintain clean module boundaries?
3. Is there code duplication that should be shared?
4. Are dependencies flowing in the right direction, with no circular dependencies?
5. Is the abstraction level appropriate, neither over-engineered nor too coupled?
6. Does this refactor reduce complexity or just relocate it?

The dependency-direction check is backed by a large body of software design work. Fowler's treatment of coupling separates it from cohesion and shows why changes that increase coupling between modules are the expensive kind of debt: they propagate change across boundaries (noul 0.74, https://martinfowler.com/ieeeSoftware/coupling.pdf). Cohesion, the companion property, describes how well a module's elements belong together; low-cohesion modules spread one concept across several (noul 0.22, weak, https://deviq.com/terms/cohesion/). Refactoring, in the general sense of restructuring code without changing behavior, is the remedy the axis licenses (noul 0.35, weak, https://en.wikipedia.org/wiki/Code_refactoring).

## The complexity-relocation test

The source doc bolds the axis's most distinctive standard: does this refactor reduce complexity or just relocate it? The test is to count the concepts a reader must hold to follow the change. If a "cleaner" version leaves that count unchanged, it is not cleaner (source doc). The skill prefers the restructuring that makes whole branches, modes, or layers disappear over one that re-centralizes the same logic, and prefers deleting an abstraction to polishing it (source doc).

This test is what makes the architecture axis different from taste. A reviewer does not have to argue style; they count concepts before and after.

## Feature logic and shared modules

Two bolded checks police boundary violations (source doc):

1. Is feature-specific logic leaking into a shared or general-purpose module? Keep logic in its owning layer, reuse the existing canonical helper instead of a near-duplicate, and do not normalize architectural drift.
2. Are type boundaries explicit? Question gratuitous `any`, `unknown`, optional types, casts, and silent fallbacks that paper over an unclear invariant. Making the boundary explicit often makes the surrounding control flow simpler.

The checklist carries these into the merge gate: the reviewer confirms no feature logic sits in shared modules and the file stays within a healthy size (source doc).

## Presumptive blockers

The verification section names 5 presumptive blockers, each of which surfaces as a proposed simpler design and escalates to Required only when the change actively makes structure worse (source doc):

1. A refactor that relocates complexity instead of reducing it.
2. A change that pushes a file past the size boundary with no decomposition.
3. Feature logic added to a shared module.
4. A near-duplicate of an existing canonical helper.
5. A silent fallback that hides an unclear invariant.

The word presumptive is doing work here: these findings start as proposals, not demands. The change earns a Required comment only when it actively worsens structure. That is the approval standard from doc 01 applied to architecture findings.

## Red flags

The red-flag list repeats the axis in negative form (source doc): a refactor that moves code around without reducing the number of concepts a reader must hold, a change that grows an already-large file instead of decomposing it, new conditionals scattered into unrelated code paths, and a bespoke helper that duplicates an existing canonical one. Each maps to one of the checks above, so the axis is closed: a reviewer can walk the checks in one direction and the red flags in the other and land on the same findings.
