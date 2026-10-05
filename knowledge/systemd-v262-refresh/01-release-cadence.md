# 01 Release cadence: v262 RC state, the stable line, and backport branches

Scope: the release state of systemd around v262 (rc2 shipped 2026-09-13 refresh date), the stable v261 line and its point releases, the vNNN-stable backport branches, and what the dig found about v262 stable status as of 2026-10-05.

## What the 2026-09-13 refresh recorded

The source doc recorded that v262 was still not stable as of 2026-09-13: `v262-rc2` shipped 2026-09-08, the stable line remained v261 with point release `v261.3` (2026-09-10), and backport releases v260.5, v259.9, and v258.11 all landed 2026-09-10/11 (source doc: `refs/systemd-v262-refresh-2026-09-13.md`). It also recorded that no v262 stable and no Poettering "stories" series had appeared at that date.

## What the GitHub releases page shows

The systemd GitHub releases page lists `v262-rc2` as a pre-release and `systemd-stable v261.3` as the most recent stable point release in the dig snapshot (source: https://github.com/systemd/systemd/releases, jev weight 0.96). The release page shows the rc2 tag published by github-actions roughly one month before the dig date, consistent with the 2026-09-08 rc2 date in the source doc.

## The backport branch model

The systemd project maintains stable point-update branches alongside main: the repo carries a number of `vNNN-stable` branches, and stable releases are tagged `vNNN.X` on those branches. Distributions usually prefer these stable branches (source: https://systemd.io/BACKPORTS/, jev weight 0.83). A separate repository, `systemd/systemd-stable`, exists specifically for backports of patches for stable versions older than 256 (source: https://github.com/systemd/systemd-stable/releases, jev weight 0.87).

The release process documentation states the stable-release procedure: backport at least the commits from all PRs tagged `needs-stable-backport` using `git cherry-pick -x`, and commits fixing bugs or changing documentation, tests, CI, or mkosi can generally also be backported; this policy applies since release 256 (source: https://systemd.io/RELEASE/, jev weight 0.60).

## Update since the refresh: v262 stable has shipped

The dig, run 2026-10-05, surfaced three independent secondary sources reporting that v262 stable has been released:

1. An LWN article titled "Systemd v262 released" summarizing notable features including the ability to build systemd as a single statically linked binary for small containers, support for the kernel coredump socket protocol introduced with Linux 6.17, and OpenSSL 4 support (source: https://lwn.net/Articles/1096204/, jev weight 0.88).
2. A LinuxJournal report stating the final release was tagged on September 22, 2026, following three release candidates earlier in the month (source: https://www.linuxjournal.com/content/systemd-262-released-static-pid-1-intel-tdx-tpm-improvements-and-new-container-features, jev weight 0.69).
3. A linuxcompatible.org story reporting the 262 release with hardware-rooted security and live updates themes (source: https://www.linuxcompatible.org/story/systemd-262-release-hardwarerooted-security-and-live-updates/, jev weight 0.27; weak backing, aggregator-grade).

Caveat on the specific date: the September 22, 2026 tagging date rests on the LinuxJournal article (weight 0.69), not on a primary tag captured in the dig snippets; the GitHub releases page snippet captured in the dig showed the rc2 pre-release and v261.3 but did not show a `v262` stable tag in its excerpt. The release fact itself (v262 stable shipped) is corroborated at weight 0.88 by LWN; the exact date should be re-verified against the GitHub tag before being cited elsewhere.

## Earlier coverage of rc2, weakly backed

Two rc2-era secondary articles exist but carry weak weights: a linuxcompatible story on rc2 with zero-downtime kernel updates and Varlink IPC expansion (https://www.linuxcompatible.org/story/systemd-v262-rc2-drops-with-zerodowntime-kernel-updates-and-varlink-ipc-expansion/, jev weight 0.15, weak backing) and a BetaNews piece dated September 8, 2026 describing an "AI canary" inside AGENTS.md that flags AI-generated code merged without human review (https://betanews.com/article/systemd-262-rc2-ai-canary/, jev weight 0.19, weak backing). These are recorded for completeness, not as authoritative backing.

## Standing takeaway for an image-based OS consumer

The refresh cadence the source doc set ("next trigger: v262 stable release or the Poettering v262 stories series") has now fired on its first condition: v262 stable appears to have shipped between 2026-09-13 and 2026-10-05. An image-based OS consumer tracking systemd should plan a v262-stable-based refresh, and the tracking note in the 0pointer vision doc ("v262 Mastodon stories will start in a few weeks") remains unfulfilled in the dig results; no stories series was observed.
