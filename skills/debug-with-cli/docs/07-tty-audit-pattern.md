# 07 The argv-audit-to-tty pattern

Scope: the Sauna-side wrapper that makes every bridge POST visible on the user's serial console or PTY. This is an internal-record subtopic, no dig: the pattern, its rules, and the user corrections that shaped it all come from the source doc (yubi-OS/yubiOS skills/debug-with-cli/SKILL.md).

## The problem it solves

When the user is watching a serial console or log terminal hooked to the target's TTY (`/dev/ttyS2` on rock1, a PTY on a dev box), every bridge POST must leave a visible audit trail (source doc). Without it, the agent runs commands whose effects the user cannot see, and the human is debugging blind while the agent debugs remotely.

## The two-in-one shape

Every call writes a banner line to the TTY first, then runs the actual command with its output tee'd to the same TTY (source doc). The source doc provides a full bash wrapper (`sauna_post`) that takes an argv JSON array, builds a shell-safe command string, prepends a timestamped `argv:` banner via `printf '%b' > /dev/ttyS2`, and appends the command's combined output to the TTY with `tee -a`. It is written at `/tmp/sauna-bridge-wrapper.sh` in the Sauna sandbox and re-inlined per bash tool call, because the Sauna sandbox `/tmp` is per-call and does not persist (source doc).

## The 3 correctness rules

1. **`printf '%b'`, not `printf '%s'`**. `%b` interprets `\n` as a newline so the banner reads cleanly on the TTY; `%s` (and unescaped echo strings) leave `\n` as 2 literal characters, which the user reads as garbled `\n` text. The source doc records the user correction that produced this rule: "there are extra \n in what i sent" (source doc).
2. **`tee -a`, not `>`**. Append so multiple bridge calls in the same session do not clobber each other's output on the TTY. The TTY is line-buffered anyway (source doc).
3. **`repr()` / single-quoting for argv elements**. Every shell-special character in an argv string must be single-quoted in the inner `bash -c` body, so a path with a space or a `$` does not break the inner command. The source doc's wrapper single-quotes any element containing whitespace, quotes, backslash, dollar, semicolon, ampersand, pipes, redirects, braces, brackets, globs, tilde, or other specials (source doc).

## Multi-line content: the 2-POST rule

When a doc snippet, fix body, or heredoc needs to reach the TTY, the source doc mandates a 2-step flow: write it to the host's `/tmp` in a separate POST first, then `cat /tmp/<file> > /dev/ttyS2` in a second POST. The Sauna sandbox `/tmp` is local to the agent's bash call and does not exist on the host; the source doc records the user correction verbatim: "/tmp/answer.txt is local to you not the host" (source doc).

## The standing directive

The source doc preserves the user's verbatim directives: "echo command sent to the host on the tty always!" and "cant you just make an argv wrapper on your end to split it and tee the output to /dev/ttyS2" (source doc). The instruction to apply: use the pattern any time the user is debugging live on a target that has a TTY available for inspection (source doc).

## Why it matters as a pattern

This is the skill's observability discipline in miniature: the agent's remote actions must be as visible to the human as their local ones. The banner carries the exact argv (timestamped), the tee carries the exact output, and the append mode preserves session history on the TTY. Every element traces to a correction from real use, which is why the source doc pins them as rules rather than suggestions.
