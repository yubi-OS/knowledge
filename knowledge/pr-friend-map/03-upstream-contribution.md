# 03 Upstream contribution: earning review from bootc, Fedora, and systemd

Scope: relationship-led participation in upstream projects, specifically bootc, the Fedora bootc documentation project, and systemd. The unit of work is a reproduction, a docs improvement, or one narrow technical question, never a product announcement.

## Why these upstreams are tier 1

bootc is the delivery model of an image-based OS campaign, so its maintainers are the natural reviewers of image-based OS assumptions. The Fedora documentation defines bootable containers as "transactional, in-place operating system updates using OCI/Docker container images", meaning OS updates ship as container images and the kernel and boot infrastructure travel with them (https://docs.fedoraproject.org/en-US/bootc/getting-started/, jev weight 0.9400). The bootc project site states that bootc is the key component in the broader mission of bootable containers (https://bootc.dev/bootc/, jev weight 0.8511). The Fedora/CentOS bootc project generates reference base images of bootable containers for use with bootc and is an open source project associated with the Fedora and CentOS projects (https://docs.fedoraproject.org/en-US/bootc/, jev weight 0.8914).

A community presentation deck documents the operational behaviors an image-based OS depends on: bootc upgrade downloads and stages an updated container image with automatic updates configurable through the bootc-fetch-apply-updates.timer, and bootc rollback rolls back to the previous state by discarding staged updates (https://www.cinlug.org/wp-content/uploads/2025/08/BootC-CINLUG.pdf, jev weight 0.2065, weak backing). These are exactly the surfaces where a nonstandard OS build will surface surprising behavior, and therefore exactly where reproductions are worth filing.

## Follow the upstream's own contribution contract

The single most important friend-making rule with systemd is to use its front door the way it asks. The systemd contributing policy states that the project welcomes contributions from everyone but asks contributors to follow its guidelines, and that GitHub Issues are used exclusively for tracking bugs and feature requests (https://systemd.io/CONTRIBUTING/, jev weight 0.9176). The same document, mirrored in the repository, adds that people looking for help should try their distribution's forums first or the systemd-devel mailing list for general questions (https://github.com/systemd/systemd/blob/master/docs/CONTRIBUTING.md, jev weight 0.8349). The project describes itself as a suite of basic building blocks for a Linux system (https://systemd.io/, jev weight 0.7424).

The practical translation for a pre-launch OS project: a homed, cryptenroll, or FIDO2-unlock behavior question is not a bug, so it does not belong in the systemd issue tracker. It belongs on systemd-devel or in a discussion venue, phrased as "is this the intended boundary between FIDO2 unlock and measured boot", with repro steps and the current systemd version attached. A reproducible misbehavior is a different artifact: that one is a proper issue.

Generic GitHub guidance reinforces that contribution guidelines should be discoverable in the repository so contributors meet the project's expectations before opening a pull request or issue (https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors, jev weight 0.3172, weak backing). The inverse also holds: read the upstream's guidelines before its maintainers have to explain them.

## bootc's invitation is explicit

The bootc project invites development participation directly: "Are you interested in working on bootc? Great! Reference our contribution guide", and points to a maintainers list, governance reference, and code of conduct; it is a Cloud Native Computing Foundation project (https://bootc.dev/, jev weight 0.7970). The repository itself is at https://github.com/bootc-dev/bootc (jev weight 0.7974).

That explicitness changes the first-touch calculus. For bootc, filing a docs improvement or a narrow install-UX question through the contribution guide is a normal act. For systemd, the same act must be routed through the mailing-list-or-issue distinction. Neither upstream owes the project attention, and the first contribution should be one the upstream can merge or answer without learning anything about the downstream project's brand.

## The contribution ladder

1. Publish findings the upstream can use on its own terms: a failure mode writeup with versions, commands, and logs.
2. File the smallest artifact that stands alone: a reproduction with a minimal case, or a docs PR that fixes a real confusion the project hit.
3. Ask one review question at a time, linked to evidence: "does this usage or failure mode look upstream-relevant?"
4. Accept redirection gracefully. If the upstream says the question belongs elsewhere, move it and say so.

The success signal is upstreams responding to the substance. If the first responses are about the project rather than the technical content, the ask was too broad or too promotional, and the next touch should be smaller.
