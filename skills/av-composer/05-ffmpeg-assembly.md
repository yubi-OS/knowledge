# 05. ffmpeg Assembly

Source doc: `yubi-OS/yubiOS/skills/av-composer/SKILL.md` (primary source of record), plus searXNG dig results on FFmpeg filters (jev-weighted below).

The assembly script (`scripts/assemble.js`) is the pipeline's second half: it turns the captured JPEG frame sequence plus a declarative audio manifest into the finished MP4. Everything it does rides on FFmpeg's documented filter set (jev weight 0.76: ffmpeg.org/ffmpeg-filters.html, the official filter documentation).

## Video path

```
-framerate 30 -i frames/f%04d.jpg
-c:v libx264 -crf 19 -preset medium -pix_fmt yuv420p
-t <duration>
```

The image-sequence input consumes the capture's `f0000.jpg...` numbering directly; `libx264` + `yuv420p` gives a broadly compatible H.264 MP4; `-t` clamps the container to the composition's exact duration. CRF 19 is the validated standard-quality point; draft passes can run higher.

## The audio mix graph (dig-grounded)

Audio comes from `audio-manifest.json`, generated from the composition's declarative `<audio>` elements by `scripts/extract-audio.js`. The assembly script builds one `filter_complex` per the official filter docs:

- Per-clip `volume=<v>` (each clip's declared volume; the amix normalization pitfall is why the script uses `amix=normalize=0`, keeping declared volumes authoritative rather than letting amix scale them).
- `afade=t=out:st=<s>:d=<d>` for a music fade-out (documented audio filter, same filter doc).
- `adelay=<start*1000>:all=1` to position each clip at its declared start (the `all=1` flag delays all channels, which matters for stereo sources; this is the documented behavior the offset-based SFX placement relies on).
- `amix=inputs=N:normalize=0` to sum everything into one track.

then encodes `aac` at 192k and muxes it with the video. Every SFX lands at the same timestamp as its visual moment because both come from the same declared `data-start`.

## The poster bake

The best frame is picked by eye from extracted stills (the plan defines the moments; the composition is the source), then two copies happen: the picked frame is written as `<output-dir>/av.jpg` (the standalone poster) AND copied over `frames/f0000.jpg` BEFORE the ffmpeg encode. Frame 0 of the finished MP4 is then the idle thumbnail everywhere (social embeds, file browsers) with no re-encode or concat step. The pick-then-bake order matters: baking an arbitrary first frame wastes the video's best moment as its thumbnail.

## Failure behavior

The script fails loudly: a missing audio file in the manifest exits with the offending path before ffmpeg runs; an ffmpeg non-zero exit propagates. There is no silent degrade to a video without its audio layer, because a silent launch video is a defect, not a fallback.

## Deliverable

Output is `<output-dir>/av.mp4`: video libx264 yuv420p, audio aac 192k, exact duration, frame 0 = poster. Verification is doc 08's job (duration + stream presence + visual stills).

## Sources

- `yubi-OS/yubiOS/skills/av-composer/SKILL.md` (source doc, primary)
- https://ffmpeg.org/ffmpeg-filters.html (jev 0.76)
- https://salivity.github.io/ffmpeg/article/mix-multiple-audio (jev 0.10, weak)
- https://superuser.com/questions/1619992/ (jev 0.09, weak)
