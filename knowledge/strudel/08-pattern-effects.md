# 08 Pattern Effects

This doc covers the Tidal-specific pattern transformations in Strudel: the functions that are unique to the TidalCycles lineage rather than generic DAW features. Strudel itself is a music live coding environment for the browser, porting the TidalCycles pattern language to JavaScript [dig, jev=0.5]. The official workshop draws the same boundary: most functions seen before are "what other music programs are typically capable of", and the Pattern Effects chapter is where "functions that are more unique to tidal" live [primary]. The functions covered here are rev, jux, add, ply, off, and multi-tempo layering via .slow("0.5,1,1.5").

## rev

`rev` reverses a pattern [primary]. The recap table lists it simply as "reverse" [primary]. Example from the workshop: `n("0 2 4 6 ~ 7 9 5").scale("C:minor").rev()` plays the scale-degree sequence back to front [primary].

## jux

`jux` is described in the recap table as "split left/right, modify right" [primary]. It takes a pattern transformer as its argument and plays the unmodified pattern in the left channel while playing the transformed version in the right channel: `n("0 1 [4 3] 2 0 2 [~ 3] 4").sound("jazz").jux(rev)` [primary]. The workshop states this is exactly the same as the two-`$:` expansion [primary]:

```
$: n("0 1 [4 3] 2 0 2 [~ 3] 4").sound("jazz").pan(0)
$: n("0 1 [4 3] 2 0 2 [~ 3] 4").sound("jazz").pan(1).rev()
```

So `jux(fn)` is shorthand for pan(0) on the original plus pan(1) with `fn` applied [primary]. A Tidal-adjacent workshop source describes the same mechanic: the pattern is "being fed into jux, which in turn feeds it into fast(2)", but "only on one speaker or earphone" [dig, jev=0.52]. For visualization, the workshop colors each half to show what happens: `.pan(0).color("cyan")` for the original and `.pan(1).color("magenta").rev()` for the modified copy [primary].

## add

`add` adds numbers or notes to the values of events [primary]. The recap table labels it "add numbers / notes" [primary]. The workshop notes that "If you add a number to a note, the note will be treated as if it was a number" [primary], so `note("c2 [eb3,g3]".add("<0 <1 -1>>"))` shifts pitches numerically [primary]. add is chainable: the workshop shows "We can add as often as we like" with `note("c2 [eb3,g3]".add("<0 <1 -1>>").add("0,7"))` [primary].

With scale degrees, add is the way to move within a scale: `n("0 [2 4] <3 5> [~ <4 1>]".add("<0 [0,2,4]>")).scale("C5:minor")` [primary]. Because `n` plus `scale` sets the note in scale [primary], the added value counts scale steps rather than semitones, which keeps the result in-scale [primary].

## ply

`ply` plays each event n times; the recap describes it as "speed up each event n times" [primary]. `sound("hh hh, bd rim [~ cp] rim").bank("RolandTR707").ply(2)` "is like writing" the same pattern with every event doubled in mini-notation: `sound("hh*2 hh*2, bd*2 rim*2 [~ cp*2] rim*2").bank("RolandTR707")` [primary]. ply itself is patternable: the recap example is `s("bd sd").ply("<1 2 3>")` [primary], and the workshop suggests trying `"<1 2 1 3>"` [primary].

## off

`off` copies a pattern, shifts the copy in time, and modifies the copy; the recap calls it "copy, shift time & modify" [primary]. The workshop unpacks the notation `.off(1/16, x=>x.add(4))` in three steps: take the original pattern named as `x`, modify `x` with `.add(4)`, and play it offset from the original by 1/16 of a cycle [primary]. Full example: `n("0 [4 <3 2>] <2 3> [~ 1]".off(1/16, x=>x.add(4))).scale("<C5:minor Db5:mixolydian>/2")` [primary]. off "is also useful for modifying other sounds, and can even be nested" [primary], as in `s("bd sd [rim bd] sd,[~ hh]*4").bank("CasioRZ1").off(2/16, x=>x.speed(1.5).gain(.25).off(3/16, y=>y.vowel("<a e i o>*8")))` [primary]. The recap's compact example is `s("bd sd, hh*4").off(1/16, x=>x.speed(2))` [primary].

## Multiple tempos in one call

A single chained call can produce several simultaneous tempos. `note("c2, eb3 g3 [bb3 c4]").sound("piano").slow("0.5,1,1.5")` [primary] is, per the workshop, like doing three parallel `$:` lines, each with a different `.slow` value and its own color: `.slow(0.5).color('cyan')`, `.slow(1).color('magenta')`, `.slow(1.5).color('yellow')` [primary]. The comma-separated argument to slow fans one pattern out into three tempo layers [primary]. In the same stacking idiom, the workshop combines scaled `add`, numeric `add`, and `jux(rev)` across three `$:` lines [primary].

## Summary table

| Function | Effect | Signature seen in sources |
| --- | --- | --- |
| rev | reverse [primary] | `.rev()` [primary] |
| jux | split left/right, modify right [primary] | `.jux(rev)` [primary] |
| add | add numbers / notes [primary] | `.add("<0 1 2 1>")`, `.add("0,7")` [primary] |
| ply | speed up each event n times [primary] | `.ply(2)`, `.ply("<1 2 3>")` [primary] |
| off | copy, shift time & modify [primary] | `.off(1/16, x=>x.speed(2))` [primary] |
| slow (multi) | several tempos at once [primary] | `.slow("0.5,1,1.5")` [primary] |

## Sources considered

| URL | Weight (jev) |
| --- | --- |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/pattern-effects.mdx | primary |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/recap.mdx | primary |
| https://strudel.cc/workshop/pattern-effects/ | 0.85 |
| https://strudel.cc/blog/ | 0.79 |
| https://github.com/tidalcycles | 0.74 |
| https://starlog.is/articles/ai-dev-tools/tidalcycles-strudel | 0.73 |
| https://github.com/tidalcycles/strudel | 0.73 |
| https://github.com/tidalcycles/strudel/wiki | 0.72 |
| https://strudel.cc/ | 0.72 |
| https://strudel.patternclub.org/workshop/functions/ | 0.52 |
| https://www.june.kim/jamdojo/workshop/pattern-effects/ | 0.5 |
| https://patterns.slab.org/learn/effects/ | 0.5 |
| https://strudel.cc/learn/effects/ | 0.49 (below threshold, not cited) |
| https://strudel.cc/technical-manual/patterns/ | 0.49 (below threshold, not cited) |
