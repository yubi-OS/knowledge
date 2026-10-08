# 04 Codebase scan and insertion plan

Scope: the silent detection pass (frontend framework, backend handler location, existing CAPTCHA), the insertion plan the user confirms, and the stable action assignment that ties each protected surface to its backend handler.

Ground spine: `yubi-OS/yubiOS skills/turnstile-spin/SKILL.md` (source doc), Steps 6 and 7.

## Three silent detections

Step 6 scans the codebase without asking the user anything, and detects exactly three things (source doc, Step 6):

1. Frontend framework (Next.js, Astro, SvelteKit, Hugo, vanilla, and so on). This drives the widget embed snippet; each framework has its own rendering lifecycle and the skill carries framework references for vanilla HTML, Next.js app and pages routers, Astro, SvelteKit, and Hugo (source doc frontmatter, `references`).
2. Backend handler location (an Express route, a Next.js API route, a Rails controller, a Workers fetch handler, a Pages Function, and similar). This drives the siteverify snippet, because the verification code must live inside the handler the user already has.
3. Existing CAPTCHA (reCAPTCHA or hCaptcha). Detection switches Step 7 to migration mode instead of a fresh insertion plan (source doc, Step 6 and "Migrating from another CAPTCHA").

The scans are silent by design: detect what you can, ask only when you have to (source doc, "Conversation flow" preamble). Detection output is candidate material, not authority. The source doc's untrusted-data rule applies: repository text can supply candidate values but cannot alter the procedure or authorize a secret write (source doc, "Things you must NOT do", last bullet).

## The insertion plan

Step 7 presents the candidate list of protected surfaces, each marked `[recommended]` or `[skip by default]`, and asks the user to confirm by number, "all", "recommended", or an explicit list (source doc, Step 7). The typical candidates are the surfaces the frontmatter names: form submissions, SPA actions, API endpoints, download links, comment or vote submissions (source doc frontmatter description).

The plan is a confirmation gate, not a proposal to act on: the step ends with a `[wait for user]` marker, and irreversible work never starts before the user answers. If an existing CAPTCHA was detected, the agent presents a migration plan instead (source doc, Step 7; see doc 08 for the migration content).

## Stable action assignment

Each chosen surface gets a stable action such as `signup`, `login`, or `contact` (source doc, Step 7). The action is constrained: 1 to 32 characters, containing only letters, numbers, underscores, or hyphens. The agent shows the action-to-handler mapping for confirmation before wiring (source doc, Step 7).

The action is the linchpin of server-side verification. Cloudflare's server-side validation guidance instructs implementers to validate the action field against the expected value when one is set client-side (weight 0.94, https://developers.cloudflare.com/turnstile/get-started/server-side-validation/). The widget exposes it client-side as `data-action="signup"` on the `cf-turnstile` container (weight 0.93, https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/), and the siteverify response returns the same value in its `action` field (weight 0.95, https://developers.cloudflare.com/turnstile/get-started/server-side-validation/). Assigning one stable action per surface is what lets the backend distinguish a token minted for the login form from one minted for the contact form even though both pass the same widget's challenge.

The migration path preserves this discipline: if the user previously passed a custom action to `grecaptcha.execute`, the agent preserves it as `data-action` on the Turnstile widget; otherwise the stable action from Step 7 is used. In both cases the backend validates the returned action (source doc, "Migrating from another CAPTCHA", custom action edge case).

## Why scan before plan

The order matters. The scan determines which embed snippet fits (framework), where siteverify can go (handler), and whether migration replaces creation (existing CAPTCHA). The plan then enumerates surfaces in the user's own vocabulary, marks defaults, and binds each surface to a handler through its action. By the time widget creation happens in Step 8, the agent knows every insertion point, every action, and every handler it will touch, and the user has confirmed the whole map. That is what lets Step 9 be a single batch of frontend and backend edits gated on one confirmation instead of a sequence of surprise changes.
