# 06 - dynamic-textured-and-custom-backdrops

**Scope:** Dynamic procedural caustic/mesh backgrounds and user-uploaded full-bleed cover wallpapers that showcase optical refraction without sacrificing foreground legibility.

## Dynamic Textured Caustics and Custom Full-Screen Wallpapers

Liquid Glass is invisible over a flat monochrome canvas because `backdrop-filter` and `feDisplacementMap` require spatial color and luminance gradients to refract ([70+ CSS Glassmorphism Designs: Free UI Code Snippets](https://freefrontend.com/css-glassmorphism/), weight 0.9118).

### Three-State Backdrop Controller (`Alt+Click` on Theme Toggle)

1. **Default Ambient Backdrop (`data-bg-mode="default"`):** Theme-matched radial gradient aura.
2. **Dynamic Textured Backdrop (`1st Alt+Click` -> `data-bg-mode="dynamic"`):** Layers an animated multi-stop caustic mesh gradient, floating refractive orbs, and an inline SVG fractal-noise micro-texture so every card edge visibly bends background light ([Glassmorphism CSS Effect Generator - Glass CSS](https://css.glass/), weight 0.7733).
3. **Custom User Wallpaper Dialog (`2nd Alt+Click` -> `data-bg-mode="custom"`):** Opens a Liquid Glass upload dialog (`#bg-upload-dialog`) with file picker, preset gallery, and reset controls, fitting the user's chosen wallpaper to the viewport (`background-size: cover; background-position: center; background-attachment: fixed;`) beneath an adaptive contrast veil ([Mesh Gradient Generator - CSS Mesh Maker | Colorffy](https://colorffy.com/mesh-gradient-generator), weight 0.858).

## Sources Considered (Clef `noul` Quality Weights)

| # | Source | Query | Clef Weight | Verdict |
|---|---|---|---|---|
| 1 | [70+ CSS Glassmorphism Designs: Free UI Code Snippets](https://freefrontend.com/css-glassmorphism/) | `glassmorphism dynamic mesh gradient background texture CSS` | **0.9118** | authoritative (kept) |
| 2 | [Glassmorphism CSS Effect Generator - Glass CSS](https://css.glass/) | `glassmorphism dynamic mesh gradient background texture CSS` | **0.7733** | authoritative (kept) |
| 3 | [Glassmorphism Gradient Wallpaper](https://www.pinterest.com/ideas/glassmorphism-gradient-wallpaper/945036577511/) | `glassmorphism dynamic mesh gradient background texture CSS` | **0.0816** | low-weight (filtered) |
| 4 | [Mesh Gradient Generator - CSS Mesh Maker - Colorffy](https://colorffy.com/mesh-gradient-generator) | `glassmorphism dynamic mesh gradient background texture CSS` | **0.8580** | authoritative (kept) |
| 5 | [CSS Liquid Glass Effects: Free Code Snippets & Examples](https://freefrontend.com/css-liquid-glass/) | `liquid glass wallpaper background refraction contrast scrim CSS` | **0.8040** | authoritative (kept) |
| 6 | [GitHub - dpawlikowski/liquid-glass: iOS 26-style liquid glass effect in ...](https://github.com/dpawlikowski/liquid-glass) | `liquid glass wallpaper background refraction contrast scrim CSS` | **0.9331** | authoritative (kept) |
| 7 | [GitHub - waldbach/liquid-glass-css: Pure CSS Liquid Glass refraction ...](https://github.com/waldbach/liquid-glass-css) | `liquid glass wallpaper background refraction contrast scrim CSS` | **0.9473** | authoritative (kept) |
| 8 | [Liquid - Wikipedia](https://en.wikipedia.org/wiki/Liquid) | `liquid glass wallpaper background refraction contrast scrim CSS` | **0.1080** | low-weight (filtered) |
