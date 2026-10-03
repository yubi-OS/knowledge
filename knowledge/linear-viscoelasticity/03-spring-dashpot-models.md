# 03. Spring-Dashpot Constitutive Models

Scope: the mechanical spring-dashpot constitutive models of linear viscoelasticity: the Hookean spring, the Newtonian dashpot, the Maxwell and Kelvin-Voigt assemblies, the Standard Linear Solid (Maxwell form), the Wiechert (generalized Maxwell) model, and the Laplace-plane viscoelastic constitutive equation they generate.

## Findings

### 1. The two elements

The Hookean spring obeys sigma = k eps: stress proportional to strain, representing the elastic or energetic component of material response. The Newtonian dashpot obeys sigma = eta eps-dot: stress proportional to strain rate, representing the conformational or entropic component. All classical models are assemblies of these 2 elements, and each assembly's connections (series vs parallel) determine which quantity is shared and which adds. [1 (0.83), 4 (0.71)]

### 2. Maxwell model (spring and dashpot in series)

In series, the stress on each element is the same and equal to the imposed stress, while the total strain is the sum of the element strains (sigma = sigma_s = sigma_d, eps = eps_s + eps_d). Differentiating and rewriting in terms of the element rates gives the constitutive equation k eps-dot = sigma-dot + sigma/tau, with tau = eta/k (Roylance eqn. 22). Under a step strain, stress decays exponentially, sigma(t) = sigma_0 exp(-t/tau), so the relaxation modulus is Erel(t) = k exp(-t/tau) (eqn. 23). The relaxation time tau is the time for the stress to fall to 1/e of its initial value and is also the location of the inflection of the stress-versus-log-time curve. Under sinusoidal excitation the complex modulus is E* = k(i omega tau)/(1 + i omega tau), whose real and imaginary parts k omega^2 tau^2/(1 + omega^2 tau^2) and k omega tau/(1 + omega^2 tau^2) are the Debye relations, also important in circuit theory (eqns. 24 and 25). A Maxwell element cannot represent equilibrium stiffness: it relaxes to zero stress and creeps without bound, so it suits only materials like Silly Putty or warm tar. [1 (0.83), 4 (0.71), 5 (0.77), 8 (0.27)]

### 3. Kelvin-Voigt model (spring and dashpot in parallel)

In parallel, the strain is common to both elements and the stresses add: sigma = E eps + eta eps-dot. This is the mirror image of the Maxwell case, and it captures creep and recovery behavior but cannot represent stress relaxation properly, since a step stress produces a delayed exponential strain. [1 (0.83), 8 (0.27)]

### 4. Standard Linear Solid, Maxwell form

Placing an equilibrium spring ke in parallel with a Maxwell arm (spring k1, dashpot eta) gives the 3-parameter Standard Linear Solid. Working in the Laplace plane (derivatives become s factors), the Maxwell arm stress is sigma_m = k1 s eps/(s + 1/tau) (eqn. 26), and adding the equilibrium spring stress gives the associated viscoelastic constitutive equation sigma = E(s) eps with E(s) = ke + k1 s/(s + 1/tau) (eqns. 27 and 28). This is Hooke's law sigma = E eps in the Laplace plane, and it reduces differential constitutive equations to algebraic ones. For a step strain the relaxation modulus is Erel(t) = ke + k1 exp(-t/tau) (eqn. 29), the Maxwell modulus shifted upward by ke. Under constant stress the creep compliance is Ccrp(t) = Cg + (Cr - Cg)(1 - exp(-t/tau_c)) (eqn. 30), with glassy compliance Cg = 1/(ke + k1), rubbery compliance Cr = 1/ke, and retardation time tau_c = tau (ke + k1)/ke. [1 (0.83), 4 (0.71)]

### 5. Retardation time exceeds relaxation time

The creep retardation time tau_c is longer than the relaxation time tau by the factor (ke + k1)/ke, which is the ratio of the glassy to the rubbery modulus. Roylance states this is a general result, not restricted to the particular model used; it recurs in the pressure-vessel example as tau_c = tau (Gg/Gr). Physically the material relaxes faster than it creeps. [1 (0.83), 3 (0.66)]

### 6. Fitting the SLS and its limitation

The 3 parameters are fixed by matching 3 points: ke = Er, k1 = Eg - Er, and tau placed where Erel = Er + (Eg - Er)/e (eqns. 31 to 33). The fit is good at those points but poor over the full relaxation range: the predicted modulus drops from Eg to Er in approximately 2 decades of time, which is generally too abrupt a transition for real polymers. [1 (0.83)]

### 7. Wiechert model and the Prony series

