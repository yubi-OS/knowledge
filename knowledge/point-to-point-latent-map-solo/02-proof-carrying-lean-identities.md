# 02 Proof-carrying Lean identities: what the theorem file certifies and what it refuses to

Scope: the proof-carrying constraint: Lean-checked identities (atom delta nonnegativity, composition, stationary law) may be enforced as runtime assertions but never recast as measurement claims.

## Proof-carrying code as the model

The source record's central constraint is named after Necula's proof-carrying code. In PCC, a host system can determine with certainty that it is safe to execute a program supplied in binary form by checking a formal proof that accompanies the executable (https://dl.acm.org/doi/10.1145/263712 at https://dl.acm.org/doi/10.1145/263699.263712, weight 0.77). The canonical statement of the mechanism is Necula's POPL 1997 paper (https://www.cs.tufts.edu/comp/150CMP/papers/necula97pcc.pdf, weight 0.58), and the term now has a stable encyclopedic definition: software that lets a host verify properties of an application via a formal proof accompanying the executable (https://en.wikipedia.org/wiki/Proof-Carrying_Code, weight 0.65). A reference-encyclopedia entry records the same mechanism with the original citation (https://link.springer.com/rwe/10.1007/978-3-030-71522-9_864, weight 0.83).

The design in the record applies this shape to statistics rather than memory safety: each edge in the point map "carries" a certificate naming the Lean theorem it shadows, and the runtime checks the certificate before drawing the edge.

## What the Lean file proves, exactly

The record states that `CurvedCorpus.lean` proves identities only: atom delta nonnegativity, linear composition, curveball trades staying on the fixed-margin fibre, uniform being the unique stationary law, heat exponents, and Metropolis flux symmetry (internal record). The scope block of that file explicitly disowns measurement claims. This distinction is the hinge of the whole design. A theorem about a transformation (a trade stays on a fibre) is an identity; a claim about the world (the null is adequate, the effect is genuine) is a measurement, and no proof of the first kind licenses the second.

## Lean as the proof engine

The proofs live in Lean, a theorem prover that aims to bridge interactive and automated theorem proving by situating automated tools in a framework that supports user interaction (https://leanprover.github.io/theorem_proving_in_lean/theorem_proving_in_lean.pdf, weight 0.70). Its authors frame the value proposition as machine-checkable proofs eliminating guesswork and creating trust (https://leodemoura.github.io/static/files/Cornell2025.pdf, weight 0.89). The foundational material on propositions and proofs, the layer such an identity file is built on, is the standard Lean 4 text (https://lean-lang.org/theorem_proving_in_lean4/Propositions-and-Proofs/, weight 0.95). Industrial-scale use is the subject of a dedicated verification framework built inside Lean, with the engineering to make it scale treated explicitly as part of the framework's design (https://leodemoura.github.io/static/marktoberdorf2026/lecture4/index.html, weight 0.72). The broader formal-verification pitch, that mathematically proving correctness goes beyond unit testing (https://micrologics.org/blog/proving-software-correctness-a-developers-guide-to-formal-verification-with-lean-4, weight 0.38, weakly backed), matches the record's instinct but is a developer-blog source.

## Runtime assertions, honestly scoped

Because the identities are proved, a deployable tool can enforce them as runtime assertions: every atom move can be checked against delta nonnegativity as it happens, and a failed check is a code bug, not a scientific result. The record notes that the existing D2 `rsi-descent` tool already does exactly this for the delta nonnegativity identity (internal record). What the tool must never do is claim the null is adequate or the effect genuine; those are measurement questions that the proofs say nothing about.

This is the same separation PCC draws: the proof artifact certifies a property the checker can verify mechanically, and it certifies nothing else. The consequence for the point map is a two-tier rule later formalized in the certificate design: identity checks must always pass (a failure is a bug), while measurement checks may honestly fail (internal record).

## Why the constraint shaped the finalist design

The constraint explains why V4 won. Variations that blurred the line were penalized: V2 (full reverse diffusion in the browser) got T=1 partly because months of infrastructure work precede any honest number; V6 (continuous slerp channel) was deferred because no fixed-margin fibre exists for continuous rows, so the only certifiable statement there is delta nonnegativity on geodesic distance, a weaker medium (internal record). The proof-carrying constraint is thus not decoration on the finalist; it is the selection pressure that produced it. A tool whose every visible edge names a proved theorem cannot drift into claiming more than was proved, which the record identifies as the program's recurring failure mode (internal record).
