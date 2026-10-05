# Phonon transport: thermal conductivity and second sound

**Scope:** the phonon kinetic picture of lattice thermal conductivity and its first-principles computation, and the hydrodynamic regime of phonon transport where heat propagates as waves (second sound) rather than diffusing.

## Thermal conductivity from phonon kinetic theory

The modern first-principles pipeline for lattice thermal conductivity is explicit about its ingredients: "The harmonic properties and the cubic force constants are then used with perturbation theory and/or phenomenological models to determine intrinsic and extrinsic scattering rates", from which the thermal conductivity follows ([Journal of Applied Physics 125, 011101 (2019), Phonon properties and thermal conductivity from first principles](https://pubs.aip.org/aip/jap/article/125/1/011101/155527/Phonon-properties-and-thermal-conductivity-from), jev weight 0.953; the same review is available as a [PDF mirror](https://www.me.iitb.ac.in/~a_jain/mypublications/JAP_2019.pdf)). The structure is: harmonic dispersion and heat capacities from the harmonic force constants, lifetimes from the cubic (anharmonic) force constants plus extrinsic mechanisms, and transport coefficients assembled from those ingredients.

The same pipeline applies at the nanostructure scale: the lattice thermal conductivity of crystalline silicon nanowires was calculated using complete phonon dispersions, with the nanostructure geometry entering through the mode spectrum and boundary scattering ([Zenodo record, Mingo, Calculation of Si nanowire thermal conductivity](https://zenodo.org/record/1233747), jev weight 0.553).

## Phonon hydrodynamics

Beyond the diffusive (kinetic) regime lies the hydrodynamic one. A 2019 study built "a system of coupled integro-differential equations for acoustic sound waves and phonon density fluctuations in two-dimensional crystals" and showed that within this framework "propagation and damping of acoustic sound waves, diffusive heat conduction, second sound and Poiseuille heat flow" all appear, "characterized by specific transport coefficients" ([arXiv:1904.06327, Phonon hydrodynamics, thermal conductivity and second sound in 2D crystals](https://arxiv.org/abs/1904.06327), jev weight 0.760; published as [Physical Review B 99, 144303 (2019)](https://link.aps.org/doi/10.1103/PhysRevB.99.144303), jev weight 0.968).

The framework has a distinctive coupling structure: as a consequence of thermal tension, mechanical and thermal phenomena are coupled, so "the thermal resonances such as Landau-Placzek peak and second sound doublet appear in the displacement susceptibility and conversely the acoustic sound wave doublet appears in the temperature susceptibility" (arXiv:1904.06327, weight 0.760). The analytical results apply not only to graphene but to 2D crystals generally (arXiv:1904.06327, weight 0.760).

## Second sound

Second sound is "the thermal transport regime where heat is carried by temperature waves". Its experimental observation "was previously restricted to a small number of materials, usually in rather narrow temperature windows" ([arXiv:2007.05487, Observation of second sound in a rapidly varying temperature field in Ge](https://arxiv.org/abs/2007.05487), jev weight 0.713). The same work showed the limitation can be overcome by driving the system with a rapidly varying temperature field: the effect "is demonstrated in bulk Ge between 7 kelvin and room temperature, studying the phase lag of the thermal response under a harmonic high frequency external thermal excitation, addressing the relaxation time and the propagation velocity of the heat waves", opening "opportunities to control heat through its oscillatory nature" (arXiv:2007.05487, weight 0.713).

A pedagogical treatment frames second sound as "a major manifestation of phonon hydrodynamics in a crystal lattice", dealing with the propagation of temperature waves ([University of Bordeaux I2M thesis material, 2022](https://arxiv.org/pdf/2205.11345), jev weight 0.647).

## The three transport regimes, structurally

Reading the sources together, phonon heat transport divides into regimes with distinct signatures:

1. Diffusive (kinetic) regime: heat conduction described by scattering rates assembled from harmonic and cubic force constants, the default regime captured by first-principles thermal conductivity calculations (JAP 125, 011101, weight 0.953).
2. Hydrodynamic regime: phonon gas behaves as a fluid; second sound (temperature waves) and Poiseuille heat flow appear, with transport coefficients specific to the regime (PRB 99, 144303, weight 0.968; arXiv:1904.06327, weight 0.760).
3. Wave-probing regime: even outside the native hydrodynamic window, a rapidly varying thermal drive can expose wave-like transport (phase lag, propagation velocity) in ordinary bulk materials across a wide temperature span, from 7 K to room temperature in germanium (arXiv:2007.05487, weight 0.713).

The unifying observation is that the distinction between the regimes is dynamical, not material: the same crystal supports diffusive and hydrodynamic heat transport at different temperatures and frequencies, and which regime operates is read off from the measured response (susceptibility peaks and their doublets) rather than assumed (PRB 99, 144303, weight 0.968; arXiv:2007.05487, weight 0.713).
