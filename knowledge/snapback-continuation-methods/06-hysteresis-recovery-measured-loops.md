# 06. Hysteresis and Recovery in Measured Load-Unload Loops

Scope: what a measured load-unload loop records, the split between elastic (recoverable) and plastic (permanent-set) response, the recovery fraction, dissipated energy as the loop area with its linear-viscoelastic limit Wdis = pi sigma0 eps0 sin(delta), cyclic softening and hardening, the Mullins effect as the named stress-softening example in filled elastomers, and the experimental practice of separating true recovery from drift and noise.

## Findings

### 1. The loop area is the dissipated energy, and this is the standard metric

For a viscoelastic material, the energy absorbed during 1 loading-unloading cycle is given by the area within the hysteresis loop, and the shape of the loop depends on the rates of loading and unloading, unlike time-independent elasticity. [3 (0.77)] In the elastic hysteresis of rubber the area in the centre of the hysteresis loop is the energy dissipated due to material internal friction. [V2, direct fetch] The same accounting holds when the loop encloses plastic work: the energy consumption in a single loading-unloading cycle is obtained by calculating the difference between the areas under the loading and unloading curves, and the relation between elastic strain energy and loop area has been quantified across loading cycles in elasto-plastic materials. [4 (0.35), 5 (0.31)] Loop area is the standard dissipation metric across mechanics because it is model-free, read directly off the measured force-displacement or stress-strain curve, and it reduces to the linear-viscoelastic limit: the out-of-phase stress components yield Wdis = pi sigma0'' eps0 = pi sigma0 eps0 sin(delta), while the in-phase components do no net work over a cycle, so stored energy returns on unloading and only the out-of-phase part converts irreversibly to heat. [V1, direct fetch] [2 (0.11)] gives the same qualitative statement at low authority.

### 2. Elastic versus plastic response, and the recovery fraction

Elastic hysteresis is defined operationally as the difference between the strain energy required to generate a given stress in a material and the material's elastic energy at that stress: the input energy minus the recoverable part. [1 (0.38)] The recoverable part is the elastic component; the unrecovered part splits into dissipated heat and permanent set. Permanent set, the residual strain left after unloading, is a named modeling quantity in the Mullins literature (Dorfmann and Ogden's model is explicitly "for the Mullins effect with permanent set in particle-reinforced rubber"). [6 (0.74)] The recovery fraction is therefore the complement of the unrecovered share of the input: how much of the measured quantity (strain, or elastic energy) returns when the load is removed. For pure viscoelastic response the strain returns fully given enough time, so the observed loop comes from rate-dependent lag; for elasto-plastic response a nonzero residual strain persists, and methods that identify elasto-plastic strain-energy components directly from measured stress-strain data are an active identification problem. [0 (0.79), 3 (0.77)]

### 3. Cyclic softening and hardening

Repeating a cycle to the same limits changes the loop: the stress-strain curves, the loading-cycle number against loop area, and the elastic strain energy against loop area all evolve during cyclic loading and unloading in elasto-plastic materials. [4 (0.35)] Softening means each successive cycle reaches lower stress at the same strain (the loop shifts down and typically shrinks); hardening means the opposite. The Mullins effect is the canonical softening case in filled rubbers, reviewed across tough elastomers and gels where loading-unloading cycles show clear stress softening in nanocomposite gels, double-network hydrogels, and multi-network elastomers. [7 (0.87), 8 (0.87)]

### 4. The Mullins effect and its recovery

The Mullins effect is the stress-strain curve's dependence on the maximum loading previously encountered, idealized as an instantaneous and irreversible softening whenever the load exceeds its prior all-time maximum; below the prior maximum the response is again nonlinear elastic. Although named for filled rubbers, it occurs in all rubbers including unfilled gums; it is a viscoelastic effect with additional hysteresis in filled rubber from filler particles debonding from each other or from the polymer chains, and it is distinct from the Payne effect. [6 (0.74)] The classical idealization says irreversible, but the current experimental literature documents recovery: thermal recovery of the Mullins effect in filled rubbers has been measured explicitly, and a recent review organizes softening as relaxation, recovery, and high-strain damage. [9 (0.84), 10 (0.23)] So the honest reading is: first-cycle softening is immediate and history-setting (the curve depends on the prior maximum), while part of the softening recovers at rest, thermally driven, on timescales much longer than the unloading itself; the fraction that does not recover behaves as damage or permanent set. [6 (0.74), 9 (0.84)]

