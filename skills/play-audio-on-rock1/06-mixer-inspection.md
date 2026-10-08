# 06 - Mixer inspection with inspect.py

Scope: inspecting ALSA devices and mixer state with inspect.py: card enumeration from /sys/class/sound, PCM streams from /proc/asound/pcm, and a ctypes loop over mixer controls reading playback volume, mute, and capture.

## What inspect.py reports

The source doc (yubi-OS/yubiOS skills/play-audio-on-rock1/SKILL.md) runs inspection with one command on rock1:

```bash
sudo -n python3 /tmp/audio/inspect.py
```

It lists:

1. Cards, enumerated from /sys/class/sound. The source doc notes this source always works, unlike tools that depend on an installed alsa-utils.
2. PCM streams, from /proc/asound/pcm.
3. Every mixer control with current values: name, playback volume per channel as a percent, playback mute state, and capture volume.

The mixer-state portion uses a defensive ctypes loop over libasound.so.2, so the inspector itself needs no install and no dependency beyond the ALSA library that Ubuntu already ships (source doc).

## The underlying kernel surfaces

Both enumeration sources are kernel interfaces with documented semantics:

- /proc/asound/pcm is the list of allocated PCM streams. The ALSA community wiki notes it is the list of devices, and probably does not mean the list of active streams (weight 0.57, https://alsa.opensrc.org/Proc_asound_documentation/). The kernel documentation describes the ALSA proc tree at /proc/asound and the per-stream PCM information files in it (weak backing, weight 0.43, https://www.kernel.org/doc/html/v4.17/sound/designs/procfile.html).
- /sys/class/sound is the sysfs class the kernel creates per sound device; the kernel documentation describes the proc filesystem as the interface to internal kernel data structures, of which sysfs is the device-facing counterpart (weak backing, weight 0.16, https://www.kernel.org/doc/html/latest/filesystems/proc.html).

## The mixer API the inspector walks

The ctypes loop drives the ALSA Simple Mixer Interface. The official ALSA C library reference documents the whole family: getting info about the active state of a mixer simple element, the channels of its playback stream, the capture switch controls, and the playback volume range and dB range accessors (weight 0.70, https://www.alsa-project.org/alsa-doc/alsa-lib/group___simple_mixer.html). Third-party API mirrors document the same surface, including snd_mixer_selem_ask_playback_vol_dB and the channel-separation semantics of a control (weak backing, weight 0.19, https://vovkos.github.io/doxyrest/samples/alsa/group_SimpleMixer.html). The implementation itself lives in alsa-lib's src/mixer/simple.c (weight 0.43, https://github.com/alsa-project/alsa-lib/blob/master/src/mixer/simple.c), and a high-level overview of the mixer API describes it as the interface for volume levels, mute switches, input and output routing, and enumerated options (weak backing, weight 0.22, https://deepwiki.com/alsa-project/alsa-lib/5.2-mixer-api).

On rock1 that surface walks the 35 ES8316 mixer elements of card 1 (source doc; see doc 02). Every element reports index 0 in snd_mixer_selem_get_index, a cosmetic quirk of the ES8316 selem layout: names and values are correct, ignore the index (source doc; discussed further in doc 08).

## Why inspection is a first-class tool here

The playback path depends on mixer state you cannot trust from reading alone: the "DAC at 0% but audio plays" quirk means the mixer reading and the actual audio path can disagree (doc 08). Inspect first, then run set_mixer.py with the targets from doc 07, then inspect again to confirm the re-read.
