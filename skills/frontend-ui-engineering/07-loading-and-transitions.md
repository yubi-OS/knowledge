# 07 Loading and Transitions

**Scope line:** how the skill handles asynchronous UI: skeleton loaders instead of spinners for content, and optimistic updates with rollback for perceived speed.

**Grounding spine:** `yubi-OS/yubiOS skills/frontend-ui-engineering/SKILL.md` (source doc). Dig backing: TanStack Query optimistic-updates docs (weight 0.95), TkDodo's React Query blog (weight 0.78), skeleton-vs-spinner practitioner guides (weights 0.20 to 0.27, weak).

## Skeletons, not spinners

The skill's loading rule: skeleton loading, not spinners for content (source doc). Its skeleton example renders 3 placeholder rows that mirror the real list-item shape (`h-12` blocks with `bg-muted animate-pulse rounded`), and marks the container with `aria-busy="true"` and an `aria-label="Loading tasks"` (source doc).

Two design decisions are packed into that example:

1. **Shape fidelity.** The skeleton mimics the content's actual layout, so the transition from skeleton to content is a swap in place, not a relayout. Practitioner guides describe skeletons as communicating structure and perceived speed better than spinners for content-shaped regions, while spinners remain appropriate for short, indeterminate actions (https://www.onething.design/post/skeleton-screens-vs-loading-spinners, weight 0.27, weak backing; https://www.72technologies.com/blog/skeleton-screens-vs-spinners-when-each-wins, weight 0.26, weak backing; https://www.layoutscene.com/skeleton-screens-vs-loading-spinners/, weight 0.20, weak backing). The corpus labels these weak: they are UX-agency and practitioner posts, and the skeleton-over-spinner rule itself is asserted by the source doc.
2. **Accessibility.** The skeleton is not silent. `aria-busy="true"` tells assistive technology the region is being updated, and the `aria-label` names what is loading (source doc). One practitioner guide states the pairing explicitly: use `aria-busy="true"` on the loading container and `aria-live="polite"` on the region where results will appear, and do not put `aria-live` on the skeleton itself (https://www.72technologies.com/blog/skeleton-screens-vs-spinners-when-each-wins, weight 0.26, weak backing).

The skill's container pattern wires skeletons into the state machine: `TaskListContainer` returns `TaskListSkeleton` while `isLoading` is true, before error and empty checks (source doc; see doc 02). Loading is a first-class state, not an afterthought; missing loading states is a red flag (source doc; see doc 08).

## Optimistic updates

The skill's second rule: optimistic updates for perceived speed (source doc). Its example is a `useToggleTask` hook built on React Query's `useMutation` (source doc):

```tsx
return useMutation({
  mutationFn: toggleTask,
  onMutate: async (taskId) => {
    await queryClient.cancelQueries({ queryKey: ['tasks'] });
    const previous = queryClient.getQueryData(['tasks']);
    queryClient.setQueryData(['tasks'], (old: Task[]) =>
      old.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
    );
    return { previous };
  },
  onError: (_err, _taskId, context) => {
    queryClient.setQueryData(['tasks'], context?.previous);
  },
});
```

(source doc). The 4 steps, in order:

1. **Cancel in-flight queries** for the affected key so a refetch does not overwrite the optimistic write (source doc).
2. **Snapshot the previous cache value** and hold it in the mutation's context (source doc).
3. **Write the optimistic value** into the cache with `setQueryData` (source doc).
4. **Roll back on error** by restoring the snapshot in `onError` (source doc).

This is exactly the pattern TanStack Query documents: `onMutate` runs before the mutation function, and any value it returns is passed to both `onError` and `onSettled` as the context argument, which is how the rollback receives its snapshot (https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates, weight 0.95). The query-cancel step is part of the documented pattern for the same reason the source doc shows it: an in-flight fetch landing after the optimistic write would clobber it (https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates, weight 0.95).

TkDodo's React Query blog extends the pattern to the case the simple example does not cover: concurrent optimistic updates to the same entity can race, and resilient optimistic UI needs to account for mutations that interleave (https://tkdodo.eu/blog/concurrent-optimistic-updates-in-react-query, weight 0.78). The source doc's example is the single-mutation baseline; the concurrent case is the known hard extension of it.

## Why optimistic updates belong to server state

The example only works because the task list lives in the React Query cache (source doc's own data flow). If the task list were scattered `useState` copies, there would be no single cache to write optimistically and no snapshot to roll back. This is the state-ladder rule from doc 03 doing load-bearing work: server state (rung 5) is what makes the optimistic pattern implementable in 15 lines.

## The performance argument

The skill's overview counts perceived speed as part of "performant," and optimistic updates are its named technique (source doc). The other performance note in the skill is the design one from doc 04: shadow-heavy design slows rendering on low-end devices, so the skill's performance posture is both perceived (optimistic UI) and real (render cost discipline) (source doc).

## Anti-patterns from the source doc

- Spinners for content-shaped regions (source doc, "skeleton loading (not spinners for content)").
- Silent skeletons without `aria-busy` and a label (source doc, by the example's shape).
- Optimistic writes without a snapshot and rollback (source doc, by the example's `onError` restore).
- Optimistic writes without canceling in-flight queries first (source doc, by the example's `cancelQueries` call).

## Sources

- yubi-OS/yubiOS skills/frontend-ui-engineering/SKILL.md (source doc, primary source of record)
- https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates (weight 0.95)
- https://tkdodo.eu/blog/concurrent-optimistic-updates-in-react-query (weight 0.78)
- https://www.onething.design/post/skeleton-screens-vs-loading-spinners (weight 0.27, weak)
- https://www.72technologies.com/blog/skeleton-screens-vs-spinners-when-each-wins (weight 0.26, weak)
- https://www.72technologies.com/blog/skeleton-screens-vs-spinners-loading-patterns (weight 0.26, weak)
- https://www.layoutscene.com/skeleton-screens-vs-loading-spinners/ (weight 0.20, weak)
