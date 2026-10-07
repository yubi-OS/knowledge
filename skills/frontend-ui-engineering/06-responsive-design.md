# 06 Responsive Design

**Scope line:** the skill's responsive rule: design for mobile first, then expand, with a fixed breakpoint set to test at.

**Grounding spine:** `yubi-OS/yubiOS skills/frontend-ui-engineering/SKILL.md` (source doc). Dig backing: Tailwind CSS official docs (weights 0.59 and 0.95), mobile-first guides (weights 0.14 to 0.28, weak).

## The rule: mobile first, then expand

The skill's responsive rule is one sentence: design for mobile first, then expand (source doc). Its example is Tailwind's mobile-first breakpoint syntax applied to a grid: `grid grid-cols-1` for mobile, `sm:grid-cols-2` for small screens, `lg:grid-cols-3` for large screens, with `gap-4` throughout (source doc).

The base styles are the mobile styles; every breakpoint modifier only overrides upward. This matches Tailwind's documented model: Tailwind uses a mobile-first breakpoint system, where unprefixed utilities apply at all widths and prefixed utilities like `md:` apply at that breakpoint and above (https://tailwindcss.com/docs/responsive-design, weight 0.95; https://v3.tailwindcss.com/docs/responsive-design, weight 0.95). Tailwind's utility-first model is the framework context the skill writes its examples in (https://tailwindcss.com/, weight 0.59).

Why mobile first rather than desktop with shrink rules: starting from the small-screen constraint forces the layout to prioritize content, and larger breakpoints add complexity instead of removing it. Practitioner guides make the same argument: start with mobile styles as the base and progressively enhance for larger screens using min-width media queries (https://codelucky.com/css-breakpoints/, weight 0.14, weak backing; https://www.uxpin.com/studio/blog/a-hands-on-guide-to-mobile-first-design/, weight 0.24, weak backing). The weak weights flag these as corroborating practitioner sources; the mobile-first rule itself comes from the source doc.

## The breakpoint strategy

Tailwind's default breakpoints are the small-to-huge ladder (`sm`, `md`, `lg`, `xl`, `2xl`) and are customizable; Tailwind sorts custom screens so smaller breakpoints are inserted first (https://v3.tailwindcss.com/docs/screens, weight 0.95). The skill builds its testing plan on 4 concrete widths rather than Tailwind's full ladder:

> Test at these breakpoints: 320px, 768px, 1024px, 1440px. (source doc)

The 4 test widths bracket the practical range: 320px is small-phone width, 768px is tablet, 1024px is small desktop or landscape tablet, and 1440px is standard desktop. Breakpoints in general are pixel values where the layout adapts, and common breakpoint sets vary by source; the skill fixes a minimal, testable set instead of an exhaustive device list (https://www.browserstack.com/guide/responsive-design-breakpoints, weight 0.28, weak backing). Testing, not just styling, at each width is what the skill requires, and the verification checklist repeats it: "Responsive: works at 320px, 768px, 1024px, 1440px" (source doc; see doc 08).

## Retrofit is the cost to avoid

The skill's rationalizations table contains the responsive-specific excuse and its answer: "we'll make it responsive later" is met with "retrofitting responsive design is 3x harder than building it from the start" (source doc). The 3x figure is the source doc's own claim, not a measured industry average; the corpus records it as the skill's stated rule. The mechanism behind it is the ladder above: a desktop-first layout accumulates min-width assumptions in every component, and converting them to mobile-first later means re-deciding every breakpoint instead of adding 2 modifiers.

## What responsive means beyond the grid

The source doc's responsive section is short and grid-focused, but the skill's other sections carry responsive obligations:

- **Realistic content.** Placeholder copy "hides layout problems that real content reveals (length, wrapping, overflow)," and overflow problems are mostly narrow-viewport problems (source doc; see doc 04).
- **Spacing discipline.** Oversized padding that wastes screen space on desktop wastes entire rows on mobile; the spacing-scale rule is a mobile rule too (source doc; see doc 04).
- **Touch-size consequences.** The keyboard-and-focus rules in doc 05 are the interaction half of small-viewport design: a layout that works at 320px still needs focusable, operable controls.

## Anti-patterns from the source doc

- Desktop-first layouts awaiting a later responsive pass (source doc, rationalizations table).
- Shipping UI verified at only one width (source doc, verification checklist).
- Generic card grids whose uniform columns ignore information priority at each width (source doc; see doc 04).

## Sources

- yubi-OS/yubiOS skills/frontend-ui-engineering/SKILL.md (source doc, primary source of record)
- https://tailwindcss.com/docs/responsive-design (weight 0.95)
- https://v3.tailwindcss.com/docs/responsive-design (weight 0.95)
- https://v3.tailwindcss.com/docs/screens (weight 0.95)
- https://tailwindcss.com/ (weight 0.59)
- https://www.browserstack.com/guide/responsive-design-breakpoints (weight 0.28, weak)
- https://www.uxpin.com/studio/blog/a-hands-on-guide-to-mobile-first-design/ (weight 0.24, weak)
- https://codelucky.com/css-breakpoints/ (weight 0.14, weak)
