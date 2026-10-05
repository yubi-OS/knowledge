# 02. Mini-Notation Rhythm Syntax

Scope: Mini-Notation syntax for rhythms: sequences, rests, sub-sequences, alternates, elongation, polyrhythms, sample numbers.

## What Mini-Notation is

Just like TidalCycles, Strudel uses a "Mini-Notation", a custom language designed for writing rhythmic patterns using little amounts of text ([0.95] https://strudel.cc/learn/mini-notation/). The official page states plainly that it explains the entirety of the Mini-Notation syntax on one page ([0.95] https://strudel.cc/learn/mini-notation/). The docs mirror calls the same thing an "embedded mini-notation", also called a domain-specific language or DSL, designed for writing rhythmic patterns in small amounts of text ([0.91] https://patterns.slab.org/learn/mini-notation/).

## Double quotes are pattern strings

The syntax choice that matters most in daily use: in TidalCycles and Strudel, double-quoted strings are parsed as patterns using the mini-notation, and the phrase "pattern string" is the common name for them ([0.96] https://strudel.cc/learn/code/). To create a regular string and not a pattern, use single quotes: a single-quoted 'C minor' will not be parsed as Mini-Notation ([0.96] https://strudel.cc/learn/code/). This single distinction explains a large class of "why did my pattern not parse" errors: the quotes decide whether the text is rhythm or plain text.

Double quotes work for single line mini-notation, as the docs note they had done already throughout the examples ([0.95] https://strudel.cc/learn/mini-notation/). Multi-line patterns can be built up over several quoted lines as the workshop examples do.

## Sequences, rests, and structure

A space-separated sequence is the base unit: `s("bd sd cp hh")` is the canonical first rhythm, and editing it and clicking refresh is the documented "first pattern" flow ([0.52] https://patterns.slab.org/learn/getting-started/). The dot (`.`) splits a sequence into sub-sequences that play in parallel within the same cycle, which is how layered drum voices like `bd sd,hh*8` are written ([0.57] https://patterns.slab.org/learn/samples/ shows the layered syntax in a sample-map example).

Repetition with `*`, alternation with `<>`, sub-sequences in brackets, and rests are the core structural tokens covered by the single syntax page ([0.95] https://strudel.cc/learn/mini-notation/). Sample numbers attach with a colon inside a sound token, for example `hh:0 hh:1 hh:2 hh:3 hh:4 hh:5 hh:6 hh:7`, as documented on the samples page ([0.68] https://strudel.cc/learn/samples/).

## Euclidean rhythms

The mini-notation includes Euclidean rhythm notation, which compresses "3 beats over 8 segments, starting on position 1" into a short token instead of writing out each hit ([0.91] https://patterns.slab.org/learn/mini-notation/). Euclidean distribution is one of the distinctive pattern-family tools Strudel inherits from the Tidal lineage, and it is written inline in the pattern string rather than as a separate function call ([0.91] https://patterns.slab.org/learn/mini-notation/).

## The Technical Manual view of parsing

The project's technical manual treats mini-notation as a distinct parsing layer inside user code: the manual notes that an important part of user code is the mini notation, which allows rhythms to be expressed in a short manner, and that the parser implementation was expected to change (shift replaced by acorn, tracked in the repo's issue tracker) ([0.92] https://github.com/tidalcycles/strudel/wiki/Technical-Manual). Practical takeaway for authors: the mini-notation parser is an implementation detail with history, and behavior differences between mirrors are real.

## Mirror drift warning

Multiple third-party mirrors host copies of the mini-notation page: urswilke.github.io ([0.43] https://urswilke.github.io/strudel/learn/mini-notation/), blamy.github.io ([0.57] https://blamy.github.io/strudel/learn/mini-notation/), and deepwiki scrapes ([0.09] https://deepwiki.com/blakkd/strudel_documentation/4.3-mini-notation, [0.11] https://deepwiki.com/blakkd/strudel/5.4-mini-notation, both weak backing). Weak backing note: all four of these fall below or near the 0.5 primary-source line. Treat strudel.cc as canonical and mirrors as snapshots that may lag the parser.

## How the workshop teaches it

The workshop splits rhythm teaching across chapters: first-sounds introduces sequences and repetition in the context of drum sounds ([0.81] https://strudel.cc/workshop/first-sounds/), while pattern transformations (doc 06) show the same strings fed through functions. The recap chapter compiles the canonical syntax tables ([0.66] https://strudel.cc/workshop/recap/).

## Authoring discipline

Because the mini-notation is a parsed DSL inside JavaScript strings, two failure classes dominate: quote confusion (single vs double, doc 02 vs doc 01) and silent wrong-name sounds (a misspelled sample name plays nothing, see doc 03). The syntax page plus the code-syntax page together cover most of the daily authoring surface ([0.95] https://strudel.cc/learn/mini-notation/, [0.96] https://strudel.cc/learn/code/).
