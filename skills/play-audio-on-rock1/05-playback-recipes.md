# 05 - Playback recipes: one-shot and loop with UART banners

Scope: the one-shot and loop-N playback recipes: sudo -n python3 play.py, PIPESTATUS for per-iteration return codes, and /dev/ttyS2 banner tee for live observability.

This is an internal-record subtopic, no dig: every recipe here comes verbatim from the source doc (yubi-OS/yubiOS skills/play-audio-on-rock1/SKILL.md), and the external mechanisms they touch (ALSA open and close, the serial console) are covered by docs 01, 02 and 06.

## One-shot playback

After the clip and player are on rock1 (doc 04), playback is one command:

```bash
sudo -n python3 /tmp/audio/play.py /tmp/audio/clip.pcm --device hw:1,0
```

That is the whole quick start. The player expands mono to stereo inline, opens ALSA, writes frames, drains, closes (source doc). The --device flag targets hw:1,0, the Analog card from doc 02. The sudo -n prefix is the non-interactive sudo form and exists because of the audio-group situation described in doc 08: shant is not in the audio group on rock1, and root bypasses the group check via CAP_DAC_OVERRIDE (source doc).

## Loop N times with /dev/ttyS2 banners

For longer runs the skill wraps playback in a loop that tees banners and output to the UART console so progress is visible on a connected serial session:

```bash
for i in 1 2 3 4 5 6 7; do
  printf '=== [%s] play %d/7 START ===\n' "$(date -u +%H:%M:%S)" "$i" | tee -a /dev/ttyS2
  sudo -n python3 /tmp/audio/play.py /tmp/audio/clip.pcm --device hw:1,0 |& tee -a /dev/ttyS2
  rc=${PIPESTATUS[0]}
  printf '=== [%s] play %d/7 END rc=%d ===\n' "$(date -u +%H:%M:%S)" "$i" "$rc" | tee -a /dev/ttyS2
done
```

Four details carry the recipe (source doc):

1. The START banner goes to /dev/ttyS2 with tee -a before each iteration, timestamped with date -u.
2. Player stdout and stderr both tee to /dev/ttyS2 (the |& form), so any ALSA error lands on the UART the moment it happens.
3. rc is captured from PIPESTATUS[0], the player's own exit code, not the tee that follows it in the pipeline. Capturing $? instead would report tee's status and mask playback failures.
4. The END banner prints the captured rc, so a serial read of /dev/ttyS2 gives a complete per-iteration success record without any other tooling.

## Observability contract

The banner tee is what makes a remote playback loop verifiable: the UART log records start time, player output, and return code per iteration. The same /dev/ttyS2 channel is used by the ascii-uart-animator skill for visual frames; here it carries only text banners and player output (source doc).

## Related anti-pattern

The corresponding quirk is in doc 08: don't tee player stdout with %s; use printf '...\n' so newlines reach the UART as real newlines instead of literal backslash-n sequences (source doc).
