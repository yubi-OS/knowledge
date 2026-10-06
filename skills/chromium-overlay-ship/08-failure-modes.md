# 08 - Failure modes already paid for

Scope: the six failure modes the source doc documents as "already paid for", each one a default that exists because it cost a ship cycle once. Bridge payload escaping, pgrep self-matching, mtime staleness, multi-target icon namespaces, generator-versus-artifact verification, and shadow-DOM verification of UI text.

Source doc: yubi-OS/yubiOS skills/chromium-overlay-ship/SKILL.md (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/chromium-overlay-ship/SKILL.md). The source doc's own framing: the pipeline is proven across patches 0001 through 0019 and 12+ fixups between 2026-09-27 and 2026-10-01, with 10 ship cycles in the Oct-1 session alone, and every default encodes a failure that already cost a cycle once (source doc).

## 1. Bridge JSON payload escaping

A `\|` (or any invalid `\x` escape) inside a grep pattern inside a bridge command 400s the whole call (source doc). The bridge body is JSON, and an unescaped backslash-pipe breaks JSON parsing before the command ever runs. The fix is to write alternation greps without backslashes: `grep -E 'a|b'` inside bridge payloads (source doc). Rule: build bridge commands as if every backslash is hostile.

## 2. pgrep self-matching

`pgrep -f "ninja -C out"` matches the bridge's OWN bash wrapper, because the wrapper's command line contains the pattern text (source doc). The bracket trick (`ninj[a]`) removes the self-match by making the pattern text no longer match its own literal occurrence, or confirm with `ps` (source doc). A false "build still running" signal can lead to killing a build that finished or waiting on one that is wedged.

## 3. mtime staleness vs ninja

Assets restored from a zip or tar carry mtimes OLDER than the pak output, so ninja silently skips the repack and the build ships old assets (source doc). This is the most dangerous failure mode because nothing errors: the pipeline reports success while shipping stale resources. The documented fix: touch the assets AND delete the stale grit intermediate, naming `gen/chrome/app/theme/theme_resources_grit.d.stamp` and `theme_resources_*_percent.pak` as the concrete artifacts, before rebuilding (source doc).

GRIT is Chromium's resource compiler; its user's guide (https://www.chromium.org/developers/tools-we-use-in-chromium/grit/grit-users-guide/, weight 0.92) documents the grd-to-pak compilation whose outputs (and stale stamp/intermediate files) this failure mode is about. Locale pak generation is a distinct GN target (`chrome_repack_locales.gni`, https://chromium.googlesource.com/chromium/src/+/main/chrome/chrome_repack_locales.gni, weight 0.88), which is why grd-only changes have their own repack path that staleness can silently bypass.

## 4. Multi-target .icon filenames

The same `.icon` filename exists in MULTIPLE build targets with different generated namespaces (source doc): `chrome/app/vector_icons` generates into `chrome::`, `components/omnibox/browser/vector_icons` into `omnibox::`, `components/vector_icons/<brand>/` into `vector_icons::`, and `ui/message_center` into `message_center::`. Chromium's vector icon system compiles `.icon` files into C++ constants (https://www.chromium.org/developers/how-tos/vectorized-icons-in-native-chrome-ui/, weight 0.86), and the icon source tree is spread across component directories (https://chromium.googlesource.com/chromium/src/+/main/components/vector_icons/, weight 0.88). The rule: resolve the CONSTANT to its generating target and grep the `gen/` output for the new geometry before declaring an icon replaced (source doc). Replacing the wrong target's icon compiles fine and renders nothing.

## 5. Generator-versus-artifact verification

A generator that validates through a different rendering path than the artifact it emits proves nothing; render and inspect the ACTUAL emitted artifact, the .icon coordinates, not the helper's SVG (source doc). This generalizes: any check that runs on a convenient proxy (a preview helper, an intermediate format) instead of the shipped artifact is a check that can pass while the artifact is wrong.

## 6. Shadow-DOM verification of brand-text edits

Verify brand-text edits against the rendered UI with a shadow-DOM-walking puppeteer script against CDP port 9229, checking `document.title`, anchor hrefs, and `div.secondary` texts, not against source greps (source doc). Chrome's UI is built in WebUI with shadow DOM, so plain DOM queries do not reach the text. Puppeteer is the browser-automation library for driving Chrome over the DevTools Protocol (https://pptr.dev/, weight 0.65; https://developer.chrome.com/docs/puppeteer/, weight 0.87; https://github.com/puppeteer/puppeteer, weight 0.8). Chrome documents the same DevTools protocol connection model in its Puppeteer docs (https://developer.chrome.com/docs/puppeteer/, weight 0.87). The specific port (9229) and the three probe targets come from the source doc's paid-for lesson (source doc).

## The meta-lesson

All six are verification or tooling failures, not logic failures: JSON that never parsed, a process list that lied, a build that skipped, an icon that was never the one, a helper that validated the wrong thing, and a source grep that cannot see shadow DOM (source doc). The skill's broader guideline is that verification happens at the layer the consumer actually sees: the emitted artifact, the rendered UI, the completed CI run at the right sha (source doc; docs.github.com workflow runs reference, https://docs.github.com/en/rest/actions/workflow-runs, weight 0.91).
