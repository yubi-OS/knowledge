# 05: Browser Verification with Computed Style and Bounding Rects

**Scope:** Verifying `getComputedStyle(el).backgroundImage !== 'none'` (catching declarations silently dropped by a missing semicolon), measuring changed controls with `getBoundingClientRect()`, and judging the look with fixed overlays hidden.

**Ground source:** `yubi-OS/yubiOS skills/gradiate/SKILL.md`

> Internal-record subtopic grounded in yubi-OS/yubiOS skills/gradiate/SKILL.md, no external web dig.

Outline validation (clef `score` metric): **0.8371** (probabilities: padding 0.3561, marginal 0.4507, load-bearing 0.1932; confidence 0.0509). The lowest score in the outline and the only subtopic whose most likely class is "marginal". It was kept (no subtopic scored 0, so nothing was dropped), and it is authored here strictly from the ground source.

## 1. The rule: a rendering page proves nothing

Guideline 4 of the ground source: "Verify in a browser before you report success. A page that still renders says nothing about whether the new CSS applied."

This is the central failure the doc guards against. A gradient change that did not apply leaves the page looking normal: the old background, or the plain `background-color`, still renders. Nothing errors. An agent that checks only "the page loads" will report success on a change that never landed.

## 2. Check 1: computed `background-image` is not `none`

Workflow step 6: "Check the result in a real browser. Read the computed background-image and confirm it is not none. A declaration with a missing semicolon is dropped silently, and that takes the whole background with it."

A minimal check, run in the page context against the element the CSS targets (the `--sel` selector from doc 06, default `.gradient-bg`):

```js
const el = document.querySelector('.gradient-bg');
const bg = getComputedStyle(el).backgroundImage;
console.log(bg);               // expect: linear-gradient(...), linear-gradient(...)
console.assert(el && bg !== 'none', 'gradient did not apply');
```

Why the computed value, not the stylesheet: the stylesheet still contains the text of a declaration that was dropped. Only the computed style shows what the browser actually accepted. Pass condition: the value is not `none`. A stronger, still-cheap check is to confirm the value contains as many `linear-gradient(` entries as the spec has layers (2 for the edge-fade example).

### The missing-semicolon trap

The ground source names the specific cause: a missing semicolon. When a semicolon is missing, the next declaration runs into the current one, and the browser rejects the combined text. Because the generator emits `background-image` as a multi-line value (one layer per line), a hand edit that breaks a semicolon can take out the whole `background-image` declaration, leaving `none`. This is also the reason behind Guideline 1: "Run the generator instead of hand-writing CSS. Hand edits drop semicolons and drift from the designer's format."

It applies equally to the 2 sizing lines added for scrolling pages (doc 04): if `background-repeat: no-repeat` loses its semicolon, it can take `background-size` down with it, and the seam returns while the gradient itself still shows.

## 3. Check 2: measure changed controls with `getBoundingClientRect()`

Workflow step 7: "Measure any control you changed with getBoundingClientRect()."

Background work tends to come with small layout edits (padding to clear the gradient frame, a restyled button). Each one is measured, not eyeballed:

```js
const r = document.querySelector('<changed control>').getBoundingClientRect();
console.log({ x: r.x, y: r.y, width: r.width, height: r.height });
```

Pass conditions are task-specific (non-zero size, inside the viewport, not overlapping a neighbor). The ground source requires the measurement; it does not prescribe thresholds, so none are invented here.

## 4. Check 3: judge the look with fixed overlays hidden

Step 7 continues: "Judge the look with fixed overlays hidden, because dialogs and fixed bars dim screenshots."

A cookie dialog, modal scrim, or fixed header lays its own color over the page. A screenshot taken through it misrepresents the gradient, usually darker and flatter, and can make a too-loud edge alpha (doc 03) look acceptable. Hide those overlays for the visual judgment, then restore them. The ground source does not specify the hiding method; any reversible approach (toggling the overlay's display in devtools or a scripted style override) satisfies the rule.

## 5. Order of operations

| Step | Check | Catches |
|---|---|---|
| 1 | Computed `background-image` is not `none` | Dropped declaration, wrong selector, CSS not loaded |
| 2 | Scroll a tall page (doc 04) | Viewport-height seam |
| 3 | `getBoundingClientRect()` on changed controls | Layout regressions |
| 4 | Visual review, overlays hidden | Edge alpha too loud, unreadable text |
| 5 | Report success | Only after 1 to 4 pass |

## 6. Boundaries

This record does not claim a specific browser automation tool. The checks are plain DOM APIs that work from a devtools console, a headless browser script, or an MCP browser session. What the ground source fixes is the evidence required, not the harness.

## Sources

| Source | Type | Use |
|---|---|---|
| `yubi-OS/yubiOS skills/gradiate/SKILL.md` | Internal record (ground source) | All claims in this doc |
