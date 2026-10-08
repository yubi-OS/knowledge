# 08 - Quirks, pitfalls, and anti-patterns

Scope: the ES8316 quirks and pitfalls: DAC at 0 percent but audio plays, in-memory mixer state, mono-rejected device and mono-to-stereo expansion, sudo versus audio-group membership, snd_mixer_selem_get_name return semantics, the idx=0 cosmetic quirk, printf percent-s versus percent-b, and the anti-pattern list.

All quirks below are from the source doc (yubi-OS/yubiOS skills/play-audio-on-rock1/SKILL.md) unless a dig source is cited.

## Device and format quirks

1. Mono is rejected. hw:1,0 refuses mono input; the player expands each mono sample to L=R stereo on the fly. Generate stereo PCM directly if you have stereo input, passing --in-channels 2 (source doc).
2. Transfer size limits. Bridge POST bodies are fine up to about 240KB of JSON; for clips longer than about 8 seconds, chunk into about 60KB base64 chunks, first chunk tee, later chunks tee -a (source doc; detailed in doc 04).

## Permissions quirks

3. sudo versus the audio group. shant is not in the audio group on rock1 by default. Either run sudo usermod -aG audio shant and restart the bridge to pick up the new group, or use sudo -n, since root bypasses the group check via CAP_DAC_OVERRIDE (source doc). Community threads confirm the audio-group permission pattern is the usual gate for ALSA device access, though they discuss it on desktops rather than SBCs (weak backing, weight 0.08, https://stackoverflow.com/questions/3570132/aplay-alsaplayer-sound-not-working-for-normal-user; weak backing, weight 0.06, https://bbs.archlinux.org/viewtopic.php?id=250969, which notes a normal user often does not need the audio group at all when a desktop audio server owns the device).

## Mixer state quirks

4. Mixer state is in-memory. The ES8316 driver resets on reboot; persist with sudo alsactl store -f /var/lib/alsa/asound.state (source doc; detailed in doc 07).
5. The "DAC at 0% but audio plays" quirk. The ES8316 driver auto-enables the I2S to DAC to headphone path on snd_pcm_open, ignoring muted-mixer state until something else changes it. Playback works even when mixer controls report off. set_mixer.py forces the controls on so the path stays alive across snd_pcm_close (source doc). Practical rule: never conclude the audio path is dead from a mixer reading alone, and never conclude it is healthy either.
6. idx=0 across all mixer elements. Every element reports index 0 in snd_mixer_selem_get_index, a cosmetic quirk of the ES8316 selem layout. Names and values are correct; ignore the index (source doc).

## ctypes pitfalls

7. snd_mixer_selem_get_name returns const char* directly: one argument, no out-buffer, no return code. Setting argtypes to c_void_p and c_char_p and treating the return as an int is a common bug. inspect.py uses the correct signature (source doc). The official ALSA reference confirms the simple-element API exposes element names and lookup via snd_mixer_find_selem (weight 0.71, https://www.alsa-project.org/alsa-doc/alsa-lib/group___simple_mixer.html) and its simple.c source carries the same signatures (weight 0.43, https://github.com/alsa-project/alsa-lib/blob/master/src/mixer/simple.c). General ALSA-open failure modes, like "unable to open slave" from wrong PCM definitions, are documented in alsa-lib issue reports (weak backing, weight 0.38, https://github.com/alsa-project/alsa-lib/issues/426).

## Shell pitfalls

8. printf format strings. Don't tee player stdout with %s; use printf '...\n' (or printf '%b' if you need the backslash-n interpreted). %s prints a literal backslash-n to the UART (source doc). This bit the loop recipe in doc 05, which is why the banners use explicit \n in the format string.

## The anti-pattern list

The source doc closes with four rules, repeated here because each maps to a costlier failure:

1. Don't apt install alsa-utils unless you need it persistently; the ctypes path works without it and saves 30 seconds or more per round trip (doc 01).
2. Don't send the full PCM as one argv; chunk into base64 of about 60KB or less (doc 04).
3. Don't trust the "DAC at 0%" reading alone; run set_mixer.py to force-on before relying on aplay-style usage (doc 07).
4. Don't tee player stdout with %s (this doc).
