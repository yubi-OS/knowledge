# 01. REPL and Getting Started

Scope: What Strudel is, the strudel.cc browser REPL, evaluation keybindings, and the getting-started path.

## What Strudel is

Strudel is a version of TidalCycles written in JavaScript, initiated by Alex McLean and Felix Roos in 2022 ([0.95] https://strudel.cc/learn/getting-started/). TidalCycles is a popular live coding language for music, originally written in Haskell; Strudel ports its algorithmic pattern language to the browser ([0.90] https://strudel.cc/). The project describes itself as a free and open-source live coding platform for writing dynamic music pieces in the browser, made for beginners and experts alike ([0.85] https://patterns.slab.org/).

A 2022 conference talk frames the design goal directly: Strudel makes live coding more accessible by running entirely in the browser while opening Tidal's approach to algorithmic patterns up to modern audio and visual web technologies ([0.65] https://www.youtube.com/watch?v=KWIotFWVOi4). Weak backing note: this is a video source, scored below the 0.5 line on the primary-source scale in some dig batches, but the claim is corroborated by the two official pages above.

## The REPL

The main place to make music with Strudel is the Strudel REPL, and documentation pages also embed smaller interactive "MiniREPLs" for inline examples ([0.52] https://patterns.slab.org/learn/getting-started/). The homepage reduces the workflow to three steps: 1. hit play, 2. change something, 3. hit update ([0.90] https://strudel.cc/).

The REPL interface has two main parts: a UI for playback control and meta information, and the code editor, which is powered by CodeMirror. In the editor the user edits and evaluates pattern code live, using one of the available synthesis outputs to create music or sound ([0.79] https://strudel.cc/technical-manual/repl/). The REPL is designed to support both learning and live performance use ([0.79] https://strudel.cc/technical-manual/repl/).

## Evaluation keybindings

Patterns are evaluated with keyboard shortcuts rather than a separate run button. The Vim-mode manual notes that Ctrl+Enter works as an evaluation fallback, and that if a Vim command such as `:w` logs but evaluation does not apply, the user should check that Vim keybindings are active ([0.60] https://strudel.cc/technical-manual/vim/). The yubiOS strudel-live-coding skill source, which read the REPL keymap file `repl/prebakeCodeMirror.mjs` from the project source tree, confirms the full chord set: Ctrl, Cmd, or Alt combined with Enter all evaluate ([0.60] https://strudel.cc/technical-manual/vim/ for the Ctrl+Enter case; the full chord set is documented in the repo, see doc 09).

## Getting started path

The official getting-started page introduces Strudel as "a web-based live coding environment that implements the Tidal Cycles algorithmic pattern language" ([0.95] https://strudel.cc/learn/getting-started/). The workshop page is blunt about where to begin: "The best way to start learning Strudel is the workshop", and it hands the reader straight to the first sounds chapter ([0.81] https://strudel.cc/workshop/getting-started/).

The homepage also points to an interactive tutorial as the way to get started, and to a Discord channel for questions, feedback, and community contact ([0.90] https://strudel.cc/).

An alternative worksheet flow exists in the patternclub mirror: readers edit code directly in the worksheet and can click "Go to REPL" in the top right to move to the main interface; refreshing the page restores the original worksheet ([0.68] https://strudel.patternclub.org/workshop/strudel-basics/).

## The edit loop as the core habit

The REPL loop (play, change, update) is the same muscle the workshop trains: every chapter presents interactive code fields meant to be edited in place ([0.81] https://strudel.cc/workshop/first-sounds/). The getting-started docs page walks through exactly this loop for a first pattern: click the play icon, edit the text to read `s("bd sd cp hh")`, click the refresh icon, and you have live coded your first Strudel pattern ([0.52] https://patterns.slab.org/learn/getting-started/).

## What the REPL is not

The REPL is an editor and playback environment, not a test harness: there is no automated verification of whether a pattern "sounds right". Verification is the ear plus visual feedback. The technical manual describes the REPL's feedback as designed to support learning and live use ([0.79] https://strudel.cc/technical-manual/repl/), and the workshop leans on visual feedback as a first-class feature alongside the code fields ([0.81] https://strudel.cc/workshop/getting-started/).
