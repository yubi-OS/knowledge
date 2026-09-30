# Livecoding Practice: the Workshop Ladder, Canonical Beats, and Community

This doc covers practice and community for Strudel: how the workshop is structured as a learning ladder (getting-started, first-sounds, first-notes, first-effects, pattern-effects, recap), the teaching positioning, the canonical starter beats from the workshop Examples sections, and the community layer. Syntax mechanics live in the other docs of this corpus.

## The Workshop as a Designed Learning Ladder

The getting-started page frames the workshop as the entry: "The best way to start learning Strudel is the workshop" [primary, https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/getting-started.mdx]. It promises "This interactive tutorial will guide you through the basics" and "You don't need to know JavaScript or Tidal Cycles to make music with Strudel" [primary, getting-started.mdx]. The ladder climbs in 5 steps, each closing with a Recap table of syntax and functions:

1. first-sounds: interactive code fields, `sound`, drum letters (`bd`, `sd`, `hh`, `oh`, `cp`, `rim`), `bank`, sequences, rests, sub-sequences, parallel layers [primary, first-sounds.mdx]. The first exercise is 5 steps: click the field, ctrl+enter to play, change `casio` to `metal`, ctrl+enter again, ctrl+. to stop. "Congratulations, you are now live coding!" [primary, first-sounds.mdx]
2. first-notes: `note` with numbers or letters, octaves, `/` to slow down, `< >` alternation, `@` elongate, `!` replicate, scales via `n(...).scale("C:minor")`, and `$:` to stack parallel patterns [primary, first-notes.mdx]
3. first-effects: `lpf`, `vowel`, `gain`, ADSR envelopes, `delay`, `room`, `pan`, `speed`, `fast`/`slow`, then signal modulation with `sine`, `saw`, `square`, `tri`, `rand`, `perlin` and `.range(500, 2000)` [primary, first-effects.mdx]
4. pattern-effects: the Tidal-unique transforms `rev`, `jux`, `.add`, `ply`, `off` (copy, shift time, modify) [primary, pattern-effects.mdx]
5. recap: every concept and function, organized as Mini Notation, Sounds, Notes, Audio Effects, Pattern Effects tables [primary, recap.mdx]

Each chapter alternates explanation with runnable MiniRepl code fields and boxed try-this exercises, so practice is edit-and-replay from the first minute.

## Teaching Positioning

