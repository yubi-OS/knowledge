# 07. Failure Lessons

Source doc: `yubi-OS/yubiOS/skills/av-composer/SKILL.md` (primary source of record). Internal-record subtopic, no dig.

Every lesson in this runbook cost a real run. They are recorded here because each one has a symptom, a root cause, and a fix that has been validated.

## CDN GSAP = frozen composition

**Symptom:** snapshots show only CSS-default-visible content; every GSAP-animated element stays at its initial state; the readiness check fails with "Could not determine composition duration / no layout samples run". **Root cause:** a CDN `<script src="https://cdn.jsdelivr.net/npm/gsap...">` did not execute in the headless capture context. **Fix:** bundle gsap locally (`assets/vendor/gsap.min.js`, relative path). Note that lint passes even with the broken CDN tag, so lint alone does not catch this; the capture script's timeline-registration gate does.

## Disk gates refuse big tools

Large render tooling refuses to run under roughly 1 GB of free space, which matters in sandboxes whose writable tmpfs is under 1 GB total. This pipeline's temp cost is small (a 616-frame JPEG sequence is about 50 MB), but frames and output still belong on the largest writable mount, and `frames/` should be cleaned between iterations.

## Restart wipes in-flight state

A container or process restart destroys in-flight outputs (captured frames, temp files) and even `/tmp` may not survive between invocations. The pipeline is built for this: the capture script skips existing frame files, so a kill resumes where it stopped. The operational rule is to verify artifacts immediately after the step that produces them, and to keep multi-step flows inside a single invocation when their intermediate state lives in ephemeral space.

## Text on bright surfaces

A centered text block over a bright object (a sun disc, a hero image) becomes unreadable. The validated fix pattern has three parts: move the object down the canvas, raise the text block, and give headlines a `filter: drop-shadow(...)`. The drop-shadow detail matters: `filter: drop-shadow` shadows the RENDERED pixels, while `text-shadow` paints through `background-clip: text` gradient transparency and embosses the glyphs instead.

## Wrap control

Auto-wrapped support text at large display sizes lands orphan fragments (a word or period alone on a line). Give summary and support lines explicit `<br>` breaks at the boundaries chosen in the plan.

## Fonts

The capture script gates on `document.fonts.status === 'loaded'` and fails fast rather than capturing fallback-font frames. The corollary: every `@font-face` src must exist locally, and font weight fallbacks should be explicit (if a weight file is missing, declare the substitution rather than hoping the browser synthesizes it identically across environments).

## The meta-lesson

Each failure above was caught by a named verification step (readiness gate, stills review, ffprobe), not by luck. The pipeline's verification points are the reason the failure list is finite: a composition that violates the contract fails fast at a named step with a named hint, and a finished video is only reported after its stills have actually been read.

## Sources

- `yubi-OS/yubiOS/skills/av-composer/SKILL.md` (source doc, primary)
