# 02. Grounding (what exists already)

**Scope:** Grounding (what exists already): detailed analysis grounded in yubi-OS/yubiOS refs/sierpinski-supersolid-connection-solo-2026-10-06.md.

## What already exists, by category

The ground source (yubi-OS/yubiOS refs/sierpinski-supersolid-connection-solo-2026-10-06.md) groups existing assets into three categories: the instrument, the corpus, and the physics.

## The instrument

`POST /api/jev/corpus/taste/edge-standard` on the steady-orbit worker, documented in the taste section of AGENT.md. Its pipeline, as listed in the source:

- raw grayscale in;
- ink normalization to about 6% coverage;
- Moore-traced 1-px contours;
- a pinned box-counting window of 4 to 64 px over 8 scales;
- an r-squared gate.

The Python source of record lives at `tools/edge-standard/` and is wired into lean CI with a **Sierpinski theoretical band check**: the selftest's known-answer anchor is the Sierpinski gasket, whose exact D = log 3 / log 2 anchors the pipeline.

### How the instrument relates to standard box-counting

Box-counting, also called the Minkowski-Bouligand dimension, estimates dimension from how the number of occupied boxes scales with box size [Minkowski–Bouligand dimension - Wikipedia](https://en.wikipedia.org/wiki/Minkowski%E2%80%93Bouligand_dimension) (weak backing, clef weight < 0.5; clef weight: 0.4631). The Box counting Wikipedia entry notes that, for box-counting dimension, the information recorded per box is usually yes or no occupancy [Box counting - Wikipedia](https://en.wikipedia.org/wiki/Box_counting) (weak backing, clef weight < 0.5; clef weight: 0.3338). PoreSpy's tutorial walks through the same theory, credited to Mandelbrot's 1967 introduction of the term [Measuring fractal dimension by box-counting - PoreSpy](https://porespy.org/examples/metrics/tutorials/computing_fractal_dim.html) (weak backing, clef weight < 0.5; clef weight: 0.4643), and a MATLAB File Exchange function returns D from a binary image where nonzero pixels form the object [Hausdorff (Box-Counting) Fractal Dimension - File Exchange...](https://www.mathworks.com/matlabcentral/fileexchange/30329-hausdorff-box-counting-fractal-dimension) (weak backing, clef weight < 0.5; clef weight: 0.1210). edge-standard-v1 differs from these generic tools in two ways that matter: it **standardizes** the input (ink coverage, contour tracing) before counting, and it **pins** the window so results are comparable across sources. Wavelet-based multifractal analysis [Wavelet-based multifractal analysis](http://www.scholarpedia.org/article/Wavelet-based_multifractal_analysis) (weak backing, clef weight < 0.5; clef weight: 0.3968) is a richer alternative formalism the pipeline does not use.

## The corpus

The source names four knowledge corpora already in the org:

- `knowledge/natural-taste-engine/`: fractal-dimension preference bands and the branch exponent.
- `knowledge/edge-map-standardization/`: the IBSI-style standardization doctrine.
- `knowledge/landau-radius-research/`: supersolid and superfluid material from the vortex-glass and Ginzburg-Landau round, including the caution that transport evidence "does not directly establish simultaneous coherent superflow and density ordering."
- `knowledge/fractalrabbit-falsification-harness/`: controlled synthetic generators and falsification gates, which the source calls "exactly the validation discipline this connection needs."

## The physics

The source summarizes: supersolids are simultaneous superfluid order and crystalline density modulation; the dipolar-gas realizations (erbium and dysprosium) show droplet crystals, phase coherence, metastability, and hysteresis under ramped interaction strength.

The dig adds context on self-bound droplets in curved and three-dimensional geometries. A 2025 PRL proposes a shell-shaped quantum droplet in a three-component ultracold Bose gas, framing shell-shaped BECs as "a typical quantum system in curved geometry" [Shell-Shaped Quantum Droplet in a Three-Component Ultracold Bose Gas](https://link.aps.org/doi/10.1103/PhysRevLett.134.043402) (clef weight: 0.7422); the same work appears as arXiv 2312.15846 in PDF [Shell-Shaped Quantum Droplet in a Three-Component Ultracold Bose Gas](https://arxiv.org/pdf/2312.15846) (clef weight: 0.6279) and HTML [Shell-shaped quantum droplet in a three-component ultracold Bose gas](https://arxiv.org/html/2312.15846v2) (clef weight: 0.6466) versions. An IOP review covers quantum droplets in three-dimensional BECs, noting that mean-field theory predicts collapse under attraction and that beyond-mean-field effects stabilize droplets [Quantum droplets in three-dimensional Bose-Einstein condensates](https://iopscience.iop.org/article/10.1088/1361-6455/ac6365) (clef weight: 0.6280). These are relevant to the source's later "pumpkin" exploration, which uses spherical-harmonic morphology; the spherical harmonics Wikipedia entry gives the mathematical background [Spherical harmonics - Wikipedia](https://en.wikipedia.org/wiki/Spherical_harmonics) (weak backing, clef weight < 0.5; clef weight: 0.2692).

## What the grounding implies

Three conclusions follow:

1. **No new instrument is needed.** The measurement route exists, is CI-guarded, and already carries the Sierpinski anchor.
2. **No new validation method is needed.** The fractalrabbit harness pattern (synthetic generators, pre-registered gates) transfers directly.
3. **A gold-set protocol already worked once.** The source notes that the same protocol was validated on 123 Viengkham and Spehar paintings: download, standardize, compare against published labels. The supersolid pass reuses it with phase labels in place of aesthetic labels.

## The gap the grounding exposes

What does not exist is any synthetic droplet-morphology generator, any measured D band for supersolid classes, or any phase-labeled image set run through the pipeline. Those three absences define the MVP.

## Evidence quality note

5 of 10 dig results clear 0.5 (the shell-droplet and 3D-droplet papers). The box-counting references sit between 0.12 and 0.47 and are labelled weak backing; they describe the generic method, not the yubiOS instrument.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Shell-Shaped Quantum Droplet in a Three-Component Ultracold Bose Gas | https://arxiv.org/pdf/2312.15846 | 0.6279 | authoritative (>= 0.5) |
| 2 | Spherical harmonics - Wikipedia | https://en.wikipedia.org/wiki/Spherical_harmonics | 0.2692 | weak (< 0.5) |
| 3 | Shell-shaped quantum droplet in a three-component ultracold Bose gas | https://arxiv.org/html/2312.15846v2 | 0.6466 | authoritative (>= 0.5) |
| 4 | Shell-Shaped Quantum Droplet in a Three-Component Ultracold Bose Gas | https://link.aps.org/doi/10.1103/PhysRevLett.134.043402 | 0.7422 | authoritative (>= 0.5) |
| 5 | Quantum droplets in three-dimensional Bose-Einstein condensates | https://iopscience.iop.org/article/10.1088/1361-6455/ac6365 | 0.6280 | authoritative (>= 0.5) |
| 6 | Minkowski–Bouligand dimension - Wikipedia | https://en.wikipedia.org/wiki/Minkowski%E2%80%93Bouligand_dimension | 0.4631 | weak (< 0.5) |
| 7 | Measuring fractal dimension by box-counting - PoreSpy | https://porespy.org/examples/metrics/tutorials/computing_fractal_dim.html | 0.4643 | weak (< 0.5) |
| 8 | Box counting - Wikipedia | https://en.wikipedia.org/wiki/Box_counting | 0.3338 | weak (< 0.5) |
| 9 | Hausdorff (Box-Counting) Fractal Dimension - File Exchange... | https://www.mathworks.com/matlabcentral/fileexchange/30329-hausdorff-box-counting-fractal-dimension | 0.1210 | weak (< 0.5) |
| 10 | Wavelet-based multifractal analysis | http://www.scholarpedia.org/article/Wavelet-based_multifractal_analysis | 0.3968 | weak (< 0.5) |
