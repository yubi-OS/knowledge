# Mini-Notation: the rhythm syntax

Scope: the complete Mini-Notation rhythm syntax as taught by the Strudel workshop. Mini-Notation is the rhythm language of Tidal that lives inside pattern strings [primary]. This doc covers sequences, sample numbers, rests, sub-sequences, speed and slow operators, parallel layers, alternation, elongation, replication, and the cycle model that all of it sits on.

## The cycle model

Everything in a sequence is squished into what is called a cycle. A cycle is 2s long by default. The tempo is 30 cycles per minute, which is 120/4, so 1 cycle every 2 seconds [primary]. The longer the sequence, the faster it runs: adding sounds to `sound("bd bd hh bd rim bd hh bd")` makes it play faster, because the content of a sequence will be squished into the cycle [primary]. The same rule applies inside brackets: similar to the whole sequence, the content of a sub-sequence will be squished to its own length [primary].

## The syntax table

| Concept | Syntax | Example | Source |
| --- | --- | --- | --- |
| Sequence | space | `sound("bd bd sd hh")` | [primary] |
| Sample Number | `:x` | `sound("hh:0 hh:1 hh:2 hh:3")` | [primary] |
| Rests | `-` or `~` | `sound("metal - jazz jazz:1")` | [primary] |
| Alternate | `< >` | `note("c a f <e g>")` | [primary] |
| Sub-Sequences | `[]` | `sound("bd wind [metal jazz] hh")` | [primary] |
| Sub-Sub-Sequences | `[[]]` | `sound("bd [metal [jazz [sd cp]]]")` | [primary] |
| Speed up | `*` | `sound("bd sd*2 cp*3")` | [primary] |
| Parallel | `,` | `sound("bd*2, hh*2 [hh oh]")` | [primary] |
| Slow down | `/` | `note("[c a f e]/2")` | [primary] |
| Elongate | `@` | `note("c@3 e")` | [primary] |
| Replicate | `!` | `note("c!3 e")` | [primary] |

The table is the canonical workshop recap listing [primary]. The pattern-club basics workshop teaches the same operator set with the same examples [dig, jev=0.73].

## Sequences and sample numbers

Multiple sounds are played in a sequence by separating them with a space: `sound("bd hh sd hh")` [primary]. A colon picks a sample number within a sound: `sound("casio:1")` plays the second sample of the casio sound [primary]. Sample numbers compose with everything else, including brackets and `*`: `sound("jazz:0 jazz:1 [jazz:4 jazz:2] jazz:3*2")` [primary]. The same pattern can be split into an `n` pattern and a sound: `n("0 1 [4 2] 3*2").sound("jazz")` [primary].

## Rests

Add a rest in a sequence with `-` or `~`: `sound("bd hh - rim - bd hh rim")` [primary]. The recap table uses `~` in its rests row [primary]. Both spellings are shown by the workshop; no difference between them is stated in the sources.

## Sub-sequences and nesting

Brackets divide a cycle: `sound("bd [hh hh] sd [hh bd] bd - [hh sd] cp")` [primary]. Each bracketed group is squished to its own length, so `[hh hh]` plays 2 hits in the slot of 1 step. Brackets nest: `sound("bd [[rim rim] hh] bd cp")` plays a sub-sub-sequence [primary]. The recap example nests 3 deep: `sound("bd [metal [jazz [sd cp]]]")` [primary].

## Speed up and slow down

`*` speeds up the thing it follows: `sound("bd hh*2 rim hh*3 bd [- hh*2] rim hh*2")` [primary]. The factor can be fractional: `sound("bd [hh rim]*2 bd [hh rim]*1.5")` [primary]. Stacking factors is fine: `sound("bd hh*32 rim hh*16")` [primary]. Applying `*` to a bracketed group speeds up the whole group: `sound("<bd bd hh bd rim bd hh bd>*8")` plays the 8-element alternation 8 times per cycle [primary].

`/` slows a sequence down by spreading it over cycles. `note("[36 34 41 39]/4")` plays the sequence in brackets over 4 cycles, which is 8s, so each of the 4 notes is 2s long; adding more notes inside the brackets makes it faster [primary]. The recap canonical form is `note("[c a f e]/2")` [primary].

## Parallel layers

A comma plays sequences in parallel: `sound("hh hh hh, bd casio")` stacks 2 layers [primary]. More layers stack the same way: `sound("hh hh hh, bd bd, - casio")` [primary]. Commas also work inside sub-sequences: `sound("hh hh hh, bd [bd,casio]")` [primary]. For notes, the comma builds chords or split voices: `note("36 43, 52 59 62 64").sound("piano")` [primary].

## Alternate per cycle

Angle brackets play only 1 element per cycle: `sound("<bd bd hh bd rim bd hh bd>")`. The special property is that the tempo does not change when you add or remove elements inside `< .. >` [primary]. Angle brackets are a shortcut: `<a b c>` equals `[a b c]/3` and `<a b c d>` equals `[a b c d]/4`, and so on [primary]. Because the divisor is the number of elements, longer melodies keep the same tempo: `note("<36 34 41 39>")` plays 1 note per cycle [primary]. The recap table states the equivalence for `< >` as an alternation over `[ ]` with N equal to the element count [primary].

The 2 bracket types combine freely. A repetitive bassline plays one 4-step group per cycle: `note("<[36 48]*4 [34 46]*4 [41 53]*4 [39 51]*4>").sound("gm_acoustic_bass")` [primary]. Alternation also works on fragments inside a sequence: `note("60 <63 62 65 63>")` and `sound("bd*4, [~ <sd cp>]*2, [~ hh]*4").bank("RolandTR909")` [primary]. The `*2` on `[~ <sd cp>]*2` shows operators applying to groups that contain alternations [primary].

## Elongate and replicate

`@` elongates an event. In `note("c@3 eb")`, c is 3 units long and eb is 1 unit long. Not using `@` is the same as using `@1` [primary]. Elongation works inside sub-sequences, which is how the workshop builds a shuffle: `n("<[4@2 4] [5@2 5] [6@2 6] [5@2 5]>*2")`, where each beat has 2 notes and the first is twice as long as the second, also called triplet swing [primary].

`!` replicates an event without changing the underlying grid: `note("c!2 [eb,<g a bb a>]")` [primary]. The workshop asks the reader to switch between `!`, `*` and `@` and compare; the difference is that `!` repeats the event inside its slot, `*` multiplies the events into the slot, and `@` stretches 1 event across more of the slot [primary].

## Sources considered

| URL | Weight |
| --- | --- |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/first-sounds.mdx | primary |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/first-notes.mdx | primary |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/recap.mdx | primary |
| https://strudel.cc/learn/mini-notation/ | jev=0.52 |
| https://strudel.cc/technical-manual/repl/ | jev=0.74 |
| https://strudel.cc/learn/code/ | jev=0.73 |
| https://github.com/tidalcycles/strudel/wiki/Technical-Manual | jev=0.72 |
| https://strudel.patternclub.org/workshop/strudel-basics/ | jev=0.73 |
| https://strudel.cc/learn/factories/ | jev=0.74 |
