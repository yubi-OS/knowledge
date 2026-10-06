# 01 - Environment facts: the HIGH-MEM box runtime

Scope: the runtime environment the ship pipeline assumes. The ubuntu HIGH-MEM box and its shell bridge, the Chromium tree and its branch, the overlay repo and its CI workflow, the gn binary the tree actually builds with, and the build classes that decide whether a change needs a full relink or only a repack.

## The shell bridge

The bridge is a single HTTP endpoint on the box: POST a JSON body of the form `{"command":["bash","-c","..."]}` to `https://ubuntu.tail3a04f5.ts.net/run`, using the connection `conn_ai5iXWquRX0s` so the proxy injects auth (source doc: yubi-OS/yubiOS skills/chromium-overlay-ship/SKILL.md). Three properties of that bridge drive most of the pipeline's discipline:

1. It is SINGLE-THREADED and runs as root. A long command (a build, a chrome launch) wedges every other call behind it (source doc). The pattern is therefore: run detached (`nohup ... > /tmp/<log>.log 2>&1 &`) and poll the log file on later calls.
2. A launch call that times out with curl error 28 may still have executed on the box (source doc). The rule: check state before retrying, never blindly re-run.
3. The bridge session is HOME-less, which breaks `git config --global` (source doc). This is why git identity and safe.directory handling are done per command (see doc 02).

## The tree, the branch, and the overlay

- Working tree: `/home/ubuntu/chromium-build/src`, branch `provenance-gate` (source doc).
- Overlay repo: `yubi-OS/chromium-provenance`, holding `patches/NNNN-*.patch` plus `patches/SERIES.md` (source doc).
- Series base commit: `507c6ee3e2` (source doc). All new-member diffs are computed against this commit.
- CI: the `arm64-chromium-build.yml` workflow builds content_shell on a HIGH-MEM self-hosted runner (source doc).

## gn on the box

The working gn binary is `/home/ubuntu/chromium-build/gn-cipd/gn` (source doc). Two traps the source doc encodes: the depot_tools gn wrapper needs a python3 bootstrap this checkout never ran, and `ninja ... gn` is not a real target (ninja answers "did you mean 'gin'?"). The build.ninja regen rule and the CI workflow both use gn-cipd.

GN itself is Chromium's meta-build system: it generates Ninja files from `BUILD.gn` and `.gni` targets. The Chromium project documents GN configuration at https://www.chromium.org/developers/gn-build-configuration/ (weight 0.91) and the GN quick start at https://chromium.googlesource.com/chromium/src/tools/gn/+/48062805e19b4697c5fbd926dc649c78 (weight 0.89). The `is_component_build` argument the source doc relies on is one of those standard GN build arguments: component builds link faster for iteration, release builds do not (source doc; documented at https://www.chromium.org/developers/gn-build-configuration/, weight 0.91).

## Build classes: relink vs repack

The source doc's build-class table decides what a change costs:

- C++ code, vector icons, or binary-asset changes: a chrome relink is required (source doc).
- grd-only changes: only the locale-pak repack is needed; a chrome restart suffices (source doc).
- webui image or SVG changes: repack webui resources_grit plus resources.pak; a restart suffices (source doc).

The repack machinery is GRIT, Chromium's resource compiler. The GRIT user's guide at https://www.chromium.org/developers/tools-we-use-in-chromium/grit/grit-users-guide/ (weight 0.92) documents how grd resources compile into pak files. Locale pak generation is wired by `chrome_repack_locales.gni` at https://chromium.googlesource.com/chromium/src/+/main/chrome/chrome_repack_locales.gni (weight 0.88), which shows the locale repack is a separate GN target from the main binary link. That split is what lets a grd-only change skip the relink (source doc's class table; repack target structure: https://chromium.googlesource.com/chromium/src/+/main/chrome/chrome_repack_locales.gni, weight 0.88).

Note the interplay with the failure mode documented in doc 08: a repack-only path is also the path where ninja's mtime logic can silently skip the repack when restored assets carry older mtimes than the pak output (source doc).

## Release-grade vs dev builds

Release-grade builds go in a SEPARATE out directory, for example `out/arm64-release` with `is_component_build = false`, while the dev out dir `out/arm64-qual` stays component-build for fast iteration (source doc). Keeping the two apart means the release build is never contaminated by component-build assumptions and the dev loop is never slowed by a full release link (source doc).

## Why these facts are load-bearing

Every step of the ship sequence assumes them: the bridge contract shapes chunked patch transfer (doc 03) and the single-thread wedge avoidance; the tree and base commit anchor patch generation; the build classes decide what CI will actually exercise after the push; and the gn-cipd path is the only gn that works, so any rebuild instruction that names plain `gn` on the box is wrong (source doc).
