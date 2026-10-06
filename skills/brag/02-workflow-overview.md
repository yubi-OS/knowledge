# 02. Workflow Overview: the 5-Step Flow and Its Gates

Source doc: `yubi-OS/yubiOS/skills/brag/SKILL.md` (primary source of record). Internal-record subtopic, no dig.

`/brag` runs as 5 ordered steps. Each step names a reference file the agent must read, does bounded work, and ends at a hard gate. A run does not advance past a failed gate.

## Step 1: Inspect the project

Read: `references/step-1-inspect.md`. The agent scans the project directory and extracts what the plan needs.

**Gate:** the agent can answer all 9 questions in the brag planning rubric. This is the only gate expressed as an answerability condition rather than a file or exit code: if the project does not yield the rubric's answers, the run stops here rather than planning on guesses.

## Step 2: Plan and storyboard

Read: `references/step-2-plan.md`. The agent writes `<output-dir>/brag-plan.md`, answers the planning rubric, commits to a creative angle, and writes the beat-by-beat storyboard: scenes, text, timing, transitions, and SFX cues.

When music is selected, the plan gains a compact `Music cue guidance` section. If the bundled track ships a cue preset (under `<skill-dir>/assets/music/cues/`), the plan reads it; if not, the plan notes that cues will be detected at composition time (any track supports beat sync; see `references/audio.md`). Cue metadata is optional timing guidance only: story, readability, pacing, and product clarity stay primary (source doc).

**Gate:** `<output-dir>/brag-plan.md` exists with a full storyboard, and scene durations sum to 15-25 seconds. The duration bound is enforced mechanically at this gate, not left to taste.

## Step 3: Hand off to Hyperframes

Read: the Hyperframes domain skills (`hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`, `hyperframes-cli`), then `references/step-3-compose.md` and `references/audio.md`.

The agent writes the composition brief and uses Hyperframes to build the video implementation in `<output-dir>/composition/`. The ownership split is explicit (source doc):

- **/brag owns:** the product angle, source material, storyboard, tone, format, audio selection, music cue guidance, and delivery expectations.
- **Hyperframes owns:** the concrete composition structure, exact animation timing, animation mechanics, runtime choices, linting rules, and render workflow.

The skill also forbids entering the `hyperframes` entry-point intent interview or routing into its generic promo/launch-video workflow: `/brag` is its own workflow on top of the domain skills.

**Gate:** `npx hyperframes check` passes with zero errors inside `<output-dir>/composition/`. The source doc calls this the single browser gate before render; the `hyperframes-cli` domain skill defines what it audits.

## Step 4: Validate, render, and deliver

Read: `references/step-4-deliver.md`. The agent validates, previews, renders to `<output-dir>/brag.mp4`, picks the best poster frame into `<output-dir>/brag.jpg`, bakes that poster as the video's frame 0 so it is the idle thumbnail everywhere, and writes `<output-dir>/brag-share-copy.txt` (`<output-dir>/share-copy.txt`).

**Gate:** `brag.mp4` exists; the poster is a picked best frame (not an arbitrary one) and is baked as frame 0; share copy is written.

## The shape of the pipeline

Three of the four work steps end in an artifact gate (a file that must exist with required content) and two in an executable gate (`npx hyperframes check`). This makes the workflow auditable: at any pause, the state of the run is exactly which gates have fired. It also means the failure modes are enumerable: a run can fail at rubric-answering, at storyboard duration, at composition lint, or at the deliverable files, and each failure has one owning step.

## Sources

- `yubi-OS/yubiOS/skills/brag/SKILL.md` (source doc, primary)
