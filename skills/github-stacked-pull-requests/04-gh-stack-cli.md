# CLI extension: github/gh-stack

Scope: the `gh-stack` GitHub CLI extension that carries the day-to-day stack mechanics: install, layer creation, inspection, submission, merge, and sync, plus its exposure to coding agents.

Grounding spine: source doc `yubi-OS/yubiOS skills/github-stacked-pull-requests/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/github-stacked-pull-requests/SKILL.md). Claims marked "source doc" come from that file.

## Install

Source doc: install once with `gh extension install github/gh-stack`. The GitHub Docs CLI reference (https://docs.github.com/en/pull-requests/reference/stacked-prs-cli-commands, weight 0.96) confirms the extension shape: "The gh stack extension for GitHub CLI creates and manages stacks of pull requests from your local repository." Everything the extension does starts from the local checkout; there is no web-only authoring path for the stack structure.

## The command surface

The source doc's command map, with the purpose each command serves:

1. `gh stack create feat/example`: create a stack, the first layer, from a clean `main`.
2. `gh stack branch pr-1-fix-foo` and `gh stack branch pr-2-fix-bar`: add a layer on top of the previous one. The branch names in the source doc's own example encode the layer number and the concern (`pr-1-fix-foo`), which the red-flags section holds up as the naming standard.
3. `gh stack ls`: list all layers.
4. `gh stack log`: show the stack map in the terminal, the same structure the web UI renders at the top of each PR.
5. `gh stack status`: which layers are ready, open, or merged. This is the pre-merge gate command in the source doc's verification checklist.
6. `gh stack submit`: open a PR for each layer with the base set to the layer below.
7. `gh stack merge`: merge the top ready layer plus every unmerged layer below it.
8. `gh stack merge pr-2`: partial landing, merge up through `pr-2`; PRs above rebase and retarget.
9. `gh stack sync`: sync the stack with its base when the base moved.

## Submit versus sync, per GitHub Docs

The CLI reference (https://docs.github.com/en/pull-requests/reference/stacked-prs-cli-commands, weight 0.96) draws the distinction the source doc leaves implicit: recreate the stack with `gh stack submit`, running `gh stack modify` first if you want to change its structure. That is the way to make GitHub match your local stack, because submit, unlike sync, also creates pull requests for the layers. So the operational reading is: `sync` reconciles branch topology after the base moved, `submit` pushes the whole local structure to GitHub including the PR objects, and `modify` is the structure editor that runs before a resubmit.

## What the extension does not own

Source doc: the extension keeps the branch topology honest while the agent edits layer files; it is not a review tool, a merge-policy tool, or a CI tool. Branch protections, required reviews, and required checks are evaluated per PR by GitHub itself (see 03-mechanics.md), and the merge decision belongs to the yubiOS merge authority (see 06-branch-hygiene.md).

## Agent exposure

Source doc: the extension also exposes stack context to the coding-agent world. The `gh-stack` skill on github.com gives GitHub Copilot, and any agent that reads the skill, the same primitives. The mental model stated in the source doc: the agent edits layer files, the extension keeps the branch topology honest.

A third-party agent guide (https://agentpedia.codes/blog/github-stacked-pull-requests-gh-stack-agent-guide, weight 0.18, weak backing, labeled as such) describes the same surface: create, submit, sync, review, and merge dependency-ordered PRs with GitHub's gh-stack CLI and coding-agent skill. Treat it as corroboration only; the source doc and the GitHub Docs CLI reference are the authorities here.

## yubiOS workflow fit

Source doc places the extension inside the yubiOS stack: the `github-api` skill's Git Data API pattern is the canonical write path for the post-merge rebase and PINNED.md update steps that follow a cross-fork stack landing (see 05-yubios-mapping.md). The CLI handles interactive layer authoring; the API handles the scripted post-merge bookkeeping.
