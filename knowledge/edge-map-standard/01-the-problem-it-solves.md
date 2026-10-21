# 01. The Problem It Solves: Pipeline-Dependent Fractal Dimension

**Scope:** The problem it solves: detailed analysis grounded in yubi-OS/yubiOS refs/edge-map-standard-2026-10-05.md.

Ground source: `yubi-OS/yubiOS refs/edge-map-standard-2026-10-05.md`. Dig context: `dig_context_01.json` (10 clef-weighted searXNG results).

## The core claim

The ground-source doc opens with one sentence that frames the whole instrument: the measured fractal dimension of an image's edge map is **pipeline-dependent**. The edge operator, its thresholds, the stroke width, and the ink density are all inputs to the box-counting estimate. A box-counting D is therefore not a property of the photo alone; it is a property of the photo plus every extraction decision made upstream of the counter.

## What box counting actually measures

The external literature agrees on the counting step itself, which is why the problem lands on extraction. The PoreSpy tutorial describes box counting as counting N, the number of boxes of side D that span an edge, and reading the fractal dimension from how N scales with box size, using the Sierpinski carpet as a known-answer check: [Measuring fractal dimension by box-counting - PoreSpy](https://porespy.org/examples/metrics/tutorials/computing_fractal_dim.html) (clef weight: 0.2133) (weak backing, clef weight < 0.5). The Wikipedia overview frames the method as breaking an image into smaller and smaller pieces and recording how the count changes: [Box counting - Wikipedia](https://en.wikipedia.org/wiki/Box_counting) (clef weight: 0.1226) (weak backing, clef weight < 0.5). The Fractal Foundation course notes that D is easy to determine for geometric fractals like the Sierpinski triangle, where the answer is known in closed form: [Fractal Foundation Online Course - Chapter 1 - FRACTALS IN NATURE](https://fractalfoundation.org/OFC/OFC-10-5.html) (clef weight: 0.1357) (weak backing, clef weight < 0.5). A ScienceDirect paper calls box counting an effective way to describe geometric complexity and proposes refinements to the computation: [An effective method to compute the box-counting dimension based on the ...](https://www.sciencedirect.com/science/article/pii/S2590123020300128) (clef weight: 0.2948) (weak backing, clef weight < 0.5).

None of these sources say the counter decides what an "edge" is. The counter receives a binary set and measures it. Everything that shapes that set (operator choice, threshold, stroke thickness, how much of the frame is inked) arrives before the first box is laid down. That is the gap edge-standard-v1 closes.

## The trial that exposed it

The ground-source doc records the decisive comparison on 2026-10-05:

- **Trial-1**: 18 real photos through ffmpeg `edgedetect` plus an ad-hoc threshold read D 1.5 to 1.6. That range is systematically above the empirical-aesthetics band, and the doc attributes the offset purely to extraction choices.
- **Trial-2**: the same 18 photos through edge-standard-v1 read D 1.11 to 1.40.

Same photos, same counter, a shift of roughly 0.2 to 0.4 in D. The doc's conclusion: "Comparability is won or lost at extraction, not counting."

## Why the aesthetics band makes this urgent

The taste engine's `fractal_band` axis reads D against a human-preference band. The empirical-aesthetics literature that defines that band is the reason a 0.2 offset matters. The Academia copy of Spehar et al. (2003) summarizes that humans show consistent aesthetic preferences for fractals peaking between dimensions 1.3 and 1.5: [(PDF) Universal aesthetic of fractals (Spehar, 2003) / Academia](https://www.academia.edu/5082176/Universal_aesthetic_of_fractals) (clef weight: 0.1230) (weak backing, clef weight < 0.5). The ScienceDirect record of the same "Universal aesthetic of fractals" paper states the authors tested that preference as a function of fractal dimension rather than other image properties: [Universal aesthetic of fractals - ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0097849303001547) (clef weight: 0.0601) (weak backing, clef weight < 0.5). A Frontiers paper extended the preference work to 1D contour images such as mountain profiles and catalogued individual variation in responses: [Taxonomy of Individual Variations in Aesthetic Responses to Fractal ...](https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2016.00350/full) (clef weight: 0.1508) (weak backing, clef weight < 0.5). A PMC review of fractal-based design uses D to quantify visual intricacy and links it to preference and psychological effects: [Aesthetics and Psychological Effects of Fractal Based Design - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8416160/) (clef weight: 0.2184) (weak backing, clef weight < 0.5).

If the preference peak sits at 1.3 to 1.5 and an unstandardized pipeline inflates every photo to 1.5 to 1.6, then every photo looks like it sits at or above the top of the band. The axis would fire or miss for reasons that have nothing to do with the image. Trial-2 moved the same set into 1.11 to 1.40, which is where a comparison to the band becomes meaningful at all.

## What the problem is not

The doc is careful about scope. Standardization makes measurements **comparable**. It does not by itself prove that the contour-class D the pipeline emits maps onto the same scale the aesthetics studies used; that question is deferred to the honest-limits section (doc 06). The Frontiers result on contour images ([Taxonomy of Individual Variations in Aesthetic Responses to Fractal ...](https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2016.00350/full) (clef weight: 0.1508) (weak backing, clef weight < 0.5)) is relevant context there, since the ground source notes contour-class peaks may sit below 1.3 per Isherwood 2016.

## Off-topic results in this dig

Two results in the dig were off-topic and carry near-zero weight: a Box.com login page [Box / Login](https://account.box.com/login) (clef weight: 0.0303) (weak backing, clef weight < 0.5) and a Wikipedia article on a video game [The Witcher 3: Wild Hunt - Wikipedia](https://en.wikipedia.org/wiki/The_Witcher_3:_Wild_Hunt) (clef weight: 0.0659) (weak backing, clef weight < 0.5). They are listed for audit completeness and back no claim here.

## Takeaway

The problem edge-standard-v1 solves is upstream variance. Box counting is a well-understood, known-answer-checkable measurement, but it measures whatever set it is handed. Without a pinned extraction chain, two runs on the same photo can disagree by more than the width of the preference band. The instrument's job is to make the set it hands the counter reproducible, so that D can be compared across images, sources, and implementations.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Measuring fractal dimension by box-counting - PoreSpy | https://porespy.org/examples/metrics/tutorials/computing_fractal_dim.html | 0.2133 | weak backing, clef weight < 0.5 |
| 2 | Fractal Foundation Online Course - Chapter 1 - FRACTALS IN NATURE | https://fractalfoundation.org/OFC/OFC-10-5.html | 0.1357 | weak backing, clef weight < 0.5 |
| 3 | An effective method to compute the box-counting dimension based on the ... | https://www.sciencedirect.com/science/article/pii/S2590123020300128 | 0.2948 | weak backing, clef weight < 0.5 |
| 4 | Box counting - Wikipedia | https://en.wikipedia.org/wiki/Box_counting | 0.1226 | weak backing, clef weight < 0.5 |
| 5 | Box / Login | https://account.box.com/login | 0.0303 | weak backing, clef weight < 0.5 |
| 6 | Universal aesthetic of fractals - ScienceDirect | https://www.sciencedirect.com/science/article/pii/S0097849303001547 | 0.0601 | weak backing, clef weight < 0.5 |
| 7 | (PDF) Universal aesthetic of fractals (Spehar, 2003) / Academia | https://www.academia.edu/5082176/Universal_aesthetic_of_fractals | 0.1230 | weak backing, clef weight < 0.5 |
| 8 | Taxonomy of Individual Variations in Aesthetic Responses to Fractal ... | https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2016.00350/full | 0.1508 | weak backing, clef weight < 0.5 |
| 9 | The Witcher 3: Wild Hunt - Wikipedia | https://en.wikipedia.org/wiki/The_Witcher_3:_Wild_Hunt | 0.0659 | weak backing, clef weight < 0.5 |
| 10 | Aesthetics and Psychological Effects of Fractal Based Design - PMC | https://pmc.ncbi.nlm.nih.gov/articles/PMC8416160/ | 0.2184 | weak backing, clef weight < 0.5 |
