# 05. Audio Effects and Signals

Scope: Audio effects (lpf, vowel, gain, adsr, delay, room, pan, speed) and continuous signals for smooth modulation.

## The effects layer

Strudel has a set of built-in audio effects that apply whether the source is a synth or a sample ([0.94] https://strudel.cc/learn/effects/). Effects can be chained together, and they accept a pattern string as their argument, meaning effect parameters are patterns too and can vary over time ([0.94] https://strudel.cc/learn/effects/).

The effects page also documents the signal chain: a sound-generating event is triggered by a pattern, and the effect processing follows that trigger through the chain ([0.94] https://strudel.cc/learn/effects/). Knowing the chain order matters when stacking a filter, a reverb, and a gain change: the result depends on where each effect sits.

## The workshop's basic set

The first-effects chapter covers the basic effect set in sequence: low-pass filter first, then the rest of the core set ([0.93] https://strudel.cc/workshop/first-effects/). A third-party course module lists the same family in plain terms: basic mix controls like volume (gain) and panning (pan), spacious effects like reverb (room) and echo (delay), and resonant low-pass filters (cutoff) for the classic acid house feel ([0.66] https://github.com/RafxDev/Strudel-Course/tree/main/module4_effects_and_modulation). The chapter's framing matches: sounds and notes are half the picture, sculpting the sound is the other half ([0.66] https://github.com/RafxDev/Strudel-Course/tree/main/module4_effects_and_modulation).

Two documented behaviors matter for daily authoring. First, vowel filters the timbre without changing pitch, which is how spoken-vowel coloration is applied to drums ([0.93] https://strudel.cc/workshop/first-effects/). Second, gain is the dynamics tool: patterns that sequence events but never vary gain sound flat, and per-event gain shaping inside a pattern string is the fix ([0.93] https://strudel.cc/workshop/first-effects/). The adsr family shapes amplitude envelopes over the event lifetime ([0.93] https://strudel.cc/workshop/first-effects/).

## Continuous signals

Signals are patterns with continuous values, meaning they have theoretically infinite steps; they provide streams of numbers that can be sampled at discrete points in time ([0.93] https://strudel.cc/learn/signals/). The canonical example is `saw`, a sawtooth signal between 0 and 1 ([0.93] https://strudel.cc/learn/signals/).

This is the mechanism that turns static effect parameters into moving ones: a signal fed into an effect parameter modulates it smoothly rather than in steps, which is how filter sweeps and slow pans are written ([0.93] https://strudel.cc/learn/signals/). Signals, sine and saw among them, are the smooth-modulation counterpart to the discrete mini-notation of doc 02 ([0.93] https://strudel.cc/learn/signals/).

## Chaining and composition

Because effects accept pattern strings and chain freely, the composition model is: one chain per sound, parameters patterned, signals available for any parameter ([0.94] https://strudel.cc/learn/effects/). The pattern-transformations chapter (doc 06) is the sibling layer: it transforms the event pattern itself, while effects transform the sound of each event ([0.88] https://felixroos.github.io/strudel/workshop/pattern-effects/).

## Failure modes in the effects layer

The documentation points at two traps. Chaining order matters because of the fixed signal chain ([0.94] https://strudel.cc/learn/effects/). And a parameter pattern that never moves (a constant passed where a signal or varying pattern was intended) produces the flat-sounding result the workshop flags as a diagnostic gotcha ([0.93] https://strudel.cc/workshop/first-effects/). Verification is aural: sweep the parameter, listen for the sweep.

## Where the deep documentation lives

The effects reference lives at the learn/effects page ([0.94] https://strudel.cc/learn/effects/) and the signals reference at learn/signals ([0.93] https://strudel.cc/learn/signals/). Third-party deep-wiki scrapes of time-based effects and signals exist but scored weak in this dig ([0.29] https://deepwiki.com/blakkd/strudel_documentation/6.6-time-based-effects, [0.32] https://deepwiki.com/blakkd/strudel_documentation/7.6-signals-and-continuous-values); prefer the official pages.
