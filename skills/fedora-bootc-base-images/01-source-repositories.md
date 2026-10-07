# 01 - Source repositories and published images

Scope: where the Fedora and CentOS Stream bootc base images are developed, which branches hold the real image definitions, and which registry references the published images live under.

The ground source for this corpus is `yubi-OS/yubiOS skills/fedora-bootc-base-images/SKILL.md`. This doc explicates the source repositories section of that skill.

## The two projects behind the images

The Fedora/CentOS bootc project generates reference "base images" of bootable containers designed for use with the bootc project. The project describes itself as an open source effort associated with both the Fedora Project and the CentOS Project (https://docs.fedoraproject.org/en-US/bootc/, jev weight 0.93). Bootable containers themselves are defined by the bootc project as "transactional, in-place operating system updates using OCI/Docker container images", where the kernel, bootloader, and drivers are all part of the container image so that the image is bootable (https://docs.fedoraproject.org/en-US/bootc/getting-started/, jev weight 0.94; https://www.cncf.io/projects/bootc/, jev weight 0.60).

## Source doc repository map

The source doc gives a 3 row repository map, quoted here as the skill's record (source doc):

| Distro | GitLab | Published image |
|---|---|---|
| Fedora | https://gitlab.com/fedora/bootc/base-images | `quay.io/fedora/fedora-bootc:{version}` |
| CentOS Stream 9 | https://gitlab.com/redhat/centos-stream/containers/bootc (c9s branch) | `quay.io/centos-bootc/centos-bootc:stream9` |
| CentOS Stream 10 | https://gitlab.com/redhat/centos-stream/containers/bootc (c10s branch) | `quay.io/centos-bootc/centos-bootc:stream10` |

Two details in that table are load bearing for anyone deriving an OS from these images:

1. Version tags on the Fedora image are version scoped, `fedora-bootc:{version}`, not `latest`. A consumer pins to a specific version tag plus digest.
2. The CentOS Stream repo does not publish its real content on `main`. The source doc states that the CentOS repo's `main` branch is a redirect shell and that the real image definitions live in the `c9s` and `c10s` branches (source doc).

## Confirming the CentOS repo location

The dig confirmed the source doc's CentOS repository path from a second direction. The `CentOS/centos-bootc` repository on GitHub carries the note that it is "archived in favor of gitlab.com/redhat/centos-stream/containers/bootc" (https://github.com/CentOS/centos-bootc, jev weight 0.77). So the historical GitHub home of centos-bootc now points at the same GitLab path the source doc uses, and the GitHub mirror should be treated as dead. Any tooling that still pulls from `github.com/CentOS/centos-bootc` is reading an archived repo.

## The Fedora base-images repo

The Fedora side lives at https://gitlab.com/fedora/bootc/base-images (source doc; the repo URL itself carries jev weight 0.76). The source doc also lists this URL in its Source references block, together with the project docs hub at https://fedora.gitlab.io/bootc/docs/bootc/base-images/, the CentOS repo, and https://bootc.dev/bootc/bootc-images.html (source doc).

## What "reference base images" means for consumers

The Fedora docs hub page frames the images as reference points rather than products you fork wholesale: the Fedora/CentOS bootc project generates reference "base images" of bootable containers (https://docs.fedoraproject.org/en-US/bootc/, jev weight 0.93). For yubiOS the practical reading, per the source doc, is that yubiOS derives from the Fedora image and treats the upstream repo as the source of record for what lands in each build, not as a codebase to mirror.

## Drift note

The dig did not surface any source contradicting the source doc's repository map. The one dated correction worth recording is the GitHub archive note above: the source doc never mentions `github.com/CentOS/centos-bootc`, so there is no conflict, but the archived GitHub repo is a live example of how easily a consumer can end up tracking a stale mirror of the real GitLab source.
