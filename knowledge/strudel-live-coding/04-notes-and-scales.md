# 04. Notes and Scales

Scope: note(), n(), scales, scale/chord helpers, note sequencing, elongate and replicate for note patterns.

## Three ways to express pitch

In Strudel, pitches can be expressed as note names, note numbers, or frequencies ([0.88] https://strudel.cc/learn/notes/). The notes page demonstrates the equivalence with a concrete set: A3 is 220 Hz, C#4 natural is 275 Hz, E4 is 330 Hz, and A4 is 440 Hz, mirroring earlier frequency examples ([0.88] https://strudel.cc/learn/notes/). The page then asks the reader the discriminating question: can you hear the difference between these individual frequencies? ([0.88] https://strudel.cc/learn/notes/). That is a pedagogical point with practical weight: numbers are exact, names are readable, and the ear is the arbiter.

## Scales as the safety net

Finding the right notes is difficult, so scales are here to help ([0.91] https://strudel.cc/workshop/first-notes/). The canonical workshop example is:

```
setcpm(60)
n("0 2 4 <[6,8] [7,9]>")
  .scale("C:minor")
  .sound("piano")
```

The workshop's advice on this example: try out different numbers, any number should sound good, because the scale maps arbitrary indices onto a consonant set of pitches ([0.91] https://strudel.cc/workshop/first-notes/). It explicitly de-dramatizes theory: if you have no idea what the scale names mean, do not worry, they are just labels for different sets of notes that go well together ([0.91] https://strudel.cc/workshop/first-notes/).

## Tonal functions

The tonal functions page documents the scale machinery precisely: `scale` turns numbers into notes in the scale, zero indexed, or quantizes notes to a scale ([0.86] https://strudel.cc/learn/tonal/). Numbers described as scale indices can be negative, and negative numbers wrap backwards in the scale, with sharps or flats producing notes outside the scale ([0.86] https://strudel.cc/learn/tonal/). The same call also sets the scale for other scale operations, like `Pattern#scaleTranspose` ([0.86] https://strudel.cc/learn/tonal/).

The tutorial mirror extends the tonal toolkit with concrete semantics: transposing notes inside the scale by a number of steps, turning chord symbols into voicings using the smoothest voice leading possible, and turning chord symbols into root notes of chords in a given octave; combining edit, struct, and voicings can create a basic backing track ([0.66] https://larkob.github.io/strudel/tutorial/). The same source notes Strudel supports MIDI via webmidi ([0.66] https://larkob.github.io/strudel/tutorial/).

## Note sequencing inside patterns

Notes combine with the mini-notation from doc 02: the scale index string `n("0 2 4 <[6,8] [7,9]>")` is a pattern string, so all rhythm operators (alternates, sub-sequences, repetition) apply to note indices ([0.91] https://strudel.cc/workshop/first-notes/). Frequency sequences work the same way with `freq`, as shown in the sounds page example `freq("220 275 330 440 550").s("triangle sawtooth sine")` ([0.92] https://strudel.cc/learn/sounds/).

## Elongate and replicate

The first-notes chapter teaches elongation and replication as the time-shaping tools for note patterns, extending events and repeating them to fill or stretch musical time ([0.91] https://strudel.cc/workshop/first-notes/). These operate at the pattern level before sound selection, which is why they compose cleanly with scale and sound calls.

## What the notes layer assumes

Three caller obligations follow from the tonal machinery: the scale must be set before scale-indexed numbers resolve to expected pitches ([0.86] https://strudel.cc/learn/tonal/); indices are zero-indexed, so index 0 is the first scale degree, not the first fret-style offset ([0.86] https://strudel.cc/learn/tonal/); and out-of-scale movement needs sharps, flats, or negative wrapping rather than erroring ([0.86] https://strudel.cc/learn/tonal/). The failure mode is not silence but unexpected pitch, so verification is aural: the workshop's "any number should sound good" rule is the debugging heuristic ([0.91] https://strudel.cc/workshop/first-notes/).
