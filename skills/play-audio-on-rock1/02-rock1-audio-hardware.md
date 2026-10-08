# 02 - The audio hardware on rock1

Scope: the audio hardware map on the Pine64 RockPro64: HDMI I2S card (hw:0,0, hdmisound, no mixer) versus the ES8316 codec Analog card (hw:1,0, 35 mixer elements), and why hw:1,0 is the typical target.

## Two ALSA cards, two very different outputs

The source doc (yubi-OS/yubiOS skills/play-audio-on-rock1/SKILL.md) maps rock1's ALSA cards:

| Card | id | PCM | Mixer |
|---|---|---|---|
| 0 | hdmisound | hw:0,0 | none (HDMI digital passthrough) |
| 1 | Analog | hw:1,0 | ES8316 codec, 35 mixer elements |

The typical target is hw:1,0, the Analog card wired to the 3.5mm jack (source doc). The HDMI card carries digital passthrough and exposes no mixer controls, so there is nothing to inspect or tune there.

## The ES8316 codec

The Analog card is driven by an ES8316 codec. PINE64's official board layout documentation places the ES8316 sound codec on the rear of the board, next to the RK808 power management chip, with the RK3399 system-on-chip as the main chip (weight 0.23, https://pine64.org/documentation/ROCKPro64/Board/Layout/). The codec is supported by a mainline kernel driver, sound/soc/codecs/es8316.c, which documents the codec's clocking behavior: in slave mode at single speed it accepts several MCLK/LRCK ratios, including ratio 400 which is commonly used (weight 0.23, https://github.com/analogdevicesinc/linux/blob/master/sound/soc/codecs/es8316.c).

The source doc's compatibility frontmatter pins the tested environment: rock1, Pine64 RockPro64, Ubuntu 26.04 aarch64, kernel 7.0.0-28-generic, ES8316 codec on card 1 (source doc).

## Community confirmation of the hardware layout

Independent community reports line up with this map. A long-running personal write-up of the ROCKPro64 confirms that the hdmisound device exists as an ALSA device selector, alsa/hw:hdmisound, and reports HDMI audio working but with a level adjustment that causes clipping (weak backing, weight 0.14, https://galexander.org/rockpro64.html). Forum threads about getting sound out of the 3.5mm jack via ES8316 on the RockPro64 exist but are weak sources for specifics (weak backing, weight 0.06, https://forum.pine64.org/showthread.php?pid=42789; weak backing, weight 0.05, https://dietpi.com/forum/t/rockpro64-audio-jack-anyone-got-this-to-work/20925). The skill's own mixer tooling is the authoritative record for what the 35 mixer elements are.

## The stereo constraint

The Analog device only accepts stereo: mono input must be expanded to L=R inline, and the player does this automatically (source doc). If you already hold stereo PCM you can pass --in-channels 2 instead (source doc). This constraint is the reason the player script carries a mono-to-stereo expansion step rather than feeding frames straight to snd_pcm_writei.

## Why this matters for the rest of the skill

Everything downstream keys off this map: playback targets hw:1,0 (doc 05), the mixer inspector walks the 35 ES8316 elements (doc 06), and set_mixer.py forces on the Headphone, Headphone Mixer and DAC controls of that codec (doc 07). Pick the wrong card and you send PCM into an HDMI passthrough with no volume path at all.
