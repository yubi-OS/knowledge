# 05 Accessibility WCAG 2.1 AA

**Scope line:** the skill's accessibility floor: every component must meet WCAG 2.1 AA, which decomposes into keyboard navigation, ARIA labels, focus management, and meaningful empty and error states.

**Grounding spine:** `yubi-OS/yubiOS skills/frontend-ui-engineering/SKILL.md` (source doc). Dig backing: W3C WAI WCAG pages (weights 0.97 to 0.98).

## The standard

The skill sets one standard and states it in the heading: WCAG 2.1 AA. WCAG (the Web Content Accessibility Guidelines) is the international standard for making web content more accessible to people with disabilities, covering versions 2.0 through 2.2 (https://www.w3.org/WAI/standards-guidelines/wcag/, weight 0.98). The skill's rationalizations table forecloses the most common excuse: "accessibility is a nice-to-have" is answered with "it's a legal requirement in many jurisdictions and an engineering quality standard" (source doc).

The source doc points to a companion reference (`../../references/accessibility-checklist.md`) for detailed accessibility requirements and testing tools (source doc); the corpus docs here stay within what the SKILL.md itself asserts.

## Keyboard navigation

The rule: every interactive element must be keyboard accessible (source doc). The skill's examples grade 3 shapes:

- A `<button onClick>` is focusable by default (marked correct).
- A `<div onClick>` is not focusable (marked wrong).
- A `<div role="button" tabIndex={0}>` with keydown and keyup handlers for Enter and Space works, but is marked "but prefer `<button>`" (source doc).

The Space handling detail is deliberate: the div needs `e.preventDefault()` on keydown for Space and fires on keyup, matching native button behavior; the skill shows that emulating a button in a div is possible but strictly worse than using the real element (source doc).

This maps to WCAG Guideline 2.1 (Keyboard Accessible), which requires that all functionality be operable through a keyboard interface, defined broadly to include keyboard emulators and other hardware or software that generates keystrokes (https://www.w3.org/WAI/WCAG21/Understanding/keyboard-accessible, weight 0.97). The keyboard-trap sub-case (SC 2.1.2, Level A) requires that users can always navigate away from a component, which is the formal basis for the focus-trap pattern in modals below (https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap.html, weight 0.97).

"Tab through the page" is also a verification checklist item: keyboard accessibility is verified by tabbing, not by inspection (source doc; see doc 08).

## ARIA labels

Two labeling rules (source doc):

1. **Label interactive elements that lack visible text.** The example is a close button that renders only an icon: `<button aria-label="Close dialog"><XIcon /></button>` (source doc).
2. **Label form inputs.** Prefer the visible-label pattern `<label htmlFor="email">Email</label>` with `<input id="email" type="email" />`; use `aria-label` only when no visible label exists, as in `<input aria-label="Search tasks" type="search" />` (source doc).

The ordering in the second rule is the teaching point: `aria-label` is the fallback for icon-only or visually unlabeled controls, not a substitute for a real label when one can be shown.

## Focus management

The skill's focus rule: move focus when content changes (source doc). Its Dialog example does 2 things when `isOpen` becomes true: focuses the close button through a ref (`closeRef.current?.focus()` inside a `useEffect` keyed on `isOpen`), and traps focus inside the dialog while open, using the native `<dialog open>` element (source doc).

The combination covers both directions of the keyboard problem: a dialog that opens without moving focus leaves keyboard users on the background page, and a dialog that does not trap focus lets Tab escape it. The no-keyboard-trap success criterion requires users to know how to navigate away and never be stuck in a component (https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap.html, weight 0.97); a trap with a visible, focusable close button is the compliant version of a trap.

## Meaningful empty and error states

The rule: don't show blank screens (source doc). The skill's empty-state example renders a `role="status"` region with an icon, an h3 title ("No tasks"), helper text ("Get started by creating a new task"), and a Create Task button (source doc). An empty state is a designed screen with a next action, not a null return.

The error-state rule appears in the container pattern: an error renders `ErrorState` with a message and a retry that calls `refetch` (source doc; see doc 02). Missing error, loading, or empty states is a red flag (source doc; see doc 08).

`role="status"` matters here too: it marks the region for screen readers, the same mechanism the skill's loading skeleton uses with `aria-busy="true"` (source doc; see doc 07).

## Contrast and color, restated from the design doc

The skill's design section carries 2 accessibility rules that belong to this floor: contrast of 4.5:1 for normal text and 3:1 for large text, and never relying solely on color to convey information (source doc; detailed in doc 04). The red-flags list repeats the color rule concretely: color as the sole indicator of state, red/green without text or icons (source doc).

## Verification

The accessibility half of the post-build checklist (source doc; expanded in doc 08):

- All interactive elements are keyboard accessible (Tab through the page).
- The screen reader can convey the page's content and structure.
- No accessibility warnings in dev tools or axe-core.

axe-core is the skill's named automated check; it is an accessibility testing engine for HTML-based UIs that integrates with existing test environments for automated runs (https://github.com/dequelabs/axe-core, weight 0.89, from the verification dig; see doc 08).

## Sources

- yubi-OS/yubiOS skills/frontend-ui-engineering/SKILL.md (source doc, primary source of record)
- https://www.w3.org/WAI/standards-guidelines/wcag/ (weight 0.98)
- https://www.w3.org/WAI/WCAG21/Understanding/keyboard-accessible (weight 0.97)
- https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap.html (weight 0.97)
- https://github.com/dequelabs/axe-core (weight 0.89)
