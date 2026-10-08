# 07. URL verification before queueing

**Scope.** Probing URLs with yt-dlp --skip-download --dump-single-json before queueing, the Video unavailable failure mode (burned slots, polluted logs, forced cold downloads), and the verification discipline behind the shipped example playlists.

## The probe

Before a URL enters queue.txt, the source doc prescribes a cheap metadata probe on rock1:

```bash
yt-dlp --no-check-certificates --skip-download --dump-single-json 'https://www.youtube.com/watch?v=VIDEO_ID'
```

`--skip-download` means no audio is fetched, so the probe costs almost nothing; `--dump-single-json` prints one JSON object describing the video. A verified URL returns a JSON blob containing `"title"` and `"id"` fields; an unverified one returns the error instead (source doc, Recipes). Third-party guidance describes the same flow as the standard way to get titles, durations, and thumbnails without downloading (ytdlp.org metadata guide, https://ytdlp.org/guides/get-video-metadata, jev weight 0.84).

## The failure mode: Video unavailable

yt-dlp reports `ERROR: [youtube] <id>: Video unavailable` when the URL is wrong, the video was removed, or it is region-locked (source doc, Recipes). Upstream issue traffic documents the same classes of failure: region-restricted videos failing to download from datacenter or mismatched IPs (yt-dlp issue 3641, https://github.com/yt-dlp/yt-dlp/issues/3641, jev weight 0.44, weak backing), videos that play in the browser but report "This video is not available" to the extractor (yt-dlp issue 7831, https://github.com/yt-dlp/yt-dlp/issues/7831, jev weight 0.31, weak backing), and playback-embedding-disabled errors surfacing as Video unavailable variants (yt-dlp issue tracker, https://github.com/yt-dlp/yt-dlp/issues, jev weight 0.20, weak backing). The upstream troubleshooting wiki collects these cases (yt-dlp troubleshooting wiki, https://deepwiki.com/yt-dlp/yt-dlp-wiki/4-troubleshooting, jev weight 0.29, weak backing).

## Why it matters: the 3 costs of a bad URL

The source doc quantifies what a bad queue entry costs (source doc, Recipes):

1. It burns a queue slot. Consumed means removed from queue.txt; the slot is spent whether or not the song plays.
2. It pollutes queue.log with the failure text.
3. It forces the next URL through a cold download, because the failed track produces no next.pcm for the prequeue to swap in.

Pre-verification saves an estimated 30 to 60 seconds per bad URL (source doc).

The daemon's own resilience rule, errors do not kill the daemon, is good for uptime but does not keep the log clean; verification is the complement, not a replacement (source doc).

## The playlist discipline

The shipped example playlists embody the rule (source doc, "Files in this skill"):

- scripts/examples/playlist-classic-rock.md had one wrong ID: Don't Stop Me Now was listed as HgzGwKwLmgQ instead of the correct HgzGwKwLmgM. The error was fixed on 2026-08-05 with a comment annotation.
- scripts/examples/playlist-upbeat-verified.md contains 6 upbeat YouTube IDs verified via yt-dlp on 2026-08-05 (Don't Stop Me Now, Walking on Sunshine, Happy, September, I Gotta Feeling, Uptown Funk) and is the new default for "queue something upbeat" requests.
- scripts/examples/playlist-jacob-collier.md and scripts/examples/playlist-lofi-verified.md are likewise curator-selected and verified.
- scripts/examples/playlist-samplman.md is the full-channel dump archetype: all 65 uploads from the SAMPLMAN - Topic channel, yt-dlp verified 2026-08-05, about 1 hour 53 minutes total runtime.

For new playlists, the source doc's instruction is to run each URL through the probe first and only queue the ones that resolve (source doc, Recipes).

## Sources

- Source doc: yubi-OS/yubiOS skills/radio-queue/SKILL.md, sections "Recipes", "Files in this skill" (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/radio-queue/SKILL.md)
- yt-dlp metadata without downloading, https://ytdlp.org/guides/get-video-metadata, weight 0.84
- yt-dlp GitHub repository, https://github.com/yt-dlp/yt-dlp, weight 0.69
- yt-dlp issue 3641, https://github.com/yt-dlp/yt-dlp/issues/3641, weight 0.44 (weak)
- yt-dlp issue 7831, https://github.com/yt-dlp/yt-dlp/issues/7831, weight 0.31 (weak)
- yt-dlp troubleshooting wiki, https://deepwiki.com/yt-dlp/yt-dlp-wiki/4-troubleshooting, weight 0.29 (weak)
- yt-dlp issue tracker index, https://github.com/yt-dlp/yt-dlp/issues, weight 0.20 (weak)
