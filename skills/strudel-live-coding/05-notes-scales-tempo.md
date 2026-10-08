# 05 - Notes, scales, tempo

Scope: writing pitched notes with MIDI numbers or letters, choosing pitched sounds, slowing melodic sequences, scale degrees with `.scale()`, and the `setcpm` tempo math.

## Two ways to write notes

`note("48 52 55 59")` uses MIDI numbers, decimals allowed. `note("c e g b")` uses letters a through g, with `#` or `b` for sharps and flats, and octave numbers like `c2 e3 g4 b5` (source doc). The source doc's teaching note: numbers are easier if the user is not fluent in letters. The tonal docs corroborate the number model: numbers become notes in the scale, zero indexed, and negative numbers can wrap backwards in the scale while sharps or flats produce notes outside it (https://strudel.cc/learn/tonal/, jev weight 0.88).

## Pitched sounds

`.sound("piano")` picks the sound for pitched notes. Multiple sounds alternate per event when separated by space (`.sound("piano gm_electric_guitar_muted")`) and stack simultaneously when separated by comma (`.sound("piano, gm_electric_guitar_muted")`) (source doc). Useful note sounds listed in the source doc: `piano`, `gm_acoustic_bass`, `gm_electric_guitar_muted`, `gm_voice_oohs`, `gm_blown_bottle`, `gm_xylophone`, `gm_accordion`, `gm_synth_bass_1`, `gm_synth_strings_1`, plus the oscillators `sawtooth`, `square`, `triangle` (source doc).

## Slowing melodic sequences

Melodic sequences slow down the same way rhythms do: `note("[36 34 41 39]/4")` plays the bracket over 4 cycles. Use `< >` for one note per cycle. Combine them for repetitive basslines: `note("<[36 48]*4 [34 46]*4 [41 53]*4 [39 51]*4>")` (source doc).

## Scales

`n("0 2 4 <[6,8] [7,9]>").scale("C:minor")` interprets `n` as a scale degree, so any number sounds good because it stays inside the scale (source doc). Scale examples from the source doc: `C:major`, `A2:minor`, `D:dorian`, `G:mixolydian`, `A2:minor:pentatonic`, `F:major:pentatonic`. Scales can themselves be patterned: `.scale("<C:major D:mixolydian>/4")` (source doc). The official tonal functions page is the underlying reference for scale quantization and degree interpretation (https://strudel.cc/learn/tonal/, jev weight 0.88).

A useful trick from the pattern-effects toolbox stays in-scale by construction: adding numbers to scale degrees keeps them in-scale, for example `n("0 [2 4] <3 5>".add("<0 [0,2,4]>")).scale("C5:minor")` (source doc, doc 08).

## Tempo: cycles per minute

Strudel's tempo control is `setcpm(bpm/4)`, cycles per minute. The default is 30 cpm, which is 120 bpm in 4/4, which is one 2 second cycle. The convention `setcpm(90/4)` means eighth notes at 90 bpm in 4/4 (source doc).

The official cycles page grounds the underlying unit: "In most music software, the unit BPM (beats per minute) is used to set the tempo. Strudel expresses tempo as CPS (cycles per second), with a default of 0.5 CPS" (https://strudel.cc/understand/cycles/, jev weight 0.93). The two framings are consistent: 0.5 CPS equals a 2 second cycle equals 30 cpm. The concepts page calls cycles central to understanding how Strudel works, noting that TidalCycles even carries the concept in its name (https://strudel.cc/understand/cycles/, jev weight 0.93).

Practical tempo math from the canonical tunes (source doc):

- `setcpm(100/4)` for the basic rock beat.
- `setcpm(81/2)` for We Will Rock You, where the bar halves the cycle so the half note is the unit.
- `setcpm(60/4)` makes each cycle a bar at 120 bpm, used in the idea-to-Mini-Notation example (source doc).

## Why numbers first, scales second

The teaching order in the source doc is: MIDI numbers for pitch because they always work, letters once the learner knows the keyboard, then scales so that any degree number sounds good. This removes two failure modes at once: wrong-pitch frustration and scale-degree counting errors (source doc).

## Debug checklist for notes and tempo

- Notes sound wrong: check octave numbers and whether `n` is being fed degrees that a `.scale()` interprets (source doc).
- Tempo changed unexpectedly after an edit: the sequence left its `< >` wrapper; bare sequences re-squish on every add or remove (source doc).
- Everything is too fast or too slow: compute the intended cpm from the target bpm with `setcpm(bpm/4)` for quarter-note-based bpm (source doc).

## Source-of-record statement

Every claim above traces to the source doc (yubi-OS/yubiOS skills/strudel-live-coding/SKILL.md) or to a cited dig result with its jev weight. Weak-backing sources are labeled; the felixroos.github.io mirror of the cycles page (jev weight 0.37) shows stale tempo text and is not cited for any number.
