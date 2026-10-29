# 04 - dual-theme-luminance-and-wcag-contrast

**Scope:** Adaptive Liquid Glass material tokens across Dark Mode and Light Mode that preserve WCAG 2.2 AA 4.5:1 text contrast and 3:1 non-text UI contrast over arbitrary backgrounds.

## Dual-Theme Luminance Calibration and WCAG 2.2 AA Compliance

WCAG 2.2 SC 1.4.3 requires `>= 4.5:1` contrast for normal text and SC 1.4.11 requires `>= 3.0:1` contrast for active UI controls and boundaries ([Dark Mode Accessibility: WCAG 2.2 Guidelines, Myths & Best Practices ...](https://aeldata.com/dark-mode-accessibility/), weight 0.8738). Because translucent panes sample arbitrary background content, Dark Mode and Light Mode require distinct optical token sets ([WCAG 2.2 Color Contrast: AA vs AAA Explained with Real Examples](https://www.colorpickerweb.com/wcag-2-2-color-contrast/), weight 0.8672).

### Dark Mode vs Light Mode Token Separation

1. **Dark Mode (Obsidian-Cyan Glass):** Uses `rgba(15, 22, 50, 0.56-0.66)` surface tints with high-albedo `#F1F5F9` text and `rgba(255, 255, 255, 0.18-0.28)` specular borders ([Dark Mode Accessibility: WCAG 2.2 Guidelines, Myths & Best Practices ...](https://aeldata.com/dark-mode-accessibility/), weight 0.8738).
2. **Light Mode (High-Albedo Pearl Glass):** Raises surface tint alpha to `0.76-0.88` (`rgba(255, 255, 255, 0.82)`), pairs a pure-white inner top highlight (`rgba(255, 255, 255, 0.98)`) with a crisp slate outer ring (`0 0 0 1px rgba(15, 23, 42, 0.09)`), and renders text in deep slate `#0F172A` ([WCAG 2.2 Color Contrast: The Complete Accessibility Checklist](https://colorpalettexyz.com/blog/wcag-color-contrast-explained), weight 0.7987).

## Sources Considered (Clef `noul` Quality Weights)

| # | Source | Query | Clef Weight | Verdict |
|---|---|---|---|---|
| 1 | [Dark Mode Accessibility: WCAG 2.2 Guidelines, Myths & Best Practices ...](https://aeldata.com/dark-mode-accessibility/) | `glassmorphism accessibility WCAG 2.2 contrast ratio light dark mode` | **0.8738** | authoritative (kept) |
| 2 | [WCAG 2.2 Color Contrast: AA vs AAA Explained with Real Examples](https://www.colorpickerweb.com/wcag-2-2-color-contrast/) | `glassmorphism accessibility WCAG 2.2 contrast ratio light dark mode` | **0.8672** | authoritative (kept) |
| 3 | [WCAG 2.2 Color Contrast: The Complete Accessibility Checklist](https://colorpalettexyz.com/blog/wcag-color-contrast-explained) | `glassmorphism accessibility WCAG 2.2 contrast ratio light dark mode` | **0.7987** | authoritative (kept) |
| 4 | [Glassmorphism CSS Effect Generator - Glass CSS](https://css.glass/) | `glassmorphism accessibility WCAG 2.2 contrast ratio light dark mode` | **0.1288** | low-weight (filtered) |
| 5 | [Materials - Apple Developer Documentation](https://developer.apple.com/design/human-interface-guidelines/materials) | `Apple Liquid Glass legibility contrast dark mode light mode tint` | **0.8817** | authoritative (kept) |
| 6 | [orwell/docs/design/liquid-glass/ADAPTIVE_LEGIBILITY_REFERENCE ... - GitHub](https://github.com/kevinhirsch/orwell/blob/main/docs/design/liquid-glass/ADAPTIVE_LEGIBILITY_REFERENCE.md) | `Apple Liquid Glass legibility contrast dark mode light mode tint` | **0.9168** | authoritative (kept) |
| 7 | [Apple FINALLY Fixed Liquid Glass! The New 'Tinted' Option in iOS 26.1](https://www.geeky-gadgets.com/ios-26-1-tinted-liquid-glass/) | `Apple Liquid Glass legibility contrast dark mode light mode tint` | **0.6441** | authoritative (kept) |
| 8 | [Apple](https://www.apple.com/) | `Apple Liquid Glass legibility contrast dark mode light mode tint` | **0.2421** | low-weight (filtered) |
