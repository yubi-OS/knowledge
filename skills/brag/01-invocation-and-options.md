# 01. Invocation and Options

Source doc: `yubi-OS/yubiOS/skills/brag/SKILL.md` (primary source of record). This doc explicates the source doc's invocation surface. No dig: this is an internal-record subtopic (the options are defined entirely in the skill).

## What /brag is

`/brag` turns the current project website or app into a short, polished, shareable launch video using Hyperframes. The skill describes itself as "narrow, opinionated, and fun" (source doc). It reads the project code directly; no live URL or screenshots are needed before planning starts.

## Invocation dispatch (must happen first)

The source doc orders a model check before anything else: if the running model is Claude Opus 5.5 and the invocation does not ask for the full workflow (`--full`, "use the full brag") or voiceover (`--voice`, which brag-slim does not do), the agent switches to the bundled brag-slim variant (`<skill-dir>/slim.md`) for the rest of the run. The switch is announced to the user in one line, with a path back ("Say 'use the full brag' to switch back"). Any other model, or an unknown model, skips the check and runs the full skill.

This is a deliberate tiering: the full skill is the deep workflow; brag-slim is the fast variant; `--voice` forces the full workflow because the slim variant does not do narration.

## Parsing the invocation

Before inspecting the project, the complete invocation is parsed. The source doc's flag table:

| Option | Values | Default |
|---|---|---|
| `--tone` | preset or freeform description | inferred |
| `--format` | `landscape`, `vertical`, `square` | `landscape` |
| `--duration` | seconds | auto (15-25s) |
| `--no-music` | flag | music on |
| `--no-sfx` | flag | sfx on |
| `--title` | string | inferred from project |
| `--voice` | flag | narration off |

Voice is strictly opt-in. When `--voice` is present, `voice.enabled = true` for that run only, narration happens through Kokoro via Hyperframes, and no provider-selection logic is added. The voice workflow is intentionally single-provider (source doc).

## Tone handling

Tone can be one of the 7 presets (`default`, `polished`, `yc-parody`, `chaotic`, `deadpan`, `cinematic`, `app-store`) or a freeform creative direction such as "fake Series A launch from 2016", "museum exhibit", or "overproduced mobile game ad" (source doc).

Freeform directions are not ignored: the skill maps them to the nearest preset for pacing and structure, then preserves the user's own direction in the plan and the composition brief. The preset supplies the mechanics; the user's words supply the intent.

## Output directory handling

By default output goes to `brag-output/`. A timestamped directory (`brag-output-YYYY-MM-DD-HHmmss/`) is used when the user asks for a new run without overwriting, or when a `brag-output/` directory already exists. The timestamp is generated once at the start of the run and used consistently for all paths in that run: plan, brief, composition, render, and share copy (source doc).

## What the invocation is not

The skill is not a generic video request handler. It is bound to the current project ("You built it. Now let's brag about it."), bound to Hyperframes as the rendering engine, and bound to a 15-25 second duration window unless the user gives a reason. Every default in the flag table exists to keep a run inside that envelope.

## Sources

- `yubi-OS/yubiOS/skills/brag/SKILL.md` (source doc, primary)
