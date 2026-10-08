# 08 - Pattern effects, the Tidal-specific toolbox

Scope: the pattern-level transformations that distinguish Strudel from ordinary DAW-style sequencing: `rev`, `jux`, `add`, `ply`, `off`, and multi-tempo playback with `.slow()`.

## Why this toolbox exists

The official pattern-effects chapter draws the line explicitly: up until now, most of the functions seen are what other music programs are typically capable of, sequencing sounds, playing notes, controlling effects. This chapter looks at functions that are more unique to tidal (https://strudel.cc/workshop/pattern-effects/, jev weight 0.93). These operations transform the pattern itself rather than the audio flowing through the chain.

## rev

`rev()` reverses the pattern (source doc). The workshop chapter opens its catalog with exactly this: "reverse patterns with rev" (https://strudel.cc/workshop/pattern-effects/, jev weight 0.93).

## jux

`jux(rev)` splits stereo: the original plays on the left channel, the modified (reversed) version on the right (source doc). The source doc notes the equivalence: it sounds like two `$:` lines, one with `.pan(0)` and one with `.pan(1).rev()`. For teaching and visualization, the source doc pairs it with `.color("cyan")` / `.color("magenta")` so each half of the split shows its own color in the REPL (source doc). A community workshop page lists `jux` among the core functions alongside `sound`, `fast`, `rev`, `iter` (https://strudel.patternclub.org/workshop/functions/, jev weight 0.41, weak backing).

## add

`.add("<0 <1 -1>>")` adds a number to events. A note becomes its numeric value, so adding 1 to MIDI note 48 produces 49; it is chainable: `.add("<0 <1 -1>>").add("0,7")` (source doc). On scale degrees it stays in-scale, which is what makes it a musical move rather than a transposition bug: `n("0 [2 4] <3 5>".add("<0 [0,2,4]>")).scale("C5:minor")` (source doc). The tonal docs corroborate the degree model this relies on: numbers turn into notes in the scale, zero indexed, with negative numbers wrapping backwards and sharps or flats reaching outside the scale (https://strudel.cc/learn/tonal/, jev weight 0.88).

## ply

`.ply(2)` plays each event 2 times. The source doc gives the equivalence: `s("bd sd").ply(2)` is approximately `s("bd*2 sd*2")`. It is patternable: `.ply("<1 2 3>")` varies the repetition count per cycle (source doc).

## off

`.off(1/16, x => x.add(4))` copies the pattern, shifts the copy by 1/16 of a cycle, and modifies the copy (source doc). The copy can carry its own full transformation stack. The source doc's nestable example: `.off(2/16, x => x.speed(1.5).gain(.25).off(3/16, y => y.vowel("<a e i o>*8")))` (source doc). This is the tool for dub-style echoes of a pattern rather than an audio delay line.

## Multiple tempos in one pattern

`.slow("0.5,1,1.5")` produces three parallel copies of the pattern at three speeds (source doc). This is the pattern-level sibling of the `,` parallel operator inside Mini-Notation: instead of stacking different content, it stacks the same content at different speeds.

## How to choose

The source doc's guidance, implicit in the catalog and explicit in the checklist: pattern transforms compose with everything. `rev`, `ply`, `off`, and multi-tempo `.slow()` all take a pattern and return a pattern, so they chain before or after audio effects without changing the event rhythm (source doc). When a change should alter what happens, reach here first; when it should alter how it sounds, reach for the audio effects of doc 06.

## Third-party material, labeled weak

Community and mirror material on pattern transforms scored low on the noul weighting: a tutorial notes file (https://github.com/nikolasgioannou/strudel-tutorial/blob/main/notes/07-pattern-transforms.md, jev weight 0.17), a mirrored workshop page (https://www.june.kim/jamdojo/workshop/pattern-effects/, jev weight 0.14), an AI-oriented docs fork (https://github.com/auto-duan/strudel-docs-for-ai/blob/main/functions/transform/rev.md, jev weight 0.08), and the legacy TidalCycles userbase page (https://userbase.tidalcycles.org/Transforming_Patterns.html, jev weight 0.06). None carries a load-bearing claim; the official workshop chapter (jev weight 0.93) is the citable authority.

## Source-of-record statement

Every claim above traces to the source doc (yubi-OS/yubiOS skills/strudel-live-coding/SKILL.md) or to a cited dig result with its jev weight. Weak-backing sources (below 0.5) are labeled and carry no load-bearing claim.