The getting-started page lists 4 uses [primary, getting-started.mdx]: live code music (make music with code in real time); algorithmic composition (compose music using tidal's unique approach to pattern manipulation); teaching ("focussing on a low barrier of entry, Strudel is a good fit for teaching music and code at the same time"); and integration (via MIDI or OSC as "a really flexible sequencer").

The workshop softens theory pressure: "don't worry if you don't know these terms, as they are not required to make music with Strudel" (on bpm and 4/4) [primary, first-sounds.mdx], and scales are "just labels for different sets of notes that go well together" [primary, first-notes.mdx]. Tempo is taught as `setcpm`, cycles per minute, defaulting to 30 cpm, 1 cycle every 2 seconds [primary, first-sounds.mdx].

## Canonical Starter Beats (verbatim from first-sounds Examples)

Basic rock beat [primary, first-sounds.mdx]:

```js
setcpm(100/4)
sound("[bd sd]*2, hh*8").bank("RolandTR505")
```

Classic house [primary, first-sounds.mdx]:

```js
sound("bd*4, [- cp]*2, [- hh]*4").bank("RolandTR909")
```

The workshop observes: "the two patterns are extremely similar. Certain drum patterns are reused across genres" [primary, first-sounds.mdx].

We Will Rock You [primary, first-sounds.mdx]:

```js
setcpm(81/2)
sound("bd*2 cp").bank("RolandTR707")
```

Yellow Magic Orchestra, Firecracker [primary, first-sounds.mdx]:

```js
setcpm(120/2)
sound("bd sd, - - - hh - hh - -, - perc - perc:1*2")
.bank("RolandCompurhythm1000")
```

Imitation of a 16 step sequencer [primary, first-sounds.mdx]:

```js
setcpm(90/4)
sound(`
[-  -  oh - ] [-  -  -  - ] [-  -  -  - ] [-  -  -  - ],
[hh hh -  - ] [hh -  hh - ] [hh -  hh - ] [hh -  hh - ],
[-  -  -  - ] [cp -  -  - ] [-  -  -  - ] [cp -  -  - ],
[bd -  -  - ] [-  -  -  bd] [-  -  bd - ] [-  -  -  bd]
`)
```

## From Beats to Music: the Classy Stack and the Dub Tune

first-notes closes with 3 pieces designed to be stacked with `$:`: the Classy Bassline `note("<[c2 c3]*4 [bb1 bb2]*4 [f2 f3]*4 [eb2 eb3]*4>").sound("gm_synth_bass_1").lpf(800)`, the Classy Melody on `gm_synth_strings_1` with `.scale("C4:minor")`, and the Classy Drums `sound("bd*4, [~ <sd cp>]*2, [~ hh]*4").bank("RolandTR909")` [primary, first-notes.mdx]. first-effects then assembles a 4-layer tune from `hh*8` with patterned gain, the same bass as a sawtooth with `lpf("200 1000 200 1000")`, chords with `.vowel("<a e i o>")`, and finishes with a "little dub tune" combining delay, `room(2)`, and a D2:minor sawtooth bassline, plus the muting idiom `.hush()` [primary, first-effects.mdx].

## Community Layer

- Showcase: getting-started links to the showcase for "videos of how people use Strudel" [primary, getting-started.mdx]. The showcase lists froos at the Algorave 10th Birthday stream, letSeaTstrudeL and CCC at solstice stream 2023, and yaxu and olivia combining an early version of Strudel with hydra via flok [dig, jev=0.67, https://strudel.cc/intro/showcase/]
- External teaching: Lucy Cheesman (Heavy Lifting) published a "Learn how to make music through live coding" tutorial built around "a laptop and the Strudel workshop website" [dig, jev=0.55, https://www.youtube.com/watch?v=QRJ0xrjLj6A]
- Algorave context: Strudel and Tidal are named among the tools of algorave practice, where the dance floor is the performance site and code is the instrument [dig, jev=0.67, https://deeptechmagazine.com/features/algorave-creating-music-with-code/] [dig, jev=0.66, https://glfmn.io/presentations/algorave/] [dig, jev=0.65, https://www.mattcurrent.org/blog/livecoding-algorave-realtime-performance-art/]
- Scene calendar: algorave.com lists dated 2026 events in Sheffield, Lyon, Ghent, London and more [dig, jev=0.64, https://algorave.com/]

## Gaps

The workshop pages do not document community channels (chat, forum, contributing); showcase and algorave evidence comes entirely from the dig pool. The getting-started MiniRepl `examples` array contents were not resolved in this fetch.

## Sources considered

| url | jev | used |
| --- | --- | --- |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/getting-started.mdx | primary | yes |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/first-sounds.mdx | primary | yes |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/first-notes.mdx | primary | yes |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/first-effects.mdx | primary | yes |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/pattern-effects.mdx | primary | yes |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/recap.mdx | primary | yes |
| https://strudel.cc/intro/showcase/ | 0.67 | yes |
| https://www.youtube.com/watch?v=QRJ0xrjLj6A | 0.55 | yes |
| https://deeptechmagazine.com/features/algorave-creating-music-with-code/ | 0.67 | yes |
| https://glfmn.io/presentations/algorave/ | 0.66 | yes |
| https://www.mattcurrent.org/blog/livecoding-algorave-realtime-performance-art/ | 0.65 | yes |
| https://algorave.com/ | 0.64 | yes |
