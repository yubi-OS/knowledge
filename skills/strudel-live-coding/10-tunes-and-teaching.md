# 10 - Canonical tunes and the teaching workflow

Scope: the verified workshop example tunes from the source doc, the build-from-scratch teaching path, the idea-to-Mini-Notation conversion, and the verify and debug checklist. Internal-record subtopic: no dig, grounded in the source doc.

This doc is an internal-record subtopic: its content is the source doc's own examples and workflow, so no searXNG dig was run for it. Sources: yubi-OS/yubiOS skills/strudel-live-coding/SKILL.md (the source doc). The workshop chapters these examples come from were located by the digs for docs 01 through 08.

## Canonical full tunes

Each tune below is quoted verbatim from the source doc, which marks them as verified workshop examples.

Classic house:

```
$: sound("bd*4, [- cp]*2, [- hh]*4").bank("RolandTR909")
```

Basic rock beat:

```
setcpm(100/4)
$: sound("[bd sd]*2, hh*8").bank("RolandTR505")
```

We Will Rock You:

```
setcpm(81/2)
$: sound("bd*2 cp").bank("RolandTR707")
```

YMO Firecracker:

```
setcpm(120/2)
$: sound("bd sd, - - - hh - hh - -, - perc - perc:1*2").bank("RolandCompurhythm1000")
```

16 step sequencer imitation (grid layout, one bracket per 4 steps):

```
setcpm(90/4)
$: sound(`[-  -  oh - ] [-  -  -  - ] [-  -  -  - ] [-  -  -  - ],
[hh hh -  - ] [hh -  hh - ] [hh -  hh - ] [hh -  hh - ],
[-  -  -  - ] [cp -  -  - ] [-  -  -  - ] [cp -  -  - ],
[bd -  -  - ] [-  -  -  bd] [-  -  bd - ] [-  -  -  bd]`)
```

Full "classy" stack (drums, bass, melody, pad):

```
$: sound("bd*4, [~ <sd cp>]*2, [~ hh]*4").bank("RolandTR909")
$: note("<[c2 c3]*4 [bb1 bb2]*4 [f2 f3]*4 [eb2 eb3]*4>")
  .sound("gm_synth_bass_1").lpf(800)
$: n(`<[~ 0] 2 [0 2] [~ 2]
  [~ 0] 1 [0 1] [~ 1]
  [~ 0] 3 [0 3] [~ 3]
  [~ 0] 2 [0 2] [~ 2] >*4`).scale("C4:minor")
  .sound("gm_synth_strings_1")
```

Dub tune (effects showcase):

```
$: note("[~ [<[d3,a3,f4]!2 [d3,bb3,g4]!2> ~]]*2")
  .sound("gm_electric_guitar_muted").delay(.5)
$: sound("bd rim").bank("RolandTR707").delay(.5)
$: n("<4 [3@3 4] [<2 0> ~@16] ~>")
  .scale("D4:minor").sound("gm_accordion:2")
  .room(2).gain(.4)
$: n("[0 [~ 0] 4 [3 2] [0 ~] [0 ~] <0 2> ~]/2")
  .scale("D2:minor")
  .sound("sawtooth,triangle").lpf(800)
```

Shuffle groove (triplet swing via elongation):

```
setcpm(60)
$: n("<[4@2 4] [5@2 5] [6@2 6] [5@2 5]>*2")
  .scale("<C2:mixolydian F2:mixolydian>/4")
  .sound("gm_acoustic_bass")
```

What each tune teaches, per the source doc's structure: the house and rock lines teach `$:` stacking plus one bank call; the 16 step grid teaches the multi-line template literal layout that mimics a hardware step sequencer; the classy stack teaches four layers, one per role; the dub tune is the effects showcase, pairing `.delay()` on melody and drums with `.room()`, `.gain()`, and oscillator stacking; the shuffle groove is the elongation lesson, where `@` produces the triplet swing.

## Build a beat from scratch, the workshop path

The source doc's worked path (source doc):

