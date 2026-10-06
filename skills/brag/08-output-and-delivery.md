# 08. Output Directories, Poster Frame, and Share Copy

Source doc: `yubi-OS/yubiOS/skills/brag/SKILL.md` plus `references/step-4-deliver.md` (primary source of record). Internal-record subtopic, no dig.

## Output directory conventions

By default, everything a run produces goes to `brag-output/`. A timestamped directory (`brag-output-YYYY-MM-DD-HHmmss/`) is used in exactly two cases (source doc):

1. The user explicitly asks for a new run without overriding previous results.
2. A `brag-output/` directory already exists in the project.

The timestamp is generated once at the start of the run and used consistently for all output paths in that run: plan, brief, composition, render, and share copy. No mixed directories: one run, one root.

## The step-4 deliverables

Step 4 (validate, render, deliver) produces 4 artifacts, each with a gate condition:

| Artifact | Gate |
|---|---|
| `<output-dir>/brag.mp4` | exists |
| `<output-dir>/brag.jpg` | a best-frame poster, picked (not an arbitrary frame) |
| `brag.mp4` frame 0 | the poster, baked in, so it is the idle thumbnail everywhere |
| `<output-dir>/share-copy.txt` | written |

The poster-frame step is the one with a quality requirement attached: the frame is "picked (not an arbitrary frame)" and then baked as frame 0 of the mp4. Baking matters because platforms use frame 0 as the idle thumbnail; a random first frame wastes the video's best moment. The pick-then-bake order makes the thumbnail a deliberate choice rather than a byproduct of the encoder.

## Validation and preview before render

Step 4 begins after the `npx hyperframes check` gate passed (step 3). Within step 4 the agent validates and previews before the final render, then renders to `brag.mp4`. The pipeline's gate structure ends up with 4 executable/artifact gates across the run: the 9-question rubric (step 1), the storyboard duration sum (step 2), `hyperframes check` (step 3), and the deliverable files (step 4).

## Share copy

The run ends with `<output-dir>/share-copy.txt`: the text that accompanies the video when it is posted. The source doc treats share copy as a deliverable with its own gate, equal in standing to the render itself, which reflects the skill's purpose: the video exists to be shared, so the sharing text is part of the product, not an afterthought.

## The full artifact tree of one run

```
<output-dir>/
  brag-plan.md          (step 2: rubric + storyboard + music cue guidance)
  composition/          (step 3: Hyperframes implementation)
  brag.mp4              (step 4: render, poster baked as frame 0)
  brag.jpg              (step 4: picked best frame)
  share-copy.txt        (step 4)
```

## Sources

- `yubi-OS/yubiOS/skills/brag/SKILL.md` (source doc, primary)
- `yubi-OS/yubiOS/skills/brag/references/step-4-deliver.md` (referenced by the source doc)
