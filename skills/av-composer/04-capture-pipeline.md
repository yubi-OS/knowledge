# 04. The Capture Pipeline

Source doc: `yubi-OS/yubiOS/skills/av-composer/SKILL.md` (primary source of record), plus searXNG dig results on headless Chrome and Puppeteer (jev-weighted below).

The capture script (`scripts/capture.js`) turns the composition into a numbered JPEG frame sequence. It is the pipeline's determinism boundary: every frame is produced by an explicit timeline seek, never by wall-clock animation.

## What it runs

The script launches Chrome's headless shell, the automation and testing binary Chrome itself documents for headless workflows (jev weight 0.63: developer.chrome.com/docs/automation-and-testing/hea...), driven by Puppeteer, the browser-automation library whose screenshot API is the workhorse here (jev weight 0.64: pptr.dev/guides/screenshots). Launch flags: `--no-sandbox`, `--disable-gpu`, `--hide-scrollbars`, `--force-device-scale-factor=1`, `--font-render-hinting=none`, with a viewport read from the composition's own `data-width`/`data-height` (the Puppeteer viewport API is what the script sets, weight 0.59: pptr.dev/api/puppeteer.viewport). `deviceScaleFactor=1` matters for determinism: a fractional scale factor changes rasterization between environments.

## The readiness gate

Before the first frame, the script waits for TWO conditions and fails fast if either is not met within 30s:

1. The paused timeline is registered on `window.__timelines` under the composition id. Capturing without a registered timeline produces the frozen-at-CSS-defaults failure (doc 07) and must never happen silently.
2. `document.fonts.status === 'loaded'`. If a local font file is missing, the capture refuses rather than rendering fallback-font frames into the whole sequence.

On failure the script prints which condition failed and the hint (is gsap bundled locally and registered?), then exits non-zero. This is the zero-external-calls contract's enforcement point.

## The frame loop

For each frame index `i` at fps (default 30):

1. Seek: `window.__timelines[id].seek(t, false)` with `t = i / fps`. The `false` suppresses events; seeking is pure state positioning.
2. Flush: wait two `requestAnimationFrame`s so the seek's state is painted.
3. Screenshot: JPEG (quality 92 standard / 85 draft), path `f0000.jpg`, `f0001.jpg`, ...

Resumability is structural: the script skips frame files that already exist, so an interrupted capture (container restart, timeout) continues where it stopped. Measured throughput on a single core: ~9 fps, 616 frames in ~71 seconds. Duration comes from `--duration` or, if omitted, is derived from the longest `<audio data-start + data-duration>` in the composition.

## Sizing and quality

The composition's pixel geometry is authoritative (1920x1080 in the validated run); the script reads it from the DOM and sets the Puppeteer viewport to match, so a composition change of dimensions requires no flag change. Draft quality exists for review iterations: the plan/brief loop rarely needs the final encode, and a full re-capture at draft cost is about a minute.

## Why seek-driven capture (rather than screen recording)

Screen recording captures whatever the browser happens to paint at wall-clock time: dropped frames, animation timing drift, font-loading flashes. Seek-driven capture makes frame N a pure function of the timeline: the same composition + the same seek schedule yields the same bytes on every run, which is what makes re-captures, poster picking, and partial re-renders safe.

## Sources

- `yubi-OS/yubiOS/skills/av-composer/SKILL.md` (source doc, primary)
- https://developer.chrome.com/docs/automation-and-testing/headless (jev 0.63)
- https://pptr.dev/guides/screenshots (jev 0.64)
- https://pptr.dev/ (jev 0.67)
- https://pptr.dev/api/puppeteer.viewport (jev 0.59)
