# 02 - REPL mechanics

Scope: how the browser REPL evaluates code: the play/update/stop keybindings, comments, parallel pattern stacks with `$:`, muting with `_$:`, stopping one layer with `.hush()`, and on-demand sample loading.

## The evaluate loop

The REPL is organized around code fields. Click in a field, press `Ctrl+Enter` (on macOS `Meta+Enter`; `Alt+Enter` also works) to play. Change the code, press `Ctrl+Enter` again to update the running pattern live. Press `Ctrl+.` to stop. That update-while-playing step is the core of live coding (source doc).

The official keyboard-shortcut material corroborates the bindings: "In Strudel REPL, shortcuts for QWERTY keyboards are Ctrl+Enter to play and update, Ctrl+. to stop, Cmd+/ to comment/uncomment" (https://github.com/tidalcycles/strudel/issues/901, jev weight 0.40, weak backing; the source doc itself carries the same bindings). The REPL also supports an alternate evaluation path: when the CodeMirror editor is configured with Vim keybindings, `:w` evaluates the current code (the same evaluation as `Ctrl+Enter` / `Alt+Enter`) and `:q` stops playback (https://strudel.cc/technical-manual/vim/, jev weight 0.81). International keyboard layouts are a known friction point; the AZERTY stop shortcut differs (https://github.com/tidalcycles/strudel/issues/901, jev weight 0.40, weak backing).

## First-time sample loading

Sounds may load with a small pause the first time, because samples are fetched on demand (source doc). This is worth teaching on day 1: a silent first evaluation is usually a loading pause, not a broken pattern. Re-evaluating the same line after the fetch completes plays immediately.

## Comments as an instrument

Line comments use `//`. Comment out a `$:` line to silence one layer; remove the `//` to bring it back (source doc). The official coding-syntax page describes the same workflow: "Try uncommenting this line by deleting // and refreshing the pattern. You can also use the keyboard shortcut cmd-/ to toggle comments on and off" (https://strudel.cc/learn/code/, jev weight 0.92). Comments are also how the REPL's bundled examples carry metadata: words starting with `@`, like `@by` or `@license`, are a convention for describing information about the music (https://strudel.cc/learn/code/, jev weight 0.92).

## Parallel stacks with `$:`

Multiple patterns play in parallel via `$:` (source doc). Each `$:` line is one independent layer of the mix, which is what makes the REPL feel like a mixer as much as an editor. Two layering mechanisms exist and are not redundant:

- `,` inside a single `sound()` call layers patterns within one line.
- separate `$:` lines keep layers separately editable and mutable.

(source doc). The source doc's checklist says to prefer `$:` lines when you want per-layer control.

## Muting and per-layer stops

Two per-layer controls exist beyond commenting out:

- Prefix a line with `_$:` instead of `$:` to mute that layer. It stays loaded but silent (source doc).
- Add `.hush()` at the end of one pattern in the stack to stop just that layer (source doc).

The workshop teaches `.hush()` in exactly that framing: "Try adding .hush() at the end of one of the patterns in the stack" (https://strudel.cc/workshop/first-effects/, jev weight 0.92). The difference matters live: `_$:` is a reversible mute you flip by editing the prefix, while `.hush()` removes the pattern from the playing stack.

## What happens under the hood (context)

When the webaudio output plays a Hap (an event in a pattern), it looks up and calls the onTrigger function for the given sound, and the returned node connects to the rest of the standard effects chain (https://strudel.cc/technical-manual/sounds/, jev weight 0.90). You never need this to write patterns, but it explains two observed behaviors: why a first evaluation pauses while samples fetch, and why custom registered sounds appear in the sounds tab after evaluation (https://strudel.cc/technical-manual/sounds/, jev weight 0.90).

## Debug checklist for REPL mechanics

- Nothing plays: check the evaluate keybinding for your layout (`Ctrl+Enter` / `Meta+Enter` / `Alt+Enter`), and remember `Ctrl+.` stops (source doc).
- First evaluation is silent: wait out the on-demand sample fetch, then re-evaluate (source doc).
- A layer will not go away: comment out its `$:` line, or mute it with `_$:`, or stop it with `.hush()` (source doc).
- Editing feels slow: comment toggling has a shortcut (`cmd-/`), per https://strudel.cc/learn/code/ (jev weight 0.92).

## Source-of-record statement

Every claim above traces to the source doc (yubi-OS/yubiOS skills/strudel-live-coding/SKILL.md) or to the cited dig results with jev weights. Weak-backing sources (weight below 0.5) are labeled and are only used where they corroborate the source doc rather than carry a claim alone.
