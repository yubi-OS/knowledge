# Lattice heat capacity: the Einstein and Debye models

**Scope:** the Bose-Einstein occupation of phonon modes, the Einstein single-frequency model with its exponential low-temperature freeze-out, the Debye model with its cubic low-temperature law, and the Dulong-Petit high-temperature limit.

## Classical starting point: Dulong-Petit

The equipartition theorem gives each quadratic degree of freedom k_B T / 2 of energy, hence k_B / 2 of heat capacity. An atom in a parabolic potential has 3 quadratic degrees of freedom, so the classical heat capacity per atom is C = 3 k_B, the law of Dulong-Petit ([TU Delft Open Solid State Notes, Einstein model](https://solidstate.quantumtinkerer.tudelft.nl/1_einstein_model/), jev weight 0.686). The complication is experimental: "the measured heat capacity of diamond drops below the prediction of the law of Dulong-Petit at low temperatures", which shows the classical model fails and a quantum model is needed (TU Delft, weight 0.686).

## The Einstein model

Einstein's proposal is to treat each atom as an independent quantum harmonic oscillator with the same frequency omega_0 (TU Delft, weight 0.686; [Wikipedia, Einstein solid](https://en.wikipedia.org/wiki/Einstein_solid), jev weight 0.462). The Einstein solid is a model of a crystalline solid containing a large number of independent 3D quantum harmonic oscillators of the same frequency (Wikipedia, weight 0.462). Counting the microstates of an Einstein solid with N oscillators and q energy units gives the multiplicity Omega(N, q) of order (q + N choose q), from which the entropy and then the heat capacity follow ([UNLV Physics 467/667 lecture 26, The Einstein and Debye Models of Solids](https://www.physics.unlv.edu/~qzhu/Teaching/ThermalPhysics/Lec26.pdf), jev weight 0.760).

The qualitative failure mode is specific: below kT of order the oscillator energy e, the heat capacity falls off, approaching zero as the temperature goes to zero. But experiments show the true low-temperature behavior is cubic, C_V proportional to T^3. The problem with the Einstein model is that the atoms in a crystal do not vibrate independently of each other (UNLV lecture 26, weight 0.760).

## The Debye model

Debye's fix keeps the low-frequency modes that Einstein's single frequency discards: in reality there are low-frequency modes in which large groups of atoms move together, and high-frequency modes in which atoms move opposite to their neighbors. Even at very low temperatures a few low-frequency modes are still active, which is why the heat capacity goes to 0 less dramatically than the Einstein prediction (UNLV lecture 26, weight 0.760).

Debye assigns each mode a set of equally spaced energy levels with unit energy e = hf, and the occupation of a mode in equilibrium at temperature T follows the Planck distribution, n-bar = 1 / (exp(e/kT) - 1); these energy units can be treated as particles obeying Bose-Einstein statistics with chemical potential mu = 0 (UNLV lecture 26, weight 0.760).

For the density of modes, Debye approximates the relevant region of n-space (wavevector space) as a sphere and converts the mode sums to integrals in spherical coordinates (UNLV lecture 26, weight 0.760). Evaluating the resulting energy integral at T much less than the Debye temperature T_D, the upper limit goes to infinity and the integral gives the constant pi^4 / 15, reproducing the experimentally observed cubic law C_V proportional to T^3 at low temperature (UNLV lecture 26, weight 0.760).

## The division of labor between the two models

The two models are answers to different halves of the phonon spectrum. The Einstein model, with one common frequency for independent oscillators, captures the high-frequency, optical-phonon-like part of the spectrum and gives the correct high-temperature Dulong-Petit limit (TU Delft, weight 0.686; Wikipedia, weight 0.462). The Debye model, with a linear acoustic dispersion cut off at a maximum frequency, captures the low-frequency acoustic part and gives the correct T^3 law at low temperature (UNLV lecture 26, weight 0.760). Modern treatments of heat capacity in solids still follow this split: the quantum statistics of the modes (Bose-Einstein with mu = 0) is common to both, and what distinguishes them is the assumed density of states (UNLV lecture 26, weight 0.760; TU Delft, weight 0.686).

## Reading the low-temperature data correctly

The experimental sequence is worth stating exactly: the classical law C = 3 k_B per atom holds at high temperature (TU Delft, weight 0.686); the measured heat capacity of a hard solid such as diamond drops below that law as temperature falls (TU Delft, weight 0.686); a single-frequency quantum model reproduces the drop but overestimates its steepness, predicting exponential rather than cubic freeze-out (UNLV lecture 26, weight 0.760); and the observed low-temperature behavior is cubic, which is the signature of the linear acoustic dispersion surviving at the lowest frequencies (UNLV lecture 26, weight 0.760).
