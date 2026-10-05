# 06 Novelty verdict methodology: Graham, KSR, and the layer decomposition

Scope: the legal-inference framework the synthesis verdict uses, Graham v. John Deere factors, the KSR rationales for combining prior art, level of ordinary skill, and secondary considerations, and how they produce a BORDERLINE verdict for the cutover policy layer.

## The Graham framework as the verdict skeleton

The obviousness analysis rests on the Graham test: the scope and content of the prior art, the level of ordinary skill in the art, the differences between the claimed subject matter and the prior art, and secondary considerations such as commercial success (weight 0.14, https://www.upcounsel.com/patent-obviousness, weak backing). The USPTO's examination guidelines formalize this: a finding as to the level of ordinary skill may be used as a partial basis for resolving obviousness, and the person of ordinary skill in the art (PHOSITA) is a hypothetical person presumed to have known the relevant art at the relevant time (weight 0.87, https://www.uspto.gov/web/offices/pac/mpep/s2141.html, and weight 0.93 for the fuller MPEP section 2141 text).

The synthesis applies this as a layer decomposition: mechanism, trigger, policy. Each layer gets its own Graham verdict because the prior-art scope differs per layer. That structure is the analysis's core move; the underlying factors are the standard ones.

## KSR rationales: why the verdict lands at BORDERLINE

The USPTO's post-KSR guidance identifies a set of rationales that can support an obviousness rejection, and examiners cite one or more of them when making a 103 rejection (weight 0.28, https://patentbrief.org/ksr-obviousness, weak backing). KSR itself rejected the rigid TSM (teaching-suggestion-motivation) test in favor of a flexible approach, and recognized "obvious to try" as a valid path, with secondary considerations available to rebut (weight 0.13, https://patentbrief.org/motivation-to-combine, weak backing).

The MPEP anchors the motivation-to-combine question directly: courts have held that the prior art as a whole can suggest the desirability of a combination, and that motivation to combine need not be supported by a finding that the prior art itself suggested the specific arrangement (weight 0.77, https://www.uspto.gov/web/offices/pac/mpep/s2143.html).

Applied to the synthesis: the mechanism layer (vfio-user mediation plus bootc plus attestation components) is established by prior art individually; the trigger layer (digest evaluation at libvirt launch rather than K8s admission) is a repositioning of a known technique; the policy layer (a single signed object binding digest, measurement, and GPU binding claim, enforced TEE-free) is the only layer where the dig found no direct prior art (doc 05). Because rationales for combining established elements apply to the mechanism and trigger layers, the verdict is BORDERLINE: genuine novelty confined to the policy layer, with combination risk high.

## Secondary considerations: the deciding input

The synthesis's kill criteria hinge on secondary considerations, and the legal literature explains why. Secondary considerations, real-world indicators such as commercial success, industry praise, copying, and long-felt need, often play a pivotal role in defending validity when a patent faces a 103 challenge (weight 0.43, https://www.finnegan.com/en/insights/articles/secondary-considerations-in-patent-validity-challenges-understanding-their-role-in-ipr-and-district-court-litigation.html, weak backing). Practitioner guidance lists the standard objective indicia: commercial success, long-felt but unsolved need, failure of others, and copying (weight 0.09, https://outsideipcounsel.com/guides/patent-obviousness-35-usc-103/, weak backing). Commentary notes that some secondary-consideration factors, such as simultaneous invention, are seldom used in practice (weight 0.67, https://patentlyo.com/patent/2008/07/secondary-consi.html).

The synthesis's rule follows directly: if no concrete demand, no regulator requirement, and no documented supply-chain attack can be cited for this specific slice, the verdict downgrades from BORDERLINE to NOT-NOVEL, because the combination risk is then unrebutted.

## Honest limits of the methodology

Three limits are visible in the sources:

1. The KSR rationale count differs by source: the synthesis uses 6 rationales (A through F), one practitioner source describes 5 (weight 0.13, weak), another 7 (weight 0.28, weak). The MPEP itself is authoritative on the underlying analysis but the kept snippets do not fix a canonical count, so this corpus treats the count as a presentation choice.
2. The dig supports the legal framework but not the technical prior-art mapping; that mapping comes from docs 01 through 05.
3. Weak-backing sources carry the rationale summaries. The MPEP sections (weights 0.87 to 0.93) anchor the framework; anything cited only from patent-blogs should be read as orientation, not authority.

## Verdict-shaped takeaway

The methodology yields the verdict the source topic reports: NOT NOVEL at the mechanism layer, BORDERLINE at the trigger layer, NOVEL at the policy layer, with 103 combination risk high and the whole verdict contingent on secondary considerations that no kept source can supply. That contingency is the actionable output: novelty claims for this slice are only worth expanding if real-world demand evidence exists.
