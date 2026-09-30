# 02 - REPL Mechanics: Playing, Updating, and Stopping Patterns

This doc covers the strudel.cc REPL as an instrument: where it runs, the exact key combos that play, update, and stop patterns, how embedded code fields behave, how live updates work, and how the docs relate to the REPL.

## Where the REPL lives

Strudel runs in the browser with no installation. The main place to actually make music is the Strudel REPL at https://strudel.cc/ [primary: https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/learn/getting-started.mdx]. The technical manual calls the REPL the reference user interface: a browser-based live coding environment whose editor is dedicated to manipulating patterns while they play, with built-in visual feedback highlighting which mini-notation elements are sounding right now [primary: https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/technical-manual/repl.mdx; dig, jev=0.64: https://strudel.cc/technical-manual/repl/]. REPL stands for read, evaluate, print/play, loop [primary: same technical-manual page].

## The core loop: play, update, stop

The strudel.cc front page compresses the workflow to 3 steps: hit play, change something, hit update [dig, jev=0.63: https://strudel.cc/]. The keyboard shortcuts do the same work:

- Ctrl+Enter plays the code (first evaluation) and updates a running pattern.
- Ctrl+. stops playback.
- Alt+Enter also evaluates; Alt+. also stops. The keymap is defined in the editor package itself: keymap.of entries bind Ctrl-Enter and Alt-Enter to onEvaluate and Ctrl-. plus Alt-. to onStop, registered with Prec.highest so they win over editor defaults [primary: https://codeberg.org/uzu/strudel/raw/branch/main/packages/codemirror/codemirror.mjs].

If block-based evaluation is enabled in settings, Ctrl-Enter and Alt-Enter evaluate only the enclosing code block instead of the whole buffer [primary: same codemirror.mjs file]. The workshop teaches exactly this loop with a code field: click into the field, press ctrl+enter to play, change casio to metal, press ctrl+enter to update, press ctrl+. to stop [primary: https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/first-sounds.mdx].

Note the same key serves play and update: evaluation is idempotent from the player's view. Each update transpiles and evaluates the code to create a new Pattern instance, and the running scheduler queries that active pattern on a regular interval, generating events (haps) that get triggered by the output [primary: technical-manual/repl.mdx]. When an error occurs during editing, the vim manual advises reloading the page to reset editor state and trying again [dig, jev=0.71: https://strudel.cc/technical-manual/vim/]. International keyboard layouts have historically had trouble with these combos (Ctrl+Enter for play/update, and reaching the stop key), tracked in issue 901 [dig, jev=0.53: https://github.com/tidalcycles/strudel/issues/901].

## Prebake fields and editor modes

A second editor type exists for prebake code (setup that runs before patterns). Its keymap binds Meta-Enter on Mac, plus Ctrl-Enter and Alt-Enter, all to savePrebake, which flashes the editor, stores the code, and evaluates it [primary: https://codeberg.org/uzu/strudel/raw/branch/main/website/src/repl/prebakeCodeMirror.mjs]. The REPL editor is CodeMirror-based [primary: technical-manual/repl.mdx] and supports alternative keymaps including vim, emacs, vscode, and helix [primary: https://codeberg.org/uzu/strudel/raw/branch/main/packages/codemirror/keybindings.mjs]. In vim mode, :w evaluates (same action as Ctrl+Enter) and :q stops (same action as Alt+.) [primary: keybindings.mjs; dig, jev=0.51: https://blamy.github.io/strudel/technical-manual/vim/].

## Comments as a live-coding tool

Line comments (//) are how you turn individual layers on and off: a commented line is ignored, and deleting the // plus refreshing the pattern brings it back. The keyboard shortcut cmd-/ toggles comments on and off [primary: https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/learn/code.mdx]. The editor wires this through a repl-toggle-comment event handled with CodeMirror's toggleLineComment, which respects selections [primary: prebakeCodeMirror.mjs]. Samples in the REPL conventionally carry metadata comments starting with @ (like @by or @license) [primary: learn/code.mdx].

## Sounds load on demand

The first time a sound plays, there is a small pause while the sample loads; the docs say this plainly: "You might hear a little pause while the sound is loading" [primary: workshop/first-sounds.mdx]. Plan first hits accordingly when performing.

## Docs and REPL: one system

Workshop and learn pages embed playable code fields via the MiniRepl component, each carrying a tune prop with runnable code, client:visible so it hydrates on scroll [primary: workshop/first-sounds.mdx source shows MiniRepl usage throughout]. MiniREPLs let you listen and edit but are minimal; the full REPL at strudel.cc is where real sessions happen [primary: learn/getting-started.mdx]. MiniRepl updates use a refresh icon rather than a keyboard shortcut [primary: learn/getting-started.mdx]. Patterns can also be embedded elsewhere via iframe using a pattern URL [dig, jev=0.74: https://strudel.cc/technical-manual/project-start/].

## Sources considered

| Source | Type | jev |
| --- | --- | --- |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/first-sounds.mdx | primary | n/a |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/learn/getting-started.mdx | primary | n/a |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/learn/code.mdx | primary | n/a |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/technical-manual/repl.mdx | primary | n/a |
| https://codeberg.org/uzu/strudel/raw/branch/main/packages/codemirror/codemirror.mjs | primary | n/a |
| https://codeberg.org/uzu/strudel/raw/branch/main/packages/codemirror/keybindings.mjs | primary | n/a |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/repl/prebakeCodeMirror.mjs | primary | n/a |
| https://strudel.cc/ | dig | 0.63 |
| https://strudel.cc/technical-manual/repl/ | dig | 0.64 |
| https://strudel.cc/technical-manual/repl/ (editor detail) | dig | 0.52 |
| https://strudel.cc/learn/getting-started/ | dig | 0.72 |
| https://strudel.cc/learn/code/ | dig | 0.72 |
| https://strudel.cc/technical-manual/vim/ | dig | 0.71 |
| https://strudel.cc/technical-manual/project-start/ | dig | 0.74 |
| https://github.com/tidalcycles/strudel/issues/901 | dig | 0.53 |
| https://github.com/gruvw/strudel.nvim | dig | 0.54 |
| https://blamy.github.io/strudel/technical-manual/vim/ | dig | 0.51 |
