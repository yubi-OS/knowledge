# 01 - Why ctypes to ALSA instead of installed tools

Scope: why this skill avoids apt-installed audio CLI tools and drives libasound.so.2 directly from a pure-stdlib Python script, plus the end-to-end pipeline shape from ElevenLabs generation to the 3.5mm analog output.

## The no-install constraint

rock1 (a Pine64 RockPro64 running Ubuntu 26.04 aarch64, kernel 7.0.0-28-generic) has working audio hardware but ships without audio CLI tools: no aplay, no ffmpeg, no amixer (source doc: yubi-OS/yubiOS skills/play-audio-on-rock1/SKILL.md). Installing alsa-utils works for a permanent box but is slow for an experiment loop; the source doc puts the saving at 30 seconds or more per install round-trip when you skip it. The skill therefore ships a pure-stdlib path that runs as `python3 /tmp/audio/play.py /tmp/audio/clip.pcm` with zero install: a ctypes binding to libasound.so.2, which is present on Ubuntu by default (source doc). This is the same pattern the ascii-uart-animator skill uses for the UART side (source doc).

## What the standard library cannot do

Python's standard library has no audio playback API; Stack Overflow answers on this point are consistent that you need a wrapper or direct native binding (weak backing, weight 0.09, https://stackoverflow.com/questions/260738/play-audio-with-python). The common Python routes are wrappers:

- pyalsaaudio wraps the ALSA API for Python, fairly complete for PCM devices with some mixer support (weight 0.33, https://github.com/larsimmisch/pyalsaaudio/).
- python-sounddevice binds PortAudio and plays NumPy arrays, on Linux, macOS and Windows (weight 0.39, https://python-sounddevice.readthedocs.io/).
- Higher-level blog paths load and convert audio files to PCM samples and stream them in chunks (weight 0.17, https://picovoice.ai/blog/how-to-play-audio-in-python/).

All of these require a pip install on the target box. The ctypes route skips them: play.py calls the ALSA C library (libasound.so.2) directly, which the official ALSA C library reference documents as the Simple PCM and mixer interfaces (weight 0.71, https://www.alsa-project.org/alsa-doc/alsa-lib/group___simple_mixer.html). Direct libasound usage from small programs is an established pattern; a public gist demonstrates playback using the ALSA API and libasound with snd_pcm_open and the hw_params calls (weak backing, weight 0.16, https://gist.github.com/ghedo/963382/815c98d1ba0eda1b486eb9d80d9a91a81d995283).

## The pipeline shape

The shell bridge normally ferries argv for CLI debug; this skill ferries raw PCM audio bytes end to end (source doc). The full chain is:

1. ElevenLabs sound-generation produces a raw PCM clip on the Sauna side.
2. The Sauna sandbox base64-encodes the clip and transfers it chunked over the rock1 shell bridge.
3. rock1 decodes the chunks into /tmp/audio/clip.pcm.
4. play.py opens ALSA via ctypes and writes frames to hw:1,0.
5. The ES8316 codec drives the Analog (3.5mm) output.

The choice of raw PCM matters: it means no MP3 decode is needed on either side of the bridge (source doc).

## Anti-pattern embedded in the rationale

Don't apt install alsa-utils unless you need it persistently; the ctypes path works without it (source doc). The one exception the source doc allows is a permanent box where alsa-utils would be installed anyway.

## Drift note

The source doc's attestation coverage section was corrected on 2026-09-17: the yubiOS primitive-coverage template paragraph formerly there asserted capabilities the skill does not itself implement and was removed as unsupported (source doc). Read the skill for audio playback, not for attestation guarantees.
