# 04 Design System Adherence

**Scope line:** tokens, spacing, typography, and color rules that keep UI consistent with the project's design system, and the AI-aesthetic anti-pattern table the skill uses to name what "generic" looks like.

**Grounding spine:** `yubi-OS/yubiOS skills/frontend-ui-engineering/SKILL.md` (source doc). Dig backing: design token guides (weights 0.36 to 0.59), AI-aesthetic commentary (weights 0.07 to 0.11, weak).

## The AI aesthetic table

The skill's most opinionated section is a table of AI-generated UI defaults, each with the reason it is a problem and the production-quality replacement (source doc):

| AI default | Why it is a problem | Production quality |
|---|---|---|
| Purple/indigo everything | Models default to visually "safe" palettes, making every app look identical | The project's actual color palette |
| Excessive gradients | Visual noise that clashes with most design systems | Flat or subtle gradients matching the design system |
| Rounded everything (rounded-2xl) | Maximum rounding ignores the hierarchy of corner radii in real designs | Consistent border-radius from the design system |
| Generic hero sections | Template layout with no connection to the actual content or user need | Content-first layouts |
| Lorem ipsum-style copy | Placeholder text hides layout problems that real content reveals (length, wrapping, overflow) | Realistic placeholder content |
| Oversized padding everywhere | Equal generous padding destroys visual hierarchy and wastes screen space | Consistent spacing scale |
| Stock card grids | Uniform grids ignore information priority and scanning patterns | Purpose-driven layouts |
| Shadow-heavy design | Layered shadows compete with content and slow rendering on low-end devices | Subtle or no shadows unless the design system specifies |

(source doc). Third-party commentary corroborates the pattern from the outside: the "purple gradient plus Inter font plus three icon boxes" look is documented as a recognizable failure mode of AI-generated frontends (https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website, weight 0.11, weak backing; https://dev.to/jaainil/ai-purple-problem-make-your-ui-unmistakable-3ono, weight 0.07, weak backing). The weak weights matter here: the mechanism claim (models default to safe palettes) is asserted by the source doc itself, and the dig sources are practitioner commentary, not measurement. The corpus records both honestly.

The red-flags section compresses the table into a checklist item: a generic "AI look" of purple gradients, oversized cards, and stock layouts is a red flag (source doc).

## Spacing: use the scale, never invent values

The skill's spacing rule: use a consistent spacing scale and don't invent values (source doc). Its example uses 0.25rem increments: `padding: 1rem` (16px) and `gap: 0.75rem` (12px) are on the scale; `padding: 13px` and `margin-top: 2.3rem` are not (source doc). The rule is project-relative, "or whatever the project uses," which makes it compatible with any token system (source doc).

This is the enforcement half of design tokens. Design tokens are the foundational visual atoms of a design system: colors, spacing, typography values that components reference instead of raw values (https://design.dev/guides/design-systems/, weight 0.59). Token guides make the same structural distinction the skill depends on: primitive tokens (raw values) versus semantic tokens (roles like surface or muted) (https://www.contentful.com/blog/design-token-system/, weight 0.37, weak backing).

## Typography: the hierarchy is semantic, not stylistic

The skill fixes a 5-level type hierarchy: h1 for the page title (one per page), h2 for section titles, h3 for subsections, body for default text, and small for secondary or helper text (source doc). Two prohibitions follow: don't skip heading levels, and don't use heading styles for non-heading content (source doc).

Both prohibitions are accessibility rules in disguise. Heading level order is part of WCAG's structure requirements, and the skill's verification checklist includes "screen reader can convey the page's content and structure" (source doc). Styling a paragraph to look like a heading breaks that contract for screen reader users even when the visual result matches the design.

## Color: semantic tokens plus contrast

Three color rules (source doc):

1. **Use semantic tokens, not raw hex.** `text-primary`, `bg-surface`, `border-default` instead of hex values. Semantic color systems exist precisely because a single raw brand color referenced in hundreds of places makes rebrands and dark modes painful (https://uicolors.org/blog/design-tokens-semantic-color-system, weight 0.36, weak backing). The CSS-variables approach to tokens mirrors the design system's conceptual structure, which keeps the codebase maintainable as it evolves (https://penpot.app/blog/the-developers-guide-to-design-tokens-and-css-variables/, weight 0.52).
2. **Ensure sufficient contrast: 4.5:1 for normal text, 3:1 for large text** (source doc). These are the WCAG 2.1 AA contrast thresholds (WCAG 2 Overview: https://www.w3.org/WAI/standards-guidelines/wcag/, weight 0.98, from the accessibility dig; see doc 05 for the full standard).
3. **Don't rely solely on color to convey information.** Use icons, text, or patterns too (source doc). This is also a WCAG obligation (use of color, 1.4.1) and appears again in the red-flags list as "color as the sole indicator of state (red/green without text or icons)" (source doc).

## Why adherence beats taste

The rationalizations table shows the skill anticipates the arguments for skipping the design system: "the design isn't final, so I'll skip styling" is answered with "use the design system defaults; unstyled UI creates a broken first impression for reviewers," and "the AI aesthetic is fine for now" with "it signals low quality; use the project's actual design system from the start" (source doc). The skill's position is that adherence is the cheapest point in the lifecycle to be right: retrofitting a design system onto shipped UI costs more than following it from the first component (source doc, rationalizations table).

## Anti-patterns from the source doc

- Purple/indigo defaults, excessive gradients, rounded-2xl everywhere, generic heroes, lorem ipsum, oversized padding, stock card grids, shadow-heavy design (source doc, table above).
- Off-scale spacing values like 13px or 2.3rem (source doc).
- Skipped heading levels, heading styles on non-headings (source doc).
- Raw hex colors instead of semantic tokens (source doc).

## Sources

- yubi-OS/yubiOS skills/frontend-ui-engineering/SKILL.md (source doc, primary source of record)
- https://design.dev/guides/design-systems/ (weight 0.59)
- https://penpot.app/blog/the-developers-guide-to-design-tokens-and-css-variables/ (weight 0.52)
- https://www.contentful.com/blog/design-token-system/ (weight 0.37, weak)
- https://uicolors.org/blog/design-tokens-semantic-color-system (weight 0.36, weak)
- https://www.w3.org/WAI/standards-guidelines/wcag/ (weight 0.98)
- https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website (weight 0.11, weak)
- https://dev.to/jaainil/ai-purple-problem-make-your-ui-unmistakable-3ono (weight 0.07, weak)
