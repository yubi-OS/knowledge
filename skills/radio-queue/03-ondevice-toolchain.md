# 03. The on-device toolchain: yt-dlp and ffmpeg

**Scope.** What runs on rock1: yt-dlp's format selection and install shape (zipapp versus standalone binary, the Python 3.10+ shebang), the daemon's exact download flags, and YouTube bot-detection workarounds (folded in from the dropped bot-detection subtopic).

## Why on-device download is the design

The queue's whole point is that yt-dlp and ffmpeg run on rock1, not on Sauna. Running yt-dlp on Sauna and transferring PCM chunks is the documented anti-pattern (source doc, Anti-patterns). yt-dlp itself is a feature-rich command-line audio and video downloader supporting thousands of sites (yt-dlp GitHub, https://github.com/yt-dlp/yt-dlp, jev weight 0.69), so it covers YouTube out of the box.

## The daemon's download command

Per track, the daemon runs (source doc, Architecture):

```
yt-dlp --no-check-certificates -f bestaudio -x --audio-format mp3
```

- `-f bestaudio` selects the best audio-only format. Format selection is ordered and the order matters: yt-dlp's README documents that format expressions are evaluated in order (yt-dlp README, https://github.com/yt-dlp/yt-dlp/blob/master/README.md, jev weight 0.75).
- `-x --audio-format mp3` extracts audio and transcodes it to mp3 as an intermediate stage before the PCM conversion (source doc).
- `--no-check-certificates` handles sandbox-style certificate-chain issues on some networks. The source doc is explicit that this flag is unrelated to YouTube bot detection (source doc, Quirks).

## Install shape: zipapp versus standalone binary

The source doc names two install paths for yt-dlp on rock1:

1. The GitHub URL distribution, which ships a Python zipapp requiring Python 3.10 or newer. install.sh rewrites the zipapp's shebang to whatever `which python3` resolves to; on rock1 that is Python 3.14 and it works fine.
2. The zero-dependency alternative: download the `yt-dlp_aarch64` PyInstaller standalone binary instead and edit install.sh to swap the URL (source doc, Quirks). Standalone binaries are an officially documented install shape for yt-dlp (yt-dlp GitHub, https://github.com/yt-dlp/yt-dlp, jev weight 0.64).

## Bot detection and its workarounds

YouTube can serve "Sign in to confirm you're not a bot" to yt-dlp on some videos (source doc, Quirks). The source doc orders the workarounds from least to most intrusive:

1. `--extractor-args "youtube:player_client=mediaconnect"`: newer player clients avoid some detection.
2. `--cookies-from-browser firefox`: needs a browser profile on rock1, which this skill does not set up.
3. `--cookies /tmp/cookies.txt`: cookies exported from a desktop browser first.

Third-party guidance matches this ordering: cookies alone do not always fix the error, and the request IP matters, since requests from cloud servers and VPNs are treated with suspicion (ytdlp.org guide, https://ytdlp.org/guides/fix-sign-in-to-confirm-not-a-bot, jev weight 0.66). A general cheat-sheet treatment of the same flags exists but carries weaker source weight (ditig yt-dlp cheat sheet, https://www.ditig.com/yt-dlp-cheat-sheet, jev weight 0.31, weak backing).

## ffmpeg as the transcode stage

ffmpeg is the one apt-installed dependency this skill adds to rock1 (source doc, Quirks: there is no stdlib alternative for audio decoding, and the parent skill's rule against installing alsa-utils stays). Its job in the pipeline is narrow: read the yt-dlp intermediate and emit raw PCM at the player's expected format. See doc 04 for the transcode and playback details.

## Sources

- Source doc: yubi-OS/yubiOS skills/radio-queue/SKILL.md, sections "Architecture", "Quirks", "Anti-patterns" (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/radio-queue/SKILL.md)
- yt-dlp GitHub repository, https://github.com/yt-dlp/yt-dlp, weights 0.69 and 0.64
- yt-dlp README format selection, https://github.com/yt-dlp/yt-dlp/blob/master/README.md, weight 0.75
- Bot-detection guide, https://ytdlp.org/guides/fix-sign-in-to-confirm-not-a-bot, weight 0.66
- yt-dlp cheat sheet, https://www.ditig.com/yt-dlp-cheat-sheet, weight 0.31 (weak)
