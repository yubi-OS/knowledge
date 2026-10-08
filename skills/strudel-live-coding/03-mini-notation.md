# 03 - Mini-Notation, the rhythm language

Scope: the embedded rhythm language inside quotes: sequence, sample number, rest, alternate, subsequence and nesting, speed up, slow down, parallel, elongate, replicate, and the cycle-squish mental model that explains all of it.

## What it is

Strudel uses a so called "Mini-Notation", a custom language designed for writing rhythmic patterns using small amounts of text, just like TidalCycles (https://strudel.cc/learn/mini-notation/, jev weight 0.91). The workshop frames it the same way: Strudel has an embedded mini language for rhythmic patterns (https://larkob.github.io/strudel/tutorial/, jev weight 0.30, weak backing). Mini-Notation is always written inside quotes; it is a string that Strudel parses into a pattern (source doc).

## The operators

The source doc tabulates the full syntax. The dig corroborates that the official reference page "explains the entirety of the Mini-Notation syntax" (https://strudel.cc/learn/mini-notation/, jev weight 0.91). The table:

| Concept | Syntax | Example |
|---|---|---|
| Sequence | space | `sound("bd bd sd hh")` |
| Sample number | `:x` | `sound("hh:0 hh:1 hh:2 hh:3")` (no number means `:0`) |
| Rest | `-` or `~` | `sound("bd hh - rim")` |
| Alternate, one per cycle | `< >` | `sound("<bd hh rim oh>")` |
| Sub-sequence, squishes to its own slot | `[ ]` | `sound("bd wind [metal jazz] hh")` |
| Sub-sub-sequence | `[[ ]]` | `sound("bd [metal [jazz [sd cp]]]")` (nest as deep as you want) |
| Speed up | `*` | `sound("bd sd*2 cp*3")` (decimals allowed: `hh*1.5`) |
| Slow down | `/` | `note("[c a f e]/2")` |
| Parallel, stack | `,` | `sound("bd*2, hh*2 [hh oh]")` |
| Elongate | `@` | `note("c@3 e")` (`c@1` equals bare `c`) |
| Replicate | `!` | `note("c!3 e")` |

All of the above is from the source doc (yubi-OS/yubiOS skills/strudel-live-coding/SKILL.md).

## The cycle-squish mental model

One mental model explains most beginner confusion: a sequence's contents are squished into one cycle, which is 2 seconds by default (source doc). Consequences:

- Adding elements to a bare sequence makes it faster, because the same one cycle must hold more events (source doc).
- `<a b c>` is shorthand for `[a b c]/3`: the elements spread over cycles instead of squishing, so tempo stays the same as you add or remove elements (source doc).
- Sub-sequences squish to their own slot; the workshop puts it directly: "the content of a sub-sequence will be squished to its own length" (https://strudel.cc/workshop/first-sounds/, jev weight 0.94).
- Multiplication speeds things up, and the workshop teaches it as such: "Multiplication: Speed things up" (https://strudel.cc/workshop/first-sounds/, jev weight 0.94).

The cycles page grounds the timing: Strudel expresses tempo as CPS, cycles per second, with a default of 0.5 CPS, which is the 2 second cycle (https://strudel.cc/understand/cycles/, jev weight 0.93). Beware mirrors: the stale felixroos.github.io copy of the same page says a default of 1 CPS (https://felixroos.github.io/strudel/understand/cycles/, jev weight 0.37, weak backing). Prefer strudel.cc.

## Inside versus outside

Inside Mini-Notation, `*` means fast and `/` means slow. Outside Mini-Notation, use the chainable functions `.fast(2)` and `.slow(2)` (source doc). The same distinction applies to speed control generally: operators act on one element, functions act on the whole pattern.

## Newlines and multi-line stacks

Newlines inside a pattern are fine: use backticks, the JavaScript template literal, for multi-line parallel stacks (source doc). This is how the 16 step sequencer imitation and the classy stack in the canonical tunes keep their grid shape readable (source doc, doc 10).

## Choosing the right operator

The source doc's checklist gives the discriminator: `!` repeats the same event, `*` speeds it up, `@` stretches it. Use `@` for groove and length, `*` for rolls, `!` for literal duplication (source doc). When a pattern must keep its tempo while you add or remove elements, wrap it in `< >`; when tempo should follow the element count, use a bare sequence or `[ ]/N` (source doc).

## Strudel-specific note

The official docs also describe a larger sibling notation called Mondo Notation, whose most notable feature compared to Mini-Notation is the ability to call functions using round brackets; the docs state the rest of the site uses mondo notation itself (https://strudel.cc/learn/mondo-notation/, jev weight 0.87). Mini-Notation remains what the workshop teaches first and what the source doc documents (source doc).

## Source-of-record statement

Every claim above traces to the source doc (yubi-OS/yubiOS skills/strudel-live-coding/SKILL.md) or to a cited dig result with its jev weight. Weak-backing sources are labeled.
