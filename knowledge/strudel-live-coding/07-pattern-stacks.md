# 07. Pattern Stacks and Full Tunes

Scope: stack() for layering patterns, building complete tunes, arranging parts into a full piece.

## stack as the mixer

The JavaScript API page shows the central idiom: mini-notation for the individual rhythms, the `stack` function to mix them ([0.89] https://strudel.cc/functions/intro/). A subtlety on the same page matters for authoring: while stack is also available as a comma inside mini-notation, the comma cannot be used when the layers have different types of sounds, so `stack` is the explicit tool for a multi-part tune ([0.89] https://strudel.cc/functions/intro/).

The same page states the general combining rule: you can freely mix JS patterns, mini patterns, and values ([0.89] https://strudel.cc/functions/intro/). That is what makes a stack a tune: each layer can be a plain mini-notation string, a pattern built by a factory, or a transformed pattern from doc 06.

## Factories that build layers

The creating-patterns page lists the functions that return a pattern, the equivalents used by the mini-notation ([0.86] https://strudel.cc/learn/factories/). These factories are what supply stack's arguments, and they include the family that arranges patterns across time: `arrange` allows arranging multiple patterns together over multiple cycles, taking a variable number of arrays with two elements specifying the number of cycles and the pattern to use ([0.70] https://felixroos.github.io/strudel/learn/factories/).

Another constructor combines lists of patterns with the same pulse, which creates so-called polymeters when differently sized sequences are used ([0.68] https://patterns.slab.org/learn/factories/). The cycle-alignment rule underneath is documented on the same family of pages: patterns repeat until they all fit the cycle, expanding to the lowest common multiple of the layer lengths ([0.86] https://strudel.cc/learn/factories/).

## Patterns as a runtime structure

The technical manual explains what a composed pattern is at runtime: in practice Strudel and Tidal are all about transforming patterns, done by replacing the pattern with a new one that calls the old one ([0.89] https://strudel.cc/technical-manual/patterns/). A stack is therefore not a mixer bus but a pattern itself, queryable and transformable like any other ([0.89] https://strudel.cc/technical-manual/patterns/). This is why the whole tune can still take `rev()`, `jux()`, or an effect chain from doc 05.

## Building a full tune

The workflow the API page implies: write each part as its own pattern (drums from doc 03, notes and scales from doc 04), then combine them in a stack, then arrange sections over cycles with arrange ([0.89] https://strudel.cc/functions/intro/, [0.70] https://felixroos.github.io/strudel/learn/factories/). The workshop's recap chapter collects the canonical function and syntax tables that this workflow draws on ([0.66] https://strudel.cc/workshop/recap/).

Community discussion of the same technique exists on the uzu forum, where pattern sequencing across a full piece is discussed, though as a forum thread it carries weak backing for factual claims ([0.11] https://uzu.lurk.org/t/pattern-sequencing-in-strudel-how-to-play-full-...).

## Failure modes when stacking

Three documented hazards: mixing types where mini-notation commas would be used instead of stack ([0.89] https://strudel.cc/functions/intro/); expecting layer lengths to align without accounting for the lowest-common-multiple expansion ([0.86] https://strudel.cc/learn/factories/); and arranging over cycles without counting the cycle lengths in arrange's pairs ([0.70] https://felixroos.github.io/strudel/learn/factories/). The verification tool is unchanged: run the stack, listen, adjust ([0.90] https://strudel.cc/).

## Where to read more

The function reference index lives at the functions intro page ([0.89] https://strudel.cc/functions/intro/), the factories at learn/factories ([0.86] https://strudel.cc/learn/factories/), and a curated resource list exists in the community awesome-strudel repo, though it scored weak in this dig ([0.28] https://github.com/terryds/awesome-strudel).
