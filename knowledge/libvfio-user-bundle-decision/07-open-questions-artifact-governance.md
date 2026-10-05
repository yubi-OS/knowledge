# Open Questions and Artifact Governance

Scope: The open questions OQ1 through OQ3 governing the bundle: where the artifact tag lives (new tag versus piggyback), who refreshes the tag on a libvfio-user bump, and whether a separate smoke-test workflow is needed.

## OQ1: where does the OCI artifact live?

Two options were on the table (decision record, yubi-OS/yubiOS refs/libvfio-user-bundle-decision-2026-07-30.md, Linear OMN-100):

- 0mniteck/yubios:libvfio-user-<sha>: a new tag dedicated to this artifact.
- Piggybacking on 0mniteck/yubios:firmware-qemu-arm64: an existing tag that would mix purposes.

The default-first answer is the new tag, because it is cleaner under ADR-022's per-artifact model. The technical backdrop favors the same answer: a tag is mutable by design, since re-pointing a tag is a single push where the registry writes a new entry in its tag index (https://runbook.academy/courses/docker/lessons/docker-immutable-digests/, jev weight 0.56), while the digest is the content-addressed identity, a SHA-256 value that can be pulled directly (https://docs.docker.com/dhi/explore/security-concepts/digests/, jev weight 0.97). Mixing a libvfio-user artifact into a firmware tag would mean two unrelated artifact types share one mutable pointer, and any consumer resolving the tag would have to disambiguate by manifest inspection. A dedicated per-artifact tag keeps the pointer and the artifact one-to-one.

A weakly backed but consistent industry view supports the same conclusion: overcoming Docker's mutable image tags is a recognized problem, with digest pinning the standard mitigation (https://www.mend.io/blog/overcoming-dockers-mutable-image-tags/, jev weight 0.48, weak backing).

## OQ2: who maintains the :libvfio-user-<sha> tag?

The question: when a yubiOS contributor pins a new libvfio-user commit, who refreshes the tag? The default-first answer is the contributor who opens the PR for the libvfio-user bump also refreshes the tag. No separate maintainer role is created; the tag is refreshed per use.

This has two properties worth making explicit:

- Ownership stays local. The person changing the pin is by definition the person who knows the new commit SHA, so refreshing the tag in the same PR is the lowest-information-loss moment to do it. A separate maintainer would add a handoff and a delay between pin and artifact.
- The governance cost scales with bump frequency, which is low. libvfio-user's low upstream commit cadence (recorded in the decision record as part of why forking buys nothing) means tag refreshes are rare events attached to explicit, reviewed changes, not ambient maintenance work.

The alternative model, a standing maintainer who rebuilds artifacts on upstream changes, would invert this: upstream activity would trigger work regardless of whether yubiOS wants to move. The per-use model ties artifact refresh strictly to yubiOS's own adoption decisions.

## OQ3: does the artifact need its own smoke test?

The question: does the libvfio-user artifact need a smoke test of its own, separate from ci_test-vgpu-vm.yml, or is the existing check sufficient? The default-first answer: the workflow-side smoke check, a staged binary opening a socket, is sufficient; no separate test workflow for v1.

This is a proportionality judgment. The purpose of a smoke test is to answer one question quickly: does the shipped thing start and do the most basic thing at all? For a scratch-rootfs artifact containing a binary and samples, the minimal honest check is exactly what the record describes: stage the binary from the image and confirm it opens a socket. That check already lives inside the consuming workflow, which means every run of ci_test-vgpu-vm.yml re-verifies the artifact in the exact environment that uses it.

General CI guidance treats smoke tests as the fast first gate that follows a build through the pipeline (https://circleci.com/blog/smoke-tests-in-cicd-pipelines/, jev weight 0.47, weak backing), which is the role the socket check already plays here. A dedicated test workflow would duplicate that gate out of context, add a second CI surface with its own maintenance cost, and only pay off if the artifact had consumers beyond the one workflow. At v1 it does not.

## How the three answers interact

The three defaults compose into a coherent governance story: a dedicated tag (OQ1) means the artifact has a stable identity; per-use refresh by the bumping contributor (OQ2) means the identity is always current with the pin it names; and the workflow-side smoke check (OQ3) means every consumption of that identity is verified in place. Nothing in the three answers requires a new role, a new workflow, or a new registry convention beyond what ADR-022 already establishes.

Two residual risks are visible and accepted. First, the tag-refresh step is enforced only by the PR process; a contributor could bump the pin without refreshing the artifact, and CI would keep consuming the stale digest until someone notices. Second, the socket smoke check verifies startup, not protocol correctness; a broken build that fails to open a socket is caught, a subtly wrong device emulation is not. Both risks are the accepted price of the default-first posture, and both become cheaper to revisit once Step 1's cache hit-rate data decides whether the artifact even exists.
