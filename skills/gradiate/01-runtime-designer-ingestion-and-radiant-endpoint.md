# 01: Runtime Designer Ingestion and the /radiant/ Endpoint

**Scope:** Fetching the live Steady Orbit Gradient Designer at `steadyorbitsystems.com/radiant/` (and the `workers.dev/radiant/` mirror, while `/gradiant/` returns 404) so the generator can execute the designer's own `buildCss` and `buildPrompt` functions instead of re-implementing them.

**Ground source:** `yubi-OS/yubiOS skills/gradiate/SKILL.md`

> Internal-record subtopic grounded in yubi-OS/yubiOS skills/gradiate/SKILL.md, no external web dig.

Outline validation (clef `score` metric): **1.4191** (probabilities: padding 0.1831, marginal 0.2147, load-bearing 0.6022; confidence 0.1634). Kept as load-bearing.

## 1. Why the generator reads the page at run time

The ground source opens with the design rule that defines the whole skill: "Make page-background gradients with the designer's own CSS and prompt code. The generator reads the designer page at run time, so its output matches what the page itself would copy."

That sentence carries 2 consequences:

1. **Single source of truth.** The CSS formatter and the prompt formatter live in exactly 1 place: the designer page. The generator (`scripts/gradiate.mjs`) is a thin runner around them, not a parallel implementation. When the designer changes its output format, the generator picks up the change on its next run with no code edit.
2. **Parity with the copy button.** A human who opens the designer and clicks copy, and an agent that runs the generator from a JSON spec, get byte-for-byte the same format. Guideline 1 of the ground source makes the reason explicit: "Hand edits drop semicolons and drift from the designer's format."

## 2. Where the designer lives

The ground source lists the endpoints precisely:

| URL | Status per ground source | Use |
|---|---|---|
| `https://steadyorbitsystems.com/radiant/` | Working URL | Default target |
| `https://steady-orbit.systems-a.workers.dev/radiant/` | Serves the same page | Mirror / fallback |
| `https://steadyorbitsystems.com/gradiant/` | Returns 404 | Never use |

The spelling trap is real: the skill is named *gradiate*, the product is the *Gradient* Designer, and the intuitive path `/gradiant/` does not exist. The ground source states it flatly: "https://steadyorbitsystems.com/gradiant/ returns 404. Use /radiant/." Any agent that builds the URL from the skill name instead of copying it will fail on the first fetch.

The workers.dev host is the Cloudflare Worker origin behind the steady-orbit deployment; the custom domain and the worker origin serve the same page, so either is valid for ingestion.

## 3. The ingestion sequence

The ground source describes the mechanism in 1 line: "The generator fetches the page, reads its component script, and runs the designer's buildCss and buildPrompt functions." Unpacked into steps:

1. **Fetch** the designer HTML from the configured URL.
2. **Locate the component script** inside that page (the script that owns the designer's state and output logic).
3. **Load `buildCss`** and call it with the layer spec built from the user's JSON. Output: the CSS block (selector, `background-color`, `background-image` with the stacked `linear-gradient(...)` layers).
4. **Load `buildPrompt`** and call it with the same spec. Output: the copy-out agent prompt that another agent can apply to a target page.
5. **Print both** to stdout; with `--out DIR`, also write `gradient.css` and `prompt.md` (details in doc 06).

The ground source does not document the internal shape of the component script, the exact argument signature of `buildCss` / `buildPrompt`, or how the generator isolates the page script from Node globals. Those details live in `scripts/gradiate.mjs` and are out of scope for this record; nothing here should be read as a claim about them.

## 4. Overriding the designer location

The ground source names exactly 1 configuration knob: "Set GRADIATE_DESIGNER_URL to point at another copy of the page."

Practical uses that follow directly from that sentence:

- Point at the workers.dev mirror if the custom domain is unreachable.
- Point at a staging or local copy of the designer while testing a change to `buildCss` or `buildPrompt`, so generator output can be checked before the change ships to `/radiant/`.

Constraint implied by the design: whatever copy `GRADIATE_DESIGNER_URL` points at must expose the same component script with the same 2 functions, or the generator has nothing to call.

## 5. Failure modes worth naming

Derived from the endpoint facts above (not separately documented in the ground source):

| Symptom | Likely cause | Move |
|---|---|---|
| Fetch returns 404 | URL built as `/gradiant/` | Use `/radiant/` |
| Custom domain unreachable | DNS or edge issue | Set `GRADIATE_DESIGNER_URL` to the workers.dev mirror |
| Output format differs from last week | Designer page was updated | Expected behavior; the run-time read is the point |
| Hand-written CSS loses its background | Missing semicolon dropped the declaration | Re-run the generator; never hand-edit (Guideline 1) |

## 6. Where this fits in the workflow

Ingestion is invisible in the 7-step workflow of the ground source, but every step that produces output (step 4, "Write a JSON spec ... and run the generator") depends on it. Color choice and alpha (docs 02 and 03) shape the spec; ingestion turns the spec into the designer's own CSS and prompt; sizing (doc 04) and browser verification (doc 05) happen after the CSS lands on the page.

## Sources

| Source | Type | Use |
|---|---|---|
| `yubi-OS/yubiOS skills/gradiate/SKILL.md` | Internal record (ground source) | All claims in this doc |
