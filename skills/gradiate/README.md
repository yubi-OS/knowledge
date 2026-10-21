# skills/gradiate: Layered CSS Background Gradients and Agent Prompts via the Steady Orbit Gradient Designer

**Ground source:** `yubi-OS/yubiOS skills/gradiate/SKILL.md`

A knowledge corpus on the yubiOS `gradiate` skill: how it ingests the live Steady Orbit Gradient Designer at `/radiant/`, how it composes stacked center-fade `linear-gradient` layers, how edge alpha is held low enough for readable text, how scrolling pages avoid tiling seams, how results are verified in a real browser, and how the CLI and its 6 guidelines are run.

## Docs

| NN | Doc | Scope | Outline score |
|---|---|---|---|
| 01 | [01-runtime-designer-ingestion-and-radiant-endpoint.md](01-runtime-designer-ingestion-and-radiant-endpoint.md) | Fetching the live designer at `steadyorbitsystems.com/radiant/` (and the workers.dev mirror; `/gradiant/` 404s) to run its own `buildCss` and `buildPrompt`. Internal record. | 1.4191 |
| 02 | [02-layered-linear-gradient-composition-and-center-fade.md](02-layered-linear-gradient-composition-and-center-fade.md) | Composing 2 to 4 token colors into stacked `90deg` and `180deg` layers with alpha at 0% / 100% and alpha 0 at 50%. | 1.8642 |
| 03 | [03-edge-alpha-contrast-and-wcag-readability.md](03-edge-alpha-contrast-and-wcag-readability.md) | Keeping edge alpha at 0.4 (not 0.85 to 0.9) so `#E7EAF6` text on `#0B1026` holds >= 4.5:1 (about 5.7:1 on a 0.4 cyan edge); lower alpha before changing text color. | 1.5482 |
| 04 | [04-scrolling-page-seams-and-background-sizing.md](04-scrolling-page-seams-and-background-sizing.md) | `background-repeat: no-repeat` plus `background-size: 100% 100%` against viewport-height seams; no unrequested `background-attachment: fixed`. | 1.5454 |
| 05 | [05-browser-computed-style-and-bounding-rect-verification.md](05-browser-computed-style-and-bounding-rect-verification.md) | Computed `background-image` not `none` (missing-semicolon drops), `getBoundingClientRect()` on changed controls, fixed overlays hidden. Internal record. | 0.8371 |
| 06 | [06-cli-workflow-edge-fade-example-and-guidelines.md](06-cli-workflow-edge-fade-example-and-guidelines.md) | Running `scripts/gradiate.mjs` with `examples/edge-fade.json`, `--sel`, `--out`, `--sample`; enforcing the 6 guidelines. Internal record. | 1.5435 |

Outline validated with the clef `score` metric (criteria lowest-first: padding: drop / marginal: keep only if the dig comes back strong / load-bearing: core subtopic). 6 kept, 0 dropped. Doc 05 is the only subtopic whose most probable class was "marginal" (0.4507).

## Research summary

| Metric | Value |
|---|---|
| Results collected | 30 (10 each for docs 02, 03, 04) |
| Clef weights >= 0.5 (high) | 6 |
| Clef weights < 0.5 (low) | 24 |
| Jev requests | 7 |
| Redos | 0 |
| Skips | 0 |
| Internal-record docs (no web dig) | 3 (01, 05, 06) |

High-weight sources: MDN `linear-gradient()` (0.8502), W3Schools CSS Gradients (0.8095), Accessibility Developer Guide contrast calculation (0.5987), W3C WAI WCAG 2 Overview (0.5735), MDN `background-attachment` (0.7980), CSS-Tricks Fixed Background Attachment Hack (0.5279). Every cited source under 0.5 is labeled `(weak backing, clef weight < 0.5)` in its doc.

Notable finding: doc 03 reproduces the ground source's 5.7:1 edge estimate by color math (5.71:1) and extends it to the stacked corners of the edge-fade example, where 2 of 4 corners fall below 4.5:1 at 0.4 alpha (top-right 3.07:1, bottom-right 4.11:1). Color math only, not measured on a page.

Known gap: doc 04's dig did not return an authoritative source for the mechanism behind the viewport-height seam; the doc keeps the ground-source rule and declines to assert a mechanism.

Preflight 2026-10-21: searXNG 59 results healthy; /api/decide (clef) 200
