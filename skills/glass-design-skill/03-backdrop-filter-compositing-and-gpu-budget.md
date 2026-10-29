# 03 - backdrop-filter-compositing-and-gpu-budget

**Scope:** Multi-stage backdrop-filter pipelines (blur, saturate, brightness, contrast), GPU compositing layer budgets, overdraw avoidance, and cross-browser @supports fallbacks.

## Multi-Stage Backdrop-Filter Pipeline and Cross-Browser Fallbacks

Liquid Glass combines three optical operations in `backdrop-filter`: Gaussian frost (`blur(12px-18px)`), chromatic saturation boost (`saturate(165%-190%)`), and luminance lift (`brightness(1.08)` in Dark Mode or `contrast(1.03)` in Light Mode) ([backdrop-filter CSS property - CSS | MDN - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter), weight 0.9575).

### GPU Compositor Budget and Progressive Enhancement

1. **Blur Radius Ceiling:** GPU texture sampling cost scales with both element area and blur kernel radius; keeping card blur between `12px` and `20px` while letting `saturate(180%)` carry the material thickness avoids mobile/laptop frame drops ([CSS backdrop-filter and Glassmorphism: blur, saturate, performance ...](https://www.mironsoft.de/en/blog/css-backdrop-filter-frosted-glass-effects), weight 0.8883).
2. **Safari and Firefox Guardrail:** Only Chromium supports `url(#svg-filter)` inside `backdrop-filter`. If `url(#id)` is placed in an unguarded rule, Safari drops the entire `backdrop-filter` property. Always gate the SVG lens inside `@supports (backdrop-filter: url('#liquid-glass-lens'))` after the cross-browser `blur() saturate()` declaration ([CSS backdrop-filter: blur, brightness, saturate and When to Use Each](https://empire-ui.com/blog/backdrop-filter-css), weight 0.7411).

## Sources Considered (Clef `noul` Quality Weights)

| # | Source | Query | Clef Weight | Verdict |
|---|---|---|---|---|
| 1 | [backdrop-filter CSS property - CSS - MDN - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter) | `CSS backdrop-filter blur saturate performance GPU compositing glassmorphism` | **0.9575** | authoritative (kept) |
| 2 | [CSS backdrop-filter and Glassmorphism: blur, saturate, performance ...](https://www.mironsoft.de/en/blog/css-backdrop-filter-frosted-glass-effects) | `CSS backdrop-filter blur saturate performance GPU compositing glassmorphism` | **0.8883** | authoritative (kept) |
| 3 | [CSS backdrop-filter: blur, brightness, saturate and When to Use Each](https://empire-ui.com/blog/backdrop-filter-css) | `CSS backdrop-filter blur saturate performance GPU compositing glassmorphism` | **0.7411** | authoritative (kept) |
| 4 | [css - Why is backdrop-filter expensive on elements containing an ...](https://stackoverflow.com/questions/79218159/why-is-backdrop-filter-expensive-on-elements-containing-an-animation) | `CSS backdrop-filter blur saturate performance GPU compositing glassmorphism` | **0.7768** | authoritative (kept) |
| 5 | [Liquid Glass CSS: Refraction, Highlights and Fallbacks](https://designforai.dev/liquid-glass-css) | `liquid glass CSS @supports backdrop-filter Safari Firefox fallback` | **0.7610** | authoritative (kept) |
| 6 | [Liquid Glass CSS Generator — backdrop-filter refraction - WarpImage](https://warpimage.com/dev/liquid-glass-generator) | `liquid glass CSS @supports backdrop-filter Safari Firefox fallback` | **0.9114** | authoritative (kept) |
| 7 | [Glass, But the Browser Doesn't Speak It: The Six-Layer Backdrop-Filter ...](https://blog.flowrust.com/2026/07/15/backdrop-filter-stack-glassmorphism-survives-safari/) | `liquid glass CSS @supports backdrop-filter Safari Firefox fallback` | **0.9295** | authoritative (kept) |
| 8 | [Liquid Glass CSS: backdrop-filter Recipes + Guardrails](https://www.buildmvpfast.com/blog/liquid-glass-css-backdrop-filter-recipes-2026) | `liquid glass CSS @supports backdrop-filter Safari Firefox fallback` | **0.8478** | authoritative (kept) |
