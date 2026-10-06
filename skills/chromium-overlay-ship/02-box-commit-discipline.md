# 02 - Box commit discipline

Scope: how the first step of every ship cycle commits on the box tree without contaminating the patch series. Explicit-path staging, per-command safe.directory handling, and explicit commit identity. This is an internal-record subtopic: all grounding is the source doc, no dig was run.

Source doc: yubi-OS/yubiOS skills/chromium-overlay-ship/SKILL.md (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/chromium-overlay-ship/SKILL.md). Claims marked "source doc" come from that file.

## Why commit discipline exists at all

The ship sequence starts with a box commit because everything downstream is derived from git state: the cumulative fixup diff is `git diff <prev-box-commit>..HEAD`, and the overlay patch is that diff rendered as a `.patch` file (source doc). A dirty or wrongly-scoped commit therefore poisons every later step silently.

## Never `git add .`

The rule is `git -c safe.directory=... add <explicit paths>` (source doc). The box tree is a working Chromium checkout where tooling strays live alongside real work: the source doc names `typescript.py`, `build_rust.py`, and untracked rust logs as examples that "live in the tree and must stay out" (source doc). A blanket `git add .` would sweep those into the commit, and then into the generated patch, and then into the overlay series that other consumers apply. Guideline 1 restates it as a standing rule: never `git add .` on the box tree; tooling strays must stay out of patches (source doc).

The practical reading: enumerate every file the change touched, stage exactly those, and stage nothing else. If a file is ambiguous, it does not go in.

## safe.directory per command

Root git operations on the tree need `git -c safe.directory=/home/ubuntu/chromium-build/src` PER COMMAND (source doc). Two reasons converge here, both from the source doc:

1. The checkout has dubious ownership from root's point of view, and modern git refuses to operate on repos whose owner differs from the invoking user unless the repo is explicitly marked safe.
2. The bridge runs HOME-less, which breaks `git config --global`, so the safe.directory marking cannot be persisted globally once and forgotten (source doc).

The consequence is mechanical: every single git invocation on the box carries the `-c safe.directory=...` flag inline. There is no state to rely on between calls.

## Explicit commit identity

Commits need explicit identity: `-c user.name=OMNI-AGENT -c user.email=foil-copy-overrate@duck.com` (source doc). This is the same HOME-less-bridge problem in a second costume: git normally reads user.name and user.email from the user's global config, which does not exist on this box, so a commit without the inline flags fails or commits with an unusable identity (source doc).

The identity itself is deliberate. The OMNI-AGENT name marks the commit as machine-authored, which keeps the provenance-gate branch history honest about who produced each change.

## What the commit must achieve

The commit is the anchor for patch generation (doc 03):

- For a fixup to the HEAD series member, the previous box commit sha becomes the base of the cumulative diff (source doc).
- For a new series member, the diff base is the series base commit `507c6ee3e2` (source doc).

So the commit must be complete (contain the whole logical change) and minimal (contain nothing else). A half-committed change produces a cumulative patch that misses the earlier half; an over-committed one ships tooling strays.

## Discipline summary

The source doc encodes this step in one line, and every clause of it exists because a failure already paid for it: explicit paths (never `git add .`), explicit safe.directory (dubious ownership, no global config), explicit identity (no global config, machine-attributed authorship) (source doc). Committing correctly here is what makes patch generation, overlay push, CI, and the Linear record downstream trustworthy.
