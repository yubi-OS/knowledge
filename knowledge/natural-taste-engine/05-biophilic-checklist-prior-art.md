# 05 Biophilic checklists and Birkhoff: the other prior art

Scope: the non-ML taste scoring prior art, expert-weighted biophilic instruments (BID-M family, Biophilic Healing Index, BiomiMETRIC) and the Birkhoff order/complexity measure, and why neither supplies what the natural-taste engine needs.

## The biophilic instruments: expert judgment, formalized

A family of assessment instruments scores built environments for biophilic quality, and they share one architecture: expert-weighted checklists. The Biophilic Design Matrix (BDM), the biophilic quality index (BQI), and the Biophilic Index-B are three indexes specifically developed to ascertain the biophilic quality of a design (https://www.sciencedirect.com/science/article/pii/S266679162500003X, weight 0.92). A related model, the Biophilic Interior Design Assessment Model (BIDAM), assesses how effectively interior spaces incorporate biophilic design principles using image analysis of floor plans plus qualitative and quantitative research methods (https://journals.sagepub.com/doi/10.1177/10717641261420415, weight 0.58).

The Biophilic Healing Index (BHI) is the most instructive case because its authors are explicit about its epistemic status. It is described as a professional tool for architects, urban designers, and planners that is in the process of validation (https://link.springer.com/chapter/10.1007/978-3-031-47794-2_33, weight 0.95). Its founding publication frames the core claim as a conjecture: the Biophilic Index correlates directly with long-term healing effects of the built environment, and the discussion is intended to spark interest for more experimentation, with direct verification left to future publications (https://www.biourbanism.org/the-biophilic-healing-index-predicts-effects-of-the-built-environment-on-our-wellbeing/, weight 0.54).

## What the checklists lack

The project record's verdict on this family: existing biophilic scoring is expert-weighted checklists, not physics-derived (project record, source doc 2026-10-05). The instruments above confirm the diagnosis from their own descriptions. Their inputs are attribute inventories (does the space include this biophilic pattern), their weights come from expert judgment, and their validation is either in progress (weight 0.95) or explicitly deferred as a conjecture (weight 0.54). None derives its score from a measured physical quantity of the artifact itself. A taste engine that wants per-axis measured features (a fractal dimension, a branch exponent, a symmetry score) cannot reuse this layer, though the biophilic pattern taxonomy remains a useful vocabulary for what natural-systems families an artifact might belong to.

## Birkhoff's aesthetic measure: the numeric ancestor

The other prior art is older and more numeric. Birkhoff's aesthetic measure defines the aesthetic measure M of an art object as a function of its order and complexity, M = f(O/C), where O stands for order and C for complexity (https://www.researchgate.net/publication/323296865_Birkhoff's_aesthetic_measure, weight 0.16, weak backing; the definition is corroborated by the IEEE source below). A survey of informational aesthetics measures describes the interpretation of Birkhoff's measure as the ratio between order and complexity and its revival inside information-theoretic aesthetics (https://oadoi.org/10.1109/MCG.2008.34, weight 0.69). An earlier formulation, M = f(C/O), appears in a digital-art database article referencing the 1930s Aesthetic Measure (http://dada.compart-bremen.de/browse/article, weight 0.27, weak).

The project record cites a Birkhoff order/complexity revival achieving R-squared approximately 0.96 on vases, one parametric family (project record, source doc 2026-10-05). The dig did not surface that specific vase study; treat the figure as an internal record without external confirmation from this dig. The relevant lesson survives either way: order/complexity measures can achieve high in-family fit while failing to generalize, which is exactly why the engine's complexity_economy axis is a proxy measured across multiple scales, never a claimed universal beauty function.

## Complexity measurement grounding

One external anchor supports the measurement side. The Stanford Encyclopedia of Philosophy's entry on information covers the mathematical theories of information that underpin complexity-based aesthetics (https://plato.stanford.edu/entries/information, weight 0.87), and the informational-aesthetics survey explicitly frames Birkhoff's measure as the ancestor of information-theoretic aesthetics measures (weight 0.69). The engine's complexity_economy axis uses LZ/gzip compression statistics of the downsampled artifact at 2 or more scales as a structure-function proxy, and the project record forbids claiming it measures "effective complexity" (project record, source doc 2026-10-05): the compression statistic is operational, the philosophical construct is not measured by it.

## What this prior art contributes to the engine

Three imports, all design-level:

1. The biophilic family taxonomy (tree, river network, honeycomb, coral, lattice, random) maps cleanly onto the engine's family axis, a clef choice question for grounding rather than scoring (project record).
2. The BHI's in-progress validation is a model of honest status labeling: an axis ships as a conjecture with its validation state named, never as settled (weights 0.95 and 0.54).
3. Birkhoff's O/C ratio, revived informationally, is the precedent that numeric aesthetic measures are publishable and testable, and the cautionary precedent that in-family fit does not transfer across families.

The natural-taste engine's differentiation from both families is structural: deterministic extractors produce the inputs, a calibrated typed decision model classifies against bands, and every axis carries its own measured number, so a score is always decomposable into the physical quantities that produced it.
