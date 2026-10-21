# 06: CLI Workflow, the Edge-Fade Example, and the 6 Guidelines

**Scope:** Running `scripts/gradiate.mjs` with `examples/edge-fade.json`, `--sel`, `--out`, and `--sample`, and enforcing the 6 operational guidelines.

**Ground source:** `yubi-OS/yubiOS skills/gradiate/SKILL.md`

> Internal-record subtopic grounded in yubi-OS/yubiOS skills/gradiate/SKILL.md, no external web dig.

Outline validation (clef `score` metric): **1.5435** (probabilities: padding 0.0978, marginal 0.2609, load-bearing 0.6413; confidence 0.2334).

## 1. When the skill triggers

The ground source lists 3 cases:

- A page or component needs a gradient background, and the user wants it layered, tuned, or faded toward the center.
- The user wants CSS plus a copy-out prompt that another agent can apply.
- The user wants to replace a grid, a flat color, or a radial effect on a page background.

Trigger phrases from the frontmatter: gradiate, gradient designer, background gradient, layered gradient, fade to center, copy agent prompt.

## 2. The CLI surface

Every flag below is named in the ground source; nothing else is assumed.

| Invocation | Effect |
|---|---|
| `node scripts/gradiate.mjs <spec.json>` | Prints the CSS and the prompt to stdout |
| `--sel <selector>` | Sets the selector the CSS and prompt target (default `.gradient-bg`) |
| `--out <DIR>` | Also writes `gradient.css` and `prompt.md` into `DIR` |
| `node scripts/gradiate.mjs --sample` | Prints a starter spec |
| `GRADIATE_DESIGNER_URL=<url>` (env) | Points the generator at another copy of the designer page (doc 01) |

The ground source's own sentence for step 4: "Write a JSON spec (see Examples) and run the generator. It prints the CSS and the prompt. With --out DIR it also writes gradient.css and prompt.md."

### The spec

The ground source does not reproduce the JSON schema. The safe path is to start from `--sample` (or from `examples/edge-fade.json`) and edit values, rather than writing a spec shape from memory. The spec must encode the decisions from docs 02 and 03: 2 to 4 token colors, linear layers, the 0% / 50% / 100% center-fade stops, and the edge alpha.

## 3. The worked example: edge-fade

The ground source describes it as: "Edge-fade band, horizontal violet to cyan and vertical amber to violet, faded to the center (examples/edge-fade.json)."

Command:

```bash
node scripts/gradiate.mjs examples/edge-fade.json --sel .gradient-bg --out out/
```

Output CSS:

```css
.gradient-bg {
  background-color: #0B1026;
  background-image:
    linear-gradient(90deg, #DB46F566 0%, #DB46F500 50%, #5FD9F266 100%),
    linear-gradient(180deg, #FFC85766 0%, #FFC85700 50%, #DB46F566 100%);
}
```

Reading it against the rest of the corpus:

- **Layer 1 (top), `90deg`:** violet `#DB46F5` on the left at alpha `66` (0.4), the same violet at alpha `00` at 50%, cyan `#5FD9F2` on the right at 0.4.
- **Layer 2, `180deg`:** amber `#FFC857` on top at 0.4, clear at 50%, violet on the bottom at 0.4.
- **Base:** `#0B1026`, the dark color the contrast math in doc 03 composites onto.
- **3 accent colors**, inside the "two or three, four is the limit" budget.

Because the example passes `--out out/`, the run leaves `out/gradient.css` and `out/prompt.md` on disk alongside stdout.

## 4. From output to page

1. Apply `gradient.css` (or hand `prompt.md` to the agent that owns the target page).
2. On a scrolling page, add `background-repeat: no-repeat` and `background-size: 100% 100%` (doc 04).
3. Verify in a real browser: computed `background-image` not `none`, changed controls measured, overlays hidden for the visual pass (doc 05).

## 5. The 6 guidelines, with enforcement

| # | Guideline (ground source) | Enforcement move |
|---|---|---|
| 1 | Run the generator instead of hand-writing CSS. Hand edits drop semicolons and drift from the designer's format. | Any CSS not traceable to a generator run gets regenerated, not patched. |
| 2 | Keep colors, stop positions, angles, and layer order as generated. The first layer is the top layer. | Diff applied CSS against `gradient.css`; any change in these 4 fields is a defect. Tune by editing the spec and re-running. |
| 3 | The prompt targets .gradient-bg by default. Pass --sel to match the element you will style. | Confirm the `--sel` value matches a real element before running; a wrong selector fails check 1 in doc 05. |
| 4 | Verify in a browser before you report success. A page that still renders says nothing about whether the new CSS applied. | No success report without the computed-style evidence. |
| 5 | If text is hard to read, lower the alpha first. Change the text color only when the gradient is already faint. | Readability fixes go into the spec's alpha, then re-run; text color edits require the gradient to already be faint. |
| 6 | Don't add background-attachment: fixed unless asked. | Reject `fixed` in review unless the user requested it (doc 04). |

Note that Guideline 2 and doc 04 step 2 do not conflict: the sizing declarations are additions on scrolling pages, not edits to the generated colors, stops, angles, or order.

## 6. Common mistakes this workflow prevents

- Building the designer URL as `/gradiant/` (404; doc 01).
- Hand-editing the output and losing a semicolon, which drops the whole background (doc 05).
- Reordering layers and inverting which band sits on top.
- Shipping 0.85 to 0.9 edge alpha on a text-bearing page (doc 03).
- Forgetting the 2 sizing lines on a long page and shipping a seam (doc 04).
- Reporting success because the page "still loads".

## Sources

| Source | Type | Use |
|---|---|---|
| `yubi-OS/yubiOS skills/gradiate/SKILL.md` | Internal record (ground source) | All claims in this doc |
