# 05. The prequeue worker: eliminating the inter-track gap

**Scope.** The background prequeue worker pattern: overlapping the next track's download and transcode with the current track's playback, the prequeue.lock single-worker guard, the atomic next.* to current.* swap, and the fallback to cold download on failure.

## The pattern in general terms

Gapless playback is the uninterrupted playback of consecutive audio tracks such that the flow between them is seamless (Gapless playback, Wikipedia, https://en.wikipedia.org/wiki/Gapless_playback, jev weight 0.60). The classical way to achieve it is to prepare the next unit of work while the current one runs. That is exactly the prefetch-overlap pattern: use a prefetch transformation to overlap the work of a producer and a consumer (TensorFlow tf.data performance guide, https://www.tensorflow.org/guide/data_performance, jev weight 0.89). The same idea appears as a PrefetchQueue for I/O overlap, downloading the next job while processing the current one (Archebase PrefetchQueue issue, https://github.com/archebase/roboflow/issues/76, jev weight 0.59), and as the general background job queue pattern of running work outside the request path (Redis job queue docs, https://redis.io/docs/latest/develop/use-cases/job-queue/, jev weight 0.85).

## How the queue applies it

The daemon spawns a background prequeue worker for the next URL in queue.txt while the current track plays (source doc, Architecture). The worker executes the same per-track pipeline as the foreground, but writes into the next.* file family: next.webm from yt-dlp, then next.mp3, then next.pcm from ffmpeg. Because the download is the slow phase, moving it off the playback-critical path removes the 5 to 15 second gap that version 1 of this skill suffered between every track (source doc, "Why this exists").

In steady state, when queue.txt has at least 2 entries, the next track is downloaded and transcoded while the current one plays, and the handover is an instant swap (source doc, Quirks).

## The three guards and fallbacks

1. Single worker at a time. prequeue.lock holds the PID of the in-flight worker and is absent when idle. The daemon only launches a new worker if no lock is present; the worker removes the lock on exit, success or failure (source doc). Overlapping more than one track would need separate next2.* slots and more daemon logic, which the source doc notes is not built.
2. Failure falls back to cold download. If yt-dlp or ffmpeg fails inside the worker, it removes next.* cleanly and logs PREQUEUE: failed. The daemon's next iteration cold-downloads that URL when its turn comes; there is no infinite retry loop (source doc, Quirks).
3. clear kills the worker. Emptying the queue mid-cycle with queue.sh clear also kills any running worker and cleans up next.*, so a worker cannot keep churning on a song about to be discarded (source doc, Quirks).

## The two residual gaps

The source doc is honest about when a pause still occurs (source doc, Quirks):

1. The cold-start first song always pays the download cost; there is no previous track to hide it behind.
2. If the prequeue download takes longer than the current track's playback duration, for example a very short clip followed by slow network conditions, the swap is not ready in time and the next song starts with a cold download.

queue.sh status exists precisely to diagnose this: it shows the worker's PID from prequeue.lock and whether next.pcm is already prepared (source doc, Recipes).

## Why not disable it

The source doc lists "don't disable the prequeue to simplify" as an anti-pattern: the gap between tracks was the user's most-noticed friction with the v1 design, and any fork is instructed to keep the prequeue worker (source doc, Anti-patterns).

## Sources

- Source doc: yubi-OS/yubiOS skills/radio-queue/SKILL.md, sections "Why this exists", "Architecture", "Quirks", "Recipes", "Anti-patterns" (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/radio-queue/SKILL.md)
- Gapless playback, Wikipedia, https://en.wikipedia.org/wiki/Gapless_playback, weight 0.60 (the en.m.wikipedia.org mirror of the same article scored 0.56)
- tf.data prefetch transformation, https://www.tensorflow.org/guide/data_performance, weight 0.89
- PrefetchQueue I/O overlap issue, https://github.com/archebase/roboflow/issues/76, weight 0.59
- Redis job queue docs, https://redis.io/docs/latest/develop/use-cases/job-queue/, weight 0.85
