# 06 - Audio effects

Scope: the audio effect toolbox: low-pass filter, vowel, gain, delay, room, pan, speed, the ADSR envelope, and tempo operators outside Mini-Notation, plus the rule that patterning an effect does not change the rhythm.

## The core effects

The source doc lists the effects the workshop ladder teaches (source doc):

- `.lpf(800)`, low-pass filter. 200 sounds muffled, 5000 sounds bright. Pattern it: `.lpf("200 1000 200 1000")`. Patterning an effect does NOT change the overall rhythm.
- `.vowel("<a e i o>")`, a formant filter that makes sounds talk.
- `.gain("[.25 1]*4")`, dynamics. The source doc's stance: rhythm is all about gain dynamics.
- `.delay(.5)`, echo. The extended form `delay("a:b:c")` means a: delay volume, b: delay time, c: feedback, where smaller feedback fades quicker. Examples: `.delay(".8:.125")`, `.delay(".8:.06:.8")`.
- `.room(2)`, reverb.
- `.pan("0 0.3 .6 1")`, stereo position, 0 left to 1 right.
- `.speed("<1 2 -1 -2>")`, playback speed, where negative values play reversed.

All of the above is from the source doc (yubi-OS/yubiOS skills/strudel-live-coding/SKILL.md).

## The effects chain in the engine

The official effects page enumerates what the chain contains, which explains why these parameter names are stable: gain, a lowpass filter (lpf), a highpass filter (hpf), a bandpass filter (bandpass), a vowel filter (vowel), sample rate reduction (coarse), bit crushing (crush), waveshape distortion (shape), normal distortion (distort), tremolo, compressor, panning (pan), and phaser among others (https://strudel.cc/learn/effects/, jev weight 0.92). The chain is ordered: gain is applied, then the main volume ADSR, then the filters (https://strudel.cc/learn/effects/, jev weight 0.92). The technical-manual sounds page adds the wiring view: a sound's triggered node connects to "the rest of the standard effects chain" (https://strudel.cc/technical-manual/sounds/, jev weight 0.90).

## ADSR envelope

Two equivalent spellings exist (source doc):

- Long form: `.attack(.1).decay(.1).sustain(.25).release(.2)`
- Short form: `.adsr(".1:.1:.5:.2")`

The meanings: attack is fade-in time, decay is time to reach sustain, sustain is the level after decay, release is fade-out after the note ends (source doc).

## Tempo outside Mini-Notation

`.slow(2)` and `.fast(2)` change a pattern's speed from outside Mini-Notation, and they are themselves patternable: `.fast("<1 [2 4]>")` alternates the speed (source doc). Multiple simultaneous tempos exist as a pattern effect too, covered in doc 08.

## Control parameters and value modifiers

The official value-modifiers reference documents the general mechanism the source doc relies on: parameters like note, cutoff, gain, and s can each be controlled independently by either patterns or plain values (numbers or text), and `.log()` lets you observe the time and parameter values of each event (hap) in the output (https://strudel.cc/functions/value-modifiers/, jev weight 0.93). This is the mechanism behind "every effect parameter accepts Mini-Notation patterns and signals", the source doc's checklist line (source doc).

## Third-party teaching material, labeled weak

A community tutorial site covers effects in its chapter 4 but scored 0.30 on noul weighting (https://larkob.github.io/strudel/tutorial/, weak backing); it is consistent with the official material but is not cited for any specific claim here. Community course notes scored 0.13 and 0.15 (https://github.com/RafxDev/Strudel-Course/tree/main/module4_effects_and_modulation, https://github.com/nikolasgioannou/strudel-tutorial/blob/main/notes/03-mini-notation.md, both weak backing).

## Debug checklist for effects

- Pattern sounds flat: add gain dynamics, `.gain("[.25 1]*4")` on hats, `.adsr(...)` on pads (source doc, doc 10).
- Effect values change but rhythm also changed: an effect parameter was patterned with operators that also affect time; pattern the effect value instead and keep time operators on the sound layer (source doc).
- Delay never fades: lower the feedback component in the `a:b:c` form (source doc).

## Source-of-record statement

Every claim above traces to the source doc (yubi-OS/yubiOS skills/strudel-live-coding/SKILL.md) or to a cited dig result with its jev weight. Weak-backing sources (below 0.5) are labeled and carry no load-bearing claim.
