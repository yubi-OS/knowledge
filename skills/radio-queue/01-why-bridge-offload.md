# 01. Why the queue exists: bridge offload

**Scope.** Why the radio-queue skill moves downloads onto rock1: the per-song Tailscale Funnel round-trip cost of the parent play-audio-on-rock1 skill, and the user-driven design directives that shaped the queue design.

## The parent skill's transfer pattern

The parent skill, play-audio-on-rock1, generates a single audio clip, transcodes it, and ferries the raw PCM from Sauna to rock1 over the shell bridge. The bridge rides Tailscale Funnel, which exposes a local service on a device to the public internet through a unique Funnel URL (Tailscale docs, https://tailscale.com/docs/features/tailscale-funnel, jev weight 0.78). The payload on that hop is base64-encoded PCM, and base64 is a binary-to-ASCII encoding that expands binary data into printable characters (Wikipedia, https://en.wikipedia.org/wiki/Base64, jev weight 0.67), so every byte of audio costs more than a byte on the wire.

For one clip this is fine. The source doc is explicit that it is terrible for a playlist: every song becomes a dozen bridge calls before playback even starts (source doc, "Why this exists"). Moving downloads to the device means the bridge is used only to seed the queue and observe it. After seeding, each song is a local operation: yt-dlp fetches the audio, ffmpeg transcodes it, and the local player plays it. No Funnel round-trip per song.

## The gap problem in version 1

The first version of the skill downloaded and transcoded sequentially per song. That left a 5 to 15 second gap between tracks while yt-dlp fetched the next file and ffmpeg converted it (source doc). The prequeue worker was added specifically to close this: the next track's download and transcode overlap the current track's playback, so in steady state there is no audible pause (source doc; see doc 05 for the mechanism).

## The user directives that drove the design

The source doc records the user's voice verbatim, and both quotes are load-bearing for the design:

1. "is the download happening on device or on your end? make sure its on device so we can just queue a playlist" — this produced the on-device download requirement.
2. "add a prequeue for the download itself so theres no pause between tracks" — this produced the prequeue worker.

Both requirements are design constraints, not implementation details. Any fork of this skill that routes downloads through Sauna again, or drops the prequeue worker, violates the documented intent (source doc, Anti-patterns).

## What the bridge is still for

Even after offload, the bridge keeps 3 jobs (source doc, Recipes and Quirks):

1. Seeding the queue: appending URLs to /tmp/audio/queue/queue.txt from Sauna with a single POST per song (or directly on rock1, which is faster because it skips the bridge).
2. Observing: streaming queue.log with tail -F, also tee'd to /dev/ttyS2 for a serial console view.
3. Lifecycle control: queue.sh stop, status, skip, clear.

The architectural rule the source doc states is: the bridge seeds and observes, the device plays. A per-song data transfer over the bridge is the anti-pattern this skill exists to kill (source doc, Anti-patterns: "Don't run yt-dlp on Sauna + transfer PCM chunks").

## Sources

- Source doc: yubi-OS/yubiOS skills/radio-queue/SKILL.md, sections "Why this exists", "Anti-patterns", "Pairs with" (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/radio-queue/SKILL.md)
- Tailscale Funnel docs, https://tailscale.com/docs/features/tailscale-funnel, weight 0.78
- Base64, Wikipedia, https://en.wikipedia.org/wiki/Base64, weight 0.67
