# 07 - Mixer control and persistence with set_mixer.py and alsactl

Scope: forcing mixer state with set_mixer.py (un-mute the Left/Right Headphone Mixer DAC elements, set Headphone, Headphone Mixer and DAC to 100 percent, re-verify by re-reading) and persisting state across reboots with alsactl store.

## What set_mixer.py does

The source doc (yubi-OS/yubiOS skills/play-audio-on-rock1/SKILL.md) drives mixer changes with a configurable setter. You edit two sets near the top of scripts/set_mixer.py, MUTE_UNSET and VOL100, to match what you want to change, then run:

```bash
sudo -n python3 /tmp/audio/set_mixer.py
```

The script returns rc=0 for each successful change and re-verifies by re-reading the state after setting it (source doc). The default targets are:

1. Un-mute the Left Headphone Mixer DAC and Right Headphone Mixer DAC elements.
2. Set the Headphone, Headphone Mixer, and DAC controls to 100 percent.

This matters because of the ES8316 quirk documented in doc 08: the codec can auto-enable the I2S to DAC to headphone path on snd_pcm_open even when mixer controls report off, and set_mixer.py forces them on so the path stays alive across snd_pcm_close (source doc).

## Why force-on beats trusting aplay-style use

The source doc's anti-pattern list says: don't trust the "DAC at 0%" reading alone; the ES8316 driver ignores the muted state until you actually play. Run set_mixer.py to force-on before relying on aplay-style usage (source doc). In practice this means the setter runs once per box, not per playback; after one forced pass, the loop recipes in doc 05 play reliably.

## Persistence across reboots

ES8316 driver mixer state is in-memory and resets on reboot (source doc). The source doc's fix is one command:

```bash
sudo alsactl store -f /var/lib/alsa/asound.state
```

The alsactl man page documents the semantics: store saves the current driver state for the selected sound card to the configuration file, and restore loads it back, calling the init action if restoring fails even partially (weight 0.50, https://linux.die.net/man/1/alsactl). Reference material describes alsactl as offering save, restore, and init over soundcard driver states, for preserving custom sound configurations across reboots (weak backing, weight 0.13, https://www.geeksforgeeks.org/linux-unix/alsactl-command-in-linux-with-examples/).

Two caveats from community reports, both weak sources but consistent with the skill's design: on desktop systems something like PulseAudio can re-mute outputs after a successful restore at boot (weak backing, weight 0.07, https://askubuntu.com/questions/541847/is-there-any-way-to-save-alsamixer-settings-other-than-alsactl-store; weak backing, weight 0.10, https://askubuntu.com/questions/50067/how-to-save-alsamixer-settings). rock1 headless Ubuntu does not run a desktop audio manager, which is why the skill's own re-verify-by-reread pattern is the check that counts.

## The setter's ctypes surface

set_mixer.py uses the same Simple Mixer Interface as the inspector (doc 06). The reference documentation covers the write side: getting the range for playback volume, setting it, and the playback switch controls (weight 0.58, https://www.alsa-project.org/alsa-doc/alsa-lib/mixer_2simple_8c.html), with the implementation in alsa-lib src/mixer/simple.c (weight 0.43, https://github.com/alsa-project/alsa-lib/blob/master/src/mixer/simple.c). Volume ranges on ALSA elements are not fixed at 0 to 100; one report shows a range of 0 to 65536 on some elements (weak backing, weight 0.11, https://stackoverflow.com/questions/19489343/set-alsa-master-volume-in-db-from-c-code), which is why the setter expresses its targets as the VOL100 percent set and re-reads to confirm.
