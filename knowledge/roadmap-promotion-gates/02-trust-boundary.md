# Trust boundary: who decides, who enforces, what may fail

Scope: Decomposing each claim into the component that decides, the component that enforces, and the components that may be compromised without falsifying the claim.

## The gate question

The promotion gates document (yubiOS refs, roadmap-promotion-gates, 2026-07-17) requires every promoted item to answer: "Which component decides, which component enforces, and which component can be compromised without breaking the claim?" This is a three way decomposition. It is not satisfied by naming one trusted component; it requires separating the decision function from the enforcement function and then stating an explicit tolerance for compromise.

## The published model: PDP and PEP

This decomposition has a standard name in security architecture. NIST SP 800-207, the Zero Trust Architecture standard, defines the ZTA core as a policy decision point (PDP) containing a policy engine and a policy administrator, plus one or more policy enforcement points (PEPs) (https://pages.nist.gov/zero-trust-architecture/VolumeC/index.html, jev weight 0.95, authoritative). NIST's own implementation instructions present this as the canonical component split for access decisions: something decides, something else enforces, and the two are distinct components.

A secondary survey of the same standard confirms the three logical components, adding policy information points (PIPs) as the sources a PDP consults (https://www.intersecinc.com/blogs/the-logical-components-of-zero-trust, jev weight 0.34, weak backing). A pattern catalog entry maps the zero trust pattern to 51 NIST 800-53 controls across identity, device, network, application, and data pillars, reinforcing that the decision/enforcement split is auditable, not just conceptual (https://www.opensecurityarchitecture.org/patterns/sp-029/, jev weight 0.70, authoritative).

The international standard ISO/IEC 29146 frames the same split through an enterprise centric implementation model in which PDP and PEP live within a defined trust relationship (https://dsr.gematik.solutions/docs/concepts/pdp/, jev weight 0.30, weak backing).

## Why the third clause matters: explicit compromise tolerance

The gate's third clause, "which component can be compromised without breaking the claim", is the part generic decision/enforcement language omits. The yubiOS gate requires the author to state, up front, which component's failure would falsify the promoted claim. That converts an implicit assumption into a checkable assertion.

One practitioner analysis states the underlying hazard directly: every enforcement point in a request path is a dependency, and what happens when the decision point is unreachable is an architecture decision that must be made deliberately (https://www.hackrange.com/learn/zero-trust/policy-enforcement.html, jev weight 0.22, weak backing). The same reasoning inverted is what the gate asks for: if component X fails or is compromised, does the claim still hold? The answer must be written down at promotion time, because after implementation the answer is always reconstructed favorably.

## Mapping to the source doc's applications

The applications recorded in the promotion gates document show the gate operating on real items (yubiOS refs, roadmap-promotion-gates, 2026-07-17):

- SecTime, a secure time effort, was promoted to research/design only, with hardware proof still required before production claims. The trust boundary there is stark: a time claim depends on a clock source, and a compromised or wrong clock source breaks the claim, so production claims wait.
- Frost, a kernel effort, was promoted to research/design only; kernel prototype and RK hardware recovery evidence remain required. A kernel claim whose enforcement component is the kernel itself cannot be validated until the prototype exists.
- The OpenWrt deception LAN item was promoted to package/proof design only; the VM or spare router build and packet capture remain open. The proof design (what would decide and enforce the deception behavior) can be written before the enforcement hardware exists.

In each case, promotion happened at the layer where deciding is possible, and enforcement claims stayed behind the gate until the enforcing component could be exercised.

## Practical reading for authors

When filling the trust boundary field, three answers are required, not one:

1. Decider: the component that holds the policy or logic that the claim depends on.
2. Enforcer: the component whose behavior must actually match the claim.
3. Compromise tolerance: the named component(s) whose failure or compromise does not falsify the claim, stated explicitly.

If the third answer is "none", that is a valid answer, and it usually means the item's recovery plan (a separate gate) carries the full weight, because nothing degrades gracefully.
