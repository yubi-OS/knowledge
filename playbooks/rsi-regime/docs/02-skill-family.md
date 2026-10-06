# 02 - Skill family

**Scope:** the 9 skills of the regime and the role each plays, exactly as the source doc's "Skills in the regime" table records them.

This is an internal-record subtopic: every fact below comes from the source doc (yubi-OS/yubiOS playbooks/rsi-regime.md), which is the registry of record. No web dig was run, and none of these skill descriptions are externally verifiable facts; they are the playbook's own role assignments.

## The table

| Skill | Role in the regime (source doc) |
|---|---|
| recursive-self-improvement | The parent skill. Flat-line RSI loop. Use when the corpus is 1-D (version sequences, time series). |
| rsi-phi-skill | The Fibonacci-sphere variant. Use when the corpus has azimuthal ordering. Native basis Y_3^3 = K sin^3 theta * cos(3 phi), 384 symmetric azimuthal lobes, i = t. |
| hyperspherical-harmonic-curve | The S2 basis swap plus gamma(t) closed-form ridge (L=3, 16 functions, lambda=1e-3) on the sphere. Described as the math engine. |
| learned-latent-curve | The learned-latent curve fitter; used when the basis itself is learnable from the corpus. |
| single-action-curve-rsi | The atomic atom: one corpus item, one S2 point, one geodesic delta per cycle. The per-hypothesis primitive-flip selector. |
| curve-guided-rsi | The original 79-skill flat-line loop, deprecated for sphere corpora and superseded by rsi-phi-skill. |
| curve-guided-rsi-self | Self-mode variant; applies the loop to SELF.md and SELF-CHANGELOG.md. |
| negative-skill-space | 12-axis qualitative sweep (Audience, Inputs, Outputs, Mode, and more) that gap-maps a corpus; it sits upstream of any RSI cycle. |
| parallel-deep-research | The deep-research subagent dispatched per cycle in rsi-phi-skill self-mode. Improvement-mode uses a single agent instead. |

## How the roles compose

The table implies a dependency order rather than a menu. negative-skill-space always runs first because the loop's step 1 is a gap-map and step 5's fixpoint test is defined in terms of the gaps that sweep produced (source doc). rsi-phi-skill and hyperspherical-harmonic-curve split the work along the same seam the source doc draws elsewhere: rsi-phi-skill owns the sampling and indexing discipline (Fibonacci ordering, i = t, the Y_3^3 basis with 384 lobes), while hyperspherical-harmonic-curve owns the fitting math (the 16-function L=3 real SH basis and the closed-form ridge with lambda=1e-3). learned-latent-curve is the fallback when the fixed basis is wrong for the corpus: the source doc phrases it as "used when the basis itself is learnable from the corpus." single-action-curve-rsi is the narrowest instrument in the family, one corpus item and one edit per cycle, and is the primitive the loop's step 2 hypothesis proposal selects with (source doc). parallel-deep-research is the only member that is not a math component; it is the hypothesis generator, and the source doc is explicit that it is dispatched in self-mode cycles while improvement-mode uses a single agent.

## Deprecation state

Two members carry lifecycle flags in the table. curve-guided-rsi is deprecated for sphere corpora (superseded by rsi-phi-skill) but remains the designated tool for 1-D corpora, which is the selection rule in 08-skill-selection-cycle-cap.md. The remaining 7 skills carry no deprecation or supersession note in the source doc, so treat them as current as of the playbook's 2026-08-07 changelog entry (source doc).
