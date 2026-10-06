# 05. The Hyperframes Handoff

Source doc: `yubi-OS/yubiOS/skills/brag/SKILL.md` (primary source of record), plus searXNG dig results on Hyperframes (jev-weighted below).

## The ownership split

Step 3 of `/brag` is a deliberate two-party contract. The source doc states it as a clean division:

- **/brag owns:** the product angle, source material, storyboard, tone, format, audio selection, music cue guidance, and delivery expectations.
- **Hyperframes owns:** the concrete composition structure, exact animation timing, animation mechanics, runtime choices, linting rules, and render workflow.

The split keeps `/brag` from becoming a video-engine skill: it decides what the video says and hands a brief to the engine that decides how the pixels move. It also means a `/brag` run needs the Hyperframes domain skills loaded (`hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`, `hyperframes-cli`) before composition starts.

## Not the generic Hyperframes workflow

The source doc forbids entering the `hyperframes` entry-point intent interview or routing into its generic promo/launch-video workflow. `/brag` is its own workflow layered on the domain skills. The practical consequence: when a `/brag` invocation loads Hyperframes tooling, it skips upstream's intake questions and goes straight to executing the `/brag`-authored brief.

## What Hyperframes is (dig-grounded)

Hyperframes is HeyGen's open-source tool for building videos by writing HTML and rendering it (jev weight 0.61: github.com/heygen-com/hyperframes, "Write HTML. Render video."). The official developer docs introduce it as a video-rendering system for agents (weight 0.71: developers.heygen.com/hyperframes-overview). CLI documentation covers command usage (weight 0.65: hyperframes.heygen.com/developers/cli; weight 0.60: hyperframes.heygen.com/packages/cli). The npm package exists under the name `hyperframes` (weight 0.42: npmjs.com/package/hyperframes, secondary source).

Unrelated products share the name and read low: hyperframes.app (weight 0.12) is an article-to-video web service and hyperframes.net (0.18) an AI video generator; hyperframes.dev (0.24, weak) appears in the dig results as a studio product. None of these are the tool `/brag` targets. Sources below 0.5 are labeled weak and used only for disambiguation, not for claims.

## The gate

**Gate:** `npx hyperframes check` passes with zero errors inside `<output-dir>/composition/`. The source doc calls this "the single browser gate before render" and defers the audit scope to the `hyperframes-cli` domain skill. It is the only executable quality gate in the pipeline between the storyboard and the render, which makes it the natural place where composition errors surface: lint-level problems fail here, cheaply, before any render time is spent.

## Composition brief to implementation

The agent writes the composition brief (carrying the `/brag`-owned decisions: angle, storyboard, tone, format, audio plan, cue guidance) and Hyperframes builds the implementation in `<output-dir>/composition/`. The brief is the interface between the two parties: everything `/brag` owns rides in it, and everything Hyperframes owns starts from it.

## Sources

- `yubi-OS/yubiOS/skills/brag/SKILL.md` (source doc, primary)
- https://github.com/heygen-com/hyperframes (jev 0.61, 0.68)
- https://developers.heygen.com/hyperframes-overview (jev 0.71)
- https://hyperframes.heygen.com/developers/cli (jev 0.65)
- https://hyperframes.heygen.com/packages/cli (jev 0.60)
- https://www.npmjs.com/package/hyperframes (jev 0.42, weak)
