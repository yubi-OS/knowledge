# 03. The Composition Contract

Source doc: `yubi-OS/yubiOS/skills/av-composer/SKILL.md` (primary source of record), plus searXNG dig results on the GSAP Timeline API (jev-weighted below).

An av-composer composition is ONE file: `composition/index.html`. The contract is small and strict, because the frame-capture pipeline depends on every rule in it.

## The skeleton

```html
<div id="root" data-composition-id="root" data-start="0" data-width="1920" data-height="1080"> ... </div>
<script src="assets/vendor/gsap.min.js"></script>
<script>
  var tl = gsap.timeline({ paused: true });
  // scene tweens, absolute time as the 3rd argument
  window.__timelines = window.__timelines || {};
  window.__timelines['root'] = tl;
</script>
```

The root element declares the composition id and pixel geometry; the capture script reads them from the DOM rather than trusting CLI flags. The timeline is created `paused: true` and registered on `window.__timelines` under the composition id.

## Seek-only motion (dig-grounded)

The capture driver seeks the timeline per frame; nothing else drives motion. This rests on GSAP's own control API: the upstream documentation defines GSAP Timelines as animation containers whose playhead can be positioned arbitrarily (jev weight 0.81: gsap.com/docs/v3/GSAP/Timeline/; a second copy of the same doc page reads 0.82), and `paused()` is a first-class timeline construction option (jev weight 0.77: gsap.com/docs/v3/GSAP/Timeline/paused()) that stops the timeline from playing on its own. GSAP itself is GreenSock's open-source animation platform (jev weight 0.74: github.com/greensock/GSAP; docs root 0.76). The `seek()` method used by the capture script is part of this same documented Timeline control surface.

The contract's corollary is the source doc's hard rule: **no CSS keyframe animations for timed motion**. CSS animations run on the browser's wall clock and cannot be positioned by a seek; in a frame-capture pipeline they desynchronize from the timeline. Static CSS styling is fine; anything that must move on the video's clock moves through the GSAP timeline.

## Supported properties and pitfalls

The pipeline's validated GSAP property set: opacity, x, y, scale, scaleX, scaleY, rotation, width, height, visibility. Two pitfalls are recorded in the source doc: `tl.set()` with no position argument appends at the END of the timeline (always give it an explicit time), and `fromTo` is preferred over `to` for state that must be exact at a seek boundary.

## Declarative audio

Audio is not scripted; it is declared on `<audio>` elements and honored later by the assembly step (doc 05):

```html
<audio data-start="0.56" data-duration="1.5" data-track-index="11" data-volume="0.7" src="assets/sfx/impact/bell.ogg"></audio>
```

Conventions: music on track-index 10, SFX on 11 and up; never share a track index between overlapping clips. Music volume sits at 0.25-0.4, SFX at 0.55-0.85. One element per clip.

## Determinism and beat locks

Procedural imagery (starfields, grids, particles) must be generated with a seeded PRNG at load time, never unseeded `Math.random()`, so every capture run renders identical frames. When a cue preset is available for the chosen music (doc 06), major reveals may be locked to strong cues within about ±0.15s and sequential non-text events to consecutive beats within about ±0.10s; readable sequential text snaps to every other beat. Each lock is commented in the composition: `// beat-locked: 8.74s`. Beat locks are bias, not control: if a lock hurts readability or pacing, the natural timing wins.

## Sources

- `yubi-OS/yubiOS/skills/av-composer/SKILL.md` (source doc, primary)
- https://gsap.com/docs/v3/GSAP/Timeline/ (jev 0.81, 0.82)
- https://gsap.com/docs/v3/GSAP/Timeline/paused()/ (jev 0.77)
- https://github.com/greensock/GSAP (jev 0.74)
- https://gsap.com/docs/v3/GSAP/ (jev 0.76)
- https://gsap.com/ (jev 0.48, weak)
