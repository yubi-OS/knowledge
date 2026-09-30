# Notes, Scales, and Tempo

Scope: pitch in Strudel via `note()` with MIDI numbers and letter names, changing and stacking sounds for pitched notes, slowing melodic sequences with `[]`/N and `< >`, scales via `n(...).scale(...)` with scale degrees, the `setcpm` tempo model, and elongation/replication with `@` and `!`.

## Numbers and letters

`note()` sets pitch. You can play notes with numbers: `note("48 52 55 59").sound("piano")` [primary]. Numbers are MIDI note numbers, and decimals are allowed; the workshop invites `55.5`, which detunes a quarter tone [primary]. The rendered version of the same page confirms this path [dig, jev=0.6].

You can also play notes with letters: `note("c e g b").sound("piano")` [primary]. Letters a through g name the white keys [primary]. Add `#` or `b` (flats and sharps) to reach the black keys: `note("db eb gb ab bb")` or `note("c# d# f# g# a#")` [primary]. Append an octave digit to move registers: `note("c2 e3 g4 b5")`, with octaves 1 to 8 suggested in the workshop [primary]. The workshop notes that if the letter system is unfamiliar, numbers are easier, and most examples use numbers for that reason [primary]. The Notes reference page covers the same letter and number systems [dig, jev=0.6].

## Changing and stacking sounds

Pitched notes take sounds the same way unpitched ones do: `.sound("piano")` [primary]. You can switch between sounds per event with a space-separated pattern, so `note("48 67 63 [62, 58]").sound("piano gm_electric_guitar_muted")` alternates piano and guitar across events [primary]. Stack multiple sounds at once with a comma: `.sound("piano, gm_electric_guitar_muted")` plays both layers together [primary]. The workshop points out that here the `note` and `sound` patterns are combined position by position [primary].

## Slowing melodic sequences

Divide a bracketed sequence with `/` to slow it down: `note("[36 34 41 39]/4")` plays the 4 notes over 4 cycles (8 seconds at the default tempo), so each note lasts 2 seconds [primary]. Adding more notes inside the brackets makes it faster again, because the bracket content always fills the same span [primary].

Angle brackets play exactly one item per cycle: `note("<36 34 41 39>")` [primary]. They are a shortcut: `<a b c>` equals `[a b c]/3` and `<a b c d>` equals `[a b c d]/4` [primary]. The difference in feel is tempo stability: with `< >`, adding notes keeps the tempo the same, while inside `[ ]/N` each added note speeds the pattern up [primary].

The two bracket types combine. A repetitive bassline: `note("<[36 48]*4 [34 46]*4 [41 53]*4 [39 51]*4>")` [primary]. You can alternate inside a held note too: `note("60 <63 62 65 63>")` [primary]. The Understanding Cycles page covers the same slow-down and alternate mechanics [dig, jev=0.59].

## Scales

Finding the right notes is hard, so scales map small numbers onto a note set [primary]. The canonical example:

```
setcpm(60)
n("0 2 4 <[6,8] [7,9]>")
  .scale("C:minor").sound("piano")
```

Here `scale` interprets `n` as a scale degree, so any number you type sounds good [primary]. Scale names are `Tonic:mode`, optionally with an octave digit and mode chaining. The workshop suggests these scales to try: `C:major`, `A2:minor`, `D:dorian`, `G:mixolydian`, `A2:minor:pentatonic`, and `F:major:pentatonic` [primary]. `A2:minor` shows the octave digit inside the scale label, and `A2:minor:pentatonic` shows a mode name chained to a pentatonic filter [primary].

Scales are patterns like anything else, so you can automate them: `n("<0 -3>, 2 4 <[6,8] [7,9]>").scale("<C:major D:mixolydian>/4")` changes the scale every 4 cycles [primary]. Negative degrees work as well; `-3` appears in that example [primary]. The workshop reassures that scale names are just labels for note sets that go well together [primary].

## Tempo with setcpm

Strudel's tempo model is cycles per minute, set with `setcpm` [primary]. By default the tempo is 30 cycles per minute, which equals 120 bpm in 4/4 time, or 1 cycle every 2 seconds [primary]. `setcpm(90/4)` makes the pattern behave like eighth notes at 90 bpm in 4/4, and the workshop uses this `bpm/4` convention repeatedly: `setcpm(100/4)` for a rock beat, `setcpm(81/2)` for We Will Rock You, `setcpm(120/2)` for Firecracker [primary]. The recap lists `setcpm` as "sets the tempo in cycles per minute" [primary]. The Understanding Cycles page documents the same cycle-per-minute model [dig, jev=0.59].

## Elongate and replicate

`@` elongates. `note("c@3 eb")` holds c for 3 units while eb lasts 1 [primary]. Omitting the number is `@1` [primary]. Elongation works inside sub-sequences, which is how you write a shuffle groove:

```
setcpm(60)
n("<[4@2 4] [5@2 5] [6@2 6] [5@2 5]>*2")
  .scale("<C2:mixolydian F2:mixolydian>/4")
  .sound("gm_acoustic_bass")
```

Each beat has two notes where the first is twice as long as the second. The workshop calls this a shuffle, also known as triplet swing, common in blues and jazz [primary].

`!` replicates: `note("c!2 [eb,<g a bb a>]")` [primary]. The workshop asks you to compare `!`, `*`, and `@`: `!` copies the event, `*` speeds the pattern up, and `@` stretches time, and they sound different when combined with brackets [primary].

To play pitched lines against drums, prefix each pattern with `$:`; the recap lists `$:` as "play patterns in parallel" [primary].

## Sources considered

| Source | URL | Weight |
| --- | --- | --- |
| Workshop: First Notes (source) | https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/first-notes.mdx | primary |
| Workshop: First Sounds (source) | https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/first-sounds.mdx | primary |
| Workshop: Recap (source) | https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/recap.mdx | primary |
| First Notes (rendered) | https://strudel.cc/workshop/first-notes/ | dig, jev=0.6 |
| Notes reference | https://strudel.cc/learn/notes/ | dig, jev=0.6 |
| Tonal Functions | https://strudel.cc/learn/tonal/ | dig, jev=0.59 |
| Tonal Functions (mirror) | https://felixroos.github.io/strudel/learn/tonal/ | dig, jev=0.6 |
| Tonal API (mirror) | https://urswilke.github.io/strudel/learn/tonal/ | dig, jev=0.6 |
| Strudel Tutorial | https://larkob.github.io/strudel/tutorial/ | dig, jev=0.6 |
| Understanding Cycles | https://strudel.cc/understand/cycles/ | dig, jev=0.59 |
