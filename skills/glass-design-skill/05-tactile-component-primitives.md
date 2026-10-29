# 05 - tactile-component-primitives

**Scope:** Lifting cards, drawers, buttons, switches, segmented tabs, menus, dialogs, and inputs into a 5-tier Liquid Glass elevation hierarchy with spring micro-interactions.

## Five-Tier Tactile Component Hierarchy

Apple's WWDC25 Liquid Glass specification defines controls and navigation as a distinct elevated functional layer floating above content ([Liquid Glass UI - Apple-Inspired Design Components](https://liquid-glass-ui.vercel.app/), weight 0.8888). In `glass-design-skill`, every interactive primitive is mapped to a specific optical profile ([26+ Liquid Glass Components for React & Tailwind | 21st](https://21st.dev/community/components/s/liquid-glass), weight 0.7832):

### Control Profiles

1. **Drawer Sections & Cards (`.sec.drawer`, `.card`, `.kpi`, `.pol-ctrl-card`):** Convex squircle slabs with top meniscus sheen and hover elevation (`translateY(-1.5px)`).
2. **Buttons (`button`, `.ghost`, `.primary`, `.danger`, `.dock-btn`):** Pill/squircle lenses with top Fresnel rim `inset 0 1px 0.5px rgba(255,255,255,0.65)` and active press compression (`scale(0.985)`) ([40+ Apple Liquid Glass-inspired UI Components for Next.js - glass-ui](https://next.jqueryscript.net/next-js/liquid-glass-ui/), weight 0.7015).
3. **Lip-Bezel Switches (`.sw-switch`, `.sw-track`, `.sw-knob`):** Recessed glass trough track with a convex liquid-glass thumb that slides smoothly and illuminates emerald/violet when active.
4. **Segmented Tabs & Menus (`.composer-bar`, `.chat-mode-bar`, `.diag-nav`, `select`, `input`, `textarea`):** Recessed optical channel where the selected tab lifts into a raised convex glass pill ([26+ Liquid Glass Components for React & Tailwind | 21st](https://21st.dev/community/components/s/liquid-glass), weight 0.7832).

## Sources Considered (Clef `noul` Quality Weights)

| # | Source | Query | Clef Weight | Verdict |
|---|---|---|---|---|
| 1 | [Liquid Glass UI - Apple-Inspired Design Components](https://liquid-glass-ui.vercel.app/) | `liquid glass UI components buttons switches tabs cards design system` | **0.8888** | authoritative (kept) |
| 2 | [26+ Liquid Glass Components for React & Tailwind - 21st](https://21st.dev/community/components/s/liquid-glass) | `liquid glass UI components buttons switches tabs cards design system` | **0.7832** | authoritative (kept) |
| 3 | [40+ Apple Liquid Glass-inspired UI Components for Next.js - glass-ui](https://next.jqueryscript.net/next-js/liquid-glass-ui/) | `liquid glass UI components buttons switches tabs cards design system` | **0.7015** | authoritative (kept) |
| 4 | [Liquid - Wikipedia](https://en.wikipedia.org/wiki/Liquid) | `liquid glass UI components buttons switches tabs cards design system` | **0.0706** | low-weight (filtered) |
| 5 | [Meet Liquid Glass - WWDC25 - Videos - Apple Developer](https://developer.apple.com/videos/play/wwdc2025/219/) | `Apple WWDC25 Liquid Glass controls navigation bars switches buttons` | **0.9507** | authoritative (kept) |
| 6 | [A Summary of the WWDC25 Group Lab … - Apple Developer Forums](https://developer.apple.com/forums/thread/791070) | `Apple WWDC25 Liquid Glass controls navigation bars switches buttons` | **0.8558** | authoritative (kept) |
| 7 | [Meet Liquid Glass - WWDCNotes](https://wwdcnotes.com/documentation/wwdc25-219-meet-liquid-glass/) | `Apple WWDC25 Liquid Glass controls navigation bars switches buttons` | **0.7245** | authoritative (kept) |
| 8 | [Apple](https://www.apple.com/) | `Apple WWDC25 Liquid Glass controls navigation bars switches buttons` | **0.1292** | low-weight (filtered) |
