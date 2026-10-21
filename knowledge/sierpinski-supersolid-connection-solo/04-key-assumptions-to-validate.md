# 04. Key Assumptions to Validate

**Scope:** Key Assumptions to Validate: detailed analysis grounded in yubi-OS/yubiOS refs/sierpinski-supersolid-connection-solo-2026-10-06.md.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/sierpinski-supersolid-connection-solo-2026-10-06.md, no external web dig

## Three assumptions

The source lists 3 unchecked assumptions. Each is phrased so a single, cheap test can resolve it.

### Assumption 1: usable public imaging exists

**Statement.** Public supersolid imaging data with phase labels exists at usable resolution (arXiv figures or supplementary material of Er and Dy droplet crystals). The research lanes verify.

**Why it matters.** The MVP's second step is a public-imagery pass. If no labeled imagery exists at usable resolution, the MVP collapses to the synthetic corpus alone.

**How to test.** Search, download, and inventory figures with explicit phase labels; record pixel dimensions and inter-droplet spacing in pixels.

**What the record shows.** The companion doc (yubi-OS/yubiOS refs/sierpinski-supersolid-connection-2026-10-06.md) found two public sources. The Trypogeorgos Nature 2025 Zenodo dataset (doi:10.5281/zenodo.14251103) turned out to hold 1D profiles, not 2D images. Norcia et al. 2021 Fig. 2b supplied 8 single-trial in-situ panels across the linear-to-zig-zag transition at native 279 by 377. The assumption held partially: labeled 2D imagery exists, but scarcely.

### Assumption 2: the pinned window is meaningful at figure resolution

**Statement.** The pinned box-counting window (4 to 64 px) and about 6% ink coverage are meaningful at published figure resolutions. Testable by measuring figure pixel scales before running.

**Why it matters.** Box-counting reads structure only between the smallest and largest box. If droplets are 3 px wide, s = 4 cannot resolve them; if spacing is 30 px, s = 64 is in saturation.

**How to test.** Measure droplet diameter and spacing in pixels on each candidate panel before any D run.

**What the record shows.** The companion doc's instrument lane estimated typical in-situ panels at 240 to 470 px with spacing of about 40 to 80 px, and restricted real-figure claims to panels with spacing of at least about 40 px. On real data, half-resolution live runs had r-squared of 0.931 to 0.972 and correctly fired `low_confidence`, while native resolution gave 0.983 to 0.998. Resolution is a real confound, and the r-squared gate catches it.

### Assumption 3: D discriminates in synthetic generators first

**Statement.** D discriminates ordered droplet crystal versus incoherent droplets versus superfluid in synthetic generators first (Sierpinski-anchored falsification corpus, fractalrabbit gates). Cheap and fully under our control.

**Why it matters.** This is the logical gate for everything else. If D fails to separate classes on clean synthetic data where the answer is known by construction, no real-data result can be trusted.

**How to test.** Three generators by N seeds through the live route, with pre-registered bands.

**What the record shows.** The companion doc's results split the assumption into parts. The Sierpinski generator separated cleanly from everything (v2 gate slope 1.5968 at L=384 against 1.585 plus or minus 0.05). The lattice and shuffle classes first appeared separated (1.2636 versus 1.030 to 1.046), but a matched-extent jitter control read a mean of 1.2609, a difference of 0.0027 from the lattice: the gap was array extent, not order. Assumption 3 therefore held for hierarchy and failed for order.

## The open questions as implicit assumptions

The source's Open Questions read as three further assumptions:

- **Novelty.** Has anyone already published box-counting analysis of supersolid imaging? If yes, the project is a replication plus extension. The companion doc found box-counting applied only to disordered or turbulent BEC images, not to droplet crystals.
- **Niche occupancy.** Do Sierpinski-triangle optical-lattice BEC experiments already occupy the "Sierpinski hierarchy in a quantum gas" niche? The companion doc found fractal substrates (imposed geometry) but no fractal order in a superfluid.
- **Compression confound.** Is figure-resolution loss a confound? Mitigation: crop panels, pin coverage, report `under_inked` flags.

## Why the assumptions are cheap

Every assumption has a test that runs on public data or synthetic renders. None requires new theory, simulation infrastructure, or collaboration. That is why the source records no un-testable bet large enough to kill the direction.

## Reading the validation honestly

The assumption list did its job. Two of three held, one held partially, and the failure (D does not read order at matched extent) was caught by a pre-registered control before it entered the record as a claim.
