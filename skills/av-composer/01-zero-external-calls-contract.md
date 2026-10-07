# 01. The Zero-External-Calls Contract

Source doc: `yubi-OS/yubiOS/skills/av-composer/SKILL.md` (primary source of record). Internal-record subtopic, no dig.

av-composer's defining constraint is that every build and render step runs on local binaries and local files: "Nothing in this pipeline makes a network request" (source doc). This is not a preference; it is a hard contract with 5 verifiable points, each of which exists because its violation was observed to break a real run.

## The five points

1. **GSAP is bundled locally.** The composition carries `assets/vendor/gsap.min.js` and references it with a relative path. The source doc's warning is specific: a CDN `<script src>` silently fails in headless capture, the composition freezes at CSS defaults, and every animated element stays at its initial state. Lint does not catch this failure mode; the capture readiness gate does (see doc 04).
2. **Fonts are local or system.** `@font-face` with local woff2 files under `assets/fonts/`, or a system font stack. Google Fonts `@import` and `<link>` are banned in a composition: they add network latency and nondeterminism to every captured frame.
3. **Audio and images are local files** under the composition's `assets/` tree, referenced by relative paths. Absolute paths silently fail in the renderer (the capture browser loads the composition over `file://`, where absolute filesystem paths point elsewhere).
4. **No runtime fetches.** The composition script must not call `fetch()` or XHR at all. If data is needed, it is inlined into the HTML.
5. **The capture browser is a local binary** (`chrome-headless-shell` at `/usr/local/bin/chrome-headless-shell`) driven by local `puppeteer-core`. No downloads, no browser installation steps, no remote browser services.

## Why the contract is strict

The zero-calls rule is what makes the pipeline usable in constrained environments: sandboxes with no or mediated network egress, disk-capped filesystems where a tool's own install step would fail, and air-gapped or policy-restricted machines. It also makes renders deterministic: no font substitution surprises, no CDN flake, no version drift between two runs of the same composition. The source doc's failure-lessons section (doc 07) records that each external dependency that was tried (CDN GSAP, Google Fonts import) had to be replaced locally before the pipeline validated.

## What "local" includes

The contract scopes more than the composition file. The skill's own scripts (capture, assemble, audio extraction) are local Node scripts; the audio and image assets are local files copied into the composition tree; the render is a local ffmpeg invocation. The only binaries touched are ones already installed on the machine: the headless Chrome shell, ffmpeg, and node. If a capability seems to require a network call (voice synthesis is the obvious one), the skill's answer is to drop the capability rather than grant an exception: v1 is intentionally silent on narration, and the source doc routes voice work to a later pass.

## Verification

The contract is verifiable rather than aspirational: the capture script refuses to run until the composition's GSAP timeline is registered and `document.fonts.status` reaches `loaded` (proving local fonts resolved), and the assembly step fails loudly on any missing audio file. A composition that violates the contract fails fast at a named step, not silently at render time.

## Sources

- `yubi-OS/yubiOS/skills/av-composer/SKILL.md` (source doc, primary)
