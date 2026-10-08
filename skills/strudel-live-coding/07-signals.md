# 07 - Signals, continuous modulation

Scope: replacing any number with a signal, the built-in signal set, default ranges, rescaling with `.range()`, controlling modulation speed with `.slow()`, and discretizing with `.segment()`.

## What a signal is

Signals are patterns with continuous values, meaning they have theoretically infinite steps; they provide streams of numbers that can be sampled at discrete points in time (https://strudel.cc/learn/signals/, jev weight 0.92). The practical consequence, per the source doc: you can replace any number with a signal, and the parameter it feeds becomes continuously modulated instead of fixed (source doc).

## The built-in signals

The built-in set the source doc lists: `sine`, `saw`, `square`, `tri`, `rand`, `perlin`. The canonical example is `sound("hh*16").gain(sine)`, hats whose gain sweeps continuously (source doc). The official signals page confirms the same set and adds family members: "There is also saw2, sine2, cosine2, tri2, square2 and rand2 which have a range from -1 to 1!" (https://strudel.cc/learn/signals/, jev weight 0.92).

## Range and inversion

Signals default to 0 to 1 (source doc). Rescale with `.range(min, max)`: `.lpf(saw.range(500, 2000))` maps the saw over 500 to 2000. Flipping the range values inverts the motion: `.range(2000, 500)` makes the filter sweep downward (source doc).

## Modulation speed

Signals run at the pattern's tempo by default. Change modulation speed with `.slow()`: `.lpf(sine.range(100, 2000).slow(4))` makes the whole modulation span 4 cycles, 8 seconds at the default tempo (source doc). This composes with everything else because a signal is itself a pattern: the same `.slow()` / `.fast()` operators apply.

## Segment: continuous to stepped

`.segment(16)` discretizes a signal into N steps per cycle (source doc). The source doc names the motivating use case: hardware like motors, where continuous streaming would overwhelm the device. This is why doc 10's dropped sibling subtopic (motors) shared the same rule: keep `.segment(N)` modest, 16 to 64 (source doc).

## Composing signals with parameters

Every effect parameter accepts Mini-Notation patterns and signals, per the source doc checklist: pattern `.lpf`, `.pan`, `.gain`, `.speed` (source doc). The value-modifiers reference shows the general mechanism from the other side: parameters can be controlled independently by patterns or plain values, and `.log()` lets you observe each event's parameter values over time (https://strudel.cc/functions/value-modifiers/, jev weight 0.93). Combining the two views: a Mini-Notation pattern on a parameter produces discrete stepped values per event, while a signal produces a continuous stream sampled as the pattern runs.

## Debug checklist for signals

- A modulated parameter never reaches the extremes you wanted: the signal still has its default 0 to 1 range; wrap it in `.range(min, max)` (source doc).
- The modulation is faster than intended: add `.slow(N)` to the signal, not to the sound pattern (source doc).
- The modulation is too smooth to hear as steps: add `.segment(N)` (source doc).
- Hardware falls behind: reduce the segment count toward 16 (source doc).

## Third-party material, labeled weak

Community notes on signals and modulation scored 0.16 on the noul weighting (https://github.com/nikolasgioannou/strudel-tutorial/blob/main/notes/09-signals-and-modulation.md, weak backing) and a docs mirror scored 0.11 (https://patterns.slab.org/learn/signals/, weak backing). They are consistent with the official page but carry no load-bearing claim in this doc. One DeepWiki mirror scored 0.11 (https://deepwiki.com/blakkd/strudel_documentation/7.6-signals-and-continuous-control, weak backing).

## Source-of-record statement

Every claim above traces to the source doc (yubi-OS/yubiOS skills/strudel-live-coding/SKILL.md) or to a cited dig result with its jev weight. Weak-backing sources (below 0.5) are labeled and carry no load-bearing claim.
