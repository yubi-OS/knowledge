# 01 - optical-refraction-and-svg-displacement

**Scope:** Physically-based optical refraction in CSS and SVG using feDisplacementMap, signed distance field lens maps, sRGB interpolation, and chromatic dispersion.

## Optical Refraction Mechanics in CSS and SVG

Physical glass bends incident rays according to Snell's law ($n_1 \sin\theta_1 = n_2 \sin\theta_2$, with $n_{\text{air}} = 1.0$ and $n_{\text{glass}} \approx 1.5$) ([Liquid Glass in the Browser: Refraction with CSS and SVG — kube.io](https://kube.io/blog/liquid-glass-css-svg/), weight 0.9379). In browser engines, real-time backdrop refraction is approximated by feeding a 2D displacement vector field into an inline SVG `<feDisplacementMap>` filter and binding that filter via `backdrop-filter: url(#liquid-glass-lens)` ([10+ CSS Liquid Glass Effects: Free Code Snippets & Examples](https://freefrontend.com/css-liquid-glass/), weight 0.7653).

### Convex Squircle Bezel Profile and 8-Bit Channel Encoding

1. **Surface Height Function:** A convex squircle profile $y = (1 - (1 - x)^4)^{1/4}$ keeps refracted rays inside the element bounds and avoids harsh interior transition lines when stretched across rectangular cards ([Liquid Glass in the Browser: Refraction with CSS and SVG — kube.io](https://kube.io/blog/liquid-glass-css-svg/), weight 0.9379).
2. **RGBA Displacement Encoding:** `<feDisplacementMap>` reads 8-bit values in `[0, 255]` where `128` (`0x80`) represents zero displacement and `scale` sets the maximum pixel shift along `xChannelSelector="R"` and `yChannelSelector="G"` ([SVG Displacement Liquid Glass — Free CSS Code & Live Demo | CodeFronts](https://codefronts.com/design-styles/css-glassmorphism/svg-displacement-liquid-glass/), weight 0.8492).
3. **Color Space Invariant:** Always set `color-interpolation-filters="sRGB"` on the `<filter>` element so channel matharound neutral `128` does not drift under linearRGB gamma conversion ([SVG Displacement Liquid Glass — Free CSS Code & Live Demo | CodeFronts](https://codefronts.com/design-styles/css-glassmorphism/svg-displacement-liquid-glass/), weight 0.8492).

## Sources Considered (Clef `noul` Quality Weights)

| # | Source | Query | Clef Weight | Verdict |
|---|---|---|---|---|
| 1 | [Liquid Glass in the Browser: Refraction with CSS and SVG — kube.io](https://kube.io/blog/liquid-glass-css-svg/) | `liquid glass CSS SVG feDisplacementMap refraction lens` | **0.9379** | authoritative (kept) |
| 2 | [10+ CSS Liquid Glass Effects: Free Code Snippets & Examples](https://freefrontend.com/css-liquid-glass/) | `liquid glass CSS SVG feDisplacementMap refraction lens` | **0.7653** | authoritative (kept) |
| 3 | [SVG Displacement Liquid Glass — Free CSS Code & Live Demo - CodeFronts](https://codefronts.com/design-styles/css-glassmorphism/svg-displacement-liquid-glass/) | `liquid glass CSS SVG feDisplacementMap refraction lens` | **0.8492** | authoritative (kept) |
| 4 | [GitHub - VII-Cae/hyalite--liquid-glass: Real refraction liquid glass ...](https://github.com/VII-Cae/hyalite--liquid-glass) | `liquid glass CSS SVG feDisplacementMap refraction lens` | **0.9560** | authoritative (kept) |
| 5 | [<feDisplacementMap> - SVG - MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feDisplacementMap) | `SVG feDisplacementMap backdrop-filter chromatic aberration glass` | **0.9697** | authoritative (kept) |
| 6 | [Liquid Glass with SVG Filters — an interactive build log](https://nachiket0310.github.io/glass-ui/) | `SVG feDisplacementMap backdrop-filter chromatic aberration glass` | **0.9769** | authoritative (kept) |
| 7 | [GitHub - rizroze/liquid-glass: Real optical refraction for the web. SVG ...](https://github.com/rizroze/liquid-glass/tree/main) | `SVG feDisplacementMap backdrop-filter chromatic aberration glass` | **0.9777** | authoritative (kept) |
| 8 | [SVG Repo - Free SVG Vectors and Icons](https://www.svgrepo.com/) | `SVG feDisplacementMap backdrop-filter chromatic aberration glass` | **0.0905** | low-weight (filtered) |