```
# 1. one sound
$: sound("casio")
# 2. a drum sequence (squished into 1 cycle, 8 elements = fast)
$: sound("bd bd hh bd rim bd hh bd")
# 3. control tempo independently of element count
$: sound("<bd bd hh bd rim bd hh bd>*8")
# 4. set real tempo
$: setcpm(90/4); sound("<bd hh rim hh>*8")
# 5. rests + sub-sequences + parallel layers
$: sound("bd [hh hh] sd [hh bd] bd - [hh sd] cp")
$: sound("hh hh hh, bd casio")
```

The pedagogy is deliberate: step 2 shows the cycle-squish problem (8 elements in one cycle sounds frantic), step 3 fixes it with `< >`, step 4 replaces the implied tempo with real cpm math, and step 5 adds the expressive operators. Each step is independently playable.

## Melody with scale degrees and automation

```
setcpm(60)
$: n("<0 -3>, 2 4 <[6,8] [7,9]>")
  .scale("<C:major D:mixolydian>/4")
  .sound("piano")
```

(source doc). This single example carries four ideas at once: `n` degrees, negative degrees wrapping backwards, patterned scales with `/4`, and a comma stack inside one line.

## Turn a musical idea into Mini-Notation

Idea from the source doc: "hihat 16ths with accents, kick on 1 and 3-and, snare on 2 and 4, at 120 bpm."

```
setcpm(60/4)
$: sound("[hh hh hh hh]*4").gain("[1 .3]*8")
$: sound("[bd ~ bd ~] [bd ~ ~ bd]").bank("RolandTR909")
$: sound("[~ sd ~ sd]")
```

The source doc's explanation: the bracket grid is one cycle per line segment, and `setcpm(60/4)` makes each cycle a bar at 120 bpm. The kick pattern `[bd ~ bd ~] [bd ~ ~ bd]` reads as the spoken idea almost element by element, which is the conversion habit worth teaching: bracket per beat, spaces per subdivision, `~` for the silences the idea names.

## Verify and debug a pattern

The source doc's checklist (source doc):

- Play it in the REPL at https://strudel.cc/ or in a workshop code field: `Ctrl+Enter` to play, edit, `Ctrl+Enter` to update, `Ctrl+.` to stop.
- If a pattern sounds flat, add dynamics: `.gain("[.25 1]*4")` on hats, `.adsr(...)` on pads.
- If tempo changed unexpectedly after edits, the sequence is not inside `< >`: bare sequences re-squish on every add or remove. Wrap with `< >` or add `/N`.
- If a sound is silent, try a different sample number (`name:1`) or check the name exists: drum letters are `bd sd rim hh oh lt mt ht rd cr`; unpitched sounds are `insect wind jazz metal east crow casio space numbers`.
- Use the punchcard or pianoroll visualization in the REPL to see where events land.

## The standing checklist

The source doc's final guidelines list, which this corpus treats as the review gate for any pattern:

- Default tempo math: cycle = 2s; `setcpm(bpm/4)` for quarter-note-based bpm.
- `< >` when tempo must not change as the pattern evolves; `[ ]/N` or bare sequences when it should.
- `,` inside a single `sound()` versus `$:` lines: both layer patterns; `$:` keeps layers separately editable and mutable (`_$:` mutes, `.hush()` silences one layer).
- Every effect parameter accepts Mini-Notation patterns and signals: pattern `.lpf`, `.pan`, `.gain`, `.speed`, even `.scale`.
- `!` repeats the same event, `*` speeds it up, `@` stretches it: use `@` for groove and length, `*` for rolls, `!` for literal duplication.
- Always test the final pattern in the actual REPL; syntax that looks right can still sound wrong. The ear is the verifier.

(source doc)

## Source-of-record statement

All tunes, the worked teaching path, the conversion example, and the checklists in this doc come from the source doc (yubi-OS/yubiOS skills/strudel-live-coding/SKILL.md), which itself grounds them in the official workshop pages at https://strudel.cc/workshop/ and the strudel source at codeberg.org/uzu/strudel (workshop MDX under website/src/pages/workshop/). This was an internal-record subtopic, no dig.
