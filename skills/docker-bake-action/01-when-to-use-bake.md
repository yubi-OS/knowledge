# When to use bake instead of build-push-action

Scope: when `docker/bake-action` is the right GitHub Actions primitive, when `build-push-action` is enough, and how yubiOS variant builds decide between them. Grounded in the source doc `yubi-OS/yubiOS skills/docker-bake-action/SKILL.md` plus weighted dig results.

## The core rule from the source doc

The source doc states the rule directly: build multiple images (standard + minimal + IoT variants, and so on) or multi-platform variants from a single declarative `docker-bake.hcl` file, and prefer bake over multiple `build-push-action` steps when you have 2+ targets (source doc). The trigger phrases in the skill description are: docker bake, bake-action, docker-bake.hcl, multi-target build, bake file, Bake workflow (source doc).

That rule exists because bake is a build orchestrator, not just a build command. Docker's own documentation describes bake as the tool for building multiple images defined in a file with one command, driven by a Bake file that lists targets, groups, and variables (https://docs.docker.com/build/bake/, jev weight 0.94). The buildx CLI reference frames `docker buildx bake` the same way: read a definition file, build the named targets or the default group (https://docs.docker.com/reference/cli/docker/buildx/bake/, jev weight 0.93).

## Why 2+ targets is the threshold

With one target, a single `build-push-action` step is simple and complete: it takes context, dockerfile, tags, and push flags in one place. The `docker/build-push-action` README documents exactly that single-target shape (https://github.com/docker/build-push-action, jev weight 0.48, weak backing: the repository page itself is authoritative but the dig weight fell below the 0.5 line, so treat this as contextual rather than load-bearing).

At 2 or more targets the balance shifts:

1. A matrix of N targets means N near-duplicate workflow steps, each repeating context, dockerfile, platform list, and tag spelling. A bake file declares those targets once.
2. Cache and attestation overrides can be applied to every target at once with the `*` wildcard in `set` (source doc, Key inputs table: `set` overrides any property, `*` = all targets).
3. BuildKit can share layers and cache across targets defined in the same bake file, which a chain of independent build steps cannot exploit as directly.

Docker's introduction to bake presents this grouping of related builds into one file as the primary workflow (https://docs.docker.com/build/bake/introduction, jev weight 0.94).

## The GitHub Marketplace entry point

The action is published as "Docker Buildx Bake" on the GitHub Marketplace (https://github.com/marketplace/actions/docker-buildx-bake, jev weight 0.54). The source doc pins the versioned usage `docker/bake-action@v5` (source doc, Action reference). The marketplace page is a mid-weight source: it confirms the canonical install path but its content is thin on semantics, so use it for discovery rather than as a behavioral reference.

## Where yubiOS lands

The source doc is explicit about the project's own usage: "For yubiOS: use bake when eventually building standard + minimal + IoT variants in one pipeline" (source doc, Notes). That maps directly onto the example bake file in the source doc, which defines a `default` group with targets `yubios` and `yubios-minimal`, where the minimal target inherits from the standard one and swaps in `Containerfile.minimal` (source doc).

The practical reading for yubiOS contributors:

- Today, when only one image variant ships per pipeline, `build-push-action` remains acceptable; the yubiOS org already uses it in the build lane (source doc context: the skill sits beside `docker-build-push-action` in the skills corpus).
- The moment a second variant (minimal, IoT, or a platform-split pair) joins the pipeline, the whole build should move to a `docker-bake.hcl` plus `bake-action` step, not accumulate a second `build-push-action` step. The source doc's threshold of 2+ targets is the decision line (source doc).
- Because bake targets are declarative data (see doc 03 on bake file authoring), the build matrix can be reviewed, linted, and overridden in CI the same way other declarative policy surfaces in yubiOS are.

## Anti-patterns the rule implies

Three failure modes follow from misapplying the rule:

1. Using bake for a single trivial target adds an HCL file and an indirection layer with no payoff. The source doc's threshold is the guard (source doc).
2. Using two `build-push-action` steps for two variants that share a base image loses cross-target cache and forces tag and label definitions to drift between steps (source doc's rationale for the 2+ rule, restated).
3. Forgetting that bake needs the same buildx setup as `build-push-action`: the source doc Notes say bake "Requires setup-buildx-action (same as build-push-action)" (source doc).

## Summary

Bake wins when the build matrix is a first-class concept: multiple variants, shared configuration, shared cache, and one declarative file to review. `build-push-action` wins for a single target with no matrix. The source doc fixes the threshold at 2+ targets and fixes yubiOS's direction: the standard + minimal + IoT variant pipeline should be one bake pipeline (source doc), which is exactly what the example `docker-bake.hcl` group/target layout in the source doc expresses.

Primary sources: source doc (`yubi-OS/yubiOS skills/docker-bake-action/SKILL.md`); https://docs.docker.com/build/bake/ (0.94); https://docs.docker.com/build/bake/introduction (0.94); https://docs.docker.com/reference/cli/docker/buildx/bake/ (0.93); https://github.com/marketplace/actions/docker-buildx-bake (0.54). Weak backing (< 0.5): https://github.com/docker/build-push-action (0.48).
