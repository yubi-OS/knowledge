# 06. Pattern Transformations

Scope: rev, jux, add, ply, off and other pattern functions; multiple tempos; how transformations compose.

## The Tidal-native layer

The pattern-effects chapter opens by drawing the line this doc sits on: up until then, most functions seen are what other music programs are typically capable of, sequencing sounds, playing notes, controlling effects. This chapter is about functions more unique to Tidal ([0.88] https://felixroos.github.io/strudel/workshop/pattern-effects/, mirrored at [0.56] https://www.june.kim/jamdojo/workshop/pattern-effects/).

The canonical examples from that chapter: reverse a pattern with `rev`, as in `n("0 1 [4 3] 2").sound("jazz").rev()`, and play a pattern left and right with `jux` ([0.88] https://felixroos.github.io/strudel/workshop/pattern-effects/). The chapter's function family (rev, jux, add, ply, off) all share one contract: they take a pattern and return a new pattern.

## How transformation works internally

The technical manual explains the mechanism: Strudel and Tidal are all about transforming patterns, and this is done by replacing the pattern with a new one that calls the old one. The new pattern can only manipulate the query before passing it to the old pattern, and manipulate the results from it before returning them to the caller ([0.89] https://strudel.cc/technical-manual/patterns/). A tutorial note states the consequence plainly: pattern transforms take a pattern and return a new pattern, they are the core of Strudel's expressive power, and conceptually each transform manipulates the query function ([0.76] https://github.com/nikolasgioannou/strudel-tutorial/blob/main/notes/07-pattern-transforms.md).

## Composition is chaining

The patternclub worksheet shows the composition style in one line: a pattern is fed into `iter(4)`, then into `fast("<2 3>")`, then finds its final form after being fed into `jux(rev)`, and only then is what the listener hears ([0.71] https://strudel.patternclub.org/workshop/functions/). The same source notes that different functions require different numbers of inputs ([0.71] https://strudel.patternclub.org/workshop/functions/). This is the functional-pipeline mental model: order of application is part of the musical meaning.

## Multiple tempos

The chapter covers running parts at different speeds at once, with `fast` and friends applied per-part inside a stack ([0.88] https://felixroos.github.io/strudel/workshop/pattern-effects/). The factories documentation supplies the underlying rule that makes polytempo and polymeter sane: patterns are repeated until they all fit the cycle; in the documented example the first pattern is repeated twice and the second three times to fit the lowest common multiple of 6 steps ([0.86] https://strudel.cc/learn/factories/).

## Factories and pattern constructors

`rev`, `jux` and friends are consumers; the producers are the factory functions documented on the creating-patterns page, which lists the functions that return a pattern and their mini-notation equivalents ([0.86] https://strudel.cc/learn/factories/). Together the two pages define the full type discipline: factories make patterns, transforms consume and produce them, effects sit on the audio side (doc 05).

## The workshop's canonical examples

The pattern-effects chapter carries the canonical tunes of the workshop corpus, including the patterns built with off, ply, and add over drum and note bases ([0.88] https://felixroos.github.io/strudel/workshop/pattern-effects/). The recap chapter compiles these into the canonical function table ([0.66] https://strudel.cc/workshop/recap/).

## Debugging transforms

Two failure classes follow from the mechanism. First, order sensitivity: because each transform wraps the previous pattern ([0.89] https://strudel.cc/technical-manual/patterns/), moving a call in the chain changes the music; a `rev` before or after a `jux` differs audibly. Second, type mismatches: transforms expecting numeric patterns applied to event patterns fail or behave unexpectedly, which the tutorial attributes to the query-manipulation contract ([0.76] https://github.com/nikolasgioannou/strudel-tutorial/blob/main/notes/07-pattern-transforms.md). The verification loop stays the same: apply, update, listen ([0.90] https://strudel.cc/).
