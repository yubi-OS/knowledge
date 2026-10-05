# 03 Policy as temperature

Scope: the mapping from the viscoelastic reading to a software corpus: policy version is the temperature, response curves are the moduli, and invariant gate structure is the material that must not reshape.

## The parameter reading of system behavior

The mapping starts from a standard idea in control theory: system behavior is analyzed through parameters introduced into the model. Parameter-based approaches represent dynamical systems as linearly-parameterized structures, and control laws are constructed by introducing parameters to obtain performance or robustness (weight 0.87, https://ietresearch.onlinelibrary.wiley.com/doi/10.1049/cth2.12436). System identification is the companion discipline: instead of assuming parameters, you measure them from observed responses (weight 0.80, https://introcontrol.mit.edu/_static/fall24/lectures/System_Identification.pdf).

Under this reading, a policy version is a control parameter of the corpus. A version bump is a controlled change of that parameter, and the response curves measured around it (approve latency, verdict distribution, retry behavior, audit cadence) are the observables that parameter identification would fit against. The analogy to temperature is structural, not literal: in WLF theory temperature is the scalar that shifts response curves along log time without reshaping them, and the proposal is that policy version plays the same scalar role for a software gate.

## What must stay invariant

A temperature-only change shifts rates. What corresponds to the material itself in a software gate is the structure that must survive a version bump unchanged: the gate shape, the six terminal states, and the fail-closed rule. The configuration-management literature frames this as invariants shared across versions: which invariants are shared by versions depends on the specific version model, and at one end of the spectrum versions can differ in arbitrary ways (weak backing, weight 0.46, https://www.researchgate.net/publication/220566344_Version_Models_for_Software_Configurati). The corpus study takes the strong end of that spectrum deliberately: the gate's terminal-state vocabulary and fail-closed rule are declared shared across v1 through v5, and that declaration is what makes version changes candidates for a shift-factor treatment rather than for a new model.

## Why auditors of the analogy need versioned trails

There is a practical reason the mapping needs the policy version recorded per observation, and it is the same reason compliance practice demands policy versioning: auditors need to know which rules were active when a decision was made, not just what the policy looks like now, and a versioned trail shows how access changed over time (weak backing, weight 0.43, https://nhimg.org/faq/why-does-policy-versioning-matter-for-compliance-and-access-governance/). A response curve without a policy_version stamp is a curve measured at an unknown temperature, and superposition against an unknown-temperature curve is not defined.

## The mapping stated precisely

The full mapping, with its obligations:

1. Policy version v plays the role of temperature T (weight 0.87, https://ietresearch.onlinelibrary.wiley.com/doi/10.1049/cth2.12436).
2. Response curves per version play the role of modulus curves. Approve latency, verdict mix, retry behavior and audit cadence are the moduli of the gate (weight 0.80, https://introcontrol.mit.edu/_static/fall24/lectures/System_Identification.pdf).
3. Gate shape, six terminal states, fail-closed rule play the role of the material. These are declared version-invariant (weak backing, weight 0.46, https://www.researchgate.net/publication/220566344_Version_Models_for_Software_Configurati).
4. Shift factor a_T(v) is defined per version, fitting each version's curves onto the v_ref curves along the time axis (weight 0.87, https://ietresearch.onlinelibrary.wiley.com/doi/10.1049/cth2.12436).

The mapping's honesty condition is item 3. If a version bump changes the state vocabulary or flips fail-closed, the "material" changed and no shift factor can describe the transition, because superposition presupposes the same material at different temperatures (weight 0.80, https://introcontrol.mit.edu/_static/fall24/lectures/System_Identification.pdf).
