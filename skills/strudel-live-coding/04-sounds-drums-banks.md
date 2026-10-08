# 04 - Sounds, drums, banks

Scope: named unpitched samples, drum letter codes, drum machine banks, the `s()` alias, and how sample playback actually resolves.

## Named samples

`sound("casio")` plays a named sample. The standard unpitched sounds the workshop teaches include: `insect wind jazz metal east crow casio space numbers` (source doc). The official samples page grounds the concept: "Samples are the most common way to make sound with tidal and strudel. A sample is a (commonly short) piece of audio that is used as a basis for sound generation, undergoing various transformations" (https://strudel.cc/learn/samples/, jev weight 0.86).

## Drum letters

Drum sounds have single-purpose two letter codes (source doc):

- `bd` bass drum
- `sd` snare drum
- `rim` rimshot
- `hh` hihat
- `oh` open hihat
- `lt`, `mt`, `ht` low, mid, high tom
- `rd` ride
- `cr` crash

All of the above is from the source doc (yubi-OS/yubiOS skills/strudel-live-coding/SKILL.md). Sample numbers select variants of one sound: `hh:0 hh:1 hh:2 hh:3` cycles four hihat samples, and a bare name means `:0` (source doc, doc 03).

## Drum machine banks

`.bank("Name")` swaps the drum machine behind the drum letters. The names the source doc lists: `RolandTR909`, `RolandTR808`, `RolandTR707`, `RolandTR505`, `AkaiLinn`, `RhythmAce`, `ViscoSpaceDrum`, `RolandCompurhythm1000`, `CasioRZ1` (source doc). Every canonical tune in the source doc uses this one-liner to restyle a beat: the classic house line is `sound("bd*4, [- cp]*2, [- hh]*4").bank("RolandTR909")`, the rock beat banks `RolandTR505`, We Will Rock You banks `RolandTR707`, and the YMO Firecracker banks `RolandCompurhythm1000` (source doc, doc 10). Bank choice is an aesthetic decision layered on top of an unchanged rhythm string, which is why it is taught late and used everywhere.

## The `s()` alias

`s(...)` is an alias for `sound(...)`; both spellings appear in workshop examples (source doc). When reading third-party Strudel code, treat `s` and `sound` as interchangeable.

## On-demand loading

Samples are fetched on demand, so a sound may load with a small pause the first time it is evaluated (source doc, doc 02). This is a property of the browser runtime, not a bug: the first evaluation downloads the sample, later evaluations play immediately.

## How playback resolves

For readers who want the mechanism: when the webaudio output plays a Hap, it looks up and calls the onTrigger function for the given sound, and the returned node connects into the standard effects chain (https://strudel.cc/technical-manual/sounds/, jev weight 0.90). Registering a custom sound makes it appear in the REPL's sounds tab after evaluation (https://strudel.cc/technical-manual/sounds/, jev weight 0.90). This level of detail is optional; the practical workflow never needs it.

## Verification habit

If a sound is silent, try a different sample number (`name:1`) or check that the name exists: drum letters are `bd sd rim hh oh lt mt ht rd cr`, unpitched sounds are `insect wind jazz metal east crow casio space numbers` (source doc). This is one of the source doc's explicit debug steps (doc 10 carries the full checklist).

## Community context, labeled weak

Third-party teaching material about drums and banks exists but scored low on the noul weighting: a personal tutorial notes file (https://github.com/nikolasgioannou/strudel-tutorial/blob/main/notes/04-sounds-and-samples.md, jev weight 0.16), a community docs mirror (https://deepwiki.com/calvinw/strudel-llm-docs/7.3-drum-machines, jev weight 0.10), and an unofficial sample listing (https://glfmn.io/presentations/algorave-2/, jev weight 0.12). The official samples page (https://strudel.cc/learn/samples/, jev weight 0.86) is the only bank-level source this corpus cites with strong backing; bank names themselves come from the source doc.

## Source-of-record statement

Every claim above traces to the source doc (yubi-OS/yubiOS skills/strudel-live-coding/SKILL.md) or to a cited dig result with its jev weight. Weak-backing sources (below 0.5) are labeled and carry no load-bearing claim.
