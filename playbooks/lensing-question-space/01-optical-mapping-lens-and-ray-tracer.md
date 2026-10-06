# 01: The Moebius chart as a lens, the atom as a ray tracer

Scope: the source doc's findings F1 and F2: the Moebius chart as a literal optical conformal mapping lens, and the corpus-math atom as a discrete ray tracer under Fermat's principle.

Grounding spine: [source doc](file://yubi-OS/yubiOS playbooks/lensing-question-space.md), 2026-08-13, sections F1 and F2.

## F1: the chart is already a lens

The source doc states that phi_theta, a Moebius transformation in PSL(2,C), carries an index profile n(z) = |phi_theta'(z)|, and that this is Leonhardt's optical conformal mapping in the exact, not metaphorical, sense (source doc). The dig confirms the mechanism: in the Science 2006 paper the medium "performs an optical conformal mapping to empty space", so that waves emerging from the medium look as if they had traveled through empty space ([science.org/doi/10.1126/science.1126493](https://www.science.org/doi/10.1126/science.1126493), weight 0.84). The companion arXiv paper develops the same construction as a design tool for dielectric devices ([arxiv.org/abs/physics/0602092](https://arxiv.org/abs/physics/0602092), weight 0.71). The eikonal route from Maxwell's equations to Snell's law is standard geometrical optics ([weizmann.ac.il geometrical optics notes](https://www.weizmann.ac.il/complex/DOron/sites/complex.DOron/files/uploads/Geometrical%20optics%20notes.pdf), weight 0.67).

The consequence the source doc draws is that every run to date has frozen phi_theta at the identity, so the framework has been carrying an unpowered lens; refining phi_theta is lens design in the literal optical sense (source doc, weight 1.09 from outline validation). No dig contradicts this; it is an internal claim about the framework's own history.

Note on weak support: Wikipedia's transformation optics entry scored 0.46, below the 0.5 line, so it is cited here only as background reading, not as authoritative backing ([en.wikipedia.org/wiki/Transformation_optics](https://en.wikipedia.org/wiki/Transformation_optics), weight 0.46, weak).

## F2: the atom is a ray tracer

The source doc makes three exact identifications (source doc):

1. The geodesic-only criterion is discrete Fermat's principle.
2. The Phi(k) ladder is the eikonal S evaluated on coverage shells.
3. Delta >= 0 says rays never move backward in optical path length.

Snell's law is then the corner condition of the same variational problem at an index discontinuity, citing Kalaba and Ueno 1974 and Tyc 1997 (source doc). The dig gives general backing for the chain: Fermat's principle selects the refraction point that minimizes optical path ([en.wikipedia.org/wiki/Fermat%27s_principle](https://en.wikipedia.org/wiki/Fermat%27s_principle), weight 0.52, weak), and a lecture source derives Snell's law and the eikonal equation from Fermat's principle ([uni-weimar.de geom optics slides](https://www.uni-weimar.de/fileadmin/user/fak/medien/professuren/Computer_Graphics/5-geom-optics17.pdf), weight 0.6, weak).

Reading: both findings say the same thing from two sides. If phi_theta is the lens and the atom is the ray tracer, then the existing pipeline already implements the measurement half of an optical instrument, and the design half (choosing the index profile) is the unexercised part. That is the source doc's own conclusion and the dig literature on conformal lens design gives it an established vocabulary.