Real polymers relax with a distribution of relaxation times, since molecular segments of varying length relax at different rates. The Wiechert model places an arbitrary number of Maxwell arms in parallel with a free equilibrium spring ke. In the Laplace plane its modulus operator is E(s) = ke + sum_j kj s/(s + 1/tau_j) (eqn. 34), and for a step strain the relaxation modulus is the Prony series Erel(t) = ke + sum_j kj exp(-t/tau_j) (eqn. 36). The constants ke, kj, and tau_j are selected by fitting experimental relaxation data. A 2-arm Wiechert model is equivalent to the 2nd-order ordinary differential equation a2 sigma-ddot + a1 sigma-dot + a0 sigma = b2 eps-ddot + b1 eps-dot + b0 eps, with a2 = tau_1 tau_2, a1 = tau_1 + tau_2, a0 = 1, b2 = tau_1 tau_2 (ke + k1 + k2), b1 = ke(tau_1 + tau_2) + k1 tau_1 + k2 tau_2, and b0 = ke. The same arm structure also supports numerical solutions: each arm stress advances by the recursion sigma_j^t = (1/(1 + dt/tau_j))[kj(eps^t - eps^(t-1)) + sigma_j^(t-1)], summed over arms and added to ke eps^t. [1 (0.83), 9 (0.66), 11 (0.59)]

### 8. Kelvin (series Voigt) form for stress-prescribed problems

When the stress rather than the strain is prescribed, the Kelvin model, a series arrangement of Voigt elements, is preferable to the Wiechert model: it mirrors the fact that the Maxwell-family operator E(s) sits awkwardly in the denominator for compliance computations, so Voigt-type models give the less awkward form for compliance problems. [1 (0.83)]

## Sources considered

| id | Source | Engine | jev weight (noul) | Role |
|----|--------|--------|-------------------|------|
| 1 | https://web.mit.edu/course/3/3.11/www/modules/visco.pdf (Roylance, Engineering Viscoelasticity, MIT 2001) | websearch-fallback | 0.83 | Corpus anchor, all equations |
| 2 | https://pkel015.connect.amazon.auckland.ac.nz/SolidMechanicsBooks/Part_I/BookSM_Part_I/10_Viscoelasticity/10_Viscoelasticity_Complete.pdf | websearch-fallback | 0.77 | Corroboration |
| 3 | https://www.scielo.br/j/lajss/a/JYnGg6LdhHhmq8cRG7Jdwjd/ | websearch-fallback | 0.66 | Corroboration |
| 4 | https://appliedmath.brown.edu/sites/default/files/fractional/12%20EssentialsofLinearViscoelasticity.pdf | websearch-fallback | 0.71 | Corroboration |
| 5 | https://eng.libretexts.org/Bookshelves/Materials_Science/Polymer_Physics_(Steimel)/Chapter_13%3A_Viscoelasticity | websearch-fallback | 0.74 | Corroboration |
| 6 | https://pmc.ncbi.nlm.nih.gov/articles/PMC5668653/ | websearch-fallback | 0.59 | Corroboration |
| 7 | https://digibuo.uniovi.es/dspace/bitstream/handle/10651/49200/05PaperProof.pdf?isAllowed=y&sequence=1 | websearch-fallback | 0.6 | Corroboration |
| 8 | https://en.wikipedia.org/wiki/Maxwell_model | websearch-fallback | 0.27 | Secondary |
| 9 | https://en.wikipedia.org/wiki/Generalized_Maxwell_model | websearch-fallback | 0.27 | Secondary |
| 10 | https://en.wikipedia.org/wiki/Kelvin%E2%80%93Voigt_material | websearch-fallback | 0.28 | Secondary |
| 11 | https://en.wikipedia.org/wiki/Standard_linear_solid_model | websearch-fallback | 0.31 | Secondary |
| 12 | https://ansyshelp.ansys.com/public/views/secured/corp/v251/en/ans_mat/evis.html | websearch-fallback | 0.53 | Secondary |
| 13 | https://pylith.readthedocs.io/en/v3.0.0/user/governingeqns/elasticity-infstrain/bulk-rheologies/linear-genmaxwell.html | websearch-fallback | 0.48 | Secondary |
| 14 | https://sites.miamioh.edu/polymodmw/standard-linear-model/ | websearch-fallback | not weighted (tertiary) | Secondary |

Method note: the n8n searXNG webhook returned HTTP 500 "Error in workflow" on every attempt (13+ tries over ~12 min, including the preflight query), so the dig was run via websearch fallback. All quantitative claims are anchored to source 1 (Roylance), verified against the corpus extract; the remaining sources corroborate the qualitative structure. All jev weights from one batched /api/decide call (task_id taec59d0-f51d-43ff-a679-f3adc1b98f75, cost $0.000147672).
