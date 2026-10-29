# Corpus: `glass-design-skill`

**Topic:** Physically-based Liquid Glass UI engineering (`glass-design-skill`) across Dark and Light modes: 5-layer optical material stack, SVG `feDisplacementMap` refraction, asymmetric Fresnel specular rims, WCAG 2.2 AA dual-theme contrast, 5-tier component primitives, and dynamic/custom backdrops.
**Minted:** 2026-10-29 via `knowledge-corpus-mint` (Schema v2, Clef `@cf/cloudflare/clef`).
**Source Skill:** `yubi-OS/yubiOS/skills/glass-design-skill/SKILL.md`

## Document Outline & Clef Validation

| NN | Document | Scope | Clef Outline Score | Weighted Results |
|---|---|---|---|---|
| `01` | [`01-optical-refraction-and-svg-displacement.md`](./01-optical-refraction-and-svg-displacement.md) | Physically-based optical refraction in CSS and SVG using feDisplacementMap, signed distance field lens maps, sRGB interpolation, and chromatic dispersion. | **1.7882** (`load-bearing`) | 8 |
| `02` | [`02-fresnel-specular-rims-and-caustic-lighting.md`](./02-fresnel-specular-rims-and-caustic-lighting.md) | Asymmetric Fresnel rim lighting via multi-layer inset box-shadow stacks, diagonal specular sheen overlays, and pointer-tracked caustic highlights. | **1.7739** (`load-bearing`) | 8 |
| `03` | [`03-backdrop-filter-compositing-and-gpu-budget.md`](./03-backdrop-filter-compositing-and-gpu-budget.md) | Multi-stage backdrop-filter pipelines (blur, saturate, brightness, contrast), GPU compositing layer budgets, overdraw avoidance, and cross-browser @supports fallbacks. | **1.8725** (`load-bearing`) | 8 |
| `04` | [`04-dual-theme-luminance-and-wcag-contrast.md`](./04-dual-theme-luminance-and-wcag-contrast.md) | Adaptive Liquid Glass material tokens across Dark Mode and Light Mode that preserve WCAG 2.2 AA 4.5:1 text contrast and 3:1 non-text UI contrast over arbitrary backgrounds. | **1.8579** (`load-bearing`) | 8 |
| `05` | [`05-tactile-component-primitives.md`](./05-tactile-component-primitives.md) | Lifting cards, drawers, buttons, switches, segmented tabs, menus, dialogs, and inputs into a 5-tier Liquid Glass elevation hierarchy with spring micro-interactions. | **1.7775** (`load-bearing`) | 8 |
| `06` | [`06-dynamic-textured-and-custom-backdrops.md`](./06-dynamic-textured-and-custom-backdrops.md) | Dynamic procedural caustic/mesh backgrounds and user-uploaded full-bleed cover wallpapers that showcase optical refraction without sacrificing foreground legibility. | **1.2561** (`load-bearing`) | 8 |

## Research DB Summary (`research-db/`)

- **Preflight:** `searXNG` HTTP 200 (63 results) + `/api/decide` HTTP 200 (`clef`, smoke weight `0.9675`).
- **Total results collected & weighted:** `48` (`38` with weight `>= 0.50`, `0` unweighted).
- **Total Clef decision calls:** `13` (1 outline `score` + 12 batch `noul` calls).
