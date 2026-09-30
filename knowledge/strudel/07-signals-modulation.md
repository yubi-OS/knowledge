# 07: Signals and Continuous Modulation

This doc covers continuous modulation in Strudel: the basic signal waveforms, replacing numeric parameters with signals, the default 0..1 range and rescaling with `.range()`, changing modulation speed with `.slow()`, and discretizing a signal with `.segment()`. Scope is limited to what the two primary workshop sources and the weighted dig pool document; nothing beyond those sources is claimed.

## Replacing numbers with signals

Instead of changing values stepwise, any numeric parameter can be controlled with a signal. The canonical example drives gain with a sine wave:

```js
sound("hh*16").gain(sine)
```

In the pianoroll, the gain is visualized as transparency. [primary]

The basic waveforms for signals are `sine`, `saw`, `square`, and `tri`. Alongside these there are random signals: `rand` and `perlin`, the latter a kind of smoothed out randomness. [primary] The signals reference confirms each is a continuous pattern of values between 0 and 1. [dig, jev=0.76]

Signals are patterns with continuous values, meaning they have theoretically infinite steps. [dig, jev=0.74] That is the structural difference from the stepwise patterns used elsewhere: a pattern like `.lpf("200 1000 200 1000")` changes the filter only at event boundaries, while a signal glides continuously and does not change the overall rhythm of the pattern it is applied to. [primary]

## The default range and rescaling

By default, waves oscillate between 0 and 1. The `range` method rescales a signal to any interval:

```js
sound("hh*16").lpf(saw.range(500, 2000))
```

The effect on the sound is the usual low pass filter sweep: low values muffle, high values brighten. [primary]

Flipping the two range values inverts the direction of the motion. If `saw.range(500, 2000)` sweeps upward through the cycle, `saw.range(2000, 500)` sweeps downward over the same interval. [primary]

This compose-then-scale pattern shows up across the effects docs: a filter sweep written as `.lpf(sine.range(300, 2000).slow(16))` is the same idiom applied to `lpf` with a slower modulation. [dig, jev=0.83]

## Changing modulation speed

Signals inherit the time modifiers. Chaining `.slow(N)` stretches the modulation across more cycles:

```js
note("<[c2 c3]*4 [bb1 bb2]*4 [f2 f3]*4 [eb2 eb3]*4>")
  .sound("sawtooth")
  .lpf(sine.range(100, 2000).slow(4))
```

With `.slow(4)`, the whole modulation takes 8 cycles to repeat. [primary] The inverse works too: `fast` shortens the modulation period the same way it shortens any pattern. [primary] A separate LFO layer also exists (`lfo` with `r` and `shape` options, default shape triangle), but the signal composition shown here is the general mechanism. [dig, jev=0.84]

## Discretizing with segment

A continuous signal streams infinitely many values per cycle, which some targets cannot absorb. `.segment(N)` samples the signal at N steps per cycle, turning the continuous pattern into a discrete one. [dig, jev=0.74]

The motors workshop shows why this matters. Strudel can pattern physical motors through an Inventor 2040W microcontroller receiving MQTT messages, with movement values in the range -90 to 90:

```js
$: move(sine.range(-30, 30).segment(16)).motor("0").slow(2).robot('x')
```

At `segment(16)` the movement is still quite jerky, because only 16 positions are taken from the sinewave per cycle. Raising it to 32 or 64 smooths the motion. It is best not to go much higher than that, because the microcontroller might get overwhelmed with a backlog of instructions. This is the concrete case for `segment()`: a hardware target that cannot absorb a continuous stream needs the signal quantized to a finite number of steps per cycle. [primary]

The same discretization is used musically, for example stepping a stack of signals across scale degrees with `segment(16).range(0, 15)`. [dig, jev=0.76]

## Recap

- Waveforms: `sine`, `saw`, `square`, `tri`; random: `rand`, `perlin`. [primary]
- Any numeric parameter accepts a signal in place of a number. [primary]
- Default range 0..1; `.range(min, max)` rescales, flipped arguments invert the motion. [primary]
- `.slow(N)` stretches the modulation across more cycles; `.slow(4)` means 8 cycles per repeat. [primary]
- `.segment(N)` samples N steps per cycle for targets that cannot take a continuous stream. [primary] [dig, jev=0.74]

## Sources considered

| URL | Weight |
| --- | --- |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/first-effects.mdx | primary |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/motors.mdx | primary |
| https://strudel.cc/learn/lfo/ | jev=0.84 |
| https://strudel.cc/learn/effects/ | jev=0.83 |
| https://strudel.cc/workshop/first-effects/ | jev=0.83 |
| https://strudel.cc/learn/signals/ | jev=0.76 |
| https://strudel.cc/learn/time-modifiers/ | jev=0.74 |
