# 03: Edge Alpha, Contrast, and WCAG Readability

**Scope:** Keeping edge alpha low (0.4, not 0.85 to 0.9) so foreground text (`#E7EAF6` over `#0B1026`) keeps at least 4.5:1 contrast (about 5.7:1 on a 0.4 cyan edge), and lowering alpha before changing the text color.

**Ground source:** `yubi-OS/yubiOS skills/gradiate/SKILL.md`

**Dig:** 2 searXNG queries, 10 results, each clef-weighted (noul metric, true = primary source). 2 results scored >= 0.5; 8 scored < 0.5.

Outline validation (clef `score` metric): **1.5482** (probabilities: padding 0.0978, marginal 0.2562, load-bearing 0.6460; confidence 0.2388).

## 1. The ground-source rule

Workflow step 3: "Keep edge alpha low when text sits on the gradient. Alpha 0.4 on the edges kept page text readable. Alpha 0.85 to 0.9 was too loud. Estimate contrast against the text color before shipping, then check the real page."

And the worked number, with its own caveat: "#E7EAF6 text over a 0.4 cyan edge on #0B1026 is roughly 5.7:1 by color math, not measured on the page."

Guideline 5 sets the order of fixes: "If text is hard to read, lower the alpha first. Change the text color only when the gradient is already faint."

## 2. The thresholds

The canonical standard is WCAG 2, maintained by the W3C Web Accessibility Initiative (https://www.w3.org/WAI/standards-guidelines/wcag/, clef weight: 0.5735). The specific thresholds surfaced in the dig came from a checker site: "WCAG 2.1 Level AA requires a minimum 4.5:1 ratio for normal text and 3:1 for large text. Level AAA requires 7:1 and 4.5:1 respectively" (https://web-accessibility-checker.com/en/color-contrast-checker, clef weight: 0.3342, weak backing, clef weight < 0.5). The W3C overview page itself, in its snippet, did not restate these numbers, so the thresholds in this doc rest on the weak-backed source plus their wide repetition in the checker tools below.

## 3. How the ratio is computed

The Accessibility Developer Guide states that "There is a mathematical formula to calculate the contrast ratio between two colours," built on relative luminance, and that the formula beats eyeballing (https://www.accessibility-developer-guide.com/knowledge/colours-and-contrast/how-to-calculate/, clef weight: 0.5987). Relative luminance runs "from 0 (absolute black) to 1 (pure white)" and "is the mathematical foundation of the WCAG contrast ratio" (https://paletacolorpro.com/en/luminance-calculator, clef weight: 0.1551, weak backing, clef weight < 0.5), computed with "the sRGB linearization formula" (https://freetoolscorner.com/color-tools/color-luminance-calculator/, clef weight: 0.1300, weak backing, clef weight < 0.5).

For a translucent layer, the background color to test is the alpha composite of the layer over what sits beneath it: `C = a * layer + (1 - a) * below`, per channel, then linearize and take luminance.

## 4. Reproducing the 5.7:1 estimate

Computed in this authoring pass (sRGB linearization, standard luminance weights, simple alpha compositing; color math only, not measured on a page):

| Background under `#E7EAF6` text | Ratio |
|---|---|
| Flat `#0B1026` | 15.67:1 |
| Cyan `#5FD9F2` at 0.4 over `#0B1026` | **5.71:1** |
| Cyan at 0.85 | 1.86:1 |
| Cyan at 0.9 | 1.68:1 |
| Amber `#FFC857` at 0.4 | 5.55:1 |
| Violet `#DB46F5` at 0.4 | 8.64:1 |

The 5.71 result matches the ground source's "roughly 5.7:1". The 0.85 to 0.9 rows explain "too loud" in numbers: a light cyan at that alpha drops white-ish text below 2:1, failing even the 3:1 large-text bar.

## 5. Corners: where 2 layers overlap

The edge-fade example stacks a horizontal and a vertical band (doc 02), so each corner gets 2 layers of 0.4 alpha. Same method, same caveat:

| Corner | Top layer over bottom layer | Ratio |
|---|---|---|
| Top-left | violet over amber | 4.50:1 |
| Top-right | cyan over amber | 3.07:1 |
| Bottom-left | violet over violet | 5.40:1 |
| Bottom-right | cyan over violet | 4.11:1 |

Single-edge contrast passes; 2 corners fall under 4.5:1 by this math. The top-right corner reaches 4.29:1 at 0.3 alpha, 5.22:1 at 0.25, and 6.50:1 at 0.2. This is exactly why the ground source says to estimate, "then check the real page": the estimate for an edge is not the estimate for a corner, and real text rarely sits only mid-edge. Following Guideline 5, the fix for a failing corner is lower alpha, not a new text color.

## 6. Tooling

Gradient-specific and general checkers exist (https://gradientshub.com/tools/color-contrast-checker/, clef weight: 0.2463, weak backing, clef weight < 0.5; https://wcagc.com/tools/contrast-checker, clef weight: 0.3136, weak backing, clef weight < 0.5). Lea Verou's contrast-ratio app calculates "the WCAG 2.1 contrast ratio between any two CSS colors" (https://lea.verou.me/2023/03/contrast-ratio-new-home/, clef weight: 0.1923, weak backing, clef weight < 0.5). None of these replace the browser check in doc 05; they speed up the estimate step.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | How to calculate colour contrast, ADG | https://www.accessibility-developer-guide.com/knowledge/colours-and-contrast/how-to-calculate/ | 0.5987 | authoritative |
| 2 | WCAG 2 Overview, W3C WAI | https://www.w3.org/WAI/standards-guidelines/wcag/ | 0.5735 | authoritative |
| 3 | Color Contrast Checker, WCAG 2.1, Web Accessibility Checker | https://web-accessibility-checker.com/en/color-contrast-checker | 0.3342 | weak backing, clef weight < 0.5 |
| 4 | Color Contrast Checker, WCAG 2.1 AA and AAA, wcagc.com | https://wcagc.com/tools/contrast-checker | 0.3136 | weak backing, clef weight < 0.5 |
| 5 | Gradient Color Contrast Checker, GradientsHub | https://gradientshub.com/tools/color-contrast-checker/ | 0.2463 | weak backing, clef weight < 0.5 |
| 6 | Contrast Ratio has a new home, Lea Verou | https://lea.verou.me/2023/03/contrast-ratio-new-home/ | 0.1923 | weak backing, clef weight < 0.5 |
| 7 | Relative Luminance Calculator, paletacolorpro | https://paletacolorpro.com/en/luminance-calculator | 0.1551 | weak backing, clef weight < 0.5 |
| 8 | Relative Luminance Contrast Calculator, ultimatefinancecalculator | https://www.ultimatefinancecalculator.com/calculators/relative-luminance-contrast-calculator/ | 0.1436 | weak backing, clef weight < 0.5 (not cited) |
| 9 | Color Luminance Calculator, freetoolscorner | https://freetoolscorner.com/color-tools/color-luminance-calculator/ | 0.1300 | weak backing, clef weight < 0.5 |
| 10 | RELATIVE Definition, Merriam-Webster | https://www.merriam-webster.com/dictionary/relative | 0.0321 | weak backing, clef weight < 0.5 (off-topic, not cited) |
