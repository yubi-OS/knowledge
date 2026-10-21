# 02: Layered Linear-Gradient Composition and Center Fade

**Scope:** Composing 2 to 4 token colors into stacked horizontal (`90deg`) and vertical (`180deg`) `linear-gradient` layers, with alpha at 0% and 100% and alpha 0 at 50%, so the gradient frames content and fades toward the center.

**Ground source:** `yubi-OS/yubiOS skills/gradiate/SKILL.md`

**Dig:** 2 searXNG queries, 10 results, each clef-weighted (noul metric, true = primary source). 2 results scored >= 0.5; 8 scored < 0.5.

Outline validation (clef `score` metric): **1.8642** (probabilities: padding 0.0331, marginal 0.0695, load-bearing 0.8974; confidence 0.7169). The highest-scoring subtopic in the outline.

## 1. Color budget: 2 or 3, never more than 4

The ground source's workflow step 1: "Pick two or three colors from the target UI's tokens. Four is the limit." The colors come from the target UI's own design tokens, not from a fresh palette, so the gradient reads as part of the page rather than a decoration laid over it.

The worked example (doc 06) uses exactly 3 accent tokens plus 1 base: violet `#DB46F5`, cyan `#5FD9F2`, amber `#FFC857`, on a `#0B1026` background color.

## 2. Linear by default

Step 2 of the ground source: "Use linear layers unless the user asks for radial." Radial is opt-in only. The skill's "When to use" section also lists replacing "a grid, a flat color, or a radial effect on a page background" as a trigger, so a request to remove an existing radial is a request for linear layers.

The `linear-gradient()` function "creates an image consisting of a progressive transition between two or more colors along a straight line. Its result is an object of the `<gradient>` data type, which is a special kind of `<image>`" (MDN, https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/linear-gradient, clef weight: 0.8502). Because a gradient is an `<image>`, it belongs in `background-image`, which is where the generator puts it. W3Schools confirms the same placement: "The CSS gradient functions are used within the background-image property" and lists linear, radial, and conic as the 3 types (https://www.w3schools.com/css/css3_gradients.asp, clef weight: 0.8095).

A linear gradient needs at least 2 color stops: "To create a linear gradient you must define at least two color stops" (https://www.w3schools.com/CSSref/func_linear-gradient.php, clef weight: 0.3165, weak backing, clef weight < 0.5). The skill's layers use 3 stops each.

## 3. The center-fade stop pattern

The ground source gives the recipe exactly: "To fade toward the center, give each layer alpha at 0%, alpha 0 at 50%, and alpha at 100%."

As a stop list, every layer has this shape:

```
linear-gradient(<angle>, <colorA @ alpha> 0%, <colorA @ 0> 50%, <colorB @ alpha> 100%)
```

Note what the 50% stop does: it repeats colorA's hue with alpha 0, rather than using a neutral transparent color. A secondary source warns of a "gray-midpoint trap" when fading to see-through (https://www.toolsura.com/blog/css-gradient-transparency/, clef weight: 0.3099, weak backing, clef weight < 0.5); the skill's example avoids any gray midpoint by keeping a real hue at the transparent stop. This is an observation about the example, not a documented rationale in the ground source.

## 4. Two bands make a frame

Step 2 continues: "Stack a horizontal band and a vertical band to get a frame that fades to the middle."

- `90deg` runs left to right: color on the left edge, clear in the middle column, color on the right edge.
- `180deg` runs top to bottom: color on the top edge, clear in the middle row, color on the bottom edge.

Stacked, the 4 edges carry color and the center is clear on both axes, which is the frame. The example output:

```css
.gradient-bg {
  background-color: #0B1026;
  background-image:
    linear-gradient(90deg, #DB46F566 0%, #DB46F500 50%, #5FD9F266 100%),
    linear-gradient(180deg, #FFC85766 0%, #FFC85700 50%, #DB46F566 100%);
}
```

## 5. Stacking order and why alpha is mandatory

Multiple gradients go into 1 `background-image` as a comma-separated list. Guideline 2 of the ground source fixes the order rule: "The first layer is the top layer." Layer order is generated and must be kept as generated.

Alpha is what makes stacking visible at all. A forum answer explains the failure when it is missing: "each of your gradient is non-transparent, so one will overlap the other completely and that's why only one is visible," with the fix being alpha so layers "see through each other" (https://stackoverflow.com/questions/47913034/layering-multiple-gradients-on-css-background, clef weight: 0.0569, weak backing, clef weight < 0.5). A second thread describes the same 2-layer rgba approach (https://stackoverflow.com/questions/49834500/stacking-multiple-css-gradients, clef weight: 0.1200, weak backing, clef weight < 0.5). Both are forum sources; the claim is consistent with the image-layering model in MDN but should be read as practitioner backing only.

## 6. 8-digit hex alpha

The generator writes alpha into the hex code itself: `#DB46F566`, `#DB46F500`. 8-digit hex codes "are a way put alpha transparency information into the hex format for colors" (https://css-tricks.com/8-digit-hex-codes/, clef weight: 0.2590, weak backing, clef weight < 0.5). The last 2 digits are the alpha byte: `66` is 102/255 = 0.4, and `00` is 0. So the example's edges sit at exactly the 0.4 edge alpha the ground source recommends for text-bearing pages (doc 03), and the midpoints are fully clear.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | linear-gradient() CSS function, MDN | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/linear-gradient | 0.8502 | authoritative |
| 2 | CSS Gradients, W3Schools | https://www.w3schools.com/css/css3_gradients.asp | 0.8095 | authoritative |
| 3 | How to Set Transparency with Linear Gradient in CSS, GeeksforGeeks | https://www.geeksforgeeks.org/css/how-to-set-transparency-with-linear-gradient-in-css/ | 0.3354 | weak backing, clef weight < 0.5 (not cited) |
| 4 | CSS linear-gradient() function, W3Schools | https://www.w3schools.com/CSSref/func_linear-gradient.php | 0.3165 | weak backing, clef weight < 0.5 |
| 5 | CSS Gradient Transparency, Toolsura | https://www.toolsura.com/blog/css-gradient-transparency/ | 0.3099 | weak backing, clef weight < 0.5 |
| 6 | 8-Digit Hex Codes, CSS-Tricks | https://css-tricks.com/8-digit-hex-codes/ | 0.2590 | weak backing, clef weight < 0.5 |
| 7 | Stacking multiple CSS Gradients, Stack Overflow | https://stackoverflow.com/questions/49834500/stacking-multiple-css-gradients | 0.1200 | weak backing, clef weight < 0.5 |
| 8 | Ultimate CSS Gradient Generator, ColorZilla | https://www.colorzilla.com/gradient-editor/ | 0.1110 | weak backing, clef weight < 0.5 (not cited) |
| 9 | 8-Digit HEX Color Codes, colorpickerweb | https://www.colorpickerweb.com/8-digit-hex-codes-alpha-transparency/ | 0.0729 | weak backing, clef weight < 0.5 (not cited) |
| 10 | Layering Multiple Gradients on CSS Background, Stack Overflow | https://stackoverflow.com/questions/47913034/layering-multiple-gradients-on-css-background | 0.0569 | weak backing, clef weight < 0.5 |
