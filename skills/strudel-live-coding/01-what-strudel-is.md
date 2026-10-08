# 01 - What Strudel is

Scope: Strudel as a browser-based live coding environment, its TidalCycles lineage, what it is used for, the workshop learning ladder, and where its canonical source lives.

## The environment

Strudel is a browser-based environment for live coding algorithmic patterns. The project describes itself as "a new live coding platform to write dynamic music pieces in the browser", free and open source (https://strudel.cc/, jev weight 0.86). Its own docs state the one-line identity: "Strudel is a music live coding environment for the browser, porting the TidalCycles pattern language to JavaScript" (https://strudel.cc, jev weight 0.84). The source repository carries the same phrasing: "Web-based environment for live coding algorithmic patterns, incorporating a faithful port of TidalCycles to JavaScript" (https://codeberg.org/uzu/strudel, jev weight 0.91).

The source doc (yubi-OS/yubiOS skills/strudel-live-coding/SKILL.md) records the same identity and adds the practical anchors: the place to make music is the Strudel REPL at https://strudel.cc/, the docs and workshop live at https://strudel.cc/workshop/.

## TidalCycles lineage

Strudel is an official port of the TidalCycles pattern language to JavaScript (source doc). The official getting-started chapter confirms it: "It is an official port of the Tidal Cycles pattern language to JavaScript. You don't need to know JavaScript or Tidal Cycles to make music with Strudel" (https://strudel.cc/workshop/getting-started/, jev weight 0.95). TidalCycles itself remains the mother language; the cycles concept is so central that TidalCycles carries it in its name (https://strudel.cc/understand/cycles/, jev weight 0.93).

## Canonical home: Codeberg, not GitHub

The source doc is explicit: the source lives at https://codeberg.org/uzu/strudel, and the GitHub repository tidalcycles/strudel was archived after the move to Codeberg in mid 2025, so do not cite the GitHub repo as the canonical home (source doc). The dig corroborates both halves: the Codeberg repo is active with 6470 commits, 225 branches, and 533 tags (https://codeberg.org/uzu/strudel, jev weight 0.91), while the GitHub repository now reads "MOVED TO CODEBERG" (https://github.com/tidalcycles/strudel, jev weight 0.26, weak backing but consistent with the source doc). The live-strudel examples mirror repeats the port description (https://live.strudel.cc/examples/, jev weight 0.73).

## What it is used for

The source doc lists the uses: live coded music, algorithmic composition, teaching (low barrier of entry, teaches music and code at once), and use as a flexible sequencer into an existing setup via MIDI or OSC (source doc). The workshop confirms the low barrier claim independently: no JavaScript or TidalCycles knowledge is needed (https://strudel.cc/workshop/getting-started/, jev weight 0.95). Because it runs entirely in the browser, a learner's first sound is one evaluation away; there is no toolchain to install.

## The workshop learning ladder

The source doc records the workshop chapter order as the learning ladder: first-sounds, then first-notes, then first-effects, then pattern-effects, then motors, then recap (source doc). The digs found each of these chapters as live official pages, including first-sounds (https://strudel.cc/workshop/first-sounds/, jev weight 0.94), first-effects (https://strudel.cc/workshop/first-effects/, jev weight 0.92), pattern-effects (https://strudel.cc/workshop/pattern-effects/, jev weight 0.93), and recap (https://strudel.cc/workshop/recap/, jev weight 0.90). The motors chapter exists at https://strudel.cc/workshop/motors/ (jev weight 0.90) even though this corpus does not carry a dedicated motors doc.

## Why the REPL matters for teaching

The REPL is interactive: code fields evaluate in place, the pattern keeps playing while you edit it, and the workshop tutorial walks the learner through basics inside those fields (https://strudel.cc/workshop/getting-started/, jev weight 0.95). This is what makes Strudel a teaching instrument as much as an instrument: the loop of edit, evaluate, hear, edit again is the whole curriculum. The source doc makes this the first guideline: everything else in the corpus (Mini-Notation, sounds, effects, signals) hangs off that evaluate loop.

## Source-of-record statement

Every claim above traces to the source doc (yubi-OS/yubiOS skills/strudel-live-coding/SKILL.md) or to a cited dig result with its jev weight. Claims marked "source doc" are attributed to that file; claims with weights carry their URL. Nothing in this doc contradicts the source doc. One drift note: the older mirrored site at felixroos.github.io shows a stale default tempo text (https://felixroos.github.io/strudel/understand/cycles/, jev weight 0.37, weak backing), so prefer strudel.cc pages over mirrors when a number matters.
