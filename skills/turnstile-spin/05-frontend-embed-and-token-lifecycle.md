# 05 Frontend embed and token lifecycle

Scope: the frontend-edit contract (gate, don't replace), the two rendering modes and their fit, the automatic `cf-turnstile-response` field, and the single-use token lifecycle with reset discipline.

Ground spine: `yubi-OS/yubiOS skills/turnstile-spin/SKILL.md` (source doc), Step 9 and "The frontend-edit contract".

## The contract: gate, don't replace

When wiring an existing form or user-triggered endpoint, the source doc's contract is explicit: gate, don't replace. The user's existing handler keeps doing what it did, and Spin only adds a validation step before it (source doc, "The frontend-edit contract"). On the backend this means the canonical siteverify fetch from Step 9 runs inside the existing handler, and "the existing handler logic stays the same" (source doc, Step 9 confirmation script). If the existing handler was a stub, Spin leaves it a stub gated on the checks; the user can replace the stub later, and that is not Spin's job (source doc, "The frontend-edit contract").

The frontend edit is equally minimal. The source doc's canonical embed keeps every existing input untouched and inserts one div inside the form (source doc, "The frontend-edit contract"):

```html
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

<form action="/signup" method="POST">
  <!-- existing inputs unchanged -->
  <div class="cf-turnstile" data-sitekey="<SITEKEY>" data-action="signup"></div>
  <button type="submit">Sign up</button>
</form>
```

Upstream, the script-URL rule is stricter than it looks: the `api.js` file must be fetched from the exact URL shown, because proxying or caching it will cause Turnstile to fail when future updates are released (weight 0.93, https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/). A build step that rewrites or vendors that URL silently breaks the widget.

## Implicit versus explicit rendering

Turnstile offers two ways to place widgets (weight 0.93, https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/):

- Implicit rendering scans the HTML for elements with the `cf-turnstile` class and renders on page load. Use it for static pages where forms exist at page load.
- Explicit rendering loads `api.js?render=explicit` and creates widgets programmatically with `turnstile.render()`. Use it for dynamic content and single-page applications where forms are created after initial load.

Explicit rendering returns a widget ID from `turnstile.render()`, and the API exposes `turnstile.reset(widgetId)` and `turnstile.remove(widgetId)` for lifecycle control (weight 0.93, https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/). The framework references the source doc carries (vanilla-html, nextjs-app, nextjs-pages, astro, sveltekit, hugo, per its frontmatter) exist precisely to put the right variant of this choice at each insertion point.

## The automatic token field

When a widget is embedded inside a `<form>` element, an invisible input named `cf-turnstile-response` is created automatically and submitted with the other form data (weight 0.93, https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/). That is why the backend reads the token from `req.body['cf-turnstile-response']` (source doc, "The frontend-edit contract") and why that exact string is one of the skill's load triggers.

## Token lifecycle: single-use, 300 seconds

The source doc states the lifecycle rule plainly: tokens are single-use, and a `cf-turnstile-response` token is redeemed exactly once at Siteverify (source doc, "The frontend-edit contract"). Upstream gives the numbers: each token is valid for 300 seconds (5 minutes) after generation, can be validated only once, and a replayed token is rejected with the `timeout-or-duplicate` error code (weight 0.95, https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

The consequence splits by form behavior:

- A native form that navigates away does not need reset logic (source doc, "The frontend-edit contract"). The page is gone, so the token cannot be reused.
- If the page remains active after a submission attempt, the widget must be rendered explicitly, its widget ID retained, and `window.turnstile.reset(widgetId)` called after the request completes before allowing a retry. Each protected surface must retain and reset its own widget ID (source doc, "The frontend-edit contract"). Without the reset, the retry submits the already-redeemed token and gets `timeout-or-duplicate`.

The 300-second window adds a second reset trigger: if the user waits too long before submitting, the server-side check fails with `timeout-or-duplicate` even for a first use, and the widget needs to be refreshed with `turnstile.reset` to generate a new token (weight 0.95, https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

The callbacks complement the lifecycle: `data-callback` fires with the token on success, `data-expired-callback` fires when the token expires, and data attributes control theme, size, and action (weight 0.93, https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/). A disable-the-button-until-success pattern driven by the success callback is the standard companion to the gate, since it stops users from submitting with no token at all.

## Putting it together

The frontend half of the integration is therefore small by construction: one script tag from the exact canonical URL, one widget div per surface with the sitekey and the stable action from the insertion plan, the implicit or explicit mode that fits the framework, and a reset call wherever the page outlives a submission. All of the enforcement lives on the other side of the network boundary, which is the subject of doc 06.
