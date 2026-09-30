# 06 Audio Effects

This doc covers the audio effects taught in the Strudel workshop chapter "First Effects": lpf, vowel, gain, delay, room, pan, speed, fast and slow outside Mini-Notation, ADSR envelopes, and the central insight that every effect parameter can itself be patterned with Mini-Notation without changing the overall rhythm. Everything here comes from the workshop pages; engine-level claims carry dig citations.

## Effects run in an engine, not in the pattern

Strudel patterns describe music declaratively; the actual sound production is delegated to superdough, the Web Audio based synth, sampler, and fx engine behind Strudel [dig, jev=0.83]. The `@strudel/webaudio` package is a thin binding to superdough, which is why the same effect functions work whether you trigger samples or synths [dig, jev=0.84]. Inside superdough, effects are processed as a chain per event, with parameter controls and a nested FX array [dig, jev=0.51]. You never wire that chain by hand in the workshop: you call one function per effect and let the engine route it.

## The basic palette

**lpf** (low pass filter) shapes brightness. A low value like 200 muffles the sound, which the workshop compares to standing in front of the club with the door closed; raising it to 5000 opens the door and the sound gets brighter [primary]. The canonical example is a sawtooth bassline filtered with `.lpf(800)` [primary].

**vowel** applies a formant-style filter that makes a synth sound like it is singing a vowel. The example cycles `<a e i o>` per cycle [primary].

**gain** controls per-event loudness, and the workshop frames rhythm itself as dynamics: the example `.gain("[.25 1]*4")` on a 16-step hi-hat line makes alternating steps quiet and loud, and removing the gain makes the line sound flat [primary].

**delay** takes values between 0 and 1, and `.5` is just short for `0.5` [primary]. The extended form is `delay("a:b:c")` where a is the delay volume, b is the delay time, and c is the feedback, with a smaller feedback number meaning the echoes fade quicker [primary]. So `.delay(".8:.125")` raises the echo volume and shortens the delay time, and `.delay(".8:.06:.8")` adds slow-fading feedback [primary].

**room** is reverb. The workshop accordion example uses `.room(2)`, and higher or lower values change how much space the sound sits in [primary]. Delay and room combine freely, which is what makes the little dub tune in the chapter work: a stacked `$:` pattern set layering electric guitar with delay, drums with delay, accordion with room plus gain, and a filtered sawtooth bass [primary].

**pan** places each event at a position in the stereo field; the workshop example sweeps four spoken numbers across `0 0.3 .6 1` so each one lands further to one side than the last [primary].

**speed** multiplies the playback speed of a sample, and the example pattern `.speed("<1 2 -1 -2>")` shows the key trick: a negative speed value plays the sample in reverse [primary].

## ADSR envelopes

Any sound can be shaped with an ADSR envelope, set with four chained functions: `.attack(.1)`, `.decay(.1)`, `.sustain(.25)`, `.release(.2)` [primary]. The workshop's definitions:

- attack: the time it takes to fade in
- decay: the time it takes to fade to sustain
- sustain: the level held after decay
- release: the time it takes to fade out after the note is finished

The suggested experiments are what make the semantics click: attack of `.5` versus `0`, decay of `.5` versus `0`, sustain of `1` versus `.25` versus `0`, release of `0` versus `.5` versus `1` [primary]. All four numbers collapse into one short notation: `.adsr(".1:.1:.5:.2")` is equivalent to the four chained calls above [primary].

## Fast and slow outside Mini-Notation

`fast` and `slow` change the tempo of a whole pattern from the outside of the notation string: `sound("bd*4,~ rim ~ cp").slow(2)` halves the playback rate, and a patterned argument like `.fast("<1 [2 4]>")` makes the tempo itself alternate between cycles [primary]. Inside Mini-Notation the same operations exist as operators: `fast` is `*` and `slow` is `/`, so `[bd*4,~ rim ~ cp]*<1 [2 4]>` patterns the speed from within the string [primary]. The workshop recap table lists `fast` as "speed up" and `slow` as "slow down" alongside the other pattern effects [primary].

## The key insight: pattern the parameters

Every effect parameter accepts a Mini-Notation string in place of a plain number, and doing so does not change the overall rhythm. The workshop's filter example states this directly: `.lpf("200 1000 200 1000")` sweeps the cutoff per step while the note pattern keeps its original rhythm, and you are invited to add more values to hear the same [primary]. The recap page encodes this as a convention: its lpf, vowel, gain, delay, room, pan, and speed examples all pass patterned strings or alternation brackets as arguments, like `.lpf("400 2000")` and `.speed("<1 2 -1 -2>")` [primary]. Because an effect parameter is just another pattern, it also accepts signals instead of stepwise values: `sine`, `saw`, `square`, `tri` oscillate between 0 and 1 by default, `rand` and `perlin` add randomness, `range(500, 2000)` remaps the output (flipping the endpoints inverts the sweep), and `.slow(4)` on a signal stretches one full modulation over 8 cycles [primary].

## Sources considered

| url | weight |
| --- | ------ |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/first-effects.mdx | primary |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/recap.mdx | primary |
| https://strudel.cc/blog/ | dig, jev=0.83 |
| https://www.npmjs.com/package/@strudel/webaudio | dig, jev=0.84 |
| https://www.npmjs.com/package/superdough | dig, jev=0.52 |
| https://dough.strudel.cc/ | dig, jev=0.51 |
| https://deepwiki.com/blakkd/strudel/4.3-effects-and-processing | dig, jev=0.51 |
