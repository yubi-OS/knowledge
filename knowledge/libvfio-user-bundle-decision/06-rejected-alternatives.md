# Rejected Alternatives

Scope: The alternatives that lost and why: keeping the per-runner build (V2), the hybrid AMD64-bundle plus ARM64-per-runner split (V3), bundling through bcvk's image model (V5), forking libvfio-user, bundling into the production image, and replacing meson/ninja.

## V2: keep the per-runner build (score 13, dropped)

V2 scored 13 of 20 on the constraint-removal lens, the highest raw score in the exercise, and was still dropped. The reason: it does not address the question. The review was opened because the per-runner build pays a repeat-build cost on every run; keeping it preserves exactly that cost. A high score on the wrong lens is not a decision.

## V3: hybrid AMD64-bundle plus ARM64-per-runner (score 11, dropped)

V3 bundles for one architecture and keeps the per-runner build for the other. It scored 11 on the audience-shift lens and was dropped for complicating the build without proportionate gain.

The underlying reality is real and worth naming: software compiled into artifacts must function on the operating system and processor architecture it was built for, and it is almost impossible to execute an application on a platform other than the one it was designed for, which is why multi-platform builds are a common practice for releases (https://circleci.com/blog/building-docker-images-for-multiple-os-architectures/, jev weight 0.68). V3 accepts that complexity for half the fleet and rejects it for the other half, which means every contributor has to understand two build paths and the workflow has two success criteria. The decision record's verdict is that the split complicates without proportionate gain: libvfio-user's build is short enough (roughly 30 to 60 seconds on the decision record's estimate) that architecture-splitting its caching strategy is optimization of the wrong thing.

## V5: bundle via bcvk's image model (score 9, dropped)

V5 is the inversion lens: instead of yubiOS publishing its own artifact, route the bundle through bcvk's existing image machinery. It scored lowest (9) and was dropped as scope creep into bcvk. The judgment is structural: the decision under review is about how yubiOS distributes one CI tool. bcvk's image model exists to serve bcvk's own purpose (ephemeral VM testing and disk imaging). Making one depend on the other couples two subsystems that evolve on different schedules, and any change to bcvk's model becomes a change in how libvfio-user is distributed.

## Three refusals outside the variation set

The decision record separately declines three moves that did not even need scoring:

- Forking libvfio-user. The combination of BSD-3-Clause licensing and low upstream commit cadence means owning the upstream buys nothing. Vendoring with a pinned commit SHA is the right model. The pinning discipline is independently grounded in supply-chain security practice: guidance following real supply-chain incidents recommends pinning dependencies to verified commit SHAs rather than floating version tags (https://oversightinstitute.org/blog/should-you-pin-every-ci-cd-dependency-to-a-sha, jev weight 0.66), and GitHub now supports organization-level policies that make SHA pinning mandatory (https://www.romainlespinasse.dev/posts/github-actions-commit-sha-pinning/, jev weight 0.65).
- Bundling libvfio-user into the production yubiOS image. libvfio-user is a CI-time tool, not a runtime component of the OS. Bundling it into production would violate the ADR-022 per-artifact distribution intent and bloat the product image with a build tool.
- Replacing meson/ninja with a different build system. The build system belongs to upstream. yubiOS's leverage point is where and when the build runs, not how the build is defined.

## The pattern across the rejections

Every rejection has the same shape: the alternative adds a surface, a coupling, or a second path, and pays that cost without removing the constraint the exercise was actually about. V2 keeps the cost. V3 adds a second path. V5 adds a cross-subsystem coupling. A fork adds maintenance ownership. Production bundling adds a distribution violation. Build-system replacement adds upstream divergence. The two survivors, V4 and V1, are the only options that either cost nothing (V4) or buy something the org already wants under its existing ADR-022 pattern (V1).

That pattern is the reusable lesson from this decision record: when scoring build-strategy variations, first eliminate any option that adds a maintenance surface without addressing the motivating cost, then choose between the survivors on data rather than debate. The two-step adoption ordering exists precisely so the survivor choice is made with hit-rate measurements rather than taste.
