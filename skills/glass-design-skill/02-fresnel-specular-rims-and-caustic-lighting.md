# 02 - fresnel-specular-rims-and-caustic-lighting

**Scope:** Asymmetric Fresnel rim lighting via multi-layer inset box-shadow stacks, diagonal specular sheen overlays, and pointer-tracked caustic highlights.

## Asymmetric Fresnel Rim Lighting and Meniscus Sheen

A uniform 1px border reads as a flat wireframe box rather than physical glass. Real top-lit glass exhibits an asymmetric Fresnel rim where the top edge catches overhead incident light at 2x to 2.5x the intensity of the lateral edges, paired with a softer internal caustic reflection along the bottom bezel ([10+ CSS Liquid Glass Effects: Free Code Snippets & Examples](https://freefrontend.com/css-liquid-glass/), weight 0.8597).

### Multi-Stop Inset Box-Shadow Stack

1. **Top Incident Meniscus:** `inset 0 1.2px 0.5px rgba(255, 255, 255, 0.52)` in Dark Mode and `inset 0 1.5px 0.5px rgba(255, 255, 255, 0.98)` in Light Mode ([Liquid Glass CSS Generator — Modern Glassmorphism Tool](https://design.dev/tools/liquid-glass-generator/), weight 0.8213).
2. **Bottom Caustic Reflection:** `inset 0 -1px 1px rgba(95, 217, 242, 0.18)` in Dark Mode and `inset 0 -1px 1px rgba(15, 23, 42, 0.06)` in Light Mode ([Liquid Glass Effect in CSS and WebGL: Recreate... | HTML-in-Canvas](https://html-in-canvas.dev/liquid-glass-effect/), weight 0.9451).
3. **Diagonal Gloss Sheen:** A `::before` or `::after` pseudo-element with `linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 30%, transparent 60%)` and `pointer-events: none` adds surface curvature without obscuring foreground typography ([10+ CSS Liquid Glass Effects: Free Code Snippets & Examples](https://freefrontend.com/css-liquid-glass/), weight 0.8597).

## Sources Considered (Clef `noul` Quality Weights)

| # | Source | Query | Clef Weight | Verdict |
|---|---|---|---|---|
| 1 | [10+ CSS Liquid Glass Effects: Free Code Snippets & Examples](https://freefrontend.com/css-liquid-glass/) | `liquid glass CSS specular rim inset box-shadow highlight` | **0.8597** | authoritative (kept) |
| 2 | [Liquid Glass CSS Generator — Modern Glassmorphism Tool](https://design.dev/tools/liquid-glass-generator/) | `liquid glass CSS specular rim inset box-shadow highlight` | **0.8213** | authoritative (kept) |
| 3 | [Liquid Glass Effect in CSS and WebGL: Recreate... - HTML-in-Canvas](https://html-in-canvas.dev/liquid-glass-effect/) | `liquid glass CSS specular rim inset box-shadow highlight` | **0.9451** | authoritative (kept) |
| 4 | [Liquid Glass CSS Generator — CSS and Tailwind - GradientDeck](https://gradientdeck.com/liquid-glass) | `liquid glass CSS specular rim inset box-shadow highlight` | **0.8105** | authoritative (kept) |
| 5 | [Glassmorphism CSS: 42 Frosted Glass Effects - Effect.Labs](https://effect-labs.com/en/pages/glassmorphism.html) | `glassmorphism Fresnel border specular lighting CSS gradient` | **0.4567** | low-weight (filtered) |
| 6 | [<gradient> CSS type - CSS - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient) | `glassmorphism Fresnel border specular lighting CSS gradient` | **0.6504** | authoritative (kept) |
| 7 | [Cake Recipes](https://www.allrecipes.com/recipes/276/desserts/cakes/) | `glassmorphism Fresnel border specular lighting CSS gradient` | **0.0412** | low-weight (filtered) |
| 8 | [CSS Glassmorphism Generator — Frosted Glass UI](https://sopkit.space/css-glassmorphism-generator/) | `glassmorphism Fresnel border specular lighting CSS gradient` | **0.3529** | low-weight (filtered) |
