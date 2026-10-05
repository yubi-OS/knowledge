# 09. Workshop Curriculum and Project Home

Scope: The full workshop chain (getting-started through recap), canonical function and syntax tables, and the source repo location (Codeberg vs archived GitHub).

## The canonical home

The Strudel source repository lives at codeberg.org/uzu/strudel, described as a web-based environment for live coding algorithmic patterns incorporating a faithful port of TidalCycles to JavaScript ([0.92] https://codeberg.org/uzu/strudel). Releases are published on the same Codeberg project ([0.77] https://codeberg.org/uzu/strudel/releases).

The former GitHub home is archived and marked moved: the tidalcycles/strudel GitHub repository states MOVED TO CODEBERG in its description ([0.56] https://github.com/tidalcycles/strudel), and the tidalcycles organization page lists strudel as a public archive with the same moved notice ([0.65] https://github.com/tidalcycles). Practical rule for future research: do not research the archived GitHub repo; use the Codeberg source. A wiki page on the old GitHub repo still hosts the technical manual, useful but historical ([0.92] https://github.com/tidalcycles/strudel/wiki/Technical-Manual).

## The workshop chain

The workshop is the official curriculum. The workshop index describes Strudel as a music live coding environment for the browser, porting the TidalCycles pattern language to JavaScript ([0.89] https://strudel.cc/workshop/). The chain as it exists on strudel.cc:

1. getting-started: the landing chapter. It names the best way to start learning Strudel as the workshop and hands off to first sounds ([0.81] https://strudel.cc/workshop/getting-started/). It also points to the showcase for videos of how people use Strudel ([0.81] https://strudel.cc/workshop/getting-started/).
2. first-sounds: the first real chapter. It opens with the workshop's interactive code fields and teaches them before any music ([0.81] https://strudel.cc/workshop/first-sounds/). It covers sounds, sample numbers, and drum banks ([0.81] https://strudel.cc/workshop/first-sounds/).
3. first-notes: notes, scales, and the scale-index pattern idiom ([0.91] https://strudel.cc/workshop/first-notes/, see doc 04).
4. first-effects: the audio effect set, low-pass filter onward ([0.93] https://strudel.cc/workshop/first-effects/, see doc 05).
5. pattern-effects: the Tidal-native pattern transformations ([0.88] https://felixroos.github.io/strudel/workshop/pattern-effects/, see doc 06).
6. motors: patterning hardware movement over MQTT ([0.72] https://strudel.cc/workshop/motors/, see doc 08).
7. recap: the closing chapter compiling the canonical function and syntax tables ([0.66] https://strudel.cc/workshop/recap/).

## What the recap is for

The recap chapter exists so the whole workshop's vocabulary is reviewable in one page: it is the canonical reference for the functions and syntax the earlier chapters introduced ([0.66] https://strudel.cc/workshop/recap/). For an agent building a skill on top of the workshop, the recap tables are the compact form of docs 02 through 06 ([0.66] https://strudel.cc/workshop/recap/).

## The wider reference surface beyond the workshop

The workshop is the learning path, not the whole docs site. The learn section carries the reference pages this corpus cites: mini-notation ([0.95] https://strudel.cc/learn/mini-notation/), code syntax ([0.96] https://strudel.cc/learn/code/), sounds ([0.92] https://strudel.cc/learn/sounds/), samples ([0.68] https://strudel.cc/learn/samples/), notes ([0.88] https://strudel.cc/learn/notes/), tonal functions ([0.86] https://strudel.cc/learn/tonal/), effects ([0.94] https://strudel.cc/learn/effects/), signals ([0.93] https://strudel.cc/learn/signals/), factories ([0.86] https://strudel.cc/learn/factories/), input-output ([0.86] https://strudel.cc/learn/input-output/), and the technical manual pages for the REPL ([0.79] https://strudel.cc/technical-manual/repl/) and patterns ([0.89] https://strudel.cc/technical-manual/patterns/).

## Community ecosystem

Community resources around the project: a curated awesome-strudel list exists on GitHub, though it scored weak as a primary source in this dig ([0.28] https://github.com/terryds/awesome-strudel); the patternclub mirror runs the workshop as editable worksheets with a Go to REPL button ([0.68] https://strudel.patternclub.org/workshop/strudel-basics/); and a community sample-pack index collects strudel.json packs ([0.71] https://strudel-samples.alternet.site/). The Discord channel is the project's own community contact point per the homepage ([0.90] https://strudel.cc/).

## Curriculum shape as a design lesson

The chain is deliberately ordered by primitive: REPL mechanics first (doc 01), rhythm syntax second (doc 02), sound catalog third (doc 03), pitch fourth (doc 04), then timbre (doc 05), then pattern-level composition (docs 06, 07), then non-audio outputs (doc 08), then consolidation ([0.66] https://strudel.cc/workshop/recap/). Every chapter teaches by editable example rather than by prose alone ([0.81] https://strudel.cc/workshop/first-sounds/), which is the pattern to preserve when building derived tutorials.
