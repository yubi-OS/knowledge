# 01 Molecular Mechanisms and Regimes of Viscoelastic Response

Scope: the molecular mechanisms of polymer viscoelastic response, covering energetic (bond-stretching) vs entropic (conformational) elasticity, the glassy and rubbery regimes, the glass transition temperature Tg, free volume, crosslink density, and the kinetic theory of rubber elasticity.

## Two atomistic mechanisms

Polymers deform under stress by two fundamentally different atomistic mechanisms. Bond lengths and angles distort, moving atoms to positions of greater internal energy; this motion is small and fast, requiring only about 10^-12 seconds. Where molecular mobility permits, relatively facile rotation about backbone carbon-carbon single bonds produces large conformational changes: extension along the stress direction decreases conformational entropy. Elastomers respond almost wholly by the entropic mechanism, with little distortion of covalent bonds or change in internal energy (Roylance, Engineering Viscoelasticity, MIT 2001, https://web.mit.edu/course/3/3.11/www/modules/visco.pdf, jev weight 0.65, verified by direct PDF read).

The combined first and second laws of thermodynamics show that the retractive force contains both an internal-energy (energetic) component and an entropy (entropic) component, and the relative importance of the entropic contribution increases with temperature T. This provides a convenient experimental diagnostic of whether a material's stiffness is energetic or entropic in origin (Roylance, same source, weight 0.65). A peer-reviewed review concurs: stress is carried partly by fast elastic bond and segment distortions and partly by slower, thermally activated conformational rearrangements that relax stress over time (Elastic Entropic Forces in Polymer Deformation, PMC, https://pmc.ncbi.nlm.nih.gov/articles/PMC9497990/, weight 0.63).

A caution against over-attributing everything to entropy: simulations of strain hardening in polymer glasses find entropic network models overpredict stress and get the temperature trend wrong at large strains; the strongest hardening reflects energetic increases as chains are pulled taut between entanglements, with a weak entropic contribution mainly in shape recovery above Tg (Rottler and Robbins, Phys Rev E 77, 031801, 2008, https://journals.aps.org/pre/abstract/10.1103/PhysRevE.77.031801, weight 0.65).

## Glassy and rubbery regimes and modulus magnitudes

Well below Tg, entropic motions are frozen out and only elastic bond deformations are possible. The polymer then responds nearly instantaneously and reversibly, but cannot strain beyond a few percent before brittle fracture; its "glassy modulus" Eg is on the order of 3 GPa (400 kpsi). As temperature rises through Tg, stiffness drops dramatically, by perhaps 2 orders of magnitude, to the "rubbery modulus" Er (Roylance, weight 0.65, verified). In permanently crosslinked elastomers (for example sulphur vulcanized), Er is determined primarily by crosslink density. In an uncrosslinked polymer the rubbery stiffness shows only a short plateau, because molecular entanglements act as temporary network junctions; at higher temperature the entanglements slip and the material becomes a viscous liquid. Neither Eg nor Er depends strongly on time, but near Tg time effects are very important (Roylance, weight 0.65).

Near Tg the material is midway between the regimes: a combination of viscous fluidity and elastic solidity, termed "leathery" or, technically, viscoelastic (Roylance, weight 0.65). The glass transition is not an equilibrium phase transition; the glassy state is non-equilibrium, and properties depend on cooling rate and aging history (Thermodynamics of the Glassy Polymer State, PMC, https://pmc.ncbi.nlm.nih.gov/articles/PMC10820664/, weight 0.65).

## Tg, free volume, and rate expressions

Roylance uses a "free volume" picture, roughly the space available for molecular segments to move cooperatively, to intuit rates of conformational change, which follow Arrhenius-type expressions, rate proportional to exp(−E†/RT), where E† is an apparent activation energy and R = 8.314 J/mol-K. At temperatures much above Tg the rates are essentially instantaneous (rubbery response); well below Tg they are negligible (glassy response) (Roylance, weight 0.65, verified). Roylance further notes the Arrhenius treatment usually applies to secondary transitions, while the primary glass-rubber transition is better described by the WLF shift-factor equation; for an Arrhenius relaxation time τ(T) = τ0 exp(E†/RT) the shift factor is log aT = (E†/2.303R)(1/T − 1/Tref) (Roylance, weight 0.65, verified).

The WLF equation, log aT = −C1(T − Tr)/(C2 + (T − Tr)), applies to amorphous polymers from Tg to about Tg + 100 K and is fundamentally linked to free volume theory through the Doolittle equation relating viscosity to the occupied-to-free volume ratio. The often-quoted universal constants C1 = 17.44 and C2 = 51.6 K at Tr = Tg are not strictly universal and vary by polymer; WLF is mathematically equivalent to the Vogel-Fulcher-Tammann form (Williams-Landel-Ferry equation, Wikipedia, https://en.wikipedia.org/wiki/Williams%E2%80%93Landel%E2%80%93Ferry_equation, weight 0.63; The meaning of the "universal" WLF parameters, J Chem Phys, https://pubs.aip.org/aip/jcp/article-pdf/doi/10.1063/1.4905216/13609487/014905_1_online.pdf, weight 0.64; Application of a Universal and Developed WLF Equation, PMC, https://pmc.ncbi.nlm.nih.gov/articles/PMC6418538/, weight 0.64).

Crosslink density (chains per unit volume) raises Tg and reduces free volume, because a denser network restricts segmental mobility (Structural Relaxation and Vitrification in Dense Cross-Linked Polymer Networks, Macromolecules, https://pubs.acs.org/doi/full/10.1021/acs.macromol.2c00277, weight 0.63; Glass Transition, Free Volume, and Plasticization, NC State Pressbooks, https://ncstate.pressbooks.pub/advancesinpolymerscience/chapter/glass-transition-free-volume-and-plasticization/, weight 0.65).

## Crosslink density and kinetic theory of rubber elasticity

For a crosslinked elastomer, kinetic theory gives the uniaxial stress as σ = NRT(λ − 1/λ²), where σ is stress, N is crosslink density in mol/m³, R the gas constant, T absolute temperature, and λ = L/L0 the extension ratio. Differentiating this expression gives the small-strain modulus Er = 3NRT (Roylance, Eqn 3, weight 0.65, verified by direct PDF read). Note: the corpus brief stated σ = NRT(λ − 1/λ); the verified PDF text reads λ − 1/λ², so this doc anchors on the PDF.

Search-surfaced treatments retain the Gaussian-chain strain dependence and multiply by network constraint factors, for example a form σ = kBT ν ρr ψ (λ − 1/λ²) with ν crosslink density and ψ a constraint factor (source surfaced in search, https://pdfs.semanticscholar.org/d4de/5b7b32c6c99e620bf34ddf0b3b674d67bff4.pdf, weight 0.63, not full-text verified). Modern kinetic theories add steric constraints and entanglements beyond the early ideal-network picture (search-surfaced, same snippet cluster, not full-text verified).

## Thermoelastic diagnostic

At fixed elongation the retractive force in rubber increases with temperature, as greater thermal agitation makes the internal structure more vigorous in its attempt to restore randomness; in a stretched steel specimen, which shows little entropic elasticity, the retractive force decreases with temperature (Roylance, weight 0.65, verified). In the ideal entropic model the force at constant length rises linearly with absolute temperature, and a rubber held at constant stress shrinks on heating; below roughly 10 percent extension real rubbers show thermoelastic inversion, tension falling on heating, because small internal-energy contributions compete with the dominant entropic term (Rubber elasticity course notes, U Lethbridge, https://people.uleth.ca/~roussel/C4000statmech/rubber.pdf, weight 0.63; Thermodynamic theory of polymer elasticity, Wikipedia, https://en.wikipedia.org/wiki/Thermodynamic_theory_of_polymer_elasticity, weight 0.65; Proc Roy Soc B 1952, https://royalsocietypublishing.org/rspb/article-pdf/139/897/506/154387/rspb.1952.0026.pdf, weight 0.64).

## Method note

The specified searXNG dig endpoint returned HTTP 500 on every attempt, including the previously working preflight query, across 3 retry rounds with modified queries and parameter variants. Sources were gathered via web search fallback instead; jev weighting and direct anchor verification (Roylance PDF fetched and read) proceeded as specified.

## Sources considered

| # | Title | URL | Engine | jev weight |
| --- | --- | --- | --- | --- |
| 1 | Engineering Viscoelasticity (Roylance, MIT) | https://web.mit.edu/course/3/3.11/www/modules/visco.pdf | websearch-fallback | 0.65 |
| 2 | Linear Viscoelasticity (Roylance, LibreTexts) | https://eng.libretexts.org/Bookshelves/Mechanical_Engineering/Mechanics_of_Materials_(Roylance)/05%3A_General_Stress_Analysis/5.04%3A_Linear_Viscoelasticity | websearch-fallback | 0.62 |
| 3 | Elastic Entropic Forces in Polymer Deformation (PMC) | https://pmc.ncbi.nlm.nih.gov/articles/PMC9497990/ | websearch-fallback | 0.63 |
| 4 | Thermodynamics of the Glassy Polymer State (PMC) | https://pmc.ncbi.nlm.nih.gov/articles/PMC10820664/ | websearch-fallback | 0.65 |
| 5 | Strain hardening of polymer glasses (Phys Rev E) | https://journals.aps.org/pre/abstract/10.1103/PhysRevE.77.031801 | websearch-fallback | 0.65 |
| 6 | Lecture 11: Rubber elasticity (ETH Zurich) | https://ethz.ch/content/dam/ethz/special-interest/mavt/process-engineering/macro-dam/documents/NetworkGels_Lecture11.pdf | websearch-fallback | 0.64 |
| 7 | Molecular Model for Linear Viscoelastic Properties of Entangled Polymer Networks (PMC) | https://pmc.ncbi.nlm.nih.gov/articles/PMC11562782/ | websearch-fallback | 0.63 |
| 8 | Molecular-level modeling of viscoelasticity of crosslinked polymers (U South Carolina) | https://scholarcommons.sc.edu/cgi/viewcontent.cgi?article=1206&context=eche_facpub | websearch-fallback | 0.64 |
| 9 | A Thermodynamic Perspective on Polymer Glass Formation (Chin J Polym Sci) | https://www.cjps.org/en/article/doi/10.1007/s10118-023-2951-1/ | websearch-fallback | 0.63 |
| 10 | Structural Relaxation and Vitrification in Dense Cross-Linked Polymer Networks (Macromolecules) | https://pubs.acs.org/doi/full/10.1021/acs.macromol.2c00277 | websearch-fallback | 0.63 |
| 11 | Glass Transition, Free Volume, and Plasticization (NC State Pressbooks) | https://ncstate.pressbooks.pub/advancesinpolymerscience/chapter/glass-transition-free-volume-and-plasticization/ | websearch-fallback | 0.65 |
| 12 | NIST JRES polymer glass transition paper | https://nvlpubs.nist.gov/nistpubs/jres/102/2/j22shi.pdf | websearch-fallback | 0.64 |
| 13 | Polymers 14 00009 open access review | https://hal.science/hal-03767664v1/file/polymers-14-00009.pdf | websearch-fallback | 0.65 |
| 14 | C.M. Roland, Oxford chapter on polymer viscoelasticity | http://polymerphysics.net/pdf/Oxford%20Chapter%204.pdf | websearch-fallback | 0.62 |
| 15 | Rubber elasticity course notes (U Lethbridge, Roussel) | https://people.uleth.ca/~roussel/C4000statmech/rubber.pdf | websearch-fallback | 0.63 |
| 16 | Thermodynamic theory of polymer elasticity (Wikipedia) | https://en.wikipedia.org/wiki/Thermodynamic_theory_of_polymer_elasticity | websearch-fallback | 0.65 |
| 17 | Rubber as an Aid to Teach Thermodynamics (Resonance) | https://www.ias.ac.in/article/fulltext/reso/024/02/0217-0238 | websearch-fallback | 0.63 |
| 18 | The thermodynamic study of rubber-like elasticity (Proc Roy Soc B 1952) | https://royalsocietypublishing.org/rspb/article-pdf/139/897/506/154387/rspb.1952.0026.pdf | websearch-fallback | 0.64 |
| 19 | Williams-Landel-Ferry equation (Wikipedia) | https://en.wikipedia.org/wiki/Williams%E2%80%93Landel%E2%80%93Ferry_equation | websearch-fallback | 0.63 |
| 20 | Application of a Universal and Developed WLF Equation (PMC) | https://pmc.ncbi.nlm.nih.gov/articles/PMC6418538/ | websearch-fallback | 0.64 |
| 21 | The meaning of the universal WLF parameters (J Chem Phys) | https://pubs.aip.org/aip/jcp/article-pdf/doi/10.1063/1.4905216/13609487/014905_1_online.pdf | websearch-fallback | 0.64 |
| 22 | Rubber Elasticity (matter.org.uk) | https://www.matter.org.uk/matscicdrom/manual/rb.html | websearch-fallback | 0.64 |
| 23 | The Physics of Deformation and Fracture of Polymers (preview) | https://api.pageplace.de/preview/DT0400.9781139602952_A23868265/preview-9781139602952_A23868265.pdf | websearch-fallback | 0.63 |
| 24 | Isothermal viscoelastic properties of PMMA and LDPE (Rheol Acta) | https://silver.neep.wisc.edu/~lakes/RheoAct08.pdf | websearch-fallback | 0.62 |
