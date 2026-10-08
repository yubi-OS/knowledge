# 04. PCM transcode, ALSA playback, and the ES8316 mixer lock

**Scope.** How audio actually moves: ffmpeg's raw PCM output format (s16le, stereo, 44.1 kHz), playback through the ALSA device hw:1,0, and the ES8316 codec mixer locked at 100 percent before every song.

## The transcode: raw PCM at CD quality

Per track, after yt-dlp produces a webm/mp3 intermediate, ffmpeg emits raw PCM:

```
ffmpeg -i ….{webm,mp3} -ar 44100 -ac 2 -f s16le ….{pcm}
```

Three parameters define the format (source doc, Architecture): sample rate 44100 Hz, 2 channels (stereo), and signed 16-bit little-endian samples. The source doc calls this CD quality. Raw audio is a legitimate ffmpeg operating mode: ffmpeg can take input of raw audio types by specifying the type on the command line, and the same applies to raw output (FFmpeg wiki, audio types, https://trac.ffmpeg.org/wiki/audio%20types, jev weight 0.72). A community example of the same conversion shape, `ffmpeg -i file.wav -f s16le -acodec pcm_s16le`, exists on Stack Overflow (https://stackoverflow.com/questions/11986279/can-ffmpeg-convert-audio-from-raw-pcm-to-wav, jev weight 0.11, weak backing). The output format inspection rules that ffmpeg applies when no explicit mapping is given are documented in the main ffmpeg documentation (https://ffmpeg.org/ffmpeg.html, jev weight 0.87); this pipeline sidesteps them by naming the format explicitly.

Why raw PCM instead of a compressed file: the consumer is play2.py, the parent skill's stereo-aware ALSA PCM player, which reads a headerless sample stream directly into the ALSA device (source doc). Decoding in the player would add a dependency; emitting PCM in ffmpeg keeps the player simple.

## The ALSA device

playback targets `hw:1,0` with rate 44100 and 2 input channels:

```
sudo -n python3 /tmp/audio/play2.py current.pcm --device hw:1,0 --rate 44100 --in-channels 2
```

The device is exclusive: one song at a time, and the daemon kills no one because nothing else is playing by design (source doc, Quirks). Interleaving other audio sources would require a separate ALSA device or upstream mixing.

## The ES8316 codec

The ES8316 is the audio codec on the rock1 board. It is a first-class citizen of the Linux audio stack: the ALSA user-space configuration project ships a Use Case Manager configuration for ES8316 under its Rockchip tree (alsa-ucm-conf, https://github.com/alsa-project/alsa-ucm-conf/blob/master/ucm2/Rockchip/es8316/es8316.conf, jev weight 0.79), and the kernel's codec driver lives at sound/soc/codecs/es8316.c in mainline tracking trees (linux kernel source, https://github.com/Xilinx/linux-xlnx/blob/master/sound/soc/codecs/es8316.c, jev weight 0.71). ALSA mixer state is manipulated from user space with amixer, the command-line ALSA mixer (GeeksforGeeks amixer reference, https://www.geeksforgeeks.org/linux-unix/amixer-command-in-linux-with-examples/, jev weight 0.27, weak backing).

## Why the mixer lock exists

The daemon runs `sudo -n python3 /tmp/audio/set_mixer.py` before every song (source doc, Architecture). The reason is documented as a user-driven design choice: the ES8316 mixer state is in-memory and resets on reboot; without the lock, the next song can play at low volume or be muted (source doc, Quirks). The lock is idempotent and costs about 1 second, so it is affordable per song even though it runs in the playback-critical path. A manual re-run is available any time via the same command (source doc, Recipes: force mixer at 100 percent mid-playback).

## Failure shapes

- The mixer lock is per song, not set-and-forget: anything that resets the codec state between songs is corrected before the next playback starts (source doc).
- play2.py runs under sudo as root, which has lifecycle consequences for stopping the queue cleanly; that is doc 08's subject.

## Sources

- Source doc: yubi-OS/yubiOS skills/radio-queue/SKILL.md, sections "Architecture", "Quirks", "Recipes" (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/radio-queue/SKILL.md)
- FFmpeg wiki audio types, https://trac.ffmpeg.org/wiki/audio%20types, weight 0.72
- FFmpeg documentation, https://ffmpeg.org/ffmpeg.html, weight 0.87
- FFmpeg project site, https://ffmpeg.org/, weight 0.63
- alsa-ucm-conf ES8316 Rockchip UCM config, https://github.com/alsa-project/alsa-ucm-conf/blob/master/ucm2/Rockchip/es8316/es8316.conf, weight 0.79
- ES8316 kernel codec driver, https://github.com/Xilinx/linux-xlnx/blob/master/sound/soc/codecs/es8316.c, weight 0.71
- Stack Overflow raw PCM conversion example, https://stackoverflow.com/questions/11986279/can-ffmpeg-convert-audio-from-raw-pcm-to-wav, weight 0.11 (weak)
- GeeksforGeeks amixer reference, https://www.geeksforgeeks.org/linux-unix/amixer-command-in-linux-with-examples/, weight 0.27 (weak)
