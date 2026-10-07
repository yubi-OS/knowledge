# 03 State Management

**Scope line:** the skill's state ladder, from local `useState` to global stores, plus the 3-level prop drilling rule that decides when to climb it.

**Grounding spine:** `yubi-OS/yubiOS skills/frontend-ui-engineering/SKILL.md` (source doc). Dig backing: React official docs (weights 0.92 to 0.94), LogRocket URL-state guides (weights 0.27 and 0.24, weak), Context-vs-Zustand comparisons (weights 0.14 to 0.17, weak).

## The ladder

The skill's core state rule is: choose the simplest approach that works (source doc). It lays out 6 rungs, each scoped to a specific kind of state (source doc):

| Rung | Tool | Use for |
|---|---|---|
| 1 | Local state (`useState`) | Component-specific UI state |
| 2 | Lifted state | Shared between 2 to 3 sibling components |
| 3 | Context | Theme, auth, locale (read-heavy, write-rare) |
| 4 | URL state (`searchParams`) | Filters, pagination, shareable UI state |
| 5 | Server state (React Query, SWR) | Remote data with caching |
| 6 | Global store (Zustand, Redux) | Complex client state shared app-wide |

(source doc). The ladder is an ordering, not a menu: you are expected to fail upward. A piece of state starts at rung 1 and moves up only when its scope outgrows the current rung.

React's own guidance supports starting local: component state managed with `useState` is the default mechanism for state that only affects one component, and the React docs treat lifting state up as the move you make only when 2 components need the same state (https://react.dev/learn, weight 0.94; https://react.dev/, weight 0.92).

## Rung by rung

**Local state (rung 1).** Toggles, input values, hover state, open/closed panels. If state never leaves the component, it lives there (source doc).

**Lifted state (rung 2).** When 2 to 3 siblings need the same value, lift it to their nearest common parent and pass it down (source doc). Lifting beyond a handful of siblings is the signal to move up instead.

**Context (rung 3).** The skill scopes context tightly: theme, auth, locale, and characterizes it as read-heavy, write-rare (source doc). That characterization is the performance argument in compressed form. Third-party guides reach the same conclusion from the failure direction: Context is not a global store, and using it as one causes re-render problems (https://stacknotice.com/blog/react-context-vs-zustand-2026, weight 0.17, weak backing; https://dev.to/gavincettolo/react-state-management-when-to-use-usestate-context-or-zustand, weight 0.14, weak backing). Both weakly-backed sources agree with the source doc's split, which is the kind of weak corroboration the corpus labels rather than hides.

**URL state (rung 4).** Filters, pagination, and any UI state a user would want to share or bookmark (source doc). The skill's `searchParams` pointer matches the pattern of storing application state in the URL's query parameters instead of component memory, which makes list views restorable and linkable (https://blog.logrocket.com/advanced-react-state-management-using-url-parameters/, weight 0.27, weak backing; https://blog.logrocket.com/url-state-usesearchparams/, weight 0.24, weak backing). Weak weights here reflect the sources being practitioner blogs rather than official docs; the practice itself is named by the source doc.

**Server state (rung 5).** Remote data with caching belongs to React Query or SWR, not to `useState` copies of API responses (source doc). Server state differs from client state in that it has a source of truth outside the app, which is exactly why a caching layer owns it.

**Global store (rung 6).** Zustand or Redux is for complex client state shared app-wide (source doc). It is the last rung, reserved for state that has outgrown context's read-heavy, write-rare profile.

## The prop drilling rule

The skill's second hard rule: avoid prop drilling deeper than 3 levels (source doc). If you are passing props through components that do not use them, the fix is not more drilling; it is introducing context or restructuring the component tree (source doc). Note the ordering: the skill reaches for context only at the point of pain, not by default.

This rule ties the ladder together. Prop drilling is the symptom of state that is too low on the ladder for its actual scope, and the 3-level threshold is the measurable signal to move it up one rung.

## How this doc's rules interact with the rest of the skill

- The container component pattern from doc 02 is rung 5 in action: the container's `useTasks()` call is server state, and the container routes loading, error, empty, and data states from it (source doc).
- The optimistic-update pattern in doc 07 depends on rung 5: React Query's `useMutation` cache rollback only works when remote data lives in the query cache instead of scattered local copies (source doc; https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates, weight 0.95).

## Anti-patterns from the source doc

- Reaching for a global store for state that 2 or 3 components share (source doc, by inversion of rung 2).
- Using context as a general-purpose store for write-heavy state (source doc, by the read-heavy, write-rare scoping).
- Prop drilling beyond 3 levels (source doc).
- Duplicating server data into local `useState` instead of using a server-state cache (source doc, by inversion of rung 5).

## Sources

- yubi-OS/yubiOS skills/frontend-ui-engineering/SKILL.md (source doc, primary source of record)
- https://react.dev/ (weight 0.92)
- https://react.dev/learn (weight 0.94)
- https://blog.logrocket.com/advanced-react-state-management-using-url-parameters/ (weight 0.27, weak)
- https://blog.logrocket.com/url-state-usesearchparams/ (weight 0.24, weak)
- https://stacknotice.com/blog/react-context-vs-zustand-2026 (weight 0.17, weak)
- https://dev.to/gavincettolo/react-state-management-when-to-use-usestate-context-or-zustand (weight 0.14, weak)
