# 09 - Version tracking ledger

**Scope.** Tracking tool-tree versions over time: recording old-to-new transitions, changelog and ledger discipline, and auditing which tool versions produced which images.

## What a ledger entry must capture

The yubiOS refresh workflow requires the pin change to land in one commit with the old and new digests noted in the commit message (yubiOS refs plan doc, source of this corpus). Combined with doc 04's checklist, each transition therefore produces a durable record of: the previous digest, the new digest, the review that gated it, and the commit that carried it. That record is what makes it possible to later answer which tool versions produced which images.

The provenance literature defines the target state: a build provenance record is the verifiable metadata trail that proves which inputs, tools, and environments produced a given software artifact and how to reproduce or validate it ([devsecopsschool.com/blog/build-provenance/](http://devsecopsschool.com/blog/build-provenance/), jev weight 0.23, weak source), and SLSA build provenance is a signed attestation that records how a software artifact was built, including the source repository, build instructions, dependencies, and build environment ([cybersecurity101.net/glossary/slsa-build-provenance/](https://cybersecurity101.net/glossary/slsa-build-provenance/), jev weight 0.31, weak source). The tools-tree ledger is the human-auditable layer under those signed attestations.

## Changelog discipline for digest transitions

Automation gives the ledger a natural cadence. Renovate exposes fetch_change_logs to configure changelog and release-notes fetching as part of its update flow ([docs.renovatebot.com/configuration-options/](https://docs.renovatebot.com/configuration-options/), jev weight 0.88, authoritative), its Docker manager supports Debian codenames and rolling update schedules when resolving package-source updates ([docs.renovatebot.com/docker/](https://docs.renovatebot.com/docker/), jev weight 0.83, authoritative), and templated changelogUrl functionality exists to provide actionable changelogs specifically for digest updates ([www.jvt.me/posts/2025/05/08/renovate-digest-changelog/](https://www.jvt.me/posts/2025/05/08/renovate-digest-changelog/), jev weight 0.76, authoritative). The last point matters for a digest-pinned tools tree: a digest bump is meaningless to a reader unless the PR links to what actually changed upstream between the two digests.

For the record format itself, annotation-driven change tracking is one established pattern: the minimal annotation required for change tracking is @changelog on elements, with additional identifiers or labels added to obtain more human-readable change records ([github.com/cap-js/change-tracking](https://github.com/cap-js/change-tracking), jev weight 0.78, authoritative). An analogous convention for a pin ledger is a fixed set of fields per row, ref, old digest, new digest, gate result, commit, so that tooling can validate and diff the history. Dependency-Track's own changelog shows a project-level versioned changelog as a maintained, browsable record ([docs.dependencytrack.org/changelog/](https://docs.dependencytrack.org/changelog/), jev weight 0.62, authoritative).

## The mkosi-side version dimension

The tools tree has two version axes to track, and doc 01 established both: the tools-tree source version (ToolsTreeDistribution and ToolsTreeRelease, for example fedora 42, [github.com/systemd/mkosi/issues/3990](https://github.com/systemd/mkosi/issues/3990), jev weight 0.87, authoritative) and the mkosi version itself, which determines default tools-tree behavior including incremental reuse ([newreleases.io/project/github/systemd/mkosi/release/v23](https://newreleases.io/project/github/systemd/mkosi/release/v23), jev weight 0.13, weak source). A ledger that records only the digest misses the second axis; a ledger that records only the version misses the digest that actually defines the image.

## Auditing back from images

The end state the ledger enables: for any built image, walk from its provenance or build record to the tools-tree commit, read the digests recorded there, and know exactly which tool environment produced it. Weak-source evidence confirms this is the standard framing: provenance records which tools and environments produced an artifact ([devsecopsschool.com](http://devsecopsschool.com/blog/build-provenance/), jev weight 0.23, weak source), and artifact-provenance tooling records the build steps, commands, and versions, that created an artifact ([github.com/ShadowStrikeHQ/ai-artifact-provenance-recorder](https://github.com/ShadowStrikeHQ/ai-artifact-provenance-recorder), jev weight 0.33, weak source).

## Bottom line

Track both axes, digest and tool version, record every transition as one commit with both digests, link each bump to the upstream changelog, and keep the ledger as the auditable layer beneath the signed provenance. That closes the loop the corpus started: a pinned, managed tool environment whose versions are known, whose changes are gated, and whose history can be read back.
