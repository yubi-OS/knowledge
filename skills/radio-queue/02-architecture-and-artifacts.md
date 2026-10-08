# 02. Architecture and artifacts

**Scope.** The /tmp/audio/queue/ directory layout, the current.* foreground and next.* background pipelines, the daemon's three per-song phases, and the five-step per-track pipeline.

*Internal-record subtopic, no dig: grounded in the source doc (yubi-OS/yubiOS skills/radio-queue/SKILL.md), which owns this content.*

## The directory layout

Everything the queue machinery touches lives under /tmp/audio/queue/ on rock1 (source doc, Architecture):

```
/tmp/audio/queue/
├── queue.txt          # playlist, one URL per line, append anytime
├── queue_player.sh    # daemon (one process) + spawned prequeue workers
├── queue.log          # rolling log, also tee'd to /dev/ttyS2
├── queue.out          # daemon stdout (normally empty)
├── prequeue.lock      # PID of in-flight prequeue worker (absent when idle)
├── prequeue.out       # prequeue worker stdout (debug only)
├── current.webm       # yt-dlp intermediate download, playing track
├── current.mp3        # ffmpeg extraction, playing track
├── current.pcm        # ffmpeg PCM output for play2.py, playing track
├── next.webm          # pre-downloaded intermediate for the NEXT track
├── next.mp3           # pre-extracted mp3 for the NEXT track
└── next.pcm           # pre-transcoded PCM, ready to swap in
```

Two parallel pipelines share this disk: foreground (current.*) is the track playing right now; background (next.*) is the track the prequeue worker is preparing while the foreground plays (source doc).

## The daemon's three phases per song

1. Ensure current.pcm is ready. If next.pcm exists (the worker finished during the previous track), atomically swap next.* to current.*, which is instant. Otherwise cold-download and transcode.
2. Launch the prequeue worker for the next URL in queue.txt, but only if no worker is already running. The prequeue.lock file is the guard; the worker removes it on exit, success or failure.
3. Play current.pcm via play2.py, then rm current.*. The worker keeps working on next.* during playback; the two file families never collide.

## The per-track pipeline

The same 5 steps run for every track, in the foreground for current.* and in the background for next.* (source doc):

1. yt-dlp --no-check-certificates -f bestaudio -x --audio-format mp3, producing {current,next}.webm and .mp3.
2. ffmpeg transcode to raw PCM: -ar 44100 -ac 2 -f s16le. Stereo, 44.1 kHz, CD quality.
3. sudo -n python3 /tmp/audio/set_mixer.py, the force-on mixer lock, idempotent and about 1 second, foreground only, before every song.
4. sudo -n python3 /tmp/audio/play2.py current.pcm --device hw:1,0 --rate 44100 --in-channels 2, foreground only.
5. rm current.*, foreground only. next.* is owned by the prequeue worker.

## Why the split matters

The prequeue keeps the download phase out of the playback-critical path. Downloads almost always finish before the playing track ends, so the swap at the start of the next song is instant (source doc). The only audible gaps are the cold-start first song, or the rare case where the prequeue download takes longer than the playing track's duration, for example a very short clip followed by slow network conditions.

## Ownership and scratch discipline

current.* belongs to the daemon's foreground loop; next.* belongs to the prequeue worker. Nobody else writes to either while the daemon runs, because racing the scratch files can corrupt a track mid-swap (source doc, Anti-patterns). queue.log is the shared observation surface and auto-truncates to its last half when it crosses 200 KB, so full history must be tailed externally (source doc, Quirks).

## Sources

- Source doc: yubi-OS/yubiOS skills/radio-queue/SKILL.md, sections "Architecture", "Quirks", "Anti-patterns" (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/radio-queue/SKILL.md)
