# 02. The KSR Rationale Catalog

**Scope.** The six rejection rationales from KSR v. Teleflex as organized in MPEP 2141 III: what each rationale is, which are strongest against an engineering idea, and how to anticipate a 103 rejection before it is written.

**Ground spine.** yubi-OS/yubiOS skills/novelty-indication/SKILL.md (source doc), Step 5's KSR rationale catalog. This doc supplies the legal grounding the catalog borrows.

## Where the catalog comes from

KSR International Co. v. Teleflex Inc. (550 U.S. 398, 2007) reshaped the obviousness analysis by listing common rationales for combining prior art elements that support a 103 rejection. The USPTO codified the resulting teaching into MPEP 2141 III (https://www.uspto.gov/web/offices/pac/mpep/s2141.html, jev weight 0.95), and the prima facie case requirements live in MPEP 2143, "Examples of Basic Requirements of a Prima Facie Case of Obviousness" (https://www.uspto.gov/web/offices/pac/mpep/s2143.html, jev weight 0.95). The general MPEP index (https://www.uspto.gov/web/offices/pac/mpep/index.html, jev weight 0.96) is the entry point for both. A secondary overview of the case itself is available at https://en.wikipedia.org/wiki/KSR_International_Co._v._Teleflex_Inc. (jev weight 0.40, weak backing; used only for orientation, never for a claim).

## The six rationales

The source doc lists them A through F. Each is a way to argue "a person having ordinary skill would have arrived at your combination":

- **(A) Combining prior art elements according to known methods to yield predictable results.** The most common rejection rationale. For engineering judgment this is the "all your parts are off the shelf, and off-the-shelf parts compose predictably" argument. If every layer of your idea is a known component and the composition has no surprise, rationale (A) is buildable and the idea is at risk.
- **(B) Simple substitution of one known element for another.** You replaced component X with a materially equivalent component Y. In software this maps to "you swapped the datastore/library; the architecture is unchanged."
- **(C) Use of a known technique to improve similar devices in the same way.** You applied a standard optimization to another instance of the same class of system.
- **(D) Applying a known technique to a known device ready for improvement.** The area was mature and obviously needed the improvement; filling the gap is expected work, not invention.
- **(E) "Obvious to try": choosing from a finite number of predictable solutions with a reasonable expectation of success.** The source doc flags this as the weakest and easiest to overcome. It requires showing that the space of options was small and predictable, which is rarely true in real engineering.
- **(F) Known work in one field prompting variations in another field.** A technique validated elsewhere is ported to your domain with the same function.

## How the skill uses the catalog

The source doc's Step 5 requires assessing all six rationales and states the decision rule: if a 103 rejection is buildable from rationale (A), the idea is at risk; rationale (E) is the weakest and easiest to overcome. The output template carries an "Anticipated KSR rejection rationales" section with a buildable/not-buildable answer per rationale.

Two practical notes follow from the catalog's structure:

1. The catalog is a checklist against overclaiming. "It is novel because nobody wired these exact services together" is usually rationale (A) in disguise: known components, known methods, predictable result.
2. Rationales (A) through (D) attack the combination. This is why the source doc decomposes into layers first: if only one layer is new and the other layers are known elements, the rejection rationale is built from the known layers plus the new one, and the question becomes whether the combination is predictable.

## The prima facie case

MPEP 2143 gives the USPTO's examples of what a prima facie case of obviousness requires (https://www.uspto.gov/web/offices/pac/mpep/s2143.html, jev weight 0.95). For engineering purposes the takeaway is that a rejection needs specifics: which references, which elements, which rationale. Mirroring that in the verdict document is why the source doc requires the verdict to cite the specific prior art that drove it. A verdict of NOVEL or NOT-NOVEL without a citation is not a verdict.

## Related material and drift

The European analog, inventive step, covers the same ground from a different angle; an overview at https://handwiki.org/wiki/Social:Inventive_step_and_non-obviousness (jev weight 0.17, weak) is included in the dig only as a cross-reference and is not cited for any claim. The MPEP sections above are the operative text; if the MPEP is ever restructured, re-check the two section URLs in this doc before relying on the rationale letters.
