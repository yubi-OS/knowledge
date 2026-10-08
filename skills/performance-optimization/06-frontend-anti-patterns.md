# Frontend Anti-Patterns

Scope: Frontend fixes: responsive image optimization (srcset, sizes, art direction, AVIF/WebP), React re-render control, and bundle size with code splitting and lazy loading.

## Images without dimensions or responsive sizes

The source doc's BAD case is `<img src="/hero.jpg" />`: no dimensions, no format optimization. That one line produces 2 of the frontend symptom rows from doc 04: slow LCP (large images) and high CLS (images without dimensions).

The GOOD case for a hero or LCP image combines 2 techniques: art direction (different crop or composition per breakpoint via `media`) and resolution switching (right file size per screen density via `srcset` and `sizes`), with explicit `width`/`height` to reserve layout space and `fetchpriority="high"` to pull the LCP image early:

```html
<picture>
  <source media="(max-width: 767px)"
    srcset="/hero-mobile-400.avif 400w, /hero-mobile-800.avif 800w"
    sizes="100vw" width="800" height="1000" type="image/avif" />
  <source media="(max-width: 767px)"
    srcset="/hero-mobile-400.webp 400w, /hero-mobile-800.webp 800w"
    sizes="100vw" width="800" height="1000" type="image/webp" />
  <source srcset="/hero-800.avif 800w, /hero-1200.avif 1200w, /hero-1600.avif 1600w"
    sizes="(max-width: 1200px) 100vw, 1200px" width="1200" height="600" type="image/avif" />
  <source srcset="/hero-800.webp 800w, /hero-1200.webp 1200w, /hero-1600.webp 1600w"
    sizes="(max-width: 1200px) 100vw, 1200px" width="1200" height="600" type="image/webp" />
  <img src="/hero-desktop.jpg" width="1200" height="600" fetchpriority="high"
    alt="Hero image description" />
</picture>
```

Below-the-fold images get the opposite treatment: `loading="lazy"` and `decoding="async"`, still with explicit dimensions. All of this is source-doc material; the responsive-image dig results are weak-backed (0.06 to 0.33) and add no claims beyond it.

## Unnecessary re-renders (React)

The source doc's example is an object literal created inline in JSX, which gives children a new reference every render:

```tsx
// BAD: Creates new object on every render, causing children to re-render
function TaskList() {
  return <TaskFilters options={{ sortBy: 'date', order: 'desc' }} />;
}

// GOOD: Stable reference
const DEFAULT_OPTIONS = { sortBy: 'date', order: 'desc' } as const;
function TaskList() {
  return <TaskFilters options={DEFAULT_OPTIONS} />;
}
```

Plus the 2 memoization tools used sparingly: `React.memo` for expensive components and `useMemo` for expensive computations. The source doc's red flags list is emphatic that overuse is as bad as underuse: "React.memo and useMemo everywhere" is listed as a red flag, matching the measure-first discipline in doc 01.

The React dig results include the official react.dev site (w 0.82, [react.dev](https://react.dev/)) and its quick-start page (w 0.62, [react.dev/learn](https://react.dev/learn)), which anchor the framework context but do not carry specific performance claims in their snippets. The rest are weak-backed (0.16 to 0.34).

## Large bundle size

The source doc's guidance starts with a correction of common practice: modern bundlers (Vite, webpack 5+) handle named imports with tree-shaking automatically, provided the dependency ships ESM and is marked `sideEffects: false` in package.json. Profile before changing import styles; the real gains come from splitting and lazy loading:

```typescript
const ChartLibrary = lazy(() => import('./ChartLibrary'));   // heavy, rarely-used feature
const SettingsPage = lazy(() => import('./pages/Settings')); // route-level code splitting

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <SettingsPage />
    </Suspense>
  );
}
```

"Bundle size growing without review" is on the red flags list, and the budgets in doc 09 (JavaScript bundle under 200KB gzipped for initial load, CSS under 50KB) are the enforcement line. The symptom side lives in doc 04: slow initial load points to large bundle and many network requests.

## What to remember

1. Every img gets width and height; LCP images get fetchpriority="high"; below-the-fold images get loading="lazy" (source doc).
2. Combine art direction (media) with resolution switching (srcset + sizes) for hero images (source doc).
3. Fix re-render storms with stable references first, memoization second, and never blanket-memoize (source doc).
4. Tree-shaking is automatic under ESM with sideEffects: false; the real wins are code splitting and lazy loading (source doc).
5. All responsive-image dig results in this subtopic were weak-backed; the source doc carries the claims.
