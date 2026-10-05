# Raman and infrared: equations considered, boundaries retained

Scope: what the audit says the wayfinder can and cannot claim about Raman and infrared activity, the equations that were considered, the non-admitted diagnostics it exposes, and the recorded negatives it keeps.

## The two activity equations

Infrared activity requires a dipole derivative. The intensity scales as the squared magnitude of the derivative of the dipole moment with respect to the normal coordinate: I_IR proportional to the square of the magnitude of d(mu)/dQ. Raman activity requires a polarizability derivative: I_Raman proportional to the squared magnitude of e_s transposed times d(alpha)/dQ times e_i, a contraction of the polarizability derivative tensor between scattered and incident polarizations. In the isotropic Placzek treatment, the depolarization ratio is rho = 3 gamma'^2 / (45 alpha'^2 + 4 gamma'^2), where alpha' is the mean polarizability derivative and gamma' the anisotropy.

Primary literature grounds the Raman side directly: "the Raman intensity is proportional to the derivatives of the polarizability tensor with respect to nuclear coordinates", with the Placzek approximation usually applied far from resonance (https://arxiv.org/pdf/1806.03840, weight 0.927). The depolarization ratio is defined as the intensity ratio between the perpendicular and parallel components of Raman scattered light, with early theoretical treatment by George Placzek (https://en.wikipedia.org/wiki/Depolarization_ratio, weight 0.240, weak; https://handwiki.org/wiki/Depolarization_ratio, weight 0.311, weak).

## Why the wayfinder cannot claim any of it

None of the required observables exists in the current wayfinder: not the dipole moment mu, not the polarizability alpha, not physical normal coordinates Q, and not measured polarization intensities. A degree-energy split, which is what the map actually has, cannot be relabeled as a measured depolarization ratio. The boundary is stated, not hidden: the system measures geometric and statistical structure over document embeddings, and no equation above can be evaluated from that data.

## What the selection-rule homologies can suggest

Selection-rule structure can still suggest candidates for study, and the audit allows exactly that much:

1. Rank-1 odd response versus rank-0/2 even response, a parity and rank distinction that mirrors the dipole (odd, rank-1) versus polarizability (even, rank-0 and rank-2) split.
2. Gaunt triangle and parity sparsity, which encode which spherical-harmonic couplings are allowed.
3. The spherical heat eigenvalues l(l+1), already native to the wayfinder's geometry.

The UI reports even/odd and rank-block spherical-harmonic shares as non-admitted diagnostics only, in a separate card, with no contribution to ranking. Non-admitted is the operative word: a diagnostic that moved the ranking would smuggle an unvalidated physical analogy into the instrument's outputs.

## The mutual exclusion caveat

Raman and infrared mutual exclusion is the spectroscopy rule that no normal mode can be both IR and Raman active in a molecule with a center of symmetry (https://en.wikipedia.org/wiki/Rule_of_mutual_exclusion, weight 0.311, weak; https://monomole.com/exclusion-rule-in-vibrational-spectroscopy/, weight 0.468, weak). The audit records the caveat explicitly: the exclusion rule additionally needs inversion symmetry, so it is not universal. Any homology reasoning that leans on exclusion must carry that condition, not treat it as a global law. General spectroscopy references place both IR and Raman sensitivity in the fingerprint region of organic molecules (https://en.wikipedia.org/wiki/Raman_spectroscopy, weight 0.267, weak).

## The gate for any new spectral coordinate

Any new spectral coordinate must first pass four gates, per the audit record:

1. Margin-invariance analysis.
2. A non-degenerate matched null.
3. Selection-aware controls.
4. A pre-registered task test.

The same record also lists what requires observables the system does not measure, and therefore stays out of scope: Lorentzian linewidths, lifetimes, Stokes/anti-Stokes thermometry, and Kramers-Kronig reconstruction.

## Recorded negatives

The audit retains its negative results rather than burying them:

1. The A1 admission failed.
2. The Pennes uniform loss cancels in admitted ratios.
3. The FCS factorization is not identifiable at the tested setting.
4. The Gaunt kappa was negative.
5. The margin-clean second-branch test excluded it.

The summary is deliberate: no new Lean theorem and no physics discovery is claimed. The boundary between "selection-rule homology suggests a candidate worth testing" and "the system measured a spectral property" is the whole content of this doc, and the audit holds the second claim out of reach.
