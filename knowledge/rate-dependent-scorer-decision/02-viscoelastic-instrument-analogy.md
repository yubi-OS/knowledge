# 02: The viscoelastic instrument analogy

Scope: the mapping from creep and recovery mechanics onto corpus-audit scoring, and the /visco/persistence endpoint that already consumes the multi-pass shape.

## Creep and recovery in materials

The creep-recovery test loads a material at constant stress, holds that stress for some time, then removes the load and watches the strain respond (source: https://pkel015.connect.amazon.auckland.ac.nz/SolidMechanicsBooks/Part_I/BookSM_Part_I/10_Viscoelasticity/10_Viscoelasticity_Complete.pdf, jev weight 0.718, and the same University of Auckland text at jev weight 0.836). The response of a viscoelastic material splits cleanly: after removing the load, the elastic deformation disappears immediately, while the plastic deformation takes a long time to disappear, and under practical circumstances the time window is too short to remove all plastic strain (source: https://www.viscoelasticity.info/creep-of-polymers/, jev weight 0.500, and the same source re-collected at 0.732).

Two more mechanical facts carry over to the audit analogy. First, the creep-recovery cycle can be repeated multiple times, and the temperature can be varied between cycles, which is what makes rate and temperature dependence measurable at all (source: http://nguyen.hong.hai.free.fr/EBOOKS/SCIENCE%20AND%20ENGINEERING/MECANIQUE/DYNAMIQUE-VIBRATION/Dynamic_Mechanical_Analysis_A_Practical_Introduction/cr8688ch03.pdf, jev weight 0.657). Second, the creep and recovery portions are formally separable: the viscoelastic-viscoplastic-damage modeling literature treats creep and recovery as distinct constitutive regimes within one model (source: https://www.sciencedirect.com/science/article/pii/S0020768316303201, jev weight 0.944).

## The formal frame

Linear viscoelasticity is defined as the material-model framework describing combined elastic and viscous response under external loads, and its one-dimensional fundamentals are developed through integral and differential constitutive equations (source: https://appliedmath.brown.edu/sites/default/files/fractional/12%20EssentialsofLinearViscoelasticity.pdf, jev weight 0.858; overview also at https://www.sciencedirect.com/topics/materials-science/linear-viscoelasticity, collected in the dig). The standard solution technique adapts linear-elastic results to the viscoelastic case through the Boltzmann superposition principle (source: https://eng.libretexts.org/Bookshelves/Mechanical_Engineering/Mechanics_of_Materials_(Roylance)/05%3A_General_Stress_Analysis/5.04%3A_Linear_Viscoelasticity, jev weight 0.457, weak backing). Rheology teaching material covers the same creep-recovery test from an instrumentation angle (source: https://www.ifi.es/wp-content/uploads/2026/07/03-The-Basics-of-Rheology-Part3-Viscoelasticity-and-creep-recovery-tests.pdf, jev weight 0.606).

## The mapping to corpus audits

The yubiOS audit borrows the shape, not the physics. In the corpus-audit reading (source: yubiOS refs decision doc "Rate-dependent scorer decision", 2026-10-02, internal):

1. The load is the edit: a round applies changes to docs, the way constant stress loads a specimen.
2. The measurement is the grader pass: each pass reads the loaded text and issues grades.
3. Elastic credit is a flip that reverts: the grader credited a change in one pass and withdraws it under re-grading, the analog of strain that disappears on unloading.
4. Plastic credit is a flip that persists: the credit survives blind re-grading, the analog of strain that remains after unloading.
5. The recovery fraction R counts the elastic share of credited change, the analog of recovered strain divided by total strain.

The separability result from the viscoelastic-viscoplastic literature (jev weight 0.944) is what makes the two-credit split defensible: creep and recovery are different regimes of one response, not two unrelated quantities, so scoring persistence and scoring recovery are two readings of the same instrument.

## The instrument already exists

The decisive implementation fact is that the audit's persistence endpoint was built for a distribution, not a point. POST /visco/persistence already consumes a multi-pass payload shape, regraded: [{pass, rows}], and already reports scorer_variance.inter_pass_offset_dbc and per_pass_fractions (source: yubiOS refs decision doc, 2026-10-02, internal). The single-pass protocol never sent more than one pass, so the endpoint's distribution-shaped input sat half idle. This is why the adopted multi-pass protocol (doc 03) needs no new worker code: the instrument's input schema is already the one the protocol wants to feed.

The practical creep-recovery literature adds one operational note that carries over directly: because the cycle is repeatable, recovery behavior is characterized across repetitions rather than from one unload event (source: http://nguyen.hong.hai.free.fr/EBOOKS/SCIENCE%20AND%20ENGINEERING/MECANIQUE/DYNAMIQUE-VIBRATION/Dynamic_Mechanical_Analysis_A_Practical_Introduction/cr8688ch03.pdf, jev weight 0.657). The audit protocol adopted the same move: characterize R across passes instead of from one pass.
