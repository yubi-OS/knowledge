# 03. Sounds, Samples, and Drum Banks

Scope: The sound catalog: s() sounds, drum samples, sample banks, sample numbers, gain shaping.

## s() and the default sample map

The `s` function is the primary way to trigger sounds. By default, Strudel comes with a built-in sample map providing a solid base to play with, and the `s` function plays back default samples such as bd (kick), sd (snare), hh (hi-hat), and others to build a drum beat ([0.61] https://urswilke.github.io/strudel/learn/samples/). The docs describe samples as the most common way to make sound with Tidal and Strudel: a sample is a commonly short piece of audio used as a basis for sound generation, undergoing transformations ([0.68] https://strudel.cc/learn/samples/, quoted under its "Pattern Effects. Recap" navigation context).

## Selecting samples with n and the colon

By default, `s` plays the first sample of a bank, and other samples are selected with `n`, starting from 0 ([0.68] https://strudel.cc/learn/samples/). The colon operator does the same thing inside the mini-notation: `s("bd*4,hh:0 hh:1 hh:2 hh:3 hh:4 hh:5 hh:6 hh:7").bank("RolandTR909")` selects individual hats by number ([0.68] https://strudel.cc/learn/samples/).

A key failure mode is documented on the same page: out-of-range numbers do not error loudly, they wrap. In the documented example, 0-3 play the same sounds as 4-7, because `RolandTR909_hh` only has 4 sounds ([0.68] https://strudel.cc/learn/samples/). This is why a pattern can "sound wrong" rather than break: the sample number silently maps onto the existing bank.

## Drum machine banks and the naming convention

For drum sounds, Strudel uses the comprehensive tidal-drum-machines library with a machine-per-bank naming convention ([0.61] https://urswilke.github.io/strudel/learn/samples/). In the workshop's example, RolandTR909 is the name of the drum machine being used, described as a famous drum machine for house and techno beats ([0.81] https://strudel.cc/workshop/first-sounds/). The workshop explicitly drills the sound/sample-number combination: "Try different sound / sample number combinations" ([0.81] https://strudel.cc/workshop/first-sounds/). It also sets the boundary for the first chapter: stick to a small selection of sounds first, and load your own sounds later ([0.81] https://strudel.cc/workshop/first-sounds/).

## Loading your own samples

Custom sample maps are declared with a `samples` call mapping names to files plus a base URL, using sounds from a sample map such as the default one drawing from the Dirt-Samples repository ([0.57] https://patterns.slab.org/learn/samples/, weak backing at 0.57 for the mirror page, though the mechanism it documents matches the official samples page). When you load your own samples, you choose the names that you then refer to in patterns ([0.57] https://patterns.slab.org/learn/samples/).

Community sample-pack indexes exist beyond the default map: a public collection of known strudel.json sample packs invites new imports ([0.71] https://strudel-samples.alternet.site/), and a GitHub collection of samples for Strudel exists as a community resource ([0.54] https://github.com/Artynnn/samples).

## Synthesis alongside samples

Not everything is a sample. The sounds page shows waveform-based synthesis mixed with sample playback, for example combining different notes with different sounds at the same time via `freq("220 275 330 440 550").s("triangle sawtooth sine")` ([0.92] https://strudel.cc/learn/sounds/). The same page points readers onward to the Synths and Samples pages for both approaches, and notes that in these cases the note or frequency is no longer controlled directly by `s` ([0.92] https://strudel.cc/learn/sounds/).

## Gain and dynamics

The gain control is the standard dynamics tool in the effects chain (covered in depth in doc 05, [0.94] https://strudel.cc/learn/effects/). The workshop's diagnostic list includes flat dynamics as a gotcha: patterns that sequence events but never vary gain sound mechanical, which the first-effects chapter addresses with per-event gain shaping ([0.93] https://strudel.cc/workshop/first-effects/).

## Debugging the sound layer

Three silent-failure classes come straight out of this chapter's material: a misspelled sound name plays nothing, a sample number beyond the bank length wraps silently ([0.68] https://strudel.cc/learn/samples/), and a bank name that does not resolve falls back unexpectedly. The verification loop is the same as the REPL loop from doc 01: change, update, listen ([0.90] https://strudel.cc/).
