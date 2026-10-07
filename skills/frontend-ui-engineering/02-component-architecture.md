# 02 Component Architecture

**Scope line:** how the skill structures components: colocated folders, composition over configuration, focused single-responsibility components, and separation of data fetching from presentation.

**Grounding spine:** `yubi-OS/yubiOS skills/frontend-ui-engineering/SKILL.md` (source doc). Dig backing: React official docs (weight 0.92 and 0.93), patterns.dev container/presentational (weight 0.35, weak), Robin Wieruch folder structure (weight 0.44, weak).

## Colocation first

The skill's file-structure rule is: colocate everything related to a component (source doc). Its canonical layout puts a component's implementation, tests, stories, custom hook, and types in one folder:

```
src/components/TaskList/
  TaskList.tsx          # component implementation
  TaskList.test.tsx     # tests
  TaskList.stories.tsx  # Storybook stories (if using)
  use-task-list.ts      # custom hook (if complex state)
  types.ts              # component-specific types (if needed)
```

(source doc). Each satellite file is conditional: stories only "if using", a hook only "if complex state", types only "if needed". The rule is not "create 5 files for every component"; it is "when a component needs one of these, it lives next to the component, not in a distant shared directory."

This matches the feature-folder school of React organization. React's own documentation teaches building UIs "out of individual pieces called components" that are composed together (https://react.dev/, weight 0.92; https://react.dev/learn, weight 0.93), and third-party guides converge on the same advice: structure React projects around components with clean boundaries rather than by technical file type (https://www.robinwieruch.de/react-folder-structure/, weight 0.44, weak backing; the author is a well-known React educator but the page is a personal blog, not primary documentation).

## Composition over configuration

The skill's second pattern rule: prefer composition over configuration (source doc). The good example nests a Card into CardHeader and CardBody children; the anti-example is a single Card component taking `title`, `headerVariant`, `bodyPadding`, and a `content` prop (source doc).

Why composition wins: a configured component grows a boolean or enum prop for every layout variation, and its API surface becomes the union of every consumer's needs. A composed component exposes slots (children) and stays ignorant of how it is arranged. React's component model is explicitly built around composition of independent pieces (https://react.dev/, weight 0.92). The source doc treats the over-configured form as an avoid-pattern, not a style preference.

## Focused components

The skill's third rule: keep components focused, "does one thing" (source doc). Its TaskItem example is a list item that renders a checkbox, a title with a done-state style, and a delete button, and nothing else (source doc). Focused components are testable as a unit and reusable without configuration knobs.

The red-flags section turns this into a hard threshold: components with more than 200 lines should be split (source doc). 200 lines is the trigger to find the second responsibility hiding inside the component, not a target to aim for.

## Container and presentation separation

The skill's fourth rule: separate data fetching from presentation (source doc). Its example splits a TaskList into:

- **TaskListContainer**, which calls `useTasks()`, then routes on the result: `TaskListSkeleton` while loading, `ErrorState` with a retry on error, `EmptyState` when the list is empty, and the plain `TaskList` when data exists (source doc).
- **TaskList**, a pure presentation component that takes `tasks` and maps them to `TaskItem`s inside a `ul role="list"` (source doc).

This is the container/presentational pattern: separating the view from application logic so each can change independently (https://www.patterns.dev/react/presentational-container-pattern/, weight 0.35, weak backing; the site is a well-regarded patterns reference but the result scored below the 0.5 authoritative line, so treat it as corroborating context rather than primary evidence).

Note what the container example is really doing: it is enforcing the state-machine shape of UI. Every async view has loading, error, empty, and data states, and the container is the single place that decides which one renders. That is why the skill's red-flags list calls missing error, loading, or empty states a red flag (source doc; see doc 08).

## How the 3 rules compose

The patterns are not independent style choices; they stack:

1. Colocation means a component's hook, tests, and types travel together, so a split of a 200-line component moves files, not just functions (source doc).
2. Composition means the split parts recombine through children and slots instead of growing props (source doc).
3. Container/presentation means the data-heavy half of the split is a container with the state machine, and the render-heavy half is a presentational leaf (source doc).

A component that follows all 3 is small by construction: the container only fetches and routes states, the presentational part only renders, and anything reusable got extracted into a composed child.

## Anti-patterns from the source doc

- Over-configured components with variant props for every layout case (source doc).
- Components doing both data fetching and presentation (source doc).
- Components above 200 lines (source doc, red flags).

## Sources

- yubi-OS/yubiOS skills/frontend-ui-engineering/SKILL.md (source doc, primary source of record)
- https://react.dev/ (weight 0.92)
- https://react.dev/learn (weight 0.93)
- https://www.patterns.dev/react/presentational-container-pattern/ (weight 0.35, weak)
- https://www.robinwieruch.de/react-folder-structure/ (weight 0.44, weak)