### 5. Separating elastic recovery from drift and noise

The sources support 3 concrete practices, and leave 1 gap. (a) Rate control: since loop shape depends on loading and unloading rates, the hysteresis comparison is only meaningful at controlled, stated rates. [3 (0.77)] (b) Hold-based permanent set: the residual (permanent-set) reading is separated from the viscoelastic return by waiting, because strain continues to recover with time; thermal-recovery experiments explicitly treat rest time and temperature as the experimental variables that define how much softening recovers. [9 (0.84)] (c) Energy-accounting cross-check: the recovery fraction can be computed as returned elastic energy over input energy, which is robust to slow baseline drift because it uses the same loading and unloading curves. [1 (0.38)] The gap: none of the retrieved sources documents instrument-level drift or noise correction procedures (baseline subtraction, zero-return tolerance, conditioning passes), so this aspect is stated as standard reasoning, not as sourced fact.

## Sources considered

| id | Source | Engine | jev weight (noul) | Role |
|----|--------|--------|-------------------|------|
| 0 | https://www.sciencedirect.com/science/article/pii/S0263224125006566 | searxng | 0.79 | Elasto-plastic strain-energy identification |
| 1 | https://www.instron.com/en/resources/glossary/elastic-hysteresis/ | searxng | 0.38 | Operational definition of elastic hysteresis |
| 2 | https://completeera.com/elastic-hysteresis-understanding-energy-loss-in-materials-2/ | searxng | 0.11 | Secondary, corroborative only |
| 3 | https://www.doitpoms.ac.uk/tlplib/bioelasticity/viscoelasticity-hysteresis.php | searxng | 0.77 | Loop area = energy per cycle; rate dependence |
| 4 | https://www.researchgate.net/publication/287785447_Relationship_between_hysteresis_loop_and_elastoplastic_strain_energy_during_cyclic_loading_and_unloading | searxng | 0.35 | Cyclic loop-area evolution (mirror of primary) |
| 5 | https://www.researchgate.net/figure/Typical-hysteresis-loop-under-a-loading-unloading-process-a-Energy-dissipated-during_fig4_362951574 | searxng | 0.31 | Loading minus unloading area definition |
| 6 | https://en.wikipedia.org/wiki/Mullins_effect | searxng | 0.74 | Mullins effect canonical description |
| 7 | https://link.springer.com/article/10.1007/s10338-023-00460-6 | searxng | 0.87 | Mullins review in tough gels/elastomers |
| 8 | https://www.sciencedirect.com/science/article/pii/S014294182400076X | searxng | 0.87 | Mullins review in filled elastomers |
| 9 | https://www.sciencedirect.com/science/article/pii/S009364132600073X | searxng | 0.84 | Thermal recovery of the Mullins effect |
| 10 | https://www.researchgate.net/publication/334861109_Mullins_effect_revisited_Relaxation_Recovery_and_high-strain_Damage | searxng | 0.23 | Recovery framing (mirror of primary) |
| 11 | https://modern-physics.org/mullins-effect-in-elastomers/ | searxng | 0.13 | Secondary, corroborative only |
| V1 | https://eng.libretexts.org/Bookshelves/Mechanical_Engineering/Mechanics_of_Materials_(Roylance)/05%3A_General_Stress_Analysis/5.04%3A_Linear_Viscoelasticity (Roylance) | direct fetch (verification, not dig) | - | Wdis = pi sigma0 eps0 sin(delta) |
| V2 | https://en.wikipedia.org/wiki/Hysteresis (Elastic hysteresis section) | direct fetch (verification, not dig) | - | Loop area = dissipated internal friction |
