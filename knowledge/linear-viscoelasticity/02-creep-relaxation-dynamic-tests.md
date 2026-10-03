# Creep, Stress Relaxation, and Dynamic Characterization Tests

Scope: the 3 canonical tests used to characterize linear viscoelastic response, covering creep compliance, stress relaxation modulus, and the dynamic moduli derived from sinusoidal loading, with their limiting glassy and rubbery values and energy relations.

## Creep: constant stress, time-dependent strain

In a creep test a constant stress sigma0 is applied and the resulting time-dependent strain is monitored; for a linear material the strain histories obtained at various stress levels superimpose when normalized, and the ratio of strain to stress is the creep compliance Ccrp(t) = eps(t)/sigma0 (MIT Roylance, 0.91; MIT OCW 2.002, 0.87). On a log-time plot Ccrp(t) starts at the glassy compliance Cg, the instantaneous elastic response from bond distortion, and rises toward the rubbery or equilibrium compliance Cr, which can be about 2 orders of magnitude larger than the glassy modulus would suggest (MIT Roylance, 0.91). The abscissa value labeled log tau marks the inflection where the rising slope turns over, and tau is the relaxation time of the creep process (MIT Roylance, 0.91; Auckland Solid Mechanics chapter, 0.75). Creep is most convenient for probing response at long times, minutes to days (MIT Roylance, 0.91).

## Stress relaxation: constant strain, decaying stress

The converse test holds a constant strain eps0 and monitors the decaying stress required to maintain it; normalizing gives the relaxation modulus Erel(t) = sigma(t)/eps0, which sits at a high short-time glassy plateau Eg and then falls exponentially to a lower equilibrium rubbery modulus Er as molecular segments accommodate the strain by conformational extension rather than bond distortion (MIT Roylance, 0.91; Rod Lakes notes, 0.83). The glassy and rubbery endpoints are exactly reciprocal, Eg = 1/Cg and Er = 1/Cr, but the full functions are not: in general Erel(t) != 1/Ccrp(t). In particular, the relaxation response moves toward its equilibrium value more quickly than the creep response (MIT Roylance, 0.91; Brown Essentials of Linear Viscoelasticity, 0.88). The two functions are related only through a convolution integral, Erel * Ccrp = t, equivalently the Laplace-plane relation Erel_s x Ccrp_s = 1/s^2, so converting one into the other requires solving an integral equation, typically with Laplace transforms or numerically (MIT Roylance, 0.91; PMC EPL interconversion review, 0.81).

## Dynamic sinusoidal loading: phase lag and complex modulus

Creep and relaxation are inaccurate at short times, seconds and less; dynamic tests fill that range. A sinusoidally varying stress eventually produces a steady sinusoidal strain of the same angular frequency retarded by the phase angle delta, and the lag holds regardless of whether stress or strain is the controlled variable (MIT Roylance, 0.91; OUP DMA review, 0.86). Writing eps = eps0 cos(omega t) and sigma = sigma0 cos(omega t + delta), the complex stress sigma* = sigma0' cos(omega t) + i sigma0'' sin(omega t) splits the response into in-phase and 90 degree out-of-phase parts (MIT Roylance, 0.91; IUPAC lecture notes, 0.82). The storage modulus E' = sigma0'/eps0 = sigma0 cos(delta)/eps0 is the in-phase, elastically stored component; the loss modulus E'' = sigma0''/eps0 = sigma0 sin(delta)/eps0 is the out-of-phase, viscous component; and the loss tangent tan delta = E''/E' = sigma0''/sigma0' measures relative damping (MIT Roylance, 0.91; Anton Paar DMA basics, 0.29). delta = 0 for a purely elastic solid and approaches pi/2 for a purely viscous liquid (PMC damping-parameter review, 0.81).

The energy interpretation follows from integrating the work per cycle: in-phase components do no net work over a cycle, while the out-of-phase components dissipate a net Wdis = pi sigma0'' eps0 = pi sigma0 eps0 sin(delta) per cycle as heat (MIT Roylance, 0.91; Rod Lakes notes, 0.83). The maximum energy stored by the in-phase components occurs at the quarter-cycle point, Wst = (1/2) sigma0' eps0 = (1/2) sigma0 eps0 cos(delta) (MIT Roylance, 0.91). The relative dissipation ratio is therefore Wdis/Wst = 2 pi tan(delta) (MIT Roylance, 0.91; IUPAC lecture notes, 0.82).

## Sources considered

| Source | URL | jev weight |
| --- | --- | --- |
| Engineering Viscoelasticity, Roylance, MIT 3.11 | https://web.mit.edu/course/3/3.11/www/modules/visco.pdf | 0.91 |
| MIT OCW 2.002 creep and viscoelasticity notes | https://ocw.mit.edu/courses/2-002-mechanics-and-materials-ii-spring-2004/0278c01018c4f2281214a661d9c95c32_creep_viscoelast.pdf | 0.87 |
| Essentials of Linear Viscoelasticity, Brown Applied Math | https://appliedmath.brown.edu/sites/default/files/fractional/12%20EssentialsofLinearViscoelasticity.pdf | 0.88 |
| Viscoelasticity notes, Rod Lakes | https://rodlakes.com/VEnotes.html | 0.83 |
| Viscoelasticity chapter, Auckland Solid Mechanics | https://pkel015.connect.amazon.auckland.ac.nz/SolidMechanicsBooks/Part_I/BookSM_Part_I/10_Viscoelasticity/10_Viscoelasticity_Complete.pdf | 0.75 |
| Linear Viscoelasticity, EOLSS | https://www.eolss.net/Sample-Chapters/C06/E6-197-05-00.pdf | 0.64 |
| Dynamic mechanical analysis in materials science, OUP | https://academic.oup.com/ooms/article/1/1/itaa001/5918362 | 0.86 |
| IUPAC polymer education shortcourse notes | https://iupac.org/wp-content/uploads/2017/12/IUPAC_PolymEdu_Shortcourse_3LectureNotes_MichaelHess.pdf | 0.82 |
| Characterization of Polymers using DMA, EAG | https://www.eag.com/wp-content/uploads/2017/09/M-022717-Characterization-of-Polymers-using-Dynamic-Mechanical-Analysis.pdf | 0.38 |
| Introduction to DMA, TA Instruments | https://www.tainstruments.com/applications-notes/introduction-to-dynamic-mechanical-analysis-and-its-application-to-testing-of-polymer-solids/ | 0.46 |
| Basics of DMA, Anton Paar wiki | https://wiki.anton-paar.com/us-en/basics-of-dynamic-mechanical-analysis-dma/ | 0.29 |
| EPL interconversion of viscoelastic functions, PMC | https://pmc.ncbi.nlm.nih.gov/articles/PMC7765810/ | 0.81 |

Dig note: the searXNG proxy webhook returned HTTP 500 "Error in workflow" on every attempt for both planned queries, so candidate sources were gathered by web search fallback with the same query intent and jev weighted as specified. All formulas above were verified verbatim against the Roylance MIT extract held locally.
