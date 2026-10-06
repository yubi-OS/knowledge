# 04. Creative Laws

Source doc: `yubi-OS/yubiOS/skills/brag/SKILL.md` (primary source of record). Internal-record subtopic, no dig.

The source doc defines 8 creative laws that apply to every brag video regardless of tone. They are the tone-independent floor of quality: the 7 presets change energy and pacing, the laws do not move.

## The laws

**Short.** 15-25 seconds. "Not one second more without a reason." The source doc explicitly extends this to narrated runs: narration does not extend the window. The `--duration` flag exists, but the default is auto, and the step-2 gate enforces the sum mechanically.

**Readable.** Keep the pace high through motion and cuts, never by flashing text. The source doc gives concrete hold times: a short label the viewer must read holds ~0.8s settled; a sentence holds ~0.3s per word. The rhythm rule is "fast-in, then hold — never fast-in, then gone." These are the only two numeric readability budgets in the skill, and they exist because a 15-25 second video cannot afford a second viewing.

**Specific.** The video must feel like it was made for this exact project, not any project. This is why step 1 inspects the project code first and why the planning rubric has 9 questions: the specifics come from reading the app, not from a template.

**Show the thing.** At least one scene must display actual UI, copy, or a key visual from the product. "No abstract filler." This law anchors the video to evidence; a brag video without the product is an ad for nothing.

**No generic SaaS language.** "Streamline your workflow" is banned. The video uses the project's actual copy and claims. This pairs with "Specific": the ban is on vocabulary that would fit any product, because such vocabulary is how a project video becomes generic.

**The hook is everything.** The first 2 seconds determine whether someone keeps watching. The source doc orders the hook planned "before anything else" in step 2.

**Funny earns its place.** Humor should come from the project's absurdity, not from trying to be funny. This is the same discipline as the specificity law applied to jokes: the material is the project.

## The scene pattern

```
Hook (2-3s) -> Reveal (2-4s) -> 2-3 sharp highlights (5-12s) -> Punchline/outro (2-4s)
```

The source doc is explicit that this pattern is a starting shape, not a template: "Adapt this. Not every project needs exactly 3 highlights." The pattern's arithmetic stays inside the duration law: the segments as given span 11-23 seconds, which is why the 15-25s window and the pattern are consistent rather than competing constraints.

## How the laws interact with the gates

The laws are not enforced by an executable gate; they are enforced by the plan (step 2) and the storyboard's scene-duration sum. A plan that violates "Short" fails the step-2 gate directly. A plan that violates "Readable" or "Specific" fails at review time because the storyboard is where text and timing become visible. The executable gates (`hyperframes check`, deliverable files) catch mechanical failures; the laws catch creative ones earlier, at the storyboard stage, where they are cheapest to fix.

## Sources

- `yubi-OS/yubiOS/skills/brag/SKILL.md` (source doc, primary)
