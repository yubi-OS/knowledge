# 07 - Codebase Analysis: Framework Detection, Tree-Shaking, Unused Code, Polyfills, Compression

Scope: Phase 5 of the web-perf audit, reading the codebase to find build-level causes for what the trace and network phases observed, and when to skip this phase entirely.

Grounding spine: yubi-OS/yubiOS skills/web-perf/SKILL.md (source doc).

## When to run and when to skip

The source doc gates this phase: "Skip if auditing a third-party site without codebase access." Without repository access, Phases 1 through 4 plus the report are the complete deliverable; do not speculate about a codebase you cannot read.

## Detect framework and bundler

The source doc maps config files to tools: webpack (`webpack.config.js`, `webpack.*.js`), Vite (`vite.config.js`, `vite.config.ts`), Rollup (`rollup.config.js`, `rollup.config.mjs`), esbuild (`esbuild.config.js` or build scripts referencing esbuild), Parcel (`.parcelrc` or a `parcel` field in package.json), Next.js (`next.config.js`, `next.config.mjs`), Nuxt (`nuxt.config.js`, `nuxt.config.ts`), SvelteKit (`svelte.config.js`), Astro (`astro.config.mjs`), plus `package.json` dependencies and build scripts as the tiebreaker.

For webpack specifically, the official site describes the scope of the tool: "webpack bundles JavaScript, CSS, HTML, WebAssembly and assets into optimized output for browsers, Node.js, Deno, Bun and other environments" (https://webpack.js.org/, weak backing, weight 0.26).

## Tree-shaking and dead code

The source doc's checklist is webpack-anchored: check for `mode: 'production'`, `sideEffects` in package.json, and `usedExports`; for Vite and Rollup, tree-shaking is enabled by default but the `treeshake` options are worth checking. The mechanism is documented upstream: "The sideEffects and usedExports (more known as tree shaking) optimizations are two different things. sideEffects is much more effective since it allows to skip whole modules/files and the complete subtree" (https://webpack.js.org/guides/tree-shaking/, weight 0.65). web.dev frames the entry point the same way: "Knowing where to begin optimizing your application's JavaScript can be daunting. If you're taking advantage of modern tooling such as webpack, however, tree shaking might be a good place to start!" (https://web.dev/articles/reduce-javascript-payloads-with-tree-shaking, weight 0.87).

The source doc also names the two classic killers: barrel files (`index.js` re-exports) and large utility libraries imported wholesale (lodash, moment). Secondary material confirms both: "The main purpose of manually configuring sideEffects is to eliminate unused reexported modules within barrel files" (https://dev.to/fogel/tree-shaking-in-webpack-5apj, weak backing, weight 0.11), and a practitioner course catalogs the failure modes: "Common Tree Shaking Failures. Problem 1: Side Effect Imports" (https://stevekinney.com/courses/react-performance/tree-shaking-optimization, weak backing, weight 0.25). A third explainer states the modern default: "The optimization properties of usedExports and sideEffects are enabled by default, leading to automatic optimization of the bundle files" (https://blog.saeloun.com/2022/11/24/tree-shaking-in-webpack-5/, weak backing, weight 0.2). Weak weights on these three are deliberate: they corroborate the source doc, they do not originate the guidance.

## Unused JS and CSS

The source doc's three probes: CSS-in-JS versus static CSS extraction, PurgeCSS/UnCSS configuration (for Tailwind, the `content` config), and dynamic imports versus eager loading. The tools are real and current: PurgeCSS is "Remove unused CSS" with integrations for PostCSS, Webpack, Gulp, Grunt, Gatsby, Vue.js, Nuxt.js, React.js, Next.js (https://purgecss.com/, weight 0.54). Tailwind's own production guide quantifies why the `content` config matters: "the development build of Tailwind CSS is 3645.2kB uncompressed, 294.2kB minified and compressed with Gzip, and 72.8kB when compressed with Brotli" (https://v2.tailwindcss.com/docs/optimizing-for-production, weight 0.66). That is the difference a content-scanned build makes: from 3.6MB to roughly 73KB on the wire.

Code splitting is the dynamic-import lever: "Sending large JavaScript payloads impacts the speed of your site significantly. Instead of shipping all the JavaScript to your user as soon as the first page of your application is loaded, split your bundle into multiple pieces" (https://web.dev/articles/reduce-javascript-payloads-with-code-splitting, weight 0.9). A general audit guide groups the same techniques: "Audit and eliminate unused CSS/JavaScript through coverage analysis, tree shaking, and PurgeCSS" (https://polytraffic.com/articles/remove-unused-css-javascript, weak backing, weight 0.15).

## Polyfills

Three probes from the source doc: `@babel/preset-env` targets and `useBuiltIns`, `core-js` imports (which it flags as often oversized), and `browserslist` configuration that targets browsers too broadly. The audit question is always "is this polyfill reachable by any supported browser?" and the browserslist config is the document that answers it.

## Compression and minification

Final probes: minifier in use (`terser`, `esbuild`, `swc`), gzip or brotli at the build or server layer, and source maps in production (external or disabled, never inlined). This is the bridge back to Phase 3: a request that `get_network_request` showed uncompressed is either a missing server-level compression setting or a build that shipped raw output, and this phase determines which.

## Connecting the phases

Every codebase finding should cite the runtime evidence it explains. Example shape: "Phase 3 found a 450KB uncompressed hero script; Phase 5 shows esbuild with no minification configured; fix is to enable esbuild minification in the build script." A codebase finding with no runtime counterpart is a hypothesis, and hypotheses do not go into recommendations.

Sources: https://webpack.js.org/guides/tree-shaking/ (weight 0.65), https://v2.tailwindcss.com/docs/optimizing-for-production (weight 0.66), https://purgecss.com/ (weight 0.54), https://web.dev/articles/reduce-javascript-payloads-with-tree-shaking (weight 0.87), https://web.dev/articles/reduce-javascript-payloads-with-code-splitting (weight 0.9), https://webpack.js.org/ (weak backing, weight 0.26), https://stevekinney.com/courses/react-performance/tree-shaking-optimization (weak backing, weight 0.25), https://blog.saeloun.com/2022/11/24/tree-shaking-in-webpack-5/ (weak backing, weight 0.2), https://dev.to/fogel/tree-shaking-in-webpack-5apj (weak backing, weight 0.11), https://polytraffic.com/articles/remove-unused-css-javascript (weak backing, weight 0.15), plus yubi-OS/yubiOS skills/web-perf/SKILL.md (source doc).
