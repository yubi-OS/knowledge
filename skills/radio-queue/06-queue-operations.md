# 06. Queue operations: the append interface, clip args, and queue.sh

**Scope.** The queue.txt append interface, per-line clip args, the queue.sh helper verbs, and one-shot deployment of install.sh and the daemon.

*Internal-record subtopic, no dig: grounded in the source doc (yubi-OS/yubiOS skills/radio-queue/SKILL.md), which owns this content.*

## The interface is a text file

The whole control surface for playback is /tmp/audio/queue/queue.txt: one URL per line, append anytime, even while the daemon is playing (source doc). Appending from Sauna is one bridge call:

```bash
curl -X POST "$BRIDGE/run" -d '{"command":["bash","-c",
  "echo https://www.youtube.com/watch?v=VIDEO_ID >> /tmp/audio/queue/queue.txt"]}'
```

Appending on rock1 directly is faster because it skips the bridge entirely (source doc, Recipes). There is no per-song bridge round-trip; that is the point of the design.

## Clip args

A queue line can carry per-line, pipe-separated arguments:

```
https://www.youtube.com/watch?v=VIDEO_ID|start=30|duration=120
```

- `start=N` skips the first N seconds.
- `duration=M` plays only M seconds and requires `start`.

Without args the full song plays, and the same format is honored by both the foreground download and the prequeue worker (source doc, Recipes). This is how a long track gets trimmed to a section without manual re-encoding.

## queue.sh verbs

The scripts/queue.sh helper (push to rock1 first) exposes the full operational vocabulary (source doc, Recipes):

| verb | effect |
|---|---|
| list | cat queue.txt |
| status | queue plus current playback plus prequeue state plus last log lines |
| clear | empty queue.txt; kills any running prequeue worker |
| skip | kill current play2.py so the next song starts immediately |
| stop | kill the daemon and any prequeue worker |
| add URL | append a URL |

status is the diagnostic entry point when "the gap is longer than usual": it shows whether a prequeue worker is in flight (its PID from prequeue.lock) and whether next.pcm is already prepared (source doc).

## One-shot deployment

Deployment is designed as a single push-then-install flow (source doc, Quick start):

1. Push install.sh, queue_player.sh, and queue.sh to rock1 (base64 push, single call).
2. Run install.sh on rock1: it installs ffmpeg and yt-dlp and creates /tmp/audio/queue/, idempotently.
3. Start the daemon detached: `nohup /tmp/audio/queue/queue_player.sh </dev/null >/dev/null 2>&1 &` returns immediately with the detached PID.
4. Append the first URL to queue.txt.

install.sh is pushed through the bridge with base64 encoding and decoded on the device in the same command that runs it (source doc). Before starting the daemon, check that it is not already running with `pgrep -af queue_player.sh` or `queue.sh status`, because a second daemon would compete for hw:1,0 (source doc, Anti-patterns).

## Operational invariants

- sudo -n is mandatory: install.sh and the daemon call sudo -n python3 and sudo -n ffmpeg, so the invoking user must already be in NOPASSWD sudoers; on rock1 this is set for shant (source doc, Quirks).
- When the queue runs dry, the daemon sleeps 5 seconds before re-checking queue.txt, so an append during that window starts on the next poll, worst case 5 seconds of latency; the sleep can be dropped to 1 second for real-time responsiveness (source doc, Quirks).
- Errors do not kill the daemon: a failed song is logged and the URL stays consumed, and the daemon moves on (source doc, Quirks).

## Sources

- Source doc: yubi-OS/yubiOS skills/radio-queue/SKILL.md, sections "Quick start (one-shot deploy)", "Recipes", "Quirks", "Anti-patterns" (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/radio-queue/SKILL.md)
